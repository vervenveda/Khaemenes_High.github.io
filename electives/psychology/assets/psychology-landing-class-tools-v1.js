(()=>{"use strict";
if(window.__KHAE_PSYCH_LANDING_TOOLS_V1__)return;
window.__KHAE_PSYCH_LANDING_TOOLS_V1__=true;
function ensureTranslatorMount(){
 if(document.querySelector("[data-vnv-language-mount]"))return;
 const mount=document.createElement("div");
 mount.id="khaePsychTranslatorMount";
 mount.hidden=true;
 mount.setAttribute("data-vnv-language-mount","");
 mount.setAttribute("data-i18n-ignore","");
 document.body.append(mount);
}
function openTranslator({root}){
 root.querySelectorAll(".vct-pop").forEach(p=>p.hidden=true);
 let panel=root.querySelector("[data-vct-translator-panel]");
 if(!panel){
  panel=document.createElement("div"); panel.className="vct-pop"; panel.setAttribute("data-vct-translator-panel","");
  const h=document.createElement("h2");h.textContent="Translate";
  const p=document.createElement("p");p.textContent="Choose the interface language for this Psychology page.";
  panel.append(h,p); root.querySelector("#vnvClassToolsPanel")?.append(panel);
 }
 const mount=document.getElementById("khaePsychTranslatorMount")||document.querySelector("[data-vnv-language-mount]");
 if(mount){mount.hidden=false;panel.append(mount)}
 panel.hidden=false; window.VNVLanguage?.refresh?.();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ensureTranslatorMount,{once:true});else ensureTranslatorMount();
window.KhaemenesClassToolsConfigV1={
 id:"high-school-psychology-landing",
 match:()=>/\/electives\/psychology\/(?:index\.html)?$/i.test(location.pathname),
 toggleLabel:"Tools",
 ariaLabel:"Psychology tools",
 tools:[
  {type:"link",label:"Student",sub:"Student profile",href:"/Khaemenes_High.github.io/grades/grade-09/student-profile/"},
  {type:"link",label:"Courses",sub:"Psychology sequence",href:"./"},
  {type:"link",label:"Search",sub:"Search ecosystem",href:"https://vervenveda.com/PLERASearch.github.io/"},
  {type:"action",label:"Translate",sub:"Change language",action:"translate"},
  {type:"link",label:"Parent",sub:"Family support",href:"https://vervenveda.com/Khaemenes_Academy.github.io/family/"},
  {type:"link",label:"Enroll",sub:"Enrollment",href:"https://vervenveda.com/Khaemenes_Academy.github.io/family/enroll/"}
 ],
 actions:{translate:openTranslator}
};
})();