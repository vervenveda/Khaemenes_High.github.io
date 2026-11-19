import fs from "node:fs";
import path from "node:path";

const ROOT=path.resolve("courses/mathematics/geometry");
const ADAPTER="geometry-math-lesson-v2-adapter.js";
const VERSION="2.2.3";
const errors=[];
const fail=m=>errors.push(m),assert=(c,m)=>c?undefined:fail(m);
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)])}
function read(p){return fs.readFileSync(p,"utf8")}
const files=walk(ROOT),lessons=files.filter(f=>/\/units\/unit-\d{2}\/lessons\/[^/]+\.html$/.test(f));
assert(lessons.length===90,"expected 90 Geometry lessons, found "+lessons.length);
for(const file of lessons){
 const html=read(file),rel=path.relative(ROOT,file).split(path.sep).join("/");
 const token=ADAPTER+"?v="+VERSION;
 assert(html.split(token).length-1===1,rel+": expected exactly one Geometry adapter "+VERSION+" reference");
 assert(html.includes("course-entry-contract.js"),rel+": course-entry contract missing");
}
const protectedFiles=files.filter(f=>/\/(?:assessment|assessments|diagnostic)\//.test(f)||/(?:midterm|final).*\.html$/i.test(f));
for(const file of protectedFiles){
 if(!/\.html$/.test(file))continue;
 const html=read(file),rel=path.relative(ROOT,file).split(path.sep).join("/");
 assert(!html.includes(ADAPTER),rel+": lesson adapter crossed assessment firewall");
}
const adapter=read(path.join(ROOT,"assets",ADAPTER));
assert(adapter.includes(VERSION),"Geometry adapter internal version "+VERSION+" missing");
assert(adapter.includes("lesson-tools.js")||adapter.includes("Evaluator lesson score"),"Geometry adapter must preserve native mastery authority");
if(errors.length){console.error(errors.map((e,i)=>(i+1)+". "+e).join("\n"));process.exit(1)}
console.log("PASS Geometry local regression: 90 lessons · adapter parity · assessment firewall · course-entry coverage");
