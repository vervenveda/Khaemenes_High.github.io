import fs from "node:fs";
import path from "node:path";

const ROOT=path.resolve("courses/mathematics/algebra-2");
const errors=[];
const fail=m=>errors.push(m),assert=(c,m)=>c?undefined:fail(m);
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)])}
function read(p){return fs.readFileSync(p,"utf8")}
const files=walk(ROOT),lessons=files.filter(f=>/\/units\/unit-\d{2}\/lessons\/[^/]+\.html$/.test(f));
assert(lessons.length===92,"expected 92 Algebra II lessons, found "+lessons.length);
for(const file of lessons){
 const html=read(file),rel=path.relative(ROOT,file).split(path.sep).join("/");
 assert(html.includes("course-entry-contract.js"),rel+": course-entry contract missing");
 assert(!html.includes("algebra2-math-lesson-v2-adapter.js"),rel+": Algebra II engine rollout must remain on HOLD until Geometry acceptance");
}
for(const file of files.filter(f=>/\/(?:assessment|assessments|diagnostic)\//.test(f)||/(?:midterm|final).*\.html$/i.test(f))){
 if(!/\.html$/.test(file))continue;
 const html=read(file),rel=path.relative(ROOT,file).split(path.sep).join("/");
 assert(!html.includes("math-lesson-v2-adapter.js"),rel+": lesson adapter crossed assessment firewall");
}
for(const rel of ["units/unit-01/lessons/u01-l01.html","units/unit-04/lessons/u04-l08.html","units/unit-13/lessons/u13-l01.html"]){
 assert(fs.existsSync(path.join(ROOT,rel)),"missing representative Algebra II lesson "+rel);
}
if(errors.length){console.error(errors.map((e,i)=>(i+1)+". "+e).join("\n"));process.exit(1)}
console.log("PASS Algebra II engine-readiness HOLD: 92 lessons · course-entry coverage · assessment firewall · representative advanced lessons present");
