/* Node built-in VM regression: two learners, mismatch, switch, persistence, invalid data. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const source=fs.readFileSync(path.resolve(__dirname,"../grades/shared/profile-portfolio-overview.js"),"utf8");
const storage=new Map();
let active="A",canonical="A";
function node(tag){
 return {tag,textContent:"",children:[],style:{},dataset:{},attributes:{},append(...children){this.children.push(...children)},replaceChildren(...children){this.children=children},setAttribute(k,v){this.attributes[k]=v}};
}
const mount=node("div");
const listeners={};
const context={document:{body:{dataset:{grade:"10"}},getElementById(id){return id==="my-profile-extras"?mount:null},createElement:node},window:{KhaemenesStudentProfileV2:{activeLearner:()=>({learnerId:active})},KhaemenesCourseEntryContract:{readAcademyProfile:()=>({learnerId:canonical})},addEventListener:(k,fn)=>{listeners[k]=fn}},localStorage:{getItem:k=>storage.get(k)||null}};
const entry=(id,title)=>({id,title,subject:"Mathematics",detail:"Evidence",reference:"Week 03"});
storage.set("khae-learning-portfolio-v1:learner:A",JSON.stringify([entry("a1","A private record")]));
storage.set("khae-learning-portfolio-v1:learner:B",JSON.stringify([entry("b1","B private record")]));
vm.runInNewContext(source,context,{timeout:1000});
assert.equal(mount.children.length,1);
const section=mount.children[0],summary=section.children[1],list=section.children[2];
assert.match(summary.textContent,/1 evidence entry/);
assert.match(list.children[0].textContent,/A private record/);
active="B";canonical="B";listeners["khaemenes-student-profile-changed"]();
assert.equal(list.children.length,0,"prior learner evidence must be hidden");
assert.match(summary.textContent,/Learner changed/);
active="A";canonical="A";listeners.focus();
assert.match(list.children[0].textContent,/A private record/);
storage.set("khae-learning-portfolio-v1:learner:A",JSON.stringify([entry("a2","A updated record")]));
listeners.storage({key:"khae-learning-portfolio-v1:learner:A"});
assert.match(list.children[0].textContent,/A updated record/);
canonical="B";listeners.focus();
assert.equal(list.children.length,0);
console.log("PASS portfolio preview learner isolation, switch concealment, restore, storage refresh, mismatched identity");
