#!/usr/bin/env node
"use strict";
import {spawnSync} from "node:child_process";
const checks=[
 ["Grade 12 Social Studies transfer banks","courses/social-studies/grade-12/validation/validate-transfer-quizzes.mjs"],
 ["English 10–12 passage anchors","courses/language-arts/validate-upper-english-passage-anchors.mjs"],
 ["Algebra I lesson option balance","courses/mathematics/algebra-1/tools/validate-lesson-option-balance.mjs"],
 ["Upper science secure blueprints","courses/science/validate-upper-science-assessment-blueprints.mjs"]
];
let failed=0;
for(const [label,file] of checks){
 console.log("\n=== "+label+" ===");
 const run=spawnSync(process.execPath,[file],{stdio:"inherit",cwd:process.cwd()});
 if(run.status!==0){failed++;console.error("FAIL:",label)}
 else console.log("PASS:",label);
}
if(failed){console.error(`\nPHASE 2 ASSESSMENT VALIDATION: FAIL (${failed} check(s))`);process.exit(1)}
console.log("\nPHASE 2 ASSESSMENT VALIDATION: PASS");
