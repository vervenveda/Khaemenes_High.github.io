"use strict";
(()=>{
if(window.KhaemenesPreAlgebraCumulativeGate)return;
const MASTERY=80,WEEKLY_VERSION="prealgebra-weekly-mastery-v2";
const LESSON_COUNTS={1:6,2:8,3:8,4:8,5:8,6:7,7:8,8:8,9:7,10:8,11:8,12:8,13:5};
const UNIT_WEEKS={1:[2,3],2:[4,5,6],3:[7,8,9],4:[10,11,12],5:[13,14,15],6:[16,17],7:[18,19,20],8:[21,22,23],9:[24,25],10:[26,27,28,29],11:[30,31,32],12:[33,34,35],13:[36]};
const pad=n=>String(Number(n)).padStart(2,"0");
const parse=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}};
const score=v=>{const n=Number(v);return Number.isFinite(n)&&n>=0&&n<=100?n:null};
function resultBest(r){
 if(!r||typeof r!=="object")return null;
 const attempts=Array.isArray(r.attempts)?r.attempts:[];
 const values=[r.best_percent,r.percent,r.latest_percent,r.bestScore,...attempts.map(a=>a?.percent??a?.overall_percent??a?.selected_response_percent)].map(score).filter(v=>v!==null);
 return values.length?Math.max(...values):null;
}
function unitMastered(n){
 const prefix="khaemenes-prealgebra-u"+pad(n)+"-mastery-v";
 try{for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key?.startsWith(prefix)){const best=resultBest(parse(key));if(best!==null&&best>=MASTERY)return true}}}catch{}
 return false;
}
function lessonsMastered(n){
 const count=LESSON_COUNTS[Number(n)]||0,record=parse("khaemenes-prealgebra-unit"+pad(n)+"-progress-v1"),scores=record?.lessonBestScores||{};
 if(!count||!record)return false;
 for(let i=1;i<=count;i++){const best=score(scores["l"+String(i).padStart(2,"0")]);if(best===null||best<MASTERY)return false}
 return true;
}
function courseStudent(){
 const state=parse("KHAE_OPEN_PREALGEBRA_FORGE_V2");
 if(!state||!Array.isArray(state.students))return null;
 return state.students.find(s=>s?.id===state.activeId)||null;
}
function validWeeklyAttempt(a){
 const s=score(a?.score);
 return a&&a.assessment_version===WEEKLY_VERSION&&Number(a.question_count)===10&&Array.isArray(a.question_ids)&&a.question_ids.length===10&&new Set(a.question_ids).size===10&&Array.isArray(a.dimensions)&&a.dimensions.length===10&&s!==null;
}
function weekMastered(w){
 const student=courseStudent(),attempts=student?.progress?.weeks?.[w]?.quiz?.attempts;
 if(!Array.isArray(attempts))return false;
 return attempts.some(a=>validWeeklyAttempt(a)&&score(a.score)>=MASTERY);
}
function weeksMastered(n){const weeks=UNIT_WEEKS[Number(n)]||[];return weeks.length>0&&weeks.every(weekMastered)}
function unitProgressionComplete(n){return unitMastered(n)&&lessonsMastered(n)&&weeksMastered(n)}
function midtermMastered(){
 const record=parse("khaemenes-prealgebra-midterm-result-v2"),attempts=Array.isArray(record?.attempts)?record.attempts:[];
 return attempts.some(a=>{
  const selected=score(a?.selected_response_percent),constructed=score(a?.constructed_response?.percent),overall=score(a?.overall_percent);
  return a?.mastery_met===true&&a?.constructed_response?.review_complete===true&&selected!==null&&selected>=MASTERY&&constructed!==null&&constructed>=MASTERY&&overall!==null&&overall>=MASTERY;
 });
}
function missing(lastUnit,{requireMidterm=false}={}){
 const out=[];
 for(let n=1;n<=Number(lastUnit);n++){
  if(!lessonsMastered(n))out.push("Unit "+pad(n)+" lesson mastery evidence complete at "+MASTERY+"%");
  if(!weeksMastered(n))out.push("Unit "+pad(n)+" weekly mastery evidence complete at "+MASTERY+"%");
  if(!unitMastered(n))out.push("Unit "+pad(n)+" unit mastery at "+MASTERY+"%");
 }
 if(requireMidterm&&!midtermMastered())out.push("Reviewed Midterm mastery at "+MASTERY+"%");
 return out;
}
window.KhaemenesPreAlgebraCumulativeGate=Object.freeze({version:"1.0.0",threshold:MASTERY,lessonCounts:LESSON_COUNTS,unitWeeks:UNIT_WEEKS,unitMastered,lessonsMastered,weekMastered,weeksMastered,unitProgressionComplete,midtermMastered,missing});
})();
