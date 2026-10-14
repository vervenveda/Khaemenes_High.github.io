import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
let failed=false;
const ok=(v,m)=>{if(v)console.log("OK "+m);else{failed=true;console.error("FAIL "+m)}};
const shared=read("assets/applied-mission-studio-v1.js");
for(const token of ["khaemenes-math-applied-mission-studio-v1","pre-algebra","algebra-1","geometry","algebra-2","course_progression_authority:false","Applied Mission Studio"])ok(shared.includes(token),"shared studio contains "+token);
const contract=read("../shared/course-entry-contract.js");
ok(contract.includes("data-khae-applied-mission-studio"),"High School course entry contract loads shared mission studio on math routes");
const a1loader=read("algebra-1/assets/unit-page.js");
ok(a1loader.includes("../../assets/applied-mission-studio-v1.js"),"Algebra I loads the shared contract before its native studio");
const a1native=read("algebra-1/assets/applied-mission-studio-v1.js");
ok(a1native.includes('mode:"native-algebra1-v1"'),"Algebra I native studio registers with shared contract");
for(const course of ["pre-algebra","algebra-1","geometry","algebra-2"]){
 const sw=read(course+"/service-worker.js");
 ok(sw.includes("../assets/applied-mission-studio-v1.js"),course+" offline release caches shared studio");
}
for(const [course,stem] of [["geometry","geometry"],["algebra-2","algebra2"]]){
 const app=read(course+"/assets/app.js");
 ok(app.includes(`khaemenes-${stem}-applied-mission-portfolio-v1`),course+" portfolio surfaces Applied Mission evidence");
}
const preProjectFiles=[
 "number-systems-investigation.html","signed-data-investigation.html","rational-quantity-investigation.html",
 "community-scale-rate-investigation.html","consumer-financial-decision-investigation.html","scale-of-universe-investigation.html",
 "algebraic-model-design-investigation.html","equation-formula-design-investigation.html","constraint-design-investigation.html",
 "linear-relationship-data-story-investigation.html","accessible-space-scale-design-investigation.html",
 "community-data-evidence-investigation.html","mathematical-modelling-capstone-portfolio.html"
];
for(const course of ["pre-algebra","geometry","algebra-2"]){
 let lessonCount=0,projectCount=0;
 for(let u=1;u<=13;u++){
  const n=String(u).padStart(2,"0"),lessonDir=path.join(ROOT,course,"units","unit-"+n,"lessons");
  if(fs.existsSync(lessonDir)){
   for(const name of fs.readdirSync(lessonDir).filter(x=>x.endsWith(".html"))){
    const html=fs.readFileSync(path.join(lessonDir,name),"utf8");lessonCount++;
    ok(html.includes("course-entry-contract.js"),course+" "+n+"/"+name+" loads shared course-entry contract");
   }
  }
  const projectName=course==="pre-algebra"?preProjectFiles[u-1]:n+"-project.html";
  const projectPath=path.join(ROOT,course,"units","unit-"+n,"projects",projectName);
  ok(fs.existsSync(projectPath),course+" Unit "+n+" canonical project exists");
  if(fs.existsSync(projectPath)){
   const html=fs.readFileSync(projectPath,"utf8");projectCount++;
   ok(html.includes("course-entry-contract.js"),course+" Unit "+n+" project reaches shared Mission Studio loader");
  }
 }
 ok(lessonCount>0,course+" has lesson pages under the shared Applied Connection contract");
 ok(projectCount===13,course+" exposes 13 canonical Applied Mission projects");
}
const a1Data=read("algebra-1/course-data.js");
const slugs=[...a1Data.matchAll(/"number":(\d+)[\s\S]*?"project_slug":"([^"]+)"/g)].slice(0,13);
ok(slugs.length===13,"Algebra I course data exposes 13 canonical projects");
for(const m of slugs){
 const n=String(Number(m[1])).padStart(2,"0"),rel=`algebra-1/units/unit-${n}/projects/${m[2]}.html`;
 ok(fs.existsSync(path.join(ROOT,rel)),rel+" exists");
 if(fs.existsSync(path.join(ROOT,rel))){
  const html=read(rel);
  ok(html.includes('"type":"project"')||html.includes('"type": "project"'),rel+" declares project PAGE_REF");
  ok(html.includes("assets/unit-page.js"),rel+" loads Algebra I project renderer");
 }
}
const bridge=read("algebra-1/assets/lesson-resource-bridge-v1.js");
ok(bridge.includes("?from=")&&bridge.includes("Applied Connection"),"Algebra I lessons carry lesson identity into Applied Mission Studio");
if(failed)process.exit(1);
console.log("\nPASS High School mathematics Applied Mission Studio contract across Pre-Algebra, Algebra I, Geometry and Algebra II.");
