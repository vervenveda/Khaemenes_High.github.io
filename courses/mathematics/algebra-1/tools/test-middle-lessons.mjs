import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fixture} from './test-lesson-reading-drafts.mjs';
const root='courses/mathematics/algebra-1',c={window:{}};vm.createContext(c);
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
const authored=[];let count=0,examples=0,visuals=0;
for(let u=4;u<=6;u++){
 const id=String(u).padStart(2,'0');vm.runInContext(fs.readFileSync(`${root}/units/unit-${id}/assets/unit${id}-data.js`,'utf8'),c);
 const d=c.window[`KHAE_UNIT${id}`];
 for(const l of d.lessons){
  count++;assert.equal(l.reading_sections.length,3);assert.ok(l.examples.length>=2);
  assert.ok(l.guided_practice.length>=2&&l.guided_practice.every(p=>p.prompt&&p.solution));
  assert.ok(l.transfer_task&&l.transfer_solution&&l.transfer_criteria.length===3);
  const run=fixture({dedicated:true,lesson:{...l,unit:u}}),html=run.created.find(n=>n.id==='lessonReading')?.innerHTML;
  assert.ok(html,`U${id} L${l.number} exposes authored reading`);
  for(const r of l.reading_sections){assert.ok(html.includes(esc(r.heading)));assert.ok(html.includes(esc(r.body)))}
  for(const e of l.examples){
   examples++;assert.ok(e.steps.length>=3);for(const s of e.steps)assert.ok(html.includes(esc(s)));assert.ok(html.includes(esc(e.answer)));
   if(e.table){assert.ok(html.includes('<table'));assert.ok(e.table.rows.every(r=>r.length===e.table.headers.length))}
   if(e.plot||e.number_line){visuals++;assert.ok(html.includes('<svg'));assert.ok(html.includes('<desc'));assert.ok(html.includes('role="img"'));}
  }
  assert.ok(html.includes(esc(l.transfer_solution)));assert.ok(!html.includes('This shared study guide'));
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'SVG title/clip identifiers are unique within a lesson');
  authored.push({unit:u,...l,html});
 }
 for(const q of d.questions){assert.ok(q.answer>=0&&q.answer<q.options.length);assert.equal(new Set(q.options).size,q.options.length)}
}
assert.equal(count,21);assert.equal(examples,44);
// Verify worked solution sets at endpoints, interiors, and excluded values.
for(const x of [-5,-4,-3,0,3,4,5,6]){
 assert.equal(3*(x+2)<=18,x<=4);assert.equal(3-2*x<=11,x>=-4);
 assert.equal(-4*(x-1)>12,x<-2);assert.equal(1<2*x+3&&2*x+3<=9,-1<x&&x<=3);
 assert.equal(Math.abs(2*x-4)<=6,-1<=x&&x<=5);assert.equal(Math.abs(x+1)>4,x<-5||x>3);
}
for(const x of [-1,7])assert.equal(2*Math.abs(x-3)+1,9);
for(const x of [3,-7/3])near(Math.abs(3*x-1),8);
assert.equal(2*(-2)**2-3,5);assert.equal(2*4+5,13);
assert.equal(3*7+2,23);assert.equal(4*7-1,27);assert.equal((28+1)/4,7.25);
assert.equal((-5-5)/(3-(-2)),-2);assert.equal((21-12)/(11-8),3);
assert.equal((10-4)/(3-1),3);assert.equal((22-10)/(7-3),3);assert.equal((11-2)/(2-5),-3);
assert.equal(3*2-5,1);assert.equal(2.5*6+4,19);
assert.equal(3*2-4,2);assert.equal(2*6+3*0,12);assert.equal(2*0+3*4,12);
assert.equal(2*(-1/2),-1);assert.equal((-2/5)*(5/2),-1);
const data=[[0,1],[1,3],[2,4],[3,6]],xbar=1.5,ybar=3.5;
const numerator=data.reduce((sum,[x,y])=>sum+(x-xbar)*(y-ybar),0);
const denominator=data.reduce((sum,[x])=>sum+(x-xbar)**2,0);
near(numerator,8);near(denominator,5);near(numerator/denominator,1.6);near(ybar-1.6*xbar,1.1);
const residuals=data.map(([x,y])=>y-(1.6*x+1.1));residuals.forEach((r,i)=>near(r,[-0.1,0.3,-0.3,0.1][i]));near(residuals.reduce((s,r)=>s+r*r,0),0.2);
assert.equal(20+5*6,50);assert.equal(8*6,48);assert.equal(20+5*7,55);assert.equal(8*7,56);
assert.equal(200-8*12,104);assert.equal(200-8*25,0);
// Check plotted data against the lesson equations, independent of SVG rendering.
const by=(u,n)=>authored.find(l=>l.unit===u&&l.number===n);
const checkLine=(u,n,e,line,fn)=>by(u,n).examples[e].plot.lines[line].points.forEach(([x,y])=>near(y,fn(x)));
checkLine(5,3,1,0,x=>2*x+1);checkLine(5,4,0,0,x=>2*x+2);checkLine(5,5,0,0,x=>-Math.abs(x-2)+4);
checkLine(5,6,0,0,x=>x+1);checkLine(5,6,0,1,x=>2*x);
checkLine(6,1,0,0,x=>-2*x+1);checkLine(6,2,0,0,x=>3*x+1);checkLine(6,3,0,0,x=>3*x-5);
checkLine(6,4,1,0,x=>(12-2*x)/3);checkLine(6,5,0,0,x=>2*x-5);checkLine(6,5,0,1,x=>2*x+3);checkLine(6,5,0,2,x=>-x/2+3);
checkLine(6,6,0,0,x=>2*x+1);checkLine(6,8,1,0,x=>200-8*x);
const circle=by(5,1).html.match(/<ellipse[^>]*rx="([^"]+)" ry="([^"]+)"/);near(Number(circle[1]),Number(circle[2]));
const boundary=by(5,6).examples[0].plot.points;assert.ok(boundary.find(p=>p.x===0&&p.y===1&&p.open));assert.ok(boundary.find(p=>p.x===0&&p.y===0&&!p.open));
by(5,7).examples[0].plot.points.forEach(p=>{assert.ok(Number.isInteger(p.x)&&p.x>=1);near(p.y,3*p.x+2)});
assert.equal(by(5,7).examples[0].plot.lines.length,0,'Sequence points have no invented intervening domain');
if(process.argv.includes('--export-preview'))fs.writeFileSync('/tmp/algebra-middle-rendered-visuals.json',JSON.stringify(authored.filter(l=>l.examples.some(e=>e.plot||e.number_line)).map(l=>({unit:l.unit,number:l.number,html:l.html}))));
console.log(`PASS: ${count} authored lessons, ${examples} worked examples, ${visuals} visual examples, exact boundary cases, regression arithmetic and plotted equation checks.`);
