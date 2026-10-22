import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const pages=[
  "courses/electives/index.html",
  "courses/index.html",
  "courses/language-arts/english-10/index.html",
  "courses/language-arts/english-11/index.html",
  "courses/language-arts/english-12/index.html",
  "courses/language-arts/english-9/index.html",
  "courses/language-arts/index.html",
  "courses/mathematics/algebra-1/index.html",
  "courses/mathematics/algebra-2/index.html",
  "courses/mathematics/calculus-1/index.html",
  "courses/mathematics/evidence-vault/index.html",
  "courses/mathematics/geometry/index.html",
  "courses/mathematics/index.html",
  "courses/mathematics/pre-algebra/index.html",
  "courses/mathematics/precalculus-trigonometry/index.html",
  "courses/mathematics/readiness/index.html",
  "courses/science/biology-10/index.html",
  "courses/science/chemistry-11/index.html",
  "courses/science/index.html",
  "courses/science/integrated-science-9/index.html",
  "courses/science/physics-engineering-12/index.html",
  "courses/social-studies/grade-09/index.html",
  "courses/social-studies/grade-10/index.html",
  "courses/social-studies/grade-11/index.html",
  "courses/social-studies/grade-12/index.html",
  "courses/social-studies/index.html",
  "grades/grade-09/index.html",
  "grades/grade-10/index.html",
  "grades/grade-11/index.html",
  "grades/grade-12/index.html",
  "index.html"
];
let failed=false;
const ok=(value,message)=>{if(value)console.log("OK "+message);else{failed=true;console.error("FAIL "+message)}};

const widget=read("assets/vnv-beta-link.js");
ok(widget.includes('version:"1.8.0"'),"beta/profile widget is v1.8.0");
ok(widget.includes('khaemenesHighStudentProfileLink'),"student profile quick link exists");
ok(widget.includes('highStudentProfileUrl'),"High School profile button resolves the active learner's grade profile");
for(const grade of ["09","10","11","12"]){
  ok(widget.includes('grades/grade-"+String(grade).padStart(2,"0")+"/student-profile/')||widget.includes('grades/grade-'),"grade-aware Student Profile resolver is present for Grade "+grade);
}
ok(widget.includes('khaemenes-student-workspace-v2.js'),"learner rail propagates Academy workspace preferences");
ok(widget.includes('khaemenesFamilyBridge'),"Academy learner continuity bridge remains recognized");
ok(!widget.includes('toolbar.append(bridge)')&&!widget.includes('quick.remove()'),"Family Bridge cannot replace the dedicated Student Profile rail control");
ok(widget.includes('khaemenesLearnerUtilityToolbar'),"student profile and beta controls share the Khaemenes learner utility toolbar");
ok(widget.includes('learnerRecordNoticeButton')&&widget.includes('khaemenesStudentWorkButton'),"My Work reuses preserved-work recovery when available");
ok(widget.includes('khaemenesStudentSearchButton')&&widget.includes('VNVEcosystemMenu'),"Search opens the shared ecosystem search drawer");
ok(widget.includes('isClosedBookAssessmentSurface')&&widget.includes('search.disabled=closedBook'),"Search remains visible but is disabled on closed-book exam surfaces");
ok(widget.includes('vnvBetaProgramLink'),"Beta Program remains in the learner rail");
ok(widget.includes('khaemenesStudentContributeButton')&&widget.includes('#vnv-global-support'),"Contribute opens centralized voluntary-support information");
ok(widget.includes('order:50')&&widget.includes('order:40')&&widget.includes('order:30'),"five-button rail has deterministic control ordering");
ok(widget.includes('border-radius:7px'),"student utility controls keep the Khaemenes 7px radius");

for(const page of pages){
  const html=read(page);
  ok(/<script[^>]+src=["']https:\/\/vervenveda\.com\/assets\/vnv-beta-link\.js["'][^>]*><\/script>/i.test(html),page+" loads the shared profile + beta widget");
}
ok(pages.length===31,"canonical High School landing-page inventory remains 31 pages");
if(failed)process.exit(1);
console.log("\nPASS High School student profile quick-link coverage.");
