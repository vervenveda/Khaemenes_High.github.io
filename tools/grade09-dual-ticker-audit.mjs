#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const WRITE=process.argv.includes("--write");
const CHECK=process.argv.includes("--check") || !WRITE;
const GUARD_SRC="/Khaemenes_High.github.io/assets/vnv-dual-ticker-v1.js";
const GUARD_TAG='  <script src="'+GUARD_SRC+'" defer data-grade09-dual-ticker="true"></script>\n';

const norm=p=>p.split(path.sep).join("/");
const walk=dir=>{
  const out=[];
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if([".git","node_modules"].includes(entry.name))continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())out.push(...walk(full));
    else out.push(norm(path.relative(ROOT,full)));
  }
  return out;
};

function isGrade09CourseHtml(file){
  if(!/\.html?$/i.test(file))return false;
  return (
    file.startsWith("grades/grade-09/") ||
    file.startsWith("courses/language-arts/english-9/") ||
    file==="courses/language-arts/grades/grade-09/language-arts/index.html" ||
    file.startsWith("courses/mathematics/pre-algebra/") ||
    file.startsWith("courses/mathematics/algebra-1/") ||
    file.startsWith("courses/science/integrated-science-9/") ||
    file.startsWith("courses/social-studies/grade-09/") ||
    file.startsWith("electives/grades/grade-09/psych-101/") ||
    file==="courses/physical-education/grade-09-week-01-assessments.html"
  );
}

function isPublicLanding(file){
  if(!isGrade09CourseHtml(file))return false;
  if(!/(^|\/)index\.html$/i.test(file))return false;

  // Non-public / print / lesson execution surfaces are intentionally not treated
  // as landing pages. They remain in the inventory below.
  if(/\/teacher(?:\/|$)/i.test(file))return false;
  if(/\/worksheets\/index\.html$/i.test(file))return false;
  if(/\/weeks\/week-\d+\/day-\d+\/index\.html$/i.test(file))return false;

  return true;
}

function effectiveCoverage(source){
  const direct333=/vnv-333-ticker\.js|vnv333NetworkTicker/i.test(source);
  const directAuto=/vnv-ticker-autopopulate\.js|vnvTickerAutoPopulate/i.test(source);
  const directGuard=/vnv-dual-ticker-v1\.js/i.test(source);
  const sharedNav=/high-navigation-v1\.js/i.test(source);
  return {
    direct333,directAuto,directGuard,sharedNav,
    covered:(direct333&&directAuto)||directGuard||sharedNav
  };
}

function inject(source){
  if(/vnv-dual-ticker-v1\.js/i.test(source))return source;
  if(/<\/head>/i.test(source))return source.replace(/<\/head>/i,GUARD_TAG+"</head>");
  if(/<body\b/i.test(source))return source.replace(/<body\b/i,GUARD_TAG+"<body");
  return GUARD_TAG+source;
}

const all=walk(ROOT);
const html=all.filter(isGrade09CourseHtml).sort();
const landing=html.filter(isPublicLanding);
const nonLanding=html.filter(f=>!isPublicLanding(f));
const rows=[];
let repaired=0;

for(const file of landing){
  const abs=path.join(ROOT,file);
  let source=fs.readFileSync(abs,"utf8");
  let state=effectiveCoverage(source);
  const before=state.covered;
  if(!before && WRITE){
    source=inject(source);
    fs.writeFileSync(abs,source);
    repaired++;
    state=effectiveCoverage(source);
  }
  rows.push({file,before,after:state.covered,...state});
}

const missing=rows.filter(r=>!r.after);
const summary={
  mode:WRITE?"write":"check",
  grade09HtmlFiles:html.length,
  publicLandingPages:landing.length,
  nonLandingHtmlFiles:nonLanding.length,
  initiallyCovered:rows.filter(r=>r.before).length,
  repaired,
  remainingMissing:missing.length
};

console.log("GRADE 09 HTML INVENTORY");
console.log(JSON.stringify(summary,null,2));
if(nonLanding.length){
  console.log("\nINVENTORIED NON-LANDING HTML ("+nonLanding.length+")");
  for(const f of nonLanding)console.log("  "+f);
}
console.log("\nPUBLIC LANDING PAGE COVERAGE ("+landing.length+")");
for(const r of rows){
  console.log((r.after?"PASS ":"MISS ")+r.file+
    " · 333="+(r.direct333?"direct":"guard")+
    " · auto="+(r.directAuto?"direct":"guard")+
    (r.sharedNav?" · shared-nav":"")+
    (r.directGuard?" · direct-guard":""));
}

if(missing.length){
  console.error("\nGRADE 09 LANDING PAGES WITHOUT EFFECTIVE 333 + AutoPopulate COVERAGE:");
  for(const r of missing)console.error("  "+r.file);
  if(CHECK)process.exitCode=1;
}
