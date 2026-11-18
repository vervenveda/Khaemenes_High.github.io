/* Khaemenes Academy · unified mathematics progression ledger v1.2 */
(()=>{"use strict";
if(window.KhaemenesMathProgressionLedger)return;
const MASTER=80;
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
function classify(score,meta={}){
 if(typeof meta==="boolean")meta={evaluatorVerified:meta};
 const n=Number(score),valid=Number.isFinite(n);
 if(meta.evaluatorVerified===true&&( !valid||n>=MASTER))return "evaluator-verified";
 if(meta.retained===true&&( !valid||n>=MASTER))return "retained";
 if(meta.pendingReview===true)return "pending-review";
 if(!valid)return meta.reviewed===true?"reviewed":"not-recorded";
 if(n>=MASTER)return "mastered";
 return meta.reviewed===true?"reviewed":"practice";
}
function retentionState(final){
 const score=Number(final?.score),status=String(final?.status||"not-recorded");
 if(status==="pending-review")return {status:"pending-review",source:"cumulative-final",score:Number.isFinite(score)?score:null};
 if(Number.isFinite(score)&&score>=MASTER&&["mastered","evaluator-verified","retained"].includes(status))return {status:"retained",source:"cumulative-final",score};
 if(Number.isFinite(score))return {status:"practice",source:"cumulative-final",score};
 return {status:"not-recorded",source:"cumulative-final",score:null};
}
function build(){
 const r=window.KhaemenesMathLearnerRecord,p=window.KhaemenesMathProgress?.snapshot?.()||null,record=r?.snapshot?.()||null,evidence=window.KhaemenesMathEvidenceAuthority?.snapshot?.()||null,storage=window.KhaemenesMathStorageAdapter?.status?.()||null;
 const out={schema:"khaemenes-math-progression-ledger-v1",version:"1.2.0",course:r?.course||p?.course||null,generated_at:new Date().toISOString(),mastery_target:MASTER,status_vocabulary:STATUS,
  learner:r?.learner?.()||null,storage,readiness:null,lessons:null,weeks:null,units:null,midterm:null,final:null,retention:null,portfolio:null,resources:null,review_queue:[],provenance:{learner_scoped_keys:0,legacy_unscoped_keys:0,warnings:[]},source_status:[]};
 if(p){
  out.lessons={count:p.progress?.completed_lessons??null,status:p.progress?.status||"unavailable"};
  out.weeks={mastered:p.mastery?.weekly_mastery??null,status:p.mastery?.status||"unavailable"};
  out.units={mastered:p.mastery?.unit_mastery??null,status:p.mastery?.status||"unavailable"};
  out.midterm={score:p.mastery?.midterm??null,status:classify(p.mastery?.midterm)};
  out.final={score:p.mastery?.final??null,status:classify(p.mastery?.final)};
  out.portfolio=p.portfolio||null;out.source_status.push("math-progress-contract");
 }
 if(evidence){
  out.midterm={score:evidence.midterm?.best??out.midterm?.score??null,status:evidence.midterm?.status||out.midterm?.status||"not-recorded"};
  out.final={score:evidence.final?.best??out.final?.score??null,status:evidence.final?.status||out.final?.status||"not-recorded"};
  out.source_status.push("math-evidence-authority");
 }
 out.retention=retentionState(out.final);
 for(const [kind,item] of [["midterm",out.midterm],["final",out.final],["retention",out.retention]])if(item?.status==="pending-review")out.review_queue.push({kind,status:"pending-review",score:item.score??null});
 if(record){
  const lg=record.legacy||{},prov=record.provenance||{};
  out.provenance.learner_scoped_keys=Array.isArray(prov.learner_scoped_keys)?prov.learner_scoped_keys.length:0;
  out.provenance.legacy_unscoped_keys=Array.isArray(prov.legacy_unscoped_keys)?prov.legacy_unscoped_keys.length:0;
  if(out.learner?.verified&&out.provenance.legacy_unscoped_keys>0)out.provenance.warnings.push("Legacy unscoped evidence is preserved for recovery but is not proof of learner ownership.");
  if(record.course==="pre-algebra"){
   const ready=lg["khaemenes-naib-readiness-profile-v1"]||null,exit=lg["khaemenes-prealgebra-unit00-exit-v1"]||null;
   out.readiness={route:ready?.route??null,percent:ready?.percent??null,unit0_exit:exit?.percent??exit?.best_percent??null,status:ready?"reviewed":"not-recorded"};
  }
  out.source_status.push("canonical-learner-record");
 }
 if(storage?.persisted===false||storage?.verified===false)out.provenance.warnings.push("Persistent browser writes are not currently verified; export is recommended before leaving the page.");
 if(out.learner&&!out.learner.verified)out.provenance.warnings.push("No verified active learner binding is available for this page.");
 out.export_recommended=out.provenance.warnings.length>0;
 return out;
}
function capture(reason="snapshot"){
 const ledger=build(),r=window.KhaemenesMathLearnerRecord;r?.append?.("progression-ledger",{reason,ledger},"math-progression-ledger-v1.2");return ledger;
}
window.KhaemenesMathProgressionLedger=Object.freeze({build,capture,classify,statusVocabulary:STATUS,version:"1.2.0"});
})();