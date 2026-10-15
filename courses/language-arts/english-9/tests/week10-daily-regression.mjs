import fs from "node:fs";import path from "node:path";import vm from "node:vm";
import assert from "node:assert/strict";import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const hub=fs.readFileSync(path.join(root,"weeks/week-10/index.html"),"utf8");
const runtime=fs.readFileSync(path.join(root,"assets/week10-daily.js"),"utf8");
const exam=fs.readFileSync(path.join(root,"assets/week10-assessment.js"),"utf8");
const core=fs.readFileSync(path.join(root,"assets/course.js"),"utf8");
new vm.Script(runtime);new vm.Script(exam);new vm.Script(core);
assert.match(hub,/data-english9-week10-index/);
assert.match(hub,/data-managed-progress="week10"/);
assert.match(core,/button\.dataset\.managedProgress==="week10"/);
assert.match(core,/field\.dataset\.managedSave==="week10"/);
assert.equal((hub.match(/data-week10-next-link hidden/g)||[]).length,1);
const fields=[...hub.matchAll(/data-save-field="([^"]+)"/g)].map(m=>m[1]);
assert.deepEqual(fields,["week-10-day-46","week-10-day-47","week-10-day-48","week-10-day-50","week-10-claim","week-10-evidence","week-10-reflection"]);
for(let day=46;day<=50;day++){
 const dir=path.join(root,"weeks/week-10/day-"+day),html=fs.readFileSync(path.join(dir,"index.html"),"utf8");
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,"Duplicated IDs Day "+day);
 assert.match(html,/Connect · Apply · Reflect/);
 assert.match(html,/week10-daily\.js/);assert.match(html,/week10-daily\.css/);
 assert.match(hub,new RegExp('day-'+day+'/index.html'));
 for(const item of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const p=item[1].split(/[?#]/)[0];if(!p||/^(?:[a-z][\w+.-]*:|\/\/|\/|#)/i.test(p))continue;
  assert.ok(fs.existsSync(path.resolve(dir,decodeURIComponent(p))),"Broken relative resource Day "+day+": "+p);
 }
 const keys=[...html.matchAll(/data-save-field="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(keys.length,new Set(keys).size,"Duplicate learner writing keys Day "+day);
 if(day<50){
  assert.ok(keys.includes("week-10-day-"+day),"Daily student record Day "+day);
  const raw=html.match(/id="week10-question-data">([\s\S]*?)<\/script>/);
  assert.ok(raw,"Missing formative bank Day "+day);
  const bank=JSON.parse(raw[1]);assert.equal(bank.day,day);assert.equal(bank.questions.length,5);
  for(const q of bank.questions){
   assert.ok(q.question&&q.explanation&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<3);
   assert.equal(q.options.length,3);assert.equal(new Set(q.options).size,3);
  }
  assert.match(html,/id="week10-next-wrap" hidden/);
  assert.equal((html.match(/id="week10-next"/g)||[]).length,1);
  if(day===46)assert.match(html,/After Rain/);
  if(day===47)assert.match(html,/Borrowed Coat/);
  if(day===48)assert.match(html,/Kitchen Light, 2:13 A.M./);
  if(day===49){
   assert.match(html,/12–20/);assert.match(html,/8–16/);
   assert.equal(keys.length,5);
  }
 }else{
  assert.match(html,/Inventory at Dusk/);
  assert.match(html,/300–450/);assert.match(html,/120–180/);
  assert.equal((html.match(/data-week10-rubric=/g)||[]).length,5);
  assert.match(html,/id="week10-next-wrap" hidden/);
  assert.match(html,/week10-assessment\.js/);
  assert.doesNotMatch(html,/week10-question-data/,"Independent mastery has no auto-graded bank");
  assert.equal(keys.length,10);
  assert.match(html,/id="week10-lock-poem1"/);
  assert.match(html,/id="week10-lock-poem2"/);
 }
}
assert.match(runtime,/quiz\.best>=80/);
assert.match(runtime,/a newer record exists in another tab/);
assert.match(runtime,/validReview\(r,sub\)/);
assert.match(exam,/between\(wc\(field\.analysis\.value\),300,450\)/);
assert.match(exam,/between\(lines\(field\.poem1Final\.value\),12,20\)/);
assert.match(exam,/between\(lines\(field\.poem2Final\.value\),8,16\)/);
assert.match(exam,/between\(wc\(field\.craftNote\.value\),120,180\)/);
console.log("PASS Week10 English9 structure: five pages, original 3 poems and cold-reading assessment, unique learner keys, 20 formative items, preserved student poetry and local mastery gate.");
