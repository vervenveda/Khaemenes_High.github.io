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
ok(widget.includes('version:"1.5.0"'),"beta/profile widget is v1.5.0");
ok(widget.includes('khaemenesHighStudentProfileLink'),"student profile quick link exists");
ok(widget.includes('Khaemenes_Academy.github.io/student/'),"student profile link uses the canonical Academy Student Portal");
ok(widget.includes('khaemenesFamilyBridge'),"existing Academy learner continuity box is reused when present");
ok(widget.includes('betaStackOffset'),"student profile surface is stacked above the beta button");
ok(widget.includes('border-radius:7px'),"student profile quick link keeps the Khaemenes 7px radius");

for(const page of pages){
  const html=read(page);
  ok(/<script[^>]+src=["']https:\/\/vervenveda\.com\/assets\/vnv-beta-link\.js["'][^>]*><\/script>/i.test(html),page+" loads the shared profile + beta widget");
}
ok(pages.length===31,"canonical High School landing-page inventory remains 31 pages");
if(failed)process.exit(1);
console.log("\nPASS High School student profile quick-link coverage.");
