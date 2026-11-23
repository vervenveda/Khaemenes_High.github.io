(()=>{"use strict";
if(window.__KHAE_HIGH_SUBJECT_LANDING_TOOLS_V1__)return;
window.__KHAE_HIGH_SUBJECT_LANDING_TOOLS_V1__=true;
const ROOT="https://vervenveda.com/Khaemenes_High.github.io/";
const parts=location.pathname.split("/").filter(Boolean);
const subject=(parts[2]||"courses").toLowerCase();
const electiveCourse=(parts[3]||"").toLowerCase();
const labels={
 "mathematics":"Mathematics","language-arts":"Language Arts","science":"Science",
 "social-studies":"Social Studies","physical-education":"Physical Education","electives":"Electives","courses":"Courses",
 "career-professional-studies":"Career Studies","computing-digital-technology":"Computing","fine-arts-visual-studio":"Fine Arts","health-wellness-human-development":"Health & Wellness","music-music-theory":"Music","psychology-101":"Psychology","world-languages-linguistics":"Languages"
};
function ensureTranslatorPanel(root){
 let panel=root?.querySelector("[data-vct-translator-panel]");
 if(panel)return panel;
 panel=document.createElement("div");panel.className="vct-pop";
 panel.setAttribute("data-vct-translator-panel","");panel.hidden=true;
 panel.innerHTML='<h2>Translate</h2><p>Choose the interface language for this High School subject page.</p><div data-vnv-language-mount></div>';
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
 id:"high-school-subject-landings",
 match:()=>/\/Khaemenes_High\.github\.io\/courses\/(?:index\.html)?$/i.test(location.pathname)||
   /\/Khaemenes_High\.github\.io\/courses\/(mathematics|language-arts|science|social-studies|physical-education|electives)\/(?:index\.html)?$/i.test(location.pathname)||
   /\/Khaemenes_High\.github\.io\/courses\/electives\/(career-professional-studies|computing-digital-technology|fine-arts-visual-studio|health-wellness-human-development|music-music-theory|psychology-101|world-languages-linguistics)\/(?:index\.html)?$/i.test(location.pathname),
 toggleLabel:"Tools",ariaLabel:(labels[subject]||"High School")+" tools",
 tools:[
  {type:"link",label:"Student",sub:"Learner profile",href:ROOT+"#student-portal"},
  {type:"link",label:"Courses",sub:"Course directory",href:ROOT+"courses/"},
  {type:"link",label:"Search",sub:"Search ecosystem",href:"https://vervenveda.com/PLERASearch.github.io/"},
  {type:"action",label:"Translate",sub:"Change language",action:"translate"},
  {type:"link",label:"Parent",sub:"Family profile",href:"https://vervenveda.com/Khaemenes_Academy.github.io/family/"},
  {type:"link",label:"Enroll",sub:"Enrollment",href:"https://vervenveda.com/Khaemenes_Academy.github.io/family/enroll/"}
 ],
 actions:{translate:openTranslator}
});
document.addEventListener("DOMContentLoaded",()=>setTimeout(()=>{
 const root=document.getElementById("vnvClassToolsToolbar");if(!root)return;
 moveTranslator(ensureTranslatorPanel(root));
},120),{once:true});
})();