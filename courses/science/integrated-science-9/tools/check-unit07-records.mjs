import fs from "node:fs";
import vm from "node:vm";
const dir=new URL("../units/unit-07/",import.meta.url);
const scored=["quiz-app.js","assessment-app.js","bonding-question-app.js","energy-question-app.js","equation-question-app.js","structure-question-app.js"];
for(const file of ["unit07.js","energy-rate-workbench.js",...scored,"equation-balancer.js","formula-builder.js","structure-explorer.js"]){
 const source=fs.readFileSync(new URL(file,dir),"utf8");
 new vm.Script(source,{filename:file});
 if(file==="unit07.js"&&(!source.includes("KhaemenesScienceU07Scope.key()")||!source.includes("scienceConflict")))throw Error("Unit controller not protected");
 if(file==="energy-rate-workbench.js"&&!source.includes("KhaemenesScienceU07Scope.active()"))throw Error("Rate observations not isolated");
 if(scored.includes(file)&&(!source.includes("KhaemenesScienceU07Scope.key()")||!source.includes("bestScore")||!source.includes("activitySnapshot")))throw Error(file+" missing scored safeguards");
}
console.log("PASS Unit 07 chemistry tools, learner isolation and mastery safeguards.");
