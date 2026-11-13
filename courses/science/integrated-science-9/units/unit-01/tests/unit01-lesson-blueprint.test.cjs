/* Unit 01 Academy lesson contract regression — source checks, not runtime certification.
 * Execute: node --test courses/science/integrated-science-9/units/unit-01/tests/unit01-lesson-blueprint.test.cjs
 */
"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const base=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(base,p),"utf8");
const count=(s,p)=>(s.match(p)||[]).length;
const stageIds=["prepare","learn","deepen","reflect"];
const expectedSectionCounts=[12,11,11,12,14,12,15,14,14,13];
const expectedResponseCounts=[7,5,8,5,5,4,7,5,5,4];
for(let n=1;n<=10;n++){
 const day=String(n).padStart(2,"0");
 test("Unit 01 Day "+day+" full Academy four-stage lesson contract",()=>{
  const html=read("lessons/day-"+day+".html");
  assert.match(html,/data-ka-lesson-standard="v1"/);
  assert.match(html,/class="ka-science9-lesson ka-science9-unit01-lesson"/);
  assert.match(html,/unit01-lesson-vnv-ka-blueprint-v1\.css/);
  assert.match(html,/khaemenes-lesson-standard-v1\.css/);
  assert.doesNotMatch(html,/<header class="site-header">/);
  assert.doesNotMatch(html,/id="khaemenes-typography-standard"/);
  assert.equal(count(html,/vnv-header-autopopulate\.js/g),1);
  assert.equal(count(html,/vnv-333-ticker\.js/g),1);
  assert.equal(count(html,/vnv-ticker-autopopulate\.js/g),1);
  assert.equal(count(html,/vnv-ecosystem-toolbar\.js/g),1);
  assert.equal(count(html,/id="themeToggle"/g),1);
  assert.equal(count(html,/class="ka-lesson-roadmap"/g),1);
  for(const id of stageIds){
   assert.equal(count(html,new RegExp('id="ka-stage-'+id+'"','g')),1);
   assert.match(html,new RegExp('href="#ka-stage-'+id+'"'));
  }
  assert.equal(count(html,/<section class="lesson-section">/g),expectedSectionCounts[n-1]);
  assert.equal(count(html,/class="response-lines"/g),expectedResponseCounts[n-1]);
  assert.match(html,/src="\.\.\/unit01\.js"/);
  assert.match(html,/high-school-learning-context-v1\.js/);
  assert.match(html,/high-school-formative-evidence-v1\.js/);
  assert.match(html,new RegExp('data-page-complete="day'+day+'"'));
  assert.match(html,/id="printPage"/);
  assert.ok(html.indexOf('class="course-breadcrumb"')<html.indexOf('<main id="main">'));
 });
}
test("Unit 01 specialist lesson CSS is scoped and protects print identification",()=>{
 const css=read("unit01-lesson-vnv-ka-blueprint-v1.css");
 for(const token of ["ka-science9-unit01-lesson","science-evidence-heading","@media print","ka-science9-lesson"])
  assert.ok(css.includes(token),token);
});
