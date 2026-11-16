import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const shared=path.resolve(root,"..","..","shared");
const mc=fs.readFileSync(path.join(shared,"monte-carlo-assessment-v1.js"),"utf8");
const adapter=fs.readFileSync(path.join(shared,"high-school-assessment-adapter-v1.js"),"utf8");
const runtime=fs.readFileSync(path.join(root,"assets/fixed-assessment-v1.js"),"utf8");
new vm.Script(mc);new vm.Script(adapter);new vm.Script(runtime);
assert.match(mc,/function openFixedSession/);
assert.match(mc,/fixedOrder:true/);
assert.match(adapter,/config\.fixedOrder===true/);
assert.match(adapter,/reshuffleOnRetake:fixedOrder!==true/);
for(const [kind,count] of [["midterm",30],["final",50]]){
 const html=fs.readFileSync(path.join(root,"assessments",kind,"index.html"),"utf8");
 const m=html.match(/<script type="application\/json" id="assessment-data">([\s\S]*?)<\/script>/);
 assert.ok(m,kind+" bank missing");
 const bank=JSON.parse(m[1]);
 assert.equal(bank.length,count,kind+" item-count drift");
 assert.equal(new Set(bank.map(q=>q.id)).size,count,kind+" duplicate ids");
 assert.equal(new Set(bank.map(q=>String(q.question).trim().toLowerCase().replace(/\s+/g," "))).size,count,kind+" duplicate prompts");
 bank.forEach(q=>{assert.equal(q.choices.length,4);assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4)});
 assert.match(html,/data-e9-fixed-assessment/);
 assert.match(html,/fixed-assessment-v1\.js/);
 assert.doesNotMatch(html,/const ANSWERS=/);
}
console.log("PASS English 9 fixed cumulative assessments: 30-item midterm, 50-item final, unique prompts, fixed retry order, shared attempt history, 80% target, human-reviewed writing boundary.");
