(()=>{"use strict";
if(window.__KHAE_SCIENCE_LANDING_CLASS_TOOLS_V1__)return;
window.__KHAE_SCIENCE_LANDING_CLASS_TOOLS_V1__=true;

function ensureTranslatorMount(){
 if(document.querySelector("[data-vnv-language-mount]"))return;
 const mount=document.createElement("div");
 mount.id="khaeScienceTranslatorMount";
 mount.hidden=true;
 mount.setAttribute("data-vnv-language-mount","");
 mount.setAttribute("data-i18n-ignore","");
 document.body.append(mount);
}
function openTranslator({root}){
 root.querySelectorAll(".vct-pop").forEach(p=>p.hidden=true);
 let panel=root.querySelector("[data-vct-translator-panel]");
 if(!panel){
   panel=document.createElement("div");
   panel.className="vct-pop";
   panel.setAttribute("data-vct-translator-panel","");
   const h=document.createElement("h2");h.textContent="Translate";
   const p=document.createElement("p");p.textContent="Choose the interface language for this Science course page.";
   panel.append(h,p);
   root.querySelector("#vnvClassToolsPanel")?.append(panel);
 }
 const mount=document.getElementById("khaeScienceTranslatorMount")||document.querySelector("[data-vnv-language-mount]");
 if(mount){mount.hidden=false;panel.append(mount)}
 panel.hidden=false;
 window.VNVLanguage?.refresh?.();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ensureTranslatorMount,{once:true});else ensureTranslatorMount();

const grade=/\/physics-engineering-12\//i.test(location.pathname)?"12":/\/chemistry-11\//i.test(location.pathname)?"11":/\/biology-10\//i.test(location.pathname)?"10":"09";
const profileBase="/Khaemenes_High.github.io/grades/grade-"+grade+"/student-profile/";
window.KhaemenesClassToolsConfigV1={
 id:"high-school-science-landing",
 match:()=>/\/courses\/science\/(?:integrated-science-9|biology-10|chemistry-11|physics-engineering-12)\/(?:index\.html)?$/i.test(location.pathname),
 toggleLabel:"Tools",
 ariaLabel:"Science learning tools",
 tools:[
   {type:"link",label:"Student",sub:"Student profile",href:profileBase},
   {type:"link",label:"Classes",sub:"Daily classes",href:profileBase+"daily-lessons/"},
   {type:"link",label:"Schedule",sub:"My schedule",href:profileBase+"#scheduleBarTitle"},
   {type:"link",label:"Search",sub:"Search ecosystem",href:"https://vervenveda.com/PLERASearch.github.io/"},
   {type:"action",label:"Translate",sub:"Change language",action:"translate"},
   {type:"link",label:"Parent",sub:"Family support",href:"https://vervenveda.com/Khaemenes_Academy.github.io/family/"}
 ],
 actions:{translate:openTranslator}
};
})();