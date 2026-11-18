import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const chrome=fs.readFileSync(new URL("../assets/high-school-global-chrome-v2.js",import.meta.url),"utf8");
const forensic=fs.readFileSync(new URL("../assets/high-vnv-chrome-audit-optin.js",import.meta.url),"utf8");
const gradeProbe=fs.readFileSync(new URL("../grades/grade-09/student-profile/vnv-chrome-forensic-probe.js",import.meta.url),"utf8");

test("shared chrome skips document-wide remount cycles on front hall and student profiles",()=>{
 assert.match(chrome,/const stableFrontHall=/);
 assert.match(chrome,/const stableStudentProfile=/);
 assert.match(chrome,/!stableFrontHall && !stableStudentProfile && typeof MutationObserver/);
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
