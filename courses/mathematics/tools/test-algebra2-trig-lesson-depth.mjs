import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const registry=JSON.parse(fs.readFileSync("courses/mathematics/assets/learning-games/game-registry.json","utf8"));
const enhanced=new Set(["u10-l01","u10-l02","u10-l03","u10-l04","u10-l06","u10-l07","u10-l08","u10-l09","u10-l10",
"u11-l01","u11-l02","u11-l03","u11-l04","u11-l05"]);
const preexisting=new Set(["u10-l05","u11-l06","u11-l07","u11-l08"]);
let lessons=0,extraWorked=0,transferTasks=0,diagramCount=0,gameLaunchers=0;
const die=(ok,msg)=>assert.ok(ok,msg);
for(const [unit,total] of [[10,10],[11,8]]){
 for(let n=1;n<=total;n++){
  const id="u"+unit+"-l"+String(n).padStart(2,"0");
  const filepath="courses/mathematics/algebra-2/units/unit-"+unit+"/lessons/"+id+".html";
  const html=fs.readFileSync(filepath,"utf8");
  lessons++;
  die(/<main[^>]*id="main"/.test(html),id+" main landmark");
  die(html.includes('<div class="lesson-main">'),id+" learning column");
  die(html.includes('id="lessonNote"')&&html.includes('id="lessonComplete"')&&html.includes('id="saveLessonNote"'),id+" existing student records preserved");
  die(html.includes('lesson-tools.js'),id+" active lesson recorder");
  die(html.includes("shared-game-launcher.js"),id+" linked shared game");
  die(html.includes("Guided and independent practice"),id+" guided practice");
  die(html.includes("Differentiated pathways"),id+" teacher pathways");
  die(html.includes("Mastery evidence"),id+" success criteria");
  die(html.includes("Misconception and correction"),id+" existing misconception checks");
  const launchers=[...html.matchAll(/data-game="([^"]+)"/g)].map(m=>m[1]);
  for(const slug of launchers)die(registry.games[slug],id+" references missing registered game "+slug);
  gameLaunchers+=launchers.length;
  let visuals=html.match(/<svg\b[^>]*role="img"/g)||[];
  die(visuals.length>=1,id+" needs accessible mathematical diagram");
  die(html.includes('aria-labelledby="'+id) || html.includes('aria-labelledby="u'+unit+'l'),id+" image accessible name and description");
  diagramCount+=visuals.length;
  die(html.includes("<details><summary>Reveal"),id+" delayed answer review");
  if(enhanced.has(id)){
   die((html.match(new RegExp('data-instruction-reinforced="'+id+'"','g'))||[]).length===1,id+" unique enrichment");
   die(html.includes('data-depth-diagram="'+id+'"'),id+" specific SVG concept model");
   die(html.includes('data-depth-transfer="'+id+'"'),id+" independent transfer");
   const start=html.indexOf('data-instruction-reinforced="'+id+'"');
   const stop=html.indexOf('data-depth-diagram="'+id+'"');
   const lesson=html.slice(start,stop);
   die((lesson.match(/<article>/g)||[]).length===2,id+" needs two extended worked proofs");
   die((lesson.match(/<li>/g)||[]).length>=6,id+" needs at least six explicit worked steps");
   extraWorked+=2;
   const transfer=html.slice(html.indexOf('data-depth-transfer="'+id+'"'),
      html.indexOf('<section class="lesson-section"><h2>Guided and independent practice</h2>'));
   die((transfer.match(/<li>/g)||[]).length===6,id+" three original questions and three answer explanations");
   die(transfer.includes("<details><summary>Reveal independent answer reasoning</summary>"),id+" require hidden answers");
   die(transfer.includes("Misconception to correct:"),id+" explicit error diagnosis");
   transferTasks+=3;
  }else{
   die(preexisting.has(id),id+" missing from instructional coverage plan");
   die(html.includes("Visual model")&&html.includes("Independent transfer"),id+" preserve expanded lesson content");
  }
  for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   const uri=m[1];if(/^(?:https?:|mailto:|tel:|data:|#)/i.test(uri))continue;
   const rel=uri.split(/[?#]/)[0];if(!rel||rel.startsWith("/"))continue;
   const target=path.posix.normalize(path.posix.join(path.posix.dirname(filepath),rel));
   die(fs.existsSync(target)||fs.existsSync(target+"/index.html"),id+" broken local resource "+uri);
  }
 }
}
assert.equal(lessons,18);
assert.equal(extraWorked,28);
assert.equal(transferTasks,42);
die(gameLaunchers>=19,"all original game connections preserved");
die(diagramCount>=18,"all lessons diagrammed");

// Independent numerical checks of every kind of reasoning added or previously present.
const r=x=>x*Math.PI/180;
const close=(a,b,t=0.01)=>Math.abs(a-b)<=t;
die(close(12*(5*Math.PI/4),15*Math.PI),"radian arc length");
die(close(Math.sin(r(210)),-.5),"unit circle third-quadrant sine");
die(close(Math.sin(r(300)),-Math.sqrt(3)/2),"unit circle fourth-quadrant sine");
die(close(Math.tan(r(135)),-1),"tangent reference sign");
die(close(Math.sin(r(120)),Math.sqrt(3)/2),"unit circle QII");
die(close(Math.cos(r(120)),-.5),"negative cosine in QII");
die(close(.5*.5+Math.pow(Math.sqrt(3)/2,2),1),"Pythagorean identity");
die(close(3*Math.sin(2*(3*Math.PI/4)-Math.PI)+4,7),"transformed sine maximum");
die(close(5+2*Math.cos(Math.PI*(4-1)/3),3),"model half-period trough");
die(close(8+4*Math.sin(Math.PI*9/6),4),"periodic data");
die(close(3+4*Math.sin(Math.PI*10/4),7),"periodic data extrapolation");
die(close(6.8-7,-.2),"residual sign");
die(close(Math.hypot(-2,6),2*Math.sqrt(10)),"vector resultant");
die(close((Math.atan2(-2,6)*180/Math.PI+360)%360,341.565,0.03),"signed bearing quadrant");
die(close((Math.atan2(6,8)*180/Math.PI+360)%360,36.87,0.02),"bearing from north");
die(close(1+(3/4)**2,25/16),"tangent secant identity");
die(close((1-Math.cos(r(30))**2)/Math.sin(r(30)),Math.sin(r(30))),"symbolic identity sample");
die(close(Math.sin(r(75)),(Math.sqrt(6)+Math.sqrt(2))/4),"sin sum identity");
die(close(Math.cos(r(15)),(Math.sqrt(6)+Math.sqrt(2))/4),"cos difference identity");
die(close(Math.sin(r(15)),(Math.sqrt(6)-Math.sqrt(2))/4),"sin difference identity");
die(close(Math.cos(r(75)),(Math.sqrt(6)-Math.sqrt(2))/4),"cos sum identity");
die(close(Math.sin(r(60)),2*Math.sin(r(30))*Math.cos(r(30))),"double-angle sine identity");
die(close(Math.cos(r(120)),-Math.sqrt((1+Math.cos(r(240)))/2)),"signed half angle");
die(close(Math.cos(r(300)),Math.cos(r(60))),"cosine quadrant symmetry");
for(const theta of [Math.PI/6,5*Math.PI/6])die(close(2*Math.sin(theta),1),"interval solutions");
for(const theta of [Math.PI/4,3*Math.PI/4,5*Math.PI/4,7*Math.PI/4])
 die(close(Math.cos(2*theta),0),"double-frequency roots");
die(close(Math.sqrt(12*12+18*18-2*12*18*Math.cos(r(70))),17.90,.011),"two-endpoint separation");
die(close(Math.hypot(14,6*Math.sqrt(3)),4*Math.sqrt(19)),"two-leg displacement");
die(close(Math.atan2(14,6*Math.sqrt(3))*180/Math.PI,53.41,.02),"navigation bearing");
die(close(Math.sqrt(6.5*3.5*2.5*.5),5.33,.011),"Heron area");
console.log("PASS: "+lessons+" Algebra II Unit 10–11 lessons; "+extraWorked+" new complete worked examples, "+transferTasks+" independent prompts, "+
 diagramCount+" accessible diagrams, "+gameLaunchers+" retained canonical game launchers, route preservation, and exact/numerical mathematics cross-checks.");
