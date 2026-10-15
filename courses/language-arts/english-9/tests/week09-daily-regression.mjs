import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const hub=fs.readFileSync(path.join(base,"weeks/week-09/index.html"),"utf8");
const daily=fs.readFileSync(path.join(base,"assets/week09-daily.js"),"utf8");
const exam=fs.readFileSync(path.join(base,"assets/week09-assessment.js"),"utf8");
const course=fs.readFileSync(path.join(base,"assets/course.js"),"utf8");
new vm.Script(daily);new vm.Script(exam);new vm.Script(course);
assert.match(hub,/data-english9-week9-index/);
assert.match(hub,/data-managed-progress="week9"/);
assert.equal((hub.match(/data-week09-next-link hidden/g)||[]).length,1);
assert.match(course,/field\.dataset\.managedSave==="week9"/);
assert.match(course,/button\.dataset\.managedProgress==="week9"/);
const weekly=[...hub.matchAll(/data-save-field="([^"]+)"/g)].map(m=>m[1]);
assert.deepEqual(weekly,["week-09-purpose","week-09-arc","week-09-diagnosis","week-09-reflection"]);
for(let d=41;d<=45;d++){
 const folder=path.join(base,"weeks/week-09/day-"+d),h=fs.readFileSync(path.join(folder,"index.html"),"utf8");
 const ids=[...h.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,"Duplicate Day "+d+" HTML ids");
 assert.match(h,new RegExp('data-save-field="week-09-day'+d+'"'));
 assert.match(h,/Connect · Apply · Reflect/);
 assert.match(h,/week09-daily\.js/);
 assert.match(h,/week09-daily\.css/);
 assert.match(hub,new RegExp('day-'+d+'/index.html'));
 for(const match of h.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const p=match[1].split(/[?#]/)[0];
  if(!p||/^(?:[a-z][\w+.-]*:|\/\/|\/|#)/i.test(p))continue;
  assert.ok(fs.existsSync(path.resolve(folder,decodeURIComponent(p))),"Missing local Day "+d+" resource "+p);
 }
 if(d<45){
  const raw=h.match(/id="week9-question-data">([\s\S]*?)<\/script>/);
  assert.ok(raw,"Missing quiz data");
  const bank=JSON.parse(raw[1]);assert.equal(bank.day,d);assert.equal(bank.questions.length,5);
  for(const q of bank.questions){
   assert.equal(q.options.length,3);assert.equal(new Set(q.options).size,3);
   assert.ok(q.question&&q.explanation&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<3);
  }
  assert.match(h,/id="week9-next-wrap" hidden/);
  assert.equal((h.match(/id="week9-next"/g)||[]).length,1);
  if(d===42)assert.match(h,/data-save-field="week-09-day42-opening"/);
  if(d===43)assert.match(h,/data-save-field="week-09-day43-draft"/);
  if(d===44)assert.match(h,/data-save-field="week-09-day44-revised"/);
 }else{
  assert.match(h,/Unit 03 Narrative Demonstration/);
  assert.match(h,/900–1,400/);
  assert.match(h,/250–350/);
  assert.equal((h.match(/data-week9-rubric=/g)||[]).length,5);
  assert.equal((h.match(/id="week9-craft-\d"/g)||[]).length,6);
  assert.match(h,/week09-assessment\.js/);
  assert.match(h,/id="week9-next-wrap" hidden/);
  assert.doesNotMatch(h,/id="week9-question-data"/);
 }
}
assert.match(daily,/quiz\.best>=80/);
assert.match(daily,/a newer record exists in another tab/);
assert.match(daily,/validReview\(review,sub\)/);
assert.match(exam,/total>=8/);
assert.match(exam,/inRange\(f\.final\.value,900,1400\)/);
assert.match(exam,/inRange\(f\.commentary\.value,250,350\)/);
assert.match(exam,/hasCraft/);
console.log("PASS English9 Week09 structural: four original weekly records, five standalone lesson pages, 20 formative questions, original creative assessment standards and validated relative routes.");
