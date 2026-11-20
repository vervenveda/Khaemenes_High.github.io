#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const manifest=JSON.parse(fs.readFileSync(path.join(root,"grades/shared/high-school-profile-runtime-contract-v1.json"),"utf8"));
for(const [grade,cfg] of Object.entries(manifest.grades)){
 const file=path.join(root,cfg.entry);
 assert(fs.existsSync(file),"Grade "+grade+" profile missing");
 const html=fs.readFileSync(file,"utf8");
 for(const fragment of cfg.required){
  const count=html.split(fragment).length-1;
  assert.equal(count,1,"Grade "+grade+" runtime owner must appear exactly once: "+fragment+" (found "+count+")");
 }
 for(const forbidden of manifest.forbidden){
  assert(!html.includes(forbidden),"Grade "+grade+" loads forbidden legacy owner: "+forbidden);
 }
}
const blueprint=fs.readFileSync(path.join(root,"grades/shared/grade09-blueprint-upper-grade.js"),"utf8");
assert(blueprint.includes("if(window.KhaemenesUpperGrade09Blueprint)return"),"upper-grade blueprint singleton guard missing");
const pins=fs.readFileSync(path.join(root,"courses/shared/high-school-course-pins.js"),"utf8");
assert(pins.includes("window.KhaemenesHighCoursePins=Object.freeze"),"course-pin owner missing");
const eight=fs.readFileSync(path.join(root,"courses/shared/high-school-eight-class.js"),"utf8");
assert(eight.includes("if(window.KhaemenesHighEightClass)return"),"eight-class singleton guard missing");
console.log("PASS four-grade profile runtime ownership; exact-once dependencies; no legacy seven-class/global-chrome owners");
