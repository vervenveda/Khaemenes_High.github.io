/* High School -> Higher Learning mathematics readiness receipt v1.
 * Evidence-only export for Algebra II and Geometry. No automatic unlock, credit, or identity guessing.
 */
(function attach(global){
"use strict";
if(global.KhaemenesHighToHigherReadinessReceipt)return;
const CONFIG={
 "algebra-2":{title:"Algebra II",rootKey:"khaemenes-algebra2-course-v1"},
 "geometry":{title:"Geometry",rootKey:"khaemenes-geometry-course-v1"}
};
function courseId(){
 const m=location.pathname.match(/\/courses\/mathematics\/(algebra-2|geometry)(?:\/|$)/);
 return m?m[1]:null;
}
function parse(key){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):null}catch{return null}}
function academyLearner(){
 try{
  const active=parse("khaemenes_active_learner_v1");
  const registry=parse("khaemenes_family_registry_v1");
  const id=typeof active==="string"?active:active?.learnerId;
  const learner=id?registry?.learners?.[id]:null;
  return learner?.learnerId===id?{learnerId:String(id),name:String(learner.nickname||learner.name||"Learner"),stage:String(learner.stage||"")}:null;
 }catch{return null}
}
function localLearner(cfg){
 const state=parse(cfg.rootKey),rows=Array.isArray(state?.students)?state.students:[];
 return rows.find(x=>x?.id===state?.activeId)||rows[0]||null;
}
function score(v){const n=Number(v);return Number.isFinite(n)&&n>=0&&n<=100?n:null}
function build(){
 const id=courseId(),cfg=CONFIG[id];if(!cfg)throw Error("unsupported-course");
 const learner=localLearner(cfg);if(!learner?.id)throw Error("no-active-course-learner");
 const academy=academyLearner();
 const binding=academy?.learnerId&&academy.learnerId===String(learner.id)?"explicit-id-match":"unverified";
 const weeks=learner.weeks&&typeof learner.weeks==="object"?learner.weeks:{};
 const weekly=Object.entries(weeks).map(([week,row])=>({
  week:Number(week)||null,
  masteryBest:score(row?.masteryBest),
  sessionsComplete:row?.days&&typeof row.days==="object"?Object.values(row.days).filter(Boolean).length:0
 })).filter(x=>x.week);
 const masteryScores=weekly.map(x=>x.masteryBest).filter(Number.isFinite);
 return {
  schema:"khaemenes-high-to-higher-math-readiness-receipt-v1",
  generatedAt:new Date().toISOString(),
  sourceRepository:"vervenveda/Khaemenes_High.github.io",
  course:{courseId:id,title:cfg.title,route:location.pathname},
  identity:{
   localCourseLearner:{id:String(learner.id),name:String(learner.name||"").slice(0,100)},
   academyLearner:academy,
   bindingStatus:binding,
   bindingRule:"Only exact learner-id equality is treated as bound. Name similarity is never sufficient."
  },
  evidence:{
   weeklyMasteryBest:weekly,
   masteryAverage:masteryScores.length?Math.round(masteryScores.reduce((a,b)=>a+b,0)/masteryScores.length):null,
   formalReported:{
    diagnostic:score(learner.formal?.diagnostic),
    midterm:score(learner.formal?.midterm),
    final:score(learner.formal?.final),
    capstone:score(learner.formal?.capstone)
   }
  },
  authority:{
   purpose:"prerequisite-readiness-evidence",
   automaticUnlock:false,
   awardsCredit:false,
   verifiedTranscript:false,
   requiresReceivingReview:true,
   sourceRecordsModified:false
  }
 };
}
function download(){
 const payload=build(),blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="khaemenes-"+payload.course.courseId+"-higher-learning-readiness-receipt.json";
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 return payload;
}
document.addEventListener("click",e=>{
 const b=e.target?.closest?.("[data-higher-learning-readiness-receipt]");
 if(!b)return;e.preventDefault();
 try{download()}catch(err){alert("Readiness receipt could not be created: "+err.message)}
});
global.KhaemenesHighToHigherReadinessReceipt=Object.freeze({version:"1.0.0",build,download,automaticUnlock:false,awardsCredit:false});
})(window);
