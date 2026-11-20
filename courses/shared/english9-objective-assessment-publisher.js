/* English 9 objective exam evidence: learner-scoped, never an official course grade.
 * The original Monte Carlo/Fixed assessment record retains attempts and mastery;
 * this publishes only score references into the existing Academy continuation index.
 */
(function(global){"use strict";
if(global.KhaemenesEnglish9ObjectivePublisher)return;
const KEY_PREFIX="khae-ela9-assessment-v2:";
const TYPES=Object.freeze([{kind:"midterm",total:30},{kind:"final",total:50}]);
const INDEX="english-9-objective-evidence";
const SOURCE="english9-fixed-objective-assessment-v1";
function learner(){
 const c=global.KhaemenesHighProfileGradeContext?.active?.();
 const p=global.KhaemenesCourseEntryContract?.readAcademyProfile?.();
 return c?.grade==="09"&&c.learnerId&&c.learnerId===p?.learnerId?p:null;
}
function attempt(a,kind,total){
 const s=a?.summary;
 return a&&a.kind===kind&&typeof a.id==="string"&&a.id.length>0&&
  Number.isInteger(s?.correct)&&s.correct>=0&&s.correct<=total&&
  s.total===total&&s.questionCount===total&&
  Number.isFinite(s.score)&&Math.abs(s.score-Math.round(100*s.correct/total))<0.1&&
  typeof a.completedAt==="string"&&Number.isFinite(Date.parse(a.completedAt))&&
  typeof s.sessionId==="string"&&s.sessionId===a.id;
}
function gather(p){
 const contract=global.KhaemenesCourseEntryContract;
 if(!contract?.readJSON)return [];
 const result=[];
 for(const t of TYPES){
  const record=contract.readJSON(KEY_PREFIX+t.kind,null,p);
  if(!record)continue;
  const arr=Array.isArray(record.attempts)?record.attempts:null;
  if(!arr||arr.length>50||arr.some(a=>!attempt(a,t.kind,t.total)))return []; // no partial projection of corrupted histories
  for(const a of arr)result.push({
   id:"english9-"+t.kind+":"+a.id,
   kind:"test",earned:a.summary.correct,possible:t.total,
   title:"English 9 "+(t.kind==="midterm"?"Midterm":"Final")+" · objective section only",
   gradedAt:a.completedAt
  });
 }
 if(!result.length||new Set(result.map(r=>r.id)).size!==result.length)return [];
 return result.sort((a,b)=>a.id.localeCompare(b.id));
}
function publish(){
 const p=learner(),L=global.KhaemenesLearningContinuation;
 if(!p||typeof L?.publish!=="function"||typeof L?.readCourse!=="function")return false;
 const rows=gather(p);
 if(!rows.length)return false;
 const prior=L.readCourse(p.learnerId,INDEX);
 if(prior&&prior.source!==SOURCE)return false;
 const old=Array.isArray(prior?.assessments)?prior.assessments:[];
 if(prior&&old.length===rows.length&&rows.every((r,i)=>r.id===old[i]?.id&&r.earned===old[i]?.earned&&r.possible===old[i]?.possible))return true;
 try{
  L.publish({learnerId:p.learnerId,courseId:INDEX,school:"Khaemenes High School",
   stage:"high",grade:"09",subject:"Language Arts",courseTitle:"English 9 Objective Exam Evidence",
   status:"assessment",nextLabel:"Review English 9 Gradebook",nextTitle:"Evaluator review required",
   nextHref:"https://vervenveda.com/Khaemenes_High.github.io/courses/language-arts/english-9/records/gradebook.html",
   summary:"Read-only objective midterm/final scores. Writing and evaluator review are separate. Not an official final grade or Account Cloud backup.",
   progress:{completed:0,total:36,percent:0},mastery:{best:null,threshold:80,mastered:false},
   assessments:rows,source:SOURCE});
  const saved=L.readCourse(p.learnerId,INDEX);
  return saved?.source===SOURCE&&saved.assessments?.length===rows.length&&
   rows.every((r,i)=>saved.assessments[i]?.id===r.id&&saved.assessments[i]?.earned===r.earned&&saved.assessments[i]?.possible===r.possible);
 }catch{return false}
}
function start(){
 publish();
 for(const event of ["pageshow","khaemenes-learning-continuation-ready","khaemenes-student-profile-changed"])
  global.addEventListener(event,publish);
}
if(global.document?.readyState==="loading")global.document.addEventListener("DOMContentLoaded",start,{once:true});else start();
global.KhaemenesEnglish9ObjectivePublisher=Object.freeze({version:"1.0.0",publish});
})(window);
