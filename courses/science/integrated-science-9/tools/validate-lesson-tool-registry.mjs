import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const HERE=path.dirname(fileURLToPath(import.meta.url));
const ROOT=path.resolve(HERE,"..");
const reg=JSON.parse(fs.readFileSync(path.join(ROOT,"data/lesson-tool-registry.json"),"utf8"));
const fail=[];
if(reg.lesson_count!==180||reg.lessons.length!==180) fail.push(`expected 180 lessons, got ${reg.lessons.length}`);
const ids=new Set();
let linked=0,toolLinks=0;
for(const r of reg.lessons){
 if(ids.has(r.lesson_id)) fail.push(`duplicate lesson id ${r.lesson_id}`); ids.add(r.lesson_id);
 const lp=path.join(ROOT,r.lesson_path); if(!fs.existsSync(lp)) fail.push(`missing lesson ${r.lesson_path}`);
 if(r.tools.length) linked++;
 for(const t of r.tools){ toolLinks++; const tp=path.join(ROOT,t.target); if(!fs.existsSync(tp)) fail.push(`missing tool ${r.lesson_id} -> ${t.target}`); }
}
if(linked!==reg.lessons_with_direct_tools) fail.push(`linked count registry=${reg.lessons_with_direct_tools} actual=${linked}`);
if(toolLinks!==reg.direct_tool_links) fail.push(`tool link count registry=${reg.direct_tool_links} actual=${toolLinks}`);
const html=fs.readFileSync(path.join(ROOT,"resources/local-investigation-registry.html"),"utf8");
if(!html.includes("no external video or network service is required")) fail.push("human registry missing sovereignty statement");
console.log(`Science lesson/tool registry: lessons=${reg.lessons.length} linked_lessons=${linked} direct_links=${toolLinks} failures=${fail.length}`);
if(fail.length){ for(const f of fail) console.error("FAIL",f); process.exit(1); }
console.log("PASS — Integrated Science 9 lesson/tool registry");
