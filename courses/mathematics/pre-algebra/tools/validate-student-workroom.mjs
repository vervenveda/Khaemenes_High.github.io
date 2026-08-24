import fs from "node:fs";
import vm from "node:vm";

const root="courses/mathematics/pre-algebra";
const unit=`${root}/units/unit-01`;
const workroomPath=`${unit}/assets/student-workroom.js`;
const lessonWrapperPath=`${unit}/assets/lesson-engine.js`;
const dashboardWrapperPath=`${unit}/assets/unit-dashboard.js`;
const unitPagePath=`${unit}/index.html`;
const mapPath=`${unit}/unit-map.json`;

const read=p=>fs.readFileSync(p,"utf8");
const assert=(condition,message)=>{if(!condition)throw new Error(message)};
const workroom=read(workroomPath);
const lessonWrapper=read(lessonWrapperPath);
const dashboardWrapper=read(dashboardWrapperPath);
const unitPage=read(unitPagePath);
const map=JSON.parse(read(mapPath));

assert(Array.isArray(map.lessons)&&map.lessons.length===6,"Unit 1 must retain six canonical lessons.");
assert(Number(map.assessment?.threshold)===80||Number(map.unit?.mastery_threshold)===80,"Unit 1 mastery threshold must remain 80%.");

assert(lessonWrapper.includes("student-workroom.js"),"Every Unit 1 lesson must load the shared student workroom.");
assert(dashboardWrapper.includes("student-workroom.js"),"The Unit 1 dashboard must load the shared student workroom.");
assert(lessonWrapper.includes("sequence()"),"Lesson direct-entry sequence guard must remain active.");
assert(dashboardWrapper.includes("entrance()"),"Unit 1 readiness entrance guard must remain active.");

assert(workroom.includes("Daily Assignment"),"Student workroom must visibly identify the Daily Assignment.");
assert(workroom.includes("data-current-assignment"),"Unit dashboard must expose one state-aware current assignment CTA.");
assert(workroom.includes("min-height:66px"),"Daily Assignment CTA must remain visually dominant and touch friendly.");
assert(workroom.includes("text-align:center"),"Daily Assignment presentation must remain centered.");
assert(workroom.includes("body.student-workroom .lesson-nav{display:none!important}"),"Legacy previous/next lesson navigation must stay out of the daily workroom.");
assert(workroom.includes("Submit Daily Assignment"),"Daily workroom must include a clear submission action.");
assert(workroom.includes("Print Lesson"),"Daily workroom must retain print capability at the finish.");
assert(workroom.includes("Download Lesson Record"),"Daily workroom must retain lesson-record download capability at the finish.");

assert(workroom.includes("allLessonsMastered()&&masteryBest()>=MIN"),"Next-unit visibility must require all lesson mastery plus the unit mastery check.");
assert(workroom.includes("panel.hidden=!unitReady()"),"Locked Unit 2 progression panel must be hidden, not merely disabled.");
assert(workroom.includes("if(masteryBest()<MIN)"),"After all lessons, the mastery check must be the next required assignment.");
assert(workroom.includes("href:\"../unit-02/\""),"Unit 2 must only be produced by the mastered next-unit state.");

assert(workroom.includes("Ask Archaemenes About My Missed Problems"),"Below-mastery recovery must offer Archaemenes support.");
assert(workroom.includes("Problem ${item.number}"),"Below-mastery recovery must identify missed problems.");
assert(workroom.includes("question.explanation"),"Recovery must reuse aligned question explanations.");
assert(workroom.includes("Open Foundation Practice"),"Recovery must offer scaffolded Foundation Practice.");
assert(workroom.includes("Open Learning Arcade"),"Recovery must expose an optional learning-game doorway.");
assert(workroom.includes("Nothing ahead unlocks yet"),"Below-80 messaging must make the mastery boundary clear without exposing future work.");
assert(workroom.includes("Your earlier mastery record has not been changed"),"Incomplete resubmission must not misrepresent or overwrite an earlier score.");
assert(workroom.includes("previously demonstrated ${best}% mastery is preserved"),"Best demonstrated mastery must remain preserved across later attempts.");

assert(!/innerHTML\s*=\s*`[^`]*\$\{[^}]*location/i.test(workroom),"Do not inject raw location data into HTML.");

new vm.Script(workroom,{filename:workroomPath});
new vm.Script(lessonWrapper,{filename:lessonWrapperPath});
new vm.Script(dashboardWrapper,{filename:dashboardWrapperPath});

assert(unitPage.includes("data-mastery-gate"),"Unit 1 must retain its canonical progression gate for the workroom to control.");

console.log("PASS: Pre-Algebra Unit 1 daily workroom, 80% progression visibility, and recovery contract validated.");
