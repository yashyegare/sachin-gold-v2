/** Runs in the initial HTML, before React or its bundles are available. */
export const splashGateScript = `
(function () {
  try {
    if (!/^(?:\\/(?:hi|mr|kn|te|ta))?\\/?$/.test(location.pathname)) return;
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try { if (localStorage.getItem("sg-splash-seen")) return; } catch (e) {}
    document.documentElement.setAttribute("data-splash", "1");
    window.__sgSplashActive = true;
    function start(event) {
      if (event.animationName !== "sg-splash-settle") return;
      if (window.__sgSplashStartedAt == null) {
        window.__sgSplashStartedAt = performance.now() - 50;
      }
    }
    window.addEventListener("animationstart", start);
    // Observe CSS completion before hydration too. Otherwise a late hydration
    // recovery can remount the overlay and replay an already finished splash.
    function done(event) {
      if (event.animationName !== "sg-splash-out" ||
          !event.target.classList.contains("sg-splash")) return;
      window.removeEventListener("animationend", done);
      window.removeEventListener("animationstart", start);
      if (!document.documentElement.hasAttribute("data-splash")) return;
      window.__sgSplashActive = false;
      try { localStorage.setItem("sg-splash-seen", "1"); } catch (e) {}
      document.documentElement.removeAttribute("data-splash");
      window.dispatchEvent(new Event("sg-splash-done"));
    }
    window.addEventListener("animationend", done);
  } catch (e) {}
})();
`;
