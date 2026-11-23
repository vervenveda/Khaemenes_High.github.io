import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root='courses/mathematics/pre-algebra/units/unit-01/';
const map=JSON.parse(fs.readFileSync(root+'unit-map.json','utf8'));
assert.equal(map.unit.mastery_threshold,80,'80% mastery preserved');
assert.equal(map.lessons.length,6,'six original lessons retained');
let scripts=0;
for(const lesson of map.lessons){
 const file=path.posix.join(root,lesson.file),html=fs.readFileSync(file,'utf8');
 assert.match(html,/<\/body>\s*<\/html>\s*$/i,file+' unexpected content after the closing document');
 assert.equal((html.match(/<\/html>/gi)||[]).length,1,file+' exactly one closing document');
 if(lesson.number===1){
  assert.ok(html.includes('../assets/lesson-engine.js'),file+' keeps current canonical Unit 01 lesson engine');
  assert.ok(html.includes('khaemenes-math-engine-v1.js'),file+' keeps canonical Mathematics Engine owner');
  assert.ok(html.includes('data-engine-owner="canonical"'),file+' keeps canonical engine ownership marker');
 }else{
  assert.ok(html.includes('../assets/lesson-engine.js'),file+' keeps original lesson engine');
  assert.ok(html.includes('course-entry-contract.js'),file+' keeps Academy identity contract');
  assert.ok(html.includes('learner-scope-v1.js'),file+' keeps learner isolation');
 }
 assert.ok(html.includes('prealgebra-math-lesson-v2-adapter.js?v=2.3.0'),file+' keeps Mathematics Engine v2.3.0 adapter');
 for(const m of html.matchAll(/<script\b[^>]*\bsrc="([^"]+\.js)(?:\?[^"]*)?"/gi)){
  const src=m[1];if(/^https?:/.test(src))continue;
  const prefix="/Khaemenes_High.github.io/";
  const relative=src.startsWith(prefix)
   ? src.slice(prefix.length)
   : src.startsWith("/")
    ? src.slice(1)
    : path.posix.normalize(path.posix.join(path.posix.dirname(file),src));
  assert.ok(fs.existsSync(relative),file+' missing '+src);
  scripts++;
 }
}
const lesson3=fs.readFileSync(root+map.lessons[2].file,'utf8');
assert.ok(lesson3.includes('Prime')&&lesson3.includes('Divisibility'),'prime factorization lesson intact');
assert.ok(!lesson3.includes('prealgebra_unit01_lesson03_organized_file_tree.html'),'stray filename removed');
console.log('PASS: Pre-Algebra Unit 01 all six lesson documents close cleanly, '+scripts+' scripts resolve, current lesson engines remain under the canonical Math owner and v2.3.0 adapter, 80% mastery untouched.');
