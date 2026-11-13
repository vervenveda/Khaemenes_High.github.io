/* Khaemenes Academy Science 9 — learner-owned, missing-only backup reconciliation.
   Pure operations. No localStorage writes, no implicit migration, no grade authority. */
(function(root){
 "use strict";
 const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
 const obj=v=>v!==null&&typeof v==="object"&&!Array.isArray(v);
 function safeTree(value,depth=0){
  if(depth>32)throw Error("Backup nesting exceeds the safety limit.");
  if(Array.isArray(value)){
   if(value.length>20000)throw Error("Backup array is too large.");
   value.forEach(v=>safeTree(v,depth+1));return;
  }
  if(obj(value)){
   if(Object.keys(value).length>5000)throw Error("Backup record is too large.");
   for(const key of Object.keys(value)){
    if(["__proto__","prototype","constructor"].includes(key))throw Error("Unsafe backup field.");
    safeTree(value[key],depth+1);
   }
  }
 }
 function selectRecord(payload,learnerId){
  if(!obj(payload)||!obj(payload.state)||!Array.isArray(payload.state.students)||typeof learnerId!=="string"||!learnerId)throw Error("Invalid backup or missing learner identity.");
  if(payload.course&&payload.course!=="KH-SCI-IIS9")throw Error("This backup belongs to another course.");
  if(payload.learnerId&&payload.learnerId!==learnerId)throw Error("Backup belongs to another learner.");
  safeTree(payload);
  const records=payload.state.students;
  if(records.length>30)throw Error("Backup contains too many learner records.");
  const matches=records.filter(s=>obj(s)&&s.id===learnerId);
  if(matches.length!==1)throw Error("Backup does not contain exactly one record for the active Academy learner.");
  const student=matches[0];
  if(!obj(student.days)||!obj(student.scores)||!obj(student.attempts)||!obj(student.notes)||!obj(student.exit)||!obj(student.data)||!obj(student.safety))throw Error("Backup learner record is missing required evidence fields.");
  return {record:student,ignoredOtherLearners:records.length-1,legacy:payload.version!==2};
 }
 function mergeMissing(current,incoming){
  if(!obj(current)||!obj(incoming))throw Error("Expected learner evidence objects.");
  const counts={added:0,conflicts:0},clone=v=>JSON.parse(JSON.stringify(v));
  function merge(a,b){
   const out=clone(a);
   for(const [key,value] of Object.entries(b)){
    if(["__proto__","prototype","constructor"].includes(key))throw Error("Unsafe backup field.");
    if(!own(a,key)||a[key]===null||a[key]===undefined||a[key]===""){
     out[key]=clone(value);counts.added++;continue;
    }
    if(obj(a[key])&&obj(value)){out[key]=merge(a[key],value);continue;}
    if(Array.isArray(a[key])&&Array.isArray(value)&&a[key].length===0&&value.length>0){
     out[key]=clone(value);counts.added++;continue;
    }
    if(JSON.stringify(a[key])!==JSON.stringify(value))counts.conflicts++;
   }
   return out;
  }
  const result=merge(current,incoming);
  // Never allow a backup to replace the owning learner identity or name.
  result.id=current.id;
  result.name=current.name;
  return {result,counts};
 }
 root.KhaemenesScience9BackupGuard=Object.freeze({selectRecord,mergeMissing,version:1});
})(typeof window!=="undefined"?window:globalThis);