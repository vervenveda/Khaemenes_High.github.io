/* Khaemenes High Mathematics · landing-page Class Tools configuration v1.0.0
   Uses the canonical Verve N Veda class-tools toolbar. Presentation/navigation only.
   No learner records, grades, mastery, assessments, or persistence authority. */
(()=>{"use strict";
if(window.__KHAE_MATH_LANDING_CLASS_TOOLS_V1__)return;
window.__KHAE_MATH_LANDING_CLASS_TOOLS_V1__=true;

const path=location.pathname.toLowerCase();
const match=path.match(/\/courses\/mathematics\/(pre-algebra|algebra-1|geometry|algebra-2)\/(?:index\.html)?$/);
if(!match)return;
const course=match[1];
const root="/Khaemenes_High.github.io/courses/mathematics/";
const courseHome=root+course+"/";
const vocabulary=root+"tools/vocabulary-studio.html?course="+encodeURIComponent(course);
const calculator=root+"tools/calculator/";
const games="https://vervenveda.com/arcade.github.io/";
const search="https://vervenveda.com/PLERASearch.github.io/";
const parent="https://vervenveda.com/Khaemenes_Academy.github.io/family/";

function ensureTranslatorMount(){
 if(document.querySelector("[data-vnv-language-mount]"))return;
 const mount=document.createElement("div");
 mount.id="khaeMathTranslatorMount";
 mount.hidden=true;
 mount.setAttribute("data-vnv-language-mount","");
 mount.setAttribute("data-i18n-ignore","");
 document.body.append(mount);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ensureTranslatorMount,{once:true});
else ensureTranslatorMount();

function openTranslator({root}){
 root.querySelectorAll(".vct-pop").forEach(p=>p.hidden=true);
 let panel=root.querySelector("[data-vct-translator-panel]");
 if(!panel){
  panel=document.createElement("div");
  panel.className="vct-pop";
  panel.setAttribute("data-vct-translator-panel","");
  const h=document.createElement("h2");h.textContent="Translate";
  const p=document.createElement("p");p.textContent="Choose the interface language for this mathematics page.";
  panel.append(h,p);
  root.querySelector("#vnvClassToolsPanel")?.append(panel);
 }
 const mount=document.getElementById("khaeMathTranslatorMount")||document.querySelector("[data-vnv-language-mount]");
 if(mount){
  mount.hidden=false;
  panel.append(mount);
 }
 panel.hidden=false;
 window.VNVLanguage?.refresh?.();
}

window.KhaemenesClassToolsConfigV1={
 id:"high-school-math-landing",
 match:()=>/\/courses\/mathematics\/(?:pre-algebra|algebra-1|geometry|algebra-2)\/(?:index\.html)?$/i.test(location.pathname),
 toggleLabel:"Tools",
 ariaLabel:"Mathematics learning tools",
 tools:[
  {type:"link",label:"Calculator",sub:"Scientific calculator",href:calculator},
  {type:"link",label:"Games",sub:"Math practice",href:games},
  {type:"link",label:"Vocabulary",sub:"Math vocabulary",href:vocabulary},
  {type:"link",label:"Search",sub:"Search ecosystem",href:search},
  {type:"action",label:"Translate",sub:"Change language",action:"translate"},
  {type:"link",label:"Parent",sub:"Family support",href:parent}
 ],
 actions:{translate:openTranslator},
 materials:{
  title:"Mathematics Materials",
  intro:"Course materials remain connected to the current mathematics course.",
  links:[{label:"Course Home",href:courseHome},{label:"Scientific Calculator",href:calculator}]
 },
 help:{
  title:"How Class Tools Work",
  paragraphs:["These tools support learning and navigation. They do not alter grades, mastery, assessments, or learner records."]
 }
};
})();