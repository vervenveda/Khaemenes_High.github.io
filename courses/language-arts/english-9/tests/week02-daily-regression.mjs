
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const weekly=fs.readFileSync(path.join(root,"weeks/week-02/index.html"),"utf8");
const runtime=fs.readFileSync(path.join(root,"assets/week02-daily.js"),"utf8");
const core=fs.readFileSync(path.join(root,"assets/course.js"),"utf8");
new vm.Script(runtime);new vm.Script(core);
assert.match(weekly,/data-english9-week2-daily-index/);
assert.match(core,/field\.dataset\.managedSave==="week2"/);
assert.match(weekly,/data-evidence-only="true"/);
const names=["From Topic to Claim","Build a Paragraph of Analysis","Integrate Quotations","Revise for Precision","First Literary Analysis"];
const original=[...weekly.matchAll(/data-save-field="([^"]+)"/g)].map(m=>m[1]);
assert.equal(original.length,9,"Week 2 canonical response count unchanged");
const all=new Set([...walk(root),...walk(path.resolve(root,"..","..",".."))]);
function* walk(directory){
 for(const item of fs.readdirSync(directory,{withFileTypes:true})){
  const full=path.join(directory,item.name);
  if(item.isFile())yield full;else if(item.isDirectory()&&![".git","node_modules"].includes(item.name))yield* walk(full);
 }
}
for(let d=6;d<=10;d++){
 const folder=path.join(root,"weeks/week-02/day-"+String(d).padStart(2,"0")),html=fs.readFileSync(path.join(folder,"index.html"),"utf8");
 assert.ok(html.includes(names[d-6]),"Missing lesson "+d);
 const fields=[...html.matchAll(/data-save-field="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(fields,original.filter(x=>x.startsWith("week-02-day"+d+"-")),"Canonical original answer fields Day "+d);
 assert.match(html,/data-managed-save="week2"/);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,"Duplicate HTML ID Day "+d);
 const bank=JSON.parse(html.match(/id="daily-exercise-data">([\s\S]*?)<\/script>/)[1]);
 assert.equal(bank.day,d);assert.equal(bank.questions.length,5,"80% must be reachable via four of five");
 for(const q of bank.questions){
  assert.ok(q.question&&q.explanation&&Array.isArray(q.options)&&q.options.length>=3);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length);
  assert.equal(new Set(q.options).size,q.options.length);
 }
 assert.match(weekly,new RegExp("day-"+String(d).padStart(2,"0")+"/index.html"),"Weekly index links Day "+d);
 for(const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const url=m[1].split(/[?#]/)[0];if(!url||/^(?:[a-z][\w+.-]*:|\/\/|\/)/i.test(url))continue;
  assert.ok(fs.existsSync(path.resolve(folder,decodeURIComponent(url))),"Missing relative link Day "+d+": "+url);
 }
 if(d>=7&&d<=9)assert.match(html,/The Key on the Windowsill/,"Original Text A available inside stand-alone lesson");
 if(d===6)assert.doesNotMatch(html,/The Locked Cabinet/,"Day 1 story must not crowd Day 6");
 if(d===10){assert.match(html,/The Map in the Rain/);assert.match(html,/10-Point Mastery Rubric/);assert.match(html,/350–500/);}
}
assert.match(runtime,/localStorage\.getItem\(key\)!==snapshot\.get\(key\)/,"Compare-before-write");
assert.match(runtime,/khaemenes_active_learner_v1/,"Learner identity lock");
assert.match(runtime,/week-02-day-/,"Day flags");
assert.match(runtime,/evidencePrepared/,"Evidence is distinct from a graded assessment");
console.log("PASS Week 02 structure: 5 lessons, 25 checked practice prompts, original 9 answer fields, source readings, routes, syllabus and rubric");
