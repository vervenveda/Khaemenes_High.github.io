(() => {
"use strict";
const id=document.body.dataset.lessonId;if(!id)return;
const MASTERY=80,KEY="khaemenes-geometry-lesson-progress-v1",ASSESS="khaemenes-geometry-assessment-records-v1";
const m=id.match(/^u(\d{2})-l(\d{2})$/);if(!m)return;const unit=Number(m[1]),lesson=Number(m[2]);
function parse(key,fallback={}){try{return JSON.parse(localStorage.getItem(key)||"null")||fallback}catch{return fallback}}
function save(data){try{localStorage.setItem(KEY,JSON.stringify(data))}catch{}}
function lessonMastered(key){const r=parse(KEY,{})[key];return Number(r?.bestScore??r?.score)>=MASTERY&&r?.mastery===true}
function unitMastered(n){const rec=parse(ASSESS,{})[`unit-${String(n).padStart(2,"0")}`];return Number(rec?.bestScore)>=MASTERY||rec?.mastery===true||Array.isArray(rec?.attempts)&&rec.attempts.some(a=>Number(a.score)>=MASTERY)}
function unlocked(){if(lesson>1)return lessonMastered(`u${String(unit).padStart(2,"0")}-l${String(lesson-1).padStart(2,"0")}`);return unit===1||unitMastered(unit-1)}
function lockPage(){const main=document.getElementById("lessonMain");if(!main)return;const requirement=lesson>1?`Lesson ${String(lesson-1).padStart(2,"0")} at ${MASTERY}%`:`Unit ${String(unit-1).padStart(2,"0")} mastery at ${MASTERY}%`;main.innerHTML=`<section class="lesson-header"><p class="eyebrow">Strict 80% Mastery Gate</p><h1>This Geometry lesson is locked</h1><p>Complete ${requirement} before opening this lesson.</p><div class="actions"><a class="btn primary" href="../index.html">Return to Unit</a><a class="btn" href="../../../index.html">Course Home</a></div></section>`}
if(!unlocked()){lockPage();return}
let data=parse(KEY,{}),old=data[id]||{},rec={complete:Number(old.bestScore??old.score)>=MASTERY&&old.mastery===true,note:String(old.note||""),updated:old.updated||null,bestScore:Number(old.bestScore??old.score)||0,mastery:Number(old.bestScore??old.score)>=MASTERY&&old.mastery===true,attempts:Array.isArray(old.attempts)?old.attempts:[]};
const box=document.getElementById("lessonComplete"),note=document.getElementById("lessonNote"),status=document.getElementById("lessonStatus");
if(box){box.checked=rec.mastery;box.disabled=true;box.setAttribute("aria-describedby","lessonStatus")}
if(note)note.value=rec.note;
const completion=box?.closest("section")||box?.parentElement?.parentElement;
if(completion&&!document.getElementById("lessonMasteryScore")){
 const gate=document.createElement("div");gate.className="lesson-mastery-gate";gate.innerHTML=`<h3>Lesson mastery gate</h3><p>Score the completed lesson/worksheet evidence from 0–100. A score of ${MASTERY}% or higher is required before the next lesson unlocks.</p><label>Evaluator lesson score<input id="lessonMasteryScore" type="number" min="0" max="100" step="1" value="${rec.bestScore||""}" inputmode="numeric"></label><button class="btn primary" id="saveLessonMastery" type="button">Record Mastery Attempt</button><p class="notice">The score is browser-local evaluator evidence. Lower attempts are preserved and may be followed by corrections and a retake.</p>`;completion.insertBefore(gate,completion.firstChild)
}
function updateStatus(){if(!status)return;status.textContent=rec.mastery?`Mastery demonstrated · Best ${rec.bestScore}% · next lesson unlocked.`:`Not yet mastered · ${rec.bestScore?`best ${rec.bestScore}% · `:""}${MASTERY}% required to unlock the next lesson.`}
document.getElementById("saveLessonMastery")?.addEventListener("click",()=>{const input=document.getElementById("lessonMasteryScore"),score=Number(input?.value);if(!Number.isFinite(score)||score<0||score>100){alert("Enter a score from 0 to 100.");return}rec.attempts.push({score,mastery_threshold:MASTERY,mastery_met:score>=MASTERY,recorded_at:new Date().toISOString(),classification:"local-evaluator-score"});rec.bestScore=Math.max(rec.bestScore||0,score);rec.mastery=rec.bestScore>=MASTERY;rec.complete=rec.mastery;rec.updated=new Date().toISOString();data[id]=rec;save(data);if(box)box.checked=rec.mastery;updateStatus();if(rec.mastery)alert("Lesson mastery recorded. The next lesson is now unlocked on this device.");else alert(`Score recorded. ${MASTERY}% mastery is required before progression.`)});
document.getElementById("saveLessonNote")?.addEventListener("click",()=>{rec.note=note?.value.trim()||"";rec.updated=new Date().toISOString();data[id]=rec;save(data);alert("Lesson note saved locally.")});
document.getElementById("printLesson")?.addEventListener("click",()=>print());
updateStatus();
})();