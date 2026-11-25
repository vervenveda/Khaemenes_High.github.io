#!/usr/bin/env node
import fs from "node:fs";
import assert from "node:assert/strict";

const pages=[
 "courses/electives/index.html",
 "courses/electives/art-101/index.html",
 "courses/electives/art-201/index.html",
 "courses/electives/career-professional-studies/index.html",
 "courses/electives/computing-digital-technology/index.html",
 "courses/electives/health-wellness-human-development/index.html",
 "courses/electives/music-music-theory/index.html",
 "courses/electives/psychology-101/index.html",
 "courses/electives/world-languages-linguistics/index.html"
];
const cssPath="assets/high-school-elective-landing-contract-v1.css";
const shellPath="assets/high-department-landing-shell-v1.js";
const toolsPath="assets/high-school-subject-landing-class-tools-v1.js";

for(const page of pages){
 const html=fs.readFileSync(page,"utf8");
 const styles=[...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi)].map(m=>m[1]);
 assert.equal(styles.length,1,page+" must have exactly one page stylesheet");
 assert(styles[0].endsWith("assets/high-school-elective-landing-contract-v1.css"),page+" must use the consolidated elective stylesheet");
 assert(!html.includes("high-school-subject-landing-shell-v1.css"),page+" must not load the competing subject landing stylesheet");
 assert(!/<style[\s>]/i.test(html),page+" must not contain inline page CSS");
 assert(html.includes('data-elective-landing="v1"'),page+" missing elective landing contract");
 assert(html.includes("high-department-landing-shell-v1.js"),page+" missing canonical connectivity shell");
 assert(html.includes("high-school-elective-landing-features-v1.js"),page+" missing feature-dialog engine");
 assert.equal((html.match(/class="elective-feature"/g)||[]).length,4,page+" must have exactly four symmetrical feature cards");
 assert.equal((html.match(/class="elective-button[^"]*" href="[^"]+">(?:Learner Profile|Parent Profile|Enrollment)<\/a>/g)||[]).length,3,page+" must expose Learner, Parent, and Enrollment access");
 assert.equal((html.match(/<h2>About<\/h2>/g)||[]).length,1,page+" must have one concise About section");
 if(page==="courses/electives/index.html"){
  assert(html.includes('data-discovery-hall="true"'),"Discovery Hall contract marker missing");
  assert(!/<style[\\s>]/i.test(html),"Discovery Hall must not contain inline CSS");
  assert(html.includes("14 of 14 pathways shown"),"Discovery Hall catalog count drifted");
  assert.equal((html.match(/class="discovery-feature"/g)||[]).length,4,"Career feature grid must remain 2x2");
 }
 assert(html.includes('class="elective-breadcrumbs"'),page+" missing centered breadcrumbs");
 assert(html.includes('class="elective-footer"'),page+" missing canonical charcoal footer");
}

const css=fs.readFileSync(cssPath,"utf8");
for(const required of [
 "font-size:33px!important",
 "font-size:66px!important",
 "font-size:24px!important",
 "grid-template-columns:repeat(3,minmax(0,1fr))",
 "grid-template-columns:repeat(2,minmax(0,1fr))",
 "border-radius:7px!important",
 "font-size:14px!important",
 "#vnvClassToolsToggle",
 "#vnvEcosystemUtilityDock",
 "[data-vnv-language-slot]"
]) assert(css.includes(required),"elective CSS missing required contract token: "+required);

const shell=fs.readFileSync(shellPath,"utf8");
for(const required of [
 "vnv-333-ticker.js",
 "vnv-ticker-autopopulate.js",
 "vnv-header-autopopulate.js",
 "khaemenes-interlingual-core.js",
 "khaemenes-translator-loader.js?v=1.1.1",
 "vnv-language.js?v=20261124-header-slot",
 "vnv-class-tools-toolbar.js?v=1.6.1",
 "vnv-ecosystem-toolbar.js",
 "courses\\/electives\\/art-101",
 "courses\\/electives\\/art-201"
]) assert(shell.includes(required),"connectivity shell missing canonical component: "+required);
assert(shell.includes('document.body?.dataset.electiveLanding==="v1"'),"elective pages must suppress shell-injected competing page CSS");
assert(!shell.includes('vnv-language.js?v=20261121-half-height'),"old translator placement must not return");

const tools=fs.readFileSync(toolsPath,"utf8");
assert(tools.includes('"art-101":"Art 101"'),"Art 101 missing from left-toolbar route registry");
assert(tools.includes('"art-201":"Art 201"'),"Art 201 missing from left-toolbar route registry");
assert(tools.includes('document.body?.dataset.electiveLanding==="v1"'),"elective toolbar must preserve header translator ownership");

const psych=fs.readFileSync("courses/electives/psychology-101/index.html","utf8");
assert(psych.includes("Required Grade 9 Course · 13-Week Compact Study"),"Psychology landing must not present itself as elective choice");

const hallJs=fs.readFileSync("courses/electives/discovery-hall.js","utf8");
assert(hallJs.includes("latestResults.slice(0,4)"),"Discovery recommendations must remain even-numbered");
assert(hallJs.includes("shuffle(challenges).slice(0,4)"),"Discovery challenge grid must remain even-numbered");
console.log("PASS: the Discovery Hall and all eight elective course landings share one CSS owner and the canonical VNV ticker/header/translator/toolbars contract.");
