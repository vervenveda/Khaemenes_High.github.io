/* Science 9 Unit 00 source-level visual/academic contract regression.
 * Run: node --test courses/science/integrated-science-9/diagnostic/tests/unit00-lesson-blueprint.test.cjs
 * These tests do NOT simulate browser rendering or certify runtime persistence.
 */
"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const count=(s,re)=>(s.match(re)||[]).length;
for(let n=1;n<=5;n++){
 const day=String(n).padStart(2,"0");
 test("Science 9 Unit 00 Day "+day+" Academy lesson source contract",()=>{
  const html=read("lessons/day-"+day+".html");
  assert.match(html,/class="ka-science9-lesson"/);
  assert.match(html,/data-ka-lesson-standard="v1"/);
  assert.match(html,/khaemenes-lesson-standard-v1\.css/);
  assert.match(html,/lesson-vnv-ka-blueprint-v1\.css/);
  assert.match(html,/class="academy-eyebrow">Khaemenes Academy/);
  assert.doesNotMatch(html,/<header class="site-header">/);
  assert.doesNotMatch(html,/id="khaemenes-typography-standard"/);
  assert.equal(count(html,/vnv-header-autopopulate\.js/g),1);
  assert.equal(count(html,/vnv-333-ticker\.js/g),1);
  assert.equal(count(html,/vnv-ticker-autopopulate\.js/g),1);
  assert.equal(count(html,/vnv-ecosystem-toolbar\.js/g),1);
  assert.equal(count(html,/unit00-lesson-workspace-v1\.js/g),1);
  assert.equal(count(html,/id="themeToggle"/g),1);
  assert.match(html,/src="\.\.\/unit00\.js"/);
  assert.match(html,/high-school-learning-context-v1\.js/);
  assert.match(html,/high-school-formative-evidence-v1\.js/);
  assert.match(html,new RegExp('data-page-complete="day'+day+'"'));
  assert.match(html,/id="printPage"/);
  assert.ok(html.indexOf('class="course-breadcrumb"')<html.indexOf('<main id="main">'),"breadcrumbs below header, outside main");
  assert.ok(count(html,/class="response-lines"/g)>0,"written evidence prompts preserved");
 });
}
test("shared lesson typography, contrast and workspace stylesheet",()=>{
 const css=read("lesson-vnv-ka-blueprint-v1.css");
 for(const part of ["body.ka-science9-lesson","clamp(24px,2.5vw,33px)","text-align:center!important","background:#202724!important","ka-science-workspace","@media print"])assert.ok(css.includes(part),part);
});
test("workspaces save by learner identity and lesson path; no score changes",()=>{
 const code=read("unit00-lesson-workspace-v1.js");
 for(const part of ["KhaemenesHighLearningContext","learnerId","location.pathname","localStorage.setItem","Save response","Not saved: select an Academy learner"])assert.ok(code.includes(part),part);
 assert.doesNotMatch(code,/completedPages|mastered|recordAssessment|lessonScores/);
});
test("Unit 00 completion engine remains separately owned",()=>{
 const engine=read("unit00.js");
 assert.match(engine,/data-page-complete/);
 assert.match(engine,/const REQUIREMENTS = \["day01","day02","day03","day04","day05"/);
 assert.match(engine,/const KEY = "khaemenes_science_u00_v1"/);
});
