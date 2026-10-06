(() => {
'use strict';
const COURSE_KEY='khaemenes_grade09_social_studies_v1';
const rawStorage=window.localStorage, known=new Map();let blocked=false,message='';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const number=x=>typeof x==='number'&&Number.isFinite(x);
let profile=null,identity=null;
function fail(reason){blocked=true;message=reason;show();throw new Error(reason);}
function show(){
 if(!document.body)return;
 let note=document.getElementById('ss9-record-notice');
 if(!note){note=document.createElement('p');note.id='ss9-record-notice';note.className='notice';(document.querySelector('main')||document.body).prepend(note);}
 note.textContent=profile?`Learning profile: ${profile.name} · Saved on this device.`:'Standalone workspace · Choose your Academy learner before starting learner-specific work.';
 if(!blocked)return;
 let error=document.getElementById('ss9-record-error');
 if(!error){error=document.createElement('section');error.id='ss9-record-error';error.setAttribute('role','alert');error.style.cssText='position:sticky;top:0;z-index:100000;padding:18px;border:3px solid #a83434;background:#fff1f1;color:#201010';document.body.prepend(error);}
 error.textContent=message+' Saving is paused. Keep this page open and copy unsaved writing or export a backup before reloading. Existing stored records have not been replaced.';
}
try{
 identity=rawStorage.getItem('khaemenes_active_learner_v1');
 const id=JSON.parse(identity||'null');const registry=JSON.parse(rawStorage.getItem('khaemenes_family_registry_v1')||'null');const learner=typeof id==='string'?registry?.learners?.[id]:null;
 if(id!==null && (!learner||learner.learnerId!==id))throw Error('The Academy learner selection is unreadable.');
 if(learner)profile=Object.freeze({learnerId:id,name:String(learner.nickname||'Learner')});
}catch(e){blocked=true;message='The learner selection could not be read. Select the learner again in the Academy Family Portal.';}
const key=base=>profile?`${base}:learner:${encodeURIComponent(profile.learnerId)}`:base;
function checkTree(x,depth=0){
 if(depth>30)throw Error('Record nesting exceeds the supported limit.');
 if(Array.isArray(x)){if(x.length>100000)throw Error('Record array is too large.');x.forEach(v=>checkTree(v,depth+1));}
 else if(object(x)){for(const [k,v] of Object.entries(x)){if(['__proto__','prototype','constructor'].includes(k))throw Error('Unsupported record field.');checkTree(v,depth+1);}}
}
function validDB(db){
 if(!object(db)||db.version!==1||!Array.isArray(db.students)||db.students.length>1000||!object(db.settings))throw Error('Unsupported course record.');
 if(db.activeId!==null&&typeof db.activeId!=='string')throw Error('Invalid active learner.');
 const ids=new Set();
 for(const s of db.students){
  if(!object(s)||typeof s.id!=='string'||!s.id||s.id.length>200||ids.has(s.id)||typeof s.name!=='string'||s.name.length>200)throw Error('Invalid or duplicate learner record.');ids.add(s.id);
  for(const name of ['completedLessons','assignments','quizzes','exams','journal','attendance'])if(s[name]!==undefined&&!object(s[name]))throw Error('Invalid '+name+' record.');
  for(const [week,days] of Object.entries(s.completedLessons||{}))if(!/^(?:[1-9]|[12]\d|3[0-6])$/.test(week)||!Array.isArray(days)||days.length!==5||days.some(v=>typeof v!=='boolean'))throw Error('Invalid lesson record.');
  for(const a of Object.values(s.assignments||{})){if(!object(a))throw Error('Invalid assignment.');if(a.text!==undefined&&typeof a.text!=='string')throw Error('Invalid writing.');if(a.score!==undefined&&a.score!==null&&(!number(a.score)||a.score<0))throw Error('Invalid assignment score.');if(a.possiblePoints!==undefined&&(!number(a.possiblePoints)||a.possiblePoints<=0))throw Error('Invalid possible points.');if(number(a.score)&&number(a.possiblePoints)&&a.score>a.possiblePoints)throw Error('Score exceeds possible points.');}
  for(const r of [...Object.values(s.quizzes||{}),...Object.values(s.exams||{}),...Object.values(s.journal||{})]){if(!object(r))throw Error('Invalid evaluation.');for(const f of ['percent','bestPercent','writtenPercent','teacherPercent','totalPercent','shortPercent'])if(r[f]!==undefined&&r[f]!==null&&(!number(r[f])||r[f]<0||r[f]>100))throw Error('Invalid percentage.');}
 }
 if(db.activeId!==null&&!ids.has(db.activeId))throw Error('The active learner is missing.');
 if(profile&&(db.students.length>1||db.students.some(s=>s.id!==profile.learnerId)||db.activeId!==profile.learnerId))throw Error('This record belongs to a different learner.');
 for(const s of db.students)for(const q of Object.values(s.quizzes||{})){if(q.shortScore!==undefined&&q.shortScore!==null&&(!number(q.shortScore)||q.shortScore<0||q.shortScore>5))throw Error('Invalid written-response score.');}
 checkTree(db);return db;
}
function validate(base,raw){
 if(raw===null)return;
 if(typeof raw!=='string'||raw.length>8*1024*1024)throw Error('Record exceeds the supported size.');
 const value=JSON.parse(raw);checkTree(value);
 if(base===COURSE_KEY)validDB(value);
 if(base==='khaemenes_ss9_readiness_records_v3'&&!Array.isArray(value))throw Error('Invalid readiness history.');
 if(base==='khaemenes_ss9_unit0_v2'&&(!object(value)||!object(value.mastery)||!Array.isArray(value.attempts)||!Array.isArray(value.corrections)))throw Error('Invalid foundations record.');
}
function getItem(base){
 try{const k=key(base);const raw=rawStorage.getItem(k);if(known.has(k)&&known.get(k)!==raw)throw Error("Record changed in another tab.");known.set(k,raw);validate(base,raw);return raw;}catch(e){return fail('Saved '+base.replace('khaemenes_','')+' could not be read safely.');}
}
function mutate(base,value,remove=false){
 if(blocked)throw Error(message);
 try{
  if(rawStorage.getItem('khaemenes_active_learner_v1')!==identity)return fail('The selected Academy learner changed.');
  const k=key(base),current=rawStorage.getItem(k);
  if(known.has(k)&&current!==known.get(k))return fail('This record changed in another tab.');
  if(!remove)validate(base,value);
  if(remove)rawStorage.removeItem(k);else rawStorage.setItem(k,value);
  known.set(k,remove?null:value);
 }catch(e){if(blocked)throw e;return fail('The browser could not save this change: '+e.message);}
}
function prepareDB(db){
 if(!profile)return db;
 if(db.students.length===0){db.students=[{id:profile.learnerId,name:profile.name,created:new Date().toISOString().slice(0,10),completedLessons:{},assignments:{},quizzes:{},exams:{},journal:{},attendance:{}}];db.activeId=profile.learnerId;}
 return validDB(db);
}
function nextWeek(student){
 if(!student)return 1;
 for(let week=1;week<=36;week++){
  const quiz=student.quizzes?.[week],days=student.completedLessons?.[week];
  const reviewed=[1,2,3].every(n=>{const a=student.assignments?.[`${week}-${n}`];return a?.submitted&&typeof a.score==='number'&&Number.isFinite(a.score)&&a.score>=0;});
  if(!Array.isArray(days)||days.filter(Boolean).length!==5||!reviewed||!quiz?.completed||!(quiz.percent>=80)||typeof quiz.shortScore!=='number')return week;
 }
 return 36;
}
function exportDB(db){return {schema:'khaemenes-ss9-backup-v2',courseId:'grade09-global-studies-honors',learnerId:profile?.learnerId||null,exportedAt:new Date().toISOString(),courseRecord:validDB(db)};}
function importDB(input){
 if(!object(input))throw Error('Invalid backup.');
 if(input.schema==='khaemenes-ss9-backup-v2'){
  if(input.courseId!=='grade09-global-studies-honors'||input.learnerId!==(profile?.learnerId||null))throw Error('Choose the learner who owns this backup.');return validDB(input.courseRecord);
 }
 if(profile)throw Error('Unassigned legacy backups cannot be assigned to this Academy learner automatically.');
 return validDB(input);
}
function ready(){show();}
window.KhaemenesSS9Records=Object.freeze({profile,key,storage:Object.freeze({getItem,setItem:(k,v)=>mutate(k,v),removeItem:k=>mutate(k,null,true)}),prepareDB,validDB,nextWeek,exportDB,importDB,isBlocked:()=>blocked});
window.addEventListener('storage',e=>{if(e.key==='khaemenes_active_learner_v1'){blocked=true;message='The Academy learner changed in another tab.';show();}});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
