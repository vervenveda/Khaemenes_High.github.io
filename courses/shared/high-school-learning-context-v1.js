/*
 * Khaemenes High School Learning Context v1.0.0
 * Sanitized cross-course learning evidence for the active Academy learner.
 * Never stores assessment prompts, options, learner selections, or answer keys.
 */
(function attachHighLearningContext(global){
"use strict";
if(global.KhaemenesHighLearningContext)return;
const VERSION="1.0.0";
const LEDGER_KEY="khaemenes_high_learning_ledger_v1";
const CONTEXT_KEY="khaemenes_high_mentor_context_v1";
const PASS=80,MAX_EVENTS=240;
const clean=(v,max=120)=>String(v??"").replace(/[\u0000-\u001f\u007f]/g,"").trim().slice(0,max);
const read=(k,f=null)=>{try{const raw=global.localStorage?.getItem(k);return raw?JSON.parse(raw):f}catch{return f}};
const write=(k,v)=>{try{global.localStorage?.setItem(k,JSON.stringify(v));return true}catch{return false}};

function academyLearner(){
  const profile=global.KhaemenesCourseEntryContract?.readAcademyProfile?.();
  if(profile?.learnerId)return profile;
  const registry=global.KhaemenesFamilyRegistry?.getLearner?.();
  if(registry?.learnerId)return registry;
  const active=read("khaemenes_active_learner_v1",null),family=read("khaemenes_family_registry_v1",null);
  return active&&family?.learners?.[active]?family.learners[active]:null;
}
function learner(){
  const l=academyLearner();if(!l)return null;
  const stage=String(l.stage||"").trim().toLowerCase();
  const grade=String(l.grade||"").replace(/[^0-9]/g,"").padStart(2,"0");
  if(stage!=="high"&&!["09","10","11","12"].includes(grade))return null;
  if(!["09","10","11","12"].includes(grade))return null;
  return Object.assign({},l,{grade,stage:"high"});
}
function ledger(){
  const value=read(LEDGER_KEY,{version:1,learners:{}});
  if(!value||typeof value!=="object"||Array.isArray(value))return{version:1,learners:{}};
  value.learners=value.learners&&typeof value.learners==="object"?value.learners:{};
  return value;
}
function learnerRecord(l=learner()){
  if(!l)return null;
  const data=ledger();
  return data.learners[l.learnerId]||{learnerId:l.learnerId,grade:l.grade,events:[],updatedAt:null};
}
function sanitizeSkills(values){
  return [...new Set((Array.isArray(values)?values:[]).map(v=>clean(v,80)).filter(Boolean))].slice(0,10);
}
function recordEvent(event){
  const l=learner();if(!l)return false;
  const data=ledger(),current=data.learners[l.learnerId]||{learnerId:l.learnerId,grade:l.grade,events:[]};
  const safe={
    schema:"khaemenes-high-learning-event-v1",
    id:"hse-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8),
    learnerId:l.learnerId,
    grade:l.grade,
    courseId:clean(event.courseId||"high-school",100),
    department:clean(event.department||"",60),
    kind:clean(event.kind||"learning-evidence",50),
    scope:clean(event.scope||"",80),
    score:Number.isFinite(Number(event.score))?Math.max(0,Math.min(100,Number(event.score))):null,
    mastered:event.mastered===true,
    masteryThreshold:PASS,
    reviewSkills:sanitizeSkills(event.reviewSkills),
    focus:clean(event.focus||"",220),
    formative:event.formative===true,
    affectsGrade:event.formative===true?false:event.affectsGrade!==false,
    completedAt:typeof event.completedAt==="string"?event.completedAt:new Date().toISOString()
  };
  current.grade=l.grade;
  current.events=Array.isArray(current.events)?current.events:[];
  current.events.push(safe);
  current.events=current.events.slice(-MAX_EVENTS);
  current.updatedAt=safe.completedAt;
  data.learners[l.learnerId]=current;
  if(!write(LEDGER_KEY,data))return false;
  publish(l);
  global.dispatchEvent(new CustomEvent("khaemenes-high-learning-evidence",{detail:{learnerId:l.learnerId,courseId:safe.courseId,kind:safe.kind,score:safe.score,mastered:safe.mastered}}));
  return true;
}
function recordAssessment(event){
  return recordEvent(Object.assign({},event,{formative:false,affectsGrade:true,kind:event?.kind||"assessment"}));
}
function recordFormative(event){
  return recordEvent(Object.assign({},event,{formative:true,affectsGrade:false,kind:event?.kind||"formative"}));
}
function summary(l=learner()){
  if(!l)return null;
  const record=learnerRecord(l),events=(record?.events||[]).filter(e=>e.learnerId===l.learnerId);
  const assessments=events.filter(e=>!e.formative),formatives=events.filter(e=>e.formative),courses={};
  for(const e of assessments){
    const id=e.courseId||"high-school";
    courses[id]||={courseId:id,attempts:0,bestScore:null,latestScore:null,latestMastered:false,lastAt:null,reviewSkills:[]};
    const row=courses[id];row.attempts++;
    if(e.score!==null){row.latestScore=e.score;row.bestScore=row.bestScore===null?e.score:Math.max(row.bestScore,e.score)}
    row.latestMastered=e.mastered;row.lastAt=e.completedAt;
    if(e.reviewSkills.length)row.reviewSkills=e.reviewSkills;
  }
  const recentAssessment=assessments.slice(-1)[0]||null,recentFormative=formatives.slice(-1)[0]||null;
  return{
    version:1,
    stage:"high",
    learnerId:l.learnerId,
    nickname:l.nickname||l.name||null,
    grade:l.grade,
    masteryThreshold:PASS,
    courseSummaries:Object.values(courses),
    recentAssessments:assessments.slice(-20),
    recentFormatives:formatives.slice(-20),
    latestAssessment:recentAssessment,
    latestFormative:recentFormative,
    evidencePrivacy:{
      assessmentQuestionTextPublished:false,
      assessmentOptionsPublished:false,
      learnerSelectionsPublished:false,
      answerKeysPublished:false,
      skillSummaryOnly:true
    },
    updatedAt:record?.updatedAt||new Date().toISOString()
  };
}
function publish(l=learner()){
  if(!l)return null;
  const ctx=summary(l);if(!ctx)return null;
  write(CONTEXT_KEY,ctx);
  global.dispatchEvent(new CustomEvent("khaemenes-high-context-updated",{detail:{learnerId:l.learnerId,grade:l.grade,updatedAt:ctx.updatedAt}}));
  return ctx;
}
function clearStaleContext(){
  const l=learner(),ctx=read(CONTEXT_KEY,null);
  if(ctx&&!l){try{global.localStorage?.removeItem(CONTEXT_KEY)}catch{}}
  else if(l&&ctx?.learnerId!==l.learnerId)publish(l);
}
if(global.document?.readyState==="loading")global.document.addEventListener("DOMContentLoaded",()=>{clearStaleContext();publish()},{once:true});else{clearStaleContext();publish()}
global.addEventListener("khaemenes-family-changed",()=>publish());
global.KhaemenesHighLearningContext=Object.freeze({version:VERSION,ledgerKey:LEDGER_KEY,contextKey:CONTEXT_KEY,masteryThreshold:PASS,learner,recordAssessment,recordFormative,summary,publish});
})(window);
