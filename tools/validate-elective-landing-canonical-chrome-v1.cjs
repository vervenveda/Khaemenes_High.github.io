#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const pages=[
"career-professional-studies","computing-digital-technology","fine-arts-visual-studio",
"health-wellness-human-development","music-music-theory","psychology-101","world-languages-linguistics"
].map(id=>"courses/electives/"+id+"/index.html");
const shell=read("assets/high-department-landing-shell-v1.js");
const css=read("assets/high-school-elective-landing-contract-v1.css");
const tools=read("assets/high-school-subject-landing-class-tools-v1.js");
for(const token of [
"vnv-333-ticker.js","vnv-ticker-autopopulate.js","vnv-header-autopopulate.js",
"khaemenes-campus-phrases.js","khaemenes-interlingual-core.js","khaemenes-translator-loader.js",
"vnv-language.js","vnv-class-tools-toolbar.js?v=1.6.1","vnv-ecosystem-toolbar.js"
])assert(shell.includes(token),"Canonical shell missing "+token);
assert(shell.includes('title:"Khaemenes Academy"'),"Official header title drift");
assert(shell.includes('width:72px!important')&&shell.includes('height:44px!important'),"Lower-left toolbar control geometry drift");
assert(tools.includes("career-professional-studies")&&tools.includes("psychology-101"),"Universal class tools do not match elective landings");
for(const token of ["font-size:33px!important","font-size:66px!important","font-size:24px!important","font-size:14px!important","border-radius:7px","grid-template-columns:repeat(2","font:400 16px"])
 assert(css.includes(token),"Landing body contract missing "+token);
for(const p of pages){
 const html=read(p);
 for(const token of [
  'data-high-subject-shell="true"','data-elective-landing="v1"',
  'high-school-subject-landing-shell-v1.css','high-school-elective-landing-contract-v1.css',
  'high-department-landing-shell-v1.js','high-school-elective-landing-features-v1.js',
  'class="elective-breadcrumbs"','class="elective-hero"','class="elective-academy">Khaemenes Academy',
  '>Learner Profile<','>Parent Profile<','>Enrollment<','>About<','>Course Features<','class="elective-footer"'
 ])assert(html.includes(token),p+" missing "+token);
 assert.equal((html.match(/data-elective-feature-open=/g)||[]).length,4,p+" must have exactly four popup feature cards");
 assert.equal((html.match(/class="elective-feature"/g)||[]).length,4,p+" feature grid drift");
 assert(!/khaemenes-global-header\.js|vnv-ecosystem-menu\.js|khaemenes-landing-toolbar\.js|data-khae-header|khae-global-campus-header/.test(html),p+" still contains competing legacy chrome");
 assert(!/font-size\s*:\s*(?:[0-9]|1[0-5])px/i.test(html),p+" contains page-local font below 16px");
 assert(html.indexOf('class="elective-breadcrumbs"')<html.indexOf("<main"),p+" breadcrumb must sit directly before main content");
}
console.log("PASS elective landing canonical chrome: 7 pages · exact VNV ticker/header/translator/toolbars · 33/66/24 hero · 3 access buttons · About · 2x2 feature popups · 7px geometry · 14px footer · no competing legacy chrome.");
