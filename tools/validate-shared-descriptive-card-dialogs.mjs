import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const failures=[];
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const ok=(v,m)=>{if(!v)failures.push(m)};

const pages=[
 ["courses/mathematics/pre-algebra/index.html","math-feature"],
 ["courses/mathematics/algebra-1/index.html","math-feature"],
 ["courses/mathematics/geometry/index.html","math-feature"],
 ["courses/mathematics/algebra-2/index.html","math-feature"],
 ["courses/language-arts/english-9/index.html","english-feature"],
 ["courses/language-arts/english-10/index.html","english-feature"],
 ["courses/language-arts/english-11/index.html","english-feature"],
 ["courses/language-arts/english-12/index.html","english-feature"],
 ["courses/social-studies/grade-09/index.html","social-feature"],
 ["courses/social-studies/grade-10/index.html","social-feature"],
 ["courses/social-studies/grade-11/index.html","social-feature"],
 ["courses/social-studies/grade-12/index.html","social-feature"],
 ["courses/science/integrated-science-9/index.html","science-feature"],
 ["courses/science/biology-10/index.html","science-feature"],
 ["courses/science/chemistry-11/index.html","science-feature"],
 ["courses/science/physics-engineering-12/index.html","science-feature"],
 ["electives/psychology/index.html","psych-card"]
];

for(const [file,cls] of pages){
 const html=read(file);
 const marked=(html.match(new RegExp(`class=["']${cls}["'][^>]*data-vnv-descriptive-card`,"g"))||[]).length;
 const engine=(html.match(/vnv-descriptive-card-dialog-v1\.js/g)||[]).length;
 ok(marked===4,`${file}: expected exactly 4 shared descriptive cards, found ${marked}`);
 ok(engine===1,`${file}: expected exactly 1 shared descriptive-card dialog engine, found ${engine}`);
 ok(!/<dialog\b/i.test(html),`${file}: local dialog markup is forbidden; shared engine owns the dialog`);
 ok(!/class=["'][^"']*vnv-card-info-action/i.test(html),`${file}: Learn More action must be runtime-injected, not duplicated in source`);
}

const psych=read("electives/psychology/index.html");
ok(psych.includes('data-vnv-href="../grades/grade-09/psych-101/"'),"Psychology 101 must preserve its real course route");
for(const course of ["Psychology 102","Psychology 201","Psychology 202"]){
 ok(psych.includes(course),"Psychology gateway missing "+course);
}
ok((psych.match(/data-vnv-status="Under Construction"/g)||[]).length===3,
   "Psychology 102/201/202 must remain explicit construction-state cards");

if(failures.length){
 console.error("\nShared descriptive-card rollout validation failed:");
 failures.forEach(x=>console.error(" - "+x));
 process.exit(1);
}
console.log(`SHARED_DESCRIPTIVE_CARD_DIALOGS=PASS · ${pages.length} landing pages · 68 descriptive cards · one shared idempotent dialog engine per page.`);
