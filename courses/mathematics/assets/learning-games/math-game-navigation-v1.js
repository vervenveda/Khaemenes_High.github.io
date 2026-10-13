/* Khaemenes Mathematics game navigation v1.0
   Adds a safe return breadcrumb when a game is launched from a course lesson. */
(() => {
  "use strict";
  const SCRIPT = document.currentScript;
  const params = new URLSearchParams(location.search);
  const course = params.get("course") || "";
  const unit = String(Number(params.get("unit")) || 1).padStart(2,"0");
  const lesson = params.get("lesson") || "";
  const returnRaw = params.get("returnTo") || "";
  const labels = {"pre-algebra":"Pre-Algebra","algebra-1":"Algebra I","algebra-2":"Algebra II","geometry":"Geometry"};
  let returnURL = null;
  try {
    const candidate = new URL(returnRaw,location.href);
    if (candidate.origin === location.origin && /\/courses\/mathematics\/(pre-algebra|algebra-1|algebra-2|geometry)\/units\/unit-\d+\/lessons\//.test(candidate.pathname)) returnURL = candidate;
  } catch {}
  if (!document.querySelector(".math-game-breadcrumb")) {
    const nav = document.createElement("nav");
    nav.className = "math-game-breadcrumb";
    nav.setAttribute("aria-label","Game breadcrumb");
    const crumb = [];
    crumb.push('<a href="https://khaemenesacademy.org/">Khaemenes Academy</a>');
    if (labels[course]) crumb.push('<span aria-hidden="true">›</span><span>' + labels[course] + '</span>');
    crumb.push('<span aria-hidden="true">›</span><span aria-current="page">Learning Game</span>');
    if (returnURL) crumb.push('<span aria-hidden="true">›</span><a class="math-game-return" href="' + returnURL.href.replace(/&/g,"&amp;").replace(/"/g,"&quot;") + '">Return to Lesson' + (lesson ? " " + lesson.replace(/[^a-z0-9-]/gi,"").slice(0,24) : "") + '</a>');
    nav.innerHTML = crumb.join("");
    const main = document.querySelector("main");
    const header = document.querySelector("header");
    if (header?.parentNode) header.insertAdjacentElement("afterend",nav);
    else if (main) main.insertAdjacentElement("afterbegin",nav);
    else document.body.insertAdjacentElement("afterbegin",nav);
  }
  if (!document.getElementById("vnvBetaProgramLink") && SCRIPT) {
    const beta = document.createElement("script");
    beta.src = new URL("../../../../assets/vnv-beta-link.js",SCRIPT.src).href;
    beta.async = true;
    document.head.append(beta);
  }
})();
