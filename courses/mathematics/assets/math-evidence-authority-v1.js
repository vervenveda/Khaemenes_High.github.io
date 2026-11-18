/* Khaemenes Academy · normalized mathematics evidence authority v1
   Read-only normalization over existing course authorities and learner records.
   Never invents mastery from missing data. */
(()=>{"use strict";
if(window.KhaemenesMathEvidenceAuthority)return;
const rec=()=>window.KhaemenesMathLearnerRecord,MASTER=80,num=v=>Number.isFinite(Number(v))?Number(v):null;
const course=()=>rec()?.course||null;
function best(values){const xs=values.map(num).filter(v=>v!==null);return xs.length?Math.max(...xs):null}
function state(score,reviewed=false){const n=num(score);if(n===null)return "not-recorded";if(n<MASTER)return "practice";return reviewed?"evaluator-verified":"mastered"}
function trust(){return {classification:"browser-local-learning-evidence",authoritative:false,cryptographically_verified:false,official_transcript:false,mastery_target:MASTER}}
function legacy(){return rec()?.snapshot?.()?.legacy||{}}
function preLesson(u,l){
 const p=legacy(),unit=String(Number(u)).padStart(2,"0"),ids=["u"+unit+"-l"+String(Number(l)).padStart(2,"0"),"l"+String(Number(l)).padStart(2,"0")],scores=[];
 for(const [k,v] of Object.entries(p)){if(!k.includes("unit"+unit)||!k.includes("progress"))continue;for(const id of ids){scores.push(v?.lessonBestScores?.[id],v?.lessonScores?.[id],v?.lessonLatestScores?.[id]);for(const a of (v?.lessonAttempts?.[id]||[]))scores.push(a?.percent,a?.score)}}
 const b=best(scores);return {course:"pre-algebra",unit:Number(u),lesson:Number(l),best:b,mastery:b!==null&&b>=MASTER,status:state(b),trust:trust()};
}
function geometryLesson(u,l){
 const id="u"+String(Number(u)).padStart(2,"0")+"-l"+String(Number(l)).padStart(2,"0"),r=legacy()["khaemenes-geometry-lesson-progress-v1"]?.[id]||null,b=best([r?.bestScore,r?.score,...(r?.attempts||[]).map(a=>a?.score)]);
 return {course:"geometry",unit:Number(u),lesson:Number(l),lesson_id:id,best:b,mastery:b!==null&&b>=MASTER&&(r?.mastery===true||r?.complete===true||b>=MASTER),status:state(b),trust:trust()};
}
function algebra2Lesson(u,l){
 const id="u"+String(Number(u)).padStart(2,"0")+"-l"+String(Number(l)).padStart(2,"0"),p=legacy(),candidates=[];
 for(const [k,v] of Object.entries(p)){if(!/algebra2.*lesson.*progress/i.test(k))continue;const r=v?.[id];if(r)candidates.push(r?.bestScore,r?.score,...(r?.attempts||[]).map(a=>a?.score))}
 const b=best(candidates);return {course:"algebra-2",unit:Number(u),lesson:Number(l),lesson_id:id,best:b,mastery:b!==null&&b>=MASTER,status:state(b),trust:trust()};
}
function algebra1Lesson(u,l){
 const A=window.KhaemenesAlgebra1MasteryAuthority,e=A?.lessonEvidence?.(u,l);if(e)return {...e,course:"algebra-1",status:state(e.best),trust:trust()};
 const p=legacy(),unit=String(Number(u)).padStart(2,"0"),id="u"+unit+"-l"+String(Number(l)).padStart(2,"0"),scores=[];
 for(const [k,v] of Object.entries(p)){if(!k.includes("unit"+unit))continue;scores.push(v?.scores?.[id],v?.best?.["lesson-"+Number(l)])}
 const b=best(scores);return {course:"algebra-1",unit:Number(u),lesson:Number(l),lesson_id:id,best:b,mastery:b!==null&&b>=MASTER,status:state(b),trust:trust()};
}
function lesson(u,l){const fn=({"pre-algebra":preLesson,"algebra-1":algebra1Lesson,geometry:geometryLesson,"algebra-2":algebra2Lesson})[course()];return fn?fn(u,l):{best:null,mastery:false,status:"unavailable",trust:trust()}}
function cumulative(kind){
 const c=course(),p=legacy();if(c==="algebra-1"){const e=kind==="midterm"?window.KhaemenesAlgebra1MasteryAuthority?.midtermEvidence?.():window.KhaemenesAlgebra1MasteryAuthority?.finalEvidence?.();if(e)return {...e,course:c,status:state(e.best,true),trust:trust()}}
 const patterns={"pre-algebra":kind==="midterm"?/prealgebra-midterm-result/:/prealgebra-final-result/,geometry:/geometry-assessment-records/,"algebra-2":/algebra2-assessment-records/}[c],vals=[];
 for(const [k,v] of Object.entries(p)){if(!patterns?.test(k))continue;const r=(c==="geometry"||c==="algebra-2")?(v?.[kind]||null):v;vals.push(r?.bestScore,r?.best_percent,r?.overall_percent,r?.percent,r?.score)}
 const b=best(vals);return {course:c,kind,best:b,mastery:b!==null&&b>=MASTER,status:state(b),trust:trust()};
}
function snapshot(){return {schema:"khaemenes-math-evidence-authority-v1",course:course(),threshold:MASTER,trust:trust(),midterm:cumulative("midterm"),final:cumulative("final")}}
window.KhaemenesMathEvidenceAuthority=Object.freeze({version:"1.0.0",threshold:MASTER,trust,lesson,cumulative,snapshot});
})();
