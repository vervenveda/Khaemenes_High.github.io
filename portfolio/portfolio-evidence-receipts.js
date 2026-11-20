/* Khaemenes High · read-only academic evidence receipts.
 * Normalizes already-published continuation evidence for Portfolio reporting.
 * Never reads assessment answers, never changes course records, never awards credit,
 * and never writes to localStorage or Account Cloud.
 */
(function attachEvidenceReceipts(global){
"use strict";
if(global.KhaemenesPortfolioEvidenceReceipts)return;
const VERSION="1.0.0";
function clean(v,max=220){return String(v??"").replace(/[\u0000-\u001f\u007f]/g,"").trim().slice(0,max)}
function stable(value){
 if(Array.isArray(value))return "["+value.map(stable).join(",")+"]";
 if(value&&typeof value==="object")return "{"+Object.keys(value).sort().map(k=>JSON.stringify(k)+":"+stable(value[k])).join(",")+"}";
 return JSON.stringify(value);
}
function fnv1a32(text){
 let h=0x811c9dc5;
 for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0}
 return h.toString(16).padStart(8,"0");
}
function normalize(record,a){
 if(!record||!a||!["quiz","test"].includes(a.kind))return null;
 if(typeof a.earned!=="number"||!Number.isFinite(a.earned)||typeof a.possible!=="number"||!Number.isFinite(a.possible)||a.possible<=0||a.earned<0||a.earned>a.possible)return null;
 const core={
  learnerId:clean(record.learnerId,120),
  courseId:clean(record.courseId,140),
  assessmentId:clean(a.id,120),
  kind:a.kind,
  earned:a.earned,
  possible:a.possible,
  title:clean(a.title||a.id,120),
  gradedAt:clean(a.gradedAt||"",40),
  source:clean(record.source||"continuation-ledger",240),
  snapshotUpdatedAt:clean(record.updatedAt||"",40),
  recordFormat:clean(record.format||"",80)
 };
 return Object.freeze({...core,fingerprintAlgorithm:"fnv1a32-noncryptographic",provenanceFingerprint:fnv1a32(stable(core))});
}
function forLearner(learnerId){
 const id=clean(learnerId,120),ledger=global.KhaemenesLearningContinuation;
 if(!id||typeof ledger?.readLearner!=="function")return [];
 const rows=[];
 for(const record of ledger.readLearner(id)||[]){
  if(record?.learnerId!==id||record?.stale===true)continue;
  for(const a of Array.isArray(record.assessments)?record.assessments:[]){
   const r=normalize(record,a);if(r)rows.push(r);
  }
 }
 return Object.freeze(rows);
}
function forCourse(learnerId,courseId){
 const id=clean(courseId,140);
 return Object.freeze(forLearner(learnerId).filter(r=>r.courseId===id));
}
global.KhaemenesPortfolioEvidenceReceipts=Object.freeze({
 version:VERSION,forLearner,forCourse,writesCourseRecords:false,writesPortfolio:false,awardsCredit:false,
 fingerprintPurpose:"change-detection/reference only; not a cryptographic signature"
});
})(window);
