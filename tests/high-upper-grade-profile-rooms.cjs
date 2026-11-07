#!/usr/bin/env node
"use strict";
/* Source-level safety contract for dedicated Grade 11/12 profile rooms.
 * No learner records, browser storage or live endpoints are accessed.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const rooms=["daily-lessons","grades","games","settings"];
const boundary=read("grades/shared/high-profile-room-boundary.js");
new vm.Script(boundary,{filename:"high-profile-room-boundary.js"});
assert.match(boundary,/content\.replaceChildren\(\)/);
assert.match(boundary,/khaemenes-family-changed/);
assert.match(boundary,/gradeNumber===pageGrade/);
let checked=0;
for(const grade of ["11","12"]){
 const dashboard=read("grades/grade-"+grade+"/student-profile/index.html");
 const editor=read("grades/grade-"+grade+"/student-profile/profile/index.html");
 for(const room of rooms){
  const folder="grades/grade-"+grade+"/student-profile/"+room+"/";
  const html=read(folder+"index.html");
  assert.match(html,new RegExp('data-grade="'+grade+'"'),folder+" grade");
  assert.match(html,new RegExp('ctx\\?\\.grade==="'+grade+'"'),folder+" registered grade context");
  assert.match(html,new RegExp('catalog\\.slots\\('+grade+'\\)'),folder+" correct grade catalog");
  assert.match(html,new RegExp('g'+grade+'RoomContent'),folder+" independently-owned content");
  assert.match(html,/high-profile-room-boundary\.js/,folder+" switch boundary");
  assert.match(html,/KhaemenesStudentProfileV2/,folder+" canonical profile");
  assert.match(html,/high-school-eight-class\.js/,folder+" canonical courses");
  assert.match(html,/vnv-ecosystem-toolbar\.js/,folder+" official dock");
  assert.match(html,/vnv-333-ticker\.js/,folder+" canonical ticker");
  assert.match(html,/vnv-ticker-autopopulate\.js/,folder+" page ticker");
  assert.doesNotMatch(html,/Grade 10|grade10|g10Room/,folder+" cloned source not grade-scoped");
  assert.match(dashboard,new RegExp('href="'+room+'/"'),folder+" dashboard doorway");
  assert.match(html,new RegExp('href="../'+room+'/"'),folder+" internal room navigation");
  assert.match(editor,new RegExp('href="../'+room+'/"'),folder+" profile editor shortcut") ;
  const all=html.split("<script").slice(1).filter(part=>!part.slice(0,part.indexOf(">")).includes("src=")).map(part=>part.slice(part.indexOf(">")+1,part.indexOf("</script>")));
  assert.ok(all.length>=1,folder+" inline code");
  all.forEach((item,i)=>new vm.Script(item,{filename:folder+"inline-"+i}));
  if(room==="grades"){
   assert.match(html,/Not an official transcript/);
   assert.match(html,/readLearner/);
  }
  if(room==="settings")assert.match(html,/It was not delivered to a parent or server/);
  if(room==="daily-lessons"){
   assert.match(html,new RegExp("khaemenes-grade"+grade+"-today-habits-v1"),folder+" shares the ten-activity dashboard store");
   assert.match(html,/const tasks=\[/,folder+" ten daily tasks");
   assert.match(html,/\["bedtime","Evening wash-up & bedtime"/,folder+" ten tasks finish at bedtime");
   assert.match(html,/of 10 personal activities checked/,folder+" ten-activity count");
  }
  checked++;
 }
}
console.log("PASS "+checked+" Grade 11/12 student rooms: local destinations, grade-scoped source, learner boundary, canonical chrome, inline JavaScript parsing.");
