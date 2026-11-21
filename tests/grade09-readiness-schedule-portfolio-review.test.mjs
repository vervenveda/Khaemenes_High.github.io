import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const schedule=read('grades/grade-09/student-profile/schedule/index.html');
const engine=read('grades/shared/high-school-schedule-page.js');
const portfolio=read('portfolio/portfolio-academic-report.js');
const publisher=read('courses/shared/algebra1-readiness-continuation-publisher.js');
const registry=read('grades/grade-09/student-profile/student-course-registry.js');
const from=engine.indexOf('function grade09ReadinessStatus('),to=engine.indexOf('let sequence=0;',from);
assert.ok(from>0&&to>from);
function harness({record=null,learner='learner-synthetic',grade='09'}={}){
 const nodes={grade09ReadinessReview:{hidden:true},grade09ReadinessMessage:{textContent:''}};
 let reads=0,writes=0;
 const contract={readAcademyProfile:()=>({learnerId:learner}),readJSON:()=>{reads++;return record},writeJSON:()=>{writes++;throw Error('FORBIDDEN')}}
 const fn=new Function('grade','contract','$',engine.slice(from,to)+'return {grade09ReadinessStatus,updateGrade09Readiness};');
 const api=fn(grade,contract,id=>nodes[id]);
 return {api,nodes,counts:()=>({reads,writes})};
}
const attempt=(score=36)=>({id:'KH-MATH-A1-DIAGNOSTIC',total:36,score,percent:score/36*100,submitted:'2026-11-19T17:00:00Z'});
test('Schedule review route is the existing Grade9 Student Portfolio, never an automatic upload',()=>{
 assert.match(schedule,/id="grade09ReadinessReview" hidden/);
 assert.match(schedule,/\.\.\/\.\.\/\.\.\/\.\.\/portfolio\/index\.html\?grade=09#homeschoolReport/);
 assert.match(schedule,/No result is transferred by this page/);
 new Script(engine);
});
test('valid learner-scoped result is displayed as advisory evidence without writes',()=>{
 const h=harness({record:{assessment_id:'KH-MATH-A1-DIAGNOSTIC',attempt_history:[attempt(36)]}});
 h.api.updateGrade09Readiness('learner-synthetic');
 assert.equal(h.nodes.grade09ReadinessReview.hidden,false);
 assert.match(h.nodes.grade09ReadinessMessage.textContent,/36\/36/);
 assert.match(h.nodes.grade09ReadinessMessage.textContent,/not a certified course grade or cloud record/);
 assert.deepEqual(h.counts(),{reads:1,writes:0});
});
test('a result belonging to a different learner is never displayed',()=>{
 const h=harness({record:{assessment_id:'KH-MATH-A1-DIAGNOSTIC',attribution:{learnerId:'other-learner'},attempt_history:[attempt()]}});
 h.api.updateGrade09Readiness('learner-synthetic');
 assert.doesNotMatch(h.nodes.grade09ReadinessMessage.textContent,/36\/36/);
 assert.equal(h.counts().writes,0);
});
test('an unscoped or malformed result is not represented as matched evidence',()=>{
 for(const record of [null,{attempt_history:[attempt()]},{assessment_id:'KH-MATH-A1-DIAGNOSTIC',attempt_history:[{...attempt(),score:40}]}]){
  const h=harness({record});
  h.api.updateGrade09Readiness('learner-synthetic');
  assert.match(h.nodes.grade09ReadinessMessage.textContent,/No learner-linked Algebra I readiness/);
 }
});
test('no learner selection suppresses private status and does not read records',()=>{
 const h=harness({record:{assessment_id:'KH-MATH-A1-DIAGNOSTIC',attempt_history:[attempt()]}});
 h.api.updateGrade09Readiness(null);
 assert.equal(h.nodes.grade09ReadinessReview.hidden,true);
 assert.equal(h.nodes.grade09ReadinessMessage.textContent,'');
 assert.deepEqual(h.counts(),{reads:0,writes:0});
});
test('other grade pages do not inspect Grade9 Algebra I evidence',()=>{
 const h=harness({grade:'10'});
 h.api.updateGrade09Readiness('learner-synthetic');
 assert.equal(h.counts().reads,0);
});
test('portfolio explicitly confirms a legacy result and dispatches only after readback',()=>{
 assert.match(portfolio,/Review & Link My Saved Algebra I Result/);
 assert.match(portfolio,/if\(!confirm\("Link this saved Algebra I readiness result/);
 assert.match(portfolio,/READBACK_FAILED/);
 assert.match(portfolio,/khaemenes-algebra1-readiness-linked/);
});
test('source publisher and course registry only trust learner-scoped Algebra I readiness',()=>{
 assert.match(publisher,/contract\.readJSON\(KEY,null,profile\)/);
 assert.match(publisher,/current&&current\.source!==/);
 assert.match(publisher,/Not an official course grade, credit, or verified cloud record/);
 assert.match(registry,/function hasDiagnosticEvidence\(\)/);
 assert.match(registry,/return attempts\.some\(a=>a\?\.id==="KH-MATH-A1-DIAGNOSTIC"/);
});
