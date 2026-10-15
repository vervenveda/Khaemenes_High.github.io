import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const hub=fs.readFileSync(path.join(base,"weeks/week-08/index.html"),"utf8");
const daily=fs.readFileSync(path.join(base,"assets/week08-daily.js"),"utf8");
const assessment=fs.readFileSync(path.join(base,"assets/week08-assessment.js"),"utf8");
const core=fs.readFileSync(path.join(base,"assets/course.js"),"utf8");
new vm.Script(daily);new vm.Script(assessment);new vm.Script(core);
assert.match(hub,/data-english9-week8-index/);
assert.match(hub,/data-managed-progress="week8"/);
assert.equal((hub.match(/data-week08-next-link hidden/g)||[]).length,1);
assert.match(core,/field\.dataset\.managedSave==="week8"/);
assert.match(core,/button\.dataset\.managedProgress==="week8"/);
const hubFields=[...hub.matchAll(/data-save-field="([^"]+)"/g)].map(m=>m[1]);
assert.equal(hubFields.length,8);assert.equal(new Set(hubFields).size,8);
for(let day=36;day<=40;day++){
 const folder=path.join(base,"weeks/week-08/day-"+day);
 const html=fs.readFileSync(path.join(folder,"index.html"),"utf8");
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,"Duplicate HTML IDs for Day "+day);
 assert.match(html,new RegExp('data-save-field="week-08-day'+day+'"'),"Original daily response was changed");
 assert.match(html,/Connect · Apply · Reflect/);
 assert.match(html,/week08-daily\.js/);assert.match(html,/week08-daily\.css/);
 assert.match(hub,new RegExp('day-'+day+'/index.html'));
 for(const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const u=m[1].split(/[?#]/)[0];
  if(!u||/^(?:[a-z][\w+.-]*:|\/\/|\/|#)/i.test(u))continue;
  assert.ok(fs.existsSync(path.resolve(folder,decodeURIComponent(u))),"Broken resource Day "+day+": "+u);
 }
 if(day<40){
  const raw=html.match(/id="week8-question-data">([\s\S]*?)<\/script>/);assert.ok(raw);
  const bank=JSON.parse(raw[1]);assert.equal(bank.day,day);assert.equal(bank.questions.length,5);
  for(const q of bank.questions){
   assert.ok(q.question&&q.explanation&&Number.isInteger(q.answer));
   assert.equal(q.options.length,3);assert.equal(new Set(q.options).size,3);
   assert.ok(q.answer>=0&&q.answer<3);
  }
  assert.match(html,/id="week8-next-wrap" hidden/);
  assert.equal((html.match(/id="week8-next"/g)||[]).length,1);
  assert.doesNotMatch(html,/>Next →<\/a>/,"Ungated duplicate next link");
  if(day===39)assert.match(html,/data-save-field="week-08-day39-perspective-draft"/);
 }else{
  assert.match(html,/The Red Envelope/);
  assert.match(html,/350–500/);assert.match(html,/180–260/);assert.match(html,/100–140/);
  assert.match(html,/week08-assessment\.js/);
  assert.equal((html.match(/data-week8-rubric=/g)||[]).length,5);
  assert.match(html,/id="week8-next-wrap" hidden/);
  assert.doesNotMatch(html,/id="week8-question-data"/);
  assert.match(html,/week8-lock-analysis/);
  assert.match(html,/week8-lock-perspective/);
  assert.match(html,/data-save-field="week-08-day40-perspective-character"/);
 }
}
assert.match(daily,/quiz\.best>=80/);
assert.match(daily,/another tab/);
assert.match(daily,/validReview\(review,sub\)/);
assert.match(assessment,/total>=8/);
assert.match(assessment,/inRange\(f\.analysisFinal\.value,350,500\)/);
assert.match(assessment,/inRange\(f\.perspectiveFinal\.value,180,260\)/);
assert.match(assessment,/inRange\(f\.craftNote\.value,100,140\)/);
console.log("PASS English 9 Week08 structural regression: five individual lessons, 20 checked questions, canonical saved fields, unique navigation, original Day40 reading and authentic rubric requirements.");
