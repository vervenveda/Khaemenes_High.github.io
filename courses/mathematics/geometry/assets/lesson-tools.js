(() => {
"use strict";
const id=document.body.dataset.lessonId;if(!id)return;
const MASTERY=80,KEY="khaemenes-geometry-lesson-progress-v1",ASSESS="khaemenes-geometry-assessment-records-v1",WEEK_STORE="khaemenes-geometry-weekly-mastery-v2";
const UNIT_WEEKS={1:[1,2],2:[3,4,5],3:[6,7,8],4:[9,10],5:[11,12,13],6:[14,15,16,17],7:[19,20,21],8:[22,23,24],9:[25,26,27],10:[28,29],11:[30,31],12:[32,33,34],13:[35,36]};
const LESSON_GROUPS={1:[[1,2,3],[4,5,6]],2:[[1,2,3],[4,5],[6,7]],3:[[1,2,3],[4,5],[6,7]],4:[[1,2,3],[4,5,6]],5:[[1,2,3],[4,5],[6,7]],6:[[1,2],[3,4],[5,6],[7,8]],7:[[1,2,3],[4,5],[6,7]],8:[[1,2,3],[4,5,6],[7,8]],9:[[1,2,3],[4,5],[6,7]],10:[[1,2,3,4],[5,6,7]],11:[[1,2,3,4],[5,6,7]],12:[[1,2,3],[4,5],[6,7]],13:[[1,2,3],[4,5,6]]};
const m=id.match(/^u(\d{2})-l(\d{2})$/);if(!m)return;const unit=Number(m[1]),lesson=Number(m[2]);
function parse(key,fallback={}){const S=window.KhaemenesMathStorageAdapter;if(S?.readJSON)return S.readJSON(key,fallback)||fallback;try{return JSON.parse(localStorage.getItem(key)||"null")||fallback}catch{return fallback}}
function save(data){const S=window.KhaemenesMathStorageAdapter;if(S?.writeJSON){const result=S.writeJSON(KEY,data)||{};return result.persisted===true&&(result.verified!==false)}try{const raw=JSON.stringify(data);localStorage.setItem(KEY,raw);return localStorage.getItem(KEY)===raw}catch{return false}}
function score(v){const n=Number(v);return Number.isFinite(n)&&n>=0&&n<=100?n:null}
function lessonMastered(key){const r=parse(KEY,{})[key],best=score(r?.bestScore??r?.score);return best!==null&&best>=MASTERY&&(r?.mastery===true||r?.complete===true)}
function unitMastered(n){const rec=parse(ASSESS,{})[`unit-${String(n).padStart(2,"0")}`],best=score(rec?.bestScore);return (best!==null&&best>=MASTERY)||Array.isArray(rec?.attempts)&&rec.attempts.some(a=>{const s=score(a?.score??a?.percent);return s!==null&&s>=MASTERY})}
function midtermMastered(){const rec=parse(ASSESS,{})["midterm"],best=score(rec?.bestScore);return best!==null&&best>=MASTERY||Array.isArray(rec?.attempts)&&rec.attempts.some(a=>{const s=score(a?.score??a?.percent);return s!==null&&s>=MASTERY})}
function finalMastered(){const rec=parse(ASSESS,{})["final"],best=score(rec?.bestScore);return best!==null&&best>=MASTERY||Array.isArray(rec?.attempts)&&rec.attempts.some(a=>{const s=score(a?.score??a?.percent);return s!==null&&s>=MASTERY})}
function weekMastered(n){const r=parse(WEEK_STORE,{weeks:{}})?.weeks?.[n],best=score(r?.best);return (best!==null&&best>=MASTERY)||Boolean(r?.attempts?.some(a=>{const s=score(a?.score??a?.percent);return a?.mastery_met===true&&s!==null&&s>=MASTERY}))}
function unitLessonIds(n){const groups=LESSON_GROUPS[Number(n)]||[];return groups.flat().map(i=>`u${String(n).padStart(2,"0")}-l${String(i).padStart(2,"0")}`)}
function unitProgressionComplete(n){const u=Number(n),ids=unitLessonIds(u),weeks=UNIT_WEEKS[u]||[];return unitMastered(u)&&ids.length>0&&ids.every(lessonMastered)&&weeks.length>0&&weeks.every(weekMastered)}
function boundaryPreviousWeek(){const groups=LESSON_GROUPS[unit]||[],weeks=UNIT_WEEKS[unit]||[],i=groups.findIndex(g=>g.includes(lesson));return i>0&&groups[i][0]===lesson?weeks[i-1]:null}
function unitEntryReady(){if(unit===1)return true;if(unit===7)return unitProgressionComplete(6)&&midtermMastered();return unitProgressionComplete(unit-1)}
function unlocked(){if(!unitEntryReady())return false;if(lesson===1)return true;if(!lessonMastered(`u${String(unit).padStart(2,"0")}-l${String(lesson-1).padStart(2,"0")}`))return false;const priorWeek=boundaryPreviousWeek();return priorWeek==null||weekMastered(priorWeek)}
function requirement(){if(!unitEntryReady())return unit===7?`the complete Unit 06 lesson, weekly, and unit evidence chain plus the Midterm at ${MASTERY}%`:`the complete Unit ${String(unit-1).padStart(2,"0")} lesson, weekly, and unit evidence chain at ${MASTERY}%`;const priorWeek=boundaryPreviousWeek();if(priorWeek!=null&&!weekMastered(priorWeek))return`Week ${priorWeek} mastery at ${MASTERY}%`;return`Lesson ${String(lesson-1).padStart(2,"0")} at ${MASTERY}%`}
function lockPage(){const main=document.getElementById("lessonMain");if(!main)return;main.innerHTML=`<section class="lesson-header"><p class="eyebrow">Strict 80% Mastery Gate</p><h1>This Geometry lesson is locked</h1><p>Complete ${requirement()} before opening this lesson.</p><div class="actions"><a class="btn primary" href="../index.html">Return to Unit</a><a class="btn" href="../../../index.html">Course Home</a></div></section>`}
if(!unlocked()){lockPage();return}
let data=parse(KEY,{}),old=data[id]||{},best=Number(old.bestScore??old.score)||0,rec={complete:best>=MASTERY&&(old.mastery===true||old.complete===true),note:String(old.note||""),updated:old.updated||null,bestScore:best,mastery:best>=MASTERY&&(old.mastery===true||old.complete===true),attempts:Array.isArray(old.attempts)?old.attempts:[]};
const box=document.getElementById("lessonComplete"),note=document.getElementById("lessonNote"),status=document.getElementById("lessonStatus");if(box){box.checked=rec.mastery;box.disabled=true;box.setAttribute("aria-describedby","lessonStatus")}if(note)note.value=rec.note;
const completion=box?.closest("section")||box?.parentElement?.parentElement;if(completion&&!document.getElementById("lessonMasteryScore")){const gate=document.createElement("div");gate.className="lesson-mastery-gate";gate.innerHTML=`<h3>Lesson mastery gate</h3><p>Score the completed lesson/worksheet evidence from 0–100. A score of ${MASTERY}% or higher is required before progression.</p><label>Evaluator lesson score<input id="lessonMasteryScore" type="number" min="0" max="100" step="1" value="${rec.bestScore||""}" inputmode="numeric"></label><button class="btn primary" id="saveLessonMastery" type="button">Record Mastery Attempt</button><p class="notice">Lower attempts remain in local history for correction and retake. At a week boundary, the weekly 80% gate must also be met before the next lesson opens.</p>`;completion.insertBefore(gate,completion.firstChild)}
function nextStepSpec(){
 const groups=LESSON_GROUPS[unit]||[],weeks=UNIT_WEEKS[unit]||[];
 const groupIndex=groups.findIndex(g=>g.includes(lesson));
 const group=groups[groupIndex]||[];
 const currentWeek=weeks[groupIndex]||null;
 if(!rec.mastery){
   return {label:"Review and retry",title:"Master this lesson before moving on",text:`Best score: ${rec.bestScore||0}%. Review the worked reasoning, correct errors, and record ${MASTERY}% mastery before progression.`,href:"#lessonMain",action:"Review Lesson"};
 }
 const position=group.indexOf(lesson);
 if(position>=0&&position<group.length-1){
   const next=group[position+1];
   return {label:"Continue learning",title:`Lesson ${String(next).padStart(2,"0")}`,text:"This lesson is mastered. Continue to the next unlocked lesson in the current week.",href:`u${String(unit).padStart(2,"0")}-l${String(next).padStart(2,"0")}.html`,action:"Next Lesson"};
 }
 if(currentWeek&&!weekMastered(currentWeek)){
   return {label:"Weekly mastery required",title:`Week ${currentWeek} Mastery`,text:`The assigned lesson block is complete. Demonstrate ${MASTERY}% weekly mastery before the next lesson block opens.`,href:`../../../assessments/weekly-mastery.html?week=${currentWeek}`,action:"Open Weekly Mastery"};
 }
 if(groupIndex>=0&&groupIndex<groups.length-1){
   const next=groups[groupIndex+1][0];
   return {label:"Continue learning",title:`Lesson ${String(next).padStart(2,"0")}`,text:"Weekly mastery is recorded. Continue to the next lesson block.",href:`u${String(unit).padStart(2,"0")}-l${String(next).padStart(2,"0")}.html`,action:"Next Lesson"};
 }
 if(!unitMastered(unit)){
   return {label:"Unit mastery required",title:`Unit ${String(unit).padStart(2,"0")} Mastery`,text:"All unit lessons and weekly gates are complete. Demonstrate unit mastery before advancing.",href:"../assessment/mastery-check.html",action:"Open Unit Mastery"};
 }
 if(unit===6&&!midtermMastered()){
   return {label:"Cumulative evidence required",title:"Midterm Examination",text:"Unit 06 is mastered. Complete the Midterm at 80% before Unit 07 opens.",href:"../../../assessments/midterm.html",action:"Open Midterm"};
 }
 if(unit<13){
   const nextUnit=unit+1;
   return {label:"Continue learning",title:`Unit ${String(nextUnit).padStart(2,"0")} · Lesson 01`,text:"This unit is mastered. Continue to the next unlocked unit.",href:`../../unit-${String(nextUnit).padStart(2,"0")}/lessons/u${String(nextUnit).padStart(2,"0")}-l01.html`,action:"Begin Next Unit"};
 }
 if(!finalMastered()){
   return {label:"Final evidence required",title:"Comprehensive Final Examination",text:"The full lesson sequence is complete. Finish the final examination and corrections.",href:"../../../assessments/final.html",action:"Open Final"};
 }
 return {label:"Course evidence complete",title:"Review Completion Record",text:"Final mastery is recorded. Review portfolio, capstone, and completion evidence with the evaluator.",href:"../../../records/course-completion-certificate.html",action:"Completion Record"};
}
window.KhaemenesGeometryProgressionContract=Object.freeze({version:"1.0.0",nextTarget:nextStepSpec});
function renderNextStep(){
 if(!completion)return;
 let card=document.getElementById("lessonNextStep");
 if(!card){card=document.createElement("div");card.id="lessonNextStep";card.className="lesson-next-step";completion.append(card)}
 const next=nextStepSpec();
 card.innerHTML=`<p class="next-step-label">${next.label}</p><h3>${next.title}</h3><p>${next.text}</p><div class="actions"><a class="btn primary" href="${next.href}">${next.action} →</a><a class="btn" href="../../../index.html">Course Home</a></div>`;
}
function updateStatus(){
 if(status)status.textContent=rec.mastery?`Mastery demonstrated · Best ${rec.bestScore}% · progression evidence recorded.`:`Not yet mastered · ${rec.bestScore?`best ${rec.bestScore}% · `:""}${MASTERY}% required.`;
 renderNextStep();
}
document.getElementById("saveLessonMastery")?.addEventListener("click",()=>{const scoreField=document.getElementById("lessonMasteryScore"),rawScore=scoreField?.value;const score=rawScore==null||String(rawScore).trim()===""?NaN:Number(rawScore);if(!Number.isFinite(score)||score<0||score>100){alert("Enter a score from 0 to 100.");return}rec.attempts.push({score,mastery_threshold:MASTERY,mastery_met:score>=MASTERY,recorded_at:new Date().toISOString(),classification:"local-evaluator-score"});rec.bestScore=Math.max(rec.bestScore||0,score);rec.mastery=rec.bestScore>=MASTERY;rec.complete=rec.mastery;rec.updated=new Date().toISOString();data[id]=rec;const persisted=save(data);if(!persisted){alert("This mastery attempt could not be verified as persistent. The progression record was not confirmed; export or copy important evidence before leaving.");return}if(box)box.checked=rec.mastery;updateStatus();alert(rec.mastery?"Lesson mastery recorded and verified. Continue to the weekly gate when this week's assigned lessons are complete.":`Score recorded and verified. ${MASTERY}% mastery is required before progression.`)});
document.getElementById("saveLessonNote")?.addEventListener("click",()=>{rec.note=note?.value.trim()||"";rec.updated=new Date().toISOString();data[id]=rec;const persisted=save(data);alert(persisted?"Lesson note saved and verified locally.":"Lesson note could not be verified as persistent. Copy or export it before leaving this page.")});document.getElementById("printLesson")?.addEventListener("click",()=>print());updateStatus();
})();
/* Shared Learn → Practice → Submit → Mastery → Review workflow. */
(()=>{
 const source=document.currentScript;
 function load(){
  if(document.getElementById("geometryWorkflowAdapterV1"))return;
  const s=document.createElement("script");s.id="geometryWorkflowAdapterV1";s.src=new URL("geometry-workflow-adapter-v1.js",source?.src||location.href).href;s.async=false;document.head.appendChild(s);
 }
 document.readyState==="loading"?document.addEventListener("DOMContentLoaded",load,{once:true}):load();
})();
;(()=>{if(document.querySelector('script[data-khae-video-companion]'))return;const s=document.createElement('script');s.src=new URL('../../assets/video-companion-v1.js',document.currentScript?.src||location.href).href;s.dataset.khaeVideoCompanion='1';document.head.appendChild(s)})();

