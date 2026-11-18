/* Khaemenes Academy · canonical mathematics learner record v1
   Non-destructive consolidation layer. Legacy course stores remain readable while
   this adapter creates one learner-scoped, exportable record per mathematics course. */
(()=>{"use strict";
if(window.KhaemenesMathLearnerRecord)return;
const path=location.pathname.toLowerCase();
const course=path.includes("/pre-algebra/")?"pre-algebra":path.includes("/algebra-1/")?"algebra-1":path.includes("/geometry/")?"geometry":path.includes("/algebra-2/")?"algebra-2":null;
if(!course)return;
const SCHEMA="khaemenes-math-learner-record-v1",ACTIVE_KEY="khaemenes_active_learner_v1",MASTER=80;
const safeParse=(raw,f=null)=>{try{const v=JSON.parse(raw||"null");return v??f}catch{return f}};
const readRaw=k=>{try{return localStorage.getItem(k)}catch{return null}};
const learner=()=>{
 const v=safeParse(readRaw(ACTIVE_KEY),null);
 const id=v?.id??v?.learnerId??v?.studentId??v?.profileId??null;
 const name=v?.name??v?.displayName??v?.studentName??null;
 return {id:id?String(id):"unscoped",name:name?String(name):null,verified:Boolean(id)};
};
const key=()=>SCHEMA+"::"+course+"::"+encodeURIComponent(learner().id);
const clone=v=>safeParse(JSON.stringify(v),v);
function legacyKeys(){
 const exact={
  "pre-algebra":["KHAE_OPEN_PREALGEBRA_FORGE_V2","khaemenes-naib-readiness-profile-v1","khaemenes-prealgebra-unit00-exit-v1","khaemenes-prealgebra-midterm-result-v1","khaemenes-prealgebra-final-result-v1"],
  "algebra-1":["khaemenes-algebra1-course-v1","khaemenes-algebra1-assessment-records-v1"],
  "geometry":["khaemenes-geometry-course-v1","khaemenes-geometry-lesson-progress-v1","khaemenes-geometry-assessment-records-v1","khaemenes-geometry-weekly-mastery-v2"],
  "algebra-2":["khaemenes-algebra2-course-v1","khaemenes-algebra2-lesson-progress-v1","khaemenes-algebra2-assessment-records-v1","khaemenes-algebra2-applied-mission-portfolio-v1"]
 }[course]||[];
 const prefixes={
  "pre-algebra":["khaemenes-prealgebra-unit","khaemenes-prealgebra-u","khaemenes-prealgebra-week","khaemenes-prealgebra-lesson"],
  "algebra-1":["khaemenes-algebra1-","khaemenes-a1-"],
  "geometry":["khaemenes-geometry-"],
  "algebra-2":["khaemenes-algebra2-"]
 }[course]||[];
 const out=new Set(exact);
 try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&prefixes.some(p=>k.startsWith(p)))out.add(k)}}catch{}
 return [...out];
}
function blank(){
 const l=learner();
 return {schema:SCHEMA,version:1,course,learner:l,mastery_target:MASTER,created_at:new Date().toISOString(),updated_at:null,
  provenance:{mode:"browser-local-consolidation",legacy_keys:[],last_capture:null},
  legacy:{},ledger:[],notes:[],health:{last_verified_write:null,last_error:null}};
}
function load(){const current=safeParse(readRaw(key()),null);return current&&current.schema===SCHEMA?current:blank()}
function verifiedWrite(record){
 const k=key(),data=JSON.stringify(record);
 try{
  localStorage.setItem(k,data);
  const check=localStorage.getItem(k);
  if(check!==data)throw Error("write-verification-mismatch");
  return true;
 }catch(error){return {ok:false,error:String(error?.name||error?.message||error)}}
}
function save(record){
 record.updated_at=new Date().toISOString();
 const result=verifiedWrite(record);
 if(result===true){record.health.last_verified_write=record.updated_at;record.health.last_error=null;return true}
 record.health.last_error=result.error;return false;
}
function captureLegacy(reason="manual"){
 const record=load(),captured={};
 for(const k of legacyKeys()){
  const raw=readRaw(k);if(raw==null)continue;
  const parsed=safeParse(raw,raw);
  captured[k]=clone(parsed);
 }
 record.legacy=captured;
 record.provenance.legacy_keys=Object.keys(captured);
 record.provenance.last_capture={at:new Date().toISOString(),reason,count:Object.keys(captured).length};
 const l=learner();record.learner=l;
 const ok=save(record);
 window.dispatchEvent(new CustomEvent("khaemenes-math-record-captured",{detail:{course,key:key(),ok,count:Object.keys(captured).length}}));
 return {ok,record};
}
function append(type,data={},source="course"){
 const record=load();
 record.ledger=Array.isArray(record.ledger)?record.ledger:[];
 const event={id:Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8),at:new Date().toISOString(),type,source,data:clone(data)};
 record.ledger.push(event);if(record.ledger.length>1000)record.ledger=record.ledger.slice(-1000);
 return {ok:save(record),event};
}
function snapshot(){return clone(load())}
function exportRecord(){
 captureLegacy("export");
 const record=load(),blob=new Blob([JSON.stringify(record,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=[course,"learner-record",new Date().toISOString().slice(0,10)].join("-")+".json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 return true;
}
function importRecord(data){
 if(!data||data.schema!==SCHEMA||data.course!==course||typeof data!=="object")return {ok:false,error:"invalid-record"};
 const currentLearner=learner();
 if(data.learner?.id&&currentLearner.verified&&String(data.learner.id)!==String(currentLearner.id))return {ok:false,error:"learner-mismatch"};
 const next=clone(data);next.learner=currentLearner;next.provenance=next.provenance||{};next.provenance.imported_at=new Date().toISOString();
 return {ok:save(next)};
}
function storageHealth(){
 const probe="__khae_math_record_probe__"+Math.random().toString(36).slice(2);
 try{localStorage.setItem(probe,"1");const ok=localStorage.getItem(probe)==="1";localStorage.removeItem(probe);return {available:ok,verified:ok,mode:ok?"protected-local":"unavailable"}}
 catch(error){return {available:false,verified:false,mode:"unavailable",error:String(error?.name||error?.message||error)}}
}
window.KhaemenesMathLearnerRecord=Object.freeze({schema:SCHEMA,course,key,learner,load,snapshot,captureLegacy,append,exportRecord,importRecord,storageHealth,masteryTarget:MASTER});
const boot=()=>captureLegacy("page-load");
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
window.addEventListener("pagehide",()=>captureLegacy("pagehide"));
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")captureLegacy("visibility-hidden")});
})();