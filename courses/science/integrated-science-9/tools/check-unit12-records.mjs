import fs from "node:fs";import vm from "node:vm";
const base=new URL("../units/unit-12/",import.meta.url);
const scoped=(source,unit)=>source.includes("KhaemenesScienceU"+unit+"Scope.key()")||/SCOPE\?\.key\?\.\(\)/.test(source);
const scored=["quiz-app.js","assessment-app.js","decision-question-app.js","lifecycle-question-app.js","risk-question-app.js","testing-question-app.js"];
for(const file of ["unit12.js","decision-lab.js","lifecycle-lab.js","risk-lab.js","testing-lab.js",...scored]){
 const source=fs.readFileSync(new URL(file,base),"utf8");new vm.Script(source,{filename:file});
 if(file==="unit12.js"&&(!scoped(source,"12")||!source.includes("scienceConflict")||!source.includes("recoverLegacy")))throw Error("Unit 12 controller guard/recovery missing");
 if(scored.includes(file)&&(!scoped(source,"12")||!source.includes("bestScore")||!source.includes("lastScore")||!source.includes("activitySnapshot")))throw Error(file+" missing mastery/scope safeguards");
}
console.log("PASS Unit 12 capstone syntax, learner isolation and mastery safeguards.");
