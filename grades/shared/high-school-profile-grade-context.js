/* Khaemenes Academy · shared High School learner grade context.
   Read-only, idempotent; never derives placement from age or writes records.
   Grade 09–12 profile surfaces may use this as one common source of identity.
*/
(function(global){
 "use strict";
 if(global.KhaemenesHighProfileGradeContext)return;
 const ALLOWED=new Set(["09","10","11","12"]);
 const ACTIVE="khaemenes_active_learner_v1",FAMILY="khaemenes_family_registry_v1";
 function read(key){try{return JSON.parse(global.localStorage.getItem(key)||"null")}catch{return null}}
 function normalizeGrade(value){
   const v=String(value??"").trim().replace(/^grade[\s-]*/i,"");
   if(!/^(?:0?9|10|11|12)$/.test(v))return null;
   const grade=v.padStart(2,"0");
   return ALLOWED.has(grade)?grade:null;
 }
 function ageFromDate(raw,now=new Date()){
   if(typeof raw!=="string"||!/\d{4}-\d{2}-\d{2}/.test(raw))return null;
   const [y,m,d]=raw.split("-").map(Number);
   const born=new Date(Date.UTC(y,m-1,d));
   if(born.getUTCFullYear()!==y||born.getUTCMonth()!==m-1||born.getUTCDate()!==d)return null;
   const today={y:now.getFullYear(),m:now.getMonth()+1,d:now.getDate()};
   const age=today.y-y-(today.m<m||(today.m===m&&today.d<d)?1:0);
   return age>=0&&age<=120?age:null;
 }
 function active(){
   const id=read(ACTIVE);
   const registry=read(FAMILY);
   if(typeof id!=="string"||!registry?.learners||typeof registry.learners!=="object")return null;
   const learner=registry.learners[id];
   if(!learner||learner.learnerId!==id||learner.selfDirectedAdult)return null;
   const grade=normalizeGrade(learner.grade);
   if(!grade||learner.stage!=="high")return null;
   // Age is display context only; registration grade is the single routing source.
   const dob=learner.dateOfBirth||learner.birthDate||null;
   const age=ageFromDate(dob);
   return Object.freeze({learnerId:id,grade,gradeNumber:Number(grade),
     nickname:String(learner.nickname||"Student").slice(0,120),
     age,gradeSource:"Academy registration",stage:"high"});
 }
 function courseSlots(){
   const ctx=active();
   if(!ctx)return Object.freeze([]);
   const catalog=global.KhaemenesHighEightClass;
   if(typeof catalog?.slots!=="function")return Object.freeze([]);
   try{return Object.freeze(catalog.slots(ctx.gradeNumber).map(item=>Object.freeze({...item})))}catch{return Object.freeze([])}
 }
 global.KhaemenesHighProfileGradeContext=Object.freeze({
   version:"1.0.0",active,courseSlots,normalizeGrade,ageFromDate
 });
})(window);
