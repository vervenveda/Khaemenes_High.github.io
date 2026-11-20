/* Static acceptance contract for standalone Schedule pages; no learner data. */
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const check=(ok,label)=>{if(!ok)throw Error("Schedule regression: "+label)};
const js=read("grades/shared/high-school-schedule-page.js");
const css=read("grades/shared/high-school-schedule-page.css");
check(js.includes("KhaemenesLearningContinuation")||js.includes("LearningContinuation"),"course evidence authority");
check(js.includes("readLearner"),"real learner continuation");
check(js.includes("progress?.percent"),"completion evidence source");
check(js.includes('["quiz","test"]'),"graded assessment evidence source");
check(js.includes("Not yet reported")||css.includes("Not yet reported"),"missing evidence is not zero");
check(js.includes("g9.resolveContinueFor"),"freshman course-owned routing");
check(js.includes("FIRST_STEPS"),"instructional first-step route fallback");
check(js.includes("writePins"),"canonical shared pin controller");
check(!js.includes("showModal("),"no schedule modal");
check(css.includes("repeat(4,minmax(0,1fr))"),"balanced four column desktop grid");
check(css.includes("repeat(2,minmax(0,1fr))"),"tablet grid");
for(const grade of ["09","10","11","12"]){
 const p="grades/grade-"+grade+"/student-profile/schedule/index.html",s=read(p);
 check(s.includes('<body data-grade="'+grade+'">'),p+" grade bound");
 check(s.includes('href="../">Back to Profile'),p+" back route");
 check(s.includes('id="scheduleGrid"'),p+" schedule mount");
 check(s.includes('id="averageCompletion"')&&s.includes('id="averageGrades"'),p+" progress indicators");
 check(s.includes("high-school-schedule-page.js")&&s.includes("high-school-schedule-page.css"),p+" canonical owners");
 check(!s.includes("<dialog")&&!s.includes("showModal("),p+" has no popup");
 check(s.split('>Back to Profile</a>').length===2,p+" exactly one back button");
 for(const file of ["vnv-333-ticker.js","vnv-ticker-autopopulate.js","vnv-header-autopopulate.js","vnv-class-tools-toolbar.js","vnv-ecosystem-toolbar.js","vnv-language.js"]){
  check(s.split(file).length===2,p+" canonical singleton "+file);
 }
 check(s.includes("id=\"vnv-schedule-tools-config\""),p+" gateway tools configuration");
 check(s.includes("data-vct-language-panel"),p+" translator inside canonical left toolbar");
 for(const label of ["Learner Profile","Parent Profile","Enrollment"])
  check(s.includes(">"+label+"</a>"),p+" "+label+" doorway");
 check((s.match(/class="schedule-feature"/g)||[]).length===4,p+" even 2x2 features");
}
const g9=read("grades/grade-09/student-profile/dashboard-layout.js");
const upper=read("grades/shared/grade09-blueprint-upper-grade.js");
check(g9.includes('{label:"Schedule",href:"schedule/"}'),"Grade 9 toolbar uses page link");
check(upper.includes('{label:"Schedule",url:highRoot+"grades/grade-"+grade+"/student-profile/schedule/"}'),"upper grade toolbar uses grade page links");
check(css.includes("--parchment:#eee5d4")&&css.includes("--cream:#fffdf5")&&css.includes("--ink:#243038"),"VNV charcoal cream parchment palette");
check(!css.includes("border-radius:14px"),"7px corners only");
check(css.includes(".schedule-card{background:var(--cream);border:3px solid var(--ink)"),"3px charcoal class-card border");
check(css.includes(".schedule-stat,.schedule-feature{background:var(--cream);border:3px solid var(--ink)"),"3px charcoal stat and feature-card borders");
check(css.includes("padding:7px 14px;border:3px solid var(--ink);border-radius:7px"),"3px charcoal button border and 7px radius");
check(js.includes('card.append(title);'),"class title first in DOM");
check(!js.includes('(i+1)+". "+item.label'),"no repeated numbered subject label");
check(js.includes('if(category&&name&&category!==name&&!name.includes(category))'),"nonredundant subject labels only");
console.log("STANDALONE SCHEDULE: PASS (Grades 09–12, canonical gateway tools, core features, route/page, graphs, pins and scroll ownership source checks).");
