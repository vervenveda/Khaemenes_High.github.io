import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root=process.cwd(),fail=[];
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const ok=(v,m)=>{if(!v)fail.push(m)};

const index=read("courses/mathematics/algebra-1/index.html");
ok(index.includes("algebra1-student-experience-v2.css"),"course home loads student-experience CSS");
ok(index.includes("algebra1-student-experience-v2.js"),"course home loads student-experience JS");
ok(index.includes("function lazyUnitDrawer"),"course home lazily loads unit lesson maps");
ok(!index.includes("Promise.all(Array.from({length:unitCount}"),"course home no longer eagerly fetches all unit maps");

const css=read("courses/mathematics/algebra-1/assets/algebra1-student-experience-v2.css");
ok(css.includes("#main:empty::before"),"empty JS-rendered pages expose a loading surface");
ok(css.includes("font-size:12px!important"),"oversized eyebrow typography is overridden");
ok(css.includes("--a1-radius:7px"),"student experience preserves the 7px card/button radius");

for(const p of [
  "courses/mathematics/algebra-1/assets/algebra1-student-experience-v2.js",
  "courses/mathematics/algebra-1/assets/dedicated-unit-gates-v1.js",
  "courses/mathematics/algebra-1/assets/unit-page.js",
  "courses/mathematics/algebra-1/units/unit-01/assets/unit01.js"
]){
  try{new vm.Script(read(p),{filename:p})}catch(e){fail.push(p+" syntax: "+e.message)}
}
for(let n=1;n<=9;n++){
  const id=String(n).padStart(2,"0"),p=`courses/mathematics/algebra-1/units/unit-${id}/assets/unit${id}.css`;
  ok(read(p).includes("algebra1-student-experience-v2.css"),`Unit ${id} CSS loads shared student experience immediately`);
}
ok(read("courses/mathematics/algebra-1/assets/dedicated-unit-gates-v1.js").includes("loadStudentExperience"),"dedicated units 02-09 load student experience after rendering");
ok(read("courses/mathematics/algebra-1/assets/unit-page.js").includes("algebra1-student-experience-v2.js"),"shared units 10-13 load student experience");
ok(read("courses/mathematics/algebra-1/units/unit-01/assets/unit01.js").includes("algebra1StudentExperienceV2"),"Unit 01 loads student experience");

if(fail.length){
  console.error("\nAlgebra I student-experience validation failed:");
  fail.forEach(x=>console.error(" - "+x));
  process.exit(1);
}
console.log("Algebra I student-experience validation passed: course dashboard, lazy lesson maps, compact typography, loading surface, and shared unit/lesson enhancement are wired across Units 01-13.");
