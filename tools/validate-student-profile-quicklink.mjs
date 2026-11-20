import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
let failed=false;
const ok=(value,message)=>{if(value)console.log("OK "+message);else{failed=true;console.error("FAIL "+message)}};

const widget=read("assets/vnv-beta-link.js");
ok(widget.includes('version:"1.9.2"'),"legacy-compatible learner utility module remains versioned");
ok(widget.includes("highStudentProfileUrl"),"legacy-compatible module still resolves an active High School profile");
ok(widget.includes("ensureOfficialEcosystemToolbar"),"High School utility ownership delegates to the official ecosystem toolbar");
ok(widget.includes("retireLegacyBetaButton"),"standalone Beta launcher remains explicitly retired");
ok(!widget.includes('label.textContent="Beta Program"'),"retired standalone Beta label is absent");

const gradePages=["09","10","11","12"].map(g=>"grades/grade-"+g+"/index.html");
for(const page of gradePages){
 const html=read(page);
 ok(html.includes('data-high-profile-door="true"'),page+" exposes the local Student Profile doorway");
 ok(html.includes('data-high-profile-editor-door="true"'),page+" exposes the local profile editor doorway");
 ok(html.includes("vnv-ecosystem-toolbar.js"),page+" loads the official ecosystem toolbar");
 ok(!html.includes("vnv-beta-link.js"),page+" does not reload the retired duplicate learner rail");
}

const canonicalLandingPages=[
 "index.html","courses/index.html","courses/electives/index.html",
 "courses/language-arts/index.html","courses/language-arts/english-9/index.html","courses/language-arts/english-10/index.html","courses/language-arts/english-11/index.html","courses/language-arts/english-12/index.html",
 "courses/mathematics/index.html","courses/mathematics/pre-algebra/index.html","courses/mathematics/algebra-1/index.html","courses/mathematics/geometry/index.html","courses/mathematics/algebra-2/index.html","courses/mathematics/precalculus-trigonometry/index.html","courses/mathematics/calculus-1/index.html","courses/mathematics/readiness/index.html","courses/mathematics/evidence-vault/index.html",
 "courses/science/index.html","courses/science/integrated-science-9/index.html","courses/science/biology-10/index.html","courses/science/chemistry-11/index.html","courses/science/physics-engineering-12/index.html",
 "courses/social-studies/index.html","courses/social-studies/grade-09/index.html","courses/social-studies/grade-10/index.html","courses/social-studies/grade-11/index.html","courses/social-studies/grade-12/index.html",
 ...gradePages
];
for(const page of canonicalLandingPages){
 const html=read(page);
 ok(!/<script[^>]+src=["'][^"']*vnv-beta-link\.js/i.test(html),page+" keeps the retired duplicate learner rail out of the landing page");
}
ok(canonicalLandingPages.length===31,"canonical High School landing-page inventory remains 31 pages");
if(failed)process.exit(1);
console.log("\nPASS High School profile-door and single-toolbar ownership coverage.");
