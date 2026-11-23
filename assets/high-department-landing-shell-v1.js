/* Khaemenes High · Canonical Department Landing Shell v1.0.0
   Presentation/navigation owner only. Does not mutate curriculum, assessments,
   learner records, course state, grading, storage, or department-specific tools. */
(()=>{"use strict";
if(window.KhaemenesHighDepartmentShell)return;
const path=location.pathname;
const configs=[
 [/\/courses\/language-arts\/?$/i,{title:"Language Arts",label:"Language Arts Quick Links"}],
 [/\/courses\/mathematics\/?$/i,{title:"Mathematics",label:"Mathematics Quick Links"}],
 [/\/courses\/science\/?$/i,{title:"Science",label:"Science Quick Links"}],
 [/\/courses\/social-studies\/?$/i,{title:"Social Studies",label:"Social Studies Quick Links"}],
 [/\/courses\/electives\/?$/i,{title:"Electives",label:"Electives Quick Links"}],
 [/\/courses\/electives\/career-professional-studies\/?$/i,{title:"Career & Professional Studies",label:"Career Studies Quick Links"}],
 [/\/courses\/electives\/computing-digital-technology\/?$/i,{title:"Computing & Digital Technology",label:"Computing Quick Links"}],
 [/\/courses\/electives\/fine-arts-visual-studio\/?$/i,{title:"Fine Arts & Visual Studio",label:"Fine Arts Quick Links"}],
 [/\/courses\/electives\/health-wellness-human-development\/?$/i,{title:"Health, Wellness & Human Development",label:"Health & Wellness Quick Links"}],
 [/\/courses\/electives\/music-music-theory\/?$/i,{title:"Music & Music Theory",label:"Music Quick Links"}],
 [/\/courses\/electives\/psychology-101\/?$/i,{title:"Psychology 101",label:"Psychology Quick Links"}],
 [/\/courses\/electives\/world-languages-linguistics\/?$/i,{title:"World Languages & Linguistics",label:"Languages Quick Links"}]
];
const config=configs.find(([re])=>re.test(path))?.[1];if(!config)return;

function removeLegacyChrome(){
 document.querySelectorAll(
  'header[data-khae-header],header.khae-global-campus-header,header.site-header'
 ).forEach(n=>n.remove());
}
function style(){
 if(document.getElementById("highDepartmentShellStyle"))return;
 const s=document.createElement("style");s.id="highDepartmentShellStyle";s.textContent=`
 html:root:root body[data-high-department-shell="v1"]{background:#f4f0e7;color:#243038}
 html:root:root body[data-high-department-shell="v1"] :is(main>.hero,main>header,.hero){
  text-align:center!important;max-width:1100px;margin-inline:auto
 }
 html:root:root body[data-high-department-shell="v1"] :is(main>.hero,main>header,.hero) h1{
  font-family:Cinzel,Georgia,serif!important;font-weight:400!important;
  color:#243038!important;text-align:center!important
 }
 html:root:root body[data-high-department-shell="v1"] :is(main>.hero,main>header,.hero) :is(.eyebrow,.kicker,.grade,small){
  font-family:Cinzel,Georgia,serif!important;font-weight:400!important
 }
 html:root:root body[data-high-department-shell="v1"] :is(.card,.path-card,.unit-card,.discovery-feature){
  border-radius:7px!important
 }
 html:root:root body[data-high-department-shell="v1"] :is(.btn,.button,button,a.btn,a.button){
  border-radius:7px!important
 }
 #vnvHeaderAutoPopulate{width:100%!important}
 #vnv-language-rail[hidden]{display:none!important}
 #vnvClassToolsToggle,#vnvEcosystemUtilityDock button:first-child{height:44px!important;min-height:44px!important;border-radius:7px!important;font-size:16px!important}
 @media print{
  #vnv333NetworkTicker,#vnvTickerAutoPopulate,#vnvHeaderAutoPopulate,#vnvClassToolsToolbar,#vnvEcosystemUtilityDock{display:none!important}
 }`;
 document.head.append(s);
}
function load(src,key){
 return new Promise(resolve=>{
  const existing=[...document.scripts].find(s=>s.src&&s.src.includes(key));
  if(existing){if(existing.dataset.loaded==="1"||existing.readyState==="complete")resolve();else existing.addEventListener("load",resolve,{once:true});return}
  const s=document.createElement("script");s.src=src;s.dataset.departmentShell="v1";s.onload=()=>{s.dataset.loaded="1";resolve()};s.onerror=resolve;document.head.append(s);
 });
}
async function mount(){
 if(!document.body)return;
 document.body.dataset.highDepartmentShell="v1";
 style();removeLegacyChrome();
 if(!document.querySelector("[data-vnv-header-legacy]")){
  const anchor=document.createElement("header");anchor.hidden=true;anchor.setAttribute("aria-hidden","true");anchor.setAttribute("data-vnv-header-legacy","");document.body.prepend(anchor);
 }
 await load("https://vervenveda.com/assets/vnv-333-ticker.js","vnv-333-ticker.js");
 await load("https://vervenveda.com/assets/vnv-ticker-autopopulate.js","vnv-ticker-autopopulate.js");
 try{window.VNV_TICKER?.autoPopulate?.({label:config.label,max:14})}catch{}
 await load("https://vervenveda.com/assets/vnv-header-autopopulate.js","vnv-header-autopopulate.js");
 try{window.VNV_HEADER?.mount?.({
   replaceLegacy:true,title:"Khaemenes Academy",subtitle:"High School · "+config.title,
   icon:"K",home:"https://vervenveda.com/Khaemenes_High.github.io/",actions:[]
 })}catch{}
 let rail=document.getElementById("vnv-language-rail");
 if(!rail){rail=document.createElement("div");rail.id="vnv-language-rail";rail.setAttribute("role","group");rail.setAttribute("aria-label","Page translation tools");rail.hidden=true;document.body.append(rail)}
 await load("https://vervenveda.com/assets/khaemenes-campus-phrases.js","khaemenes-campus-phrases.js");
 await load("https://vervenveda.com/assets/khaemenes-interlingual-core.js","khaemenes-interlingual-core.js");
 await load("https://vervenveda.com/Khaemenes_Linguistics.github.io/assets/khaemenes-translator-loader.js?v=1.1.1","khaemenes-translator-loader.js");
 await load("https://vervenveda.com/assets/vnv-language.js?v=20261121-half-height","vnv-language.js");
 await load("https://vervenveda.com/Khaemenes_High.github.io/assets/high-school-subject-landing-class-tools-v1.js","high-school-subject-landing-class-tools-v1.js");
 await load("https://vervenveda.com/assets/vnv-class-tools-toolbar.js?v=1.6.1","vnv-class-tools-toolbar.js");
 await load("https://vervenveda.com/assets/vnv-ecosystem-toolbar.js","vnv-ecosystem-toolbar.js");
 document.dispatchEvent(new CustomEvent("khaemenes-high-department-shell-ready",{detail:{title:config.title}}));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
window.KhaemenesHighDepartmentShell=Object.freeze({version:"1.0.0",mount});
})();