import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const src=read("science-subject-connections.js");
new vm.Script(src,{filename:"science-subject-connections.js"});
const issues=[];
for(let n=1;n<=12;n++){
 const u=String(n).padStart(2,"0"),page="units/unit-"+u+"/index.html";
 if(!read(page).includes('src="../../science-subject-connections.js"'))issues.push("Missing bridge script: "+page);
 if(!src.includes('"'+u+'":['))issues.push("Missing subject mapping: Unit "+u);
}
const destinations=[
 ["units/unit-08/index.html","../../../../mathematics/algebra-1/index.html"],
 ["units/unit-08/index.html","../../../../mathematics/geometry/index.html"],
 ["units/unit-05/index.html","../../../../language-arts/english-9/index.html"],
 ["units/unit-05/index.html","../../resources/local-investigation-registry.html"],
 ["units/unit-05/index.html","../../science-evidence-portfolio.html"]
];
for(const [page,target] of destinations){
 const p=path.resolve(root,path.dirname(page),target);
 if(!fs.existsSync(p))issues.push("Missing subject destination: "+page+" -> "+target);
}
if(/localStorage|sessionStorage|fetch\s*\(|XMLHttpRequest/.test(src))issues.push("Bridge must remain navigation-only");
console.log("Science 9 subject bridge: 12 unit mappings, five verified local destinations; problems="+issues.length);
if(issues.length){for(const e of issues)console.error("FAIL",e);process.exit(1)}
console.log("PASS subject-aware academic connections");
