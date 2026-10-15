import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const hub=fs.readFileSync(path.join(base,"weeks/week-07/index.html"),"utf8");
const daily=fs.readFileSync(path.join(base,"assets/week07-daily.js"),"utf8");
const assessment=fs.readFileSync(path.join(base,"assets/week07-assessment.js"),"utf8");
const core=fs.readFileSync(path.join(base,"assets/course.js"),"utf8");
new vm.Script(daily);new vm.Script(assessment);new vm.Script(core);
assert.match(hub,/data-english9-week7-index/);
assert.match(hub,/data-managed-progress="week7"/);
assert.match(hub,/data-evidence-only="true"/);
assert.equal((hub.match(/data-week07-next-link hidden/g)||[]).length,1,"Only one hub next-week action");
assert.match(core,/field\.dataset\.managedSave==="week7"/);
assert.match(core,/button\.dataset\.managedProgress==="week7"/);
const hubFields=[...hub.matchAll(/data-save-field="([^"]+)"/g)].map(m=>m[1]);
assert.equal(hubFields.length,8,"Original 5 daily and 3 weekly records preserved");
assert.equal(hubFields.length,new Set(hubFields).size,"No duplicate canonical saved fields");
for(let day=31;day<=35;day++){
 const dir=path.join(base,"weeks/week-07/day-"+day);
 const html=fs.readFileSync(path.join(dir,"index.html"),"utf8");
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,"Duplicated HTML id Day "+day);
 assert.match(html,new RegExp('data-save-field="week-07-day'+day+'"'),"Original writing record missing Day "+day);
 assert.match(html,/Connect · Apply · Reflect/);
 assert.match(html,/week07-daily\.js/);
 assert.match(html,/week07-daily\.css/);
 assert.match(hub,new RegExp('day-'+day+'/index.html'),"Missing direct hub link "+day);
 for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const relative=match[1].split(/[?#]/)[0];
  if(!relative||/^(?:[a-z][\w+.-]*:|\/\/|\/|#)/i.test(relative))continue;
  assert.ok(fs.existsSync(path.resolve(dir,decodeURIComponent(relative))),"Missing Day "+day+" resource: "+relative);
 }
 if(day<=34){
  const raw=html.match(/id="week7-question-data">([\s\S]*?)<\/script>/);
  assert.ok(raw,"Missing practice bank Day "+day);
  const bank=JSON.parse(raw[1]);assert.equal(bank.day,day);assert.equal(bank.questions.length,5);
  for(const q of bank.questions){
   assert.ok(q.question&&q.explanation);
   assert.equal(q.options.length,3);
   assert.equal(q.options.length,new Set(q.options).size);
   assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<3);
  }
  assert.match(html,/id="week7-next-wrap" hidden/);
  assert.equal((html.match(/id="week7-next"/g)||[]).length,1);
  assert.doesNotMatch(html,/>Next →<\/a>/,"Unconditional next button "+day);
  if(day===34)assert.match(html,/data-save-field="week-07-day34-scene-draft"/);
 }else{
  assert.match(html,/The Blue Door/);
  assert.match(html,/300–450/);
  assert.match(html,/350–550/);
  assert.match(html,/100–150/);
  assert.match(html,/10-Point Mastery Rubric/);
  assert.match(html,/week07-assessment\.js/);
  assert.equal((html.match(/data-week7-rubric=/g)||[]).length,5);
  assert.match(html,/id="week7-next-wrap" hidden/);
  assert.doesNotMatch(html,/id="week7-question-data"/,"Independent assessment cannot use formative quiz");
  assert.match(html,/data-save-field="week-07-day35-scene-final"/);
 }
}
assert.match(daily,/quiz\.best>=80/);
assert.match(daily,/another tab/);
assert.match(daily,/validReview\(review,submission\)/);
assert.match(assessment,/total>=8/);
assert.match(assessment,/wc\(analysis\.value\)/);
assert.match(assessment,/inRange\(final\.value,350,550\)/);
assert.match(assessment,/week7-import-review/);
console.log("PASS English 9 Week07 structure: five original daily pages, 20 validated practice questions, unique navigation, preserved learner fields, independent rubric and relative routes.");
