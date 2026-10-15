import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
const folder=new URL("../units/unit-02/",import.meta.url);
for(const name of ["unit02.js","quiz-app.js","assessment-app.js","microscopy-app.js"]){
  const source=fs.readFileSync(new URL(name,folder),"utf8");
  new vm.Script(source);
  if(!source.includes("KhaemenesScienceU02Scope.key()"))throw Error(name+" lacks scoped key");
}
console.log("Unit 02 syntax and scoped keys PASS");
