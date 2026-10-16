import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const registrySource=fs.readFileSync("grades/grade-09/student-profile/student-course-registry.js","utf8");
const dashboard=fs.readFileSync("grades/grade-09/student-profile/index.html","utf8");
const daily=fs.readFileSync("grades/grade-09/student-profile/daily-lessons/index.html","utf8");

class MemoryStorage{
  constructor(seed={}){this.m=new Map(Object.entries(seed).map(([k,v])=>[k,typeof v==="string"?v:JSON.stringify(v)]))}
  getItem(k){return this.m.has(k)?this.m.get(k):null}
  setItem(k,v){this.m.set(k,String(v))}
  removeItem(k){this.m.delete(k)}
}

const storage=new MemoryStorage({
  "khaemenes-high-pinned-courses-v2":["pre-algebra","english-9","integrated-science-9"],
  "khaemenes-high-math-pathway-v1":"pre-algebra",
  "khaemenes-grade09-course-launches-v1":{
    "english-9":{url:"/Khaemenes_High.github.io/courses/language-arts/english-9/",title:"English 9",at:"2026-10-15T12:00:00.000Z"},
    "integrated-science-9":{url:"/Khaemenes_High.github.io/courses/science/integrated-science-9/",title:"Integrated Science 9",at:"2026-10-15T13:00:00.000Z"}
  }
});
const box={
  window:{},
  location:{pathname:"/Khaemenes_High.github.io/grades/grade-09/student-profile/",origin:"https://vervenveda.com"},
  localStorage:storage,
  URLSearchParams,
  Date,
  fetch:async()=>({ok:false,json:async()=>({})})
};
box.window=box.window;
vm.createContext(box);
vm.runInContext(registrySource,box);
const registry=box.window.KhaemenesGrade09Courses;
assert.ok(registry,"course registry must initialize");
assert.equal(registry.resumePriorityCourse().id,"integrated-science-9","most recently launched pinned class should be the primary resume course");
storage.removeItem("khaemenes-grade09-course-launches-v1");
assert.equal(registry.resumePriorityCourse().id,"pre-algebra","active pinned math pathway should remain the fallback when no recent launch exists");
assert.ok(dashboard.includes("resumePriorityCourse"),"Student Dashboard must use the intelligent resume priority");
assert.ok(dashboard.includes("const current=await registry.resolveContinueFor(course.id)"),"other pinned subjects must open their resolved next step rather than only the course home");
assert.ok(daily.includes("resumePriorityCourse"),"Daily Lessons primary action must use the same resume priority");
console.log("Grade 09 intelligent resume flow: PASS");
