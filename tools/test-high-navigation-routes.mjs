import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
const nav=fs.readFileSync("assets/high-navigation-v1.js","utf8");
const css=fs.readFileSync("assets/high-navigation-v1.css","utf8");
new vm.Script(nav);
const pages=[
"index.html","courses/index.html",
...["09","10","11","12"].flatMap(x=>["grades/grade-"+x+"/index.html","grades/grade-"+x+"/student-profile/index.html"]),
...["mathematics","language-arts","science","social-studies","physical-education","electives"].map(x=>"courses/"+x+"/index.html"),
...["pre-algebra","algebra-1","geometry","algebra-2"].map(x=>"courses/mathematics/"+x+"/index.html"),
...["integrated-science-9","biology-10","chemistry-11","physics-engineering-12"].map(x=>"courses/science/"+x+"/index.html"),
...["09","10","11","12"].map(x=>"courses/social-studies/grade-"+x+"/index.html"),
...["9","10","11","12"].map(x=>"courses/language-arts/english-"+x+"/index.html"),
...["u11-l08","u11-l06","u11-l07"].map(x=>"courses/mathematics/algebra-2/units/unit-11/lessons/"+x+".html"),
"courses/mathematics/algebra-2/units/unit-10/lessons/u10-l05.html"
];
assert.equal(pages.length,36);
for(const file of pages){
 const source=fs.readFileSync(file,"utf8");
 for(const suffix of [".js",".css"]){
  const match=source.match(new RegExp('(?:src|href)="([^"]*high-navigation-v1\\'+suffix+')"'));
  assert.ok(match,file+" missing navigation "+suffix);
  const resolved=path.posix.normalize(path.posix.join(path.posix.dirname(file),match[1]));
  assert.ok(fs.existsSync(resolved),file+" broken local navigation asset "+resolved);
 }
 assert.ok(/<main\b/i.test(source),file+" missing main landmark");
}
for(const course of ["precalculus-trigonometry","calculus-1"]){
 const html=fs.readFileSync("courses/mathematics/"+course+"/index.html","utf8");
 assert.ok(!/http-equiv=["']refresh/i.test(html),"abrupt handoff remains");
 assert.ok(html.includes("Continue to Higher Learning")&&html.includes("Return to High School Mathematics"));
 assert.ok(html.includes('href="../"')&&html.includes("Khaemenes Academy"));
 assert.ok(!/\blocation\.(replace|assign)\s*\(/.test(html),"script redirect remains");
 assert.ok(!html.includes("localStorage.setItem"),"handoff mutates learner");
}
assert.ok(css.includes("calc(100vw - 16px)")&&css.includes("@media(max-width:320px)"),"255 and 320px fit");
assert.ok(css.includes("min-height:44px")&&css.includes(":focus-visible")&&css.includes(".high-nav-skip:focus"),"touch and keyboard access");
const root="https://academy.example/Khaemenes_High.github.io/";
function helper(active,learners,pathname="courses/science/index.html"){
 const values=new Map();
 if(active!==undefined)values.set("khaemenes_active_learner_v1",JSON.stringify(active));
 values.set("khaemenes_family_registry_v1",JSON.stringify({learners}));
 const document={currentScript:{src:root+"assets/high-navigation-v1.js"},readyState:"loading",
  addEventListener(){},getElementById(){return null},querySelectorAll(){return []}};
 const window={addEventListener(){}};
 const context=vm.createContext({document,window,localStorage:{getItem:k=>values.get(k)||null},
  location:{pathname:new URL(pathname,root).pathname},URL,console});
 vm.runInContext(nav,context,{timeout:500});
 return {api:window.KhaemenesHighNavigation,values,window};
}
const a=helper("student-a",{"student-a":{learnerId:"student-a",grade:9}});
const b=helper("student-b",{"student-b":{learnerId:"student-b",grade:12}});
assert.ok(a.api.profileHref().endsWith("/grades/grade-09/student-profile/"),"grade 9 routes to own profile");
assert.ok(b.api.profileHref().endsWith("/grades/grade-12/student-profile/"),"grade 12 routes to own profile");
assert.notEqual(a.api.profileHref(),b.api.profileHref(),"learner routes differ");
for(const grade of [9,10,11,12]){
 const x=helper("current",{"current":{learnerId:"current",grade}});
 assert.ok(x.api.profileHref().endsWith("/grades/grade-"+String(grade).padStart(2,"0")+"/student-profile/"));
}
for(const invalid of [null,{},13,8,"Grade 15"]){
 const x=helper("student",{"student":{learnerId:"student",grade:invalid}});
 assert.ok(x.api.profileHref().endsWith("/index.html#student-portal"),"invalid learner grade must not redirect to family");
}
const missing=helper("absent",{"other":{learnerId:"other",grade:10}});
assert.ok(missing.api.profileHref().endsWith("/index.html#student-portal"),"unknown learner safe fallback");
const guest=helper(undefined,{});
assert.ok(guest.api.profileHref().endsWith("/index.html#student-portal"),"guest safe fallback");
a.values.set("khaemenes_active_learner_v1",JSON.stringify("student-b"));
a.values.set("khaemenes_family_registry_v1",JSON.stringify({learners:{"student-b":{learnerId:"student-b",grade:12}}}));
assert.ok(a.api.profileHref().endsWith("/grades/grade-12/student-profile/"),"profile re-evaluates learner after Back/switch");
const crumbs=a.api.crumbList("courses/mathematics/algebra-2/units/unit-11/lessons/u11-l08.html");
assert.deepEqual(Array.from(crumbs,x=>x.text),["High School","Courses","Mathematics","Algebra 2","Unit 11","Lesson 8"]);
assert.ok(crumbs[0].href.endsWith("/index.html"));
assert.ok(crumbs.at(-1).href.endsWith("/lessons/u11-l08.html"));
const gradeCrumbs=Array.from(a.api.crumbList("grades/grade-10/student-profile/index.html"),x=>x.text);
assert.deepEqual(gradeCrumbs,["High School","Grade 10","Student Profile"]);
for(const key of ["vnvEcosystemMenuButton","vnvEcosystemMenuOverlay","khaeLocalEcosystemToggle","aria-expanded","Escape","aria-controls","aria-label","data-high-profile-resolved","pageshow","storage"]){
 assert.ok(nav.includes(key),"navigation contract missing "+key);
}
assert.ok(nav.includes("wrap.contains(event.target)")&&nav.includes("panel.querySelector(\"a\")?.focus()"),"outside click and keyboard focus");
assert.ok(nav.includes("document.getElementById(\"vnvEcosystemMenuButton\")"),"canonical menu must be preserved");
console.log("PASS: 36 pages, 2 opt-in Higher Learning handoffs, two independent learners, 4 grade profiles, safe guest routing, Back/switch re-resolution, lesson breadcrumbs, mobile focus and local menu contracts.");
