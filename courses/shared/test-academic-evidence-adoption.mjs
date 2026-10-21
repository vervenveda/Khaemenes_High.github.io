import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const bridge=read("courses/shared/academic-evidence-adoption.js");
new vm.Script(bridge);
assert(!/localStorage|sessionStorage|\.fetch\(|XMLHttpRequest/.test(bridge));
for(const [file,href] of [
 ["courses/mathematics/algebra-1/index.html","../../shared/academic-evidence-adoption.js"],
 ["courses/mathematics/algebra-1/records/index.html","../../../shared/academic-evidence-adoption.js"],
 ["courses/language-arts/english-9/index.html","../../shared/academic-evidence-adoption.js"],
 ["courses/language-arts/english-9/portfolio/index.html","../../../shared/academic-evidence-adoption.js"]
]){
 assert(read(file).includes('src="'+href+'"'),"Missing adoption bridge: "+file);
 assert(fs.existsSync(path.resolve(path.dirname(path.join(root,file)),href)),"Broken bridge path "+file);
}
for(const pathName of ["courses/shared/ACADEMIC_EVIDENCE_CONVENTION_V1.md","courses/science/integrated-science-9/academic-evidence-companion.html"])
 assert(fs.existsSync(path.join(root,pathName)),"Missing shared evidence asset "+pathName);
console.log("PASS Academy evidence bridge: Algebra I and English 9 portals/records, canonical assets, no grading/storage");
