/* Khaemenes Academy · Science 9 public-safe record handoff v1
   This exporter creates UNSIGNED formative evidence only. It cannot issue mastery,
   credit, grades, transcripts, administrator approval, or signed Academy records.
*/
(function(global){
"use strict";
if(global.KhaemenesScience9RecordHandoff)return;
const VERSION="1.0";
function safeLearner(v){return typeof v==="string"&&/^[a-z0-9_-]{3,32}$/i.test(v)?v.toLowerCase():null}
function cleanRecord(r){
 if(!r||typeof r.activity!=="string"||typeof r.notes!=="string")return null;
 if(!/^units\/unit-(?:0[2-9]|1[0-2])\/[^/]+\.html$/.test(r.activity))return null;
 return{
   activity:r.activity,
   notes:r.notes.slice(0,100000),
   observation:typeof r.observation==="string"?r.observation.slice(0,20000):"",
   updatedAt:typeof r.updatedAt==="string"?r.updatedAt:""
 };
}
function build(input){
 const learnerId=safeLearner(input?.learnerId);
 if(!learnerId)throw new Error("A valid selected learner is required.");
 const records=(Array.isArray(input?.records)?input.records:[]).map(cleanRecord).filter(Boolean);
 return{
   schemaVersion:"1.0",
   kind:"khaemenes-science9-course-evidence-handoff",
   handoffVersion:VERSION,
   authority:"learner-formative-evidence-only",
   course:{
     courseCode:"KH-SCI-IIS9",
     courseTitle:"International Integrated Science 9",
     grade:9
   },
   learner:{learnerId},
   exportedAt:new Date().toISOString(),
   evidence:{
     type:"browser-local-formative-investigation-portfolio",
     recordCount:records.length,
     records
   },
   prohibitedClaims:[
     "official-mastery",
     "official-midterm",
     "official-final",
     "transcript-credit",
     "administrator-approval",
     "signed-record"
   ],
   protectedReviewRequired:{
     identityVerified:true,
     secureAssessmentReviewed:true,
     scoreReviewed:true,
     creditDecisionReviewed:true,
     administratorApproval:true,
     signedRecordIssuance:true
   },
   targetContract:{
     publicReference:"courses/shared/shared/assessment-authority/",
     administratorHandoffSchema:"admin-approved-record-v1",
     signedRecordSchema:"signed-record-v1"
   }
 };
}
function download(pkg){
 const text=JSON.stringify(pkg,null,2);
 const url=URL.createObjectURL(new Blob([text],{type:"application/json"}));
 const a=document.createElement("a");
 a.href=url;
 a.download="Khaemenes-Science9-Academy-Evidence-Handoff.json";
 document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),30000);
}
global.KhaemenesScience9RecordHandoff=Object.freeze({version:VERSION,build,download});
})(window);
