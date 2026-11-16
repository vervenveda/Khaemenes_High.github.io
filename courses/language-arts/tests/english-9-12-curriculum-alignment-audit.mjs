/* Khaemenes Academy · English 9–12 academic alignment audit
   Native Node, read-only, no student storage or third-party dependencies.
   node --test courses/language-arts/tests/english-9-12-curriculum-alignment-audit.mjs
   Metadata omissions are disclosed as warnings; never auto-author skills or mastery.
*/
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const titles={9:"ENGLISH_9_CURRICULUM",10:"ELA10_COURSE",11:"ENGLISH_11_CURRICULUM",12:"ENGLISH_12_CURRICULUM"};
function load(grade){
 const filename=path.join(root,"english-"+grade,"assets","curriculum-data.js");
 const text=fs.readFileSync(filename,"utf8").trim();
 const start="window."+titles[grade]+" = ";
 assert.ok(text.startsWith(start),"Unexpected curriculum binding in English "+grade);
 const json=text.slice(start.length).replace(/;\s*$/,"");
 return JSON.parse(json);
}
function validate(grade,data){
 const issues=[],warnings=[];
 const units=data.units||[],weeks=grade===9?(data.weekPlans||[]):(data.weeks||[]);
 const readings=grade===9?weeks.map(w=>w.readingSuggestion):(data.readingAssignments||[]);
 if(units.length!==12)issues.push("Expected 12 units, found "+units.length);
 if(weeks.length!==36)issues.push("Expected 36 weeks, found "+weeks.length);
 if(readings.length!==36)issues.push("Expected 36 reading records, found "+readings.length);
 const ids=new Set();
 for(let i=0;i<weeks.length;i++){
  const w=weeks[i]||{},expected=i+1,number=Number(grade===9?w.n:w.week);
  const unit=Math.ceil(expected/3);
  if(number!==expected)issues.push("Week index mismatch at "+expected);
  if(Number(w.unit)!==unit)issues.push("Week "+expected+" has invalid unit mapping");
  if(ids.has(number))issues.push("Duplicate week "+number);
  ids.add(number);
  const r=readings[i]||{};
  if(!String(r.title||"").trim()||!String(r.author||"").trim())issues.push("Missing reading title/author in week "+expected);
  if(grade!==9&&Number(r.week)!==expected)issues.push("Reading week mismatch "+expected);
  const question=grade===9?w.question:w.essentialQuestion;
  const writing=grade===9?w.writing:w.writingTask;
  if(!String(question||"").trim())issues.push("Week "+expected+" missing essential question");
  if(!String(writing||"").trim())issues.push("Week "+expected+" missing writing task");
  if(grade!==9){
   if(!String(w.masteryEvidence||"").trim())issues.push("Week "+expected+" missing stated mastery evidence");
   if(!Array.isArray(w.quiz)||w.quiz.length!==5)issues.push("Week "+expected+" expected five course-bank questions");
   for(const [j,q] of (w.quiz||[]).entries()){
    if(!q?.question||!Array.isArray(q.choices)||q.choices.length<2||
       !Number.isInteger(q.answer)||q.answer<0||q.answer>=q.choices.length)issues.push("Week "+expected+" question "+(j+1)+" invalid answer or choices");
    if(!String(q?.explanation||"").trim())issues.push("Week "+expected+" question "+(j+1)+" missing rationale");
    if(!String(q?.skill||"").trim())warnings.push("Week "+expected+" question "+(j+1)+" missing skill tag");
   }
  }
 }
 for(let i=0;i<units.length;i++){
  const u=units[i]||{};
  if(Number(grade===9?u.n:u.unit)!==i+1)issues.push("Unit numbering mismatch at "+(i+1));
  if(!String(u.assessment||"").trim())issues.push("Unit "+(i+1)+" lacks an assessment product description");
  if(!Array.isArray(u.standards)||!u.standards.length)issues.push("Unit "+(i+1)+" lacks standards");
 }
 if(grade===9){
  const w12=readings[11],w24=readings[23];
  if(!/translat/i.test(String(w12?.title)+" "+String(w12?.purpose)))issues.push("Week 12 reading lacks translation context");
  if(!/(infographic|data visual)/i.test(String(w24?.title)+" "+String(w24?.purpose)))issues.push("Week 24 reading lacks visual/data literacy context");
 }
 return {issues,warnings};
}
for(const grade of [9,10,11,12]){
 test("English "+grade+" canonical 36-week academic structure, assignments and assessment metadata",()=>{
  const report=validate(grade,load(grade));
  assert.deepEqual(report.issues,[],"Structural curriculum defects must be repaired");
  if(report.warnings.length)process.stdout.write("English "+grade+": "+report.warnings.length+" quiz skill labels require editorial review.\n");
 });
}
test("validator detects malformed synthetic quiz answer without modifying real curriculum",()=>{
 const data=structuredClone(load(11));
 data.weeks[0].quiz[0].answer=999;
 assert.ok(validate(11,data).issues.some(x=>x.includes("invalid answer")));
});
test("validator detects a missing assigned reading source",()=>{
 const data=structuredClone(load(9));
 data.weekPlans[0].readingSuggestion.title="";
 assert.ok(validate(9,data).issues.some(x=>x.includes("Missing reading title")));
});
