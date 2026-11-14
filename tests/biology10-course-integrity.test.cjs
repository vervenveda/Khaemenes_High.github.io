#!/usr/bin/env node
const fs=require("fs"),path=require("path"),vm=require("vm"),assert=require("assert/strict");
const ROOT=path.resolve(__dirname,".."),BIO=path.join(ROOT,"courses/science/biology-10");
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8"),exists=p=>fs.existsSync(path.join(ROOT,p));
const map=JSON.parse(read("courses/science/biology-10/course-map.json"));
assert.equal(map.course.duration_weeks,36);
assert.equal(map.course.daily_lesson_blocks,180);
assert.equal(map.course.passing_target,80);
assert.equal(map.weeks.length,36);
for(let w=1;w<=36;w++){
 const ww=String(w).padStart(2,"0"),week=`courses/science/biology-10/weeks/week-${ww}/index.html`;
 assert.ok(exists(week),`missing Week ${ww}`);
 const wh=read(week);
 assert.ok(wh.includes("learner-scope-v1.js"),`Week ${ww} missing learner scope`);
 assert.ok(wh.includes('data-learner-scope="biology-10"'),`Week ${ww} missing Biology scope declaration`);
 for(let d=1;d<=5;d++){
  const dd=String(d).padStart(2,"0"),lesson=`courses/science/biology-10/weeks/week-${ww}/lessons/day-${dd}.html`;
  assert.ok(exists(lesson),`missing Week ${ww} Day ${dd}`);
  assert.ok(read(lesson).includes("high-school-learning-context-v1.js"),`Week ${ww} Day ${dd} missing shared learning context`);
 }
}
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(read("courses/science/biology-10/question-bank.js"),ctx);
const bank=ctx.window.KhaemenesBiology10QuestionBank;assert.equal(bank.length,180);
for(let w=1;w<=36;w++)assert.equal(bank.filter(q=>Number(q.week)===w).length,5,`Week ${w} must have five public practice items`);
assert.equal(new Set(bank.map(q=>q.id)).size,180);
const html=read("courses/science/biology-10/index.html"),runtime=read("courses/science/biology-10/biology10-dashboard-app-v1.js");
assert.ok(html.length<50000,"Biology portal HTML should remain modular");
assert.ok(html.includes("biology10-course-data-v1.js")&&html.includes("biology10-dashboard-app-v1.js"));
assert.ok(!html.includes("const COURSE="),"giant inline course payload must not return");
assert.ok(runtime.includes("function weeklyMasteryMarkup(")&&runtime.includes("function scoreWeeklyMastery("));
assert.ok(runtime.includes("same form retained without reshuffling"));
assert.ok(!runtime.includes('id="weekMastery"'));
const shell=read("courses/science/biology-10/biology10-academy-shell-v1.js"),type=read("courses/science/biology-10/biology10-readable-type-v1.css");
for(const asset of ["vnv-333-ticker.js","vnv-ticker-autopopulate.js","vnv-header-autopopulate.js","vnv-language.js","vnv-ecosystem-toolbar.js"])assert.ok(shell.includes(asset),`shell missing ${asset}`);
assert.ok(/font-size:16px!important/.test(type),"16px readable-type floor missing");
const learner=read("courses/shared/learner-scope-v1.js"),learning=read("courses/shared/high-school-learning-context-v1.js");
assert.ok(learner.includes('"khae:bio10:w04:"'),"Week 04 lab prefix is not learner-scoped");
assert.ok(learner.includes("biology10-academy-shell-v1.js"),"week/dashboard shell autoload missing");
assert.ok(learning.includes("biology10-academy-shell-v1.js"),"daily lesson shell autoload missing");
for(const p of ["assessments/index.html","weeks/week-04/labs/enzyme-rate-studio.html","weeks/week-04/teacher/guide.html"])assert.ok(read("courses/science/biology-10/"+p).includes("biology10-academy-shell-v1.js"),`${p} missing explicit shell`);
const studios=[[21,"w21-inheritance"],[25,"w25-gene-regulation"],[28,"w28-population-genetics"],[33,"w33-population-dynamics"],[35,"w35-capstone"]];
for(const [w,id] of studios){const ww=String(w).padStart(2,"0"),p=`courses/science/biology-10/weeks/week-${ww}/labs/${id}.html`;assert.ok(exists(p),`missing ${id}`);assert.ok(read(`courses/science/biology-10/weeks/week-${ww}/index.html`).includes(`labs/${id}.html`),`Week ${ww} does not link ${id}`)}
for(const p of ["RELEASE_MATRIX.md","RELEASE_CERTIFICATION.md","STANDARDS_CROSSWALK.md","BROWSER_DEVICE_CERTIFICATION.md","assessments/SECURE_ASSESSMENT_BLUEPRINT.md"])assert.ok(exists("courses/science/biology-10/"+p),`missing governance file ${p}`);
assert.ok(read("courses/science/biology-10/README.md").includes("SOURCE-VALIDATED / CONDITIONAL"));
assert.ok(read("courses/science/biology-10/assessments/SECURE_ASSESSMENT_BLUEPRINT.md").includes("20-question randomized **Practice Midterm**"));
console.log("BIOLOGY 10 COURSE INTEGRITY: PASS · 36 weeks · 180 lessons · scored mastery · learner scope · Academy shell · modular portal · advanced studios · release governance");
