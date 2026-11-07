/* Academy High School landing parity + regression gate.
 * Source-level checks only. Browser rendering and authenticated routing
 * require separate live/manual testing.
 */
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const errors=[],checks=[];
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
const check=(ok,msg)=>{checks.push({ok:!!ok,msg});if(!ok)errors.push(msg)};
const count=(s,re)=>[...s.matchAll(re)].length;
const scripts=s=>[...s.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(m=>m[1]);
const links=s=>[...s.matchAll(/<a\b[^>]*\bhref="([^"]+)"[^>]*>/g)].map(m=>m[1]);
const expected=["09","10","11","12"];
const routing=read("assets/high-navigation-v1.js");
check(routing.includes('data-high-profile-editor-door'),"Shared navigation must support grade-aware profile editor doors");
check(routing.includes('function profileHref(editor=false)'),"Shared navigation must have dashboard/editor routing");
check(routing.includes('function activeGrade()'),"Shared navigation must derive learner grade from the registry");
check(routing.includes('Khaemenes_Academy.github.io/family/enroll/'),"Guest learner doorway must retain a verified existing enrollment route");
for(const g of expected){
 const p="grades/grade-"+g+"/index.html",s=read(p),pre="Grade "+Number(g)+": ";
 const allScripts=scripts(s);
 const studentLinks=links(s).filter(u=>u.startsWith("student-profile/"));
 check(count(s,/<header\b/g)===1&&count(s,/\bdata-khae-header\b/g)>=1,pre+"exactly one canonical Academy header");
 check(count(s,/<h1\b/g)===1,pre+"exactly one primary heading");
 check(count(s,/class="front-card"/g)===3,pre+"exactly three Front Desk cards");
 check(count(s,/class="course-card"/g)===8,pre+"exactly eight course cards");
 check(count(s,/class="support-card"/g)===3,pre+"exactly three support cards");
 check(count(s,/class="status"/g)===8,pre+"every course has a numbered status");
 check(!/class="site-header"|class="ribbon"|class="breadcrumbs"|id="highNavigationBreadcrumbs"/.test(s),pre+"no retired duplicate header or breadcrumb markup");
 check(s.includes('data-high-hide-breadcrumbs="true"'),pre+"shared navigation will not append duplicate breadcrumbs");
 check(s.includes('data-vnv-ecosystem-slot'),pre+"single canonical ecosystem menu slot exists");
 check(s.includes('data-vnv-language-mount')&&allScripts.some(x=>x.includes("assets/vnv-language.js")),pre+"official language tools and mount");
 check(allScripts.filter(x=>x.includes("vnv-333-ticker.js")).length===1,pre+"exactly one 333 ticker loader");
 check(allScripts.filter(x=>x.includes("vnv-ticker-autopopulate.js")).length===1,pre+"exactly one auto ticker loader");
 check(allScripts.filter(x=>x.includes("vnv-ecosystem-toolbar.js")).length===1,pre+"exactly one official dock script");
 check(!allScripts.some(x=>/khaemenes-landing-toolbar.js|vnv-beta-link.js/.test(x)),pre+"no competing legacy toolbar script");
 check(allScripts.some(x=>x.includes("high-navigation-v1.js")),pre+"shared grade-aware navigation loaded");
 check(s.includes('data-high-profile-door="true"')&&s.includes('data-high-profile-editor-door="true"'),pre+"dashboard and profile-editor doors marked");
 check(s.includes('href="student-profile/profile/" data-high-profile-editor-door'),pre+"profile editor points to local, existing route");
 check(!s.includes('href="https://vervenveda.com/Khaemenes_Academy.github.io/student/"'),pre+"no retired general student profile href");
 check(s.includes('grade'+g+'-support-card-spacing-20261107'),pre+"support description/button spacing retained");
 check(s.includes('grade'+g+'-navigation-accessibility-20261107'),pre+"16px buttons and keyboard focus styles");
 check(exists("grades/grade-"+g+"/student-profile/index.html"),pre+"student dashboard exists");
 check(exists("grades/grade-"+g+"/student-profile/profile/index.html"),pre+"profile editor exists");
 for(const uri of studentLinks){
  const clean=uri.split(/[?#]/)[0].replace(/\/$/,"");
  if(clean&&uri.includes("#"))continue; // anchors can be runtime-populated
  const candidate=path.join("grades","grade-"+g,clean,"index.html");
  check(exists(candidate),pre+"local profile path exists: "+uri);
 }
 const labels=[...s.matchAll(/<span class="status">([^<]+)<\/span>/g)].map(x=>x[1]);
 check(labels.filter(x=>/^Core\s+0?[1-6]\s+of\s+06$/.test(x)).length===6,pre+"six numbered core subjects");
 check(labels.filter(x=>/^Elective\s+0?[1-2]\s+of\s+02$/.test(x)).length===2,pre+"two numbered electives");
 if(g==="09"){
  check(!/font:400 11px/.test(s),pre+"legacy 11px declared text removed");
  check(s.includes('window.VNVEcosystemToolbar)return'),pre+"Grade 9 fallback respects official owner");
 }
}
console.log("HIGH SCHOOL FOUR-GRADE REGRESSION: "+(errors.length?"FAIL":"PASS")+" ("+(checks.length-errors.length)+"/"+checks.length+" checks)");
if(errors.length){
 errors.forEach(e=>console.error(" - "+e));
 process.exitCode=1;
}else console.log("All four grades retain canonical chrome, 6+2 courses, accessible controls, and verified profile destinations.");
