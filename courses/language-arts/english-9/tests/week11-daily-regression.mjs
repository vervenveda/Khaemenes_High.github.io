import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const hub=fs.readFileSync(path.join(base,"weeks/week-11/index.html"),"utf8");
const daily=fs.readFileSync(path.join(base,"assets/week11-daily.js"),"utf8");
const assess=fs.readFileSync(path.join(base,"assets/week11-assessment.js"),"utf8");
const course=fs.readFileSync(path.join(base,"assets/course.js"),"utf8");
new vm.Script(daily);new vm.Script(assess);new vm.Script(course);
assert.match(hub,/data-english9-week11-index/);
assert.match(hub,/data-progress-key="week-11" data-managed-progress="week11"/);
assert.equal((hub.match(/data-week11-next-link hidden/g)||[]).length,1);
assert.match(course,/field\.dataset\.managedSave==="week11"/);
assert.match(course,/button\.dataset\.managedProgress==="week11"/);
const saved=[...hub.matchAll(/data-save-field="([^"]+)"/g)].map(m=>m[1]);
assert.deepEqual(saved,["week-11-claim","week-11-evidence","week-11-reflection"]);
for(let day=51;day<=55;day++){
 const folder=path.join(base,"weeks/week-11/day-"+day);
 const html=fs.readFileSync(path.join(folder,"index.html"),"utf8");
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,"Duplicate HTML id day "+day);
 if(day<55) assert.match(html,new RegExp('data-save-field="week-11-day-'+day+'"'),"Daily writing field missing "+day);
 assert.match(html,/Connect · Apply · Reflect/);
 assert.match(html,/week11-daily\.js/);
 assert.match(html,/week11-daily\.css/);
 assert.match(hub,new RegExp('day-'+day+'/index.html'),"Hub link missing day "+day);
 for(const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const u=m[1].split(/[?#]/)[0];
  if(!u||/^(?:[a-z][\w+.-]*:|\/\/|\/|#)/i.test(u))continue;
  assert.ok(fs.existsSync(path.resolve(folder,decodeURIComponent(u))),"Missing local Day "+day+" resource: "+u);
 }
 if(day<55){
  const json=html.match(/id="week11-question-data" type="application\/json">([\s\S]*?)<\/script>/);
  assert.ok(json,"Question bank missing "+day);
  const bank=JSON.parse(json[1]);assert.equal(bank.day,day);assert.equal(bank.questions.length,5);
  for(const q of bank.questions){
   assert.ok(q.question&&q.explanation);assert.equal(q.options.length,3);
   assert.equal(q.options.length,new Set(q.options).size);
   assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<3);
  }
  assert.match(html,/id="week11-next-wrap" hidden/);
  assert.equal((html.match(/id="week11-next"/g)||[]).length,1);
  if(day===54){
   assert.match(html,/data-save-field="week-11-day54-poem-draft"/);
   assert.match(html,/data-save-field="week-11-day54-form"/);
  }
 }else{
  assert.match(html,/The Workshop Clock/);
  assert.match(html,/350–500/);
  assert.match(html,/160–220/);
  assert.equal((html.match(/data-week11-rubric=/g)||[]).length,5);
  assert.equal((html.match(/id="week11-annotation-\d"/g)||[]).length,4);
  assert.equal((html.match(/data-save-field="week-11-day55-/g)||[]).length,13);
  assert.match(html,/week11-assessment\.js/);
  assert.match(html,/id="week11-next-wrap" hidden/);
  assert.doesNotMatch(html,/id="week11-question-data"/);
 }
}
assert.match(daily,/quiz\.best>=80/);
assert.match(daily,/a newer record exists in another tab/);
assert.match(daily,/validReview\(r,sub\)/);
assert.match(assess,/total>=8/);
assert.match(assess,/inRange\(wc\(field\.analysis\.value\),350,500\)/);
assert.match(assess,/inRange\(wc\(field\.craft\.value\),160,220\)/);
assert.match(assess,/hasAnnotation/);
console.log("PASS Week11 structural: 5 individual pages, 20 checked formative questions, original weekly records, original poems, 4 annotated craft choices, gated navigation and no missing local routes.");