/* Academy learner toolbar on course lessons, independently of grading. */
;(()=>{const toolbarSource=document.currentScript?.src||location.href;if(document.querySelector('script[src*="vnv-beta-link.js"]'))return;const mount=()=>{if(document.querySelector('script[src*="vnv-beta-link.js"]'))return;const script=document.createElement("script");script.src=new URL("../../../../assets/vnv-beta-link.js",toolbarSource).href;script.defer=true;script.dataset.academyLearnerToolbar="1";document.head.appendChild(script)};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",mount,{once:true}):mount()})();

;(()=>{if(document.querySelector('script[src*="geometry-presentation-unifier-v1.js"]'))return;const s=document.createElement("script");s.src=new URL("geometry-presentation-unifier-v1.js",document.currentScript?.src||location.href).href;s.defer=true;s.dataset.geometryPresentationUnifier="v1";document.head.appendChild(s)})();


/* Universal lesson-aware Learning Tools toolbar. Navigation/support only. */
;(()=>{
 if(document.getElementById("vnvClassToolsLessonLoader")||window.VNVClassToolsToolbar)return;
 const script=document.createElement("script");
 script.id="vnvClassToolsLessonLoader";
 script.src="https://vervenveda.com/assets/vnv-class-tools-toolbar.js?v=1.5.0";
 script.defer=true;
 script.dataset.vnvClassTools="lesson-aware";
 script.onerror=()=>console.warn("Learning Tools toolbar unavailable; lesson content remains usable.");
 (document.head||document.documentElement).appendChild(script);
})();


/* Shared High School mathematics hardening layer. */
;(()=>{
 if(window.KhaemenesMathHardeningLoader||document.getElementById("khaeMathHardeningLoaderScript"))return;
 const s=document.createElement("script");
 s.id="khaeMathHardeningLoaderScript";
 s.src=new URL("../../assets/math-hardening-loader-v1.js",document.currentScript?.src||location.href).href;
 s.async=false;
 s.onerror=()=>console.warn("Shared mathematics hardening layer unavailable; existing course behavior remains active.");
 (document.head||document.documentElement).appendChild(s);
})();
