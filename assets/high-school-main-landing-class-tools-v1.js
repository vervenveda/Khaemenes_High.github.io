(()=>{"use strict";
if(window.__KHAE_HIGH_MAIN_LANDING_TOOLS_V1__)return;
window.__KHAE_HIGH_MAIN_LANDING_TOOLS_V1__=true;
const ROOT="https://vervenveda.com/Khaemenes_High.github.io/";
const match=location.pathname.match(/\/grades\/(grade-(09|10|11|12))\/(?:index\.html)?$/i);
const studentHref=match?ROOT+"grades/"+match[1]+"/student-profile/":ROOT+"#student-portal";
function ensureTranslatorPanel(root){
 let panel=root?.querySelector("[data-vct-translator-panel]");
 if(panel)return panel;
 panel=document.createElement("div");panel.className="vct-pop";
 panel.setAttribute("data-vct-translator-panel","");panel.hidden=true;
 panel.innerHTML='<h2>Translate</h2><p>Choose the interface language for this High School page.</p><div data-vnv-language-mount></div>';
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
 id:"high-school-main-landings",
 match:()=>location.pathname==="/Khaemenes_High.github.io/"||
   /\/Khaemenes_High\.github\.io\/index\.html$/i.test(location.pathname)||
   /\/Khaemenes_High\.github\.io\/grades\/grade-(09|10|11|12)\/(?:index\.html)?$/i.test(location.pathname),
 toggleLabel:"Tools",ariaLabel:"High School tools",
 tools:[
  {type:"link",label:"Student",sub:"Learner profile",href:studentHref},
  {type:"link",label:"Courses",sub:"High School courses",href:ROOT+"courses/"},
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