(() => {
"use strict";

const scriptEl=document.currentScript;
const coreSrc=new URL("prealgebra-archaemenes-upgrade-core.js",scriptEl?.src||location.href).href;
const readinessBridgeSrc=new URL("../../readiness/course-readiness-bridge.js",scriptEl?.src||location.href).href;
const FAMILY_REGISTRY="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js";
const CALCULATOR="https://vervenveda.com/proresource_hub.github.io/Protools/Khaemenes_Scientific_Calculator/";
const ROUTES=new Map([
 ["https://vervenveda.com/arcade.github.io/a_sacred_geometry_game_index.html","https://vervenveda.com/arcade.github.io/Geometry/sacred_geometry_game_index.html"],
 ["https://vervenveda.com/arcade.github.io/a_mandala_rings_game_index.html","https://vervenveda.com/arcade.github.io/Geometry/mandala_rings_game_index.html"],
 ["../tools/calculator",CALCULATOR]
]);

function courseApp(){try{return typeof APP!=="undefined"&&APP?APP:null}catch{return null}}
function courseState(){try{return typeof state!=="undefined"&&state&&Array.isArray(state.students)?state:null}catch{return null}}
function persistCourseState(){try{if(typeof save==="function")save()}catch{}}

function migrateLegacyDiagnosticWeek(){
 const course=courseState();
 if(!course)return;
 let changed=false;
 course.students.forEach(student=>{
  const progress=student?.progress;
  if(!progress||progress.placementWeekMigrationV1)return;
  progress.placement??={};
  if(progress.weeks?.[1]){
   progress.placement.legacyDiagnosticWeekRecord=progress.weeks[1];
   progress.placement.migratedAt=new Date().toISOString();
   delete progress.weeks[1];
  }
  progress.placementWeekMigrationV1=true;
  changed=true;
 });
 if(changed)persistCourseState();
}

function patchPlacementArchitecture(){
 const app=courseApp();
 if(!app||!Array.isArray(app.weeks)||!app.weeks.length)return;
 const diagnosticWeek=app.weeks.find(w=>w?.unitId==="u00");
 if(diagnosticWeek){
  app.placement={
   id:"precourse-placement",
   title:"Pre-Course Mathematics Placement",
   path:"../readiness/",
   oneTime:true,
   countsTowardCourse:false,
   note:"Complete once before course placement. Results may support NAIB placement into Pre-Algebra or Algebra I; this assessment is not an instructional week."
  };
  const weekOneSource=app.weeks.find(w=>w?.unitId==="u01")||{};
  const weekOne={
   ...weekOneSource,
   week:1,
   unitId:"u01",
   unitNumber:1,
   unitTitle:"Number Systems, Factors & Estimation",
   title:"Number Families, Real Numbers & Number-Line Reasoning",
   bigIdea:"Numbers can be classified, decomposed, compared, and estimated to support efficient reasoning.",
   path:"units/unit-01/",
   domain:"number"
  };
  app.weeks=app.weeks.map(w=>w.week===1?weekOne:w);
 }
 if(Array.isArray(app.units)){
  app.units=app.units.filter(u=>u?.id!=="u00");
  const u01=app.units.find(u=>u?.id==="u01");
  if(u01)u01.weeks=3;
 }
 migrateLegacyDiagnosticWeek();
 try{
  if(typeof activeWeek!=="undefined"&&(!Number.isFinite(activeWeek)||activeWeek<1))activeWeek=1;
  if(typeof render==="function")render();
 }catch(error){console.warn("Pre-Algebra curriculum rerender could not complete.",error)}
}

function canonicalRoute(value){
 if(!value)return value;
 if(ROUTES.has(value))return ROUTES.get(value);
 try{
  const url=new URL(value,location.href);
  if(url.pathname.endsWith("/arcade.github.io/a_sacred_geometry_game_index.html")){
   url.pathname="/arcade.github.io/Geometry/sacred_geometry_game_index.html";
   return url.href;
  }
  if(url.pathname.endsWith("/arcade.github.io/a_mandala_rings_game_index.html")){
   url.pathname="/arcade.github.io/Geometry/mandala_rings_game_index.html";
   return url.href;
  }
  if(url.pathname.endsWith("/Khaemenes_High.github.io/courses/mathematics/tools/calculator"))return CALCULATOR;
 }catch{}
 return value;
}

function patchResourceRoutes(root=document){
 try{
  const app=courseApp();
  if(Array.isArray(app?.tools)){
   app.tools.forEach(tool=>{
    if(/scientific calculator/i.test(String(tool?.name||"")))tool.url=CALCULATOR;
   });
  }
 }catch{}
 const scope=root.querySelectorAll?root:document;
 scope.querySelectorAll("[data-launch-url]").forEach(el=>{
  const next=canonicalRoute(el.getAttribute("data-launch-url"));
  if(next)el.setAttribute("data-launch-url",next);
 });
 scope.querySelectorAll("a[href]").forEach(a=>{
  const next=canonicalRoute(a.getAttribute("href"));
  if(next&&next!==a.getAttribute("href"))a.setAttribute("href",next);
 });
}

function installRouteGuard(){
 patchResourceRoutes();
 document.addEventListener("click",event=>{
  const target=event.target.closest?.("[data-launch-url],a[href]");
  if(!target)return;
  if(target.hasAttribute("data-launch-url"))target.setAttribute("data-launch-url",canonicalRoute(target.getAttribute("data-launch-url")));
  if(target.matches("a[href]"))target.setAttribute("href",canonicalRoute(target.getAttribute("href")));
 },true);
 const observer=new MutationObserver(records=>{
  records.forEach(record=>record.addedNodes.forEach(node=>{
   if(node.nodeType===1)patchResourceRoutes(node);
  }));
 });
 observer.observe(document.body,{childList:true,subtree:true});
}

function normalizeName(value){return String(value||"").trim().toLowerCase().replace(/\s+/g," ")}
function emptyProgress(){return {weeks:{},exams:{},capstone:{logs:[],score:0,rubric:{}}}}

function guardLegacyNicknameMigration(){
 const R=window.KhaemenesFamilyRegistry,course=courseState();
 if(!R||!course)return;
 let family=null;
 try{family=R.getFamily?.()||null}catch{}
 const learners=Array.isArray(family?.learners)?family.learners.filter(l=>l?.learnerId&&!l.selfDirectedAdult):[];
 if(!learners.length)return;
 const legacy=course.students.filter(s=>s&&!String(s.id||"").startsWith("academy:"));
 const learnersByName=new Map(),legacyByName=new Map();
 learners.forEach(l=>{const k=normalizeName(l.nickname);if(!k)return;const a=learnersByName.get(k)||[];a.push(l);learnersByName.set(k,a)});
 legacy.forEach(r=>{const k=normalizeName(r.name);if(!k)return;const a=legacyByName.get(k)||[];a.push(r);legacyByName.set(k,a)});
 let changed=false;
 learners.forEach(learner=>{
  const id=`academy:${learner.learnerId}`;
  if(course.students.some(s=>s?.id===id))return;
  const k=normalizeName(learner.nickname),learnerMatches=learnersByName.get(k)||[],legacyMatches=legacyByName.get(k)||[];
  const ambiguous=legacyMatches.length>0&&(legacyMatches.length!==1||learnerMatches.length!==1);
  if(!ambiguous)return;
  course.students.push({
   id,
   name:learner.nickname||"Learner",
   created:new Date().toISOString(),
   progress:emptyProgress(),
   migration:{
    status:"manual-review-required",
    reason:"ambiguous-legacy-nickname",
    legacy_record_ids:legacyMatches.map(r=>r.id||null).filter(Boolean),
    guarded_at:new Date().toISOString()
   }
  });
  changed=true;
 });
 if(changed)persistCourseState();
}

function loadReadinessBridge(){
 if(document.querySelector(`script[src="${readinessBridgeSrc}"]`))return;
 const bridge=document.createElement("script");
 bridge.src=readinessBridgeSrc;
 bridge.defer=true;
 bridge.onerror=()=>console.warn("Shared mathematics readiness bridge could not load.");
 document.head.appendChild(bridge);
}

function loadCore(){
 const core=document.createElement("script");
 core.src=coreSrc;
 core.async=false;
 core.onload=()=>{installRouteGuard();loadReadinessBridge();};
 core.onerror=()=>{console.error("Pre-Algebra hardening core could not load.");loadReadinessBridge();};
 document.head.appendChild(core);
}

function prepareRegistryAndLoadCore(){
 if(window.KhaemenesFamilyRegistry){guardLegacyNicknameMigration();loadCore();return}
 let registry=document.getElementById("khaemenesFamilyRegistryScript");
 if(registry){
  registry.addEventListener("load",()=>{guardLegacyNicknameMigration();loadCore()},{once:true});
  registry.addEventListener("error",loadCore,{once:true});
  return;
 }
 registry=document.createElement("script");
 registry.id="khaemenesFamilyRegistryScript";
 registry.src=FAMILY_REGISTRY;
 registry.defer=true;
 registry.onload=()=>{guardLegacyNicknameMigration();loadCore()};
 registry.onerror=loadCore;
 document.head.appendChild(registry);
}

patchPlacementArchitecture();
prepareRegistryAndLoadCore();
})();