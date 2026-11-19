import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const registry=JSON.parse(fs.readFileSync("courses/mathematics/assets/learning-games/game-registry.json","utf8"));
const standardFlow=["recall","see","worked","explain","guided","independent","error","transfer","feedback","reflect"];
const depthCompanion=fs.readFileSync("courses/mathematics/algebra-2/assets/algebra2-exceptional-lesson-depth-units10-11-v1.js","utf8");
let lessons=0,coreWorked=0,independentTasks=0,diagramCount=0,gameLaunchers=0,depthCoverage=0;
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
  die(html.includes("lesson-tools.js"),id+" active lesson recorder");
  die(html.includes("shared-game-launcher.js"),id+" linked shared game");

  const flow=[...html.matchAll(/data-flow-step="([^"]+)"/g)].map(m=>m[1]);
  for(const step of standardFlow)die(flow.includes(step),id+" missing current flow step "+step);
  for(let i=1;i<standardFlow.length;i++)die(flow.indexOf(standardFlow[i-1])<flow.indexOf(standardFlow[i]),id+" flow order "+standardFlow[i-1]+" -> "+standardFlow[i]);
  die(flow.includes("guided")&&flow.includes("independent"),id+" guided-to-independent practice progression");
  die(flow.includes("error"),id+" misconception/error repair stage");
  die(flow.includes("feedback"),id+" success/feedback stage");
  die(flow.includes("reflect"),id+" reflection stage");

  const launchers=[...html.matchAll(/data-game="([^"]+)"/g)].map(m=>m[1]);
  for(const slug of launchers)die(registry.games[slug],id+" references missing registered game "+slug);
  gameLaunchers+=launchers.length;

  const inlineVisuals=html.match(/<svg\b[^>]*role="img"/g)||[];
  const companionVisual=html.includes("algebra2-exceptional-lesson-depth-units10-11-v1.js")&&depthCompanion.includes('class="a2-depth-visual"')&&depthCompanion.includes('role="img"')&&depthCompanion.includes("aria-labelledby");
  die(inlineVisuals.length>=1||companionVisual,id+" needs an inline or depth-companion accessible mathematical representation");
  if(inlineVisuals.length)die(html.includes("aria-labelledby="),id+" inline image accessible name and description");
  diagramCount+=Math.max(1,inlineVisuals.length);

  die(/<details[^>]*>[\s\S]*?<summary>[^<]*(?:Reveal|Check|Show)/i.test(html),id+" delayed/student-controlled answer review");

  const worked=html.match(/<section[^>]*data-flow-step="worked"[^>]*>([\s\S]*?)<\/section>/)?.[1]||"";
  die(worked,id+" current worked section");
  const workedCount=(worked.match(/<article>/g)||[]).length;
  die(workedCount>=2,id+" core worked step needs at least two examples");
  coreWorked+=workedCount;

  const independent=html.match(/<section[^>]*data-flow-step="independent"[^>]*>([\s\S]*?)<\/section>/)?.[1]||"";
  die(independent,id+" current independent section");
  const independentCount=(independent.match(/<li>/g)||[]).length;
  die(independentCount>=3,id+" independent practice needs at least three tasks");
  independentTasks+=independentCount;

  die(html.includes("algebra2-exceptional-lesson-depth-units10-11-v1.js"),id+" exceptional-depth companion loader preserved");
  die(depthCompanion.includes('"'+id+'"'),id+" exceptional-depth companion data exists");
  depthCoverage++;

  for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   const uri=m[1];
   if(/^(?:https?:|mailto:|tel:|data:|#)/i.test(uri))continue;
   const rel=uri.split(/[?#]/)[0];
   if(!rel)continue;
   const target=rel.startsWith("/")
     ? rel.replace(/^\/+Khaemenes_High\.github\.io\//,"")
     : path.posix.normalize(path.posix.join(path.posix.dirname(filepath),rel));
   die(fs.existsSync(target)||fs.existsSync(target+"/index.html"),id+" broken local resource "+uri);
  }
 }
}
assert.equal(lessons,18);
die(depthCoverage===18,"all Unit 10–11 lessons covered by exceptional-depth companion");
die(coreWorked>=36,"all lessons retain at least two core worked examples");
die(independentTasks>=54,"all lessons retain substantial independent practice");
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
console.log("PASS: "+lessons+" Algebra II Unit 10–11 lessons; "+coreWorked+" core worked examples, "+independentTasks+" independent tasks, "+
 diagramCount+" accessible diagrams, "+gameLaunchers+" retained canonical game launchers, 18 exceptional-depth companion records, route preservation, and exact/numerical mathematics cross-checks.");
