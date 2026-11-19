import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const failures=[];
const expect=(value,message)=>{if(!value)failures.push(message)};

const blueprint=read("grades/shared/grade09-blueprint-upper-grade.js");
const grade09Css=read("grades/grade-09/student-profile/student-profile.css");
const compact=read("grades/shared/student-profile-compact-panels.js");
const pins=read("courses/shared/high-school-course-pins.js");
const catalog=read("courses/shared/high-school-eight-class.js");
const grade9Quick=read("grades/grade-09/student-profile/student-quick-pins.js");
const grade9Grades=read("grades/grade-09/student-profile/grades/index.html");

for(const token of [
  "KhaemenesUpperGrade09Blueprint","KhaemenesLearningContinuation",
  "KhaemenesHighProfileGradeContext","KhaemenesHighEightClass",
  "const builder=highRoot+\"grades/grade-\"+grade+\"/student-profile/profile/\"",
  "firstStepHref","renderTools","pageshow","khaemenes-family-changed"
])expect(blueprint.includes(token),"canonical Grade 09 upper-grade blueprint contains "+token);

for(const token of [
  "english-10","english-11","english-12","social-studies-10","social-studies-11","social-studies-12",
  "biology-10","chemistry-11","physics-engineering-12","physical-education-10","physical-education-11","physical-education-12",
  "elective-10","elective-11","elective-12"
])expect(pins.includes('\"'+token+'\"'),"High School pin metadata registers "+token);

expect(catalog.includes("const FIRST_STEPS=Object.freeze"),"eight-class catalog owns canonical first instructional steps");
expect(grade09Css.includes("@media(max-width:620px)"),"canonical profile CSS has narrow mobile layout");
expect(grade09Css.includes("grid-template-columns:1fr"),"canonical profile CSS collapses multi-column UI on narrow screens");
for(const token of ["showModal()","dialog.close()","MutationObserver(sync)","grade10Personalize","upperGradePersonalize","studentCourseProgress","my-profile-extras","quick-pins","khaeStickerBox","khaeDreamsAchievements","khaeStudentEcosystemTools"]){
  expect(compact.includes(token),"compact profile dialog steward includes "+token);
}
expect(!compact.includes("localStorage.setItem("),"layout dialogs must not write grades, mastery or preferences");

for(const grade of ["10","11","12"]){
  const html=read("grades/grade-"+grade+"/student-profile/index.html");
  expect(html.includes('data-grade="'+grade+'"'),"Grade "+grade+" profile declares its grade");
  expect(html.includes("../../grade-09/student-profile/student-profile.css"),"Grade "+grade+" inherits canonical Grade 09 profile CSS");
  expect(html.includes("grade09-blueprint-upper-grade.js"),"Grade "+grade+" uses the canonical Grade 09 blueprint adapter");
  expect(!html.includes("upper-grade-seven-class.js"),"Grade "+grade+" must not load retired upper-grade schedule authority");
  expect(!html.includes("../../shared/upper-grade-profile.css"),"Grade "+grade+" must not load retired upper-grade profile CSS authority");
  expect(html.includes("khaemenes-learning-continuation.js"),"Grade "+grade+" loads continuation contract");
  expect(html.includes("khaemenes-student-profile-v2.js"),"Grade "+grade+" loads Academy profile contract");
  expect(html.includes("khaemenes-student-quick-pins-v1.js"),"Grade "+grade+" loads Academy Quick Pins");
  expect(html.includes("khaemenes-student-workspace-v2.js"),"Grade "+grade+" loads workspace preferences");
  expect(html.includes("student-profile-compact-panels.js"),"Grade "+grade+" loads compact profile dialogs");
  expect(html.indexOf("student-profile-compact-panels.js")>html.indexOf("student-ecosystem-tools.js"),"Grade "+grade+" initializes dialogs after secondary panels");
  expect(html.includes("vnv-language.js"),"Grade "+grade+" keeps official translator");
  expect(/font-size:\s*16px\s*!important/.test(html),"Grade "+grade+" keeps the 16px minimum interface typography");
  expect(!/href=[\"']https:\/\/vervenveda\.com\/Khaemenes_Academy\.github\.io\/family\//i.test(html),"Grade "+grade+" student profile does not expose the Family Portal");
}

expect(grade9Quick.includes("KhaemenesStudentQuickPinsV1"),"Grade 09 Quick Pins bridge to canonical Academy store");
for(const label of ["Mathematics","Language Arts","Social Studies","Science","Physical Education","World Language","Psychology / Elective"]){
  expect(grade9Grades.includes(label),"Grade 09 report room includes "+label);
}
expect(grade9Grades.includes("student-course-registry.js"),"Grade 09 report room derives from shared course registry");
expect(grade9Grades.includes("seven-class-summary"),"Grade 09 export retains its legacy report schema label until a separate migration is approved");

if(failures.length){
  console.error("Upper-grade/student-profile parity: FAIL");
  failures.forEach(x=>console.error(" - "+x));
  process.exit(1);
}
console.log("Upper-grade/student-profile parity: PASS");
console.log("Grades 10-12 use the Grade 09 structural blueprint, one eight-class authority, grade-local editors, learner-safe routing, and 16px minimum interface typography.");
