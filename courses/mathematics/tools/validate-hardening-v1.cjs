"use strict";
/* Source-level validator for the shared High School mathematics hardening stack.
   Run from repository root: node courses/mathematics/tools/validate-hardening-v1.cjs */
const fs=require("node:fs");
const path=require("node:path");
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
const failures=[];
const check=(ok,label)=>{if(!ok)failures.push(label);else console.log("PASS",label)};

const shared=[
 "courses/mathematics/assets/math-storage-adapter-v1.js",
 "courses/mathematics/assets/math-hardening-loader-v1.js",
 "courses/mathematics/assets/math-learner-record-v1.js",
 "courses/mathematics/assets/math-storage-health-v2.js",
 "courses/mathematics/assets/math-evidence-authority-v1.js",
 "courses/mathematics/assets/math-progression-ledger-v1.js",
 "courses/mathematics/assets/math-progress-contract-v1.js"
];
shared.forEach(p=>check(exists(p),"shared file exists: "+p));

const loader=read(shared[1]);
check(loader.indexOf("math-storage-adapter-v1.js")<loader.indexOf("math-learner-record-v1.js"),"storage adapter loads before learner record");

const record=read(shared[2]);
check(record.includes('typeof token==="string"'),"active learner supports string ID");
check(record.includes("memorySnapshot"),"memory-only keys are export-capturable");
check(record.includes("verified-write:"),"verified legacy writes feed canonical record");

const evidence=read(shared[4]),ledger=read(shared[5]);
for(const status of ["practice","reviewed","mastered","retained","pending-review","evaluator-verified"]){
 check(evidence.includes('"'+status+'"'),"evidence vocabulary: "+status);
 check(ledger.includes('"'+status+'"'),"ledger vocabulary: "+status);
}
check(read(shared[6]).includes('key+":learner:"'),"progress contract prefers learner-scoped records");

const lessonCore="courses/mathematics/pre-algebra/assets/prealgebra-lesson-engine-core-v2.js";
const assessmentCore="courses/mathematics/pre-algebra/assets/prealgebra-assessment-engine-core-v2.js";
check(exists(lessonCore),"canonical Pre-Algebra lesson core exists");
check(exists(assessmentCore),"canonical Pre-Algebra assessment core exists");
for(let n=2;n<=13;n++){
 const u=String(n).padStart(2,"0"),p="courses/mathematics/pre-algebra/units/unit-"+u+"/assets/lesson-engine.js",c=read(p);
 check(c.includes("../../../assets/prealgebra-lesson-engine-core-v2.js"),"Pre-Algebra lesson wrapper "+u+" uses canonical core");
}
for(let n=3;n<=13;n++){
 const u=String(n).padStart(2,"0"),p="courses/mathematics/pre-algebra/units/unit-"+u+"/assets/assessment-engine.js",c=read(p);
 check(c.includes("../../../assets/prealgebra-assessment-engine-core-v2.js"),"Pre-Algebra assessment wrapper "+u+" uses canonical core");
}
check(!read("courses/mathematics/pre-algebra/units/unit-01/assets/assessment-engine.js").includes("prealgebra-assessment-engine-core-v2.js"),"Unit 01 special assessment remains isolated");
check(!read("courses/mathematics/pre-algebra/units/unit-02/assets/assessment-engine.js").includes("prealgebra-assessment-engine-core-v2.js"),"Unit 02 autosave-special assessment remains isolated");

const cssBase="courses/mathematics/pre-algebra/assets/prealgebra-unit-core-v2.css";
const cssOverlay="courses/mathematics/pre-algebra/assets/prealgebra-submission-language-v1.css";
check(exists(cssBase),"canonical Pre-Algebra unit stylesheet exists");
check(exists(cssOverlay),"submission-language overlay exists");
for(let n=2;n<=5;n++){
 const u=String(n).padStart(2,"0"),c=read("courses/mathematics/pre-algebra/units/unit-"+u+"/assets/unit.css");
 check(c.includes("prealgebra-unit-core-v2.css")&&c.includes("prealgebra-submission-language-v1.css"),"Pre-Algebra CSS "+u+" uses base + overlay");
}
for(let n=6;n<=13;n++){
 const u=String(n).padStart(2,"0"),c=read("courses/mathematics/pre-algebra/units/unit-"+u+"/assets/unit.css");
 check(c.includes("prealgebra-unit-core-v2.css")&&!c.includes("prealgebra-submission-language-v1.css"),"Pre-Algebra CSS "+u+" uses canonical base");
}

const verifiedEngines=[
 "courses/mathematics/algebra-1/assets/deep-lesson-engine-v1.js",
 "courses/mathematics/algebra-1/assets/exam-engine.js",
 "courses/mathematics/algebra-1/assessments/assets/weekly-mastery-engine-v2.js",
 "courses/mathematics/geometry/assets/lesson-tools.js",
 "courses/mathematics/geometry/assets/assessment-engine.js",
 "courses/mathematics/geometry/assessments/assets/weekly-mastery-engine-v2.js",
 "courses/mathematics/geometry/records/record-engine-v2.js",
 "courses/mathematics/algebra-2/assets/algebra2-progression.js",
 "courses/mathematics/algebra-2/assets/app.js"
];
verifiedEngines.forEach(p=>check(read(p).includes("KhaemenesMathStorageAdapter"),"verified storage wired: "+p));

if(failures.length){
 console.error("\nFAILURES:",failures.length);failures.forEach(x=>console.error("-",x));process.exit(1);
}
console.log("\nPASS: High School mathematics hardening source contract is internally consistent.");
