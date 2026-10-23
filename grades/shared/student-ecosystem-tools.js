/* Student ecosystem links sourced from the Verve N Veda network directory. */
(()=>{"use strict";
if(!/\/grade-(09|10|11|12)\/student-profile\//.test(location.pathname))return;
if(document.getElementById("khaeStudentEcosystemTools"))return;
const tools=[
["🎨","Bazaar Art","Create and explore art","https://vervenveda.github.io/bazaarart.github.io/"],
["🌿","Aurora","Mindfulness, rest and reflection","https://vervenveda.github.io/aurora.github.io/"],
["🎼","The Refrain","Music, composition and performance","https://vervenveda.github.io/the_refrain.github.io/"],
["🛠️","ProResource Hub","Writing, design and productivity tools","https://vervenveda.github.io/proresource_hub.github.io/"],
["🔎","The Verifier","News, evidence and media literacy","https://vervenveda.github.io/theverifier.github.io/"],
["☀️","Solanar","Weather and Earth exploration","https://vervenveda.github.io/solanar.github.io/"],
["🎮","Academy Arcade","Games, strategy, puzzles and trivia","https://vervenveda.github.io/arcade.github.io/"]
];
const section=document.createElement("section");section.id="khaeStudentEcosystemTools";section.setAttribute("aria-label","Creative and discovery tools");
section.style.cssText="margin:18px 0;padding:17px;border:1px solid #b4a17f;border-radius:7px;background:#1b2d43;color:#f1e9d9;font:400 16px/1.55 Arial,sans-serif";
const title=document.createElement("h2");title.textContent="Creative & Discovery Tools";title.style.cssText="font:400 24px/1.3 Georgia,serif;margin:0 0 6px;color:#f4e6c6";
const summary=document.createElement("p");summary.textContent="Explore Academy-friendly creative spaces and research tools. Your class progress and grades stay separate.";summary.style.margin="0 0 14px";
const grid=document.createElement("div");grid.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(195px,1fr));gap:10px";
tools.forEach(([emoji,label,description,url])=>{const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener noreferrer";a.setAttribute("aria-label",label+" (opens in a new tab)");a.style.cssText="display:grid;gap:4px;padding:13px;border:1px solid #807c73;border-radius:7px;color:#f3e9d9;text-decoration:none;background:#223950;min-height:108px";
const h=document.createElement("span");h.textContent=emoji+" "+label;h.style.cssText="font-size:17px;color:#f2dba7";const d=document.createElement("span");d.textContent=description;d.style.cssText="font-size:14px;color:#d1d9db";a.append(h,d);grid.append(a)});
section.append(title,summary,grid);
const grade09=document.querySelector(".grade09-priority-schedule");const upper=document.getElementById("upperClasses");if(grade09)grade09.insertAdjacentElement("afterend",section);else if(upper)upper.insertAdjacentElement("afterend",section);
})();