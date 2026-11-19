/* Khaemenes Academy · universal mathematics learning-resource resolver v2
   Non-grading UI only. No learner-record, mastery, assessment, or storage writes. */
(()=>{"use strict";
const pathname=location.pathname.toLowerCase();
const blocked=/\/(?:assessment|assessments|diagnostic)\//.test(pathname);
if(blocked||document.getElementById("khae-math-tools"))return;
const course=pathname.includes("/pre-algebra/")?"pre-algebra":pathname.includes("/algebra-1/")?"algebra-1":pathname.includes("/geometry/")?"geometry":pathname.includes("/algebra-2/")?"algebra-2":"mathematics";
const rootBase="https://vervenveda.com";
const shared={
 Calculator:rootBase+"/proresource_hub.github.io/Protools/Khaemenes_Scientific_Calculator/",
 Games:rootBase+"/arcade.github.io/",
 Search:rootBase+"/PLERASearch.github.io/",
 Parent:rootBase+"/Khaemenes_Academy.github.io/family/"
};
const courseTools={
 "pre-algebra":{
  Graph:rootBase+"/proresource_hub.github.io/Protools/Khaemenes_Scientific_Calculator/",
  Studio:rootBase+"/proresource_hub.github.io/"
 },
 "algebra-1":{
  Graph:rootBase+"/Khaemenes_High.github.io/courses/mathematics/assets/learning-games/slope-and-rate-studio/",
  Studio:rootBase+"/Khaemenes_High.github.io/courses/mathematics/assets/learning-games/quadratic-graph-lab/"
 },
 "geometry":{
  Graph:rootBase+"/proresource_hub.github.io/Protools/Ohmic_CAD_Studio.html",
  Studio:rootBase+"/arcade.github.io/Geometry/"
 },
 "algebra-2":{
  Graph:rootBase+"/Khaemenes_High.github.io/courses/mathematics/assets/learning-games/quadratic-graph-lab/",
  Studio:rootBase+"/proresource_hub.github.io/"
 },
 mathematics:{
  Graph:shared.Calculator,
  Studio:rootBase+"/proresource_hub.github.io/"
 }
};
const resources={...shared,...courseTools[course]};
function openResource(url){window.open(url,"_blank","noopener,noreferrer");}
function mount(){
 if(document.getElementById("khae-math-tools"))return;
 const aside=document.createElement("aside");
 aside.id="khae-math-tools";
 aside.setAttribute("aria-label","Mathematics learning resources");
 aside.innerHTML='<details><summary data-math-tools-open>Tools</summary><div class="khae-math-tools-grid" role="navigation" aria-label="Course learning resources"></div><p class="khae-math-tools-note">Learning resources support practice and exploration. Assessment rules remain authoritative.</p></details>';
 const grid=aside.querySelector(".khae-math-tools-grid");
 ["Calculator","Graph","Studio","Games","Search","Parent"].forEach(label=>{
   const b=document.createElement("button");b.type="button";b.textContent=label;b.title=label+" resource";
   b.addEventListener("click",()=>openResource(resources[label]));grid.append(b);
 });
 const print=document.createElement("button");print.type="button";print.textContent="Print";print.title="Print current learning page";print.addEventListener("click",()=>window.print());
 const courseBtn=document.createElement("button");courseBtn.type="button";courseBtn.textContent="Course";courseBtn.title="Return to mathematics course home";courseBtn.addEventListener("click",()=>{
   const match=location.pathname.match(/^(.*\/courses\/mathematics\/(?:pre-algebra|algebra-1|geometry|algebra-2)\/)/i);
   location.href=match?match[1]:"/Khaemenes_High.github.io/courses/mathematics/";
 });
 grid.append(print,courseBtn);
 const style=document.createElement("style");
 style.textContent=
 '#khae-math-tools{position:fixed;left:14px;bottom:16px;z-index:989;width:min(284px,calc(100vw - 28px));font:400 16px/1.35 "Nunito","Avenir Next",Arial,sans-serif;color:#f6f0df}'+
 '#khae-math-tools details{background:#20282d;border:1px solid #ae9467;border-radius:7px;box-shadow:0 8px 24px #0005;overflow:hidden}'+
 '#khae-math-tools summary{min-height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:10px 14px;list-style:none;color:#f6f0df}'+
 '#khae-math-tools summary::-webkit-details-marker{display:none}'+
 '#khae-math-tools .khae-math-tools-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;padding:0 11px 11px}'+
 '#khae-math-tools button{min-width:0;min-height:44px;padding:8px;border:1px solid #ae9467;border-radius:7px;background:#f4ecd9;color:#20282d;font:400 16px/1.15 inherit;text-align:center;cursor:pointer}'+
 '#khae-math-tools button:focus-visible,#khae-math-tools summary:focus-visible{outline:2px solid #f0d58a;outline-offset:2px}'+
 '#khae-math-tools .khae-math-tools-note{margin:0;padding:0 12px 12px;font-size:16px;line-height:1.4;color:#f6f0df}'+
 '@media(max-width:520px){#khae-math-tools{left:7px;bottom:8px;width:min(248px,calc(100vw - 14px))}#khae-math-tools .khae-math-tools-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}'+
 '@media print{#khae-math-tools{display:none!important}}';
 document.head.append(style);document.body.append(aside);
 window.KHAEMENES_MATH_TOOLS={course,open:()=>{aside.querySelector("details").open=true;}};
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();