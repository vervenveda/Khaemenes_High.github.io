import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";

const repoRoot=process.cwd();
const course="courses/mathematics/pre-algebra";
const rootURL="https://vervenveda.com/Khaemenes_High.github.io/";
const games=JSON.parse(fs.readFileSync("courses/mathematics/assets/learning-games/game-registry.json","utf8")).games;
const returnSource=fs.readFileSync("courses/mathematics/assets/game-return-route.js","utf8");
const document={
 currentScript:{src:rootURL+"courses/mathematics/assets/game-return-route.js"},
 readyState:"loading",
 addEventListener(){/* no page mount required to verify pure resolver */}
};
const window={};
vm.runInNewContext(returnSource,{document,window,URL,URLSearchParams,console});
const resolve=window.KhaemenesGameReturn?.resolveLesson;
assert.equal(typeof resolve,"function","Canonical game return helper must expose its pure lesson resolver.");
const pad=n=>String(n).padStart(2,"0");
let checkedGames=0,checkedLessons=0;
const mapCourse=JSON.parse(fs.readFileSync(course+"/course-map.json","utf8"));
assert.equal(mapCourse.units.length,13,"Official Pre-Algebra retains 13 units");
for(let i=1;i<=13;i++){
 const num=pad(i),base=course+"/units/unit-"+num;
 const entry=mapCourse.units.find(unit=>Number(unit.number)===i);
 assert.ok(entry,"Course map missing Unit "+num);
 assert.equal(entry.path,"units/unit-"+num+"/","Course map Unit "+num+" route mismatch");
 assert.ok(fs.existsSync(base+"/index.html"),"Unit "+num+" landing page missing");
 const map=JSON.parse(fs.readFileSync(base+"/unit-map.json","utf8"));
 assert.equal(Number(map.unit.number),i);
 for(const item of map.lessons){
  checkedLessons++;
  assert.ok(/^lessons\/[a-z0-9-]+\.html$/.test(item.file),"invalid canonical lesson filename "+item.file);
  const full=base+"/"+item.file;
  assert.ok(fs.existsSync(full),"missing lesson "+full);
  const expected="../pre-algebra/units/unit-"+num+"/"+item.file;
  const actual=resolve("prealgebra",num,pad(item.number),map);
  assert.equal(actual,expected,"Game return resolver mismatch for "+full);
  assert.equal(resolve("pre-algebra",num,pad(item.number),map),expected,"Course alias return mismatch "+full);
  const href=new URL(actual,rootURL+"courses/mathematics/assets/");
  assert.equal(href.pathname,"/Khaemenes_High.github.io/"+full,"Game return must lead to exact lesson");
 }
 const enginePath=base+"/assets/lesson-engine.js";
 const engine=fs.readFileSync(enginePath,"utf8");
 new vm.Script(engine,{filename:enginePath});
 const source=engine.match(/const COMPANIONS=\{[\s\S]*?\n\};/);
 if(i>3){
  assert.ok(!source,"Later units do not claim fabricated companion mappings "+num);
  continue;
 }
 assert.ok(source,"Unit "+num+" expected its explicit companion map");
 const companions=vm.runInNewContext(source[0]+"; COMPANIONS;");
 assert.equal(Object.keys(companions).length,map.lessons.length,"Unit "+num+" game-to-lesson mapping count");
 for(const item of map.lessons){
  const c=companions[item.id];
  assert.ok(c?.game,"Missing game for "+num+" "+item.id);
  const slug=c.sharedGame||c.game;
  assert.ok(games[slug],"Game not registered: "+slug);
  const canonical=games[slug].canonical_path;
  assert.equal(canonical,"courses/mathematics/assets/learning-games/"+slug+"/index.html");
  assert.ok(fs.existsSync(canonical),"Game route missing for "+slug);
  if(i===1){
   assert.equal(c.gameUnit,num,"Unit 01 explicit game unit must agree with unit map");
   assert.equal(c.gameLesson,pad(item.number),"Unit 01 explicit lesson must agree with map");
  }
  const params=new URLSearchParams({course:"prealgebra",unit:num,lesson:pad(item.number)});
  const gameURL=new URL(canonical+"?"+params,rootURL);
  assert.equal(gameURL.searchParams.get("lesson"),pad(item.number));
  const returnPath=resolve(gameURL.searchParams.get("course"),gameURL.searchParams.get("unit"),gameURL.searchParams.get("lesson"),map);
  assert.equal(returnPath,"../pre-algebra/units/unit-"+num+"/"+item.file,
    "Student must return to the correct lesson from "+slug);
  checkedGames++;
 }
 // The dynamic URL construction is in the lesson engine, not the lesson markup.
 // Unit 01 uses explicit context fields. Units 02/03 use the current unit and lesson.
 if(i===1){
  assert.ok(engine.includes("unit=\${encodeURIComponent(c.gameUnit"),"Unit 01 game URLs must contain a unit");
  assert.ok(engine.includes("lesson=\${encodeURIComponent(c.gameLesson"),"Unit 01 game URLs must contain a lesson");
 }else{
  assert.ok(/unit=\$\{pad\(unitNo\)\}/.test(engine),"Unit "+num+" dynamic game URLs must contain the unit");
  assert.ok(/lesson=\$\{pad\(lesson\?\./.test(engine),"Unit "+num+" dynamic game URLs must contain the lesson");
 }
}
assert.equal(checkedGames,22,"Unit 01–03 contain 22 explicitly mapped game companions");
assert.ok(checkedLessons>80,"Audit spans all official Pre-Algebra lessons");
console.log("PASS: Pre-Algebra dynamic navigation: "+checkedLessons+
" canonical lessons across 13 units, "+checkedGames+
" game launchers in Units 01–03, registry match, exact return lesson, course aliases, and per-game unit/lesson context.");
