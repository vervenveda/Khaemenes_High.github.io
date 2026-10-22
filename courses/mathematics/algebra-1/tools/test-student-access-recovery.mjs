import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const read=p=>fs.readFileSync(new URL(p,import.meta.url),"utf8");
const shared=read("../../../shared/math-entry-gate.js");
const reader=read("../assets/deep-lesson-engine-v1.js");
const loader=read("../assets/unit-page.js");
function decision({learner=true,course="math-algebra1",data={},readiness=null}={}){
  class Storage { constructor(){this.values=new Map(Object.entries(data))} getItem(k){return this.values.get(k)??null} setItem(k,v){this.values.set(k,String(v))} removeItem(k){this.values.delete(k)}}
  const store=new Storage(), profile=learner?{learnerId:"L1"}:null;
  const contract={readAcademyProfile:()=>profile,scopedKey:(k,p)=>k+":learner:"+p.learnerId,
    readJSON:()=>readiness,latest:x=>x,readinessIsValid:x=>!!x,
    routeFor:()=> "unit_0_refresher"};
  const document={documentElement:{dataset:{mathCourseId:course,mathReadinessKey:"ready",mathEvidenceKey:"khaemenes-algebra1-diagnostic-result-v1",mathEntry:"course",mathDiagnosticHref:"diagnostic/",mathStoragePrefixes:"khaemenes-algebra1-"}},readyState:"loading",addEventListener(){}};
  const window={KhaemenesCourseEntryContract:contract,addEventListener(){},setInterval(){}};
  vm.runInNewContext(shared,{window,document,localStorage:store,Storage,console,Date,CustomEvent:class{}});
  return window.KhaemenesMathEntry.decision();
}
const scoped=k=>k+":learner:L1";
const diag=p=>({assessment_id:"KH-MATH-A1-DIAGNOSTIC",lastResult:{id:"KH-MATH-A1-DIAGNOSTIC",percent:p,total:36}});
assert.equal(decision().allow,false,"first visit requires diagnostic");
assert.equal(decision({learner:false}).allow,false,"learner identity is required");
for(const value of [0,52,79,80,100]){
  const data={[scoped("khaemenes-algebra1-diagnostic-result-v1")]:JSON.stringify(diag(value))};
  assert.equal(decision({data}).allow,true,`completed diagnostic at ${value}% must allow learning`);
}
assert.equal(decision({data:{[scoped("khaemenes-algebra1-unit01-a3-v1")]:JSON.stringify({attempts:[{key:"lesson-1",score:80}]})}}).allow,true,"returning lesson evidence must allow entry");
assert.equal(decision({data:{[scoped("khaemenes-algebra1-unit01-a3-v1")]:JSON.stringify({attempts:[],best:{}})}}).allow,false,"empty state must not bypass diagnostic");
assert.equal(decision({course:"math-geometry",readiness:{route:"unit_0_refresher"}}).allow,false,"other math courses retain original checks");
assert.ok(reader.includes("lessonReading"),"reading preserved");
assert.ok(reader.includes("Lesson reading controls") && reader.includes("Read aloud") && reader.includes("Print lesson"),"accessible reading controls present");
assert.ok(reader.includes("original worked-example cards"),"original examples preserved");
assert.ok(!reader.includes('querySelector(".example-grid")?.closest("section")?.remove()'),"worked examples remain visible");
assert.ok(reader.includes("new MutationObserver"),"retake reattachment enabled");
assert.ok(loader.includes("algebra1RetryLoad"),"required loading failure has retry");
assert.ok(loader.includes("strict-mastery-gates"),"mastery gate remains required");
assert.ok(loader.indexOf('scripts.push(new URL("strict-mastery-gates.js"') < loader.indexOf('scripts.push(new URL("algebra1-student-experience-v2.js"'),"required mastery protection precedes optional enhancement");
assert.ok(loader.includes("if(/(?:mastery-authority-v1|unit-page-core|strict-mastery-gates)"),"required dependency errors are detected");
console.log("PASS Algebra I entrance, returning records, reader, retakes, and loader recovery");
