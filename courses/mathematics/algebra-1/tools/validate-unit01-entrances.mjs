// Algebra I Unit 01: static, fail-closed lesson entrance and dependency contract.
// Run from repository root: node courses/mathematics/algebra-1/tools/validate-unit01-entrances.mjs
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const root='courses/mathematics/algebra-1/units/unit-01';
const dir=path.join(root,'lessons');
const pages=fs.readdirSync(dir).filter(f=>/^lesson-\d\d-.*\.html$/.test(f)).sort();
assert.equal(pages.length,6,'Unit 01 must expose exactly six named lesson pages');
const required=[
  '../assets/unit01-data.js',
  '../../../assets/readiness-entry-gate-v1.js',
  '../assets/unit01.js',
  '../../../assets/deep-lesson-engine-v1.js',
  '../../../assets/lesson-resource-map.js',
  '../../../assets/lesson-resource-bridge-v1.js'
];
for(let n=1;n<=6;n++){
 const name=pages[n-1],number=String(n).padStart(2,'0');
 assert.ok(name.startsWith('lesson-'+number+'-'),'Lesson order or filename missing: '+number);
 const filename=path.join(dir,name),html=fs.readFileSync(filename,'utf8');
 assert.match(html,/<main\s+id="main"\s*>/i, name+': lesson mount missing');
 assert.match(html,new RegExp('data-mode="lesson"[^>]*data-lesson="'+n+'"'),name+': lesson identity missing');
 const scriptSrc=[...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/gi)].map(m=>m[1].split('?')[0]);
 for(const src of required)assert.ok(scriptSrc.includes(src),name+': required script missing: '+src);
 for(const match of html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"/gi)){
  const ref=match[1].split(/[?#]/)[0];
  if(!ref||/^(?:https?:|data:|\/\/|#)/i.test(ref))continue;
  const resolved=path.resolve(dir,ref);
  assert.ok(fs.existsSync(resolved),name+': missing local dependency '+ref);
 }
 for(const src of scriptSrc){
  if(!src.endsWith('.js'))continue;
  const absolute=path.resolve(dir,src);
  if(fs.existsSync(absolute))new vm.Script(fs.readFileSync(absolute,'utf8'),{filename:absolute});
 }
}
const unit=fs.readFileSync(path.join(root,'assets/unit01.js'),'utf8');
assert.match(unit,/function lessonUnlocked\(/,'Unit 01 lesson access contract missing');
assert.match(unit,/function weekMastered\(/,'Unit 01 weekly mastery check missing');
assert.match(unit,/function installRetry\(/,'Unit 01 retake handler contract missing');
console.log('PASS Unit 01: six ordered lesson entrances, local script/style targets, JS syntax and mastery gates');
