// Read-only source regression: math Class doors must use canonical existing paths.
// Does not evaluate lessons or write learner data.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
const sandbox={window:{}};
vm.runInNewContext(read("courses/shared/high-school-eight-class.js"),sandbox);
const steps=sandbox.window.KhaemenesHighEightClass.FIRST_STEPS;
const base="https://vervenveda.com/Khaemenes_High.github.io/";
for(const id of ["pre-algebra","algebra-1","geometry","algebra-2"]){
 const url=new URL(steps[id]),prefix=new URL("courses/mathematics/"+id+"/",base);
 assert.equal(url.origin,prefix.origin,id+": diagnostic origin must be canonical");
 assert.ok(url.pathname.startsWith(prefix.pathname),id+": first step must remain inside its course");
 assert.equal(url.pathname,prefix.pathname+"diagnostic/",id+": first step must be diagnostic");
 assert.ok(exists("courses/mathematics/"+id+"/diagnostic/index.html"),id+": diagnostic file must exist");
}
// Never guess lesson filenames from a common template: honor course-native maps.
for(const id of ["pre-algebra","algebra-1"]){
 const map=JSON.parse(read("courses/mathematics/"+id+"/units/unit-01/unit-map.json"));
 const first=map.lessons[0].file;
 assert.ok(first.startsWith("lessons/"),id+": mapped first lesson must be in unit lessons");
 assert.ok(exists("courses/mathematics/"+id+"/units/unit-01/"+first),id+": mapped first lesson must exist");
}
for(const id of ["geometry","algebra-2"]){
 assert.ok(exists("courses/mathematics/"+id+"/units/unit-01/lessons/u01-l01.html"),id+": native lesson must exist");
}
const upper=read("grades/shared/grade09-blueprint-upper-grade.js");
assert.ok(upper.includes('const mathCourse=/^(pre-algebra|algebra-1|geometry|algebra-2)$/.test(item.id||"");'),"upper-grade math course guard must exist");
assert.ok(upper.includes('target.origin===home.origin&&target.pathname.startsWith(coursePath)'),"upper-grade math routes must remain within their course");
assert.ok(upper.includes('const destination=approvedSnapshot&&!snapshotIsLanding?approvedSnapshot:first;'),"upper-grade class fallback must prefer first instructional step");
for(let grade=10;grade<=12;grade++){
 const html=read("grades/grade-"+grade+"/student-profile/index.html");
 assert.ok(html.includes("grade09-blueprint-upper-grade.js"),"Grade "+grade+" must load shared upper-grade class manager");
}
console.log("PASS: four mathematics diagnostic doors, four existing native lessons, 3 upper-grade course-route guards");
