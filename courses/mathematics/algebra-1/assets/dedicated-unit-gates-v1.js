(()=>{
"use strict";
const MASTERY=80;
const current=document.currentScript;
const deepSrc=new URL("deep-lesson-engine-v1.js",current?.src||location.href).href;
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function config(){return window.KhaemenesAlgebra1DedicatedGateConfig||null}
function authority(){return window.KhaemenesAlgebra1MasteryAuthority||null}
function data(c){return c?window[`KHAE_UNIT${String(c.unit).padStart(2,"0")}`]||null:null}
function lessonWeek(c,n){return Number(c?.lesson_weeks?.[Number(n)-1])||null}
function unitUnlocked(c,A){if(c.unit<=1)return true;if(!A.unitMastered(c.unit-1))return false;if(c.unit>=7&&!A.midtermMastered())return false;return true}
function lessonUnlocked(c,A,n){if(!unitUnlocked(c,A))return false;if(n<=1)return true;if(!A.lessonMastered(c.unit,n-1))return false;const priorWeek=lessonWeek(c,n-1),currentWeek=lessonWeek(c,n);if(priorWeek&&currentWeek&&currentWeek>priorWeek&&!A.weekMastered(priorWeek))return false;return true}
function allLessonsMastered(c,A,D){return Array.isArray(D?.lessons)&&D.lessons.length>0&&D.lessons.every(l=>A.lessonMastered(c.unit,l.number))}
function allWeeksMastered(c,A){const weeks=[...new Set((c.lesson_weeks||[]).map(Number).filter(Number.isFinite))];return weeks.length>0&&weeks.every(w=>A.weekMastered(w))}
function rootFromMode(mode){return ["lesson","mastery","practice"].includes(mode)?"../../../":"../../"}
function lock(title,detail,href){const main=document.getElementById("main");if(!main)return;const c=config(),mode=document.body?.dataset?.mode||"",root=rootFromMode(mode);main.innerHTML=`<section class="hero"><div class="wrap"><p class="eyebrow">Strict 80% Mastery Gate</p><h1>${esc(title)}</h1><p class="lead">${esc(detail)}</p><div class="nav"><a class="btn primary" href="${esc(href)}">Return to required mastery step</a><a class="btn" href="${root}index.html">Course Home</a></div></div></section><section class="block"><div class="wrap"><article class="card"><h2>Progression rule</h2><p>Algebra I requires at least ${MASTERY}% on the prerequisite lesson, graded weekly gate, unit mastery check, and cumulative gate where applicable. A below-target attempt remains evidence but does not unlock the next graded stage.</p></article></div></section>`;if(c)document.body.dataset.masteryLocked="true"}
function prerequisite(c,A,D,mode,lessonNumber){
 const root=rootFromMode(mode);
 if(!A)return {ok:false,title:"Mastery evidence unavailable",detail:"The canonical Algebra I mastery authority could not be loaded. This page is locked rather than guessing at progression.",href:root+"index.html"};
 if(!unitUnlocked(c,A)){
  const midterm=c.unit>=7&&!A.midtermMastered();
  return {ok:false,title:`Unit ${String(c.unit).padStart(2,"0")} is locked`,detail:midterm?`Full mixed-evidence Midterm mastery at ${MASTERY}% is required throughout second-half Algebra I progression.`:`Reach ${MASTERY}% mastery on Unit ${String(c.unit-1).padStart(2,"0")} before beginning this unit.`,href:midterm?`${root}assessments/midterm-units-01-06.html`:`${root}units/unit-${String(c.unit-1).padStart(2,"0")}/assessment/mastery-check.html`};
 }
 if(mode==="lesson"){
  const n=Number(lessonNumber);if(!lessonUnlocked(c,A,n)){
   const priorWeek=lessonWeek(c,n-1),currentWeek=lessonWeek(c,n),weekBlocked=priorWeek&&currentWeek&&currentWeek>priorWeek&&A.lessonMastered(c.unit,n-1)&&!A.weekMastered(priorWeek);
   return {ok:false,title:`Lesson ${String(n).padStart(2,"0")} is locked`,detail:weekBlocked?`Reach ${MASTERY}% on Week ${String(priorWeek).padStart(2,"0")} mastery before beginning the next instructional week.`:`Reach ${MASTERY}% on Lesson ${String(n-1).padStart(2,"0")} before opening this lesson.`,href:weekBlocked?`../../../assessments/weekly-mastery.html?week=${priorWeek}`:`${D?.lessons?.[n-2]?.file||"../index.html"}`};
  }
 }
 if(mode==="mastery"){
  if(!allLessonsMastered(c,A,D))return {ok:false,title:`Unit ${String(c.unit).padStart(2,"0")} mastery is locked`,detail:`Every lesson check in this unit must reach ${MASTERY}% before formal unit mastery opens.`,href:"../index.html"};
  if(!allWeeksMastered(c,A))return {ok:false,title:`Unit ${String(c.unit).padStart(2,"0")} mastery is locked`,detail:`Every graded weekly mastery gate assigned to this unit must reach ${MASTERY}% before formal unit mastery opens.`,href:"../../../assessments/weekly-mastery.html"};
 }
 return {ok:true};
}
function before(){const c=config(),A=authority(),D=data(c),mode=document.body?.dataset?.mode||"",lesson=Number(document.body?.dataset?.lesson||0);if(!c||!D){lock("Unit configuration unavailable","The dedicated-unit gate could not confirm this page's curriculum metadata.",rootFromMode(mode)+"index.html");return false}const p=prerequisite(c,A,D,mode,lesson);if(!p.ok){lock(p.title,p.detail,p.href);return false}return true}
function disableLink(a,text){if(!a)return;a.removeAttribute("href");a.setAttribute("aria-disabled","true");a.classList.remove("primary");a.textContent=text;a.addEventListener("click",e=>e.preventDefault())}
function loadLearningExperience(){
 if(window.KhaemenesAlgebra1LearningExperience){window.KhaemenesAlgebra1LearningExperience.enhance();return}
 if(document.getElementById("algebra1DeepLessonEngine"))return;
 const s=document.createElement("script");s.id="algebra1DeepLessonEngine";s.src=deepSrc;s.defer=true;s.onload=()=>window.KhaemenesAlgebra1LearningExperience?.enhance();s.onerror=()=>console.warn("Algebra I deep lesson engine could not load; core lesson remains available.");document.head.appendChild(s);
}
function after(){const c=config(),A=authority(),D=data(c),mode=document.body?.dataset?.mode||"";if(!c||!A||!D||document.body.dataset.masteryLocked==="true")return;if(mode==="unit"){
  [...document.querySelectorAll('a[href^="lessons/"]')].forEach(a=>{const i=D.lessons.findIndex(l=>a.getAttribute("href")===`lessons/${l.file}`);if(i<0)return;const l=D.lessons[i];if(!lessonUnlocked(c,A,l.number)){const priorWeek=lessonWeek(c,l.number-1),currentWeek=lessonWeek(c,l.number),weekBlocked=l.number>1&&priorWeek&&currentWeek&&currentWeek>priorWeek&&A.lessonMastered(c.unit,l.number-1)&&!A.weekMastered(priorWeek);disableLink(a,weekBlocked?`Locked · Week ${String(priorWeek).padStart(2,"0")} must reach 80%`:`Locked · Master Lesson ${String(l.number-1).padStart(2,"0")} at 80%`)}else if(A.lessonMastered(c.unit,l.number)){const tag=document.createElement("span");tag.className="pill";tag.textContent="80% mastery met";a.closest("article")?.prepend(tag)}});
  const mastery=[...document.querySelectorAll('a[href="assessment/mastery-check.html"]')].at(-1);if(mastery&&(!allLessonsMastered(c,A,D)||!allWeeksMastered(c,A)))disableLink(mastery,!allLessonsMastered(c,A,D)?"Mastery Check Locked · Complete all lesson gates":"Mastery Check Locked · Complete all weekly gates");
 }else if(mode==="lesson"){
  const result=document.getElementById("result");if(result&&!document.getElementById("dedicatedGateNotice")){const p=document.createElement("p");p.id="dedicatedGateNotice";p.className="notice";p.innerHTML=`<strong>Progression gate:</strong> this lesson check must reach ${MASTERY}%. At an instructional-week boundary, the prior weekly mastery check must also reach ${MASTERY}% before the next lesson opens.`;result.before(p)}
 }
 loadLearningExperience();
}
window.KhaemenesAlgebra1DedicatedGate={version:"1.1",before,after,lessonUnlocked,allLessonsMastered,allWeeksMastered};
})();
