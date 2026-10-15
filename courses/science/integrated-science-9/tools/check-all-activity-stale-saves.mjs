import fs from "node:fs";
import vm from "node:vm";
const base=new URL("../units/",import.meta.url);
const targets={
  "01":["quiz-app.js","assessment-app.js"],
  "02":["quiz-app.js","assessment-app.js","microscopy-app.js"],
  "03":["quiz-app.js","assessment-app.js","lessons/assessment-app.js"],
  "04":["quiz-app.js","assessment-app.js"]
};
for(const [unit,files] of Object.entries(targets)){
 for(const file of files){
  const code=fs.readFileSync(new URL("unit-"+unit+"/"+file,base),"utf8");
  new vm.Script(code,{filename:file});
  if(!code.includes("localStorage.getItem(")||!code.includes("function submit(){if(localStorage.getItem("))throw Error(unit+"/"+file+" lacks submission protection");
  if(!code.includes("=localStorage.getItem("))throw Error(unit+"/"+file+" missing refreshed snapshot");
  console.log("PASS "+unit+"/"+file);
 }
}
