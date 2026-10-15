import fs from "node:fs";import vm from "node:vm";
const root=new URL("../units/unit-09/",import.meta.url);
const scored=["quiz-app.js","assessment-app.js","circuit-question-app.js","information-question-app.js","magnet-question-app.js","wave-question-app.js"];
for(const file of ["unit09.js","circuit-lab.js","information-lab.js","magnet-lab.js","wave-lab.js",...scored]){
 const s=fs.readFileSync(new URL(file,root),"utf8");new vm.Script(s,{filename:file});
 if(file==="unit09.js"&&(!s.includes("KhaemenesScienceU09Scope.key()")||!s.includes("scienceConflict")))throw Error("Unit controller missing protection");
 if(file==="circuit-lab.js"&&!s.includes("KhaemenesScienceU09Scope.active()"))throw Error("Circuit record not isolated");
 if(scored.includes(file)&&(!s.includes("bestScore")||!s.includes("activitySnapshot")||!s.includes("KhaemenesScienceU09Scope.key()")))throw Error(file+" missing score guards");
}
console.log("PASS Unit 09 scripts and learner mastery safeguards.");
