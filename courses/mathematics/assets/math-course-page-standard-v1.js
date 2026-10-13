/* Khaemenes Mathematics page standard v1.0
   Adds consistent breadcrumbs, one contextual learning-game link, and the universal Beta button.
   Does not change curriculum, assessment, mastery, or learner-record logic. */
(() => {
  "use strict";
  const SCRIPT = document.currentScript;
  const GAME_ROOT = new URL("./learning-games/", SCRIPT?.src || location.href);
  const courseMeta = {
    "pre-algebra": {label:"Pre-Algebra", game:"number-family"},
    "algebra-1": {label:"Algebra I", game:"equation-balance-lab"},
    "algebra-2": {label:"Algebra II", game:"function-transformation-studio"},
    "geometry": {label:"Geometry", game:"proof-path-builder"}
  };
  const path = location.pathname;
  const match = path.match(/\/courses\/mathematics\/(pre-algebra|algebra-1|algebra-2|geometry)\/units\/unit-(\d+)\/lessons\/([^/]+)\.html$/i);
  if (!match) return;
  const courseId = match[1].toLowerCase();
  const unit = String(Number(match[2])).padStart(2,"0");
  const file = match[3];
  const lessonId = document.body.dataset.lessonId || document.body.dataset.lesson || file;
  const meta = courseMeta[courseId];
  if (!meta) return;
  const esc = value => String(value ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const title = () => document.querySelector("main h1, #main h1, .lesson-header h1, .lesson-hero h1")?.textContent?.trim() || document.title.replace(/\s*[|·—-]\s*Khaemenes.*$/i,"").trim() || "Lesson";
  const courseHref = "../../../index.html";
  const unitHref = "../index.html";
  const absolute = href => new URL(href, location.href).href;
  function addBreadcrumb() {
    if (document.querySelector('nav[aria-label="Breadcrumb"], .breadcrumb, .breadcrumbs, .math-standard-breadcrumb')) return;
    const nav = document.createElement("nav");
    nav.className = "math-standard-breadcrumb";
    nav.setAttribute("aria-label","Breadcrumb");
    nav.innerHTML = '<a href="https://vervenveda.com/Khaemenes_High.github.io/">Khaemenes Academy</a><span aria-hidden="true">›</span><a href="' + esc(courseHref) + '">' + esc(meta.label) + '</a><span aria-hidden="true">›</span><a href="' + esc(unitHref) + '">Unit ' + Number(unit) + '</a><span aria-hidden="true">›</span><span aria-current="page">' + esc(title()) + '</span>';
    const header = document.querySelector("header.site-header, header");
    const main = document.querySelector("main");
    if (header?.parentNode) header.insertAdjacentElement("afterend", nav);
    else if (main) main.insertAdjacentElement("afterbegin", nav);
    else document.body.insertAdjacentElement("afterbegin", nav);
  }
  function chooseGame() {
    const text = (title() + " " + location.pathname).toLowerCase();
    const choices = [
      [/integer|opposite|absolute value|signed number/, "integer-compass"],
      [/fraction|rational|reciprocal/, "fraction-forge"],
      [/ratio|rate|proportion|percent/, "ratio-atelier"],
      [/factor|polynomial|monomial|factoring/, "polynomial-factoring-forge"],
      [/inequalit|interval|solution set/, "inequality-number-line"],
      [/slope|linear model|rate of change|coordinate/, "slope-and-rate-studio"],
      [/quadratic|parabola|vertex|zeros|roots/, "quadratic-graph-lab"],
      [/exponential|logarithm|growth|decay/, "exponential-logarithm-lab"],
      [/function|transformation|domain|range|composition|inverse/, "function-transformation-studio"],
      [/sequence|series|arithmetic sequence|geometric sequence/, "sequence-series-studio"],
      [/trigon|triangle|sine|cosine|tangent|circle/, "right-triangle-trig"],
      [/proof|theorem|congruence|similarity|angle|line|plane|construction|geometry/, "proof-path-builder"],
      [/matrix|vector|complex/, "complex-plane-lab"],
      [/probability|statistics|data/, "statistics-detective"],
      [/number|operation|integer|estimate|multiple|prime|divisib/, "number-family"]
    ];
    return choices.find(([re])=>re.test(text))?.[1] || meta.game;
  }
  function buildGameURL(slug) {
    const url = new URL(slug + "/index.html", GAME_ROOT);
    url.searchParams.set("course",courseId);
    url.searchParams.set("unit",unit);
    url.searchParams.set("lesson",lessonId);
    url.searchParams.set("returnTo",location.href.split("#")[0]);
    return url.href;
  }
  function addGame() {
    const existing = [...document.querySelectorAll('a[href*="/learning-games/"],a[data-learning-game]')];
    if (existing.length) {
      existing.forEach(a => {
        try {
          const u = new URL(a.href,location.href);
          if (u.pathname.includes("/learning-games/")) {
            u.searchParams.set("course",courseId);u.searchParams.set("unit",unit);u.searchParams.set("lesson",lessonId);u.searchParams.set("returnTo",location.href.split("#")[0]);
            a.href = u.href;
          }
        } catch {}
      });
      return;
    }
    // A shared launcher already owns the companion card for this lesson.
    // Do not add a second generic card while its content is being rendered.
    if (document.querySelector('script[data-game][data-course]')) return;
    if (document.querySelector(".math-standard-game")) return;
    const slug = chooseGame();
    const section = document.createElement("section");
    section.className = "math-standard-game";
    section.setAttribute("aria-labelledby","math-standard-game-title");
    section.innerHTML = '<div><p class="eyebrow">Practice by playing</p><h2 id="math-standard-game-title">Learning Game · ' + esc(slug.replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase())) + '</h2><p>Use this interactive companion to practise the ideas in this lesson. Your course lesson and mastery evidence remain the source of truth.</p></div><a class="btn primary" data-learning-game href="' + esc(buildGameURL(slug)) + '">Play the learning game <span aria-hidden="true">→</span></a>';
    const main = document.querySelector("main");
    if (main) main.append(section);
    else document.body.append(section);
  }
  function loadBetaButton() {
    if (document.getElementById("vnvBetaProgramLink")) return;
    const src = new URL("../../../assets/vnv-beta-link.js", SCRIPT?.src || location.href);
    const beta = document.createElement("script");
    beta.src = src.href;
    beta.async = true;
    document.head.append(beta);
  }
  function run() { addBreadcrumb(); addGame(); loadBetaButton(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",run,{once:true});
  else run();
})();
