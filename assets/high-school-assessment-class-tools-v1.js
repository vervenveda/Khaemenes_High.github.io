(()=>{"use strict";
if(window.__KHAE_HIGH_ASSESSMENT_TOOLS_V1__)return;
window.__KHAE_HIGH_ASSESSMENT_TOOLS_V1__=true;
const ROOT="https://vervenveda.com/Khaemenes_High.github.io/";
function gradeFromPath(){
 const p=location.pathname;
 const direct=p.match(/\/grade-(09|10|11|12)\//i);if(direct)return direct[1];
 const english=p.match(/\/english-(9|10|11|12)\//i);if(english)return String(Number(english[1])).padStart(2,"0");
 if(/\/biology-10\//i.test(p)||/\/mathematics\/geometry\//i.test(p))return "10";
 if(/\/chemistry-11\//i.test(p)||/\/mathematics\/algebra-2\//i.test(p))return "11";
 if(/\/physics-engineering-12\//i.test(p))return "12";
 return "09";
}
const PROFILE=ROOT+"grades/grade-"+gradeFromPath()+"/student-profile/";
function ensureTranslatorPanel(root){
 let panel=root?.querySelector("[data-vct-translator-panel]");
 if(panel)return panel;
 panel=document.createElement("div");panel.className="vct-pop";panel.setAttribute("data-vct-translator-panel","");panel.hidden=true;
 panel.innerHTML='<h2>Translate</h2><p>Choose the interface language for this assessment page.</p><div data-vnv-language-mount></div>';
 root?.querySelector("#vnvClassToolsPanel")?.append(panel);
 return panel;
}
function moveTranslator(panel){
 const mount=panel?.querySelector("[data-vnv-language-mount]");
 const switcher=document.getElementById("vnv-language-switch");
 if(mount&&switcher&&switcher.parentElement!==mount)mount.append(switcher);
 document.getElementById("vnv-language-rail")?.remove();
}
function openTranslator({root}){
 root.querySelectorAll(".vct-pop").forEach(p=>p.hidden=true);
 const panel=ensureTranslatorPanel(root);if(!panel)return;
 moveTranslator(panel);panel.hidden=false;window.VNVLanguage?.refresh?.();
}
window.KhaemenesClassToolsConfigV1=Object.freeze({
 id:"high-school-assessment",
 match:()=>/\/Khaemenes_High\.github\.io\/.+\/(assessments|diagnostic|readiness)\//i.test(location.pathname),
 toggleLabel:"Tools",ariaLabel:"Assessment tools",
 tools:[
  {type:"link",label:"Student",sub:"Learner profile",href:PROFILE},
  {type:"link",label:"Courses",sub:"High School courses",href:ROOT+"courses/"},
  {type:"link",label:"Search",sub:"Search ecosystem",href:"https://vervenveda.com/PLERASearch.github.io/"},
  {type:"action",label:"Translate",sub:"Change language",action:"translate"},
  {type:"link",label:"Parent",sub:"Family profile",href:"https://vervenveda.com/Khaemenes_Academy.github.io/family/"},
  {type:"help",label:"Instructions",sub:"Assessment page help"}
 ],
 actions:{translate:openTranslator},
 help:{title:"Assessment Tools",paragraphs:["Use the assessment's own controls for Begin, Next, Submit, Print, Retake, corrections, and course return.","The lower-left tools do not alter answers, scores, attempts, mastery, or learner records.","Translate changes the page interface only."]}
});
document.addEventListener("DOMContentLoaded",()=>setTimeout(()=>{
 const root=document.getElementById("vnvClassToolsToolbar");if(!root)return;
 moveTranslator(ensureTranslatorPanel(root));
},120),{once:true});
})();