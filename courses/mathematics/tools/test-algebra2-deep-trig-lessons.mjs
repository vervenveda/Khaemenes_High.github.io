import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root="courses/mathematics/algebra-2/";
const specs=[
 {lesson:"unit-10/lessons/u10-l05.html",slug:"trigonometric-wave-studio",sections:["Visual model · one period of sine and cosine","Independent transfer · check only after solving"],terms:["sin(x+π/2)=cos x","sin(7π/2)=sin(3π/2)=−1","range [−3,1]","sin(x+2π)=sin x"]},
 {lesson:"unit-11/lessons/u11-l06.html",slug:"triangle-law-expedition",sections:["Visual model · side–angle correspondence","Independent transfer · check only after solving"],terms:["a=7, b=10","B₂=180°−B₁≈134.42°","c₁=7sin C₁/sin30°≈13.56","c₂=7sin C₂/sin30°≈3.76"]},
 {lesson:"unit-11/lessons/u11-l07.html",slug:"triangle-law-expedition",sections:["Visual model · included angles and opposite sides","Independent transfer · check only after solving"],terms:["c²=25+64−(2×5×8)cos60°","K=√[10(10−5)(10−8)(10−7)]","C=arccos(−11/24)≈117.28°","c=√67≈8.19"]},
 {lesson:"unit-11/lessons/u11-l08.html",slug:"triangle-law-expedition",sections:["Visual model · two-leg bearing displacement","Independent transfer · check only after solving"],terms:["d≈17.90 km","4√19≈17.44 km","atan2(14,6√3)≈53.41°","2√7≈5.29 km"]}
];
const standard=["Learning objectives","Governing relationship","Worked examples","Guided and independent practice",
 "Differentiated pathways","Application laboratory","Misconception and correction","Mastery evidence","Reflection"];
