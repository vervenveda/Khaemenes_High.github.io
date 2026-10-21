"use strict";
/* Khaemenes Academy public academic bridge. Navigation only: no learner state, tracking, or dependencies. */
(()=>{
 if(document.getElementById("khAcademicNetwork"))return;
 const base="https://vervenveda.com/";
 const entries=[
  ["Academy","K–12 pathways",base+"Khaemenes_Academy.github.io/"],
  ["High School","Grades 9–12",base+"Khaemenes_High.github.io/"],
  ["Mathematics","High school math","../../mathematics/"],
  ["Language Arts","High school reading and writing","../../language-arts/"],
  ["Linguistics","Languages and translation",base+"Khaemenes_Linguistics.github.io/"],
  ["Research & writing","Tools and source work",base+"proresource_hub.github.io/"],
  ["Creative learning","Games and exploration",base+"arcade.github.io/"],
  ["Vervenveda","Network home",base]
 ];
 function mount(){
  if(document.getElementById("khAcademicNetwork"))return;
  const host=document.createElement("nav");host.id="khAcademicNetwork";host.setAttribute("aria-label","Vervenveda academic network");host.className="kh-academic-network";
  const heading=document.createElement("h2");heading.textContent="Explore the connected Academy";host.append(heading);
  const summary=document.createElement("p");summary.textContent="Science connects with mathematics, language, research and creative practice. Open a related campus without changing your Science 9 progress.";host.append(summary);
  const grid=document.createElement("div");grid.className="kh-academic-grid";
  for(const [name,detail,href] of entries){
   const a=document.createElement("a");a.href=href;a.className="kh-academic-link";
   const title=document.createElement("span");title.textContent=name;title.className="kh-academic-title";
   const desc=document.createElement("span");desc.textContent=detail;desc.className="kh-academic-desc";
   a.append(title,desc);grid.append(a);
  }
  host.append(grid);
  const style=document.createElement("style");style.textContent=".kh-academic-network{box-sizing:border-box;max-width:1050px;width:calc(100% - 16px);margin:24px auto;padding:clamp(10px,3vw,20px);border:1px solid #a9a29a;border-radius:7px;background:#f7f1e7;color:#282a2c;overflow-wrap:anywhere}.kh-academic-network h2{font-weight:400;font-size:clamp(21px,3vw,26px);margin:0 0 8px}.kh-academic-network p{margin:0 0 14px}.kh-academic-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,185px),1fr));gap:10px}.kh-academic-link{display:flex;flex-direction:column;gap:5px;min-width:0;padding:12px;border:1px solid #b2a99b;border-radius:7px;color:#273b4a;background:#fffdf8;text-decoration:none;overflow-wrap:anywhere}.kh-academic-title{font-size:17px}.kh-academic-desc{font-size:14px}.kh-academic-link:focus-visible{outline:3px solid #225f92;outline-offset:2px}@media(max-width:280px){.kh-academic-grid{grid-template-columns:minmax(0,1fr)}.kh-academic-network{width:calc(100% - 12px);padding:8px}}@media print{.kh-academic-network{display:none!important}}";document.head.append(style);
  const footer=document.querySelector("footer");if(footer)footer.before(host);else document.body.append(host);
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();