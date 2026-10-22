import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const get=path=>fs.readFileSync(path,"utf8");
const home=get("index.html");
const storeSource=get("courses/shared/high-school-course-pins.js");
const registrySource=get("grades/grade-09/student-profile/student-course-registry.js");
const data=new Map();
const storage={
 getItem:key=>data.has(key)?data.get(key):null,
 setItem:(key,value)=>data.set(key,String(value)),
 removeItem:key=>data.delete(key)
};
const box={
 window:null,localStorage:storage,
 location:{pathname:"/Khaemenes_High.github.io/grades/grade-09/student-profile/"},
 URLSearchParams,Date,encodeURIComponent
};
box.window=box;
vm.createContext(box);
vm.runInContext(storeSource,box,{filename:"high-school-course-pins.js"});
vm.runInContext(registrySource,box,{filename:"student-course-registry.js"});
const store=box.KhaemenesHighCoursePins;
const grade9=box.KhaemenesGrade09Courses;
assert(store&&grade9);
assert.equal(grade9.courses.length,8,"Course manager exposes two math placement choices plus six non-math choices");
assert.equal(grade9.getCourse("science-9").id,"integrated-science-9");
assert.equal(grade9.getCourse("social-studies-9").id,"global-studies-9");
data.set(store.PIN_KEY,JSON.stringify(["science-9","social-studies-9","english-10","world-language-9-arabic","pre-algebra","psychology-101"]));
assert(grade9.pinnedIds().includes("integrated-science-9"));
assert(grade9.pinnedIds().includes("world-language-9-arabic"));
assert(grade9.pinnedCourses().some(c=>c.id==="psychology-101"));
assert(grade9.setPinned("english-9",true));
assert(store.readPins().includes("english-10"),"Preserve other grade's pin");
assert(grade9.setMathPathway("algebra-1"));
assert(!grade9.pinnedIds().includes("pre-algebra"));
assert(store.readPins().includes("english-10"));
assert(store.writeLanguageChoices({"9":"russian"}));
assert(grade9.courses.some(c=>c.id==="world-language-9-russian"));
data.set("khaemenes_family_registry_v1",JSON.stringify({learners:{
 a:{learnerId:"a",nickname:"A"},b:{learnerId:"b",nickname:"B"}
}}));
data.set("khaemenes_active_learner_v1",JSON.stringify("a"));
assert.equal(store.readPins().length,0,"No automatic legacy sharing");
assert(grade9.setPinned("world-language-9-russian",true));
const academyAfterA=JSON.parse(data.get(store.ACADEMY_PIN_KEY));
assert(academyAfterA.learners.a.some(p=>p.id==="world-language-9-russian"),"High School pin mirrors to Academy Student Portal");
data.set("khaemenes_active_learner_v1",JSON.stringify("b"));
assert.equal(store.readPins().length,0,"No sibling crossover");
assert(grade9.setPinned("english-9",true));
data.set("khaemenes_active_learner_v1",JSON.stringify("a"));
assert(store.readPins().includes("world-language-9-russian"));
assert(!store.readPins().includes("english-9"));
assert(JSON.parse(data.get(store.PIN_KEY)).includes("english-10"),"Unscoped history retained");
assert(store.clearPins());
assert(store.hasPinRecord()&&store.readPins().length===0,"Empty does not resurrect old pins");
assert.equal(JSON.parse(data.get(store.ACADEMY_PIN_KEY)).learners.a.filter(p=>p.source==="khaemenes-high").length,0,"Clearing learner pins clears High School mirror without deleting other learner records");
assert(home.includes("PIN_STORE.readPins()"),"Front hall reads shared pin store");
assert(!home.includes("saved.filter(id=>ALL_COURSES.some"),"Front hall must not drop other IDs");
assert(home.includes("high-school-course-pins.js"),"Front hall loads helper");
for(const path of ["grades/grade-09/student-profile/index.html","grades/grade-09/student-profile/daily-lessons/index.html"]){
 const html=get(path);
 assert(html.indexOf("high-school-course-pins.js")<html.indexOf("student-course-registry.js"),path+" loads pins before registry");
}
console.log("PASS High School course pins: profile isolation, alias migration, electives, math, legacy preservation, homepage integration");
