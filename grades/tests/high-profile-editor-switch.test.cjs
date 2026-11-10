"use strict";
/* Synthetic/source-only High School editor and parent-return checks.
 * Run: node --test grades/tests/high-profile-editor-switch.test.cjs
 * Does not open learner storage or modify production.
 */
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),editor=path.join(root,"grade-09/student-profile");
const source=name=>fs.readFileSync(path.join(editor,name),"utf8");
const photo=source("student-profile-photo.js"),background=source("student-profile-background.js"),
 preferences=source("student-profile-preferences.js"),details=source("student-profile-details.js");
const profile=fs.readFileSync(path.join(editor,"profile/index.html"),"utf8");
test("picture editor requires family-verified, grade-verified learner",()=>{
 assert.ok(photo.includes("activeForGrade?.(pageGrade||\"09\")"));
 assert.ok(photo.includes("if(!registered)return null"));
 assert.ok(photo.includes("if(learner()!==owner)return;\n    localStorage.setItem(keyFor(owner),data)"));
});
test("background save and upload verify same learner, no guest main save",()=>{
 assert.ok(background.includes("activeForGrade?.(pageGrade||\"09\")"));
 assert.ok(background.includes('if(!owner){message("Choose your registered learner to save personal backgrounds.");return}'));
 assert.ok(background.includes("if(!owner||person()!==owner||currentOwner!==owner)"));
 assert.ok(background.includes("khaemenes-family-changed"));
});
test("unselected learner has no unscoped preferences key",()=>{
 assert.ok(preferences.includes(":null}"));
 assert.ok(preferences.includes("if(!ownerKey)return {...DEFAULT}"));
 assert.ok(preferences.includes("if(!ownerKey||activeLearner()!==owner)return false"));
});
test("details require matching grade/family context",()=>{
 assert.ok(details.includes("activeForGrade?.(pageGrade)"));
 assert.ok(details.includes("validated.learnerId!==id"));
});
test("Grade 09 separate profile editor loads verified context before preferences",()=>{
 const shared=profile.indexOf("high-school-profile-grade-context.js"),prefs=profile.indexOf("student-profile-preferences.js");
 assert.ok(shared>0&&prefs>shared);
});
for(const grade of ["09","10","11","12"]){
 test("Grade "+grade+" profile has visible return route to family hub",()=>{
  const html=fs.readFileSync(path.join(root,"grade-"+grade,"student-profile/index.html"),"utf8");
  assert.ok(html.includes('<a class="grade09-profile-action" href="https://vervenveda.com/Khaemenes_Academy.github.io/family/">Family Portal</a>'));
 });
}
