/* Khaemenes Academy · Algebra II Mathematics Engine v2.3.0 adapter
 * Canonical course-wide lesson-shell normalizer.
 * Presentation/workflow only: preserves Algebra II progression, mastery rubric,
 * assessment content, learner scoping, note recovery and historical records.
 */
(()=>{"use strict";
if(window.KhaemenesAlgebra2LessonV2)return;
const VERSION="2.3.0",MASTERY=80,SHELL_PREFIX="khaemenes-algebra2-lesson-shell-v2";
let bound=false,observer=null;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const ensureSharedStyle=()=>{if(document.querySelector('link[data-khaemenes-math-engine-style]'))return;const l=document.createElement("link");l.rel="stylesheet";l.href="https://vervenveda.com/assets/khaemenes-math-engine-v2.css?v=2.2.1";l.dataset.khaemenesMathEngineStyle="v2.2.1";(document.head||document.documentElement).appendChild(l)};
const lessonId=()=>document.body?.dataset?.lessonId||"algebra2-lesson";
const unitNumber=()=>Number(lessonId().match(/^u(\d{2})-/)?.[1]||0);
const lessonNumber=()=>Number(lessonId().match(/-l(\d{2})$/)?.[1]||0);
const progress=()=>window.KhaemenesAlgebra2Progression||null;
const lessonEvidence=()=>progress()?.lessonEvidence?.(lessonId())||{};
const masteryScore=()=>{const e=lessonEvidence(),n=Number(e.best??e.bestScore??e.score);return Number.isFinite(n)?n:null};
const mastered=()=>{const e=lessonEvidence(),s=masteryScore();return e.mastery===true||(s!==null&&s>=Number(progress()?.MASTERY||MASTERY))};
const shellKey=()=>SHELL_PREFIX+":"+lessonId();
const readShell=()=>{try{return JSON.parse(localStorage.getItem(shellKey())||"{}")||{}}catch{return {}}};
const writeShell=v=>{try{const raw=JSON.stringify(v);localStorage.setItem(shellKey(),raw);return localStorage.getItem(shellKey())===raw}catch{return false}};
const defs=[
 ["worked","Worked Example","manual"],
 ["guided","Guided Practice","manual"],
 ["independent","Lesson Practice","manual"],
 ["error","Error Analysis","manual"],
 ["transfer","Global Application","manual"],
 ["feedback","Feedback & Revision","manual"],
 ["reflect","Reflection","reflection"],
 ["lesson-record","Your Lesson Record","reflection"],
 ["lesson-mastery","Lesson Mastery","mastery"]
];
function label(key){return defs.find(x=>x[0]===key)?.[1]||key}
function flowKey(section){
 const explicit=section?.dataset?.flowStep;
 if(explicit&&defs.some(x=>x[0]===explicit))return explicit;
 const text=(section?.querySelector("h2,h3")?.textContent||"").toLowerCase();
 if(/worked/.test(text))return "worked";
 if(/guided/.test(text))return "guided";
 if(/independent|practice/.test(text))return "independent";
 if(/error|mistake/.test(text))return "error";
 if(/transfer|apply/.test(text))return "transfer";
 if(/feedback|revision/.test(text))return "feedback";
 if(/reflect/.test(text))return "reflect";
 return "";
}
function wrap(section,key){
 if(!section||!key||section.closest("details.kme-algebra2-accordion"))return;
 const d=document.createElement("details");d.className="kme-lesson-accordion kme-algebra2-accordion";d.dataset.checklistSection=key;
 const s=document.createElement("summary");s.textContent=label(key);
 const b=document.createElement("div");b.className="kme-accordion-body";
 section.replaceWith(d);b.append(section);d.append(s,b);
}
function normalizeSections(){
 $$(".lesson-main .lesson-section,.lesson-main .algebra2-flow-card").forEach(section=>{const key=flowKey(section);if(key)wrap(section,key)});
 const record=$("#lessonNote")?.closest(".card");
 if(record&&!record.closest("details.kme-algebra2-accordion"))wrap(record,"lesson-record");
 const gate=$("#lessonMasteryScore")?.closest(".lesson-mastery-gate");
 if(gate&&!gate.closest("details.kme-algebra2-accordion"))wrap(gate,"lesson-mastery");
}
function installStyles(){
 if($("#khaemenesAlgebra2FineTune"))return;
 const style=document.createElement("style");style.id="khaemenesAlgebra2FineTune";
 style.textContent=`
html:root:root body{font-size:16px!important;line-height:1.68!important}
html:root:root body :is(p,li,label,a,button,input,select,textarea,summary,.notice,.feedback,small){font-size:max(16px,1em)!important}
html:root:root body :is(.eyebrow,.kicker,.algebra2-flow-kicker,.dialog-eyebrow,.dialog-kicker,.worksheet-kicker){font-size:14px!important;line-height:1.35!important;letter-spacing:.12em!important;text-transform:uppercase!important}
#main{max-width:100%;overflow-x:clip}
#main.wrap,.lesson-shell{width:min(calc(100% - 33px),1180px)!important;margin-inline:auto!important}
.lesson-layout{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:14px!important}
.lesson-side{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:14px!important;position:static!important}
details.kme-algebra2-accordion{margin:0 0 14px;border:3px solid #272033;border-radius:7px;overflow:hidden;background:#f7f0e3;color:#272033}
details.kme-algebra2-accordion>summary{min-height:55px;display:flex;align-items:center;padding:14px 18px;background:#272033;color:#fffaf0;cursor:pointer;list-style:none}
details.kme-algebra2-accordion>summary::-webkit-details-marker{display:none}
details.kme-algebra2-accordion>summary::after{content:"+";margin-left:auto;font-size:24px}
details.kme-algebra2-accordion[open]>summary::after{content:"−"}
details.kme-algebra2-accordion .kme-accordion-body{padding:0}
details.kme-algebra2-accordion :is(.lesson-section,.card,.lesson-mastery-gate){margin:0!important;border:0!important;border-radius:0!important;box-shadow:none!important}
.actions{display:flex!important;flex-wrap:wrap!important;gap:11px!important}
.actions .btn,.actions button{margin:0!important}
textarea{min-height:180px!important;padding:14px!important}
#algebra2LessonCompletion{margin:24px auto 55px}
.kme-algebra2-completion{border:3px solid #272033;border-radius:7px;background:#f7f0e3;color:#272033;padding:24px}
.kme-algebra2-completion h2{text-align:center;margin-top:0}
.kme-algebra2-completion-list{display:grid;gap:11px;margin:18px 0}
.kme-algebra2-completion-item{display:grid;grid-template-columns:33px minmax(0,1fr);gap:11px;align-items:center;border:1px solid #272033;border-radius:7px;padding:11px;background:#fffaf0}
.kme-algebra2-completion-jump{border:0;background:transparent;text-align:left;color:inherit;padding:0;cursor:pointer}
.kme-engine-locked{pointer-events:none;opacity:.55}
@media(max-width:900px){.lesson-side{grid-template-columns:1fr!important}}
@media(max-width:760px){#main.wrap,.lesson-shell{width:min(calc(100% - 24px),1180px)!important}}
@media print{details.kme-algebra2-accordion{border:0!important;background:#fff!important}details.kme-algebra2-accordion>summary{display:none!important}details.kme-algebra2-accordion:not([open])>.kme-accordion-body{display:block!important}.kme-algebra2-completion{display:none!important}html:root:root body{font-size:16px!important}}
`;
 document.head.append(style);
}
function done(key,mode){
 if(mode==="mastery")return mastered();
 if(mode==="reflection")return String($("#lessonNote")?.value||lessonEvidence()?.note||"").trim().length>=3;
 const state=readShell();return state.manual?.[key]===true;
}
function items(){const keys=new Set($$("[data-checklist-section]").map(x=>x.dataset.checklistSection));return defs.filter(([k])=>keys.has(k))}
function setManual(key,value){const def=defs.find(x=>x[0]===key);if(!def||def[2]!=="manual")return;const s=readShell();s.manual??={};s.manual[key]=Boolean(value);writeShell(s);renderChecklist();gateNext()}
function jump(key){const d=document.querySelector('[data-checklist-section="'+CSS.escape(key)+'"]');if(!d)return;d.open=true;d.scrollIntoView({behavior:"smooth",block:"start"});setTimeout(()=>d.querySelector(":scope > summary")?.focus({preventScroll:true}),300)}
function ensureCompletion(){
 if($("#algebra2LessonCompletion"))return;
 const anchor=$(".lesson-layout")||$("#main");if(!anchor)return;
 const section=document.createElement("section");section.id="algebra2LessonCompletion";
 section.innerHTML='<article class="kme-algebra2-completion"><h2>Lesson Completion Checklist</h2><p>Review every required section, save your reflection/evidence, and reach at least '+Number(progress()?.MASTERY||MASTERY)+'% using Algebra II\'s existing mastery rubric before continuing.</p><div id="algebra2LessonCompletionList" class="kme-algebra2-completion-list" aria-live="polite"></div><p id="algebra2LessonCompletionStatus" role="status"></p></article>';
 anchor.after(section);
}
function renderChecklist(){
 const target=$("#algebra2LessonCompletionList");if(!target)return;
 const xs=items();
 target.innerHTML=xs.map(([key,title,mode])=>{const isDone=done(key,mode),auto=mode!=="manual";return '<div class="kme-algebra2-completion-item'+(isDone?' is-complete':'')+'"><input type="checkbox" data-algebra2-check="'+key+'" '+(isDone?'checked ':'')+(auto?'disabled ':'')+'><button type="button" class="kme-algebra2-completion-jump" data-algebra2-jump="'+key+'"><span>'+title+'</span><small>'+(auto?(mode==="mastery"?'Completes from Algebra II\'s existing mastery record.':'Completes from saved lesson evidence.'):'Check after reviewing this section.')+'</small></button></div>'}).join("");
 const finished=xs.filter(([k,,m])=>done(k,m)).length,s=masteryScore(),threshold=Number(progress()?.MASTERY||MASTERY);
 const status=$("#algebra2LessonCompletionStatus");if(status)status.textContent=finished+" of "+xs.length+" sections complete · Algebra II mastery: "+(s===null?"not scored":s+"%")+" · "+(xs.length&&finished===xs.length&&mastered()?"Ready for the authorized next step.":"Complete every required section and reach "+threshold+"% mastery.");
}
function nextLink(){return document.querySelector('.lesson-hero .actions a.primary[href],.lesson-hero .actions a.primary[data-algebra2-progression-action],#lessonNextStep a.primary[href]')}
function gateNext(){
 const link=nextLink();if(!link)return;
 const ready=items().length>0&&items().every(([k,,m])=>done(k,m))&&mastered();
 const target=progress()?.nextTarget?.(unitNumber(),lessonNumber())||null;
 if(target?.href){link.dataset.algebra2TargetHref=target.href;link.dataset.algebra2TargetTitle=target.label||target.title||"Continue"}
 if(!link.dataset.algebra2TargetHref&&link.getAttribute("href"))link.dataset.algebra2TargetHref=link.getAttribute("href");
 link.dataset.algebra2ChecklistLocked=String(!ready);link.setAttribute("aria-disabled",String(!ready));
 if(ready){
  if(link.dataset.algebra2TargetHref)link.href=link.dataset.algebra2TargetHref;
  link.classList.remove("kme-engine-locked");
 }else{
  link.href="#algebra2LessonCompletion";link.classList.add("kme-engine-locked");
 }
}
function bind(){
 if(bound)return;bound=true;
 document.addEventListener("change",e=>{const box=e.target.closest("[data-algebra2-check]");if(box)setManual(box.dataset.algebra2Check,box.checked)});
 document.addEventListener("click",e=>{
  const jumpBtn=e.target.closest("[data-algebra2-jump]");if(jumpBtn)jump(jumpBtn.dataset.algebra2Jump);
  const next=e.target.closest('[data-algebra2-checklist-locked="true"]');if(next){e.preventDefault();e.stopImmediatePropagation();$("#algebra2LessonCompletion")?.scrollIntoView({behavior:"smooth",block:"start"})}
  if(e.target.closest("#saveLessonNote,#saveLessonMastery"))setTimeout(()=>{normalize();renderChecklist();gateNext()},40);
 },true);
 document.addEventListener("input",e=>{if(e.target.matches("#lessonNote"))setTimeout(()=>{renderChecklist();gateNext()},0)},{passive:true});
 window.addEventListener("storage",()=>{renderChecklist();gateNext()});
}
function observeDynamic(){
 if(observer)return;
 const main=$("#main");if(!main)return;
 observer=new MutationObserver(()=>requestAnimationFrame(()=>{normalizeSections();ensureCompletion();renderChecklist();gateNext()}));
 observer.observe(main,{childList:true,subtree:true});
 setTimeout(()=>{observer?.disconnect();observer=null},3000);
}
function normalize(){
 const main=$("#main");if(main){main.classList.add("khaemenes-math-engine");main.dataset.khaemenesMathEngine=VERSION}
 ensureSharedStyle();installStyles();normalizeSections();ensureCompletion();renderChecklist();gateNext();bind();observeDynamic();
 document.documentElement.dataset.khaemenesMathEngineActive=VERSION;
}
window.KhaemenesAlgebra2LessonV2=Object.freeze({version:VERSION,normalize,renderChecklist,gateNext});
const start=()=>{normalize();setTimeout(normalize,160);setTimeout(normalize,650)};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();

/* Shared High School mathematics hardening layer. */
;(()=>{
 if(window.KhaemenesMathHardeningLoader||document.getElementById("khaeMathHardeningLoaderScript"))return;
 const s=document.createElement("script");s.id="khaeMathHardeningLoaderScript";
 s.src=new URL("../../assets/math-hardening-loader-v1.js",document.currentScript?.src||location.href).href;s.async=false;
 s.onerror=()=>console.warn("Shared mathematics hardening layer unavailable; existing Algebra II lesson behavior remains active.");
 (document.head||document.documentElement).appendChild(s);
})();
