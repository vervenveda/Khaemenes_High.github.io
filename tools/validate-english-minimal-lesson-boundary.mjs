import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import assert from "node:assert/strict";

const base="courses/language-arts";
const preserved={
 "9":"d1301b4cf5288e2fb0e09c2dc3b00039eb1054a3",
 "10":"525492174f33c2bb7350baf1b51ef931b478df29",
 "11":"3159009344353cfa5a07412c75a98a0f4cbbf9de",
 "12":"71294eeaa9df6512206cc8c00839b03a86e0a778"
};
const first={
 "9":"weeks/week-01/day-01/index.html",
 "10":"weeks/week-01/monday/index.html",
 "11":"weeks/week-01/lessons/day-01.html",
 "12":"weeks/week-01/lessons/day-01.html"
};
const hash=text=>{
 const data=Buffer.from(text,"utf8");
 return crypto.createHash("sha1").update(Buffer.from("blob "+data.length+"\0")).update(data).digest("hex");
};
const read=p=>fs.readFileSync(p,"utf8");
const routeSource=read("courses/shared/high-school-eight-class.js");
for(const [grade,blob] of Object.entries(preserved)){
 const dir=path.join(base,"english-"+grade),landing=read(path.join(dir,"index.html")),workspace=read(path.join(dir,"course-workspace.html"));
 assert.equal(hash(workspace),blob,"English "+grade+": intact pre-recovery workspace blob");
 assert.ok(landing.length<9000,"English "+grade+": course landing must remain minimal");
 assert.match(landing,/english-minimal-landing-v1\.css/,"English "+grade+": expected approved style");
 assert.match(landing,/english-action-grid/,"English "+grade+": centered three-button access");
 assert.doesNotMatch(landing,/<style\\b/i,"English "+grade+": no duplicate page-level CSS layer");
 assert.doesNotMatch(landing,/upper-english-records\\.js|high-school-english-continuation\\.js|assets\\/curriculum-data\\.js/,"English "+grade+": no academic engine on course introduction");
 assert.ok(landing.includes('src="../../../assets/vnv-dual-ticker-v1.js"'),"English "+grade+": shared canonical 333 and auto ticker mount");
 assert.ok(landing.includes("vnv-header-autopopulate.js"),"English "+grade+": official shared header mount");
 assert.ok(landing.includes("english-minimal-header-mount-v1.js"),"English "+grade+": header mount guard");
 assert.ok(landing.includes("english-landing-class-tools-v1.js")&&landing.includes("vnv-class-tools-toolbar.js"),"English "+grade+": lower-left shared toolbar");
 assert.ok(landing.includes("vnv-ecosystem-toolbar.js"),"English "+grade+": lower-right official ecosystem toolbar");
 assert.ok(landing.includes("vnv-language.js"),"English "+grade+": canonical translator resource");
 const nav=landing.match(/<nav class="english-action-grid"[^>]*>([\\s\\S]*?)<\\/nav>/);
 assert.ok(nav,"English "+grade+": missing access menu");
 const links=[...nav[1].matchAll(/<a\\s+href="([^"]+)"[^>]*>([^<]+)<\\/a>/g)];
 assert.deepEqual(links.map(x=>x[2]),["Learner Profile","Parent Profile","Enrollment"],"English "+grade+": exactly three required access buttons");
 assert.ok(links[0][1].includes("grades/grade-"+grade+"/student-profile/"),"English "+grade+": correct student grade");
 assert.ok(links[1][1].includes("Khaemenes_Academy.github.io/family/"),"English "+grade+": correct parent profile");
 assert.ok(links[2][1].includes("Khaemenes_Academy.github.io/family/enroll/"),"English "+grade+": correct enrollment");
 assert.ok(landing.includes("english-feature-grid"),"English "+grade+": 2x2 course-feature grid retained");
 assert.equal((landing.match(/class="english-feature"/g)||[]).length,4,"English "+grade+": exactly four feature cards");
 assert.ok(landing.includes("english-footer"),"English "+grade+": centered footer");
 assert.ok(fs.existsSync(path.join(dir,"course-workspace.html")),"English "+grade+": preserved full course workspace");
 for(let n=1;n<=36;n++){
  const week=path.join(dir,"weeks","week-"+String(n).padStart(2,"0"),"index.html");
  assert.ok(fs.existsSync(week),"English "+grade+": week "+n+" missing");
  assert.ok(read(week).length>2500,"English "+grade+": week "+n+" content unexpectedly empty");
 }
 const lesson=path.join(dir,first[grade]);
 assert.ok(fs.existsSync(lesson),"English "+grade+": first daily lesson missing");
 assert.ok(read(lesson).length>4000,"English "+grade+": first lesson lacks substantive HTML");
 assert.ok(routeSource.includes('"english-'+grade+'"')&&routeSource.includes(first[grade].replace(/index\.html$/,"")),"English "+grade+": configured first-step route absent");
 console.log("ENGLISH_COURSE_BOUNDARY_PASS",grade,"36/36 weekly pages","first lesson:",first[grade]);
}
// Day 1 presentation canary: no new engine, only semantic wayfinding.
const day1=read(path.join(base,"english-9","weeks/week-01/day-01/index.html"));
assert.ok(day1.includes('id="english9-day01-canonical-lesson-v7"'),"English 9 day 1 canonical CSS owner preserved");
assert.ok(day1.includes('id="english9-day01-layout-v7"'),"English 9 day 1 canonical layout owner preserved");
assert.ok(day1.includes('guide.id="e9-stage-guide"'),"English 9 day 1 accessible six-stage map mounted");
for(const heading of ["reasoning-lab-1","heading-1-read","heading-1-practice","daily-practice-title","heading-1-write","heading-1-check"]){
  assert.ok(day1.includes('id="'+heading+'"'),"Day 1 existing heading missing: "+heading);
  assert.ok(day1.includes('["'+heading+'"'),"Day 1 stage map missing: "+heading);
}
for(const engine of ["../../../assets/daily-lesson.js","../../../../../shared/high-school-formative-evidence-v1.js"]){
  assert.ok(day1.includes('src="'+engine+'"'),"Day 1 academic engine changed: "+engine);
}
assert.ok(day1.includes('id="daily-evidence-button" disabled'),"Day 1 evidence preparation control changed");
assert.ok(day1.includes('data-managed-save="week1"'),"Day 1 original evidence fields missing");
console.log("ENGLISH_9_DAY1_STAGE_MAP_PRESENTATION_PASS");
const registry=read("grades/grade-09/student-profile/student-course-registry.js");
assert.match(registry,/isEnglish9Landing\(last\.url\)/,"English 9: old course-home launch must not mask active lesson");
const upper=read("grades/shared/grade09-blueprint-upper-grade.js");
assert.match(upper,/snapshotIsLanding/,"English 10–12: avoid landing-page next-step snapshots");
console.log("ENGLISH_09_12_MINIMAL_LANDING_AND_LESSON_PROOF_PASS");
