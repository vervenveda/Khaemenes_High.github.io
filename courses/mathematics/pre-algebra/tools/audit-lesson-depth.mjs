import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const root="courses/mathematics/pre-algebra/units";
const pad=n=>String(n).padStart(2,"0");
const words=s=>(String(s||"").replace(/<[^>]*>/g," ").match(/[\p{L}\p{N}][\p{L}\p{N}'./−]*/gu)||[]).length;
function data(html,file){
 const m=/window\.LESSON_DATA\s*=\s*/.exec(html);
 assert.ok(m,file+": missing lesson data");
 const start=m.index+m[0].length;let depth=0,inside=false,escape=false;
 for(let i=start;i<html.length;i++){
  const c=html[i];
  if(inside){if(escape)escape=false;else if(c==="\\")escape=true;else if(c==='"')inside=false;continue;}
  if(c==='"'){inside=true;continue;}if(c==="{")depth++;
  if(c==="}"&&--depth===0)return JSON.parse(html.slice(start,i+1));
 }
 throw Error(file+": malformed lesson data");
}
const stats=[],lessons=[];
for(let unit=1;unit<=13;unit++){
 const folder=path.join(root,"unit-"+pad(unit),"lessons");
 const files=fs.readdirSync(folder).filter(name=>/^lesson-\d{2}-.*\.html$/.test(name));
 let concepts=0,steps=0,short=0;
 for(const name of files){
  const file=path.join(folder,name),html=fs.readFileSync(file,"utf8"),d=data(html,file);
  assert.equal(d.questions?.length,20,file+": 20 scored questions retained");
  assert.equal(d.mastery_threshold,80,file+": existing 80% mastery retained");
  assert.ok(d.concepts?.length>=3&&d.examples?.length>=3,file+": original concepts and examples retained");
  assert.ok(html.includes('id="practice"')&&html.includes('id="exampleList"')&&
    html.includes('id="pathwayTabs"')&&html.includes('id="reflection"'),file+": original lesson sections retained");
  concepts+=d.concepts.reduce((s,x)=>s+words(x.body),0);
  steps+=d.examples.reduce((s,x)=>s+(x.steps||[]).reduce((a,z)=>a+words(z),0),0);
  short+=d.questions.filter(x=>words(x.explanation)<5).length;
  lessons.push({file,unit,html,d});
 }
 stats.push({unit,count:files.length,concepts:Math.round(concepts/files.length),
  steps:Math.round(steps/files.length),short});
}
assert.equal(lessons.length,97,"All 97 official lessons audited");
const deep=lessons.filter(x=>x.unit===3||x.unit===4);
assert.equal(deep.length,16,"Units 03–04 have sixteen lessons");
let lowest=99999;
for(const item of deep){
 const {file,html}=item,start=html.indexOf('<section id="reasoning-lab"');
 assert.ok(start>=0,file+": new guided studio present");
 assert.equal((html.match(/id="reasoning-lab"/g)||[]).length,1,file+": studio must be unique");
 const end=html.indexOf('</section>',start);
 assert.ok(end>start,file+": studio closes correctly");
 const block=html.slice(start,end+10),length=words(block);
 lowest=Math.min(lowest,length);
 assert.ok(length>=105,file+": rigorous instruction must exceed 105 words; got "+length);
 assert.ok((block.match(/<li>/g)||[]).length>=4,file+": at least four worked reasoning steps");
 for(const phrase of ['<strong>Why it works:</strong>','<strong>Common error and correction:</strong>',
   '<h3>Independent transfer problem</h3>','<details><summary>Reveal the complete transfer solution</summary>'])
  assert.ok(block.includes(phrase),file+": missing "+phrase);
 assert.ok(block.indexOf('<details>')>block.indexOf('Independent transfer problem'),file+": hidden answer follows prompt");
 assert.ok(end<html.indexOf('<section id="practice">'),file+": instruction precedes scored lesson practice");
}
const rational=deep.find(x=>x.unit===3&&x.d.number===1);
assert.ok(rational);
assert.equal(rational.d.questions[19].answer,2,"Rational-only question answer index stays 2");
assert.ok(rational.d.questions[19].explanation.includes("third list"),"Correctly identifies rational third choice");
assert.ok(!rational.d.questions[19].explanation.includes("first list"),"Contradictory rationale removed");
assert.ok(rational.d.questions[19].options[2].includes("0.181818"),"Original answer options preserved");
console.log("PASS: "+lessons.length+" lesson structures inspected, "+deep.length+
 " fully explained reasoning labs, 80% mastery unchanged; minimum new lesson depth "+lowest+" words.");
for(const x of stats)console.log("U"+pad(x.unit)+
 " lessons="+x.count+" conceptWords="+x.concepts+" existingWorkedWords="+x.steps+" shortExplanations="+x.short);
