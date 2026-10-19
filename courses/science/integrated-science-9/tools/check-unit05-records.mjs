import fs from "node:fs";
import vm from "node:vm";
const base=new URL("../units/unit-05/",import.meta.url);
const scoped=(source,unit)=>source.includes("KhaemenesScienceU"+unit+"Scope.key()")||/SCOPE\?\.key\?\.\(\)/.test(source);
const scored=["quiz-app.js","assessment-app.js","evidence-app.js","food-web-app.js","population-app.js"];
for(const file of ["unit05.js","biodiversity-app.js",...scored]){
 const source=fs.readFileSync(new URL(file,base),"utf8");
 new vm.Script(source,{filename:file});
 if(!scoped(source,"05"))throw Error(file+" missing learner isolation");
 if(file==="unit05.js"&&!source.includes("scienceConflict"))throw Error("unit save conflict guard missing");
 if(file==="biodiversity-app.js"&&!source.includes("biodiversitySnapshot"))throw Error("survey conflict guard missing");
 if(scored.includes(file)&&(!source.includes("bestScore")||!source.includes("activitySnapshot")))throw Error(file+" missing mastery/attempt safeguard");
}
console.log("PASS Unit 05 learner isolation, mastery preservation, stale-save guards and JS syntax.");
