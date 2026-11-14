/* Khaemenes High · global canonical header/menu/toolbar guard v2.0.0
   Presentation/navigation only. No learner records, grades, assessments, or storage are modified.
*/
(()=>{"use strict";
if(window.__KHAEMENES_HIGH_GLOBAL_CHROME_V2__)return;
window.__KHAEMENES_HIGH_GLOBAL_CHROME_V2__=true;

const VNV="https://vervenveda.com/assets/";
const HIGH="https://vervenveda.com/Khaemenes_High.github.io/";
const HEADER="vnv-header-autopopulate.js";
const TOOLBAR="vnv-ecosystem-toolbar.js";
const OFFICIAL_DOCK="vnvEcosystemUtilityDock";

function hasScript(pathname){
  return [...document.scripts].some(s=>{try{return new URL(s.src,location.href).pathname===pathname}catch{return false}});
}
function load(src,key){
  const url=new URL(src,location.href);
  if(hasScript(url.pathname))return Promise.resolve();
  return new Promise(resolve=>{
    const s=document.createElement("script");
    s.src=url.href;s.defer=true;s.dataset[key]="true";
    s.addEventListener("load",resolve,{once:true});
    s.addEventListener("error",resolve,{once:true});
    (document.head||document.documentElement).append(s);
  });
}
function pathGrade(){
  const m=location.pathname.match(/\/grade-(09|10|11|12)(?:\/|$)/i);
  if(m)return m[1];
  if(/english-9|integrated-science-9|social-studies\/grade-09|grades\/grade-09/i.test(location.pathname))return "09";
  return "";
}
function profileHref(){
  const grade=pathGrade();
  return grade?HIGH+"grades/grade-"+grade+"/student-profile/":HIGH+"#student-portal";
}
function mountHeader(){
  if(!window.VNV_HEADER?.mount)return;
  const root=window.VNV_HEADER.mount({
    title:"Khaemenes Academy",
    subtitle:"High School · Grades 9–12",
    icon:"K",
    home:"https://vervenveda.com/KhaemenesAcademy_Home.github.io/",
    actions:[
      {label:"My Profile",href:profileHref()},
      {label:"Grades 9–12",href:HIGH+"#grades"},
      {label:"All Courses",href:HIGH+"courses/"},
      {label:"Ecosystem",href:"https://vervenveda.com/#directory"},
      {label:"Family",href:"https://vervenveda.com/Khaemenes_Academy.github.io/family/"}
    ]
  });
  if(root){
    root.dataset.khaemenesHighCanonicalHeader="v2";
    const menu=root.querySelector(".vnv-header-menu-button");
    if(menu){
      menu.dataset.khaemenesHighHamburger="true";
      menu.setAttribute("title","Open Ecosystem menu");
    }
  }
}
function mountToolbar(){
  try{window.VNVEcosystemToolbar?.mount?.()}catch{}
  const dock=document.getElementById(OFFICIAL_DOCK);
  if(dock){
    dock.dataset.khaemenesHighCanonicalToolbar="v2";
    dock.style.setProperty("left","auto","important");
    dock.style.setProperty("right","max(12px, env(safe-area-inset-right))","important");
  }
}
const LEGACY_FLOATERS=[
  "vnvBetaProgramLink","vnvBetaProgramFallback","khaemenesLearnerUtilityToolbar",
  "khaeLandingUtilityDock","khaemenesHomeUtilityDock","highQuickUtilityDock",
  "studentQuickUtilityDock","academyQuickUtilityDock"
];
function cleanupKnownFloaters(){
  if(!document.getElementById(OFFICIAL_DOCK))return;
  for(const id of LEGACY_FLOATERS)document.getElementById(id)?.remove();
}
function preserveExportMarker(){
  document.querySelectorAll('button,a,[role="button"]').forEach(el=>{
    const label=((el.textContent||"")+" "+(el.getAttribute("aria-label")||"")+" "+(el.id||"")+" "+(el.className||"")).toLowerCase();
    if(/export/.test(label)&&/(student|learner|profile|progress|grade|record)/.test(label)){
      el.dataset.khaemenesStudentExportCandidate="true";
    }
  });
}
async function start(){
  if(!document.body)return;
  await load(VNV+HEADER,"khaemenesHighHeader");
  mountHeader();
  await load(VNV+TOOLBAR,"khaemenesHighToolbar");
  mountToolbar();
  cleanupKnownFloaters();
  preserveExportMarker();
  if(typeof MutationObserver==="function"){
    new MutationObserver(()=>{mountHeader();mountToolbar();cleanupKnownFloaters();preserveExportMarker();})
      .observe(document.documentElement,{childList:true,subtree:true});
  }
  document.documentElement.dataset.khaemenesHighChrome="v2";
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
else start();
})();