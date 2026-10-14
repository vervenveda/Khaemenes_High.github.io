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
const preProjects=[...Array(13)].map((_,i)=>`pre-algebra/units/unit-${String(i+1).padStart(2,"0")}/projects/`);
const geoProjects=[...Array(13)].map((_,i)=>`geometry/units/unit-${String(i+1).padStart(2,"0")}/projects/`);
const a2Projects=[...Array(13)].map((_,i)=>`algebra-2/units/unit-${String(i+1).padStart(2,"0")}/projects/`);
for(const dir of [...preProjects,...geoProjects,...a2Projects]){
 ok(fs.existsSync(path.join(ROOT,dir)),dir+" exists");
}
if(failed)process.exit(1);
console.log("\nPASS High School mathematics Applied Mission Studio contract.");
