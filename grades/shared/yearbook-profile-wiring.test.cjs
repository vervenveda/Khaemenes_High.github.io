"use strict";
// node grades/shared/yearbook-profile-wiring.test.cjs
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.join(__dirname,"..","..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const photo=read("grades/grade-09/student-profile/student-profile-photo.js");
assert.match(photo,/yearbookChoose\.addEventListener\("click"/);
assert.match(photo,/learner\(\)!==owner/);
assert.match(photo,/localStorage\.getItem\(key\)!==data/);
for(const grade of ["09","10","11","12"]){
 for(const sub of ["index.html","profile/index.html"]){
  const file="grades/grade-"+grade+"/student-profile/"+sub;
  const source=read(file);
  const bridge=source.indexOf("khaemenes-yearbook-profile-images.js");
  const editor=source.indexOf(sub==="index.html"?"student-profile-photo.js":"khaemenes-universal-profile-look-editor.js");
  assert.ok(bridge!==-1&&editor>bridge,"shared image choice before editor: "+file);
  if(sub.startsWith("profile"))assert.match(source,/khaemenes-universal-profile-look-editor\.js\?v=20261109-yearbook-popup-v3/);
 }
}
console.log("PASS Yearbook picture bridge and Grade 9-12 dashboard/Edit Profile load-order checks");
