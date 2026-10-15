import fs from "node:fs";import vm from "node:vm";
const root=new URL("../units/unit-10/",import.meta.url);
const scored=["quiz-app.js","assessment-app.js","climate-question-app.js","cycles-question-app.js","interior-question-app.js","watershed-question-app.js"];
for(const file of ["unit10.js","watershed-lab.js","climate-lab.js","cycle-lab.js","interior-lab.js",...scored]){
 const s=fs.readFileSync(new URL(file,root),"utf8");new vm.Script(s,{filename:file});
 if(file==="unit10.js"&&(!s.includes("KhaemenesScienceU10Scope.key()")||!s.includes("scienceConflict")))throw Error("Unit controller missing safeguards");
 if(file==="watershed-lab.js"&&(!s.includes("KhaemenesScienceU10Scope.active()")||!s.includes("calculate(false)")))throw Error("Watershed data scope/recovery missing");
 if(scored.includes(file)&&(!s.includes("bestScore")||!s.includes("activitySnapshot")||!s.includes("KhaemenesScienceU10Scope.key()")))throw Error(file+" score safeguards missing");
}
console.log("PASS Unit 10 syntax, scope and mastery checks.");
