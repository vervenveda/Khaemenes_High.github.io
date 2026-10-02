import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const failures=[]; let jsCount=0, inlineCount=0;
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else check(p);}}
function check(p){const rel=path.relative(root,p).split(path.sep).join("/");if(p.endsWith(".js")){jsCount++;try{new vm.Script(fs.readFileSync(p,"utf8"),{filename:rel});}catch(e){failures.push(`${rel}: ${e.message}`);}}if(p.endsWith(".html")){const h=fs.readFileSync(p,"utf8");for(const m of h.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)){inlineCount++;try{new vm.Script(m[1],{filename:`${rel}#inline-${inlineCount}`});}catch(e){failures.push(`${rel} inline script: ${e.message}`);}}}}
walk(root);
if(failures.length){console.error(`Integrated Science 9 runtime syntax validation FAILED (${failures.length})`);failures.forEach(x=>console.error(`- ${x}`));process.exit(1);}
console.log(`Integrated Science 9 runtime syntax validation: PASS — ${jsCount} JavaScript files and ${inlineCount} inline scripts parsed.`);
