(() => {
"use strict";

const scriptEl=document.currentScript;
const coreSrc=new URL("prealgebra-archaemenes-upgrade-core.js",scriptEl?.src||location.href).href;
const FAMILY_REGISTRY="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js";
const CALCULATOR="https://vervenveda.com/proresource_hub.github.io/Protools/Khaemenes_Scientific_Calculator/";
const ROUTES=new Map([
 ["https://vervenveda.com/arcade.github.io/a_sacred_geometry_game_index.html","https://vervenveda.com/arcade.github.io/Geometry/sacred_geometry_game_index.html"],
 ["https://vervenveda.com/arcade.github.io/a_mandala_rings_game_index.html","https://vervenveda.com/arcade.github.io/Geometry/mandala_rings_game_index.html"],
 ["../tools/calculator",CALCULATOR]
]);

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
  if(Array.isArray(window.APP?.tools)){
   window.APP.tools.forEach(tool=>{
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
function courseState(){try{return typeof state!=="undefined"&&state&&Array.isArray(state.students)?state:null}catch{return null}}
function persistCourseState(){try{if(typeof save==="function")save()}catch{}}

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

function loadCore(){
 const core=document.createElement("script");
 core.src=coreSrc;
 core.async=false;
 core.onload=installRouteGuard;
 core.onerror=()=>console.error("Pre-Algebra hardening core could not load.");
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

prepareRegistryAndLoadCore();
})();