import fs from "node:fs";import vm from "node:vm";import path from "node:path";
import assert from "node:assert/strict";import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const hub=fs.readFileSync(path.join(root,"weeks/week-13/index.html"),"utf8"),
 runtime=fs.readFileSync(path.join(root,"assets/week13-daily.js"),"utf8"),
 assess=fs.readFileSync(path.join(root,"assets/week13-assessment.js"),"utf8"),
 core=fs.readFileSync(path.join(root,"assets/course.js"),"utf8");
for(const src of [runtime,assess,core])new vm.Script(src);
assert.match(hub,/data-english9-week13-index/);
assert.match(hub,/data-managed-progress="week13"/);
assert.equal((hub.match(/data-week13-next-link hidden/g)||[]).length,1);
assert.match(core,/button\.dataset\.managedProgress==="week13"/);
assert.match(core,/field\.dataset\.managedSave==="week13"/);
const fields=[...hub.matchAll(/data-save-field="([^"]+)"/g)].map(m=>m[1]);
assert.deepEqual(fields,["week-13-day-61","week-13-day-62","week-13-day-63","week-13-day-64","week-13-day-65","week-13-reflection","week-13-claim","week-13-evidence"]);
for(let day=61;day<=65;day++){
 const folder=path.join(root,"weeks/week-13/day-"+day),h=fs.readFileSync(path.join(folder,"index.html"),"utf8");
 const ids=[...h.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(ids.length,new Set(ids).size,"Duplicate HTML ids Day "+day);
 assert.match(h,new RegExp('data-save-field="week-13-day-'+day+'"'));
 assert.match(h,/Connect · Apply · Reflect/);
 assert.match(h,/MARA: You moved the chair/);
 assert.match(h,/ELIAS: I said the last train had gone/);
 assert.match(h,/week13-daily\.js/);
 assert.match(h,/week13-daily\.css/);
 assert.match(hub,new RegExp('day-'+day+'/index.html'));
 for(const item of h.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const uri=item[1].split(/[?#]/)[0];
  if(!uri||/^(?:[a-z][\w+.-]*:|\/\/|\/|#)/i.test(uri))continue;
  assert.ok(fs.existsSync(path.resolve(folder,decodeURIComponent(uri))),"Broken relative route Day "+day+" "+uri);
 }
 if(day<65){
  const data=h.match(/id="week13-question-data">([\s\S]*?)<\/script>/);assert.ok(data);
  const q=JSON.parse(data[1]);assert.equal(q.day,day);assert.equal(q.questions.length,5);
  q.questions.forEach(x=>{assert.equal(x.options.length,3);assert.ok(Number.isInteger(x.answer)&&x.answer>=0&&x.answer<3);assert.ok(x.explanation);assert.equal(new Set(x.options).size,3);});
  assert.match(h,/id="week13-next-wrap" hidden/);
  assert.match(h,/data-workshop-part=/);
 }else{
  assert.match(h,/400–550/);assert.match(h,/150–250/);
  assert.equal((h.match(/data-week13-rubric=/g)||[]).length,5);
  for(const k of ["plan-a","plan-b","director-note","rehearsal","analysis","reflection"])
   assert.match(h,new RegExp('data-save-field="week-13-day65-'+k+'"'));
  assert.match(h,/week13-assessment\.js/);
  assert.match(assess,/by\[v\?"week-13-day65-"\+v:"week-13-day-65"\]/);
  assert.match(h,/id="week13-next-wrap" hidden/);
  assert.doesNotMatch(h,/id="week13-question-data"/);
 }
}
assert.match(runtime,/quiz\.best>=80/);
assert.match(runtime,/a newer record exists in another tab/);
assert.match(runtime,/validReview\(review,sub\)/);
assert.match(assess,/total>=8/);
assert.match(assess,/range\(f\.analysis\.value,400,550\)/);
assert.match(assess,/range\(f\.reflection\.value,150,250\)/);
console.log("PASS Week13 structure: five individual preserved lessons, 20 formative questions, original drama source, original 8/10 rubric, local routes and unchanged weekly records.");
