/* Khaemenes Academy - English 9 reading-ledger compatibility regression.
   Run: node --test courses/language-arts/english-9/tests/reading-ledger-expansion-v2.mjs
   Native Node only; no learner records are read or modified. */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const shared=path.resolve(root,"..","..","shared");
const read=relative=>fs.readFileSync(path.resolve(root,relative),"utf8");
const html=read("records/reading-log.html");
const ledger=read("assets/reading-ledger-v2.js");
const report=read("assets/progress-report-v1.js");
const course=read("assets/course.js");
const context=fs.readFileSync(path.join(shared,"english9-reading-log-context-v1.js"),"utf8");

test("preserve 30 original reading titles and their field key layout",()=>{
  const matches=[...html.matchAll(/data-save-field="reading-title-(\d+)"/g)].map(m=>Number(m[1]));
  assert.deepEqual(matches,Array.from({length:30},(_,i)=>i+1));
  for (const field of ["title","author","type","date","amount","evidence"]) {
    for (let i=1;i<=30;i++) {
      assert.ok(html.includes('data-save-field="reading-'+field+'-'+i+'"'),"legacy field "+field+"-"+i);
    }
  }
  for (const field of ["reading-week-","reading-unit-","reading-curriculum-type-","reading-source-status-"]) {
    assert.ok(context.includes(field),"context field "+field);
  }
});

test("ledger is learner-scoped, additive, and wired after existing course binder",()=>{
  assert.match(html,/<script src="\.\.\/assets\/course\.js"><\/script><script src="\.\.\/assets\/reading-ledger-v2\.js/);
  assert.match(ledger,/context\.profile\.learnerId/);
  assert.match(ledger,/context\.storageKey/);
  assert.match(ledger,/khae-ela9-reading-rows-v2/);
  assert.match(ledger,/reading-\s*"/);
  assert.match(ledger,/MAX_ROWS = 500/);
  assert.match(ledger,/function appendRow/);
  assert.match(ledger,/function makeField/);
  assert.match(ledger,/Export Reading Log JSON/);
  assert.match(course,/khae-ela9-field:/);
  assert.doesNotMatch(ledger,/localStorage\.removeItem|fetch\s*\(|masteredAt\s*=|location\.replace/);
  new Function(ledger);
  new Function(report);
});

test("student progress counts expanded row 31 and row 32 without changing mastery",()=>{
  const values=new Map([
    ["khae-ela9-reading-rows-v2:learner:demo","32"],
    ["khae-ela9-field:reading-title-1:learner:demo","Legacy assigned reading"],
    ["khae-ela9-field:reading-title-31:learner:demo","New independent reading"],
    ["khae-ela9-field:reading-title-32:learner:demo","New research text"]
  ]);
  const nodes={};
  const document={
    readyState:"complete",
    querySelector(selector){return nodes[selector] ||= {textContent:"",style:{width:""}};}
  };
  const sandbox={
    document,
    window:{KhaemenesEnglish9Records:{storageKey:base=>base+":learner:demo"}},
    localStorage:{getItem:key=>values.has(key)?values.get(key):null},
    console
  };
  vm.runInNewContext(report,sandbox);
  assert.equal(nodes["[data-e9-reading-log]"].textContent,"3");
  assert.equal(nodes["[data-e9-midterm]"].textContent,"—");
  assert.equal(nodes["[data-e9-final]"].textContent,"—");
  assert.match(report,/i<=availableRows/);
});

test("upper English courses retain their independent appendable reading records",()=>{
  for (const grade of [10,11,12]) {
    const source=fs.readFileSync(path.resolve(root,"..","english-"+grade,"assets","course.js"),"utf8");
    assert.match(source,/state\.records\.reading\.push\(entry\)/);
    assert.match(source,/function calcReadingStats\(\)/);
  }
});
