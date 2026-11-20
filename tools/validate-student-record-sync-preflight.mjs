import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const page=read("portfolio/index.html"),source=read("portfolio/portfolio-student-record-connections.js");
assert.match(page,/id="checkStudentRecords"/);
assert.match(page,/id="downloadRecordInventory"/);
assert.match(page,/id="studentRecordConnectionResults"/);
assert.match(page,/portfolio-student-record-connections\.js\?v=20261120-read-only-preflight-v1/);
assert.doesNotMatch(source,/\bpins\?\.(?:readPins|writePins|syncAcademyPins|readLanguageChoices|writeLanguageChoices)/);
assert.doesNotMatch(source,/\b(?:setItem|removeItem|clear|publish|writeJSON)\s*\(/);
class Node{
 constructor(){this.children=[];this.textContent="";this.listeners={};this.disabled=false;this.href="";this.download=""}
 append(...nodes){this.children.push(...nodes)}replaceChildren(...nodes){this.children=[...nodes]}
 addEventListener(k,cb){this.listeners[k]=cb}
 click(){this.listeners.click?.()}
 remove(){}
}
function exercise({registered=true,other=false,origin="https://vervenveda.com"}={}){
 const data=new Map();
 const learnerId="test-learner";
 const owned=other?"different-learner":learnerId;
 data.set("khaemenes-high-pinned-courses-v2:learner:"+encodeURIComponent(owned),JSON.stringify(["english-9"]));
 data.set("khaemenes-high-language-choices-v1:learner:"+encodeURIComponent(owned),JSON.stringify({"9":"french"}));
 data.set("khae-learning-portfolio-v1:learner:"+encodeURIComponent(owned),JSON.stringify([{id:"p",title:"Secret essay",detail:"Private reflections"}]));
 data.set("khaemenes.course:"+owned+":english-9",JSON.stringify({updatedAt:"2026-11-20T10:00:00Z",score:99}));
 const keys=[...data.keys()];
 let writes=0;
 const localStorage={getItem:k=>data.get(k)??null,setItem(){writes++},removeItem(){writes++},get length(){return keys.length},key:i=>keys[i]};
 const ids=Object.fromEntries(["checkStudentRecords","downloadRecordInventory","studentRecordConnectionResults","studentRecordConnectionStatus"].map(k=>[k,new Node()]));
 const document={getElementById:k=>ids[k],createElement:()=>new Node(),body:new Node()};
 const window={
  localStorage,
  KhaemenesCourseEntryContract:{readAcademyProfile:()=>({learnerId})},
  KhaemenesHighProfileGradeContext:{active:()=>({learnerId:registered?learnerId:"someone-else",grade:"09"})},
  KhaemenesHighCoursePins:{activeLearner:()=>learnerId},
  KhaemenesLearningContinuation:{readLearner:()=>[{learnerId:other?"another-id":learnerId,grade:"09",courseId:"english-9",assessments:[{kind:"quiz",earned:9,possible:10}]}]},
  addEventListener(){}};
 const context={window,document,location:{origin},Blob:class Blob{},URL:{createObjectURL:()=>"",revokeObjectURL(){}},setTimeout(){},Date,console};
 vm.runInNewContext(source,context,{filename:"portfolio-student-record-connections.js"});
 ids.checkStudentRecords.click();
 const text=ids.studentRecordConnectionStatus.textContent;
 const cards=ids.studentRecordConnectionResults.children;
 return {text,cardText:cards.map(x=>x.children.map(y=>y.textContent).join(" | ")).join(" || "),disabled:ids.downloadRecordInventory.disabled,writes};
}
const good=exercise();
assert.match(good.text,/record categories checked/);
assert.match(good.cardText,/Academy course continuation/);
assert.match(good.cardText,/Pinned classes \| FOUND \u00b7 1 item/);
assert.match(good.cardText,/Foreign-language selection \| FOUND \u00b7 1 item/);
assert.ok(!good.cardText.includes("Private reflections")&&!good.cardText.includes("Secret essay"));
assert.equal(good.disabled,false);
const different=exercise({other:true});
assert.match(different.cardText,/Student Portfolio \| MISSING/);
assert.match(different.cardText,/Pinned classes \| MISSING/);
const unauthorized=exercise({registered:false});
assert.match(unauthorized.text,/identity checks must agree/);
assert.equal(unauthorized.disabled,true);
const wrongOrigin=exercise({origin:"https://artist1970.github.io"});
assert.match(wrongOrigin.text,/not on the canonical/);
assert.equal(wrongOrigin.disabled,true);
for(const t of [good,different,unauthorized,wrongOrigin])assert.equal(t.writes,0);
console.log("STUDENT RECORD SYNC PREFLIGHT: PASS (scoped audit, no grade/identity leaks, wrong origin, learner mismatch, zero writes).");
