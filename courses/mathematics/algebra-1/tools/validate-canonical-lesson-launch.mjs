import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root="courses/mathematics/algebra-1/";
const courseData=root+"course-data.js",sharedReader=root+"assets/unit-page.js";
assert.ok(fs.existsSync(courseData)&&fs.existsSync(sharedReader),"Shared Algebra I reader and course data exist");
new vm.Script(fs.readFileSync(sharedReader,"utf8"),{filename:sharedReader});
new vm.Script(fs.readFileSync(courseData,"utf8"),{filename:courseData});
let lessons=0,legacy=0,pageRefLessons=0,pageRefUnits=0,legacyUnits=0,verifiedImports=0;
const parseReference=html=>{
 const match=html.match(/window\.PAGE_REF\s*=\s*(\{[^;]+\})\s*;/);
 return match?vm.runInNewContext("("+match[1]+")",{}, {timeout:1000}):null;
};
function verifyDependencies(html,source) {
 for(const script of html.matchAll(/<script\b[^>]*\bsrc="([^"]+\.js)(?:\?[^"]*)?"[^>]*>/gi)){
  const src=script[1];if(/^https?:\/\//.test(src))continue;
  const full=path.resolve(path.dirname(source),src);
  assert.ok(fs.existsSync(full),source+" missing local script "+src);
  verifiedImports++;
 }
}
function verifyPageReference(ref,type,unit,lesson,source) {
 assert.equal(ref?.type,type,source+" wrong PAGE_REF type");
 assert.equal(Number(ref?.unit),unit,source+" wrong PAGE_REF unit");
 if(type==="lesson")assert.equal(Number(ref?.lesson),lesson,source+" wrong PAGE_REF lesson");
 assert.ok(typeof ref?.root==="string",source+" missing PAGE_REF root");
 assert.equal(path.resolve(path.dirname(source),ref.root),path.resolve(root),source+" PAGE_REF root does not target course");
}
for(let n=1;n<=13;n++){
 const unit="unit-"+String(n).padStart(2,"0"),dir=root+"units/"+unit+"/";
 const map=JSON.parse(fs.readFileSync(dir+"unit-map.json","utf8"));
 assert.ok(Array.isArray(map.lessons)&&map.lessons.length>0,unit+" missing lesson map");
 for(const item of map.lessons){
  assert.ok(/^lessons\/[^/]+\.html$/.test(item.file),unit+" invalid lesson path");
  const target=dir+item.file;assert.ok(fs.existsSync(target),unit+" missing "+item.file);
  const html=fs.readFileSync(target,"utf8");
  assert.ok(/<main\b[^>]*id="main"/.test(html),target+" missing learner lesson workspace");
  const ref=parseReference(html);
  if(ref){
   verifyPageReference(ref,"lesson",n,Number(item.number),target);
   assert.ok(html.includes('src="../../../course-data.js"'),target+" missing course data");
   assert.ok(html.includes('src="../../../assets/unit-page.js"'),target+" missing existing HTML lesson renderer");
   pageRefLessons++;
  }else{
   assert.match(html,/data-mode="lesson"/,target+" missing legacy lesson mode");
   assert.ok(html.includes('data-lesson="'+item.number+'"'),target+" wrong legacy lesson number");
   legacy++;
  }
  verifyDependencies(html,target);
  lessons++;
 }
 const index=dir+"index.html",unitPage=fs.readFileSync(index,"utf8");
 const ref=parseReference(unitPage);
 if(ref){
  verifyPageReference(ref,"unit",n,null,index);
  assert.ok(unitPage.includes('src="../../course-data.js"')&&unitPage.includes('src="../../assets/unit-page.js"'),
   unit+" missing shared unit reader");
  pageRefUnits++;
 }else{
  assert.match(unitPage,/data-mode="unit"/,unit+" missing legacy unit mode");
  const data=dir+"assets/"+unit.replace("-","")+"-data.js";
  const reader=dir+"assets/"+unit.replace("-","")+".js";
  for(const file of [data,reader]){
   assert.ok(fs.existsSync(file),unit+" missing legacy JS "+file);
   new vm.Script(fs.readFileSync(file,"utf8"),{filename:file});
  }
  legacyUnits++;
 }
 verifyDependencies(unitPage,index);
}
assert.ok(lessons>0&&pageRefLessons>0,"Modern lesson renderer was not exercised");
console.log("PASS Algebra I: "+lessons+" HTML lesson shells, "+pageRefLessons+" PAGE_REF lessons, "+
 legacy+" legacy lesson shells, "+pageRefUnits+" PAGE_REF unit entrances, "+legacyUnits+
 " legacy unit readers, "+verifiedImports+" local JS imports; preserves original lesson engines.");
