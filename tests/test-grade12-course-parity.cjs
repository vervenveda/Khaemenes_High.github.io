#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const json=p=>JSON.parse(read(p));
const matrix=json("courses/shared/course-execution-matrix-v1.json");
const byId=new Map(matrix.courses.map(x=>[x.id,x]));
for(const id of ["physical-education-12","physics-engineering-12","senior-capstone","precalculus-trigonometry","calculus-1"]) assert(byId.has(id),"missing "+id);
const pe=json("courses/physical-education/grade-12-instruction.json");
assert.equal(pe.weeks.length,36);assert(pe.weeks.every(w=>w.days?.length===5));assert(pe.weeks.every(w=>w.checks?.length===25));
assert.equal(pe.retentionPolicy.weeks2to36,"15 current + 5 delayed retrieval");
const phy=read("courses/science/physics-engineering-12/index.html");
assert(phy.includes("Delayed retrieval · non-grading"));assert(phy.includes("state.retrieval"));
const cap=json("courses/capstone/senior-capstone/course-map.json");
assert.equal(cap.weeks.length,36);assert(cap.weeks.every(w=>w.days?.length===5));

const eight=read("courses/shared/high-school-eight-class.js");
assert(eight.includes('psychology:"senior-capstone"'));
assert(eight.includes('"physical-education-12":"https://vervenveda.com/Khaemenes_High.github.io/courses/physical-education/grade-12.html"'));
const pins=read("courses/shared/high-school-course-pins.js");
assert(pins.includes('"senior-capstone":Object.freeze'));
assert(pins.includes('physical-education/grade-12.html'));
const peHtml=read("courses/physical-education/grade-12.html");
assert(peHtml.includes("<title>Physical Education 12"));
assert(peHtml.includes("<h1>Physical Education 12</h1>"));
assert(!peHtml.includes("g11-week-"));
assert(!peHtml.includes("khae-pe-g10-w"));
const capHtml=read("courses/capstone/senior-capstone/index.html");
assert(capHtml.includes('courseId:"senior-capstone"'));
assert(capHtml.includes("publishContinuation"));
assert(capHtml.includes("Evaluator-reviewed score"));
assert(capHtml.includes("Weekly rubric · 20 points"));

const g12=read("grades/grade-12/index.html");
assert(g12.includes("../../courses/capstone/senior-capstone/"));
for(const id of ["precalculus-trigonometry","calculus-1"]){const x=byId.get(id);assert.equal(x.status,"placement-handoff");assert.equal(x.assessment_authority,"not-complete");assert(/return-record bridge pending/i.test(x.upgrade));}
console.log("PASS Grade 12 parity: Capstone scheduled/ledgered/deepened, PE12 direct+identity-correct, Physics delayed retrieval, advanced-math handoff boundary.");
