import fs from "node:fs";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import vm from "node:vm";

const base="courses/language-arts/";
const cssPath=base+"assets/english-readiness-ui-v1.css";
const css=fs.readFileSync(cssPath,"utf8");
const blob=text=>{
  const buffer=Buffer.from(text,"utf8");
  return crypto.createHash("sha1").update(Buffer.from("blob "+buffer.length+"\0")).update(buffer).digest("hex");
};
const originalDiagnosticBlobs={
  "9":"8844759ae97857f9117ab62b9c6a24e871ad4757",
  "10":"430fda49a6c751e3adf3df91bca1eccade0bde9c",
  "11":"8a1be64b53f0d8fc9fdea0313ef77ffafa7a8048",
  "12":"dd26e349f76b5404e32578a80a16aedf9ef48e38"
};
const originalDashboardBlobs={
  "10":"525492174f33c2bb7350baf1b51ef931b478df29",
  "11":"3159009344353cfa5a07412c75a98a0f4cbbf9de",
  "12":"71294eeaa9df6512206cc8c00839b03a86e0a778"
};
const oneLink=(href)=>'<link rel="stylesheet" href="'+href+'?v=1.0.0" data-ka-english-readiness-ui="v1">\n';
assert.ok(css.length>5000,"Shared stylesheet is incomplete");
assert.match(css,/body > \.english9-entry-gate/,"Grade 9 readiness gate must retain scoped styles");
assert.match(css,/body\[data-english-readiness-grade\]/,"All four diagnostic pages must share styles");
assert.match(css,/z-index:2147479000/,"Canonical chrome remains higher than readiness card");
assert.match(css,/border-radius:7px/,"VNV 7px radius preserved");
assert.match(css,/16px/,"VNV minimum text size preserved");
assert.doesNotMatch(css,/display:\s*none!important[^}]*vnv(?:333NetworkTicker|TickerAutoPopulate|HeaderAutoPopulate)/i,"Do not hide global chrome");
let checked=0;
for(const grade of ["9","10","11","12"]){
  const folder=base+"english-"+grade+"/";
  const diagnostic=fs.readFileSync(folder+"assessments/diagnostic/index.html","utf8");
  const diagLink=oneLink("../../../assets/english-readiness-ui-v1.css");
  assert.equal(diagnostic.split(diagLink).length-1,1,"English "+grade+" diagnostic must load one shared stylesheet");
  assert.ok(diagnostic.includes('<body data-english-readiness-grade="'+grade+'"'),"English "+grade+" diagnostic not scoped");
  const original=diagnostic.replace(diagLink,"").replace(' data-english-readiness-grade="'+grade+'"',"");
  assert.equal(blob(original),originalDiagnosticBlobs[grade],"English "+grade+" diagnostic assessment content changed unexpectedly");
  assert.ok(diagnostic.includes("diagnostic"),"English "+grade+" diagnostic identity missing");
  const dashboard=fs.readFileSync(folder+"index.html","utf8");
  const entryLink=oneLink("../assets/english-readiness-ui-v1.css");
  assert.equal(dashboard.split(entryLink).length-1,1,"English "+grade+" dashboard requires one shared stylesheet");
  if(grade==="9"){
    assert.ok(dashboard.includes('id="khaemenes-english9-canonical-css-v2"'),"Grade 9 existing page CSS preserved for the remaining dashboard");
    assert.ok(dashboard.includes('id="english9ChromeAnchor" data-khae-header'),"Grade 9 canonical chrome anchor missing");
    assert.ok(!dashboard.includes("/* English 9 readiness presentation:"),"Grade 9 duplicate readiness inline CSS remains");
    const gate=fs.readFileSync(folder+"assets/course.js","utf8");
    assert.ok(gate.includes('readiness.overall_percent>=80'),"Grade 9 mastery threshold changed");
    assert.ok(gate.includes('dashboard.inert=true'),"Grade 9 readiness protection changed");
    assert.ok(gate.includes('english9-entry-card'),"Grade 9 named readiness card missing");
    new vm.Script(gate,{filename:"english9-course.js"});
  } else {
    const headerMount=dashboard.match(/  <!-- Canonical VNV header only;[\s\S]*?  <\/script>/);
    assert.ok(headerMount,"English "+grade+" must use canonical VNV header rather than retired regulator");
    const anchor='<body>\n<!-- Canonical top ticker anchor, placed above legacy dashboard content. -->\n<div data-khae-header hidden aria-hidden="true"></div>';
    assert.ok(dashboard.includes(anchor),"English "+grade+" needs a ticker-first chrome mount point");
    const deprecated='high-school-'+'global-chrome-v2.js';
    const originalLoader='  <script src="/Khaemenes_High.github.io/assets/'+deprecated+'" defer data-high-school-global-chrome="v2"></script>';
    const previous=dashboard.replace(entryLink,"").replace(headerMount[0],originalLoader).replace(anchor,"<body>");
    assert.equal(blob(previous),originalDashboardBlobs[grade],"English "+grade+" instructional dashboard unexpectedly rewritten outside controlled chrome and CSS");
    assert.ok(dashboard.includes('data-retired-course-header="true" hidden'),"Grade "+grade+" existing course body architecture changed");
    assert.ok(dashboard.includes("vnv-header-autopopulate.js"),"Grade "+grade+" official VNV header script absent");
  }
  checked++;
  console.log("ENGLISH_READINESS_REGRESSION_SOURCE_PASS Grade",grade,"assessment-byte-identity=PASS","stylesheet=shared");
}
console.log("ENGLISH_09_12_SHARED_READINESS_CSS_PASS",checked,"grades; diagnostic bytes protected");
