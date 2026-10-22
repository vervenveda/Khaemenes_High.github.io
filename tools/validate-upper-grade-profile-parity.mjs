import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const failures=[];
const expect=(value,message)=>{if(!value)failures.push(message)};

const shared=read("grades/shared/upper-grade-seven-class.js");
const css=read("grades/shared/upper-grade-profile.css");
const pins=read("courses/shared/high-school-course-pins.js");
const grade9Quick=read("grades/grade-09/student-profile/student-quick-pins.js");
const grade9Grades=read("grades/grade-09/student-profile/grades/index.html");

for(const token of [
  "KhaemenesLearningContinuation","KhaemenesStudentProfileV2","migrateLegacyPins",
  "Learning Today","world-language-10","world-language-11","world-language-12",
  "algebra-1","geometry","algebra-2","khaemenes-student-quick-pins-changed"
])expect(shared.includes(token),"shared upper-grade profile engine contains "+token);

for(const token of [
  "english-10","english-11","english-12","social-studies-10","social-studies-11","social-studies-12",
  "biology-10","chemistry-11","physics-engineering-12","physical-education-10","physical-education-11","physical-education-12",
  "elective-10","elective-11","elective-12"
])expect(pins.includes('"'+token+'"'),"High School pin metadata registers "+token);

expect(css.includes("@media(max-width:520px)"),"upper-grade profile has narrow mobile layout");
expect(css.includes("font-weight:500"),"upper-grade profile avoids bulky bold typography");

for(const grade of ["10","11","12"]){
  const html=read("grades/grade-"+grade+"/student-profile/index.html");
  expect(html.includes('data-grade="'+grade+'"'),"Grade "+grade+" profile declares its grade");
  expect(html.includes("../../shared/upper-grade-profile.css"),"Grade "+grade+" loads shared profile CSS");
  expect(html.includes("khaemenes-learning-continuation.js"),"Grade "+grade+" loads continuation contract");
  expect(html.includes("khaemenes-student-profile-v2.js"),"Grade "+grade+" loads Academy profile contract");
  expect(html.includes("khaemenes-student-quick-pins-v1.js"),"Grade "+grade+" loads Academy Quick Pins");
  expect(html.includes("khaemenes-student-workspace-v2.js"),"Grade "+grade+" loads workspace preferences");
  expect(html.includes("upper-grade-seven-class.js"),"Grade "+grade+" uses shared learner engine");
  expect(html.includes("vnv-language.js"),"Grade "+grade+" keeps official translator");
}

expect(grade9Quick.includes("KhaemenesStudentQuickPinsV1"),"Grade 09 Quick Pins bridge to canonical Academy store");
for(const label of ["Mathematics","Language Arts","Social Studies","Science","Physical Education","World Language","Psychology / Elective"]){
  expect(grade9Grades.includes(label),"Grade 09 report room includes "+label);
}
expect(grade9Grades.includes("student-course-registry.js"),"Grade 09 report room derives from shared course registry");
expect(grade9Grades.includes("seven-class-summary"),"Grade 09 export identifies itself as a seven-class summary");

if(failures.length){
  console.error("Upper-grade/student-profile parity: FAIL");
  failures.forEach(x=>console.error(" - "+x));
  process.exit(1);
}
console.log("Upper-grade/student-profile parity: PASS");
console.log("Grades 10-12 share one continuation-aware learner engine; Grade 09 reports all seven classes; Quick Pins remain presentation-only.");
