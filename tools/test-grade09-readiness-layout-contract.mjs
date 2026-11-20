// Grade 09 readiness UI regression: source-only layout checks.
// Assessments, learner records and mastery are deliberately out of scope.
import assert from "node:assert/strict";
import fs from "node:fs";
const read=p=>fs.readFileSync(p,"utf8");
const sci="courses/science/integrated-science-9/diagnostic/";
const page=read(sci+"readiness-diagnostic.html");
const css=read(sci+"readiness-vnv-ka-blueprint-v1.css");
const app=read(sci+"readiness-app.js");
for(const id of ["domainLabel","questionNumber","questionPrompt","options","questionDots","previousButton","nextButton","submitButton"]){
 assert.equal(page.split('id="'+id+'"').length-1,1,"Science diagnostic ID must remain unique: "+id);
 assert.ok(app.includes('#'+id),'Science assessment script must retain selector '+id);
}
assert.ok(page.includes('<details class="science-readiness-progress"'),"Progress must be an accordion beneath Scientific Practices");
assert.ok(page.indexOf('id="domainLabel"')<page.indexOf('class="science-readiness-progress"'),"Progress follows scientific category");
assert.ok(page.indexOf('class="science-readiness-progress"')<page.indexOf('id="questionPrompt"'),"Progress precedes quiz prompt");
assert.ok(page.indexOf('class="science-readiness-progress"')<page.indexOf('id="questionDots"'),"Question dots remain in original progress owner");
assert.ok(page.indexOf('class="science-readiness-progress"')<page.indexOf('class="science-readiness-submit"'),"Submit remains outside collapsed accordion");
assert.ok(css.includes('grid-template-columns:minmax(0,1fr);justify-items:center'),"Science diagnostic must be centered in one column");
assert.ok(css.includes('color:#57401c'),"Gold category text must be dark");
assert.ok(page.includes('vnv-333-ticker.js')&&page.includes('vnv-ticker-autopopulate.js'),"Both official tickers must be preserved");
assert.ok(page.includes('readiness-routing.js')&&app.includes('READINESS_QUESTIONS'),"Readiness assessment authority must remain unchanged");
const course=read("courses/language-arts/english-9/assets/course.js");
assert.ok(course.includes('NAIB · LANGUAGE ARTS 9 ENTRY CHECK'),"English 9 needs centered VNV readiness dialog");
assert.ok(course.includes('KhaemenesEnglish9Entry'),"English 9 entry decision authority must remain intact");
assert.ok(course.includes('entryContract?.isReady?'),"English 9 mastery checks must remain intact");
for(const path of ["courses/language-arts/english-9/index.html","courses/language-arts/english-9/assessments/diagnostic/index.html"]){
 assert.ok(read(path).includes("course.js?v=20261119-english-entry-dialog-v2"),"Refreshed English entry dialog script missing: "+path);
}
console.log("PASS: Science 9 accordion, centered diagnostic, readable contrast, unique assessment controls; English 9 native readiness gate preserved");
