/* Unit landing-page source regression for Academy canonical chrome.
 * Run from repository root:
 * node --test courses/science/integrated-science-9/units/tests/unit-index-chrome-contract.test.cjs
 * Source tests only; runtime/visual certification remains separate.
 */
"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const count=(text,pattern)=>(text.match(pattern)||[]).length;
for(let n=1;n<=12;n++){
 const unit=String(n).padStart(2,"0");
 test("Science 9 Unit "+unit+" official Academy chrome",()=>{
  const html=fs.readFileSync(path.join(root,"unit-"+unit,"index.html"),"utf8");
  assert.match(html,/class="[^"]*ka-science-unit-index/);
  assert.match(html,/unit-index-vnv-ka-blueprint-v1\.css/);
  assert.match(html,/khaemenes-lesson-standard-v1\.css/);
  assert.doesNotMatch(html,/<header class="site-header">/);
  assert.doesNotMatch(html,/id="khaemenes-typography-standard"/);
  assert.doesNotMatch(html,/class="science-unit-nav"/);
  assert.equal(count(html,/vnv-header-autopopulate\.js/g),1);
  assert.equal(count(html,/vnv-333-ticker\.js/g),1);
  assert.equal(count(html,/vnv-ticker-autopopulate\.js/g),1);
  assert.equal(count(html,/vnv-ecosystem-toolbar\.js/g),1);
  assert.equal(count(html,/id="themeToggle"/g),1);
  assert.match(html,/class="ka-unit-section-links"/);
  assert.match(html,/class="course-breadcrumb"/);
  assert.match(html,/id="learning-sequence"/);
  assert.match(html,/id="required-applications"/);
  assert.match(html,new RegExp("unit"+unit+"\\.js"));
  assert.match(html,/<footer\b/);
 });
}
test("shared unit index presentation has responsive and readable canonical chrome",()=>{
 const css=fs.readFileSync(path.join(root,"unit-index-vnv-ka-blueprint-v1.css"),"utf8");
 for(const token of ["CANONICAL HEADER FOREGROUND GUARD","-webkit-text-fill-color:#fff8e9!important","body.ka-science-unit-index","ka-unit-section-links","@media(max-width:800px)","@media print"])
  assert.ok(css.includes(token),token);
});
