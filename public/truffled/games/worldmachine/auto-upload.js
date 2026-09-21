(function () {
  const manifestUrl = "asset-manifest.json";
  const storageFolderName = "OneSht5";
  const installStateKey = "__worldmachine_simple_install__";
  const installMarkerName = ".worldmachine-install.json";
  const installOwner = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const installHeartbeatMs = 2000;
  const installStateTtlMs = 20000;

  const directoryCache = new Map();

  async function getRootFolder() {
    if (directoryCache.has("")) return directoryCache.get("");
    const opfsRoot = await navigator.storage.getDirectory();
    const gameRoot = await opfsRoot.getDirectoryHandle(storageFolderName, { create: true });
    directoryCache.set("", gameRoot);
    return gameRoot;
  }

  function readInstallState() {
    try {
      return JSON.parse(localStorage.getItem(installStateKey) || "null");
    } catch {
      return null;
    }
  }

  function writeInstallState(state) {
    localStorage.setItem(
      installStateKey,
      JSON.stringify({
        ...state,
        folder: storageFolderName,
        updatedAt: Date.now(),
      }),
    );
  }

  function clearInstallState() {
    const state = readInstallState();
    if (!state || state.owner === installOwner) {
      localStorage.removeItem(installStateKey);
    }
  }

  function installStateMatches(state, manifest) {
    return (
      state &&
      state.folder === storageFolderName &&
      state.version === manifest.version
    );
  }

  function installMarkerMatches(marker, manifest) {
    return (
      marker &&
      marker.folder === storageFolderName &&
      marker.version === manifest.version &&
      marker.totalFiles === manifest.totalFiles
    );
  }

  async function readInstallMarker() {
    try {
      const root = await getRootFolder();
      const handle = await root.getFileHandle(installMarkerName);
      const file = await handle.getFile();
      return JSON.parse(await file.text());
    } catch (error) {
      if (error?.name === "NotFoundError") return null;
      throw error;
    }
  }

  async function writeInstallMarker(manifest) {
    const root = await getRootFolder();
    const handle = await root.getFileHandle(installMarkerName, { create: true });
    const writable = await handle.createWritable({ keepExistingData: false });

    try {
      await writable.write(
        JSON.stringify({
          folder: storageFolderName,
          version: manifest.version,
          totalFiles: manifest.totalFiles,
          writtenAt: Date.now(),
        }),
      );
      await writable.close();
    } catch (error) {
      try {
        await writable.abort();
      } catch {
        // The stream may already be closed.
      }
      throw error;
    }
  }

  async function waitForExistingInstall(manifest) {
    for (;;) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const state = readInstallState();
      if (!installStateMatches(state, manifest)) return false;
      if (state.status === "done") return true;
      if (Date.now() - state.updatedAt > installStateTtlMs) return false;
    }
  }

  async function getTargetDirectory(filePath) {
    const parts = filePath.split("/");
    parts.pop();

    let currentDirectory = await getRootFolder();
    let currentPath = "";

    for (const part of parts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      let nextDirectory = directoryCache.get(currentPath);
      if (!nextDirectory) {
        nextDirectory = await currentDirectory.getDirectoryHandle(part, { create: true });
        directoryCache.set(currentPath, nextDirectory);
      }
      currentDirectory = nextDirectory;
    }

    return currentDirectory;
  }

  async function prepareDirectories(manifest) {
    directoryCache.clear();
    await getRootFolder();

    const directoryPaths = new Set();
    for (const file of manifest.files) {
      const parts = file.path.split("/");
      parts.pop();
      for (let index = 1; index <= parts.length; index += 1) {
        directoryPaths.add(parts.slice(0, index).join("/"));
      }
    }

    for (const directoryPath of [...directoryPaths].sort()) {
      await getTargetDirectory(`${directoryPath}/placeholder.tmp`);
    }
  }

  function sourceUrl(manifest, filePath) {
    return [manifest.source, ...filePath.split("/")]
      .map((part) => encodeURIComponent(part))
      .join("/");
  }

  async function copyFile(manifest, file) {
    const response = await fetch(sourceUrl(manifest, file.path));
    if (!response.ok) {
      throw new Error(`Failed to fetch ${file.path}: ${response.status}`);
    }

    const fileName = file.path.split("/").pop();
    const directory = await getTargetDirectory(file.path);
    const handle = await directory.getFileHandle(fileName, { create: true });
    const writable = await handle.createWritable({ keepExistingData: false });

    try {
      if (response.body) {
        await response.body.pipeTo(writable);
      } else {
        await writable.write(await response.arrayBuffer());
        await writable.close();
      }
    } catch (error) {
      try {
        await writable.abort();
      } catch {
        // The stream may already be closed.
      }
      throw error;
    }
  }

  async function installFiles(manifest) {
    console.info(
      `[worldmachine] installing ${manifest.totalFiles} bundled files into browser storage`,
    );

    await prepareDirectories(manifest);

    let copied = 0;
    const files = [...manifest.files].sort((left, right) => left.path.localeCompare(right.path));
    for (const file of files) {
      await copyFile(manifest, file);
      copied += 1;

      if (copied % 250 === 0 || copied === manifest.totalFiles) {
        console.info(`[worldmachine] installed ${copied}/${manifest.totalFiles}`);
      }
    }

    console.info("[worldmachine] bundled files installed");
  }

  let installPromise = null;

  async function runAutoInstall() {
    if (!navigator.storage || !navigator.storage.getDirectory) return;

    const manifestResponse = await fetch(manifestUrl, { cache: "no-cache" });
    if (!manifestResponse.ok) {
      throw new Error(`Failed to fetch ${manifestUrl}: ${manifestResponse.status}`);
    }

    const manifest = await manifestResponse.json();
    const existingState = readInstallState();

    if (installStateMatches(existingState, manifest)) {
      if (existingState.status === "done") return;
      if (existingState.status === "installing" && existingState.owner !== installOwner) {
        console.info("[worldmachine] waiting for existing bundled install to finish");
        if (await waitForExistingInstall(manifest)) return;
      }
    }

    const existingMarker = await readInstallMarker();
    if (installMarkerMatches(existingMarker, manifest)) {
      writeInstallState({
        owner: installOwner,
        status: "done",
        version: manifest.version,
      });
      return;
    }

    writeInstallState({
      owner: installOwner,
      status: "installing",
      version: manifest.version,
    });

    const heartbeat = setInterval(() => {
      writeInstallState({
        owner: installOwner,
        status: "installing",
        version: manifest.version,
      });
    }, installHeartbeatMs);

    try {
      await installFiles(manifest);
      await writeInstallMarker(manifest);
      clearInterval(heartbeat);
      writeInstallState({
        owner: installOwner,
        status: "done",
        version: manifest.version,
      });
    } catch (error) {
      clearInterval(heartbeat);
      clearInstallState();
      throw error;
    }
  }

  window.worldMachineAutoInstall = () => {
    installPromise ||= runAutoInstall().catch((error) => {
      installPromise = null;
      console.warn("[worldmachine] automatic bundled install failed", error);
      throw error;
    });
    return installPromise;
  };
})();
