import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import assert from "node:assert/strict";

const root=process.cwd();
const configs={
 "pre-algebra":"5d0722d3faca666cf86a7d8f82f02fb1be791a0b",
 "algebra-1":"f2a2aa949151e9b7df370b3e1750f3f1181c4521",
 "geometry":"fadcc34d655adceddf1682abc9fcb056b210d190",
 "algebra-2":"f3f92be65cdc51ff9724741028523c196f00f2a8"
};
const blobHash=text=>{
 const data=Buffer.from(text,"utf8");
 return crypto.createHash("sha1").update(Buffer.from("blob "+data.length+"\0")).update(data).digest("hex");
};
let total=0;
for(const [course,baseline] of Object.entries(configs)){
 const courseRoot=path.join(root,"courses/mathematics",course);
 const index=fs.readFileSync(path.join(courseRoot,"index.html"),"utf8");
 const workspace=fs.readFileSync(path.join(courseRoot,"course-workspace.html"),"utf8");
 assert.equal(blobHash(workspace),baseline,course+": protected complete dashboard differs from audited baseline");
 assert.ok(index.length<10000,course+": course entrance is no longer minimalist");
 assert.match(index,/<main\s+id="main">/,course+": entry missing main landmark");
 assert.match(index,/math-minimal-landing-v1\.css/,course+": original minimalist styling missing");
 assert.doesNotMatch(index,/-math-lesson-v2-adapter\.js|data-lesson-id=/,course+": lesson engine must stay on lesson pages");
 const expected={
  "course-workspace.html":"Open Full Course",
  "diagnostic/":"Readiness Assessment",
  "units/unit-01/":"Explore Unit 01",
  "assessments/":"Assessment Hub"
 };
 for(const [href,label] of Object.entries(expected)){
  assert.ok(index.includes('href="'+href+'"'),course+": missing course entry "+label);
  const candidate=path.join(courseRoot,href);
  assert.ok(fs.existsSync(candidate),course+": missing target "+href);
  if(href.endsWith("/"))assert.ok(fs.existsSync(path.join(candidate,"index.html")),course+": directory has no index "+href);
 }
 assert.match(index,/math-action-grid/,course+": 2x2 access grid absent");
 const lessonRoot=path.join(courseRoot,"units/unit-01/lessons");
 assert.ok(fs.existsSync(lessonRoot)&&fs.readdirSync(lessonRoot).some(name=>name.endsWith(".html")),course+": missing actual Unit 01 lesson files");
 console.log("MINIMAL_DOORWAY_PASS",course,"workspace-sha",baseline);
 total++;
}
const registry=fs.readFileSync("grades/grade-09/student-profile/student-course-registry.js","utf8");
const schedule=fs.readFileSync("grades/grade-09/student-profile/student-schedule-bar.js","utf8");
const upper=fs.readFileSync("grades/shared/grade09-blueprint-upper-grade.js","utf8");
assert.match(registry,/defaultContinue:repoPath\("courses\/mathematics\/pre-algebra\/diagnostic\/"\)/);
assert.match(registry,/instructionalRoute\(course,normalizeLegacyRoute\(last\.url\)\)/);
assert.match(schedule,/const target=!landing\(current\?\.url\)\?current\.url:!landing\(first\)\?first:null/);
assert.match(upper,/firstIsLanding/);
assert.match(upper,/const route=current\?\.dest\|\|null/);
assert.doesNotMatch(upper,/const route=current\?\.dest\|\|href\(item\)/);
console.log("PROFILE_CLASS_HOME_FALLBACK_GUARD_PASS");
console.log("MINIMAL_MATH_BOUNDARY_SOURCE_PASS",total,"course doorways");
