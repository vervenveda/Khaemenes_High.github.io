/* Algebra I 36-item readiness -> Academy continuation evidence bridge.
   One additional course-owned publisher. Browser-local only; NEVER Account Cloud.
   No publishing until the registered Grade09 learner has a learner-scoped
   original result with valid points, ID, timestamp and provenance.
*/
(function(global){
"use strict";
if(global.KhaemenesAlgebra1ReadinessPublisher)return;
const KEY="khaemenes-algebra1-diagnostic-result-v1";
const ASSESSMENT="KH-MATH-A1-DIAGNOSTIC";
const COURSE="algebra-1-readiness";
function validate(a){
 return !!a&&a.id===ASSESSMENT&&a.total===36&&
  Number.isInteger(a.score)&&a.score>=0&&a.score<=36&&
  typeof a.percent==="number"&&Number.isFinite(a.percent)&&
  Math.abs(100*a.score/36-a.percent)<0.2&&
  typeof a.submitted==="string"&&Number.isFinite(Date.parse(a.submitted));
}
function collect(record){
 if(!record||record.assessment_id!==ASSESSMENT)return [];
 const all=Array.isArray(record.attempt_history)?record.attempt_history:[];
 const valid=all.filter(validate);
 if(!valid.length&&validate(record.lastResult))valid.push(record.lastResult);
 const seen=new Set();
 return valid.filter(a=>{const k=[a.id,a.submitted,a.score,a.total].join("|");if(seen.has(k))return false;seen.add(k);return true})
  .sort((a,b)=>Date.parse(a.submitted)-Date.parse(b.submitted));
}
function active(){
 const context=global.KhaemenesHighProfileGradeContext?.active?.();
 const profile=global.KhaemenesCourseEntryContract?.readAcademyProfile?.();
 if(!context||context.grade!=="09"||!profile?.learnerId||context.learnerId!==profile.learnerId)return null;
 return profile;
}
function inspect(){
 const profile=active();
 if(!profile)return {state:"IDENTITY_UNVERIFIED",count:0};
 const contract=global.KhaemenesCourseEntryContract;
 const record=contract?.readJSON?.(KEY,null,profile);
 const attempts=collect(record);
 if(!attempts.length)return {state:"NO_LEARNER_SCOPED_RESULT",count:0};
 return {state:"ELIGIBLE_LEARNER_SCOPED",count:attempts.length};
}
function publish(){
 const profile=active(),contract=global.KhaemenesCourseEntryContract;
 const ledger=global.KhaemenesLearningContinuation;
 if(!profile||!contract?.readJSON||typeof ledger?.publish!=="function"||typeof ledger?.readCourse!=="function")return false;
 const attempts=collect(contract.readJSON(KEY,null,profile));
 if(!attempts.length)return false;
 // Never copy response choices, work snapshots, or other private answer data.
 const rows=attempts.slice(-100).map(a=>({
  id:ASSESSMENT+":"+a.submitted,
  kind:"test",
  title:"Algebra I Readiness Diagnostic · placement only",
  earned:a.score,possible:36,gradedAt:a.submitted
 }));
 const current=ledger.readCourse(profile.learnerId,COURSE);
 // Idempotence: comparing these content fields prevents publishing the same
 // evidence repeatedly and avoids spurious updates to the ledger timestamp.
 const old=Array.isArray(current?.assessments)?current.assessments:[];
 if(old.length===rows.length&&rows.every((a,i)=>old[i]?.id===a.id&&old[i]?.earned===a.earned&&old[i]?.possible===a.possible))return true;
 const latest=attempts[attempts.length-1];
 try{
  ledger.publish({
   learnerId:profile.learnerId,school:"Khaemenes High School",stage:"high",grade:"09",
   courseId:COURSE,subject:"Mathematics",courseTitle:"Algebra I Readiness Diagnostic",
   status:"assessment",nextLabel:"Review Algebra I",nextTitle:"Readiness evidence retained",
   nextHref:"https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/algebra-1/diagnostic/",
   summary:"Learner-linked, browser-local readiness evidence only. Not an official course grade, credit, or verified cloud record.",
   progress:{completed:0,total:36,percent:0},mastery:{best:null,threshold:80,mastered:false},
   assessments:rows,source:"algebra1-readiness-linked-diagnostic-v1"
  });
  const saved=ledger.readCourse(profile.learnerId,COURSE);
  const got=Array.isArray(saved?.assessments)?saved.assessments:[];
  return got.length===rows.length&&rows.every((a,i)=>got[i]?.id===a.id&&got[i]?.earned===a.earned&&got[i]?.possible===36);
 }catch{return false}
}
function ready(){
 publish();
 global.addEventListener("khaemenes-learning-continuation-ready",publish);
 global.addEventListener("pageshow",publish);
 // Explicit confirmation path can dispatch this event after readback.
 global.addEventListener("khaemenes-algebra1-readiness-linked",publish);
}
if(global.document?.readyState==="loading")global.document.addEventListener("DOMContentLoaded",ready,{once:true});else ready();
global.KhaemenesAlgebra1ReadinessPublisher=Object.freeze({version:"1.0.0",inspect,publish});
})(window);
