/* Khaemenes Academy · unified mathematics progression ledger v1 */
(()=>{"use strict";
if(window.KhaemenesMathProgressionLedger)return;
const MASTER=80;
function classify(score,reviewed=false){
 const n=Number(score);if(!Number.isFinite(n))return "not-recorded";
 if(reviewed&&n>=MASTER)return "evaluator-verified";
 if(n>=MASTER)return "mastered";
 return "practice";
}
function build(){
 const r=window.KhaemenesMathLearnerRecord,p=window.KhaemenesMathProgress?.snapshot?.()||null,record=r?.snapshot?.()||null,evidence=window.KhaemenesMathEvidenceAuthority?.snapshot?.()||null;
 const out={schema:"khaemenes-math-progression-ledger-v1",course:r?.course||p?.course||null,generated_at:new Date().toISOString(),mastery_target:MASTER,
  learner:r?.learner?.()||null,readiness:null,lessons:null,weeks:null,units:null,midterm:null,final:null,portfolio:null,resources:null,source_status:[]};
 if(p){
  out.lessons={count:p.progress?.completed_lessons??null,status:p.progress?.status||"unavailable"};
  out.weeks={mastered:p.mastery?.weekly_mastery??null,status:p.mastery?.status||"unavailable"};
  out.units={mastered:p.mastery?.unit_mastery??null,status:p.mastery?.status||"unavailable"};
  out.midterm={score:p.mastery?.midterm??null,status:classify(p.mastery?.midterm)};
  out.final={score:p.mastery?.final??null,status:classify(p.mastery?.final)};
  out.portfolio=p.portfolio||null;out.source_status.push("math-progress-contract");
 }
 if(evidence){out.midterm={score:evidence.midterm?.best??out.midterm?.score??null,status:evidence.midterm?.status||out.midterm?.status||"not-recorded"};out.final={score:evidence.final?.best??out.final?.score??null,status:evidence.final?.status||out.final?.status||"not-recorded"};out.source_status.push("math-evidence-authority");}
 if(record){
  const lg=record.legacy||{};
  if(record.course==="pre-algebra"){
   const ready=lg["khaemenes-naib-readiness-profile-v1"]||null;
   const exit=lg["khaemenes-prealgebra-unit00-exit-v1"]||null;
   out.readiness={route:ready?.route??null,percent:ready?.percent??null,unit0_exit:exit?.percent??exit?.best_percent??null,status:ready?"recorded":"not-recorded"};
  }
  out.source_status.push("canonical-learner-record");
 }
 return out;
}
function capture(reason="snapshot"){
 const ledger=build(),r=window.KhaemenesMathLearnerRecord;r?.append?.("progression-ledger",{reason,ledger},"math-progression-ledger-v1");return ledger;
}
window.KhaemenesMathProgressionLedger=Object.freeze({build,capture,classify,version:"1.1.0"});
})();