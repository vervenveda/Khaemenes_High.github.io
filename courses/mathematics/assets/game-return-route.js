(() => {
  "use strict";
  const script = document.currentScript;
  const root = new URL("./", script.src);
  const courseNames = { prealgebra: "pre-algebra", "pre-algebra": "pre-algebra", algebra1: "algebra-1", "algebra-1": "algebra-1", geometry: "geometry", algebra2: "algebra-2", "algebra-2": "algebra-2" };
  function resolveLesson(course, unit, lesson, map) {
    const dir = courseNames[course], u = Number(unit), n = Number(String(lesson).match(/\d+$/)?.[0]);
    if (!dir || !Number.isInteger(u) || u < 0 || u > 13 || !Number.isInteger(n) || n < 1 || n > 20) return null;
    const pad = value => String(value).padStart(2, "0");
    if (dir === "geometry" || dir === "algebra-2") return `../${dir}/units/unit-${pad(u)}/lessons/u${pad(u)}-l${pad(n)}.html`;
    const item = map?.lessons?.find((l, i) => Number(l.number ?? i + 1) === n);
    const file = item?.file || item?.path;
    if (!file || !/^lessons\/[a-z0-9-]+\.html$/i.test(file)) return null;
    return `../${dir}/units/unit-${pad(u)}/${file}`;
  }
  window.KhaemenesGameReturn = Object.freeze({ resolveLesson });
  async function mount() {
    const q = new URLSearchParams(location.search), course = q.get("course"), dir = courseNames[course];
    if (!dir || !q.get("unit") || !q.get("lesson")) return;
    let map;
    if (["pre-algebra", "algebra-1"].includes(dir)) {
      const unit = Number(q.get("unit")); if (!Number.isInteger(unit) || unit < 0 || unit > 13) return;
      try { const response = await fetch(new URL(`../${dir}/units/unit-${String(unit).padStart(2, "0")}/unit-map.json`, root)); if (response.ok) map = await response.json(); } catch {}
    }
    const relative = resolveLesson(course, q.get("unit"), q.get("lesson"), map);
    const href = new URL(relative || `../${dir}/`, root).href;
    document.querySelectorAll("[data-return-lesson]").forEach(a => a.href = href);
    if (!document.getElementById("canonicalGameReturn")) {
      const a = document.createElement("a"); a.id = "canonicalGameReturn"; a.href = href; a.textContent = relative ? "Return to this lesson" : "Return to course entrance"; a.style.cssText = "display:inline-block;margin:12px;padding:10px;border:1px solid currentColor;border-radius:7px";
      (document.querySelector("header") || document.body).append(a);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true }); else mount();
})();
