import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const weekly=fs.readFileSync(path.join(base,"weeks/week-03/index.html"),"utf8");
const js=fs.readFileSync(path.join(base,"assets/week03-daily.js"),"utf8");
const core=fs.readFileSync(path.join(base,"assets/course.js"),"utf8");
const css=fs.readFileSync(path.join(base,"assets/week03-daily.css"),"utf8");
new vm.Script(js);new vm.Script(core);
const original=[...weekly.matchAll(/data-save-field="([^"]+)"/g)].map(m=>m[1]);
assert.equal(original.length,12);assert.equal(new Set(original).size,12);
assert.match(weekly,/data-english9-week3-daily-index/);
assert.match(weekly,/Connect · Apply · Reflect/);
assert.match(weekly,/data-managed-progress="week3"/);
assert.match(core,/field\.dataset\.managedSave==="week3"/);
assert.match(core,/button\.dataset\.managedProgress==="week3"/);
for(let day=11;day<=15;day++){
 const dir=path.join(base,"weeks/week-03/day-"+day);
 const html=fs.readFileSync(path.join(dir,"index.html"),"utf8");
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,"Duplicate IDs Day "+day);
 const fields=[...html.matchAll(/data-save-field="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(fields,original.filter(k=>k.startsWith("week-03-day"+day)),"Original field keys changed Day "+day);
 assert.match(html,/class="spiral-review"/);
 assert.match(html,/Connect &amp; Build · Prior Learning/);
 assert.match(html,/id="week3-next-wrap" hidden/);
 assert.match(html,/id="week3-next"/);
 assert.match(weekly,new RegExp("day-"+day+"/index.html"));
 for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
   const u=match[1].split(/[?#]/)[0];
   if(!u||/^(?:[a-z][\w+.-]*:|\/\/|\/)/i.test(u))continue;
   assert.ok(fs.existsSync(path.resolve(dir,decodeURIComponent(u))),"Broken route Day "+day+": "+u);
 }
 if(day<15){
  assert.match(html,new RegExp('href="../day-'+(day+1)+'/index.html"'));
  const bank=JSON.parse(html.match(/id="week3-questions-data">([\s\S]*?)<\/script>/)[1]);
  assert.equal(bank.day,day);assert.equal(bank.questions.length,5);
  for(const q of bank.questions){
   assert.ok(q.question && q.explanation && q.options.length>=3 && Number.isInteger(q.answer));
   assert.ok(q.answer>=0 && q.answer<q.options.length);
  }
 }else{
  assert.match(html,/Two Maps/);
  assert.match(html,/Every Map Selects/);
  assert.match(html,/Conventions Check · 10 Items/);
  assert.match(html,/10 Points/);
  assert.match(html,/450–650/);
  assert.doesNotMatch(html,/week3-questions-data/);
  assert.match(html,/Lock and preserve Draft 1/);
  assert.ok(html.includes('href="../../week-04/index.html"'));
 }
}
assert.match(css,/\.spiral-steps/);assert.match(css,/\.daily-next\[hidden\]/);
assert.match(js,/localStorage\.getItem\(key\)!==snapshot\.get\(key\)/);
assert.match(js,/practice\.best>=80/);
assert.match(js,/rubricScore>=8/);
assert.match(js,/gradeStatus==="passed"/);
assert.match(js,/masteryAwarded:false/);
console.log("PASS Week03 structure, spiral recall, five routes, 20 formative questions, four independent assessment records and mastery-aware next buttons");
