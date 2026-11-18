import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const chrome=fs.readFileSync(new URL("../assets/high-school-global-chrome-v2.js",import.meta.url),"utf8");
const forensic=fs.readFileSync(new URL("../assets/high-vnv-chrome-audit-optin.js",import.meta.url),"utf8");
const gradeProbe=fs.readFileSync(new URL("../grades/grade-09/student-profile/vnv-chrome-forensic-probe.js",import.meta.url),"utf8");

test("shared chrome skips document-wide remount cycles on front hall and student profiles",()=>{
 assert.match(chrome,/const stableFrontHall=/);
 assert.match(chrome,/const stableStudentProfile=/);
 assert.match(chrome,/const stableGradeLanding=/);
 assert.match(chrome,/const stableCourseLanding=/);
 assert.match(chrome,/!stableFrontHall && !stableStudentProfile && !stableGradeLanding && !stableCourseLanding && typeof MutationObserver/);
});
test("grade and course landing routes are excluded without changing assessment route behavior",()=>{
 const grade=new RegExp("/grades/grade-(?:09|10|11|12)/(?:index[.]html)?$","i");
 const course=new RegExp("/courses/(?:index[.]html)?$|/courses/(?:mathematics|language-arts|science|social-studies|physical-education|electives)/(?:index[.]html)?$|/courses/(?:mathematics|language-arts|science|social-studies)/[a-z0-9-]+/(?:index[.]html)?$","i");
 for(const url of [
  "/Khaemenes_High.github.io/grades/grade-09/",
  "/Khaemenes_High.github.io/grades/grade-12/index.html"
 ])assert.equal(grade.test(url),true,url);
 for(const url of [
  "/Khaemenes_High.github.io/courses/",
  "/Khaemenes_High.github.io/courses/mathematics/",
  "/Khaemenes_High.github.io/courses/mathematics/algebra-1/",
  "/Khaemenes_High.github.io/courses/language-arts/english-9/",
  "/Khaemenes_High.github.io/courses/science/integrated-science-9/",
  "/Khaemenes_High.github.io/courses/social-studies/grade-12/",
  "/Khaemenes_High.github.io/courses/physical-education/"
 ])assert.equal(course.test(url),true,url);
 assert.equal(course.test("/Khaemenes_High.github.io/courses/mathematics/algebra-1/diagnostic/"),false);
 assert.equal(course.test("/Khaemenes_High.github.io/courses/mathematics/algebra-1/units/unit-01/"),false);
 assert.match(chrome,/mountHeader\(canonicalLessonHeader\)/);
 assert.match(chrome,/mountToolbar\(\)/);
});
test("deep High School diagnostic does not repaint every mutation",()=>{
 assert.match(forensic,/if\(!panel&&!scheduled&&!closed\)/);
 assert.doesNotMatch(forensic,/requestAnimationFrame\(\(\)=>\{scheduled=false;paint\(\)\}\)\}\}/);
 assert.match(forensic,/\["Refresh snapshot",refresh\]/);
});
test("Grade 09 diagnostic is strictly opt-in and can remain dismissed",()=>{
 assert.match(gradeProbe,/params\.get\("chrome_audit"\)!=="1"/);
 assert.match(gradeProbe,/dismissed=true;panel\.remove/);
});
