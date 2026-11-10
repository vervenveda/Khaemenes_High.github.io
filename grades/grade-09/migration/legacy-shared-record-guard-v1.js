/* Grade 9 preservation guard: read-only shared-dashboard extraction and PE quarantine.
 * Explicit invocation; no identity authentication, mutations, network, or automatic import.
 */
(function(root,factory){
 "use strict";
 const api=factory();
 if(typeof module==="object"&&module.exports)module.exports=api;
 else root.KhaemenesGrade09LegacyPreservation=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 "use strict";
 const KEY="ELA9_36_WEEK_PORTAL_V2",MAX_BYTES=8*1024*1024,MAX_KEYS=10000;
 const asObject=v=>v!==null&&typeof v==="object"&&!Array.isArray(v);
 function validateLearner(id){if(typeof id!=="string"||!id.trim()||id.length>256)throw Error("Explicit learner ID required");return id}
 function extractEnglishDashboard(storage,learnerId){
  validateLearner(learnerId);
  if(!storage||typeof storage.getItem!=="function")throw Error("Storage unavailable");
  const raw=storage.getItem(KEY);
  if(raw===null)return {status:"no-shared-dashboard",source_key:KEY,records:[],ownership_verified:false,source_complete:false};
  if(typeof raw!=="string"||new TextEncoder().encode(raw).byteLength>MAX_BYTES)
   throw Error("Shared dashboard is invalid or too large");
  let dashboard;try{dashboard=JSON.parse(raw)}catch{throw Error("Shared dashboard cannot be parsed; preserve original privately")}
  if(!asObject(dashboard)||!Array.isArray(dashboard.students)||dashboard.students.length>1000)
   throw Error("Invalid shared dashboard structure");
  const matches=dashboard.students.filter(s=>asObject(s)&&s.academyLearnerId===learnerId);
  if(matches.length>1)throw Error("Duplicate learner identity in shared dashboard; manual review required");
  if(storage.getItem(KEY)!==raw)throw Error("Shared dashboard changed during extraction");
  if(!matches.length)return {status:"no-verified-identity-match",source_key:KEY,records:[],ownership_verified:false,source_complete:false};
  const student=matches[0];
  if(typeof student.id!=="string"||!student.id||!asObject(student.progress))
    throw Error("Matched learner progress is invalid; no export generated");
  const record={source_container_key:KEY,record_type:"english9-shared-dashboard-selected-student",
   extraction:"selected-student-projection-not-raw-container",academy_learner_id:learnerId,
   student_record:JSON.parse(JSON.stringify(student)),ownership:"browser-identity-claim-unverified"};
  return {status:"selected-record-projected",source_key:KEY,records:[record],
   ownership_verified:false,source_complete:false,
   warning:"Derived selected learner snapshot only. Preserve original shared dashboard separately with guardian privacy safeguards. No authenticated ownership proof."};
 }
 function quarantinePE(storage){
  if(!storage||!Number.isSafeInteger(storage.length)||storage.length<0||storage.length>MAX_KEYS||
      typeof storage.key!=="function")throw Error("Invalid storage");
  const matches=[],initial=storage.length;
  for(let i=0;i<initial;i++){
   const k=storage.key(i);
   if(typeof k!=="string")continue;
   if(k==="khae.pe.v1.grade9"||/^khae-pe-g9-w(?:[1-9]|[12][0-9]|3[0-6])-days-v1$/.test(k)||
      k.startsWith("khae-pe-assessment-v1-")){
     matches.push({record_family:k==="khae.pe.v1.grade9"?"grade9-journal":
       k.startsWith("khae-pe-assessment-v1-")?"assessment-attempt":"daily-evidence",
       owner_status:"quarantined-unclaimed",contents_read:false});
   }
  }
  if(storage.length!==initial)throw Error("Storage changed during PE discovery");
  return {schema:"khaemenes-pe9-quarantine-discovery-v1",matched_count:matches.length,
   matched_families:matches,values_read:false,ownership_verified:false,
   assigned_to_active_learner:false,cloud_uploaded:false,
   warning:"Counts only, no content. Grade-wide PE keys cannot be attributed to a student automatically."};
 }
 return Object.freeze({version:"1.0",extractEnglishDashboard,quarantinePE});
});
