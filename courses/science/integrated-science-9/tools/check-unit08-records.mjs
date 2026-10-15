import fs from "node:fs"; import vm from "node:vm";
const dir=new URL("../units/unit-08/",import.meta.url);
for(const f of ["unit08.js","motion-lab.js","quiz-app.js","assessment-app.js","motion-question-app.js","force-question-app.js","energy-question-app.js","momentum-question-app.js","force-lab.js","energy-lab.js","momentum-lab.js"]){
 const s=fs.readFileSync(new URL(f,dir),"utf8");new vm.Script(s);
 if(f.endsWith("question-app.js")||f==="quiz-app.js"||f==="assessment-app.js"){
   if(!s.includes("bestScore")||!s.includes("activitySnapshot"))throw Error(f+" missing safeguards");
 }
 if(f==="motion-lab.js"&&!s.includes("KhaemenesScienceU08Scope.active()"))throw Error("Motion record scope missing");
}console.log("Unit 08 checks passed");
