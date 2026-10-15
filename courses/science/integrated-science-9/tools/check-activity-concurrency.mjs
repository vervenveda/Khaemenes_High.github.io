import fs from "node:fs";
import vm from "node:vm";
for(const [unit,apps] of [["03",["circulation-app.js","feedback-app.js"]],["04",["cell-cycle-app.js","meiosis-app.js"]]]){
 for(const file of apps){
  const source=fs.readFileSync(new URL("../units/unit-"+unit+"/"+file,import.meta.url),"utf8");
  new vm.Script(source,{filename:file});
  if(!source.includes("let scienceActivityInitialRecord=localStorage.getItem(KEY)"))throw Error(file+" missing initial snapshot");
  if(!source.includes("localStorage.getItem(KEY)!==scienceActivityInitialRecord"))throw Error(file+" missing stale-attempt block");
  if(!source.includes("scienceActivityInitialRecord=localStorage.getItem(KEY);"))throw Error(file+" missing refresh after save");
  console.log("PASS "+unit+"/"+file);
 }
}
