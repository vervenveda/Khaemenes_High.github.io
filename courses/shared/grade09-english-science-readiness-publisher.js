/* Grade09 English and Science readiness -> learner-scoped Academy continuation.
 * No course grade authority. No raw answers, no cloud, no unscoped migration.
 */
(function(global){"use strict";
if(global.KhaemenesGrade09ReadinessPublisher)return;
const TYPES=Object.freeze([
 {courseId:"english-9-readiness",base:"khaemenes_english9_readiness_records_v1",title:"English 9 Readiness",source:"english9-readiness-gateway-v1",max:10},
 {courseId:"integrated-science-9-readiness",base:"khaemenes_science_u00_v1",title:"Integrated Science 9 Readiness",source:"science9-unit00-readiness-v1",max:24}
]);
function active(){
 const profile=global.KhaemenesCourseEntryContract?.readAcademyProfile?.();
 const grade=global.KhaemenesHighProfileGradeContext?.active?.();
 if(!profile?.learnerId||!grade||grade.grade!=="09"||grade.learnerId!==profile.learnerId)return null;
 return profile;
}
function validEnglish(a,id){
 if(!a||a.record_type!=="readiness"||a.course_id!=="english-9"||
   a.assessment_id!=="english9-readiness-gateway"||a.learner_id!==id)return false;
 const raw=a.raw_score;
 return Number.isInteger(raw?.earned)&&raw.earned>=0&&raw.possible===10&&
  Number.isFinite(a.overall_percent)&&
  Math.abs(a.overall_percent-raw.earned/10*100)<.2&&
  typeof a.timestamp==="string"&&Number.isFinite(Date.parse(a.timestamp));
}
function validScience(a){
 const d=a?.diagnostic;
 return d?.completed===true&&Number.isInteger(d.score)&&d.score>=0&&
  d.total===24&&typeof d.completedAt==="string"&&
  Number.isFinite(Date.parse(d.completedAt));
}
function sourceRows(type,profile){
 const contract=global.KhaemenesCourseEntryContract;
 if(!contract?.readJSON||!profile)return [];
 const data=contract.readJSON(type.base,null,profile);
 if(type.courseId==="english-9-readiness"){
  if(!Array.isArray(data)||data.length>240)return [];
  return data.filter(a=>validEnglish(a,profile.learnerId)).map(a=>({
   id:"english9-readiness-gateway:"+a.timestamp+":"+a.attempt_number,
   kind:"test",earned:a.raw_score.earned,possible:10,gradedAt:a.timestamp,
   title:"English 9 Readiness · placement only"
  }));
 }
 if(!validScience(data))return [];
 const d=data.diagnostic;
 return [{id:"science9-unit00-readiness:"+d.completedAt,
  kind:"test",earned:d.score,possible:24,gradedAt:d.completedAt,
  title:"Science 9 Readiness · placement only"}];
}
function publishOne(type,profile){
 const ledger=global.KhaemenesLearningContinuation;
 if(!ledger?.publish||!ledger?.readCourse)return false;
 const rows=sourceRows(type,profile).sort((a,b)=>String(a.gradedAt).localeCompare(String(b.gradedAt)));
 if(!rows.length)return false;
 if(new Set(rows.map(x=>x.id)).size!==rows.length)return false;
 const prior=ledger.readCourse(profile.learnerId,type.courseId);
 if(prior&&prior.source!==type.source)return false;
 const old=Array.isArray(prior?.assessments)?prior.assessments:[];
 if(prior&&old.length===rows.length&&rows.every((x,i)=>x.id===old[i]?.id&&x.earned===old[i]?.earned&&x.possible===old[i]?.possible))return true;
 try{
  ledger.publish({learnerId:profile.learnerId,school:"Khaemenes High School",
   stage:"high",grade:"09",subject:type.courseId.startsWith("english")?"Language Arts":"Science",
   courseId:type.courseId,courseTitle:type.title,status:"assessment",
   nextLabel:"Review "+type.title,nextTitle:"Learner-scoped readiness evidence",
   nextHref:"https://vervenveda.com/Khaemenes_High.github.io/courses/"+
    (type.courseId.startsWith("english")?"language-arts/english-9/assessments/diagnostic/":"science/integrated-science-9/diagnostic/readiness-diagnostic.html"),
   summary:"Placement/readiness only; browser-local evidence, not an official course grade or cloud backup.",
   progress:{completed:0,total:36,percent:0},mastery:{best:null,threshold:80,mastered:false},
   assessments:rows,source:type.source});
  const check=ledger.readCourse(profile.learnerId,type.courseId);
  return check?.source===type.source&&check.assessments?.length===rows.length&&
   rows.every((x,i)=>check.assessments[i]?.id===x.id&&check.assessments[i]?.earned===x.earned&&check.assessments[i]?.possible===x.possible);
 }catch{return false}
}
function publish(){
 const p=active();if(!p)return {english:false,science:false};
 return {english:publishOne(TYPES[0],p),science:publishOne(TYPES[1],p)};
}
function boot(){
 publish();
 for(const e of ["pageshow","khaemenes-learning-continuation-ready","khaemenes-student-profile-changed"])
  global.addEventListener(e,publish);
}
if(global.document?.readyState==="loading")global.document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
global.KhaemenesGrade09ReadinessPublisher=Object.freeze({version:"1.0.0",publish});
})(window);
