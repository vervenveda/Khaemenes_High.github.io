import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
let failed=false;
const ok=(v,m)=>{if(v)console.log("OK "+m);else{failed=true;console.error("FAIL "+m)}};

const catalog=read("courses/shared/high-school-eight-class.js");
ok(catalog.includes("const FIRST_STEPS=Object.freeze"),"shared eight-class catalog owns canonical first instructional steps");
for(const id of ["pre-algebra","algebra-1","geometry","algebra-2","english-9","english-10","english-11","english-12","integrated-science-9","biology-10","chemistry-11","physics-engineering-12","global-studies-9","social-studies-10","social-studies-11","social-studies-12","psychology-101"]){
 ok(catalog.includes('"'+id+'":'),"first-step route exists for "+id);
}
ok(catalog.includes("firstStepHref:id?FIRST_STEPS[id]||meta?.href||null:null"),"slots expose firstStepHref with doorway fallback");

const upper=read("grades/shared/grade09-blueprint-upper-grade.js");
ok(upper.includes("const current=step(item);"),"upper-grade Schedule resolves through learner continuation");
ok(upper.includes("const courseHome=href(item),first=item.firstStepHref||courseHome;")&&upper.includes("const current=step(item);"),"upper-grade Schedule resolves a validated learner step with first instructional fallback");
ok(!upper.includes('const route=href(item);\n   if(route)card.append(link((grade10Copy||grade11Copy||grade12Copy)?"Continue Class"'),"raw landing-page Schedule route is retired");

for(const grade of ["10","11","12"]){
 const classes=read(`grades/grade-${grade}/student-profile/grade${grade}-profile-classes.js`);
 ok(classes.includes("continuation=window.KhaemenesLearningContinuation"),`Grade ${grade} profile class cards read learner continuation`);
 ok(classes.includes("snap?.nextHref||slot.firstStepHref||slot.href"),`Grade ${grade} profile class cards prefer continuation then first step`);
 const daily=read(`grades/grade-${grade}/student-profile/daily-lessons/index.html`);
 ok(daily.includes("continuation=window.KhaemenesLearningContinuation"),`Grade ${grade} Daily Lessons reads learner continuation`);
 ok(daily.includes("url(snap?.nextHref)||url(slot.firstStepHref)||url(slot.href)"),`Grade ${grade} Daily Lessons prefers continuation then first step`);
}

const grade9=read("grades/grade-09/student-profile/student-course-registry.js");
ok(grade9.includes("window.KhaemenesHighEightClass?.FIRST_STEPS?.[course.id]"),"Grade 9 generic class continuation uses shared first-step catalog");
ok(grade9.includes('FIRST_STEPS?.["pre-algebra"]'),"Grade 9 Pre-Algebra fallback begins at readiness instead of course landing");
ok(grade9.includes("if(!hasDiagnosticEvidence()&&!hasAlgebraCourseEvidence())")&&grade9.includes("units/unit-01/lessons/lesson-01-algebraic-habits-notation-mathematical-argument.html"),"Grade 9 Algebra I readiness must advance to the exact first instructional lesson");

if(failed)process.exit(1);
console.log("\nPASS High School Student Profile class continuation routing.");
