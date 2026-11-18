import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const root = new URL("../grades/grade-09/student-profile/",import.meta.url);
const dashboard = fs.readFileSync(new URL("index.html",root),"utf8");
const profile = fs.readFileSync(new URL("profile/index.html",root),"utf8");
const probe = fs.readFileSync(new URL("vnv-chrome-forensic-probe.js",root),"utf8");

test("Dashboard and Edit Profile each load exactly one shared opt-in diagnostic",()=>{
 for(const [page,markup,relative] of [
   ["Dashboard",dashboard,"vnv-chrome-forensic-probe.js"],
   ["Edit Profile",profile,"../vnv-chrome-forensic-probe.js"]
 ]){
   assert.equal(markup.split(relative).length-1,1,page+" diagnostic reference count");
 }
});
test("Diagnostic is inert except for explicit chrome_audit=1",()=>{
 assert.match(probe,/params\.get\("chrome_audit"\)!=="1"/);
 assert.match(probe,/if\(params\.get\("chrome_audit"\)!=="1"\|\|window\.KhaemenesGrade09ChromeAudit\)return;/);
 assert.match(probe,/window\.KhaemenesGrade09ChromeAudit=Object\.freeze/);
});
test("Probe captures chrome and runtime errors without reading learner data",()=>{
 for(const marker of ["vnv333NetworkTicker","vnvTickerAutoPopulate","vnvHeaderAutoPopulate","vnvEnrichedMenuOverlay","MutationObserver","unhandledrejection","SCRIPT LOAD ERROR"]){
   assert.ok(probe.includes(marker),marker);
 }
 for(const forbidden of ["localStorage","sessionStorage","document.cookie","fetch(","sendBeacon(","XMLHttpRequest","learnerId","family_registry"]){
   assert.ok(!probe.includes(forbidden),"Forbidden user-data or network capability: "+forbidden);
 }
});
test("Close diagnostics does not reopen on subsequent observed mutations",()=>{
 assert.match(probe,/dismissed=true;panel\.remove\(\)/);
 assert.match(probe,/function display\(\)\{\s*if\(dismissed\)return;/);
 assert.match(probe,/font:400 16px/);
});
