import fs from "node:fs";import vm from "node:vm";
const root=new URL("../units/unit-11/",import.meta.url);
const scoped=(source,unit)=>source.includes("KhaemenesScienceU"+unit+"Scope.key()")||/SCOPE\?\.key\?\.\(\)/.test(source);
const scored=["quiz-app.js","assessment-app.js","cosmology-question-app.js","exoplanet-question-app.js","orbit-question-app.js","spectra-question-app.js"];
for(const file of ["unit11.js","cosmology-lab.js","orbit-lab.js","spectra-lab.js","transit-lab.js",...scored]){
 const s=fs.readFileSync(new URL(file,root),"utf8");new vm.Script(s,{filename:file});
 if(file==="unit11.js"&&(!scoped(s,"11")||!s.includes("scienceConflict")))throw Error("Unit 11 controller missing protection");
 if(scored.includes(file)&&(!scoped(s,"11")||!s.includes("bestScore")||!s.includes("activitySnapshot")))throw Error(file+" missing mastery/scope safeguard");
}
console.log("PASS Unit 11 astronomy syntax, learner scope and mastery safeguards.");
