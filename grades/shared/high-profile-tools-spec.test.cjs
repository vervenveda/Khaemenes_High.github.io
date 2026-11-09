"use strict";
// Run from repository root: node grades/shared/high-profile-tools-spec.test.cjs
// Synthetic contract/regression checks; full browser dialog testing remains separate.
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const root=path.join(__dirname,"..","..");
const load=p=>fs.readFileSync(path.join(root,p),"utf8");
const doc={
 head:{append(node){this.sheet=node}},
 getElementById(){return null},
 createElement(){return {dataset:{},style:{setProperty(k,v){this[k]=v}},textContent:""}}
};
const context={window:{document:doc}};
vm.runInNewContext(load("grades/shared/high-profile-tools-spec.js"),context);
const spec=context.window.KhaemenesHighProfileToolSpec;
const expected=["Edit Profile","Class Progress","Schedule","KlasaiPeer","Yearbook","Creative Tools","Student Portfolio","Customize Background"];
assert.deepEqual(Array.from(spec.entries,x=>x.label),expected);
assert.equal(spec.ordered([{id:"schedule"},{id:"edit-profile"}])[0].id,"edit-profile");
assert.throws(()=>spec.ordered([{id:"schedule"},{id:"schedule"}]),/duplicate/);
const button={dataset:{},style:{setProperty(key,value){this[key]=value}}};
spec.decorate(button,"student-portfolio");
assert.equal(button.dataset.profileToolId,"student-portfolio");
assert.equal(button.style.order,"7");
const listeners=new Map();
const dialog={
 open:false,
 addEventListener(type,fn){if(!listeners.has(type))listeners.set(type,[]);listeners.get(type).push(fn)},
 showModal(){this.open=true},
 close(){this.open=false;for(const fn of listeners.get("close")||[])fn()}
};
let returned=0;
const trigger={isConnected:true,focus(options){assert.equal(options.preventScroll,true);returned++}};
assert.equal(spec.openDialog(dialog,trigger),true);
assert.equal(dialog.open,true);
dialog.close();
assert.equal(returned,1,"Dialog close restores its toolbar trigger");
assert.equal(spec.openDialog(dialog,trigger),true);
dialog.close();
assert.equal(returned,2,"Reopening does not duplicate close listeners");
assert.equal(spec.openDialog(null,trigger),false);
const gone={isConnected:false,focus(){throw Error("Detached opener must not receive focus")}};
assert.equal(spec.openDialog(dialog,gone),true);
dialog.close();

assert.match(doc.head.sheet.textContent,/repeat\(4,minmax\(0,1fr\)\)/);
assert.match(doc.head.sheet.textContent,/repeat\(2,minmax\(0,1fr\)\)/);
assert.match(doc.head.sheet.textContent,/max-width:420px/);
const grade9=load("grades/grade-09/student-profile/dashboard-layout.js");
const upper=load("grades/shared/grade09-blueprint-upper-grade.js");
new vm.Script(grade9);new vm.Script(upper);
assert.match(grade9,/id:"student-portfolio",label:"Student Portfolio"/);
assert.match(upper,/url:safeEditor/);
assert.match(upper,/registered\?\.gradeNumber===Number\(grade\)/);
assert.match(grade9,/openDialog\?\.\(popup,document\.activeElement\)/);
assert.match(upper,/bindDialogFocus\?\.\(dlg,opener\)/);
assert.match(upper,/current=gradeContext\(\)/);
assert.match(upper,/action\.id==="edit-profile"/);
assert.match(upper,/if\(!ctx\|\|ctx\.gradeNumber!==Number\(grade\)\)/);

const yearTitles={"09":"My Freshman Year","10":"My Sophomore Year","11":"My Junior Year","12":"My Senior Year"};
for(const grade of ["09","10","11","12"]){
 const html=load("grades/grade-"+grade+"/student-profile/index.html");
 assert.ok(html.includes(`<h1 id="highSchoolProfileHeroTitle">${yearTitles[grade]}</h1>`),"Grade-specific hero: "+grade);
 assert.ok(html.includes(`aria-labelledby="highSchoolProfileHeroTitle"`),"Accessible hero title: "+grade);
 const specPosition=html.indexOf("high-profile-tools-spec.js");
 const entryPosition=html.indexOf(grade==="09"?"dashboard-layout.js":"grade09-blueprint-upper-grade.js");
 assert.ok(specPosition>=0&&entryPosition>specPosition,"Load order: Grade "+grade);
 assert.ok(html.includes("student-profile-background.js"),"Background owner retained: Grade "+grade);
}
console.log("PASS: shared profile tool contract, responsive sizing, Grade 9–12 load order, and safe upper-grade editor routing");
