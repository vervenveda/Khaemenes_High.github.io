import fs from "node:fs";

const failures=[];
const expect=(condition,message)=>{if(!condition)failures.push(message)};
const read=path=>fs.readFileSync(new URL("../"+path,import.meta.url),"utf8");

const main=read("index.html");
const rail=read("assets/vnv-beta-link.js");
const gradeCss=read("assets/khaemenes-grade-landing-v1.css");

expect(main.includes('id="menuButton"')&&main.includes('id="drawerBg"'),"High School front door keeps its native hamburger and drawer");
expect(main.includes('src="./assets/vnv-beta-link.js"'),"High School front door uses the canonical local learner rail");
expect(main.includes('src="./assets/vnv-language.js"')&&main.includes('data-official-vnv-language="true"'),"High School front door loads the official translator");
expect(!main.includes('data-vnv-ecosystem-slot'),"High School front door does not add a second ecosystem menu beside its native drawer");

const expectedRail=["Student Profile","Search","Archaemenes","Contribute","Beta Program"];
for(const label of expectedRail)expect(rail.includes(label),"learner rail contains "+label);
expect(rail.includes('HIGH_MENTOR_ID="khaemenesStudentMentorButton"'),"learner rail owns a dedicated Archaemenes control");
expect(!rail.includes("HIGH_WORK_ID"),"learner rail does not duplicate Student Profile with a My Work control");
expect(rail.includes('if(document.getElementById("menuButton")&&(document.getElementById("drawerBg")||document.getElementById("menuOverlay")))return;'),"local rail respects native High School menu ownership");

for(const grade of ["09","10","11","12"]){
  const path="grades/grade-"+grade+"/index.html";
  const source=read(path);
  const prefix="Grade "+grade+": ";
  expect(source.includes('class="grade-ecosystem-slot"')&&source.includes("data-vnv-ecosystem-slot"),prefix+"has far-right ecosystem menu slot");
  expect(source.includes('href="student-profile/"'),prefix+"has Student Dashboard doorway");
  expect(source.includes("Daily Lessons"),prefix+"has Daily Lessons doorway");
  expect(source.includes("Profile &amp; Settings"),prefix+"has Profile & Settings doorway");
  expect(source.includes("https://vervenveda.com/Khaemenes_Academy.github.io/student/"),prefix+"routes learner profile to canonical Academy profile");
  expect(source.includes('src="../../assets/vnv-beta-link.js"'),prefix+"uses canonical local learner rail");
  expect(source.includes('src="../../assets/vnv-language.js"')&&source.includes('data-official-vnv-language="true"'),prefix+"loads official translator");
  expect(source.includes("learning-tools-menu-v1.js"),prefix+"loads shared learning-tools menu");
  expect(!source.includes("My Seven Classes · Student Profile"),prefix+"does not restore obsolete one-off profile strip");
}
expect(gradeCss.includes("grid-template-columns:minmax(275px,.9fr) minmax(300px,1.1fr) auto 40px"),"grade header reserves a dedicated far-right menu column");
expect(gradeCss.includes(".grade-ecosystem-slot #vnvEcosystemMenuButton .vnv-eco-label{display:none!important}"),"grade ecosystem control is icon-only");
expect(gradeCss.includes("@media(max-width:760px)")&&gradeCss.includes(".grade-ecosystem-slot{grid-column:2;grid-row:1;justify-self:end}"),"grade hamburger stays top-right on mobile");

if(failures.length){
  console.error("High School landing parity: FAILED");
  failures.forEach(item=>console.error(" - "+item));
  process.exit(1);
}
console.log("High School landing parity: PASSED");
console.log("Main front door + Grades 9–12 share translator, learner rail, profile/daily journey and organized menu ownership.");
