import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const hub=fs.readFileSync(path.join(root,"weeks/week-05/index.html"),"utf8");
const runtime=fs.readFileSync(path.join(root,"assets/week05-daily.js"),"utf8");
const assess=fs.readFileSync(path.join(root,"assets/week05-assessment.js"),"utf8");
const core=fs.readFileSync(path.join(root,"assets/course.js"),"utf8");
new vm.Script(runtime);new vm.Script(assess);new vm.Script(core);
assert.match(hub,/data-english9-week5-index/);
assert.match(hub,/data-managed-progress="week5"/);
assert.equal((hub.match(/data-week05-next-link hidden/g)||[]).length,2);
assert.match(core,/field\.dataset\.managedSave==="week5"/);
assert.match(core,/button\.dataset\.managedProgress==="week5"/);
const saved=[...hub.matchAll(/data-save-field="([^"]+)"/g)].map(m=>m[1]);
assert.equal(saved.length,8,"Original five day and three weekly writing records preserved");
assert.equal(new Set(saved).size,8,"No duplicate writing keys");
for(let day=21;day<=25;day++){
 const directory=path.join(root,"weeks/week-05/day-"+day);
 const html=fs.readFileSync(path.join(directory,"index.html"),"utf8");
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,"Duplicate ID day "+day);
 assert.ok(html.includes("data-save-field=\"week-05-day"+day+"\""),"Canonical Day "+day+" key missing");
 assert.match(html,/Connect · Apply · Reflect/);
 assert.match(html,/week05-daily\.js/);
 assert.match(html,/week05-daily\.css/);
 assert.match(hub,new RegExp('day-'+day+'/index.html'),"Missing hub link Day "+day);
 for(const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const rel=m[1].split(/[?#]/)[0];if(!rel||/^(?:[a-z][\w+.-]*:|\/\/|\/|#)/i.test(rel))continue;
  assert.ok(fs.existsSync(path.resolve(directory,decodeURIComponent(rel))),"Missing local resource Day "+day+": "+rel);
 }
 if(day<=24){
  const q=JSON.parse(html.match(/id="week5-question-data">([\s\S]*?)<\/script>/)[1]);
  assert.equal(q.day,day);assert.equal(q.questions.length,5);
  for(const v of q.questions){
   assert.equal(v.options.length,3);
   assert.ok(v.question&&v.explanation&&Number.isInteger(v.answer)&&v.answer>=0&&v.answer<3);
   assert.equal(new Set(v.options).size,3);
  }
  assert.match(html,/id="week5-next-wrap" hidden/);
  assert.equal((html.match(/id="week5-next"/g)||[]).length,1);
  assert.match(html,/data-workshop-part=/);
  assert.ok(!html.includes('">Next →</a>'),"Ungated duplicate next link: "+day);
 }else{
  assert.match(html,/Text A · The Wall Builder/);
  assert.match(html,/Text B · The Oar Keeper/);
  assert.match(html,/45 Minutes/);
  assert.match(html,/400–550/);
  assert.match(html,/10-Point Mastery Rubric/);
  assert.match(html,/week05-assessment\.js/);
  assert.equal((html.match(/data-week5-rubric=/g)||[]).length,5);
  assert.match(html,/id="week5-import-review"/);
  assert.match(html,/id="week5-next-wrap" hidden/);
  assert.doesNotMatch(html,/id="week5-question-data"/,"Independent mastery has no auto-scored practice questions");
 }
}
assert.match(runtime,/quiz\.best>=80/);
assert.match(runtime,/another tab/);
assert.match(runtime,/review\.passed/);
assert.match(assess,/total>=8/);
assert.match(assess,/wordRange/);
assert.match(assess,/submissionKey/);
assert.match(assess,/lockedDraft/);
assert.match(assess,/week5-import-review/);
console.log("PASS Week 05 structural regression: five lesson pages, 20 formative questions, canonical learner records, independent 45-minute target and 10-point rubric, relative routes.");
