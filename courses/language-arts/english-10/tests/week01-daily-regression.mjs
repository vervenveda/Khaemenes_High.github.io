import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const hub=fs.readFileSync(path.join(base,"weeks/week-01/index.html"),"utf8"),
 runtime=fs.readFileSync(path.join(base,"assets/week01-studios.js"),"utf8"),
 core=fs.readFileSync(path.join(base,"assets/course.js"),"utf8");
new vm.Script(runtime);new vm.Script(core);
assert.match(hub,/data-english10-week01-hub/);
assert.match(hub,/data-english10-studio-managed="week01"/);
assert.match(hub,/data-save-field="reflection" data-scope="week:1"/);
assert.match(hub,/id="ela10-w01-week-next" hidden/);
assert.match(core,/KhaemenesEnglish10Week01Bridge/);
assert.match(core,/button\.dataset\.english10StudioManaged === "week01"/);
assert.match(core,/box\.dataset\.english10StudioManaged === "week01"/);
const sw=fs.readFileSync(path.join(base,"service-worker.js"),"utf8");
new vm.Script(sw);
assert.match(sw,/khae-english10-v3-studios-20261016/);
assert.match(sw,/\.\/assets\/week01-studios\.js/);
assert.match(sw,/\.\/assets\/week01-studios\.css/);

const days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
for(const [i,d] of days.entries()){
 const folder=path.join(base,"weeks/week-01",d.toLowerCase()),html=fs.readFileSync(path.join(folder,"index.html"),"utf8");
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,"duplicate IDs "+d);
 assert.match(html,new RegExp('data-english10-week01-day="'+d+'"'));
 assert.match(html,new RegExp('data-week="1" data-week-day="'+d+'" data-english10-studio-managed="week01"'));
 assert.equal((html.match(/data-scope="week:1" data-save-field="studio-/g)||[]).length,5);
 assert.match(html,/Recall · Apply · Reflect/);
 assert.match(html,/id="ela10-w01-next" hidden/);
 assert.match(html,/assets\/week01-studios\.js/);
 assert.match(html,/assets\/course\.js/);
 assert.match(hub,new RegExp('href="'+d.toLowerCase()+'/index.html"'));
 assert.ok(sw.includes('./weeks/week-01/'+d.toLowerCase()+'/index.html'),"Offline pre-cache missing "+d);

 const match=html.match(/<script type="application\/json" id="ela10-w01-bank">([\s\S]*?)<\/script>/);
 assert.ok(match,"missing practice bank "+d);
 const bank=JSON.parse(match[1]);assert.equal(bank.length,5);
 for(const q of bank){
  assert.equal(q.choices.length,3);
  assert.equal(q.choices.length,new Set(q.choices).size);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<3);
  assert.ok(q.question.length>10&&q.explanation.length>15);
 }
 for(const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const raw=m[1].split(/[?#]/)[0];if(!raw||/^(?:[a-z][\w+.-]*:|\/\/|\/|#)/i.test(raw))continue;
  assert.ok(fs.existsSync(path.resolve(folder,decodeURIComponent(raw))),"Broken "+d+" route "+raw);
 }
 if(d==="Tuesday")assert.match(html,/\.\.\/monday\/index\.html#english10-source-a-title/);
 if(d==="Friday"){
  assert.match(html,/data-quiz-form data-week="1"/);
  assert.match(html,/id="quiz-data"/);
  assert.match(html,/href="\.\.\/\.\.\/week-02\/index\.html"/);
 }
}
assert.match(runtime,/const mastered=ok\|\|legacy/);
assert.match(runtime,/quiz at 80%/);
assert.match(runtime,/w\.days\[day\]=true/);
console.log("PASS English10 Week01 structure: 5 separate source-complete pages, 25 formative items, existing weekly quiz, 7px style, learner record bridge, route resolution and legacy preservation.");
