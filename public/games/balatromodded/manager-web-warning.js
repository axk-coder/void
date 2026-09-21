(() => {
  const warningId = "web-mod-compatibility-warning";
  let observer;
  const mountWarning = () => {
    if (document.getElementById(warningId)) return true;
    const menu = document.querySelector(".main-page header");
    if (!menu) return false;
    const warning = document.createElement("div");
    warning.id = warningId;
    warning.className = "web-mod-compatibility-warning";
    warning.setAttribute("role", "status");
    warning.setAttribute("aria-live", "polite");
    warning.textContent = "WARNING: Most mods probably do not work in the web port. Use them at your own risk.";
    menu.appendChild(warning);
    window.setTimeout(() => {
      warning.classList.add("web-mod-compatibility-warning--leaving");
      window.setTimeout(() => warning.remove(), 250);
    }, 4750);
    observer?.disconnect();
    return true;
  };
  if (!mountWarning()) {
    observer = new MutationObserver(mountWarning);
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
