import fs from "node:fs"; import assert from "node:assert/strict";
const read=p=>fs.readFileSync(p,"utf8");
const exporter=read("courses/mathematics/assets/high-to-higher-readiness-receipt-v1.js");
for(const term of [
 "khaemenes-high-to-higher-math-readiness-receipt-v1",
 "explicit-id-match",
 "automaticUnlock:false",
 "awardsCredit:false",
 "requiresReceivingReview:true"
]) assert(exporter.includes(term),"exporter missing "+term);
for(const course of ["algebra-2","geometry"]){
 const index=read("courses/mathematics/"+course+"/index.html");
 const app=read("courses/mathematics/"+course+"/assets/app.js");
 assert(index.includes("../assets/high-to-higher-readiness-receipt-v1.js"),course+" landing missing readiness exporter");
 assert(app.includes("data-higher-learning-readiness-receipt"),course+" teacher tools missing readiness receipt control");
}
console.log("PASS High School → Higher Learning readiness receipt contract: Algebra II + Geometry export learner-bound evidence only; no automatic unlock or credit.");
