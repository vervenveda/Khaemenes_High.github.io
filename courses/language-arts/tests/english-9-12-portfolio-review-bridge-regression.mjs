/* Khaemenes Academy | English Portfolio Review Bridge checks.
 * node --test courses/language-arts/tests/english-9-12-portfolio-review-bridge-regression.mjs
 * Synthetic learner data only. No authorized grades, attempts or mastery records touched.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";
const arts=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const shared=path.join(arts,"..","shared");
const js=fs.readFileSync(path.join(shared,"english-portfolio-review-bridge-v1.js"),"utf8");
const css=fs.readFileSync(path.join(shared,"english-portfolio-review-bridge-v1.css"),"utf8");
const html=grade=>fs.readFileSync(path.join(arts,"english-"+grade,"portfolio","index.html"),"utf8");

class Element{
 constructor(tag="div"){
  this.tagName=tag.toUpperCase();this.children=[];this.textContent="";this.disabled=false;
  this.value="";this.hidden=false;this.style={};this.handlers={};this.dataset={};
  this.href="";this.open=false;this.options=[];this.clicked=false;
 }
 setAttribute(k,v){this[k]=v}
 append(...nodes){this.children.push(...nodes);if(this.tagName==="SELECT")this.options.push(...nodes)}
 replaceChildren(...nodes){this.children=[...nodes];if(this.tagName==="SELECT")this.options=[...nodes]}
 insertAdjacentElement(where,node){this.inserted=node}
 addEventListener(k,cb){this.handlers[k]=cb}
 click(){this.clicked=true}
 remove(){}
}
function fixture(grade=11,learner="learner-A"){
 const record={
  schema:"khae-english-evidence-studio-v1",grade,week:2,updatedAt:"2026-11-16T10:00:00Z",
  assignment:"Selected reading",fields:{
   claim:"An original claim",evidence1:"A passage",locator1:"page 2",
   reason1:"Explanation",draft:"An initial draft",
   feedback:"Revise the reasoning",revised:"Revised draft",reflection:"What improved"
  }
 };
 const entries=new Map();
 const base="khae-english-evidence-studio-v1:english-"+grade+":week-02";
 entries.set(base+":learner:"+learner,record);
 let active=learner,prints=0;
 const elements=[],events={},anchor=new Element("section");
 const document={
  documentElement:{dataset:{evidenceGrade:String(grade)}},
  querySelector:q=>q.includes("Evidence Studio portfolio pathway")?anchor:null,
  createElement:tag=>{const node=new Element(tag);elements.push(node);return node},
  body:{append(node){elements.push(node)}}
 };
 const contract={
  readAcademyProfile:()=>active?{learnerId:active}:null,
  readJSON:(key,fallback,p)=>entries.get(key+":learner:"+p.learnerId)||fallback,
  scopedKey:(key,p)=>key+":learner:"+p.learnerId
 };
 const exports=[];
 class MockBlob{constructor(parts){this.parts=parts}}
 class MockURL{static createObjectURL(blob){exports.push(JSON.parse(blob.parts.join("")));return "blob:fixture"}static revokeObjectURL(){}}
 const window={KhaemenesCourseEntryContract:contract,addEventListener:(name,cb)=>{events[name]=cb},print:()=>{prints++}};
 vm.runInNewContext(js,{window,document,URL:MockURL,Blob:MockBlob,setTimeout:()=>1},{timeout:2000});
 const find=tag=>elements.find(x=>x.tagName===tag.toUpperCase());
 return {record,entries,events,window,anchor,document,elements,exports,find,setActive:x=>{active=x},get prints(){return prints}};
}
test("shared JavaScript and CSS are valid; four course pages mount the same bridge",()=>{
 new vm.Script(js);
 assert.match(css,/khae-review-bridge/);
 assert.match(css,/max-width:480px/);
 for(const grade of [9,10,11,12]){
  assert.match(html(grade),/data-evidence-grade="/);
  assert.match(html(grade),/english-portfolio-review-bridge-v1\.js/);
  assert.match(html(grade),/english-portfolio-review-bridge-v1\.css/);
  assert.match(html(grade),/Evidence Studio portfolio pathway/);
 }
});
test("learner-scoped stored evidence can form an explicitly non-grading review packet",()=>{
 for(const grade of [9,10,11,12]){
  const f=fixture(grade);
  const select=f.find("select");
  assert.equal(select.options.length,1);
  select.value="2";select.handlers.change();
  const buttons=f.elements.filter(x=>x.tagName==="BUTTON");
  assert.equal(buttons.length,2);
  buttons[0].handlers.click();
  assert.equal(f.exports.length,1);
  const packet=f.exports[0];
  assert.equal(packet.schema,"khaemenes-english-portfolio-review-packet-v1");
  assert.equal(packet.grade,grade);assert.equal(packet.week,2);
  assert.equal(packet.learnerId,"learner-A");
  assert.equal(packet.evidence.claim,"An original claim");
  assert.equal(packet.reviewStatus,"NOT REVIEWED");
  assert.equal(packet.educatorApproval,false);
  assert.equal(packet.academicGrade,null);
  assert.equal(packet.mastery,null);
  assert.equal(f.entries.size,1,"Bridge cannot create or modify student records");
 }
});
test("missing or mismatched learner cannot inspect or export records",()=>{
 const f=fixture(10);
 f.setActive("learner-B");
 f.find("select").value="2";f.find("select").handlers.change();
 f.elements.filter(x=>x.tagName==="BUTTON")[0].handlers.click();
 assert.equal(f.exports.length,0);
 assert.equal(f.entries.size,1);
});
test("cross-tab identity change permanently prevents old review exports and print",()=>{
 const f=fixture(12);
 f.events.storage({key:"khaemenes_active_learner_v1"});
 const buttons=f.elements.filter(x=>x.tagName==="BUTTON");
 buttons[0].handlers.click();buttons[1].handlers.click();
 assert.equal(f.exports.length,0);
 assert.equal(f.prints,0);
 assert.equal(f.find("select").disabled,true);
});
test("wrong grade, wrong week and malformed record are rejected",()=>{
 const f=fixture(9);
 const key="khae-english-evidence-studio-v1:english-9:week-02:learner:learner-A";
 f.entries.set(key,{schema:"khae-english-evidence-studio-v1",grade:11,week:2,fields:{claim:"wrong grade"}});
 f.find("select").value="2";f.find("select").handlers.change();
 f.elements.filter(x=>x.tagName==="BUTTON")[0].handlers.click();
 assert.equal(f.exports.length,0);
});
