"use strict";
/* Synthetic/source regression; run node --test grades/tests/high-profile-editor-dialog-identity.test.cjs */
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),dir=path.join(root,"grade-09/student-profile");
const get=n=>fs.readFileSync(path.join(dir,n),"utf8");
const photo=get("student-profile-photo.js"),bg=get("student-profile-background.js"),
 form=get("profile/index.html");
test("photo dialog closes if selected learner changed",()=>{
 assert.ok(photo.includes("let dialogOwner=null"));
 assert.ok(photo.includes("popup.open&&learner()!==dialogOwner"));
 assert.ok(photo.includes('window.addEventListener("khaemenes-family-changed",closeForLearnerSwitch)'));
});
test("background dialog closes and clears upload when learner changes",()=>{
 assert.ok(bg.includes("let dialogOwner=null"));
 assert.ok(bg.includes("popup.open&&(!dialogOwner||person()!==dialogOwner)"));
 assert.ok(bg.includes('upload.input.value=""'));
 assert.ok(bg.includes('window.addEventListener("khaemenes-family-changed",closeOnIdentityChange)'));
});
test("individual background actions never write to a guest record",()=>{
 for(const check of [
  "if(!owner||owner!==currentOwner){refresh()",
  "write(sectionsKey(owner),JSON.stringify(sectionPrefs))",
  "write(colorsKey(owner),pageColorControl.input.value)",
  "erase(colorsKey(owner))",
  "write(stickerKey(owner),value)",
  "erase(imageKey(owner))",
  "upload.input.disabled=!owner"
 ])assert.ok(bg.includes(check),check);
});
test("Grade 09 profile form refuses wrong grade or unscoped storage writes",()=>{
 assert.ok(form.includes('activeForGrade?.("09")'));
 assert.ok(form.includes("const ownerKey=profileKey()"));
 assert.ok(form.includes("if(!ownerKey||activeLearner()?.learnerId!==loadedOwner"));
 assert.ok(form.includes("function profileKey(){const learner=activeLearner();return learner?"));
 assert.ok(!form.includes("encodeURIComponent(learner.learnerId)}`:BASE_KEY"));
});
test("form refreshes from selection changes without deleting records",()=>{
 for(const event of ["khaemenes-family-changed","pageshow","storage"])
  assert.ok(form.includes("addEventListener('"+event+"'"));
 assert.ok(!/clearAllProfiles|deleteStudentRecords/.test(form));
});
