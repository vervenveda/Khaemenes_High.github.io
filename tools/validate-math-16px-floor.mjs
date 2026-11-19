import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const fail=[];
const check=(v,m)=>{if(!v)fail.push(m)};

const canonical=[
  "courses/mathematics/assets/math-responsive-hardening-v1.css",
  "courses/mathematics/pre-algebra/assets/prealgebra-math-lesson-v2-adapter.js",
  "courses/mathematics/algebra-1/assets/algebra1-student-experience-v2.css",
  "courses/mathematics/geometry/assets/geometry-math-lesson-v2-adapter.js",
  "courses/mathematics/geometry/assets/geometry-presentation-unifier-v1.js",
  "courses/mathematics/algebra-2/assets/algebra2-presentation-unifier-v1.js"
];

for(const p of canonical){
  const text=read(p);
  const tiny=[...text.matchAll(/font-size\s*:\s*(\d+(?:\.\d+)?)px\s*!important/gi)]
    .map(m=>Number(m[1])).filter(n=>n<16);
  check(tiny.length===0,`${p} contains sub-16px !important font rule(s): ${tiny.join(", ")}`);
}

const shared=read("courses/mathematics/assets/math-responsive-hardening-v1.css");
check(shared.includes("html:root:root body{font-size:16px!important}"),"shared mathematics layer enforces a 16px body floor");
for(const token of ["small",".eyebrow",".kicker",".breadcrumb",".feedback",".notice",".help-text",".lesson-meta"]){
  check(shared.includes(token),`shared 16px floor explicitly covers ${token}`);
}
check(shared.includes("font-size:max(16px,1em)!important"),"shared mathematics layer uses a 16px minimum for ordinary/helper text");

const pre=read("courses/mathematics/pre-algebra/assets/prealgebra-math-lesson-v2-adapter.js");
check(pre.includes("localStorage.getItem(key)===raw"),"Pre-Algebra checklist persistence is read-back verified");

if(fail.length){
  console.error("\nMathematics 16px/readability validation failed:");
  fail.forEach(x=>console.error(" - "+x));
  process.exit(1);
}
console.log("MATH_16PX_FLOOR=PASS · canonical four-course runtime layers enforce a 16px minimum and Pre-Algebra checklist writes are verified.");
