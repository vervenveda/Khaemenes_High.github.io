"use strict";
/* Source and synthetic checks for Algebra I Units 02–13 and English 9 daily lessons.
 * Run: node --test courses/tests/algebra-english-daily-retention.test.cjs
 */
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
function read(p){return fs.readFileSync(path.join(root,p),"utf8")}
for(const unit of ["02","03","04","05","06","07","08","09"]){
 test("Algebra I Unit "+unit+" confirms graded attempt storage",()=>{
  const s=read("mathematics/algebra-1/units/unit-"+unit+"/assets/unit"+unit+"-core.js");
  assert.ok(s.includes("localStorage.getItem(KEY)===encoded"),unit);
  assert.ok(s.includes("return false}catch{return false}")===false);
  assert.ok(s.includes("const saveRecords=(typeof save===")||s.includes("const saveRecords = (typeof save==="));
 });
}
test("Algebra I Units 10–13 shared renderer confirms saved result before marking attempt graded",()=>{
 const s=read("mathematics/algebra-1/assets/unit-page-core.js");
 assert.ok(s.includes('if(localStorage.getItem(KEY)!==encoded)throw Error("Algebra I record write not verified")'));
 assert.ok(s.indexOf("localStorage.getItem(KEY)!==encoded")<s.indexOf("p=next;"));
});
test("English 9 daily-lesson save checks selected learner and family membership",()=>{
 const s=read("language-arts/english-9/assets/daily-lesson.js");
 assert.ok(s.includes("getProfile()?.learnerId!==id"));
 assert.ok(s.includes("family.learnerIds.includes(id)"));
 assert.ok(s.includes('if(localStorage.getItem(key)!==value){alertSave("The saved lesson record could not be verified.");return false;}'));
 assert.ok(s.includes('if(localStorage.getItem(key)!==snapshot.get(key))'));
});
test("dedicated unit save functions reject missing readback",()=>{
 const source=read("mathematics/algebra-1/units/unit-08/assets/unit08-core.js");
 const match=source.match(/function sv\(x\)\{try\{const encoded=JSON\.stringify\(x\);localStorage\.setItem\(KEY,encoded\);return localStorage\.getItem\(KEY\)===encoded\}catch\{return false\}\}/);
 assert.ok(match);
 function run(store){return vm.runInNewContext('const KEY="sample";'+match[0]+';sv({attempts:[{id:"a"}]})',{localStorage:store,JSON})}
 const state=new Map();
 assert.equal(run({setItem:(k,v)=>state.set(k,v),getItem:k=>state.get(k)||null}),true);
 assert.equal(run({setItem:()=>{},getItem:()=>null}),false);
 assert.equal(run({setItem:()=>{throw Error("quota")},getItem:()=>null}),false);
});
