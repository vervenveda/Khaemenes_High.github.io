/* Khaemenes Academy · normalized mathematics evidence authority v1.1
   Read-only normalization over existing course authorities and learner records.
   Missing evidence is never converted to zero or mastery. */
(()=>{"use strict";
if(window.KhaemenesMathEvidenceAuthority)return;
const rec=()=>window.KhaemenesMathLearnerRecord,MASTER=80,num=v=>Number.isFinite(Number(v))?Number(v):null;
const course=()=>rec()?.course||null;
const STATUS=Object.freeze({
 "not-recorded":"Not Recorded",
 "practice":"Practice",
 "reviewed":"Reviewed",
 "mastered":"Mastered",
 "retained":"Retained",
 "pending-review":"Pending Review",
 "evaluator-verified":"Evaluator Verified",
 "unavailable":"Unavailable"
});
function best(values){const xs=values.map(num).filter(v=>v!==null);return xs.length?Math.max(...xs):null}
function state(score,meta={}){
 if(typeof meta==="boolean")meta={evaluatorVerified:meta};
 const n=num(score),reviewed=meta.reviewed===true,retained=meta.retained===true,pending=meta.pendingReview===true,verified=meta.evaluatorVerified===true;
 if(verified&&(n===null||n>=MASTER))return "evaluator-verified";
 if(retained&&(n===null||n>=MASTER))return "retained";
 if(pending)return "pending-review";
 if(n===null)return reviewed?"reviewed":"not-recorded";
 if(n>=MASTER)return "mastered";
 return reviewed?"reviewed":"practice";
}
function trust(){return {classification:"browser-local-learning-evidence",authoritative:false,cryptographically_verified:false,official_transcript:false,mastery_target:MASTER,review_requirement:"evidence-dependent"}}
function legacy(){return rec()?.snapshot?.()?.legacy||{}}
function preLesson(u,l){
 const p=legacy(),unit=String(Number(u)).padStart(2,"0"),ids=["u"+unit+"-l"+String(Number(l)).padStart(2,"0"),"l"+String(Number(l)).padStart(2,"0")],scores=[];
 let reviewed=false;
 for(const [k,v] of Object.entries(p)){
  if(!k.includes("unit"+unit)||!k.includes("progress"))continue;
  for(const id of ids){
   scores.push(v?.lessonBestScores?.[id],v?.lessonScores?.[id],v?.lessonLatestScores?.[id]);
   for(const a of (v?.lessonAttempts?.[id]||[]))scores.push(a?.percent,a?.score);
   if(Array.isArray(v?.reviewedLessons)&&v.reviewedLessons.includes(id))reviewed=true;
  }
 }
 const b=best(scores);return {course:"pre-algebra",unit:Number(u),lesson:Number(l),best:b,mastery:b!==null&&b>=MASTER,status:state(b,{reviewed}),reviewed,trust:trust()};
}
function geometryLesson(u,l){
 const id="u"+String(Number(u)).padStart(2,"0")+"-l"+String(Number(l)).padStart(2,"0"),r=legacy()["khaemenes-geometry-lesson-progress-v1"]?.[id]||null,b=best([r?.bestScore,r?.score,...(r?.attempts||[]).map(a=>a?.score)]);
 const reviewed=r?.reviewed===true||r?.evaluatorReviewed===true;
 return {course:"geometry",unit:Number(u),lesson:Number(l),lesson_id:id,best:b,mastery:b!==null&&b>=MASTER&&(r?.mastery===true||r?.complete===true||b>=MASTER),status:state(b,{reviewed}),reviewed,trust:trust()};
}
function algebra2Lesson(u,l){
 const id="u"+String(Number(u)).padStart(2,"0")+"-l"+String(Number(l)).padStart(2,"0"),p=legacy(),candidates=[];let reviewed=false,verified=false;
 for(const [k,v] of Object.entries(p)){
  if(!/algebra2.*lesson.*progress/i.test(k))continue;
  const r=v?.[id];if(!r)continue;
  candidates.push(r?.bestScore,r?.score,...(r?.attempts||[]).map(a=>a?.score));
  reviewed=reviewed||r?.reviewed===true||r?.evaluatorReviewed===true;
  verified=verified||r?.evaluator_verified===true||r?.evaluatorVerified===true;
 }
 const b=best(candidates);return {course:"algebra-2",unit:Number(u),lesson:Number(l),lesson_id:id,best:b,mastery:b!==null&&b>=MASTER,status:state(b,{reviewed,evaluatorVerified:verified}),reviewed,evaluator_verified:verified,trust:trust()};
}
function algebra1Lesson(u,l){
 const A=window.KhaemenesAlgebra1MasteryAuthority,e=A?.lessonEvidence?.(u,l);
 if(e)return {...e,course:"algebra-1",status:state(e.best,{reviewed:e.reviewed===true,evaluatorVerified:e.evaluator_verified===true}),trust:trust()};
 const p=legacy(),unit=String(Number(u)).padStart(2,"0"),id="u"+unit+"-l"+String(Number(l)).padStart(2,"0"),scores=[];
 for(const [k,v] of Object.entries(p)){if(!k.includes("unit"+unit))continue;scores.push(v?.scores?.[id],v?.best?.["lesson-"+Number(l)])}
 const b=best(scores);return {course:"algebra-1",unit:Number(u),lesson:Number(l),lesson_id:id,best:b,mastery:b!==null&&b>=MASTER,status:state(b),trust:trust()};
}
function lesson(u,l){const fn=({"pre-algebra":preLesson,"algebra-1":algebra1Lesson,geometry:geometryLesson,"algebra-2":algebra2Lesson})[course()];return fn?fn(u,l):{best:null,mastery:false,status:"unavailable",trust:trust()}}
function cumulative(kind){
 const c=course(),p=legacy();
 if(c==="algebra-1"){
  const e=kind==="midterm"?window.KhaemenesAlgebra1MasteryAuthority?.midtermEvidence?.():window.KhaemenesAlgebra1MasteryAuthority?.finalEvidence?.();
  if(e){
   const verified=Number(e.reviewed_mastery_attempts)>0,pending=Number(e.rejected_unstructured_review_attempts)>0&&!verified;
   return {...e,course:c,status:state(e.best,{evaluatorVerified:verified,pendingReview:pending}),trust:trust()};
  }
 }
 const patterns={"pre-algebra":kind==="midterm"?/prealgebra-midterm-result/:/prealgebra-final-result/,geometry:/geometry-assessment-records/,"algebra-2":/algebra2-assessment-records/}[c],vals=[];
 let reviewed=false,verified=false,pending=false,retained=false;
 for(const [k,v] of Object.entries(p)){
  if(!patterns?.test(k))continue;
  const r=(c==="geometry"||c==="algebra-2")?(v?.[kind]||null):v;if(!r)continue;
  vals.push(r?.bestScore,r?.best_percent,r?.overall_percent,r?.percent,r?.score);
  reviewed=reviewed||r?.reviewed===true||r?.evaluatorReviewed===true;
  verified=verified||r?.evaluator_verified===true||r?.evaluatorVerified===true||r?.evaluator_review?.attestation===true;
  retained=retained||r?.retained===true||r?.retention_verified===true;
  pending=pending||((r?.trust?.review_required===true||r?.review_required===true)&&!verified);
 }
 const b=best(vals);return {course:c,kind,best:b,mastery:b!==null&&b>=MASTER,status:state(b,{reviewed,evaluatorVerified:verified,pendingReview:pending,retained}),reviewed,evaluator_verified:verified,retained,trust:trust()};
}
function snapshot(){return {schema:"khaemenes-math-evidence-authority-v1",version:"1.1.0",course:course(),threshold:MASTER,status_vocabulary:STATUS,trust:trust(),midterm:cumulative("midterm"),final:cumulative("final")}}
window.KhaemenesMathEvidenceAuthority=Object.freeze({version:"1.1.0",threshold:MASTER,statusVocabulary:STATUS,trust,state,lesson,cumulative,snapshot});
})();