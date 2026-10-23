import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const visual="assets/math-course-visual-unifier.css";
const visualText=fs.readFileSync(visual,"utf8");
assert.ok(visualText.includes("Khaemenes Mathematics visual continuity"));
assert.ok(!/@import|https?:\/\/|localStorage|sessionStorage|fetch\s*\(/i.test(visualText),"visual layer is standalone, dependency-free and presentation-only");
for(const selector of [".unit-grid",".lesson-grid",".lesson-layout",".lesson-side",".hero",".card",":focus-visible"]){
 assert.ok(visualText.includes(selector),"missing layout/accessibility rule: "+selector);
}
for(const size of [900,680])assert.ok(visualText.includes("@media(max-width:"+size+"px)"),"mobile breakpoint "+size);
assert.ok(visualText.includes("@media print"),"print appearance preserved");
assert.ok(visualText.includes("border-radius:7px"),"consistent card corner radius");
assert.ok(visualText.includes("Brandon Grotesque"),"consistent body typography");
assert.ok(visualText.includes("Cinzel"),"consistent display typography");
assert.ok(visualText.includes("prefers-reduced-motion"),"reduced-motion accessible");
assert.ok(/:is\(details\)\s*>\s*summary\s*\{[^}]*min-height:44px/s.test(visualText),"accessible disclosure touch targets must be at least 44px");

const normalize=(cssFile,href)=>path.posix.normalize(path.posix.join(path.posix.dirname(cssFile),href.split(/[?#]/)[0]));
let sheetsChecked=0,pagesChecked=0;
for(const course of ["algebra-1","geometry","algebra-2"]){
 const root="courses/mathematics/"+course+"/";
 const courseCSS=root+"assets/styles.css";
 const styles=fs.readFileSync(courseCSS,"utf8");
 const asset="../".repeat(4)+"assets/math-course-visual-unifier.css";
 assert.ok(styles.includes("math-course-visual-unifier.css"),course+" shared visual missing");
 const match=styles.match(/@import url\("([^"]*math-course-visual-unifier\.css[^"]*)"\);/);
 assert.ok(match,course+" must import shared CSS");
 assert.equal(normalize(courseCSS,match[1]),visual,course+" shared visual import is an invalid relative URL");
 sheetsChecked++;
 const landing=fs.readFileSync(root+"index.html","utf8");
 assert.ok(landing.includes('data-theme="light"'),course+" landing should open in parchment mode");
 assert.ok(landing.includes('width=device-width'),"responsive viewport "+course);
 assert.ok(landing.includes('data-vervenveda-parchment'),"existing parchment link preserved "+course);
 assert.ok(landing.includes("khaemenes-typography-standard"),"existing type hierarchy preserved "+course);
 assert.ok(landing.includes("shared/course-entry-contract.js"),"course gate preserved "+course);
 assert.ok(landing.includes("shared/learner-scope-v1.js"),"learner scope preserved "+course);
 if(course==="algebra-1")assert.ok(landing.includes('href="../../../assets/math-course-visual-unifier.css?v=20261013"'),"Algebra I self-contained landing needs visual style link");
 else assert.ok(landing.includes('meta name="theme-color" content="#f4f0e7"'),"parchment browser chrome "+course);
 pagesChecked++;
 for(let i=1;i<=13;i++){
  const unit=String(i).padStart(2,"0");
  const p=root+"units/unit-"+unit+"/index.html";
  assert.ok(fs.existsSync(p),"unit overview missing "+p);
  const html=fs.readFileSync(p,"utf8");
  assert.ok(html.includes("khaemenes-typography-standard"),"unit heading font contract "+p);
  assert.ok(html.includes("viewport"),"mobile unit overview "+p);
  if(course==="algebra-1"&&i<=9){
   const css=root+"units/unit-"+unit+"/assets/unit"+unit+".css";
   assert.ok(fs.existsSync(css),"legacy Algebra I CSS missing "+css);
   const unitSheet=fs.readFileSync(css,"utf8");
   const importMatch=unitSheet.match(/@import url\("([^"]*math-course-visual-unifier\.css[^"]*)"\);/);
   assert.ok(importMatch,"shared visual not imported by "+css);
   assert.equal(normalize(css,importMatch[1]),visual,"wrong import path in "+css);
   // Confirm the light visual layer is followed by the established dashboard and
   // an explicit contrast-safe dark bridge; a mere @import is not a visual fix.
   const imports=[...unitSheet.matchAll(/@import\s+url\("([^"]+)"\);/g)].map(x=>x[1]);
   assert.equal(imports.length,4,"unit should have four local design imports: "+css);
   const expectedOrder=[
     "../../../../../../assets/math-course-visual-unifier.css?v=20261013",
     "../../../assets/algebra1-student-experience-v2.css",
     "../../../assets/algebra1-dark-dashboard-v1.css",
     "../../../assets/algebra1-dark-visual-bridge-v1.css"
   ];
   assert.deepEqual(imports,expectedOrder,"import order must preserve Algebra I dark-dashboard appearance: "+css);
   for(const href of imports)assert.ok(fs.existsSync(normalize(css,href)),"broken CSS dependency "+css+" -> "+href);
   assert.ok(unitSheet.includes('@media(max-width:800px)'),"existing responsive cards must remain "+css);
   assert.ok(unitSheet.includes("@media print"),"print behavior must remain "+css);
   assert.ok(html.includes("assets/unit"+unit+".css"),"unit page references its locally styled unit CSS");
   sheetsChecked++;
  }else{
   assert.ok(html.includes(course==="algebra-1"?"../../assets/styles.css":"../../assets/styles.css"),
    "unit page should inherit current course stylesheet: "+p);
  }
  pagesChecked++;
 }
}
// Shared parchment rules contain important light surfaces, so Algebra I needs an
// explicit contrast bridge to preserve the established dark mathematics dashboard.
const darkBridge=fs.readFileSync("courses/mathematics/algebra-1/assets/algebra1-dark-visual-bridge-v1.css","utf8");
const dashboard=fs.readFileSync("courses/mathematics/algebra-1/assets/algebra1-dark-dashboard-v1.css","utf8");
for(const token of ["color-scheme:dark!important","--math-visual-paper:var(--a1-panel",
  "--math-visual-ground:var(--a1-paper","--math-visual-ink:var(--a1-ink",
  "--math-visual-muted:var(--a1-muted","--math-focus-ring:",
  "@media screen","@media(max-width:360px)","@media print"]){
 assert.ok(darkBridge.includes(token),"Algebra I dark visual bridge is missing "+token);
}
for(const selector of [".snapshot",".nav,.actions",".btn,button,input,select,textarea"]){
 assert.ok(darkBridge.includes(selector),"small-screen rule missing "+selector);
}
for(const contract of ["--a1-paper:#07111d","--a1-panel:#101f31","--a1-ink:#f5f1e8"]){
 assert.ok(dashboard.includes(contract),"existing dark dashboard palette missing "+contract);
}
assert.ok(!/<script|localStorage|sessionStorage|fetch\s*\(|https?:\/\//i.test(darkBridge),
  "dark bridge must be presentation-only and dependency-free");

// New stylesheet must also be installed for offline use, not merely fetched on demand.
const sw=fs.readFileSync("service-worker.js","utf8");
const expectedRequest='./assets/math-course-visual-unifier.css?v=20261013';
assert.ok(sw.includes(expectedRequest),"shared visual file absent from service-worker installation bundle");
assert.ok(sw.includes("COURSE_VISUAL_FILES"),"offline visual dependency must be explicit");
assert.ok(sw.includes("...COURSE_VISUAL_FILES]),")||
 sw.includes("...COURSE_VISUAL_FILES])"),"offline visual file must be installed atomically");
assert.ok(sw.includes("GAME_PRECACHE_FILES"),"canonical mathematics games remain installed");
console.log("PASS: mathematics visual continuity: three course entrances, 39 unit entry pages, "+
 sheetsChecked+" connected stylesheets, preserved Algebra I dark dashboard, consistent 7px cards, mobile/print/keyboard/reduced-motion contracts, offline CSS and preserved learner gates.");
