#!/usr/bin/env node
"use strict";
/* Read-only, dependency-free audit. Does not load private assessment items or learner data. */
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const registry = JSON.parse(fs.readFileSync(path.join(root,"courses/shared/course-execution-matrix-v1.json"),"utf8"));
const exists = p => fs.existsSync(path.join(root,p));
const problems = [];
const record = (ok,message) => { if (!ok) problems.push(message); };
record(registry.policy.mastery_floor_percent === 80,"80% mastery floor changed");
const seen = new Set();
for (const c of registry.courses) {
  record(!seen.has(c.id), "duplicate course: "+c.id);
  seen.add(c.id);
  record(exists(c.entry), c.id+": HTML launch route missing: "+c.entry);
  record(c.entry.endsWith(".html"), c.id+": non-HTML entry not certified");
  record(exists(c.source), c.id+": source missing: "+c.source);
  record(c.source.endsWith(".json"), c.id+": source is not a versioned JSON map");
  record(c.grade === "placement" || Number.isInteger(c.grade) && c.grade >= 9 && c.grade <= 12,
    c.id+": invalid grade designation");
  if(c.status==="placement-handoff") {
    record(c.grade==="placement",c.id+": handoff must stay placement-based");
    record(c.assessment_authority==="not-complete",c.id+": handoff falsely claims complete grading");
  } else {
    record(c.status==="existing-specialist-engine",c.id+": unexpected active engine status");
  }
  if(/^english-/.test(c.id)) {
    const map = JSON.parse(fs.readFileSync(path.join(root,c.source),"utf8"));
    record(map.weeksCount===36,c.id+": curriculum not 36 weeks");
    record(map.passingTarget===80,c.id+": curriculum mastery gate not 80%");
    record(exists(c.root+"weeks/week-01/index.html"),c.id+": first weekly route missing");
    record(exists(c.root+"weeks/week-36/index.html"),c.id+": final weekly route missing");
  }
  if(c.id==="chemistry-11") {
    const map=JSON.parse(fs.readFileSync(path.join(root,c.source),"utf8"));
    record(map.course?.duration_weeks===36,"Chemistry: unexpected year length");
    record(map.course?.passing_target===80,"Chemistry: unexpected gate");
    for(let w=1;w<=36;w++) record(exists(c.root+"weeks/week-"+String(w).padStart(2,"0")+"/index.html"),"Chemistry week "+w+" not executable");
  }
}
if(problems.length){ console.error("FAIL execution-matrix ("+problems.length+")\n"+problems.join("\n"));process.exitCode=1; }
else console.log("PASS execution-matrix "+registry.courses.length+" course routes; 80% floors; format/grade contracts; 36-week map checks");
