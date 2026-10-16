(() => {
  const loader = document.getElementById("page-loader");
  if (!loader) return;

  const startedAt = window.__pageLoaderStartedAt ?? performance.now();
  const minimumVisibleMs = 1100;
  const fontWaitLimitMs = 15000;
  let dismissed = false;

  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    loader.classList.add("is-hidden");
    loader.setAttribute("aria-hidden", "true");
    window.setTimeout(() => loader.remove(), 320);
  };

  const finishLoading = async () => {
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    await Promise.race([
      fontsReady.catch(() => undefined),
      new Promise((resolve) => window.setTimeout(resolve, fontWaitLimitMs))
    ]);
    const remaining = Math.max(0, minimumVisibleMs - (performance.now() - startedAt));
    window.setTimeout(dismiss, remaining);
  };

  if (document.readyState === "complete") {
    finishLoading();
  } else {
    window.addEventListener("load", finishLoading, { once: true });
  }

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) dismiss();
  }, { once: true });
})();