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
const TYPO_STYLE="khaemenesHighTypographyStandardV1";
const PRIMARY_TITLE_ATTR="data-khaemenes-primary-title";

function installTypographyStandard(){
  if(!document.head)return;
  let style=document.getElementById(TYPO_STYLE);
  if(!style){
    style=document.createElement("style");
    style.id=TYPO_STYLE;
    style.textContent=`
/* Khaemenes Academy High School · canonical typography standard
   16px readable-text floor · 33px titles · one 66px primary page title. */
html:root body{
  font-size:16px!important;
}
html:root body :is(
  p,li,dt,dd,blockquote,figcaption,caption,legend,label,
  a,button,input,select,textarea,option,output,
  td,th,summary,small,strong,em,b,i,u,s,mark,time,
  .eyebrow,.kicker,.subtitle,.subheading,.lead,.description,
  .breadcrumbs,.breadcrumb,.badge,.chip,.pill,.status,.meta,
  .caption,.note,.helper,.hint,.message,.toast,
  .brand-name,.brand-sub,.menu-group,.menu-link,.menu-link small,.menu-link strong
){
  font-size:max(16px,1em)!important;
}
html:root body :is(h1,h2,h3,h4,h5,h6,[role="heading"],
  .page-title,.hero-title,.main-title,.section-title,.card-title,
  .display-title,.site-title,.brand-title,.modal-title,.dialog-title
){
  font-size:33px!important;
  line-height:1.2!important;
  font-weight:400!important;
  overflow-wrap:anywhere;
  text-wrap:balance;
}
html:root body [${PRIMARY_TITLE_ATTR}="true"]{
  font-size:66px!important;
  line-height:1.05!important;
  font-weight:400!important;
  overflow-wrap:anywhere;
  text-wrap:balance;
}
@media(max-width:560px){
  html:root body [${PRIMARY_TITLE_ATTR}="true"]{
    font-size:66px!important;
  }
}
@media print{
  html:root body{
    font-size:16px!important;
  }
}
`;
    document.head.append(style);
  }
  markPrimaryTitle();
  enforceReadableTextFloor();
}
function visibleElement(el){
  if(!el||!el.isConnected)return false;
  if(el.hidden||el.getAttribute("aria-hidden")==="true")return false;
  const cs=getComputedStyle(el);
  return cs.display!=="none"&&cs.visibility!=="hidden";
}
function primaryTitleCandidates(){
  return [
    ...document.querySelectorAll(
      'main .hero h1,main h1,.hero h1,[data-hero] h1,[data-page-hero] h1,h1,.hero-title,.main-title,.page-title'
    )
  ];
}
function markPrimaryTitle(){
  const current=document.querySelector('['+PRIMARY_TITLE_ATTR+'="true"]');
  if(current&&visibleElement(current))return current;
  document.querySelectorAll('['+PRIMARY_TITLE_ATTR+']').forEach(el=>el.removeAttribute(PRIMARY_TITLE_ATTR));
  const chosen=primaryTitleCandidates().find(el=>visibleElement(el))||null;
  if(chosen)chosen.setAttribute(PRIMARY_TITLE_ATTR,"true");
  return chosen;
}
function hasReadableText(el){
  if(!el||el.nodeType!==1)return false;
  if(el.matches("script,style,noscript,template,svg,svg *,canvas,iframe,br,hr,source,track,meta,link"))return false;
  const text=[...el.childNodes].some(n=>n.nodeType===Node.TEXT_NODE&&String(n.nodeValue||"").trim());
  const form=el.matches("input,select,textarea,button,option");
  return text||form;
}
function enforceReadableTextFloor(root=document.body){
  if(!root)return;
  const nodes=[];
  if(root.nodeType===1)nodes.push(root);
  if(root.querySelectorAll)nodes.push(...root.querySelectorAll("*"));
  for(const el of nodes){
    if(!hasReadableText(el))continue;
    if(el.matches("h1,h2,h3,h4,h5,h6,[role=heading],["+PRIMARY_TITLE_ATTR+"]"))continue;
    const size=parseFloat(getComputedStyle(el).fontSize||"0");
    if(size>0&&size<16){
      el.style.setProperty("font-size","16px","important");
      el.dataset.khaemenesMinText="16";
    }
  }
}
let typographyPending=false;
function scheduleTypography(){
  if(typographyPending)return;
  typographyPending=true;
  requestAnimationFrame(()=>{
    typographyPending=false;
    installTypographyStandard();
  });
}


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
  installTypographyStandard();
  await load(VNV+HEADER,"khaemenesHighHeader");
  mountHeader();
  await load(VNV+TOOLBAR,"khaemenesHighToolbar");
  mountToolbar();
  cleanupKnownFloaters();
  preserveExportMarker();
  if(typeof MutationObserver==="function"){
    new MutationObserver(()=>{mountHeader();mountToolbar();cleanupKnownFloaters();preserveExportMarker();scheduleTypography();})
      .observe(document.documentElement,{childList:true,subtree:true});
  }
  window.addEventListener("resize",scheduleTypography,{passive:true});
  document.documentElement.dataset.khaemenesHighTypography="16-33-66";
  document.documentElement.dataset.khaemenesHighChrome="v2";
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
else start();
})();