import { dotnet } from "./_framework/dotnet.js";

const manifest = await fetch("./asset_manifest.csv");
const assets = manifest.ok
    ? (await manifest.text()).split("\n").map((entry) => entry.trim()).filter(Boolean)
    : [];

const { setModuleImports } = await dotnet
    .withModuleConfig({
        onConfigLoaded(config) {
            config.resources.vfs ??= {};

            for (const entry of assets) {
                const asset = entry.replace(/\\/g, "/").replace(/^\/?assets\//, "");
                config.resources.vfs[asset] = { [`../assets/${asset}`]: null };
            }
        }
    })
    .withDiagnosticTracing(false)
    .withApplicationArgumentsFromQuery()
    .create();

setModuleImports("main.js", {
    setMainLoop(callback) {
        let lastFrame = 0;
        dotnet.instance.Module.setMainLoop(() => {
            const now = performance.now();
            if (now - lastFrame < 1000 / 30) return;
            lastFrame = now;
            callback();
        });
    }
});

const canvas = document.querySelector("#canvas");
dotnet.instance.Module.canvas = canvas;
canvas.focus();
dotnet.run().catch((error) => console.error(error));
