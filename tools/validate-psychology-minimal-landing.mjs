import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const fail=[];
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const ok=(v,m)=>{if(!v)fail.push(m)};

const html=read("electives/psychology/index.html");
const scripts=[...html.matchAll(/<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi)].map(m=>m[1]);
const count=re=>scripts.filter(s=>re.test(s)).length;

ok((html.match(/<section\b/gi)||[]).length===3,"Psychology landing must contain exactly 3 sections");
ok((html.match(/<footer\b/gi)||[]).length===1,"Psychology landing must contain exactly 1 footer");
ok((html.match(/<dialog\b/gi)||[]).length===1,"Psychology landing must contain exactly 1 course information dialog");
ok((html.match(/class=["']psych-card["']/g)||[]).length===4,"Psychology landing must show exactly 4 course cards");
ok((html.match(/data-course=/g)||[]).length===4,"Each Psychology course card must expose a course-information action");

for(const course of ["101","102","201","202"]){
  ok(html.includes(`Psychology ${course}`),`missing Psychology ${course} card`);
}
ok(html.includes('../grades/grade-09/psych-101/'),"Psychology 101 must route to the existing Grade 9 course");
for(const course of ["102","201","202"]){
  ok(html.includes(`"${course}"`) && html.includes("Under Construction"),`Psychology ${course} must remain visibly under construction`);
}

ok(count(/vnv-dual-ticker-v1\.js/ )===1,"expected one canonical dual ticker");
ok(count(/vnv-header-autopopulate\.js/ )===1,"expected one official VNV header asset");
ok(count(/psychology-minimal-header-mount-v1\.js/ )===1,"expected one Psychology minimal header mount");
ok(count(/vnv-class-tools-toolbar\.js/ )===1,"expected one lower-left class tools toolbar");
ok(count(/vnv-ecosystem-toolbar\.js/ )===1,"expected one lower-right ecosystem toolbar");
ok(count(/vnv-language\.js/ )===1,"expected one translator engine");
ok(count(/high-school-global-chrome-v2\.js/ )===0,"retired global chrome is forbidden");

const css=read("electives/psychology/assets/psychology-minimal-landing-v1.css");
ok(/\.psych-hero \.eyebrow\{[^}]*font:400 33px/i.test(css),"eyebrow must be 33px");
ok(/\.psych-hero h1\{[^}]*font:400 66px/i.test(css),"Psychology title must be 66px");
ok(/\.psych-hero \.descriptor\{[^}]*font:400 24px/i.test(css),"descriptor must be 24px");
ok(!/font(?:-size)?\s*:\s*(?:[0-9]|1[0-5])px/i.test(css),"learner-facing text below 16px is forbidden");

const tools=read("electives/psychology/assets/psychology-landing-class-tools-v1.js");
for(const label of ["Student","Courses","Search","Translate","Parent","Enroll"]){
  ok(tools.includes(`label:"${label}"`),`Psychology toolbar missing ${label}`);
}
ok(tools.includes("data-vct-translator-panel"),"translator must open inside the lower-left toolbar");

if(fail.length){
 console.error("\nPsychology landing validation failed:");
 fail.forEach(x=>console.error(" - "+x));
 process.exit(1);
}
console.log("PSYCHOLOGY_MINIMAL_LANDING=PASS · four-course pathway gateway, Psychology 101 live, 102/201/202 construction placeholders, VNV dialog, canonical chrome.");
