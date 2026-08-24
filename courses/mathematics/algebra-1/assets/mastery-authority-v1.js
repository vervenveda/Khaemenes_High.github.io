(()=>{
"use strict";
const authorityScript=typeof document!=="undefined"?document.currentScript:null;
function ensureResponsiveLayout(){
 if(typeof document==="undefined")return;
 if(document.querySelector('link[data-algebra1-responsive="v1"]'))return;
 const link=document.createElement("link");
 link.rel="stylesheet";
 link.href=new URL("responsive-layout-v1.css",authorityScript?.src||location.href).href;
 link.dataset.algebra1Responsive="v1";
 document.head.appendChild(link);
}
function ensureFocusedAssessment(){
 if(typeof document==="undefined"||typeof location==="undefined")return;
 const path=location.pathname.toLowerCase();
 const assessmentContext=/\/diagnostic\//.test(path)||/\/assessments\//.test(path)||/\/assessment\//.test(path)||document.body?.dataset?.mode==="mastery";
 if(!assessmentContext)return;
 if(window.KhaemenesAlgebra1FocusedAssessment||document.querySelector('script[data-algebra1-focused="v1"]'))return;
 const script=document.createElement("script");
 script.src=new URL("focused-assessment-v1.js",authorityScript?.src||location.href).href;
 script.async=false;
 script.dataset.algebra1Focused="v1";
 document.head.appendChild(script);
}
if(typeof document!=="undefined"){ensureResponsiveLayout();setTimeout(ensureFocusedAssessment,0)}
const MASTERY=80;
const WEEKLY_KEY="khaemenes-algebra1-weekly-mastery-v2";
const MIDTERM_KEY="khaemenes-algebra1-midterm-result-v1";
const FINAL_KEY="khaemenes-algebra1-final-result-v1";
const safe=(key,fallback=null)=>{try{const value=JSON.parse(localStorage.getItem(key)||"null");return value&&typeof value==="object"?value:fallback}catch{return fallback}};
const numeric=value=>{if(value===null||value===undefined||value==="")return null;const n=Number(value);return Number.isFinite(n)?n:null};
const unitId=n=>String(Number(n)).padStart(2,"0");
const lessonId=(u,l)=>`u${unitId(u)}-l${String(Number(l)).padStart(2,"0")}`;
const dedicatedKey=n=>`khaemenes-algebra1-unit${unitId(n)}-a3-v1`;
const sharedKey=n=>`khaemenes-algebra1-unit${unitId(n)}-progress-v1`;
const WEEK_LESSONS={
 2:[[1,1],[1,2],[1,3]],3:[[1,4],[1,5],[1,6]],
 4:[[2,1],[2,2]],5:[[2,3],[2,4],[2,5]],6:[[2,6],[2,7]],
 7:[[3,1],[3,2]],8:[[3,3],[3,4],[3,5]],9:[[3,6],[3,7]],
 10:[[4,1],[4,2],[4,3]],11:[[4,4],[4,5],[4,6]],
 12:[[5,1],[5,2]],13:[[5,3],[5,4],[5,5]],14:[[5,6],[5,7]],
 15:[[6,1],[6,2]],16:[[6,3],[6,4]],17:[[6,5],[6,6]],18:[[6,7],[6,8]],
 19:[[7,1],[7,2],[7,3]],20:[[7,4],[7,5]],21:[[7,6],[7,7]],
 22:[[8,1],[8,2],[8,3]],23:[[8,4],[8,5],[8,6]],
 24:[[9,1],[9,2],[9,3]],25:[[9,4],[9,5]],26:[[9,6],[9,7]],
 27:[[10,1],[10,2]],28:[[10,3],[10,4]],29:[[10,5],[10,6]],30:[[10,7],[10,8]],
 31:[[11,1],[11,2],[11,3]],32:[[11,4],[11,5],[11,6]],
 33:[[12,1],[12,2],[12,3]],34:[[12,4],[12,5]],35:[[12,6],[12,7]],
 36:[[13,1],[13,2],[13,3],[13,4],[13,5]]
};
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
function lessonEvidence(unitNumber,lessonNumber,lessonIdValue=null){
 const unit=Number(unitNumber),lesson=Number(lessonNumber),records=unitRecords(unit),candidates=[],id=lessonIdValue||lessonId(unit,lesson);
 const dedicated=numeric(records.dedicated?.best?.[`lesson-${lesson}`]);
 if(dedicated!==null)candidates.push({source:"dedicated-a3",score:dedicated,key:dedicatedKey(unit)});
 const shared=numeric(records.shared?.scores?.[id]);
 if(shared!==null)candidates.push({source:"shared-progress",score:shared,key:sharedKey(unit)});
 if(Array.isArray(records.shared?.completed)&&records.shared.completed.includes(id)&&shared===null)candidates.push({source:"shared-progress-completed",score:MASTERY,key:sharedKey(unit)});
 candidates.sort((a,b)=>b.score-a.score);
 const best=candidates[0]||null;
 return {unit,lesson,lesson_id:id,threshold:MASTERY,mastery:!!best&&best.score>=MASTERY,best:best?.score??null,source:best?.source??null,key:best?.key??null,candidates};
}
function weekLessonRefs(n){const week=Number(n);return (WEEK_LESSONS[week]||[]).map(([unit,lesson])=>({unit,lesson,lesson_id:lessonId(unit,lesson)}))}
function weekLessonEvidence(n){
 const week=Number(n),required=weekLessonRefs(week),evidence=required.map(ref=>({...ref,evidence:lessonEvidence(ref.unit,ref.lesson,ref.lesson_id)})),missing=evidence.filter(x=>!x.evidence.mastery);
 return {week,threshold:MASTERY,configured:week===1||required.length>0,mastery:week===1||(required.length>0&&missing.length===0),required,evidence,missing};
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
 version:"1.3",
 threshold:MASTERY,
 responsive_layout:"v1",
 focused_assessment:"v1.2",
 keys:{weekly:WEEKLY_KEY,midterm:MIDTERM_KEY,final:FINAL_KEY,dedicatedUnit:dedicatedKey,sharedUnit:sharedKey},
 weekLessonMap:WEEK_LESSONS,
 unitEvidence,
 unitMastered:n=>unitEvidence(n).mastery,
 lessonEvidence,
 lessonMastered:(u,l,id=null)=>lessonEvidence(u,l,id).mastery,
 weekLessonRefs,
 weekLessonEvidence,
 weekLessonsMastered:n=>weekLessonEvidence(n).mastery,
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