const files=[];
for(const spec of specs){
 const file=root+"units/"+spec.lesson;
 const html=fs.readFileSync(file,"utf8");files.push(html);
 const sections=[...html.matchAll(/<section class="lesson-section"><h2>([^<]+)<\/h2>/g)].map(m=>m[1]);
 for(const label of [...standard,...spec.sections])assert.ok(sections.includes(label),file+": missing "+label);
 assert.ok(sections.indexOf("Worked examples")<sections.indexOf("Guided and independent practice"),
   "worked instruction precedes independent tasks");
 assert.ok(sections.indexOf("Guided and independent practice")<sections.indexOf("Independent transfer · check only after solving"),
  "independent transfer after guided investigation");
 assert.equal((html.match(/<details>/g)||[]).length,1,file+": exactly one self-check");
 assert.equal((html.match(/<\/details>/g)||[]).length,1,file+": closing self-check");
 assert.ok(/<summary>Reveal worked verification and answers<\/summary>/.test(html),"answers must be student-controlled");
 assert.ok(html.includes('<svg')&&html.includes('role="img"')&&html.includes('<title id=')&&html.includes('<desc id='),
  "accessible diagram required");
 assert.ok(html.includes('style="width:100%;')&&html.includes("height:auto"),"responsive diagram");
 const example=html.match(/<section class="lesson-section"><h2>Worked examples<\/h2>([\s\S]*?)<\/section>/)?.[1];
 assert.ok(example,"worked examples section");
 const count=(example.match(/<article>/g)||[]).length;
 assert.equal(count,2,"two full worked investigations");
 assert.ok((example.match(/<li>/g)||[]).length>=8,"at least eight stepwise moves");
 assert.ok(example.includes("Verification:")||example.includes("Verify"),"worked verification required");
 assert.ok(html.includes('id="lessonComplete"')&&html.includes('id="lessonNote"')&&html.includes('id="saveLessonNote"'),
  "all local lesson records remain intact");
 assert.ok(html.includes('src="../../../assets/lesson-tools.js"'),"notes/progression helper preserved");
 assert.ok(html.includes('src="../../../../assets/shared-game-launcher.js"'),"shared games preserved");
 assert.ok(html.includes('data-game="'+spec.slug+'"'),"expected canonical game still linked");
 for(const term of spec.terms)assert.ok(html.includes(term),file+": expected formula/result missing "+term);
 assert.ok(!/<script[^>]+src="https?:\/\//.test(html),"no new third-party script");
 for(const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)){
  const loc=match[1];if(!loc||/^(?:https?:|mailto:|tel:|data:|#)/i.test(loc))continue;
  const target=path.posix.normalize(path.posix.join(path.posix.dirname(file),loc.split(/[?#]/)[0]));
  assert.ok(fs.existsSync(target)||fs.existsSync(target+"/index.html"),file+": missing local dependency "+loc);
 }
}
const near=(a,b,tolerance=.01)=>Math.abs(a-b)<=tolerance;
const sin=d=>Math.sin(d*Math.PI/180),cos=d=>Math.cos(d*Math.PI/180);
const rad=Math.PI/180;

// Graphing: quarter-cycle landmarks must match the 0, +1, 0, -1, 0 and +1, 0, -1, 0, +1 patterns.
for(let k=0;k<5;k++){
 const theta=k*Math.PI/2;
 const expectedS=[0,1,0,-1,0][k],expectedC=[1,0,-1,0,1][k];
 assert.ok(near(Math.sin(theta),expectedS,1e-12));
 assert.ok(near(Math.cos(theta),expectedC,1e-12));
}
for(let x of [-3,-Math.PI,0,.4,Math.PI,2*Math.PI,10]){
 assert.ok(near(Math.sin(x+Math.PI/2),Math.cos(x),1e-12),"phase identity exact");
 assert.ok(near(Math.cos(x-Math.PI/2),Math.sin(x),1e-12),"shift direction exact");
}
assert.ok(near(Math.sin(7*Math.PI/2),-1,1e-12)&&near(Math.cos(-Math.PI),-1,1e-12));

// Law of Sines and SSA: both possible triangles and positivity.
const A=40,B=65,C=180-A-B,a=10;
const b=a*sin(B)/sin(A),c=a*sin(C)/sin(A);
assert.ok(near(b,14.10)&&near(c,15.03));
assert.ok(near(b/sin(B),a/sin(A),1e-9));
const secondB=Math.asin(5/7)/rad,solutions=[secondB,180-secondB];
assert.equal(solutions.length,2);
for(const beta of solutions){
 const gamma=150-beta, side=7*sin(gamma)/sin(30);
 assert.ok(beta>0&&gamma>0,"all triangle angles positive");
 assert.ok(near(7/sin(30),10/sin(beta),1e-9),"Law of Sines for both SSA possibilities");
 const expected=beta<90?13.56:3.76;
 assert.ok(near(side,expected,.01),"corresponding possible third side");
}
assert.ok(10*sin(30)>4&&near(10*sin(30),5),"SSA zero/one altitude cases");
assert.ok(near(110+Math.asin(sin(110))/rad,180,1e-9),"obtuse SSA a=b leads a degenerate angle sum, not a valid triangle");

// Law of Cosines and Heron's agreement.
const d=Math.sqrt(5**2+8**2-2*5*8*cos(60));
assert.ok(near(d,7,1e-12),"SAS third side");
const area1=.5*5*8*sin(60);
const heron=(a,b,c)=>{const s=(a+b+c)/2;return Math.sqrt(s*(s-a)*(s-b)*(s-c));};
assert.ok(near(area1,10*Math.sqrt(3),1e-9));
assert.ok(near(heron(5,8,7),area1,1e-9),"SAS and SSS area match");
assert.ok(near(Math.acos(-11/24)/rad,117.28,.01));
assert.ok(near(heron(3,4,6),.5*3*4*Math.sin(Math.acos(-11/24)),1e-9));
assert.ok(near(heron(5,5,6),12,1e-9));
assert.ok(near(Math.sqrt(7**2+9**2-2*7*9*cos(60)),Math.sqrt(67),1e-9));

// Navigation: endpoint separation differs from accumulated successive bearing vectors.
const separation=Math.sqrt(12**2+18**2-2*12*18*cos(70));
assert.ok(near(separation,17.90));
const east=12*sin(30)+8,north=12*cos(30);
const resultant=Math.hypot(east,north);
const bearing=Math.atan2(east,north)/rad;
assert.ok(near(east,14,1e-9)&&near(north,6*Math.sqrt(3),1e-9));
assert.ok(near(resultant,4*Math.sqrt(19),1e-9)&&near(resultant,17.44));
assert.ok(near(bearing,53.41,.01),"bearing clockwise from north");
assert.ok(near(resultant*sin(bearing),east,1e-9));
assert.ok(near(resultant*cos(bearing),north,1e-9));
assert.ok(near(Math.sqrt(6**2+8**2-2*6*8*cos(60)),2*Math.sqrt(13),1e-9));
const thirdEast=6*sin(60),thirdNorth=6*cos(60)-4;
assert.ok(near(Math.hypot(thirdEast,thirdNorth),2*Math.sqrt(7),1e-9));
assert.ok(near(Math.atan2(thirdEast,thirdNorth)/rad,100.89,.01));

console.log("PASS: Four Algebra II deep instruction lessons retain navigation/records, show two fully worked models, accessible diagrams, independent self-checks and mathematically verified trigonometry, SSA, cosine/area, and bearings.");
