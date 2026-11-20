import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const check=(ok,msg)=>{if(!ok)throw Error("STUDENT PORTFOLIO regression: "+msg)};
const grade09=read("grades/grade-09/student-profile/dashboard-layout.js");
const upper=read("grades/shared/grade09-blueprint-upper-grade.js");
check(grade09.includes('{label:"Student Portfolio",href:"../../../portfolio/index.html?grade=09"}'),"Grade 09 toolbar routes directly to the workspace");
check(upper.includes('{label:"Student Portfolio",url:highRoot+"portfolio/index.html?grade="+grade}'),"Grade 10–12 toolbar routes to the same grade-scoped workspace");
for(const grade of ["09","10","11","12"]){
 const p="grades/grade-"+grade+"/student-profile/index.html",s=read(p);
 check(s.includes('href="../../../portfolio/index.html?grade='+grade+'"'),p+" visible portfolio card route");
}
const page=read("portfolio/index.html");
const css=read("portfolio/portfolio-studio.css");
const enhancer=read("portfolio/portfolio-workspace.js");
const review=read("portfolio/review.html");
check(page.includes('<h1>Student Portfolio</h1>'),"actual portfolio title");
check(!page.includes("<style>"),"single portfolio presentation stylesheet; no competing inline style");
check(page.includes('href="portfolio-studio.css?v=88d03432"'),"existing canonical portfolio CSS owner");
check((page.match(/data-portfolio-subject=/g)||[]).length===4,"four functional quick-start categories");
check(page.includes('id="addEvidence"')&&page.includes('id="savedWork"')&&page.includes('id="portfolioBackup"'),"evidence, saved work and backup sections");
check(page.includes('khae-learning-portfolio-v1:learner:'),"existing learner-scoped storage authority");
check(page.includes('schema:"khae-learning-portfolio-v1"'),"existing export schema unchanged");
check(page.includes('data.entries.every(valid)'),"existing import validation unchanged");
check(page.includes('key+":previous"'),"existing rollback copy retained");
check(page.includes('href="review.html"')&&review.includes("does not upload the file"),"read-only explicit file review");
check(enhancer.includes('[data-portfolio-subject]')&&enhancer.includes('subject.value=chosen'),"quick-start buttons prepare existing form");
check(enhancer.includes('new MutationObserver(update)'),"saved-work search refresh continues to track entries");
check(css.includes("--cream:#fffdf5")&&css.includes("--paper:#eee5d4"),"crisp VNV ivory and parchment palette");
check(css.includes(".panel{background:var(--card);border:3px solid var(--ink)"),"3px charcoal card borders");
check(css.includes(".portfolio-quick-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))"),"balanced 2×2 quick starts");
for(const v of [...css.matchAll(/border-radius:\s*([^;}]+)/g)])check(v[1].trim()==="7px","every portfolio corner is 7px: "+v[1]);
for(const name of ["vnv-333-ticker.js","vnv-ticker-autopopulate.js","vnv-header-autopopulate.js","vnv-class-tools-toolbar.js","vnv-ecosystem-toolbar.js","vnv-language.js"])
 check(page.split(name).length===2,"one canonical VNV loader "+name);
check(page.includes('data-vct-language-panel'),"translator housed in official lower-left toolbar");
check(page.includes('portfolioToolbarGrade')&&page.includes('"../grades/grade-"+portfolioToolbarGrade'),"lower-left Profile link respects registered grade");
for(const [label,code] of [["portfolio-enhancer",enhancer],["grade-09-toolbar",grade09],["upper-grade-toolbar",upper]])new vm.Script(code,{filename:label});
for(const [i,match] of [...page.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)].entries()){
 if(match[1].trim())new vm.Script(match[1],{filename:"portfolio-inline-"+i});
}
const academic=read("portfolio/portfolio-academic-report.js");
check(page.includes('id="homeschoolReport"'),"homeschool academic report section present");
check(page.includes('id="homeschoolReportBody"'),"course report mount present");
for(const action of ["refreshReport","printReport","exportReport"])
 check(page.includes('id="'+action+'"'),"report action "+action);
check(page.includes("khaemenes-learning-continuation.js"),"Academy continuation ledger loaded");
check(page.includes("high-school-course-pins.js")&&page.includes("high-school-eight-class.js")&&page.includes("high-school-profile-grade-context.js"),"shared course and identity authorities reused");
check(page.includes("portfolio-academic-report.js"),"read-only academic report engine loaded");
check(academic.includes("getLedger()?.readLearner?.(user.id)"),"dynamic learner-scoped academic evidence read");
check(academic.includes('gradeContext?.active?.()')&&academic.includes('pinApi?.activeLearner?.()'),"three-way learner and grade check");
check(academic.includes('["quiz","test"].includes(a.kind)'),"score types are explicit assessed items");
check(academic.includes('Number.isFinite(a.earned)')&&academic.includes('Number.isFinite(a.possible)'),"require real scored points");
check(academic.includes("Midterm")&&academic.includes("Final")&&academic.includes("Other test"),"quiz midterm final test classifications");
check(academic.includes('officialFinalGrade:null,creditAwarded:null'),"final transcript grade and credit never invented");
check(academic.includes('attendanceHours:"Not supplied"')&&academic.includes('daysOfInstruction:"Not supplied"'),"attendance and hours never fabricated");
check(academic.includes('portfolioEvidenceCount:evidenceCount(user)'),"student-authored portfolio evidence count included");
check(academic.includes('reportType:"evidence-summary-not-certified-transcript"'),"academic report clearly preliminary");
check(css.includes(".portfolio-report-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))"),"balanced course report grid");
check(css.includes("body.portfolio-report-print .portfolio-main> :not(#homeschoolReport)"),"report-only printable layout");
new vm.Script(academic,{filename:"portfolio-academic-report.js"});
console.log("STUDENT PORTFOLIO & HOMESCHOOL PROGRESS: PASS (all four profile buttons, single workspace, scoped evidence, VNV tools, forms, backup/review).");
