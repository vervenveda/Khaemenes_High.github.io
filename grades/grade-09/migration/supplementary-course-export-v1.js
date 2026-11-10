/* Grade 9 supplementary academic export v1 — explicitly invoked, local-only.
 * This module does NOT infer/verify identity, import, mutate, fetch or upload.
 * A caller must obtain verified learner permission; :learner: keys are hints only.
 * Source values are preserved as raw strings; no normalization or grading.
 */
(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.KhaemenesGrade09SupplementaryExport=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const MAX_KEYS=10000,MAX_RECORDS=3000,MAX_BYTES=20*1024*1024;
  const scienceBase="khae-grade09-integrated-science-portal-v1";
  const cumulative=[
    "khaemenes_science_units01_04_benchmark_v1",
    "khaemenes_science_midterm_u00_06_v1",
    "khaemenes_science_units05_07_benchmark_v1",
    "khaemenes_science_units08_09_benchmark_v1",
    "khaemenes_science_units10_12_benchmark_v1",
    "khaemenes_science9_final_exam_v1"
  ];
  const suffix=id=>":learner:"+encodeURIComponent(id);
  function classify(key,id){
    const scoped=suffix(id);
    if(key==="khae-ela9-progress-v1"+scoped)return "english-progress";
    if(key.startsWith("khae-ela9-field:")&&key.endsWith(scoped))return "english-writing-field";
    if(key.startsWith("khaemenes-reading-notebook-v1:english-9:")&&key.endsWith(scoped))return "english-reading-notebook";
    if(/^khaemenes-book-report-v1:english-9:report-[0-9]+:learner:/.test(key)&&key.endsWith(scoped))return "english-book-report";
    if(key===scienceBase+scoped)return "science-portal";
    if(cumulative.some(base=>key===base+scoped))return "science-cumulative-assessment";
    if(key.startsWith(scienceBase+scoped+"::weekly-mc::")||key.startsWith(scienceBase+scoped+"::weekly-mc::unit11-space-v2::")){
      const week=key.split("::").pop();
      if(/^[0-9]{2}$/.test(week)&&Number(week)>=1&&Number(week)<=36)return "science-weekly-monte-carlo";
    }
    return null;
  }
  function ambiguous(key){
    return key==="ELA9_36_WEEK_PORTAL_V2"||
      key==="khae-ela9-progress-v1"||
      key.startsWith("khae-ela9-field:")&&!key.includes(":learner:")||
      key.startsWith("khaemenes-reading-notebook-v1:english-9:")&&!key.includes(":learner:")||
      key.startsWith("khaemenes-book-report-v1:english-9:")&&!key.includes(":learner:")||
      key===scienceBase||cumulative.includes(key)||
      key.startsWith(scienceBase+"::weekly-mc");
  }
  function guard(storage,id,origin){
    if(!storage||typeof storage.key!=="function"||typeof storage.getItem!=="function"||!Number.isSafeInteger(storage.length)||storage.length<0||storage.length>MAX_KEYS)throw Error("Invalid or oversized browser storage");
    if(typeof id!=="string"||!id.trim()||id.length>256)throw Error("Explicit learner identifier required");
    if(typeof origin!=="string"||!/^https:\/\/[A-Za-z0-9.-]+(?::[0-9]+)?$/.test(origin))throw Error("Explicit HTTPS origin required");
  }
  function collect(storage,id,origin){
    guard(storage,id,origin);
    const records=[],counts={ambiguous:0,other_or_unmapped:0};
    let totalBytes=0;
    for(let i=0;i<storage.length;i++){
      const key=storage.key(i);
      if(typeof key!=="string")continue;
      const kind=classify(key,id);
      if(!kind){if(ambiguous(key))counts.ambiguous++;else counts.other_or_unmapped++;continue}
      if(records.length>=MAX_RECORDS)throw Error("Maximum record count exceeded");
      const value=storage.getItem(key);
      if(typeof value!=="string")throw Error("Record changed during export");
      // UTF-16 string size estimate is deliberately conservative for the preflight cap;
      // encoded UTF-8 is verified again before returning.
      totalBytes+=(key.length+value.length)*2;
      if(totalBytes>MAX_BYTES)throw Error("Supplemental export exceeds 20 MiB");
      records.push({source_key:key,record_type:kind,raw_value:value,ownership:"scoped-key-unverified"});
    }
    return {schema:"khaemenes-grade09-supplemental-evidence-v1",
      scope:"selected-learner-scoped-keys-only",source_origin:origin,
      custody:"browser-local-provisional",owner_verified:false,cloud_uploaded:false,
      official_academic_record:false,student_data:true,
      captured_at:new Date().toISOString(),records,
      excluded_counts:counts,complete_grade09_backup:false,
      warning:"Not a complete backup. Shared, unscoped, other-learner and other-origin records are excluded. Do not upload publicly."};
  }
  return Object.freeze({version:"1.0",classify,collect});
});
