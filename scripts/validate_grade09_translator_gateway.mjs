import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import vm from "node:vm";
const pages=[
"grades/grade-09/index.html","grades/grade-09/student-profile/index.html",
"grades/grade-09/student-profile/profile/index.html","grades/grade-09/student-profile/daily-lessons/index.html",
"courses/mathematics/pre-algebra/index.html","courses/mathematics/algebra-1/index.html",
"courses/language-arts/english-9/index.html","courses/social-studies/grade-09/index.html",
"courses/science/integrated-science-9/index.html","courses/physical-education/index.html",
"electives/grades/grade-09/psych-101/index.html"
];
const translator="assets/vnv-language.js";
assert.ok(fs.existsSync(translator));
const script=fs.readFileSync(translator,"utf8");
new vm.Script(script);
assert.match(script,/availableLanguages/);
assert.match(script,/Khaemenes|VNVLanguage/);
for(const page of pages){
 const html=fs.readFileSync(page,"utf8");
 const match=html.match(/<script src="([^"]*vnv-language\.js)" defer data-official-vnv-language="true"><\/script>/);
 assert.ok(match,page+" missing official translator");
 assert.equal(path.normalize(path.join(path.dirname(page),match[1])),translator,page+" points to wrong translation file");
}
console.log("PASS official Verve N Veda translation engine paths in "+pages.length+" Grade 9 gateways");
