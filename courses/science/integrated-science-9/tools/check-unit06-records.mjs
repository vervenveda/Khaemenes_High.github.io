import fs from "node:fs";
import vm from "node:vm";
const dir=new URL("../units/unit-06/",import.meta.url);
const scoped=(source,unit)=>source.includes("KhaemenesScienceU"+unit+"Scope.key()")||/SCOPE\?\.key\?\.\(\)/.test(source);
const scored=["quiz-app.js","assessment-app.js","atomic-composition-app.js","electron-question-app.js","isotope-question-app.js","periodic-question-app.js"];
for(const file of ["unit06.js",...scored,"atomic-explorer.js","electron-explorer.js","isotope-calculator.js","periodic-explorer.js"]){
 const code=fs.readFileSync(new URL(file,dir),"utf8");new vm.Script(code,{filename:file});
 if(file==="unit06.js"&&(!scoped(code,"06")||!code.includes("scienceConflict")))throw Error("Unit controller missing safeguards");
 if(scored.includes(file)&&(!scoped(code,"06")||!/(?:bestScore|\\bbest\\b)/.test(code)||!/(?:activitySnapshot|\\bsnap\\b)/.test(code)))throw Error(file+" missing learner/mastery safeguards");
}
console.log("PASS Unit 06 syntax, scope, best-score and stale-save structural checks.");
