import fs from "node:fs";
import vm from "node:vm";
const dir=new URL("../units/unit-03/",import.meta.url);
for(const file of ["unit03.js","quiz-app.js","assessment-app.js","circulation-app.js","feedback-app.js","lessons/assessment-app.js"]){
 const source=fs.readFileSync(new URL(file,dir),"utf8");
 new vm.Script(source,{filename:file});
 if(!source.includes("KhaemenesScienceU03Scope.key()"))throw Error(file+" is not learner scoped");
}
const controller=fs.readFileSync(new URL("unit03.js",dir),"utf8");
if(!controller.includes("recoverLegacy")||!controller.includes("kh_sci9_learner_v1:"))throw Error("Recovery/root scope missing");
console.log("Unit 03 learner scope syntax and storage references PASS.");
