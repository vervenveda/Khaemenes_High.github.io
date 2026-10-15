
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const canonical=fs.readFileSync(path.join(root,'weeks/week-01/index.html'),'utf8');
const runtime=fs.readFileSync(path.join(root,'assets/daily-lesson.js'),'utf8');
assert.doesNotThrow(()=>new vm.Script(runtime),'Daily lesson runtime must parse');
assert.match(runtime,/snapshot\.get\(key\)/,'Compare-before-write protected saving');
assert.match(runtime,/khaemenes_active_learner_v1/,'Learner identity guard');
assert.match(runtime,/week-01-day-/,'Day evidence uses canonical course progress map');
assert.match(runtime,/baselineSaved/,'Day 1 first draft must be preserved');
assert.match(runtime,/!\s*profile/,'No unassigned student records are opened');
assert.match(canonical,/data-english9-daily-index/,'Original weekly page links to daily lessons');
assert.doesNotMatch(canonical,/href="\.\.\/\.\.\/assets\/daily-lesson\.css"/,'Canonical weekly styles must remain isolated');
function pathsFor(html){return [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(m=>m[1]);}
for(let day=1;day<=5;day++){
  const folder=path.join(root,'weeks','week-01','day-'+String(day).padStart(2,'0'));
  const html=fs.readFileSync(path.join(folder,'index.html'),'utf8');
  const sections=[...html.matchAll(/<section class="phase" data-day="(\d+)" data-phase="([^"]+)"/g)];
  assert.deepEqual(sections.map(x=>x[2]),['read','practice','write','check'],'Daily phases must match canonical lesson order');
  assert.ok(sections.every(x=>Number(x[1])===day));
  const saved=[...html.matchAll(/data-save-field="([^"]+)"/g)].map(m=>m[1]);
  const original=[...canonical.matchAll(new RegExp('data-save-field="(week-01-day'+day+'[^"]+)"','g'))].map(m=>m[1]);
  assert.deepEqual(saved,original,'Day '+day+' uses exact canonical response fields');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,'No duplicate element IDs');
  const data=html.match(/<script type="application\/json" id="daily-exercise-data">([\s\S]*?)<\/script>/);
  assert.ok(data,'Interactive bank present');
  const bank=JSON.parse(data[1]);
  assert.equal(bank.items.length,5,'Each five-question practice allows a true 80% score');
  bank.items.forEach(q=>{
    assert.ok(q.question&&q.explanation&&Array.isArray(q.choices)&&q.choices.length>=3);
    assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.choices.length);
    assert.equal(new Set(q.choices).size,q.choices.length);
  });
  for(const href of pathsFor(html)){
    const url=href.split(/[?#]/)[0];
    if(!url||/^(?:[a-z][a-z\d+.-]*:|\/\/|\/)/i.test(url))continue;
    assert.ok(fs.existsSync(path.resolve(folder,decodeURIComponent(url))),'Missing relative link: day '+day+' → '+href);
  }
  assert.match(canonical,new RegExp('day-'+String(day).padStart(2,'0')+'/index\\.html'),'Hub links to day '+day);
}
console.log('PASS: English 9 five individual lessons · 20 canonical phases · 25 practice prompts · exact learner field keys · syntax · links · ID uniqueness');
