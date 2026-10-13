import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";

const pages={
 english:"courses/language-arts/english-9/index.html",
 science:"courses/science/integrated-science-9/index.html"
};
const cssFile="assets/grade09-subject-parchment.css";
const css=fs.readFileSync(cssFile,"utf8");
const htmls=Object.fromEntries(Object.entries(pages).map(([name,file])=>[name,fs.readFileSync(file,"utf8")]));
const report=[];
for(const [name,file] of Object.entries(pages)){
 const html=htmls[name];
 const bodyMarker=name==="english"?"data-english9-require-entry":"data-science9-require-entry";
 const expectedHref="../../../assets/grade09-subject-parchment.css?v=20261013";
 assert.equal((html.match(/data-grade09-consistency/g)||[]).length,1,name+" stylesheet loaded once");
 assert.ok(html.includes(bodyMarker),name+" profile gate remains in place");
 assert.ok(html.indexOf('data-vervenveda-parchment')<html.indexOf('data-grade09-consistency'),
  name+" subject styling follows global parchment");
 assert.ok(html.indexOf('data-grade09-consistency')<html.indexOf("</head>"),name+" stylesheet is not inserted into the lesson runtime");
 assert.ok(fs.existsSync(path.posix.normalize(path.posix.join(path.posix.dirname(file),expectedHref.split("?")[0]))),
  name+" CSS path resolves");
 assert.ok(html.includes('width=device-width'),name+" remains viewport-responsive");
 assert.ok(html.includes('class="sidebar"')&&html.includes('class="main"'),name+" learning layout retained");
 assert.ok(html.includes('id="content"'),name+" student content landmark retained");
 assert.ok(html.includes('data-view="dashboard"'),name+" dashboard remains available");
 assert.ok(html.includes('data-view="reports"'),name+" learner reports and backups remain available");
 assert.ok(html.includes('data-view="week"'),name+" weekly lessons remain available");
 assert.ok(html.includes('id="studentSelect"'),name+" learner selector not removed");
 const scripts=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(x=>x.trim());
 assert.ok(scripts.length>0,name+" retains inline course code");
 for(const [i,script] of scripts.entries())new vm.Script(script,{filename:file+"#script-"+i});
 assert.ok(!html.includes('src="https://cdn.'),name+" introduces no remote runtime scripts");
 report.push(name+" HTML + JS syntax/structure");
}
assert.match(htmls.english,/href="#content"/,"English 9 skip navigation retained");
assert.match(htmls.english,/class="navBox" aria-label="Student destinations"/,"English core links labeled");
assert.match(htmls.english,/data-view="course"/,"Official English weeks retained");
assert.match(htmls.english,/class="unit-picker"/,"English unit-picker must remain in existing JS");
assert.match(htmls.english,/aria-pressed",active\?"true":"false"/,"English navigation speaks selected state");
assert.match(htmls.english,/function renderAll\(\)/,"English 9 learner views not removed");

assert.match(htmls.science,/<html data-theme="light" lang="en">/,"Science first paint is parchment");
assert.match(htmls.science,/function blankState\(\)\{return \{students:\[\],activeId:null,theme:"light"\}\}/,"Science default student state uses light");
assert.match(htmls.science,/class="grade9-skip-link" href="#content"/,"Science skip link is present");
assert.match(htmls.science,/<section id="content" tabindex="-1" aria-label="Student science workspace">/,"Science workspace is a focus target");
assert.match(htmls.science,/<nav class="sideBox" aria-label="Science 9 course navigation">/,"Science sidebar navigation labeled");
assert.match(htmls.science,/<nav class="tabs noPrint" aria-label="Science 9 workspace tabs">/,"Science tabs navigation labeled");
assert.match(htmls.science,/function renderNav\(\).*setAttribute\("aria-pressed",active\?"true":"false"\)/,"Science selected tab accessible");
assert.match(htmls.science,/state\.theme=state\.theme==="dark"\?"light":"dark"/,"Preserve existing science theme preference format");
assert.match(htmls.science,/state\.theme=state\.theme==="dark"\?"light":"dark";applyReadingContrast\(\);save\(\)/,
 "Science theme toggle still saves to the existing profile");
assert.match(htmls.science,/const applyReadingContrast=\(\)=>\{/,"Science contrast render helper exists");
assert.match(htmls.science,/data-view="assessments"/,"Science assessments remain accessible");
assert.match(htmls.science,/function renderAll\(\)/,"Science course records still render");

const logic=htmls.science.match(/const applyReadingContrast=\(\)=>\{[\s\S]*?\};/)?.[0];
assert.ok(logic,"Science theme control parser");
const controls={textContent:"",attributes:{},setAttribute(key,value){this.attributes[key]=value;}};
const state={theme:"light"};
const doc={documentElement:{dataset:{theme:""}}};
const ctx=vm.createContext({state,document:doc,$:()=>controls});
vm.runInContext(logic+";globalThis.checkContrast=applyReadingContrast;",ctx);
ctx.checkContrast();
assert.equal(doc.documentElement.dataset.theme,"light");
assert.equal(controls.textContent,"Higher contrast");
assert.equal(controls.attributes["aria-pressed"],"false");
state.theme="dark";
ctx.checkContrast();
assert.equal(doc.documentElement.dataset.theme,"dark");
assert.equal(controls.textContent,"Standard contrast");
assert.equal(controls.attributes["aria-pressed"],"true");
report.push("Science standard/high-contrast preference and accessible toggle");

assert.ok(css.includes("body:is([data-english9-require-entry],[data-science9-require-entry])"),
 "Shared CSS only targets specified grade 9 portals");
for(const selector of ["--g9-paper: #fffefa","--g9-bg: #f4f0e7","--g9-text: #20241f",
 "html:root:root[data-theme=\"dark\"]","--g9-bg: #e9e0d1",
 "font-family: \"Brandon Grotesque\"","border-radius: 7px","@media (max-width: 960px)",
 "@media (max-width: 560px)","@media (prefers-reduced-motion: reduce)","@media print",
 ".grade9-skip-link:focus-visible",":focus-visible"]){
 assert.ok(css.includes(selector),"Visual CSS missing required standard "+selector);
}
assert.ok(!/https?:\/\//.test(css),"No external styles, fonts, network or tracking added");
assert.ok(!/\b(localStorage|sessionStorage|fetch|XMLHttpRequest)\b/.test(css),"Styles do not handle student records");
assert.ok(!css.includes("background: #0d111a")&&!css.includes("background: #07121c"),"No dark background resurfaced");
let nesting=0;
for(const ch of css){if(ch==="{")nesting++;if(ch==="}")nesting--;assert.ok(nesting>=0,"CSS brace balance");}
assert.equal(nesting,0,"CSS braces balanced");
assert.ok(css.includes("min-height: 44px"),"Touch targets retained");
report.push("Parchment surfaces, accessible focus, responsive grids, print and reduced motion");
console.log("PASS: Issue 5 Grade 9 portal consistency: "+report.join("; ")+". No learner record schemas changed.");
