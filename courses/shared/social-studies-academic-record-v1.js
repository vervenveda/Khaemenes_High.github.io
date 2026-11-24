/*
 * Khaemenes Social Studies Academic Record v1.0.0
 * Read-only portfolio bridge derived from course-owned learner records.
 * This module never owns grades, unlocks curriculum, or stores a second gradebook.
 */
(function attachSocialStudiesAcademicRecord(global){
"use strict";
if(global.KhaemenesSocialStudiesAcademicRecord)return;
const VERSION="1.0.0",SCHEMA="khaemenes-social-studies-academic-record-v1";
const clean=(v,max=240)=>String(v??"").replace(/[\u0000-\u001f\u007f]/g," ").replace(/\s+/g," ").trim().slice(0,max);
const num=v=>Number.isFinite(Number(v))?Number(v):null;
function sanitizeAssignments(w,s){
 return (w.assignments||[]).map(a=>{
  const rec=s?.assignments?.[`${w.week}-${a.number}`]||{};
  return {
   number:Number(a.number),title:clean(a.title,160),submitted:rec.submitted===true,
   score:num(rec.score),feedbackPresent:Boolean(clean(rec.feedback||"",20)),
   evaluatorReviewed:Number.isFinite(Number(rec.score))||Boolean(clean(rec.feedback||"",20))
  };
 });
}
function quizRecord(w,s,threshold){
 const q=s?.quizzes?.[w.week]||{},best=num(q.bestPercent??q.percent);
 return {
  completed:q.completed===true,
  bestPercent:best,
  mastered:best!==null&&best>=threshold,
  attempts:Number.isFinite(Number(q.attempts))?Number(q.attempts):0,
  constructedResponseCompleted:Boolean(clean(q.shortResponse||q.shortResponseDraft||"",20)),
  constructedResponseEvaluatorScore:num(q.shortScore),
  evaluatorReviewed:Number.isFinite(Number(q.shortScore))||Boolean(q.shortEvaluatedAt||q.shortFeedback),
  attemptReceipts:Array.isArray(q.attemptHistory)?q.attemptHistory.slice(-12).map(a=>({
   attemptId:clean(a.attemptId,100),score:num(a.score),mastered:a.mastered===true,
   submittedAt:clean(a.submittedAt,40),reviewSkills:Array.isArray(a.reviewSkills)?a.reviewSkills.map(x=>clean(x,80)).filter(Boolean).slice(0,10):[]
  })):[]
 };
}
function buildFromCourse(config){
 const course=config?.courseData,student=config?.student;
 if(!course||!student)throw new Error("Course data and active learner are required.");
 const threshold=Number(config.masteryThreshold)||80;
 const weeks=(course.weeks||[]).map(w=>{
  const lessons=(student.completedLessons?.[w.week]||[]).filter(Boolean).length;
  const assignments=sanitizeAssignments(w,student),quiz=quizRecord(w,student,threshold);
  return {
   week:Number(w.week),title:clean(w.title,180),unit:clean(w.unit,160),
   essentialQuestion:clean(w.essentialQuestion,260),
   lessonsCompleted:lessons,lessonTarget:Number(config.lessonsPerWeek)||5,
   assignments,assignmentsSubmitted:assignments.filter(a=>a.submitted).length,
   quiz,
   mastered:typeof config.weekMastered==="function"?config.weekMastered(student,w):Boolean(lessons===(Number(config.lessonsPerWeek)||5)&&assignments.every(a=>a.submitted)&&quiz.mastered&&quiz.constructedResponseCompleted)
  };
 });
 const majorSource=config.majorAssessments||{};
 const majorAssessments=Object.entries(majorSource).map(([key,value])=>{
  const r=value&&typeof value==="object"?value:{score:value};
  return {id:clean(key,100),score:num(r.bestPercent??r.percent??r.score),submitted:r.submitted===true||r.completed===true,evaluatorReviewed:Boolean(r.evaluatedAt||r.feedback||r.teacherPercent||r.writtenPercent)};
 });
 return {
  schema:SCHEMA,version:VERSION,generatedAt:new Date().toISOString(),
  authority:{
   source:"course-owned learner record",
   readOnlyDerivedExport:true,
   ownsGrades:false,unlocksCurriculum:false,replacesTeacherReview:false,
   containsAssessmentPrompts:false,containsAnswerChoices:false,containsAnswerKeys:false,containsLearnerSelections:false
  },
  learner:{id:clean(student.id,120),name:clean(student.name,160),grade:clean(config.grade,4)},
  course:{id:clean(config.courseId||course.metadata?.courseCode,120),title:clean(config.courseTitle||course.metadata?.courseTitle,180),credit:num(config.credit??course.metadata?.credits??course.metadata?.credit),masteryThreshold:threshold},
  summary:{
   lessonsCompleted:weeks.reduce((n,w)=>n+w.lessonsCompleted,0),
   lessonsTarget:weeks.reduce((n,w)=>n+w.lessonTarget,0),
   assignmentsSubmitted:weeks.reduce((n,w)=>n+w.assignmentsSubmitted,0),
   assignmentsTarget:weeks.reduce((n,w)=>n+w.assignments.length,0),
   weeksMastered:weeks.filter(w=>w.mastered).length,
   weeksTarget:weeks.length,
   courseMastered:config.courseMastered===true,
   officialCreditIssued:config.officialCreditIssued===true
  },
  weeks,majorAssessments,
  evaluatorStatus:config.evaluatorStatus||null,
  notes:"Activity completion is evidence, not a teacher grade. Teacher-scored written work and final-credit issuance remain evaluator-authoritative."
 };
}
function download(record,filename){
 if(!record||record.schema!==SCHEMA)throw new Error("Invalid academic record export.");
 const blob=new Blob([JSON.stringify(record,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=filename||"social-studies-academic-record.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
global.KhaemenesSocialStudiesAcademicRecord=Object.freeze({version:VERSION,schema:SCHEMA,buildFromCourse,download});
})(window);
