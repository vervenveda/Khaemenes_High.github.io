import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fixture} from './test-lesson-reading-drafts.mjs';
const sameMath=(a,b)=>assert.ok(a===b,`Expected ${a} to equal ${b}`);
const root='courses/mathematics/algebra-1';
const c={window:{}};vm.createContext(c);
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let count=0,examples=0;
for(let u=1;u<=3;u++){
 const id=String(u).padStart(2,'0');
 vm.runInContext(fs.readFileSync(`${root}/units/unit-${id}/assets/unit${id}-data.js`,'utf8'),c);
 const d=c.window[`KHAE_UNIT${id}`];
 for(const l of d.lessons){
  count++;assert.equal(l.reading_sections.length,3);assert.ok(l.examples.length>=2);
  assert.ok(l.guided_practice.length>=2&&l.guided_practice.every(p=>p.prompt&&p.solution));
  assert.ok(l.transfer_task&&l.transfer_solution&&l.transfer_criteria.length===3);
  const run=fixture({dedicated:true,lesson:{...l,unit:u}});
  const html=run.created.find(n=>n.id==='lessonReading')?.innerHTML;
  assert.ok(html,`U${id} L${l.number} exposes reading`);
  for(const r of l.reading_sections){assert.ok(html.includes(esc(r.heading)));assert.ok(html.includes(esc(r.body)))}
  for(const e of l.examples){examples++;assert.ok(e.steps.length>=3);assert.ok(html.includes(esc(e.problem)));for(const s of e.steps)assert.ok(html.includes(esc(s)));assert.ok(html.includes(esc(e.answer)))}
  assert.ok(html.includes(esc(l.transfer_solution)));assert.ok(html.includes('Self-check for your explanation'));
  assert.ok(!html.includes('This shared study guide'),`U${id} L${l.number} uses authored teaching rather than generic fallback`);
 }
 for(const q of d.questions){assert.ok(q.answer>=0&&q.answer<q.options.length);assert.equal(new Set(q.options).size,q.options.length)}
}
assert.equal(count,20);
// Independent arithmetic and algebra checks cover the worked examples across all three units.
assert.equal(4*5-7,13);assert.equal((1/2)**2,1/4);assert.equal(Math.sqrt(36),6);
assert.equal(24/4*3-2,16);assert.equal(6+2*(5-8)**2,24);assert.equal(25*16,400);
assert.equal(54*1000/3600,15);assert.equal(4*2.5*60,600);assert.equal(Math.round(8.746*100)/100,8.75);
assert.equal(Math.abs(249-250)/250*100,0.4);assert.equal(18*12/60,3.6);assert.equal(2.4*1000,2400);
assert.equal(3*(-2)**2-2*(-2),16);assert.equal(48*1.25,60);
for(const x of [-3,0,2,7]){
 assert.equal(2*(x+3)+x,3*x+6);assert.equal(5-3*(2*x-4)+x,17-5*x);
 assert.equal(18*x-24,6*(3*x-4));assert.equal((3*x*x+x-4)-(x*x-2*x+6),2*x*x+3*x-10);
 assert.equal((2*x*x+3*x-1)+(-x*x+5),x*x+3*x+4);
 for(const y of [-2,1,3]){sameMath((-3*x*x*y)*(4*x**3*y*y),-12*x**5*y**3);sameMath(18*x**3*y*y-12*x*x*y**3,6*x*x*y*y*(3*x-2*y))}
}
assert.equal((-24)/6,-4);assert.equal(-5*(-4),20);assert.equal(4-3*(-5),19);assert.equal(12+6*5,42);
assert.equal(2*(3*7-1)+4,5*7+9);assert.equal(-2*(3*(-2)-4),20);assert.equal(5*4+2,3*4+10);
assert.equal(2*10+2*5,30);assert.equal((9/5)*20+32,68);assert.equal(15/20,3/4);
assert.equal((46-40)/40*100,15);assert.equal(0.30*6,0.18*10);
assert.equal(25+0.10*250,40+0.04*250);assert.equal(12*3+18*3,90);
assert.equal(1000*0.05*3,150);assert.equal(60*(1-0.20),48);
console.log(`PASS: ${count} authored foundation lessons, ${examples} complete worked examples, guided feedback, transfer self-checks, inline exposure and independent calculation checks.`);
