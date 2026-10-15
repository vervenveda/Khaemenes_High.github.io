import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const hub=fs.readFileSync(path.join(root,"weeks/week-06/index.html"),"utf8");
const daily=fs.readFileSync(path.join(root,"assets/week06-daily.js"),"utf8");
const assess=fs.readFileSync(path.join(root,"assets/week06-assessment.js"),"utf8");
const course=fs.readFileSync(path.join(root,"assets/course.js"),"utf8");
new vm.Script(daily);new vm.Script(assess);new vm.Script(course);
assert.match(hub,/data-english9-week6-index/);
assert.match(hub,/data-managed-progress="week6"/);
assert.match(hub,/data-evidence-only="true"/);
assert.equal((hub.match(/data-week06-next-link hidden/g)||[]).length,1);
assert.match(course,/field\.dataset\.managedSave==="week6"/);
assert.match(course,/button\.dataset\.managedProgress==="week6"/);
const hubFields=[...hub.matchAll(/data-save-field="([^"]+)"/g)].map(m=>m[1]);
assert.equal(hubFields.length,8);
assert.equal(new Set(hubFields).size,8);
for(let day=26;day<=30;day++){
 const dir=path.join(root,"weeks/week-06/day-"+day);
 const html=fs.readFileSync(path.join(dir,"index.html"),"utf8");
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,"Repeated ID Day "+day);
 assert.ok(html.includes('data-save-field="week-06-day-'+day+'"'),"Original writing field Day "+day);
 assert.match(html,/Connect · Apply · Reflect/);
 assert.match(html,/week06-daily\.js/);
 assert.match(html,/week06-daily\.css/);
 assert.match(hub,new RegExp('day-'+day+'/index.html'));
 for(const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const u=m[1].split(/[?#]/)[0];
  if(!u||/^(?:[a-z][\w+.-]*:|\/\/|\/|#)/i.test(u))continue;
  assert.ok(fs.existsSync(path.resolve(dir,decodeURIComponent(u))),"Broken Day "+day+" route "+u);
 }
 if(day<=29){
  const bank=JSON.parse(html.match(/id="week6-question-data">([\s\S]*?)<\/script>/)[1]);
  assert.equal(bank.day,day);assert.equal(bank.questions.length,5);
  for(const q of bank.questions){
   assert.ok(q.question&&q.explanation&&Number.isInteger(q.answer));
   assert.equal(q.options.length,3);assert.ok(q.answer>=0&&q.answer<3);
   assert.equal(new Set(q.options).size,3);
  }
  assert.match(html,/id="week6-next-wrap" hidden/);
  assert.equal((html.match(/id="week6-next"/g)||[]).length,1);
  assert.doesNotMatch(html,/">Next →<\/a>/,"No duplicate ungated next action");
 }else{
  assert.match(html,/Unit 02 Scholarly Demonstration/);
  assert.match(html,/700–900/);assert.match(html,/180–250/);
  assert.match(html,/4–6/);assert.match(html,/10-Point Rubric/);
  assert.equal((html.match(/data-week6-rubric=/g)||[]).length,5);
  assert.equal((html.match(/id="week6-pattern-\d"/g)||[]).length,6);
  assert.match(html,/id="week6-defense-mode" data-save-field="week-06-day-30-defense-mode"/);
  assert.match(html,/week06-assessment\.js/);
  assert.match(html,/id="week6-next-wrap" hidden/);
  assert.doesNotMatch(html,/id="week6-question-data"/,"No formative short cut on Unit 02 assessment");
 }
}
assert.match(daily,/quiz\.best>=80/);
assert.match(daily,/khaemenes_active_learner_v1/);
assert.match(daily,/another tab/);
assert.match(daily,/validReview\(review,submission\)/);
assert.match(assess,/const pass=evaluated\(\)&&review\.passed/);
assert.match(assess,/defenseMode/);
assert.match(assess,/patterns\.filter/);
assert.match(assess,/count\(draft\.value\)/);
console.log("PASS English 9 Week06 structure: five distinct daily pages, 20 practice items, unchanged canonical weekly writing records, independent Unit02 rubric, gated navigation and valid local routes.");
