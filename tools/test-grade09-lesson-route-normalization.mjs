// Read-only behavioral regression for Grade 09 Class-button continuation.
// No browser learner records are read or written: VM uses in-memory storage.
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const script=fs.readFileSync("grades/grade-09/student-profile/student-course-registry.js","utf8");
const data=new Map();
const storage={
  getItem:key=>data.has(key)?data.get(key):null,
  setItem:(key,value)=>data.set(key,String(value))
};
const repo="/Khaemenes_High.github.io/";
const origin="https://vervenveda.com";
const firstSteps={
  "english-9":origin+repo+"courses/language-arts/english-9/weeks/week-01/day-01/",
  "pre-algebra":origin+repo+"courses/mathematics/pre-algebra/diagnostic/",
  "global-studies-9":origin+repo+"courses/social-studies/grade-09/week-01/student-packet.html",
  "integrated-science-9":origin+repo+"courses/science/integrated-science-9/diagnostic/readiness-diagnostic.html"
};
const sandbox={
  window:{KhaemenesHighEightClass:{FIRST_STEPS:firstSteps}},
  location:{origin,pathname:repo+"grades/grade-09/student-profile/"},
  localStorage:storage,URL,URLSearchParams,Date,fetch:async()=>{throw Error("no network in route test");},
  console
};
vm.runInNewContext(script,sandbox,{filename:"student-course-registry.js"});
const courses=sandbox.window.KhaemenesGrade09Courses;
assert.ok(courses,"Grade 09 registry must initialize");
for(const [id,url] of Object.entries(firstSteps)){
  const route=courses.continueFor(id);
  assert.equal(route?.url,new URL(url).pathname,id+" must open the first actual instructional step, not the course home");
  assert.equal(route?.hasSpecificLocation,true,id+" must be marked as a specific lesson or diagnostic");
}
// A learner's last approved absolute lesson URL must survive launch recording.
const resumed=origin+repo+"courses/language-arts/english-9/weeks/week-02/day-03/";
assert.equal(courses.recordLaunch("english-9",resumed,"Week 2 Day 3"),true);
assert.equal(courses.continueFor("english-9").url,new URL(resumed).pathname);
// Reject another course and external origins rather than launching arbitrary links.
const outside=origin+repo+"courses/mathematics/algebra-1/units/unit-01/";
assert.equal(courses.recordLaunch("english-9",outside,"Other course"),true);
assert.equal(courses.continueFor("english-9").url,new URL(firstSteps["english-9"]).pathname);
assert.equal(courses.recordLaunch("english-9","https://example.org/foreign","External"),true);
assert.equal(courses.continueFor("english-9").url,new URL(firstSteps["english-9"]).pathname);
// Explicit French handoff retains its approved cross-repository origin.
assert.match(courses.continueFor("world-language-9-french").url,/Khaemenes_Linguistics\\.github\\.io\\/apps\\/French_101_index\\.html/);
console.log("PASS Grade 09 lesson URL normalization, approved resume, route confinement and French handoff");
