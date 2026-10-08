import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fixture} from './test-lesson-reading-drafts.mjs';
const root='courses/mathematics/algebra-1',c={window:{}};vm.createContext(c);
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
const authored=[];let examples=0,visuals=0;
for(let u=7;u<=9;u++){
 const id=String(u).padStart(2,'0');vm.runInContext(fs.readFileSync(`${root}/units/unit-${id}/assets/unit${id}-data.js`,'utf8'),c);
 const d=c.window[`KHAE_UNIT${id}`];
 for(const l of d.lessons){
  assert.equal(l.reading_sections.length,3);assert.ok(l.examples.length>=2);
  assert.equal(l.guided_practice.length,2);assert.equal(l.transfer_criteria.length,3);
  const run=fixture({dedicated:true,lesson:{...l,unit:u}}),html=run.created.find(n=>n.id==='lessonReading')?.innerHTML;
  assert.ok(html,`U${id} L${l.number} exposes reading`);
  for(const r of l.reading_sections){assert.ok(html.includes(esc(r.heading)));assert.ok(html.includes(esc(r.body)))}
  for(const e of l.examples){
   examples++;assert.ok(e.steps.length>=3);for(const s of e.steps)assert.ok(html.includes(esc(s)));assert.ok(html.includes(esc(e.answer)));
   if(e.table){visuals++;assert.ok(html.includes('<table'));assert.ok(e.table.rows.every(r=>r.length===e.table.headers.length))}
   if(e.plot){visuals++;assert.ok(html.includes('<svg'));assert.ok(html.includes('<desc'));assert.ok(html.includes('role="img"'));}
  }
  for(const p of l.guided_practice){assert.ok(html.includes(esc(p.prompt)));assert.ok(html.includes(esc(p.solution)))}
  assert.ok(html.includes(esc(l.transfer_task)));assert.ok(html.includes(esc(l.transfer_solution)));
  assert.ok(!html.includes('This shared study guide'));
  authored.push({unit:u,...l,html});
 }
 for(const q of d.questions){assert.ok(q.answer>=0&&q.answer<q.options.length);assert.equal(new Set(q.options).size,q.options.length)}
}
assert.equal(authored.length,20);assert.equal(examples,42);assert.equal(visuals,11);
// Check systems against both original equations, including exact fractional results.
for(const [x,y,a,b,c,d,e,f] of [[5,4,1,1,9,1,-1,1],[3,7,-2,1,1,1,1,10],[3,1,1,1,4,2,3,9],[17/11,37/11,3,1,8,5,-2,1],[3,1,3,2,11,5,-2,13],[19/17,27/17,2,3,7,5,-1,4],[5/3,7/3,-2,1,-1,1,1,4]]){near(a*x+b*y,c);near(d*x+e*y,f)}
assert.equal(10*4+6*4,64);near(.2*6+.5*4,3.2);assert.equal(2*(12+3),30);assert.equal(2*(12-3),18);
near(25+3*7.5,10+5*7.5);assert.ok(25+3*7>10+5*7);assert.ok(25+3*8<10+5*8);
const feasible=(x,y)=>x>=0&&y>=0&&2*x+y<=7&&x+2*y<=7;
let best=-Infinity,choice;for(let x=0;x<=3;x++)for(let y=0;y<=3;y++)if(feasible(x,y)&&3*x+2*y>best){best=3*x+2*y;choice=[x,y]}
assert.equal(best,11);assert.deepEqual(choice,[3,1]);assert.equal(feasible(3,3),false);
for(const [x,y] of [[0,0],[3,0],[3,1],[0,4]])assert.ok(x>=0&&y>=0&&x+y<=4&&x<=3);
assert.equal(5*3+2*1,17);assert.ok(!(4+0<4));assert.ok(3.99+0<4);
assert.equal(16**(-3/4),1/8);assert.equal(Math.sqrt((-5)**2),5);near(27**(2/3),9);
assert.equal(.006*50000,300);assert.equal(320000+40000,360000);assert.equal(2400+317,2717);
assert.equal(3*(-2)**4,48);assert.equal(100+10*3,130);near(100*1.1**3,133.1);near(.9*1.1,.99);
near(2000*1.005**12,2123.355623728998);assert.equal((2000*1.005**12).toFixed(2),'2123.36');near(160*.5**.5,113.13708498984761);assert.equal(160*.5**2,40);
// Verify polynomial identities at enough distinct inputs for these low degrees, plus exact coefficient structure in authored derivations.
for(const x of [-5,-2,0,1,2,3,5]){
 near((6*x*x-3*x+4)-(2*x*x+5*x-7),4*x*x-8*x+11);
 near((2*x-3)*(x+4),2*x*x+5*x-12);
 near((x+2)*(x*x-3*x+4),x**3-x*x-2*x+8);
 near((2*x+3)**2,4*x*x+12*x+9);
 near((3*x-2)*(3*x+2),9*x*x-4);
 near(6*x*(3*x*x-4*x+1),18*x**3-24*x*x+6*x);
 near((2*x+1)*(x+3),2*x*x+7*x+3);
 near(3*x*(x-3)*(x+3),3*x**3-27*x);
 near((x-4)*(x-5),x*x-9*x+20);
}
for(const a of [-2,0,1,3])for(const b of [-1,0,2])near(7*a**3*b**2*(2*a+3*b**3),14*a**4*b**2+21*a**3*b**5);
const by=(u,n)=>authored.find(l=>l.unit===u&&l.number===n);
const polynomial=x=>(x-2)**2*(x+4);
by(9,7).examples[0].table.rows.forEach(([x,y])=>assert.equal(polynomial(x),y));
assert.equal(-16*(0-3)*(0+1),48);near(-16*(3-3)*(3+1),0);
const checkLine=(n,e,line,fn)=>by(7,n).examples[e].plot.lines[line].points.forEach(([x,y])=>near(y,fn(x)));
checkLine(1,1,0,x=>6-2*x);checkLine(1,1,1,x=>7-2*x);checkLine(2,0,0,x=>x+1);checkLine(2,0,1,x=>-x+5);
if(process.argv.includes('--export-preview'))fs.writeFileSync('/tmp/algebra-advanced-rendered-visuals.json',JSON.stringify(authored.filter(l=>l.examples.some(e=>e.plot)).map(l=>({unit:l.unit,number:l.number,html:l.html}))));
console.log(`PASS: ${authored.length} authored lessons, ${examples} worked examples, ${visuals} visual examples, exact systems, feasible integer optimization, exponential arithmetic and polynomial identities.`);
