/* Grade 10–12 personal editor. Uses Grade 09's established learner-scoped
   high-profile-v1 record, without claiming academic/placement authority. */
(()=>{"use strict";
const grade=String(document.body.dataset.grade||"");
if(!["10","11","12"].includes(grade))return;
const FIELDS=["name","pathway","interests","goals","strengths","supports","portfolio"];
const ACTIVE="khaemenes_active_learner_v1",FAMILY="khaemenes_family_registry_v1";
const KEY="khaemenes-high-profile-v1:learner:";
const $=id=>document.getElementById(id);
const status=$("profileStatus");
function read(key){try{return JSON.parse(localStorage.getItem(key)||"null")}catch{return null}}
function active(){
 const id=read(ACTIVE),registry=read(FAMILY);
 if(typeof id!=="string"||!registry?.learners?.[id])return null;
 const student=registry.learners[id];
 if(student.learnerId!==id||student.stage!=="high"||student.selfDirectedAdult)return null;
 const actual=String(student.grade||"").replace(/^0(?=9$)/,"");
 if(actual!==grade)return null;
 const shared=window.KhaemenesStudentProfileV2?.activeLearner?.()?.learnerId;
 if(shared&&String(shared)!==id)return null;
 return student;
}
let loadedOwner=null;
function notice(message){status.hidden=false;status.textContent=message}
function load(){
 const student=active(),save=$("saveProfile"),download=$("exportProfile");
 loadedOwner=student?.learnerId||null;
 save.disabled=!student;download.disabled=!student;
 if(!student){
  notice("Select an Academy learner registered in Grade "+grade+" before editing. This page will not modify another learner's profile.");
  FIELDS.forEach(id=>{$(id).value=""});return;
 }
 status.hidden=true;
 const p=read(KEY+encodeURIComponent(student.learnerId))||{};
 const shared=window.KhaemenesStudentProfileV2?.read?.(student.learnerId)||{};
 const fallback={name:student.nickname||student.displayName||"",interests:shared.learningMap?.interests?.join(", ")||"",strengths:shared.learningMap?.strengths?.join(", ")||"",supports:shared.learningMap?.supports?.join(", ")||"",goals:shared.compass?.weeklyGoal||""};
 FIELDS.forEach(id=>{$(id).value=String(p[id]??fallback[id]??"")});
}
function collect(student){
 const p=read(KEY+encodeURIComponent(student.learnerId))||{};
 FIELDS.forEach(id=>{p[id]=$(id).value.trim()});
 p.displayName=p.name||p.displayName||student.nickname||"Student";
 p.grade=grade;p.learnerId=student.learnerId;p.updatedAt=new Date().toISOString();
 return p;
}
$("saveProfile").addEventListener("click",()=>{
 const student=active();
 if(!student||student.learnerId!==loadedOwner){notice("Selected learner or grade changed. Reload this profile before saving; nothing was changed.");return}
 const p=collect(student);
 try{localStorage.setItem(KEY+encodeURIComponent(student.learnerId),JSON.stringify(p))}
 catch{notice("Unable to save locally. No other learner record was changed.");return}
 const toList=v=>String(v||"").split(/[\n,]+/).map(x=>x.trim()).filter(Boolean);
 let sync=false;
 try{
  const shared=window.KhaemenesStudentProfileV2;
  const a=shared?.updateLearningMap?.({interests:toList(p.interests),strengths:toList(p.strengths),supports:toList(p.supports)},student.learnerId);
  const b=shared?.updateCompass?.({weeklyGoal:p.goals},student.learnerId);
  sync=a===true&&b===true;
 }catch{}
 notice(sync?"Profile saved for this learner and synchronized with the Academy Learning Profile.":"Profile saved locally for this learner. Academy synchronization is not confirmed.");
});
$("exportProfile").addEventListener("click",()=>{
 const student=active();
 if(!student||student.learnerId!==loadedOwner){notice("Learner selection changed; no export was created.");return}
 const data=collect(student);
 const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="khaemenes-grade"+grade+"-student-profile.json";a.click();
 setTimeout(()=>URL.revokeObjectURL(url),800);
});
load();
window.addEventListener("khaemenes-student-profile-changed",load);
window.addEventListener("pageshow",()=>{const student=active();if((student?.learnerId||null)!==loadedOwner)load()});
})();