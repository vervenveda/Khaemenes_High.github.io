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
// Verify lesson metadata and the complete six-lesson assessment question bank.
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'assets/unit01-data.js'),'utf8'),context);
const data=context.window.KHAE_UNIT01;
assert.equal(data?.lessons?.length,6,'Six curriculum lessons are required');
const seenIds=new Set();
for(let n=1;n<=6;n++){
 const lesson=data.lessons[n-1];
 assert.equal(lesson.number,n,'Incorrect lesson sequence');
 assert.ok(pages.includes(lesson.file),'Metadata points to a missing lesson: '+lesson.file);
 assert.ok(lesson.title&&lesson.objectives?.length&&lesson.reading_sections?.length,'Incomplete teaching record: '+n);
 const questions=data.questions.filter(q=>q.lesson===n);
 assert.ok(questions.length>=8,'At least eight lesson-check questions are required for lesson '+n);
 for(const q of questions){
  assert.ok(q.id&&!seenIds.has(q.id),'Duplicate or missing question ID: '+q.id);
  seenIds.add(q.id);
  assert.ok(Array.isArray(q.options)&&q.options.length>=2,'Insufficient question options: '+q.id);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length,'Invalid answer index: '+q.id);
  assert.ok(q.explanation,'Feedback explanation missing: '+q.id);
 }
}
const unit=fs.readFileSync(path.join(root,'assets/unit01.js'),'utf8');
assert.match(unit,/function lessonUnlocked\(/,'Unit 01 lesson access contract missing');
assert.match(unit,/function weekMastered\(/,'Unit 01 weekly mastery check missing');
assert.match(unit,/function installRetry\(/,'Unit 01 retake handler contract missing');
assert.match(unit,/function installLessonWritingDraft\(/,'Lesson writing recovery missing');
assert.match(unit,/installLessonWritingDraft\(n\);bind\(items/,'Writing recovery must initialize on lesson pages');
for(const field of ['Discovery notes','Lab notes','Mathematical defense']){
 assert.ok(unit.includes(field),'Required lesson writing field missing: '+field);
}
assert.ok(unit.includes('khaemenes-algebra1-unit01-lesson-writing-v1-'),'Lesson draft storage key missing');

console.log('PASS Unit 01: six ordered lesson entrances, local script/style targets, JS syntax and mastery gates');
