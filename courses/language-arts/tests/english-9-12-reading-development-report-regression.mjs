/* Khaemenes Academy | Universal English 9–12 reading development report.
 * Run: node --test courses/language-arts/tests/english-9-12-reading-development-report-regression.mjs
 * Synthetic learner data only. No student records or official gradebook writes.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const file=(grade,suffix)=>fs.readFileSync(path.join(root,"english-"+grade,suffix),"utf8");
const metrics=["entries","assigned","independent","minutes","weeks","units"];

test("every grade exposes the same six reading progress indicators and source distribution",()=>{
 for(const grade of [9,10,11,12]){
  const html=file(grade,"records/progress-report.html");
  for(const key of metrics)assert.ok(html.includes('data-reading-stat="'+key+'"'),"English "+grade+" missing "+key);
  assert.match(html,/data-reading-source-distribution/);
  assert.match(html,/Reading Development/);
  assert.match(html,/Reading Log/);
  assert.match(html,/Assigned Weeks Logged/);
  assert.match(html,/does not|do not|not proof|non-grading/i);
 }
});
test("Grade 9 learner contract loads before reading report",()=>{
 const html=file(9,"records/progress-report.html");
 assert.ok(html.indexOf('shared/course-entry-contract.js')<html.indexOf('assets/course.js'));
 assert.ok(html.indexOf('assets/course.js')<html.indexOf('assets/progress-report-v1.js'));
});
function grade9Fixture(valid=true){
 const entries=new Map();
 const scoped=key=>key+":learner:testA";
 const put=(key,value)=>entries.set(scoped(key),typeof value==="string"?value:JSON.stringify(value));
 put("ELA9_36_WEEK_PORTAL_V2",{activeId:"studentA",students:[{id:"studentA",progress:{weeks:{"1":{reading:{status:"Complete",minutes:20,reflection:"Interpretation"}},"2":{reading:{status:"not started",minutes:0}}}}}]});
 put("khae-ela9-field:reading-title-1","Assigned work");
 put("khae-ela9-field:reading-week-1","1");
 put("khae-ela9-field:reading-curriculum-type-1","Assigned");
 put("khae-ela9-field:reading-source-status-1","Public domain");
 put("khae-ela9-field:reading-amount-1","12 pages");
 put("khae-ela9-field:reading-title-2","Independent work");
 put("khae-ela9-field:reading-week-2","2");
 put("khae-ela9-field:reading-curriculum-type-2","Independent");
 put("khae-ela9-field:reading-source-status-2","Library / licensed access");
 put("khae-ela9-field:reading-amount-2","45 minutes");
 put("khae-ela9-field:reading-title-3","Old unclassified work");
 const elements=new Map();
 const make=()=>({textContent:"",children:[],replaceChildren(){this.children=[]},append(x){this.children.push(x)}});
 const document={readyState:"complete",querySelector(sel){if(!elements.has(sel))elements.set(sel,make());return elements.get(sel)},createTextNode:s=>({textContent:s}),createElement:()=>make()};
 const profile={learnerId:"testA"};
 const window={KhaemenesEnglish9Records:{profile,storageKey:scoped},KhaemenesCourseEntryContract:{readAcademyProfile:()=>valid?profile:null}};
 const localStorage={getItem:key=>entries.get(key)??null};
 vm.runInNewContext(file(9,"assets/progress-report-v1.js"),{window,document,localStorage},{filename:"progress-report-v1.js"});
 const value=key=>elements.get('[data-reading-stat="'+key+'"]')?.textContent;
 return {value,elements};
}
test("English 9 counts explicitly classified reading and never guesses minutes from pages",()=>{
 const s=grade9Fixture();
 assert.equal(s.value("entries"),"3");
 assert.equal(s.value("assigned"),"1 / 36");
 assert.equal(s.value("independent"),"1");
 assert.equal(s.value("minutes"),"65");
 assert.equal(s.value("weeks"),"2 / 36");
 assert.equal(s.value("units"),"1 / 12");
 assert.match(s.elements.get("[data-reading-development-note]").textContent,/1 entry has no type recorded/);
 const names=s.elements.get("[data-reading-source-distribution]").children.map(x=>x.textContent).join(" ");
 assert.match(names,/Public domain: 1/);
});
test("Grade 9 denies reading details when learner identity is absent",()=>{
 const s=grade9Fixture(false);
 assert.equal(s.value("entries"),"0");
 assert.equal(s.value("assigned"),"0 / 36");
 assert.match(s.elements.get("[data-reading-development-note]").textContent,/Select the correct Academy learner/);
});
test("upper-grade reports preserve their existing learner record engines",()=>{
 for(const grade of [10,11,12]){
  const script=file(grade,"assets/course.js");
  assert.match(script,/function calcReadingStats\(\)/);
  assert.match(script,/state\.records\?\.reading/);
  assert.match(script,/data-reading-stat='entries'/);
  assert.match(script,/data-reading-source-distribution/);
 }
});
