import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const root="grades/grade-09/student-profile/";
const read=p=>fs.readFileSync(p,"utf8");
const registry=read(root+"student-course-registry.js");
const schedule=read(root+"seven-class-schedule.js");
const profile=read(root+"profile/index.html"),daily=read(root+"daily-lessons/index.html");
new vm.Script(registry);new vm.Script(schedule);
for(const [label,source] of [["student profile",profile],["daily lessons",daily]]){
 assert.match(source,/id="grade09SevenClassSchedule"/,label+" missing seven-class mount");
 assert.match(source,/seven-class-schedule\.js/,label+" missing schedule renderer");
}
const required=["english-9","global-studies-9","integrated-science-9","physical-education-9","psychology-101"];
for(const id of required)assert.ok(registry.includes('id:"'+id+'"'),"Missing course registry entry: "+id);
for(const id of required)assert.ok(schedule.includes('"'+id+'"'),"Missing schedule period: "+id);
assert.match(schedule,/registry\.setMathPathway\(math\.value,\{pin:true\}\)/,"Math pathway must synchronize pins");
assert.match(schedule,/pins\.writeLanguageChoices\(choices\)/,"Language choice must persist through learner-scoped pins");
assert.match(schedule,/registry\.setPinned\(old,false\);registry\.setPinned\(next,true\)/,"Pinned language must switch without duplicates");
assert.equal((schedule.match(/\["(?:Mathematics|Literature|Social Studies|Science|Physical Education|Foreign Language|Psychology)"/g)||[]).length,7);
for(const target of ["courses/physical-education/index.html","courses/language-arts/english-9/index.html","courses/science/integrated-science-9/index.html","courses/social-studies/grade-09/index.html","electives/grades/grade-09/psych-101/index.html"])assert.ok(fs.existsSync(target),"Missing local subject door: "+target);
const firstRoutes=[...schedule.matchAll(/"((?:pre-algebra|algebra-1|english-9|global-studies-9|integrated-science-9|physical-education-9|psychology-101))":"([^"]+)"/g)];
assert.equal(firstRoutes.length,7,"Expected seven first-week mathematics/subject routes");
for(const [,id,route] of firstRoutes){const file=route.split("?")[0];assert.ok(fs.existsSync(file+"index.html")||fs.existsSync(file),"Missing first-week route "+id+": "+route)}
assert.match(schedule,/physical-education\/\?start=grade09-week01/,"PE should link to Grade 9 Week 01 teaching");
assert.match(read("courses/physical-education/index.html"),/start"\)=== "grade09-week01"|start"\)==="grade09-week01"/,"PE should honor Week 01 deep link after instruction loads");
const pins=read("courses/shared/high-school-course-pins.js");
assert.match(pins,/scopedKey\(base,id=activeLearner\(\)\)/,"Pins must be scoped to an active registered learner");
assert.match(pins,/readLanguageChoices\(\)/,"Language selection must use scoped pin storage");
assert.match(schedule,/Pin all seven classes/,"Student must have one-click schedule setup");
assert.match(schedule,/registry\.setPinned\(id,true\)/,"Seven-class setup must use the existing learner-scoped pin registry");
assert.match(schedule,/successful===7/,"Schedule setup must report incomplete saves honestly");
const expectedLanguages=["spanish","french","german","mandarin","japanese","arabic","russian"];
for(const code of expectedLanguages)assert.ok(schedule.includes(code+':"'),"Missing verified "+code+" lesson entrance");
assert.match(schedule,/function languageStart\(id\)/,"Missing selected-language route");
assert.match(schedule,/const target=languageStart\(id\)/,"Selected language needs a distinct starting link");
console.log("PASS Grade 09 seven-class schedule: profile, daily room, pin sync, language selection and local entrances");
