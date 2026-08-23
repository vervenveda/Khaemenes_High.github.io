(()=>{
"use strict";
const MASTERY=80;
const WEEKLY_KEY="khaemenes-algebra1-weekly-mastery-v2";
const MIDTERM_KEY="khaemenes-algebra1-midterm-result-v1";
const FINAL_KEY="khaemenes-algebra1-final-result-v1";
const safe=(key,fallback=null)=>{try{const value=JSON.parse(localStorage.getItem(key)||"null");return value&&typeof value==="object"?value:fallback}catch{return fallback}};
const numeric=value=>{const n=Number(value);return Number.isFinite(n)?n:null};
const unitId=n=>String(Number(n)).padStart(2,"0");
const dedicatedKey=n=>`khaemenes-algebra1-unit${unitId(n)}-a3-v1`;
const sharedKey=n=>`khaemenes-algebra1-unit${unitId(n)}-progress-v1`;
function unitRecords(n){return {dedicated:safe(dedicatedKey(n),null),shared:safe(sharedKey(n),null)}}
function unitEvidence(n){
 const unit=Number(n),records=unitRecords(unit),candidates=[];
 const dedicatedBest=numeric(records.dedicated?.best?.mastery);
 if(dedicatedBest!==null)candidates.push({source:"dedicated-a3",score:dedicatedBest,key:dedicatedKey(unit)});
 const sharedBest=numeric(records.shared?.scores?.mastery);
 if(sharedBest!==null)candidates.push({source:"shared-progress",score:sharedBest,key:sharedKey(unit)});
 if(Array.isArray(records.shared?.completed)&&records.shared.completed.includes("mastery")&&sharedBest===null)candidates.push({source:"shared-progress-completed",score:MASTERY,key:sharedKey(unit)});
 candidates.sort((a,b)=>b.score-a.score);
 const best=candidates[0]||null;
 return {unit,threshold:MASTERY,mastery:!!best&&best.score>=MASTERY,best:best?.score??null,source:best?.source??null,key:best?.key??null,candidates};
}
function lessonEvidence(unitNumber,lessonNumber,lessonId=null){
 const unit=Number(unitNumber),lesson=Number(lessonNumber),records=unitRecords(unit),candidates=[];
 const dedicated=numeric(records.dedicated?.best?.[`lesson-${lesson}`]);
 if(dedicated!==null)candidates.push({source:"dedicated-a3",score:dedicated,key:dedicatedKey(unit)});
 if(lessonId){
  const shared=numeric(records.shared?.scores?.[lessonId]);
  if(shared!==null)candidates.push({source:"shared-progress",score:shared,key:sharedKey(unit)});
  if(Array.isArray(records.shared?.completed)&&records.shared.completed.includes(lessonId)&&shared===null)candidates.push({source:"shared-progress-completed",score:MASTERY,key:sharedKey(unit)});
 }
 candidates.sort((a,b)=>b.score-a.score);
 const best=candidates[0]||null;
 return {unit,lesson,lesson_id:lessonId,threshold:MASTERY,mastery:!!best&&best.score>=MASTERY,best:best?.score??null,source:best?.source??null,key:best?.key??null,candidates};
}
function weekEvidence(n){
 const week=Number(n),store=safe(WEEKLY_KEY,{weeks:{}}),record=store?.weeks?.[week]||store?.weeks?.[String(week)]||null,best=numeric(record?.best),attemptMastery=Array.isArray(record?.attempts)&&record.attempts.some(a=>a?.mastery_met===true);
 return {week,threshold:MASTERY,mastery:(best!==null&&best>=MASTERY)||attemptMastery,best,source:WEEKLY_KEY};
}
function cumulativeEvidence(key){
 const record=safe(key,null),attempts=Array.isArray(record?.attempt_history)?record.attempt_history:[],valid=attempts.filter(a=>a?.mastery===true&&!a?.legacy_selected_only&&a?.constructed_response?.review_complete===true),scores=valid.map(a=>numeric(a?.overall_percent)).filter(v=>v!==null),best=scores.length?Math.max(...scores):null;
 return {key,threshold:MASTERY,mastery:best!==null&&best>=MASTERY,best,reviewed_mastery_attempts:valid.length};
}
function allUnitsMastered(first=1,last=13){for(let n=Number(first);n<=Number(last);n++)if(!unitEvidence(n).mastery)return false;return true}
function allWeeksMastered(first=2,last=36){for(let n=Number(first);n<=Number(last);n++)if(!weekEvidence(n).mastery)return false;return true}
window.KhaemenesAlgebra1MasteryAuthority={
 version:"1.0",
 threshold:MASTERY,
 keys:{weekly:WEEKLY_KEY,midterm:MIDTERM_KEY,final:FINAL_KEY,dedicatedUnit:dedicatedKey,sharedUnit:sharedKey},
 unitEvidence,
 unitMastered:n=>unitEvidence(n).mastery,
 lessonEvidence,
 lessonMastered:(u,l,id=null)=>lessonEvidence(u,l,id).mastery,
 weekEvidence,
 weekMastered:n=>weekEvidence(n).mastery,
 cumulativeEvidence,
 midtermEvidence:()=>cumulativeEvidence(MIDTERM_KEY),
 midtermMastered:()=>cumulativeEvidence(MIDTERM_KEY).mastery,
 finalEvidence:()=>cumulativeEvidence(FINAL_KEY),
 finalMastered:()=>cumulativeEvidence(FINAL_KEY).mastery,
 allUnitsMastered,
 allWeeksMastered
};
})();
