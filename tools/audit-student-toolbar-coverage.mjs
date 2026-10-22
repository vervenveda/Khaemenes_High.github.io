// Academy-wide student profile / utility toolbar inventory (read-only).
// Run: node tools/audit-student-toolbar-coverage.mjs
import fs from "node:fs";
import path from "node:path";
const root=process.cwd(), records=[];
const knownShared=[
  "courses/shared/course-entry-contract.js",
  "courses/shared/high-school-learning-context-v1.js",
  "courses/mathematics/geometry/assets/lesson-tools.js",
  "courses/mathematics/algebra-2/assets/lesson-tools.js"
];
const direct=/vnv-beta-link\.js/i;
const shared=/course-entry-contract\.js|high-school-learning-context-v1\.js|(?:geometry|algebra-2)\/assets\/lesson-tools\.js|src=["'][^"']*\/assets\/lesson-tools\.js/i;
function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){if(item.name===".git"||item.name==="node_modules")continue;const p=path.join(dir,item.name);if(item.isDirectory())walk(p);else if(item.name.endsWith(".html")){const rel=path.relative(root,p).replaceAll(path.sep,"/");const html=fs.readFileSync(p,"utf8");const status=direct.test(html)?"direct":shared.test(html)?"shared":"uncovered";records.push({page:rel,course:rel.split("/").slice(0,3).join("/"),status})}}}
walk(root);
const totals={direct:0,shared:0,uncovered:0};
for(const p of records)totals[p.status]++;
const gaps=records.filter(p=>p.status==="uncovered");
const byCourse={};for(const p of gaps){(byCourse[p.course]??=[]).push(p.page)}
const report={total:records.length,totals,sharedImplementations:knownShared,uncoveredByCourse:Object.fromEntries(Object.entries(byCourse).sort((a,b)=>b[1].length-a[1].length).map(([key,paths])=>[key,{count:paths.length,samples:paths.slice(0,8)}])),uncoveredPages:gaps.map(x=>x.page)};
fs.mkdirSync("reports",{recursive:true});
fs.writeFileSync("reports/student-toolbar-coverage.json",JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({total:report.total,totals,uncoveredCourses:Object.keys(byCourse).length,largestGaps:Object.entries(report.uncoveredByCourse).slice(0,16).map(([course,v])=>({course,count:v.count}))},null,2));
if(process.env.REQUIRE_FULL_TOOLBAR_COVERAGE==="1"&&gaps.length)process.exitCode=1;
