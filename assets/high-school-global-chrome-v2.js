/* Khaemenes High · minimal canonical chrome v3.0.0
   Compatibility filename retained: high-school-global-chrome-v2.js

   OWNERSHIP:
   - This file may supply ONE missing official VNV/Khaemenes header.
   - This file may supply ONE missing official lower-right ecosystem toolbar.

   IT DOES NOT OWN:
   - 333 / AutoPopulate tickers
   - breadcrumbs or learner/profile routing
   - Class Tools / learner rails
   - course-specific presentation helpers
   - curriculum, assessments, mastery, grades, storage, learner records
   - typography normalization or document-wide DOM repair

   Stability rule: one startup pass; no MutationObserver, polling loop,
   resize remount, whole-document scan, element deletion, or course mutation.
*/
(()=>{"use strict";
if(window.__KHAEMENES_HIGH_GLOBAL_CHROME_V2__)return;
window.__KHAEMENES_HIGH_GLOBAL_CHROME_V2__=true;

const VNV="https://vervenveda.com/assets/";
const HIGH="https://vervenveda.com/Khaemenes_High.github.io/";
const HEADER="vnv-header-autopopulate.js";
const TOOLBAR="vnv-ecosystem-toolbar.js";
const HEADER_ID="vnvHeaderAutoPopulate";
const TOOLBAR_ID="vnvEcosystemUtilityDock";

function scriptFor(filename){
  return [...document.scripts].find(node=>{
    try{
      const url=new URL(node.src,location.href);
      return url.pathname.endsWith("/"+filename);
    }catch{return false}
  })||null;
}

function loadOnce(filename,dataKey,readyCheck){
  try{if(readyCheck?.())return Promise.resolve(true)}catch{}
  const existing=scriptFor(filename);
  if(existing){
    return new Promise(resolve=>{
      let done=false;
      const finish=value=>{if(done)return;done=true;clearTimeout(timer);resolve(value)};
      const timer=setTimeout(()=>finish(Boolean(readyCheck?.())),1800);
      existing.addEventListener("load",()=>finish(Boolean(readyCheck?.())),{once:true});
      existing.addEventListener("error",()=>finish(false),{once:true});
      queueMicrotask(()=>{try{if(readyCheck?.())finish(true)}catch{}});
    });
  }
  return new Promise(resolve=>{
    const node=document.createElement("script");
    node.src=VNV+filename;
    node.defer=true;
    node.dataset[dataKey]="true";
    let done=false;
    const finish=value=>{if(done)return;done=true;clearTimeout(timer);resolve(value)};
    const timer=setTimeout(()=>finish(Boolean(readyCheck?.())),1800);
    node.addEventListener("load",()=>finish(Boolean(readyCheck?.())),{once:true});
    node.addEventListener("error",()=>finish(false),{once:true});
    (document.head||document.documentElement).appendChild(node);
  });
}

function gradeFromPath(){
  const grade=location.pathname.match(/\/grade-(09|10|11|12)(?:\/|$)/i);
  if(grade)return grade[1];
  const english=location.pathname.match(/\/english-(9|10|11|12)(?:\/|$)/i);
  if(english)return english[1].padStart(2,"0");
  if(/integrated-science-9|social-studies\/grade-09/i.test(location.pathname))return "09";
  if(/biology-10|social-studies\/grade-10/i.test(location.pathname))return "10";
  if(/chemistry-11|social-studies\/grade-11/i.test(location.pathname))return "11";
  if(/physics-engineering-12|social-studies\/grade-12/i.test(location.pathname))return "12";
  return "";
}

function profileHref(){
  const grade=gradeFromPath();
  return grade
    ? HIGH+"grades/grade-"+grade+"/student-profile/"
    : HIGH+"#student-portal";
}

function pageAlreadyOwnsHeader(){
  return Boolean(
    document.getElementById(HEADER_ID) ||
    document.querySelector("header[data-khae-header]") ||
    document.querySelector("body > header, header[role='banner']")
  );
}

async function ensureHeader(){
  if(pageAlreadyOwnsHeader())return;
  await loadOnce(HEADER,"khaemenesHighHeader",()=>Boolean(window.VNV_HEADER?.mount));
  if(pageAlreadyOwnsHeader()||!window.VNV_HEADER?.mount)return;
  try{
    const root=window.VNV_HEADER.mount({
      replaceLegacy:false,
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
    if(root)root.dataset.khaemenesHighCanonicalHeader="minimal-v3";
  }catch{}
}

async function ensureToolbar(){
  if(document.getElementById(TOOLBAR_ID))return;
  await loadOnce(TOOLBAR,"khaemenesHighToolbar",()=>Boolean(window.VNVEcosystemToolbar?.mount));
  if(document.getElementById(TOOLBAR_ID)||!window.VNVEcosystemToolbar?.mount)return;
  try{window.VNVEcosystemToolbar.mount()}catch{}
  const dock=document.getElementById(TOOLBAR_ID);
  if(dock)dock.dataset.khaemenesHighCanonicalToolbar="minimal-v3";
}

async function start(){
  if(!document.body)return;
  document.documentElement.dataset.khaemenesHighChrome="minimal-v3";
  await Promise.allSettled([ensureHeader(),ensureToolbar()]);
  window.dispatchEvent(new CustomEvent("khaemenes-high-chrome-ready",{detail:{
    version:"3.0.0",
    header:Boolean(document.getElementById(HEADER_ID)||document.querySelector("header[data-khae-header]")),
    toolbar:Boolean(document.getElementById(TOOLBAR_ID))
  }}));
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",start,{once:true});
}else{
  start();
}
})();
