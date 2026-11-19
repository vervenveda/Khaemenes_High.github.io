import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const fail=[];
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const ok=(v,m)=>{if(!v)fail.push(m)};

const rel="courses/social-studies/grade-12/index.html";
const html=read(rel);
const scripts=[...html.matchAll(/<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi)].map(m=>m[1]);
const count=re=>scripts.filter(s=>re.test(s)).length;

ok((html.match(/<section\b/gi)||[]).length===3,"Grade 12 Social Studies landing must contain exactly 3 sections");
ok((html.match(/<footer\b/gi)||[]).length===1,"Grade 12 Social Studies landing must contain exactly 1 footer");
ok((html.match(/<header\b/gi)||[]).length===0,"local header markup is forbidden");
ok((html.match(/<aside\b/gi)||[]).length===0,"aside markup is forbidden");
ok((html.match(/<form\b/gi)||[]).length===0,"form markup is forbidden");
ok((html.match(/<dialog\b/gi)||[]).length===0,"dialog markup is forbidden");

ok(count(/vnv-dual-ticker-v1\.js/ )===1,"expected one canonical dual ticker");
ok(count(/vnv-header-autopopulate\.js/ )===1,"expected one official VNV header asset");
ok(count(/social-studies-minimal-header-mount-v1\.js/ )===1,"expected one Social Studies minimal header mount");
ok(count(/vnv-class-tools-toolbar\.js/ )===1,"expected one lower-left class tools toolbar");
ok(count(/vnv-ecosystem-toolbar\.js/ )===1,"expected one lower-right ecosystem toolbar");
ok(count(/vnv-language\.js/ )===1,"expected one translator engine");
ok(count(/high-school-global-chrome-v2\.js/ )===0,"retired global chrome is forbidden");

ok(!/course-entry-contract|learner-scope|monte-carlo-assessment|high-school-learning-context|high-school-assessment-adapter|high-school-root-worker-recovery|high-navigation|studentSelect|weekList|data-view|dashboard|graduation audit|thesis checkpoints|source-quality-lab|evidence-ledger/i.test(html),
  "landing page contains forbidden senior-observatory, learner-progression, or dashboard dependency");

for(const label of ["Learner Profile","Parent Profile","Enrollment"]){
  ok(html.includes(`>${label}</a>`),`missing ${label} access button`);
}
ok((html.match(/class=["']social-feature["']/g)||[]).length===4,"expected four Social Studies feature cards");
ok(/class=["']eyebrow["'][^>]*>Khaemenes Academy</i.test(html),"eyebrow must read Khaemenes Academy");
ok(/<h1[^>]*>Global Politics, International Relations &amp; Senior Research Honors<\/h1>/i.test(html),
   "primary title must be Global Politics, International Relations & Senior Research Honors");

const css=read("courses/social-studies/assets/social-studies-minimal-landing-v1.css");
ok(/\.social-hero \.eyebrow\{[^}]*font:400 33px/i.test(css),"eyebrow must be 33px");
ok(/\.social-hero h1\{[^}]*font:400 66px/i.test(css),"course title must be 66px");
ok(/\.social-hero \.descriptor\{[^}]*font:400 24px/i.test(css),"descriptor must be 24px");
ok(!/font(?:-size)?\s*:\s*(?:[0-9]|1[0-5])px/i.test(css),"learner-facing text below 16px is forbidden");

const tools=read("courses/social-studies/assets/social-studies-landing-class-tools-v1.js");
for(const label of ["Student","Classes","Schedule","Search","Translate","Parent"]){
  ok(tools.includes(`label:"${label}"`),`lower-left toolbar missing ${label}`);
}
ok(/grade-\(\?:09\|10\|11\|12\)/.test(tools),"Social Studies toolbar must recognize grades 09-12");
ok(tools.includes('grade-12')&&tools.includes('"12"'),"Social Studies toolbar must route Grade 12 correctly");
ok(tools.includes("profileBase"),"Social Studies toolbar must route through profile-centered navigation");

if(fail.length){
  console.error("\nGrade 12 Social Studies minimal landing validation failed:");
  fail.forEach(x=>console.error(" - "+x));
  process.exit(1);
}
console.log("SOCIAL_STUDIES12_MINIMAL_LANDING=PASS · senior global politics gateway, canonical tickers/header, profile-centered corner tools, 33/66/24 hero typography, no dashboard/global chrome.");
