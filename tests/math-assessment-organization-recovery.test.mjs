import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read=p=>fs.readFileSync(new URL("../"+p,import.meta.url),"utf8");
const algebra=read("courses/mathematics/algebra-1/assets/exam-engine.js");
const focused=read("courses/mathematics/algebra-1/assets/focused-assessment-v1.js");
const authority=read("courses/mathematics/algebra-1/assets/mastery-authority-v1.js");
const pre=read("courses/mathematics/pre-algebra/index.html");
const gates=read("courses/mathematics/pre-algebra/assets/prealgebra-course-gates-v1.js");

test("Algebra I long assessments have one paging owner",()=>{
  assert.match(algebra,/const PAGED_ASSESSMENT=Array\.isArray\(C\.questions\)&&C\.questions\.length>12/);
  assert.match(algebra,/Assessment question navigation/);
  assert.doesNotMatch(authority,/\/diagnostic\\\//);
  assert.doesNotMatch(authority,/\/assessments\\\//);
  assert.match(focused,/if\(window\.EXAM_CONFIG\)return false/);
});

test("Algebra I draft and result persistence are fail closed",()=>{
  assert.match(algebra,/return ok/);
  assert.match(algebra,/Draft saved and verified locally/);
  assert.match(algebra,/Submission paused because this browser could not verify the draft write/);
  assert.match(algebra,/Submission was not recorded because the result write could not be verified/);
  assert.match(algebra,/REQUIRES_DEPTH/);
});

test("Pre-Algebra cumulative assessments use one full-width resumable workspace",()=>{
  assert.match(pre,/Cumulative Assessment Center/);
  assert.match(pre,/khae-prealgebra-cumulative-draft-v1/);
  assert.match(pre,/Midterm · 28 Questions/);
  assert.match(pre,/Final · 52 Questions/);
  assert.match(pre,/card col12/);
  assert.doesNotMatch(pre,/Question and answer order are regenerated when this page opens/);
});

test("Pre-Algebra assessment writes are verified and recoverable",()=>{
  assert.match(pre,/Mastery-check submission paused because browser storage could not be verified/);
  assert.match(pre,/Submission paused because browser storage could not be verified/);
  assert.match(pre,/priorBest/);
  assert.match(pre,/priorDraft/);
});

test("Pre-Algebra no longer uses a mutation observer for week-gate decoration",()=>{
  assert.doesNotMatch(gates,/new\s+MutationObserver/);
  assert.match(gates,/khaemenes-prealgebra-rendered/);
  assert.match(pre,/khaemenes-prealgebra-rendered/);
});

test("Pre-Algebra printable report cannot terminate the parent inline script",()=>{
  const start=pre.indexOf("function reportHTML()");
  const end=pre.indexOf("function printReport()",start);
  assert.ok(start>=0&&end>start);
  const report=pre.slice(start,end);
  assert.doesNotMatch(report,/<script\b/i);
});
