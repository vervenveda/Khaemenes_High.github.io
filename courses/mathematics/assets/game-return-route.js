(() => {
  "use strict";
  const script = document.currentScript;
  if (!script || !script.src) return;
  const root = new URL("./", script.src);
  const courseNames = {
    prealgebra: "pre-algebra", "pre-algebra": "pre-algebra",
    algebra1: "algebra-1", "algebra-1": "algebra-1",
    geometry: "geometry", algebra2: "algebra-2", "algebra-2": "algebra-2"
  };
  function resolveLesson(course, unit, lesson, map) {
    const dir = courseNames[course];
    const u = Number(unit), n = Number(String(lesson).match(/\d+$/)?.[0]);
    if (!dir || !Number.isInteger(u) || u < 0 || u > 13 || !Number.isInteger(n) || n < 1 || n > 20) return null;
    const pad = value => String(value).padStart(2, "0");
    if (dir === "geometry" || dir === "algebra-2") {
      return "../" + dir + "/units/unit-" + pad(u) + "/lessons/u" + pad(u) + "-l" + pad(n) + ".html";
    }
    const item = map?.lessons?.find((l, i) =>
      Number(l.number ?? i + 1) === n ||
      String(l.id || "").toLowerCase() === "u" + pad(u) + "-l" + pad(n)
    );
    const file = item?.file || item?.path;
    if (!file || !/^lessons\/[a-z0-9-]+\.html$/i.test(file)) return null;
    return "../" + dir + "/units/unit-" + pad(u) + "/" + file;
  }
  window.KhaemenesGameReturn = Object.freeze({ resolveLesson });

  function makeLink(href, label, primary) {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    a.style.cssText = "display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:9px 14px;" +
      "border:1px solid #987e5e;border-radius:7px;text-decoration:none;font:500 15px/1.3 system-ui,sans-serif;" +
      "background:" + (primary ? "#443729" : "#fffdf8") + ";color:" + (primary ? "#fff" : "#32281f") + ";";
    return a;
  }
  async function mount() {
    const q = new URLSearchParams(location.search);
    const course = q.get("course"), dir = courseNames[course];
    const unit = Number(q.get("unit")), lesson = q.get("lesson");
    if (!dir || !Number.isInteger(unit) || unit < 0 || unit > 13 || !lesson) return;

    let map;
    if (dir === "pre-algebra" || dir === "algebra-1") {
      try {
        const path = "../" + dir + "/units/unit-" + String(unit).padStart(2, "0") + "/unit-map.json";
        const response = await fetch(new URL(path, root));
        if (response.ok) map = await response.json();
      } catch { /* Keep the course return as a safe fallback. */ }
    }
    let relative = resolveLesson(course, unit, lesson, map);
    // Verify the map-derived destination before offering a lesson return link.
    if (relative) {
      try {
        const response = await fetch(new URL(relative, root), { method: "GET", cache: "no-store" });
        if (!response.ok) relative = null;
      } catch { relative = null; }
    }
    const lessonHref = new URL(relative || "../" + dir + "/", root).href;
    const unitHref = new URL("../" + dir + "/units/unit-" + String(unit).padStart(2, "0") + "/", root).href;
    const homeHref = new URL("../index.html", root).href;

    document.querySelectorAll("[data-return-lesson]").forEach(anchor => { anchor.href = lessonHref; });

    if (document.getElementById("canonicalGameReturn")) {
      document.getElementById("canonicalGameReturn").href = lessonHref;
      return;
    }
    const nav = document.createElement("nav");
    nav.id = "mathGameReturnNavigation";
    nav.setAttribute("aria-label", "Game navigation and return to lesson");
    nav.style.cssText = "box-sizing:border-box;display:flex;align-items:center;gap:10px;flex-wrap:wrap;" +
      "width:min(100% - 24px,1120px);margin:14px auto 0;padding:10px 12px;border:1px solid #c9b697;" +
      "border-radius:7px;background:#f8efdf;color:#32281f;";
    const label = document.createElement("span");
    label.textContent = "Independent mathematics practice";
    label.style.cssText = "font:500 14px/1.4 system-ui,sans-serif;flex:1 1 190px;";
    nav.appendChild(label);
    const n = Number(String(lesson).match(/\d+$/)?.[0]);
    const returnLabel = relative ? "← Return to Unit " + unit + ", Lesson " + n : "← Return to course entrance";
    const lessonLink = makeLink(lessonHref, returnLabel, true);
    lessonLink.id = "canonicalGameReturn";
    nav.appendChild(lessonLink);
    nav.appendChild(makeLink(unitHref, "Unit " + unit + " overview", false));
    nav.appendChild(makeLink(homeHref, "Mathematics home", false));

    const focusStyle = document.createElement("style");
    focusStyle.textContent = "#mathGameReturnNavigation a:focus-visible{outline:3px solid #24658e;outline-offset:3px;}";
    nav.appendChild(focusStyle);
    const main = document.querySelector("main");
    if (main?.parentNode) main.parentNode.insertBefore(nav, main);
    else document.body.insertBefore(nav, document.body.firstChild);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else mount();
})();
