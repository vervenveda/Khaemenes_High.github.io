(()=>{
"use strict";
if(window.KhaemenesMathStudentJourney)return;
const M=80,pad=n=>String(Number(n)||0).padStart(2,"0");
const activeLearner=()=>window.KhaemenesLearnerScope?.profile?.()||null;
const scopedStorageKey=k=>{const S=window.KhaemenesLearnerScope;if(!S||typeof S.scopedKey!=="function")return k;return S.scopedKey(k)||null};
const read=(k,f=null)=>{try{const target=scopedStorageKey(k);if(!target)return f;const v=JSON.parse(localStorage.getItem(target)||"null");return v&&typeof v==="object"?v:f}catch{return f}};
const bestFrom=r=>{if(!r||typeof r!=="object")return null;const vals=[r.bestScore,r.best_percent,r.percent,r.latest_percent,r.score,...(Array.isArray(r.attempts)?r.attempts.map(a=>a?.score??a?.percent):[])].map(Number).filter(Number.isFinite);return vals.length?Math.max(...vals):null};
const latestFrom=r=>{if(!r||typeof r!=="object")return null;const a=Array.isArray(r.attempts)?r.attempts:[];const last=a.at(-1);for(const v of [last?.score,last?.percent,r.score,r.latest_percent,r.percent]){const n=Number(v);if(Number.isFinite(n))return n}return null};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
function courseSlug(){const p=location.pathname.toLowerCase();if(p.includes("/pre-algebra/"))return"pre-algebra";if(p.includes("/algebra-1/"))return"algebra-1";if(p.includes("/geometry/"))return"geometry";if(p.includes("/algebra-2/"))return"algebra-2";return null}
function lessonHref(slug,u,l,lesson){if(slug==="algebra-1")return`units/unit-${pad(u)}/lessons/${lesson?.slug||"lesson-"+pad(l)}.html`;return`units/unit-${pad(u)}/lessons/u${pad(u)}-l${pad(l)}.html`}
function unitAssessmentHref(slug,u){return`units/unit-${pad(u)}/assessment/mastery-check.html`}
function titleFor(unit,lesson){return lesson?.title||`Lesson ${pad(lesson?.number||1)}`}
function metric(v){return v==null||v===""?"—":String(v)}
function renderCard(state){
 const hero=document.querySelector(".hero");if(!hero)return;
 let node=document.getElementById("mathStudentJourney");
 if(!node){node=document.createElement("section");node.id="mathStudentJourney";node.className="math-journey";node.setAttribute("aria-labelledby","mathStudentJourneyTitle");hero.insertAdjacentElement("afterend",node)}
 node.innerHTML=`<div class="math-journey-head"><div><p class="math-journey-kicker">Khaemenes Academy · Student Journey</p><h2 id="mathStudentJourneyTitle">Continue your mathematics course</h2><p class="math-journey-summary">${esc(state.summary)}</p></div><div class="math-journey-state">${esc(state.state)}</div></div><div class="math-journey-grid"><div class="math-journey-metric"><span>Current unit</span><strong>${esc(metric(state.unit))}</strong></div><div class="math-journey-metric"><span>Current lesson</span><strong>${esc(metric(state.lesson))}</strong></div><div class="math-journey-metric"><span>Latest score</span><strong class="score">${esc(state.latest==null?"—":Math.round(state.latest)+"%")}</strong></div><div class="math-journey-metric"><span>Best mastery</span><strong class="score">${esc(state.best==null?"—":Math.round(state.best)+"%")}</strong></div><div class="math-journey-metric"><span>Next requirement</span><strong>${esc(state.requirement)}</strong></div></div><div class="math-journey-next"><p><strong>${esc(state.nextTitle)}</strong>${esc(state.nextText)}</p><a class="math-journey-action" href="${esc(state.href)}">${esc(state.action)}</a></div><p class="math-journey-note">This summary reads existing learner-scoped course evidence. It does not award mastery, change scores, or bypass any course gate.</p>`;
}
async function preAlgebraState(){
 const profile=read("khaemenes-naib-readiness-profile-v1");
 if(!profile)return{state:"Readiness required",summary:"Begin with the readiness gateway so the course can place support appropriately.",unit:"Gateway",lesson:"Readiness",latest:null,best:null,requirement:"Readiness evidence",nextTitle:"Readiness Gateway",nextText:" Complete the diagnostic before the official sequence begins.",href:"diagnostic/",action:"Begin Readiness"};
 if(profile.route==="unit_0_refresher"){
   const ex=read("khaemenes-prealgebra-unit00-exit-v1"),best=bestFrom(ex),latest=latestFrom(ex);
   if(!(ex?.passed&&Number(best)>=M))return{state:"Support pathway",summary:"Your readiness evidence assigned the Unit 0 refresher before Unit 1.",unit:"Unit 00",lesson:"Foundations & Readiness",latest,best,requirement:"80% Unit 0 exit mastery",nextTitle:"Complete the refresher",nextText:" Finish Unit 0 and its exit gate before beginning the official 36-week course.",href:"units/unit-00/",action:"Continue Unit 0"};
 }
 const cm=await fetch("course-map.json",{cache:"no-cache"}).then(r=>r.ok?r.json():Promise.reject());
 for(const u of (cm.units||[]).filter(x=>Number(x.number)>=1&&Number(x.number)<=13)){
   const n=Number(u.number);
   const map=await fetch(`units/unit-${pad(n)}/unit-map.json`,{cache:"no-cache"}).then(r=>r.ok?r.json():null).catch(()=>null);
   if(!map)continue;
   const key=map.unit?.progress_key||`khaemenes-prealgebra-unit${pad(n)}-progress-v1`,p=read(key,{})||{},lessons=map.lessons||[];
   for(let i=0;i<lessons.length;i++){
     const l=lessons[i],id=l.id,best=Math.max(Number(p.lessonBestScores?.[id])||0,Number(p.lessonScores?.[id])||0),attempts=Array.isArray(p.lessonAttempts?.[id])?p.lessonAttempts[id]:[],latest=Number(p.lessonLatestScores?.[id]);const last=attempts.at(-1);const latestScore=Number.isFinite(latest)?latest:(Number.isFinite(Number(last?.percent))?Number(last.percent):(Number.isFinite(Number(p.lessonScores?.[id]))?Number(p.lessonScores[id]):null));
     if(best<M)return{state:best>0?"Review & retry":"Ready to learn",summary:`Unit ${pad(n)} is your current course position. The next lesson remains governed by the existing 80% mastery sequence.`,unit:`Unit ${pad(n)} · ${u.title}`,lesson:`L${pad(l.number)} · ${l.title}`,latest:latestScore,best:best||null,requirement:`${M}% lesson mastery`,nextTitle:titleFor(u,l),nextText:best>0?` Best ${Math.round(best)}%; review corrections and submit another attempt.`:" Begin the next unlocked lesson.",href:`units/unit-${pad(n)}/${l.file}`,action:best>0?"Review & Retry":"Continue Learning"};
   }
   const mr=read(`khaemenes-prealgebra-u${pad(n)}-mastery-v1`),ub=bestFrom(mr),ul=latestFrom(mr);
   if(!(Number(ub)>=M))return{state:"Unit mastery ready",summary:`Every lesson in Unit ${pad(n)} has reached the lesson threshold. The unit mastery check is the next gate.`,unit:`Unit ${pad(n)} · ${u.title}`,lesson:"All lessons mastered",latest:ul,best:ub,requirement:"80% unit mastery",nextTitle:`Unit ${pad(n)} Mastery Check`,nextText:" Demonstrate unit mastery before the next unit opens.",href:unitAssessmentHref("pre-algebra",n),action:"Open Mastery Check"};
 }
 return{state:"Course sequence mastered",summary:"The full Pre-Algebra unit sequence has recorded mastery. Continue to cumulative completion evidence.",unit:"13/13 mastered",lesson:"Sequence complete",latest:null,best:null,requirement:"Final course evidence",nextTitle:"Final Course Review",nextText:" Review cumulative evidence and complete the final assessment requirements.",href:"assessments/final-exam-36-weeks.html",action:"Open Final Review"};
}
function a1Latest(u,id){
 const p=read(`khaemenes-algebra1-unit${pad(u)}-progress-v1`,{}),a=Array.isArray(p?.attempts)?p.attempts.filter(x=>x?.key===id):[];const last=a.at(-1);return Number.isFinite(Number(last?.score))?Number(last.score):null
}
async function algebra1State(){
 const A=window.KhaemenesAlgebra1MasteryAuthority,D=window.ALGEBRA1_DATA;if(!A||!D)return null;
 for(const u of D.units||[]){
   const n=Number(u.number);
   if(n===7&&!A.midtermMastered())return{state:"Cumulative gate",summary:"Units 1–6 lead into the reviewed Midterm before Unit 07 opens.",unit:"Unit 07 pending",lesson:"Midterm gate",latest:A.midtermEvidence()?.best??null,best:A.midtermEvidence()?.best??null,requirement:"80% reviewed midterm",nextTitle:"Algebra I Midterm",nextText:" Complete the reviewed cumulative gate before continuing.",href:"assessments/midterm-units-01-06.html",action:"Open Midterm"};
   if(n>1&&!A.unitMastered(n-1))continue;
   const lessons=(D.lessons||[]).filter(l=>Number(l.unit)===n);
   for(const l of lessons){const ev=A.lessonEvidence(n,l.number,l.id);if(!ev.mastery)return{state:ev.best!=null?"Review & retry":"Ready to learn",summary:`Unit ${pad(n)} is the current Algebra I position. Progression still comes only from the canonical mastery authority.`,unit:`Unit ${pad(n)} · ${u.title}`,lesson:`L${pad(l.number)} · ${l.title}`,latest:a1Latest(n,l.id),best:ev.best,requirement:"80% lesson mastery",nextTitle:l.title,nextText:ev.best!=null?` Best ${Math.round(ev.best)}%; correct and submit another attempt.`:" Begin the next unlocked lesson.",href:lessonHref("algebra-1",n,l.number,l),action:ev.best!=null?"Review & Retry":"Continue Learning"}}
   const uv=A.unitEvidence(n);if(!uv.mastery)return{state:"Unit mastery ready",summary:`The lesson sequence for Unit ${pad(n)} is complete; the unit mastery gate remains authoritative.`,unit:`Unit ${pad(n)} · ${u.title}`,lesson:"Lesson sequence complete",latest:uv.best,best:uv.best,requirement:"80% unit mastery",nextTitle:`Unit ${pad(n)} Mastery Check`,nextText:" Complete the unit mastery check before advancing.",href:unitAssessmentHref("algebra-1",n),action:"Open Mastery Check"};
 }
 const fin=A.finalEvidence?.();return{state:"Course sequence mastered",summary:"All Algebra I units have recorded mastery. Continue to the final cumulative evidence.",unit:"13/13 mastered",lesson:"Sequence complete",latest:fin?.best??null,best:fin?.best??null,requirement:A.finalMastered?.()?"Completion review":"80% reviewed final",nextTitle:A.finalMastered?.()?"Completion Record":"Algebra I Final",nextText:A.finalMastered?.()?" Review the completed course evidence.":" Complete the reviewed final assessment.",href:A.finalMastered?.()?"records/course-completion-certificate.html":"assessments/final-exam-36-weeks.html",action:A.finalMastered?.()?"Review Completion":"Open Final"};
}
const GEO_WEEKS={1:[1,2],2:[3,4,5],3:[6,7,8],4:[9,10],5:[11,12,13],6:[14,15,16,17],7:[19,20,21],8:[22,23,24],9:[25,26,27],10:[28,29],11:[30,31],12:[32,33,34],13:[35,36]};
const GEO_GROUPS={1:[[1,2,3],[4,5,6]],2:[[1,2,3],[4,5],[6,7]],3:[[1,2,3],[4,5],[6,7]],4:[[1,2,3],[4,5,6]],5:[[1,2,3],[4,5],[6,7]],6:[[1,2],[3,4],[5,6],[7,8]],7:[[1,2,3],[4,5],[6,7]],8:[[1,2,3],[4,5,6],[7,8]],9:[[1,2,3],[4,5],[6,7]],10:[[1,2,3,4],[5,6,7]],11:[[1,2,3,4],[5,6,7]],12:[[1,2,3],[4,5],[6,7]],13:[[1,2,3],[4,5,6]]};
function geoUnitMastered(n){const r=read("khaemenes-geometry-assessment-records-v1",{})?.[`unit-${pad(n)}`];return r?.mastery===true||Number(r?.bestScore)>=M}
function geoMid(){const r=read("khaemenes-geometry-assessment-records-v1",{})?.midterm;return{mastery:r?.mastery===true||Number(r?.bestScore)>=M,best:bestFrom(r),latest:latestFrom(r)}}
function geoWeekMastered(n){const r=read("khaemenes-geometry-weekly-mastery-v2",{weeks:{}})?.weeks?.[n];return Number(r?.best)>=M||r?.attempts?.some(a=>a?.mastery_met===true)}
function geoLessonRecord(id){return read("khaemenes-geometry-lesson-progress-v1",{})?.[id]||null}
function geoLessonMastered(id){const r=geoLessonRecord(id);return Number(r?.bestScore??r?.score)>=M&&(r?.mastery===true||r?.complete===true)}
function geoBoundaryPreviousWeek(u,l){const groups=GEO_GROUPS[u]||[],weeks=GEO_WEEKS[u]||[],i=groups.findIndex(g=>g.includes(l));return i>0&&groups[i][0]===l?weeks[i-1]:null}
function geometryState(){
 const D=window.GEOMETRY_DATA;if(!D)return null;
 for(const u of D.units||[]){const n=Number(u.number);
   if(n===7&&!geoMid().mastery)return{state:"Cumulative gate",summary:"Geometry Unit 07 remains behind the reviewed Midterm gate.",unit:"Unit 07 pending",lesson:"Midterm gate",latest:geoMid().latest,best:geoMid().best,requirement:"80% Midterm mastery",nextTitle:"Geometry Midterm",nextText:" Complete the cumulative mastery gate before Unit 07.",href:"assessments/midterm.html",action:"Open Midterm"};
   if(n>1&&!geoUnitMastered(n-1))continue;
   for(const l of u.lessons||[]){if(geoLessonMastered(l.id))continue;const r=geoLessonRecord(l.id),priorWeek=geoBoundaryPreviousWeek(n,l.number);
     if(priorWeek&&!geoWeekMastered(priorWeek))return{state:"Weekly gate",summary:`The previous lesson block is complete, but Week ${priorWeek} mastery is required before the next Geometry lesson opens.`,unit:`Unit ${pad(n)} · ${u.title}`,lesson:`L${pad(l.number)} · ${l.title}`,latest:null,best:null,requirement:`80% Week ${priorWeek} mastery`,nextTitle:`Week ${priorWeek} Mastery`,nextText:" Complete the weekly gate to unlock the next lesson block.",href:`assessments/weekly-mastery.html?week=${priorWeek}`,action:"Open Weekly Mastery"};
     return{state:r?"Review & retry":"Ready to learn",summary:`Unit ${pad(n)} is the current Geometry position. Lesson, weekly, and unit gates remain unchanged.`,unit:`Unit ${pad(n)} · ${u.title}`,lesson:`L${pad(l.number)} · ${l.title}`,latest:latestFrom(r),best:bestFrom(r),requirement:"80% lesson mastery",nextTitle:l.title,nextText:r?` Best ${Math.round(bestFrom(r)||0)}%; review and record another evaluated attempt.`:" Begin the next unlocked lesson.",href:lessonHref("geometry",n,l.number,l),action:r?"Review & Retry":"Continue Learning"};
   }
   if(!geoUnitMastered(n)){const ar=read("khaemenes-geometry-assessment-records-v1",{})?.[`unit-${pad(n)}`];return{state:"Unit mastery ready",summary:`All Geometry lessons in Unit ${pad(n)} are complete. The unit mastery check is the next course gate.`,unit:`Unit ${pad(n)} · ${u.title}`,lesson:"Lesson sequence complete",latest:latestFrom(ar),best:bestFrom(ar),requirement:"80% unit mastery",nextTitle:`Unit ${pad(n)} Mastery Check`,nextText:" Complete the formal unit gate before advancing.",href:unitAssessmentHref("geometry",n),action:"Open Mastery Check"}}
 }
 const f=read("khaemenes-geometry-assessment-records-v1",{})?.final;return{state:"Course sequence mastered",summary:"The Geometry unit sequence is mastered. Continue to the comprehensive final evidence.",unit:"13/13 mastered",lesson:"Sequence complete",latest:latestFrom(f),best:bestFrom(f),requirement:(f?.mastery===true||Number(f?.bestScore)>=M)?"Completion review":"80% final mastery",nextTitle:"Geometry Final Examination",nextText:" Complete or review the final cumulative evidence.",href:"assessments/final.html",action:"Open Final"};
}
function algebra2State(){
 const P=window.KhaemenesAlgebra2Progression,D=window.ALGEBRA2_DATA;if(!P||!D)return null;
 if(!P.readinessRecorded())return{state:"Readiness required",summary:"Algebra II begins with readiness evidence before Unit 01 opens.",unit:"Gateway",lesson:"Readiness Diagnostic",latest:null,best:null,requirement:"80% readiness",nextTitle:"Algebra II Readiness",nextText:" Complete the readiness diagnostic before the advanced sequence.",href:"diagnostic/",action:"Begin Readiness"};
 for(const u of D.units||[]){const n=Number(u.number);
   if(!P.unitUnlocked(n)){if(n===7&&!P.midtermMastered()){const r=P.assessmentData()?.midterm;return{state:"Cumulative gate",summary:"Unit 07 remains locked until the reviewed Midterm reaches mastery.",unit:"Unit 07 pending",lesson:"Midterm gate",latest:latestFrom(r),best:bestFrom(r),requirement:"80% reviewed midterm",nextTitle:"Algebra II Midterm",nextText:" Complete the cumulative gate before continuing.",href:"assessments/midterm.html",action:"Open Midterm"}}continue}
   for(const l of u.lessons||[]){const ev=P.lessonEvidence(l.id);if(ev.mastery)continue;const r=P.readJSON("khaemenes-algebra2-lesson-progress-v1",{})?.[l.id]||null;
     return{state:r?"Review & retry":"Ready to learn",summary:`Unit ${pad(n)} is the current Algebra II position. The lesson mastery authority remains the sole unlock source.`,unit:`Unit ${pad(n)} · ${u.title}`,lesson:`L${pad(l.number)} · ${l.title}`,latest:latestFrom(r),best:ev.best,requirement:"80% lesson mastery",nextTitle:l.title,nextText:r?` Best ${Math.round(ev.best||0)}%; correct and submit another evaluated attempt.`:" Begin the next unlocked lesson.",href:lessonHref("algebra-2",n,l.number,l),action:r?"Review & Retry":"Continue Learning"};
   }
   if(!P.unitMastered(n)){const r=P.assessmentData()?.[`unit-${pad(n)}-mastery`];return{state:"Unit mastery ready",summary:`Every Algebra II lesson in Unit ${pad(n)} has reached mastery. The formal unit gate is next.`,unit:`Unit ${pad(n)} · ${u.title}`,lesson:"Lesson sequence complete",latest:latestFrom(r),best:bestFrom(r),requirement:"80% unit mastery",nextTitle:`Unit ${pad(n)} Mastery Check`,nextText:" Complete the formal unit assessment before advancing.",href:unitAssessmentHref("algebra-2",n),action:"Open Mastery Check"}}
 }
 const f=P.assessmentData()?.final;return{state:"Course sequence mastered",summary:"The Algebra II unit sequence is mastered. Continue to final cumulative evidence and completion review.",unit:"13/13 mastered",lesson:"Sequence complete",latest:latestFrom(f),best:bestFrom(f),requirement:P.recordMastered(f)?"Completion review":"80% final mastery",nextTitle:"Algebra II Final Examination",nextText:" Complete or review the final cumulative evidence.",href:"assessments/final.html",action:"Open Final"};
}
async function compute(){const slug=courseSlug();if(!slug)return null;if(!activeLearner())return{state:"Learner profile required",summary:"Select an Academy learner to display personal mathematics progress on this shared device. Course content remains available without changing any mastery records.",unit:"—",lesson:"—",latest:null,best:null,requirement:"Select active learner",nextTitle:"Academy Learner Profile",nextText:" Choose the learner whose progress should appear here.",href:"../../../index.html",action:"Select Learner"};if(slug==="pre-algebra")return preAlgebraState();if(slug==="algebra-1")return algebra1State();if(slug==="geometry")return geometryState();if(slug==="algebra-2")return algebra2State();return null}
let token=0;async function refresh(){const t=++token;try{const state=await compute();if(t!==token||!state)return;renderCard(state)}catch(e){console.warn("Math journey summary unavailable; course remains usable.",e)}}
function boot(){refresh();setTimeout(refresh,300);setTimeout(refresh,1200)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
window.addEventListener("pageshow",refresh);window.addEventListener("focus",refresh);document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")refresh()});
window.KhaemenesMathStudentJourney=Object.freeze({version:"1.1",refresh});
})();