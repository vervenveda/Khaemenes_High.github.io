"use strict";
/* Subject-aware navigation only. No grading, persistence, network requests, or external scripts. */
(()=>{
 const match=location.pathname.match(/\/units\/unit-(0[1-9]|1[0-2])\/(?:index\.html)?$/);
 if(!match)return;
 const id=match[1];
 const math="../../../../mathematics/algebra-1/";
 const geometry="../../../../mathematics/geometry/";
 const writing="../../../../language-arts/english-9/";
 const research="../../resources/local-investigation-registry.html";
 const portfolio="../../science-evidence-portfolio.html";
 const map={
  "01":["Scientific thinking and measurement",["Mathematics","Measurements, variables and quantitative patterns",math],["Language Arts","Writing an evidence-based scientific claim",writing]],
  "02":["Cells and living systems",["Mathematics","Ratios and quantities in biological models",math],["Language Arts","Explain a biological process with evidence",writing]],
  "03":["Human body systems",["Mathematics","Interpret measurements and changing quantities",math],["Language Arts","Explain how data support a health claim",writing]],
  "04":["Genetics and inheritance",["Mathematics","Probability, proportions and inheritance",math],["Language Arts","Construct a clear genetics explanation",writing]],
  "05":["Ecology and biodiversity",["Mathematics","Rates, proportions and population change",math],["Language Arts","Write a claim-evidence-reasoning ecology report",writing]],
  "06":["Atomic structure and matter",["Mathematics","Ratios and numerical patterns in chemistry",math],["Language Arts","Explain how atomic models use evidence",writing]],
  "07":["Bonding and chemical reactions",["Mathematics","Proportions in balanced reactions",math],["Language Arts","Explain chemical-model limitations",writing]],
  "08":["Motion, force and energy",["Mathematics","Functions, graphs and rates of change",math],["Geometry","Distance, vectors and spatial reasoning",geometry]],
  "09":["Electricity, waves and information",["Mathematics","Linear relationships in circuit evidence",math],["Language Arts","Describe the reliability of measurements",writing]],
  "10":["Earth systems and climate",["Mathematics","Graphing trends and changing quantities",math],["Language Arts","Evaluate environmental claims and sources",writing]],
  "11":["Space and cosmic evidence",["Mathematics","Scale, scientific notation and ratios",math],["Geometry","Orbits, distance and spatial models",geometry]],
  "12":["Sustainable engineering",["Mathematics","Evaluate quantities and tradeoffs",math],["Language Arts","Write a design justification using evidence",writing]]
 };
 function mount(){
  if(document.getElementById("khScienceConnections"))return;
  const [topic,...related]=map[id]||[];if(!topic)return;
  const section=document.createElement("section");section.id="khScienceConnections";section.className="kh-subject-connections";
  section.setAttribute("aria-labelledby","khSubjectHeading");
  const h=document.createElement("h2");h.id="khSubjectHeading";h.textContent="Connect this science unit to other subjects";section.append(h);
  const p=document.createElement("p");p.textContent=topic+" connects with skills used throughout Khaemenes Academy. These optional pathways do not change Science 9 grades or progress.";section.append(p);
  const list=document.createElement("div");list.className="kh-subject-grid";
  for(const item of [...related,["Research","Find locally catalogued investigations and sources",research],["Portfolio","Review saved Science 9 investigation evidence",portfolio]]){
   const a=document.createElement("a");a.href=item[2];a.className="kh-subject-card";
   const strong=document.createElement("span");strong.className="kh-subject-name";strong.textContent=item[0];
   const desc=document.createElement("span");desc.textContent=item[1];a.append(strong,desc);list.append(a);
  }
  section.append(list);
  const style=document.createElement("style");style.textContent=".kh-subject-connections{box-sizing:border-box;max-width:1050px;width:calc(100% - 16px);margin:22px auto;padding:clamp(10px,3vw,20px);border:1px solid #b4a995;border-radius:7px;background:#f7f2e8;color:#202c33;overflow-wrap:anywhere}.kh-subject-connections h2{font-weight:400;font-size:clamp(20px,3vw,26px);margin:0 0 8px}.kh-subject-connections p{margin:0 0 14px}.kh-subject-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr));gap:10px}.kh-subject-card{display:flex;flex-direction:column;gap:6px;background:#fffdf9;color:#214459;border:1px solid #bdb5a8;border-radius:7px;padding:12px;text-decoration:none;min-width:0;overflow-wrap:anywhere}.kh-subject-card span{font-size:14px}.kh-subject-card .kh-subject-name{font-size:17px}.kh-subject-card:focus-visible{outline:3px solid #196192;outline-offset:2px}@media(max-width:280px){.kh-subject-grid{grid-template-columns:minmax(0,1fr)}.kh-subject-connections{width:calc(100% - 12px);padding:8px}}@media print{.kh-subject-connections{display:none!important}}";document.head.append(style);
  const footer=document.querySelector("footer");if(footer)footer.before(section);else document.body.append(section);
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();
