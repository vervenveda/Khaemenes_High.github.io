"use strict";
(() => {
  const MARKER = "/courses/science/integrated-science-9/";
  const path = window.location.pathname;
  const markerIndex = path.indexOf(MARKER);
  const courseBase = markerIndex >= 0
    ? path.slice(0, markerIndex + MARKER.length)
    : new URL("./", window.location.href).pathname;
  const repositoryBase = markerIndex >= 0
    ? path.slice(0, markerIndex)
    : "";

  if (!document.querySelector('link[data-science-theme-layer]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${courseBase}science-theme.css`;
    link.dataset.scienceThemeLayer = "true";
    document.head.append(link);
  }

  function loadSharedWidget(src, marker) {
    if (document.querySelector(`script[${marker}]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.setAttribute(marker, "true");
    document.head.append(script);
  }

  /* Public-facing learner controls. */
  loadSharedWidget(`${repositoryBase}/assets/vnv-beta-link.js`, "data-vnv-beta-loader");
  loadSharedWidget(`${repositoryBase}/assets/khaemenes-mentor-link.js`, "data-khaemenes-mentor-loader");

  /* Context-aware Science ProTools routing. */
  loadSharedWidget(`${courseBase}science-protools-integration.js`, "data-science-protools-loader");

  /* Daily curriculum-matched science vocabulary via the LeArnA bridge. */
  loadSharedWidget(`${courseBase}science-vocabulary-integration.js`, "data-science-vocabulary-loader");

  /* Optional positive reinforcement after genuine science-success events. */
  loadSharedWidget(`${courseBase}science-success-challenges.js`, "data-science-success-challenges-loader");

  /* Distinct one-time celebration after full verified unit mastery. */
  loadSharedWidget(`${courseBase}science-unit-mastery-celebration.js`, "data-science-unit-mastery-loader");

  function synchronizeBrowserChrome() {
    const dark = document.documentElement.dataset.theme === "dark";
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = dark ? "#07131d" : "#f3f1eb";
    const schemeMeta = document.querySelector('meta[name="color-scheme"]');
    if (schemeMeta) schemeMeta.content = "dark light";
  }

  synchronizeBrowserChrome();
  new MutationObserver(synchronizeBrowserChrome).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
})();