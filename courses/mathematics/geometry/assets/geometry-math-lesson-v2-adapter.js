(()=>{"use strict";
 if(window.KhaemenesGeometryLessonV2)return;
 const VERSION="2.3.0",MASTERY=80,KEY="khaemenes-geometry-lesson-progress-v1";
 let bound=false,observer=null;
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const lessonId=()=>document.body?.dataset?.lessonId||"geometry-lesson";
 const unitNumber=()=>Number(lessonId().match(/^u(\d{2})-/)?.[1]||0);
 const lessonNumber=()=>Number(lessonId().match(/-l(\d{2})$/)?.[1]||0);
 const shellKey=()=>{const u=unitNumber();return "khaemenes-geometry-unit"+String(u).padStart(2,"0")+"-lesson-shell-v2"};
 const readJSON=(key,fallback={})=>{try{return JSON.parse(localStorage.getItem(key)||"null")||fallback}catch{return fallback}};
 let persistenceHealthy=true,persistenceError="";
 const writeJSON=(key,value)=>{try{const raw=JSON.stringify(value);localStorage.setItem(key,raw);const ok=localStorage.getItem(key)===raw;persistenceHealthy=ok;persistenceError=ok?"":"write-verification-mismatch";return ok}catch(error){persistenceHealthy=false;persistenceError=String(error?.name||error?.message||error||"storage-unavailable");return false}};
 const persistenceNote=()=>persistenceHealthy?"":" · Storage warning: checklist evidence is not verified as persistent. Export or copy important work before leaving.";
 const lessonRecord=()=>readJSON(KEY,{})[lessonId()]||{};
 const masteryScore=()=>Number(lessonRecord()?.bestScore??lessonRecord()?.score);
 const mastered=()=>Number.isFinite(masteryScore())&&masteryScore()>=MASTERY&&(lessonRecord()?.mastery===true||lessonRecord()?.complete===true);
 const shellState=()=>{const p=readJSON(shellKey(),{});p.manual??={};p.opened??={};p.noteSaved??={};return p};
 const saveShell=p=>writeJSON(shellKey(),p);
 const sectionDefs=[
  ["learning-intention","Learning Intention","manual"],
  ["visual-model","Visual Model","manual"],
  ["worked-reasoning","Worked Reasoning","manual"],
  ["geometry-practice","Geometry Practice","manual"],
  ["vocabulary","Vocabulary","manual"],
  ["learning-pathways","Learning Pathways","manual"],
  ["connected-studio","Connected Studio","manual"],
  ["reflection","Reflection & Local Evidence","reflection"],
  ["lesson-mastery","Lesson Mastery","mastery"]
 ];
 function classify(section){
  const text=(section.querySelector("h2,h3")?.textContent||"").trim().toLowerCase();
  if(/learning intention/.test(text))return "learning-intention";
  if(/visual model/.test(text))return "visual-model";
  if(/worked reasoning/.test(text))return "worked-reasoning";
  if(section.matches(".print-sheet")||/worksheet|practice/.test(text))return "geometry-practice";
  if(/vocabulary/.test(text))return "vocabulary";
  if(/learning pathways/.test(text))return "learning-pathways";
  if(/connected studio/.test(text))return "connected-studio";
  if(/local completion/.test(text))return "reflection";
  if(/lesson mastery gate/.test(text))return "lesson-mastery";
  return "";
 }
 function label(key){return sectionDefs.find(x=>x[0]===key)?.[1]||key}
 function wrapSection(section,key){
  if(!section||!key||section.closest("details.kme-geometry-accordion"))return;
  const details=document.createElement("details");
  details.className="kme-lesson-accordion kme-geometry-accordion";
  details.dataset.checklistSection=key;
  const summary=document.createElement("summary");
  summary.textContent=label(key);
  const body=document.createElement("div");
  body.className="kme-accordion-body";
  section.replaceWith(details); body.append(section); details.append(summary,body);
  details.addEventListener("toggle",()=>{if(details.open){const p=shellState();p.opened[lessonId()]??={};p.opened[lessonId()][key]=true;saveShell(p);renderChecklist();gateNext()}});
 }
 function normalizeSections(){
  $$(".lesson-main > section").forEach(section=>{const key=classify(section);if(key)wrapSection(section,key)});
  $$(".lesson-sidebar > section").forEach(section=>{const key=classify(section);if(key)wrapSection(section,key)});
  const completion=$("#lessonMasteryScore")?.closest(".lesson-mastery-gate");
  if(completion&&!completion.closest("details.kme-geometry-accordion"))wrapSection(completion,"lesson-mastery");
 }
 function installStyles(){
  if($("#khaemenesGeometryFineTune"))return;
  const style=document.createElement("style");style.id="khaemenesGeometryFineTune";
  style.textContent=`
   html:root:root body{font-family:"Brandon Grotesque","Avenir Next",Avenir,"Segoe UI",Arial,sans-serif!important;font-size:16px!important;line-height:1.68!important}
   html:root:root body :is(p,li,label,button,input,select,textarea,summary,.notice,.feedback){font-size:max(16px,1em)!important}\n   html:root:root body :is(.eyebrow,.kicker,.dialog-eyebrow,.dialog-kicker,.worksheet-kicker){font-size:16px!important;line-height:1.35!important;letter-spacing:.12em!important;text-transform:uppercase!important}\n   html:root:root body :is(h1,h2,h3,h4,.worksheet-title){font-family:Cinzel,"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif!important;font-weight:400!important}
   .lesson-shell{width:min(calc(100% - 33px),1180px)!important;margin-inline:auto!important}
   .lesson-layout{grid-template-columns:minmax(0,1fr)!important;gap:14px!important}
   .lesson-sidebar{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px!important}
   details.kme-geometry-accordion{margin:0 0 14px;border:3px solid #272033;border-radius:7px;overflow:hidden;background:#f2eadb;color:#272033}
   details.kme-geometry-accordion>summary{min-height:55px;display:flex;align-items:center;padding:14px 18px;background:#272033;color:#fffaf0;cursor:pointer;list-style:none}
   details.kme-geometry-accordion>summary::-webkit-details-marker{display:none}
   details.kme-geometry-accordion>summary::after{content:"+";margin-left:auto;font-size:24px}
   details.kme-geometry-accordion[open]>summary::after{content:"−"}
   details.kme-geometry-accordion .kme-accordion-body{padding:0}
   details.kme-geometry-accordion .visual-card,details.kme-geometry-accordion .print-sheet,details.kme-geometry-accordion .lesson-mastery-gate{margin:0!important;border:0!important;border-radius:0!important;box-shadow:none!important}
   .lesson-diagram{max-width:100%!important;height:auto!important}
   .worksheet-grid{grid-template-columns:1fr!important;gap:14px!important}
   .problem-box{position:relative;padding-left:55px!important}
   .problem-number{position:absolute!important;left:14px!important;top:14px!important}
   .answer-lines{min-height:110px!important}
   .actions{display:flex!important;flex-wrap:wrap!important;gap:11px!important}
   .actions .btn,.actions button{margin:0!important}
   textarea{min-height:180px!important;padding:14px!important}
   #geometryLessonCompletion{margin:24px auto 55px}
   .kme-geometry-completion{border:3px solid #272033;border-radius:7px;background:#f2eadb;color:#272033;padding:24px}
   .kme-geometry-completion h2{text-align:center;margin-top:0}
   .kme-geometry-completion-list{display:grid;gap:11px;margin:18px 0}
   .kme-geometry-completion-item{display:grid;grid-template-columns:33px minmax(0,1fr);gap:11px;align-items:center;border:1px solid #272033;border-radius:7px;padding:11px;background:#fffaf0}
   .kme-geometry-completion-jump{border:0;background:transparent;text-align:left;color:inherit;padding:0;cursor:pointer}
   .kme-geometry-status{margin:14px 0}
   .kme-engine-locked{pointer-events:none;opacity:.55}
   @media(max-width:760px){.lesson-shell{width:min(calc(100% - 24px),1180px)!important}.lesson-sidebar{grid-template-columns:1fr!important}.problem-box{padding-left:44px!important}}
   @media print{details.kme-geometry-accordion{border:0!important;background:#fff!important}details.kme-geometry-accordion>summary{display:none!important}details.kme-geometry-accordion:not([open])>.kme-accordion-body{display:block!important}.kme-geometry-completion{display:none!important}html:root:root body{font-size:16px!important}}
  `;
  document.head.append(style);
 }
 function items(){const keys=new Set($$("[data-checklist-section]").map(x=>x.dataset.checklistSection));return sectionDefs.filter(([key])=>keys.has(key))}
 function done(key,mode){
  if(mode==="mastery")return mastered();
  if(mode==="reflection"){
   const note=$("#lessonNote")?.value?.trim()||lessonRecord()?.note||"";
   return String(note).trim().length>=3;
  }
  const p=shellState();
  return p.manual?.[lessonId()]?.[key]===true;
 }
 function complete(){const xs=items();return xs.length>0&&xs.every(([k,,m])=>done(k,m))}
 function setManual(key,value){const def=sectionDefs.find(x=>x[0]===key);if(!def||def[2]!=="manual")return;const p=shellState();p.manual[lessonId()]??={};p.manual[lessonId()][key]=Boolean(value);saveShell(p);renderChecklist();gateNext()}
 function jump(key){const d=document.querySelector('[data-checklist-section="'+CSS.escape(key)+'"]');if(!d)return;if(d.tagName==="DETAILS")d.open=true;d.scrollIntoView({behavior:"smooth",block:"start"});setTimeout(()=>d.querySelector(":scope > summary")?.focus({preventScroll:true}),300)}
 function ensureCompletion(){
  if($("#geometryLessonCompletion"))return;
  const anchor=$(".lesson-layout")||$("#lessonMain");
  if(!anchor)return;
  const section=document.createElement("section");section.id="geometryLessonCompletion";
  section.innerHTML='<article class="kme-geometry-completion"><h2>Lesson Completion Checklist</h2><p>Review every Geometry section, save reflection/evidence, and reach at least '+MASTERY+'% using Geometry\'s existing lesson mastery gate before continuing.</p><div id="geometryLessonCompletionList" class="kme-geometry-completion-list" aria-live="polite"></div><p id="geometryLessonCompletionStatus" class="kme-geometry-status" role="status"></p></article>';
  anchor.after(section);
 }
 function renderChecklist(){
  const target=$("#geometryLessonCompletionList");if(!target)return;
  const xs=items();
  target.innerHTML=xs.map(([key,title,mode])=>{
   const isDone=done(key,mode),auto=mode!=="manual";
   return '<div class="kme-geometry-completion-item'+(isDone?' is-complete':'')+'"><input type="checkbox" data-geometry-check="'+key+'" '+(isDone?'checked ':'')+(auto?'disabled ':'')+'><button type="button" class="kme-geometry-completion-jump" data-geometry-jump="'+key+'"><span>'+title+'</span><small>'+(auto?(mode==="mastery"?'Completes from Geometry\'s 80% mastery record.':'Completes from saved lesson evidence.'):'Check after reviewing this section.')+'</small></button></div>';
  }).join("");
  const finished=xs.filter(([k,,m])=>done(k,m)).length,s=masteryScore();
  const status=$("#geometryLessonCompletionStatus");
  if(status)status.textContent=finished+" of "+xs.length+" sections complete · Geometry mastery: "+(Number.isFinite(s)?s+"%":"not scored")+" · "+(complete()&&mastered()?"Ready for the authorized next step.":"Complete every required section and reach 80% mastery.")+persistenceNote();
 }
 function progressionTarget(){try{return window.KhaemenesGeometryProgressionContract?.nextTarget?.()||null}catch{return null}}
 function nextLink(){
  const card=$("#lessonNextStep");if(!card)return null;
  return card.querySelector(".actions .btn.primary");
 }
 function gateNext(){
  const link=nextLink();if(!link)return;
  const ready=complete()&&mastered();
  const target=progressionTarget();
  const action=(target?.action||link.textContent||"").trim();
  const lessonProgression=/Next Lesson|Begin Next Unit/i.test(action);
  if(!lessonProgression)return;
  if(target?.href){link.dataset.geometryTargetHref=target.href;link.dataset.geometryTargetTitle=target.title||target.action||"Continue"}
  if(!link.dataset.geometryTargetHref)link.dataset.geometryTargetHref=link.getAttribute("href")||"#";
  link.dataset.geometryLocked=String(!ready);
  link.setAttribute("aria-disabled",String(!ready));
  if(ready){
   link.href=link.dataset.geometryTargetHref;link.classList.remove("kme-engine-locked");
  }else{
   link.href="#geometryLessonCompletion";link.classList.add("kme-engine-locked");
  }
 }
 function bind(){
  if(bound)return;bound=true;
  document.addEventListener("change",e=>{const box=e.target.closest("[data-geometry-check]");if(box)setManual(box.dataset.geometryCheck,box.checked)});
  document.addEventListener("click",e=>{
   const jumpBtn=e.target.closest("[data-geometry-jump]");if(jumpBtn)jump(jumpBtn.dataset.geometryJump);
   const next=e.target.closest('[data-geometry-locked="true"]');if(next){e.preventDefault();e.stopImmediatePropagation();$("#geometryLessonCompletion")?.scrollIntoView({behavior:"smooth",block:"start"})}
   if(e.target.closest("#saveLessonNote,#saveLessonMastery"))setTimeout(()=>{normalize();renderChecklist();gateNext()},30);
  },true);
  document.addEventListener("input",e=>{if(e.target.matches("#lessonNote"))setTimeout(()=>{renderChecklist();gateNext()},0)},{passive:true});
  window.addEventListener("storage",()=>{renderChecklist();gateNext()});
 }
 function observeDynamic(){
  if(observer)return;
  const main=$("#lessonMain");if(!main||$("#lessonMasteryScore"))return;
  observer=new MutationObserver(()=>{
   if(!$("#lessonMasteryScore"))return;
   observer.disconnect();observer=null;
   requestAnimationFrame(()=>{normalizeSections();ensureCompletion();renderChecklist();gateNext()});
  });
  observer.observe(main,{childList:true,subtree:true});
  setTimeout(()=>{observer?.disconnect();observer=null},3000);
 }
 function normalize(){
  const main=$("#lessonMain");if(main){main.classList.add("khaemenes-math-engine");main.dataset.khaemenesMathEngine=VERSION}
  installStyles();normalizeSections();ensureCompletion();renderChecklist();gateNext();bind();observeDynamic();
  document.documentElement.dataset.khaemenesMathEngineActive=VERSION;
 }
 window.KhaemenesGeometryLessonV2=Object.freeze({version:VERSION,normalize,renderChecklist,gateNext});
 const start=()=>{normalize();setTimeout(normalize,120);setTimeout(normalize,500)};
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();

/* Shared High School mathematics hardening layer.
   Non-destructive: verified storage, learner record, evidence authority and progression ledger. */
;(()=>{
 if(window.KhaemenesMathHardeningLoader||document.getElementById("khaeMathHardeningLoaderScript"))return;
 const s=document.createElement("script");
 s.id="khaeMathHardeningLoaderScript";
 s.src=new URL("../../assets/math-hardening-loader-v1.js",document.currentScript?.src||location.href).href;
 s.async=false;
 s.onerror=()=>console.warn("Shared mathematics hardening layer unavailable; existing lesson behavior remains active.");
 (document.head||document.documentElement).appendChild(s);
})();
