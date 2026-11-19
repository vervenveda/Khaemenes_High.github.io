import fs from "node:fs";
const geoAdapter="courses/mathematics/geometry/assets/geometry-math-lesson-v2-adapter.js";
const a2Adapter="courses/mathematics/algebra-2/assets/algebra2-math-lesson-v2-adapter.js";
const report="courses/mathematics/geometry/VALIDATION_REPORT.md";
if(!fs.existsSync(geoAdapter)){console.error("Geometry adapter missing");process.exit(1)}
if(fs.existsSync(a2Adapter)){
 const status=fs.existsSync(report)?fs.readFileSync(report,"utf8"):"";
 if(!/Status:\s*\*\*PASS/i.test(status)){
  console.error("Algebra II Mathematics Engine rollout is blocked until Geometry VALIDATION_REPORT.md is Production PASS.");
  process.exit(1);
 }
}
console.log(fs.existsSync(a2Adapter)?"PASS higher-math gate: Algebra II rollout authorized by Geometry PASS":"PASS higher-math gate: Algebra II Mathematics Engine remains intentionally on HOLD");
