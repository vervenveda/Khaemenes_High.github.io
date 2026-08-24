(()=>{
"use strict";
const VERSION="1.1";
const script=document.currentScript;
function ensureResponsiveLayout(){
 if(document.querySelector('link[data-algebra1-responsive="v1"]'))return;
 const link=document.createElement("link");
 link.rel="stylesheet";
 link.href=new URL("responsive-layout-v1.css",script?.src||location.href).href;
 link.dataset.algebra1Responsive="v1";
 document.head.appendChild(link);
}
ensureResponsiveLayout();
const DIAGNOSTIC_RESULT_KEY="khaemenes-algebra1-diagnostic-result-v1";
const DIAGNOSTIC_DRAFT_KEY="khaemenes-algebra1-diagnostic-v1";
const DIAGNOSTIC_URL=new URL("../diagnostic/",script?.src||location.href).href;
const COURSE_URL=new URL("../",script?.src||location.href).href;
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const parse=(key)=>{try{return JSON.parse(localStorage.getItem(key)||"null")}catch{return null}};
function hasObjectEvidence(v){
 if(!v||typeof v!=="object")return false;
 if(Array.isArray(v.attempt_history)&&v.attempt_history.length)return true;
 if(Array.isArray(v.attempts)&&v.attempts.length)return true;
 if(v.lastResult||v.submitted||v.submitted_at)return true;
 if(v.best&&typeof v.best==="object"&&Object.keys(v.best).length)return true;
 if(v.scores&&typeof v.scores==="object"&&Object.keys(v.scores).length)return true;
 if(Array.isArray(v.completed)&&v.completed.length)return true;
 if(v.weeks&&typeof v.weeks==="object"&&Object.values(v.weeks).some(hasObjectEvidence))return true;
 return false;
}
function diagnosticComplete(){
 const r=parse(DIAGNOSTIC_RESULT_KEY);return hasObjectEvidence(r);
}
function courseEvidence(){
 const keys=[];
 for(let i=1;i<=13;i++){
  const n=String(i).padStart(2,"0");keys.push(`khaemenes-algebra1-unit${n}-a3-v1`,`khaemenes-algebra1-unit${n}-progress-v1`);
 }
 keys.push("khaemenes-algebra1-weekly-mastery-v2","khaemenes-algebra1-midterm-result-v1","khaemenes-algebra1-final-result-v1","khaemenes-algebra1-course-v1");
 return keys.some(k=>hasObjectEvidence(parse(k)));
}
function status(){const returning=courseEvidence(),diagnostic=diagnosticComplete();return {ready:diagnostic||returning,diagnostic_complete:diagnostic,returning_learner:returning};}
function routeLabel(){const s=status();if(s.returning_learner)return "Returning learner · course evidence found";if(s.diagnostic_complete)return "Readiness diagnostic complete";return "Readiness diagnostic required";}
function gatePanel(){return `<section class="hero"><div class="wrap"><p class="eyebrow">Algebra I · Week 1 Readiness Entrance</p><h1>Begin with the readiness diagnostic.</h1><p class="lead">Before a first-time learner enters Unit 01, complete the 36-question Algebra I readiness diagnostic. It is placement evidence, not a course grade. Returning learners with existing Algebra I course evidence are never forced backward through the entrance.</p><div class="actions"><a class="btn primary" href="${esc(DIAGNOSTIC_URL)}">Open Readiness Diagnostic</a><a class="btn" href="${esc(COURSE_URL)}">Course Home</a></div></div></section><section class="block"><div class="wrap"><article class="card"><h2>Why this comes first</h2><p>The diagnostic identifies prerequisite strengths and gaps so Foundation, Core, or Extended support can be chosen intentionally. Completing it opens the official Unit 01 pathway; the diagnostic score itself does not enter the Algebra I course grade.</p><p class="notice"><strong>Returning learner protection:</strong> if genuine Algebra I lesson, weekly, unit, midterm, final, or course evidence already exists on this device, the entrance gate yields to that evidence and the learner resumes normally.</p></article></div></section>`}
function blockUnitOnePage(){
 const path=location.pathname.toLowerCase();if(!/\/algebra-1\/units\/unit-01\//.test(path))return false;
 const s=status();if(s.ready)return false;
 const main=document.getElementById("main");if(!main)return false;
 document.body.dataset.algebra1EntryLocked="true";main.innerHTML=gatePanel();return true;
}
function markCourseHome(){
 if(!/\/algebra-1\/?(?:index\.html)?$/i.test(location.pathname))return;
 const s=status();document.documentElement.dataset.algebra1EntryReady=s.ready?"true":"false";
 const firstUnit=document.querySelector('#units a.card[data-unit="1"],#units a.card[href*="units/unit-01"]');
 const direct=[...document.querySelectorAll('a[href^="units/unit-01"],a[href*="/units/unit-01/"]')];
 if(!s.ready){
  direct.forEach(a=>{if(a.closest("#units")||a.closest("#lessons")||/Open Unit 01|Begin Unit 01/i.test(a.textContent||"")){a.dataset.originalHref=a.getAttribute("href")||"";a.setAttribute("href","diagnostic/");a.setAttribute("aria-label","Readiness diagnostic required before Unit 01");if(/Open Unit|Begin Unit|Open Lesson|Begin Lesson/i.test(a.textContent||""))a.textContent="Readiness Required";}});
  if(firstUnit){firstUnit.dataset.locked="true";firstUnit.setAttribute("aria-disabled","true");const note=document.createElement("p");note.className="notice";note.innerHTML="<strong>First-time entrance:</strong> complete the Week 1 readiness diagnostic before Unit 01 opens.";firstUnit.appendChild(note)}
 }else if(firstUnit){const p=document.createElement("p");p.className="eyebrow";p.textContent=s.returning_learner?"Resume pathway · prior Algebra I evidence found":"Readiness entrance complete";firstUnit.prepend(p)}
 const start=document.querySelector("#start .start-card:first-child")||document.querySelector("#start");if(start&&!document.getElementById("entryGateStatus")){const p=document.createElement("p");p.id="entryGateStatus";p.className="notice";p.innerHTML=`<strong>Entrance status:</strong> ${esc(routeLabel())}.`;start.appendChild(p)}
}
function protectClicks(){document.addEventListener("click",e=>{const a=e.target.closest('a[href*="units/unit-01"]');if(!a||status().ready)return;e.preventDefault();location.href=DIAGNOSTIC_URL},true)}
function boot(){markCourseHome();protectClicks();setTimeout(blockUnitOnePage,0);const main=document.getElementById("main");if(main&&/\/algebra-1\/units\/unit-01\//i.test(location.pathname)){new MutationObserver(()=>{if(!status().ready&&document.body.dataset.algebra1EntryLocked!=="true")blockUnitOnePage();else if(!status().ready&&document.body.dataset.algebra1EntryLocked==="true"&&!/Begin with the readiness diagnostic/i.test(main.textContent||""))blockUnitOnePage()}).observe(main,{childList:true,subtree:false})}}
window.KhaemenesAlgebra1EntryGate={version:VERSION,status,diagnosticComplete,courseEvidence,blockUnitOnePage};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
