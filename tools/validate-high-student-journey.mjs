import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const failures=[];
const pass=(condition,message)=>{if(!condition)failures.push(message);else console.log("OK "+message)};

const root=read("index.html");
const widget=read("assets/vnv-beta-link.js");
const local=read("stos/khaemenes/assets/vnv-beta-link.js");

pass(/data-legacy-high-profile-form="migration-only"/.test(root),"legacy High local profile form is migration-only");
pass(/<form[^>]+id="profileForm"[^>]+hidden/i.test(root),"legacy profile creation form is hidden");
pass(/Create or Select Academy Learner/.test(root),"High front hall points account creation to Academy learner enrollment");
pass(/Open My Daily Profile/.test(root),"High front hall exposes the daily profile doorway");

for(const grade of ["09","10","11","12"]){
  const page=`grades/grade-${grade}/student-profile/index.html`;
  pass(fs.existsSync(path.join(ROOT,page)),`Grade ${grade} has a student profile home`);
  const html=read(page);
  if(grade==="09")pass(/This is home\./i.test(html),"Grade 09 profile identifies itself as home");
  else pass(/This is your daily High School home\./i.test(html),`Grade ${grade} profile identifies itself as daily home`);
}

for(const token of [
  "khaemenesStudentWorkButton",
  "khaemenesHighStudentProfileLink",
  "khaemenesStudentSearchButton",
  "vnvBetaProgramLink",
  "khaemenesStudentContributeButton"
])pass(widget.includes(token),"canonical learner rail contains "+token);

pass(widget.includes("highStudentProfileUrl"),"Student Profile resolves the active High grade");
pass(widget.includes("VNVEcosystemMenu")&&widget.includes("openStudentSearch"),"Search reuses the shared ecosystem search");
pass(widget.includes("isClosedBookAssessmentSurface")&&widget.includes("search.disabled=closedBook"),"Search is disabled during recognized closed-book assessments");
pass(widget.includes('CONTRIBUTE_URL="https://vervenveda.com/#support"'),"Contribute opens centralized voluntary-support information");
pass(!widget.includes("toolbar.append(bridge)")&&!widget.includes("quick.remove()"),"Family Bridge cannot replace the dedicated Student Profile rail control");
pass(widget===local,"High School public and STOS toolbar copies are byte-for-byte synchronized");
pass(!read("courses/shared/course-entry-contract.js").includes("mountStudentProfileAndBetaRail"),"course-entry contract no longer builds a duplicate learner rail");

if(failures.length){
  console.error("\nHigh School student journey: FAILED");
  failures.forEach(x=>console.error(" - "+x));
  process.exit(1);
}
console.log("\nHigh School student journey: PASSED");
console.log("Flow: Academy learner -> grade profile daily home -> courses -> exact-five learner rail.");
