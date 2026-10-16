import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const hub=fs.readFileSync(path.join(root,"weeks/week-12/index.html"),"utf8");
const daily=fs.readFileSync(path.join(root,"assets/week12-daily.js"),"utf8");
const assess=fs.readFileSync(path.join(root,"assets/week12-assessment.js"),"utf8");
const course=fs.readFileSync(path.join(root,"assets/course.js"),"utf8");
new vm.Script(daily);new vm.Script(assess);new vm.Script(course);
assert.match(hub,/data-english9-week12-index/);
assert.match(hub,/data-progress-key="week-12" data-managed-progress="week12"/);
assert.equal((hub.match(/data-week12-next-link hidden/g)||[]).length,1);
assert.match(course,/button\.dataset\.managedProgress==="week12"/);
assert.match(course,/field\.dataset\.managedSave==="week12"/);
const originalFields=[...hub.matchAll(/data-save-field="([^"]+)"/g)].map(m=>m[1]);
assert.deepEqual(originalFields,["week-12-claim","week-12-evidence","week-12-reflection"]);
for(let day=56;day<=60;day++){
 const folder=path.join(root,"weeks/week-12/day-"+day),html=fs.readFileSync(path.join(folder,"index.html"),"utf8");
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,"Duplicate element ID Day "+day);
 assert.match(html,new RegExp('data-save-field="week-12-day'+day+'"'));
 assert.match(html,/Connect · Apply · Reflect/);
 assert.match(html,/week12-daily\.js/);
 assert.match(html,/week12-daily\.css/);
 assert.match(hub,new RegExp('day-'+day+'/index.html'));
 for(const entry of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const rel=entry[1].split(/[?#]/)[0];
  if(!rel||/^(?:[a-z][\w+.-]*:|\/\/|\/|#)/i.test(rel))continue;
  assert.ok(fs.existsSync(path.resolve(folder,decodeURIComponent(rel))),"Broken relative Day "+day+" link: "+rel);
 }
 if(day<60){
  const raw=html.match(/id="week12-question-data">([\s\S]*?)<\/script>/);
  assert.ok(raw,"Missing question bank Day "+day);
  const bank=JSON.parse(raw[1]);assert.equal(bank.day,day);assert.equal(bank.questions.length,5);
  for(const q of bank.questions){
   assert.ok(q.question&&q.explanation&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<3);
   assert.equal(q.options.length,3);assert.equal(new Set(q.options).size,3);
  }
  assert.match(html,/id="week12-next-wrap" hidden/);
  if(day===56){assert.match(html,/course-created simulation/);assert.match(html,/180–250/);}
  if(day===57){assert.match(html,/Attribution Before Interpretation/);assert.match(html,/250–350/);}
  if(day===58){assert.match(html,/Accessible Performance|caesura/);assert.match(html,/160–220/);}
  if(day===59){assert.match(html,/16–28/);assert.match(html,/data-save-field="week-12-day59-poem-draft"/);}
 }else{
  assert.match(html,/Four-Poem Portfolio/);
  assert.match(html,/500–700/);assert.match(html,/200–300/);assert.match(html,/2–3 minutes/);
  assert.equal((html.match(/data-week12-import="/g)||[]).length,4);
  assert.equal((html.match(/data-week12-rubric="/g)||[]).length,5);
  for(let i=1;i<=4;i++){
   assert.match(html,new RegExp('data-save-field="week-12-day60-poem'+i+'-draft"'));
   assert.match(html,new RegExp('data-save-field="week-12-day60-poem'+i+'-final"'));
   assert.match(html,new RegExp('data-save-field="week-12-day60-poem'+i+'-revision"'));
  }
  assert.match(html,/data-save-field="week-12-day60-source-mode"/);
  assert.match(html,/week12-assessment\.js/);
  assert.match(html,/id="week12-next-wrap" hidden/);
  assert.doesNotMatch(html,/id="week12-question-data"/);
 }
}
assert.match(daily,/quiz\.best>=80/);
assert.match(daily,/a newer record exists in another tab/);
assert.match(daily,/validReview\(r,sub\)/);
assert.match(assess,/total>=8/);
assert.match(assess,/sourceMap/);
assert.match(assess,/approved\(\)&&review\.passed/);
console.log("PASS English 9 Week 12 structure: preserved original unit lessons and weekly records, 5 independent pages, 20 formative items, portfolio source references, safe relative routes, student integrity gates.");
