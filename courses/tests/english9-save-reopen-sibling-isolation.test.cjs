"use strict";
/* Run with node --test courses/tests/english9-save-reopen-sibling-isolation.test.cjs
 * Executes extracted live controller storage handlers under synthetic browser state.
 */
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const source=fs.readFileSync(path.resolve(__dirname,"../language-arts/english-9/assets/course.js"),"utf8");
function sourceBetween(a,b){const start=source.indexOf(a),end=source.indexOf(b,start);assert.ok(start>=0&&end>start,a);return source.slice(start,end)}
const progressCode=sourceBetween("  let lastStoredProgress=null,progressFrozen=false;",'  document.querySelectorAll("[data-progress-key]")');
const fieldCode=sourceBetween("    let lastFieldValue=null,fieldFrozen=false;",'\n  });');
function environment(){const values=new Map();return {values,storage:{getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)}}}
test("save, close, reopen, select sibling, return to original English 9 progress",()=>{
 const {values,storage}=environment();let active="A";
 function open(id){
  active=id;
  const context={localStorage:storage,courseKey:"progress:"+id,academyProfile:{learnerId:id},
   retentionNotice:{textContent:""},selectionMatches:()=>active===id,JSON,Object};
  return vm.runInNewContext(progressCode+';({progress,save,frozen:progressFrozen})',context);
 }
 assert.equal(open("A").save({"week-14":true}),true);
 assert.equal(open("A").progress["week-14"],true);
 assert.equal(Object.keys(open("B").progress).length,0);
 assert.equal(open("B").save({"week-15":true}),true);
 const again=open("A");
 assert.equal(again.progress["week-14"],true);
 assert.equal(again.progress["week-15"],undefined);
 assert.notEqual(values.get("progress:A"),values.get("progress:B"));
});
test("malformed stored progress is preserved and cannot be mistaken for a blank record",()=>{
 const {values,storage}=environment();values.set("progress:A","{broken");
 const ctx={localStorage:storage,courseKey:"progress:A",academyProfile:{learnerId:"A"},
  retentionNotice:{textContent:""},selectionMatches:()=>true,JSON,Object};
 const result=vm.runInNewContext(progressCode+';({progress,save,frozen:progressFrozen})',ctx);
 assert.equal(result.frozen,true);
 assert.equal(result.save({"week-14":true}),false);
 assert.equal(values.get("progress:A"),"{broken");
});
test("writing fields reopen correctly, deny stale-tab overwrite and deny sibling switch",()=>{
 const {values,storage}=environment();let active="A";
 function mount(id){
  let onInput;
  const field={value:"",readOnly:false,addEventListener:(event,fn)=>{if(event==="input")onInput=fn}};
  const note={textContent:""};
  const context={localStorage:storage,field,key:"field:"+id,retentionNotice:note,selectionMatches:()=>active===id,JSON,Object};
  vm.runInNewContext(fieldCode,context);
  return {field,note,type:text=>{field.value=text;onInput()}};
 }
 const a=mount("A");a.type("synthetic draft");assert.equal(values.get("field:A"),"synthetic draft");
 assert.equal(mount("A").field.value,"synthetic draft");
 active="B";assert.equal(mount("B").field.value,"");
 active="A";const stale=mount("A");
 values.set("field:A","another tab's later changes");stale.type("old-tab text");
 assert.equal(values.get("field:A"),"another tab's later changes");
 assert.match(stale.note.textContent,/another tab/);
 active="B";a.type("wrong-learner writing");
 assert.equal(values.get("field:A"),"another tab's later changes");
});
