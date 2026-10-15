import fs from "node:fs";
import vm from "node:vm";
const root=new URL("../",import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),"utf8");
const dashboard=read("course-ui.js");
new vm.Script(dashboard);
if(!dashboard.includes('kh_sci9_learner_v1:')||!dashboard.includes('kh_sci9_u04_active_learner_v1'))throw Error("Dashboard key mismatch");
if(!dashboard.includes("learnerBanner();")||!dashboard.includes("if(!learnerId())"))throw Error("Dashboard guard absent");
for(let n=1;n<=4;n++){
 const id=String(n).padStart(2,"0"), controller=read("units/unit-"+id+"/unit"+id+".js");
 new vm.Script(controller);
 if(!controller.includes('kh_sci9_learner_v1:')||!controller.includes('kh_sci9_u04_active_learner_v1'))throw Error("Unit "+id+" does not match dashboard scope");
 if(!controller.includes("recoverLegacy"))throw Error("Unit "+id+" missing legacy recovery");
 if(!controller.includes("localStorage.getItem(ORIGINAL)"))throw Error("Unit "+id+" missing legacy access");
}
for(const [n,names] of [[1,["quiz-app.js","assessment-app.js"]],[2,["quiz-app.js","assessment-app.js","microscopy-app.js"]],[3,["quiz-app.js","assessment-app.js","circulation-app.js","feedback-app.js","lessons/assessment-app.js"]],[4,["quiz-app.js","assessment-app.js","cell-cycle-app.js","meiosis-app.js"]]]){
 const id=String(n).padStart(2,"0");
 for(const name of names){
  const src=read("units/unit-"+id+"/"+name);
  new vm.Script(src);
  if(!src.includes("KhaemenesScienceU"+id+"Scope"))throw Error("Unit "+id+" unscoped app "+name);
 }
}
console.log("PASS combined Units 01–04 key alignment, source syntax, lab storage references, and dashboard safeguards.");
