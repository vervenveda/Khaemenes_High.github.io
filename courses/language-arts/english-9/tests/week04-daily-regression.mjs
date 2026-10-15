import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const hub=fs.readFileSync(path.join(base,"weeks/week-04/index.html"),"utf8");
const generic=fs.readFileSync(path.join(base,"assets/week04-daily.js"),"utf8");
const exam=fs.readFileSync(path.join(base,"assets/week04-assessment.js"),"utf8");
const core=fs.readFileSync(path.join(base,"assets/course.js"),"utf8");
new vm.Script(generic);new vm.Script(exam);new vm.Script(core);
assert.match(hub,/data-english9-week4-index/);
assert.match(hub,/data-managed-progress="week4"/);
assert.match(hub,/data-week04-next-link hidden/);
assert.match(core,/field\.dataset\.managedSave==="week4"/);
assert.match(core,/button\.dataset\.managedProgress==="week4"/);
assert.equal((hub.match(/data-save-field="week-04-day-/g)||[]).length,5);
const hubFields=[...hub.matchAll(/data-save-field="([^"]+)"/g)].map(m=>m[1]);
assert.equal(hubFields.length,8);assert.equal(new Set(hubFields).size,8);
for(let day=16;day<=20;day++){
 const folder=path.join(base,"weeks/week-04/day-"+day),html=fs.readFileSync(path.join(folder,"index.html"),"utf8");
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,"Duplicate HTML IDs in Day "+day);
 assert.match(html,new RegExp('data-save-field="week-04-day-'+day+'"'),"Original daily record changed");
 assert.match(html,/Connect · Apply · Reflect/);
 assert.match(hub,new RegExp('day-'+day+'/index.html'),"Week hub missing day "+day);
 assert.match(html,/week04-daily\.js/);
 assert.match(html,/week04-daily\.css/);
 assert.ok(html.includes("https://vervenveda.github.io/"),"Academy home navigation missing");
 for(const link of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const url=link[1].split(/[?#]/)[0];
  if(!url||/^(?:[a-z][\w+.-]*:|\/\/|\/)/i.test(url))continue;
  assert.ok(fs.existsSync(path.resolve(folder,decodeURIComponent(url))),"Broken Day "+day+" relative resource "+url);
 }
 if(day<20){
  assert.match(html,/id="week4-next-wrap" hidden/);
  assert.doesNotMatch(html,/Next →<\/a>/,"Only one prominent next-lesson button should appear after mastery");
  const q=JSON.parse(html.match(/id="week4-question-data">([\s\S]*?)<\/script>/)[1]);
  assert.equal(q.day,day);assert.equal(q.questions.length,5);
  for(const item of q.questions){assert.equal(item.options.length,3);assert.ok(item.explanation);
   assert.ok(Number.isInteger(item.answer)&&item.answer>=0&&item.answer<3);
   assert.equal(item.options.length,new Set(item.options).size);
  }
  if(day===17)assert.match(html,/Stories Before Pages/);
  if(day===18)assert.match(html,/Keeper of the Last Flame/);
  if(day===19){assert.match(html,/Popol Wuj/);assert.match(html,/Utnapishtim/);}
 }else{
  assert.match(html,/The River’s Promise/);
  assert.match(html,/300–450/);
  assert.match(html,/10-Point Mastery Rubric/);
  assert.match(html,/week04-assessment\.js/);
  assert.match(html,/id="week4-import-review"/);
  assert.doesNotMatch(html,/id="week4-question-data"/,"Independent mastery is not auto-scored");
  assert.equal((html.match(/data-week4-rubric=/g)||[]).length,5);
  assert.match(html,/id="week4-next-wrap" hidden/);
 }
}
assert.match(generic,/a newer record exists in another tab/);
assert.match(generic,/quiz\.best>=80/);
assert.match(generic,/r\.score===sum/);
assert.match(exam,/total>=8/);
assert.match(exam,/if\(!consistent\(\)\|\|W\.frozen/);
assert.match(exam,/submission\.hashes/);
console.log("PASS English 9 Week 04: 5 pages, 20 formative questions, preserved original lesson fields, source passages, unique nav, rubric and route regression.");
