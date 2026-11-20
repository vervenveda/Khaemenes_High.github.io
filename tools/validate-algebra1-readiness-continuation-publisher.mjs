/* Synthetic runtime regression for Algebra I readiness -> continuation.
 * No real student data, browser storage, network calls, or course grade writes.
 */
import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
import path from "node:path";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const script=fs.readFileSync(path.join(root,"courses/shared/algebra1-readiness-continuation-publisher.js"),"utf8");
const page=fs.readFileSync(path.join(root,"portfolio/index.html"),"utf8");
const report=fs.readFileSync(path.join(root,"portfolio/portfolio-academic-report.js"),"utf8");
assert.match(page,/algebra1-readiness-continuation-publisher\.js\?v=20261120-linked-v1/);
assert.match(report,/\["algebra-1-readiness","english-9-readiness","integrated-science-9-readiness","english-9-objective-evidence"\]\.includes\(record\.courseId\)/);
assert.match(report,/khaemenes-algebra1-readiness-linked/);
function run({grade="09",scoped=true,score=36,ledger=true,foreign=false,malformed=false}={}){
 const result={assessment_id:"KH-MATH-A1-DIAGNOSTIC",attempt_history:[{
  id:"KH-MATH-A1-DIAGNOSTIC",score,total:36,percent:malformed?13:Math.round(score/36*1000)/10,
  submitted:"2026-11-19T15:00:00Z",answer_snapshot:[{privateAnswer:"NEVER_COPIED"}]
 }]};
 let reads=0,writes=0,publishes=0,saved=null;
 const backend={publish:r=>{publishes++;saved=r},readCourse:()=>saved};
 const window={
  localStorage:{getItem:()=>{reads++;throw Error("Raw localStorage read forbidden")},setItem:()=>{writes++}},
  document:{readyState:"complete"},
  addEventListener:()=>{},
  KhaemenesHighProfileGradeContext:{active:()=>({learnerId:foreign?"learner-B":"learner-A",grade})},
  KhaemenesCourseEntryContract:{
   readAcademyProfile:()=>({learnerId:"learner-A"}),
   readJSON:()=>scoped?result:null
  },
  KhaemenesLearningContinuation:ledger?backend:null
 };
 vm.runInNewContext(script,{window,document:window.document});
 const api=window.KhaemenesAlgebra1ReadinessPublisher;
 const first=publishes;
 const replay=api.publish();
 return {first,replay,publishes,saved,reads,writes,inspect:api.inspect()};
}
const ok=run();
const checks=[
 ["exact readiness record",()=>assert.equal(ok.saved.courseId,"algebra-1-readiness")],
 ["36-point scored evidence",()=>assert.equal(ok.saved.assessments[0].earned,36)],
 ["separate from course grade",()=>assert.match(ok.saved.summary,/Not an official course grade/)],
 ["no private answer snapshots",()=>assert(!JSON.stringify(ok.saved).includes("NEVER_COPIED"))],
 ["retries do not duplicate",()=>assert.equal(ok.publishes,1)],
 ["existing result readback verified",()=>assert.equal(ok.replay,true)],
 ["no raw local storage operations",()=>assert.equal(ok.reads+ok.writes,0)],
 ["unscoped result withheld",()=>assert.equal(run({scoped:false}).publishes,0)],
 ["foreign active learner denied",()=>assert.equal(run({foreign:true}).publishes,0)],
 ["no server or ledger denied",()=>assert.equal(run({ledger:false}).publishes,0)],
 ["other grade denied",()=>assert.equal(run({grade:"10"}).publishes,0)],
 ["inconsistent score denied",()=>assert.equal(run({malformed:true}).publishes,0)]
];
for(const [name,fn] of checks){fn();console.log("PASS",name)}
console.log("ALGEBRA1_READINESS_CONTINUATION_SYNTHETIC_PASS="+checks.length);
