import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const paths=[10,11,12].map(g=>`courses/language-arts/english-${g}/service-worker.js`).concat([10,11,12].map(g=>`courses/social-studies/grade-${g}/service-worker.js`),'courses/social-studies/grade-11/personal-finance/service-worker.js');
for(const file of paths){
 const handlers={},deleted=[];let wait;
 const source=fs.readFileSync(file,'utf8');const own=source.match(/const\s+(CACHE_NAME|CACHE)\s*=\s*["']([^"']+)/)[2];
 // Each English release must delete its previous course-only cache without
 // ever deleting its active cache or another curriculum's storage.
 const earlier={
  "courses/language-arts/english-10/service-worker.js":"khae-english10-v3-studios-20261016",
  "courses/language-arts/english-11/service-worker.js":"khae-english11-v2-repair-20261012",
  "courses/language-arts/english-12/service-worker.js":"khae-english12-v2-repair-20261012"
 };
 const previous=earlier[file]||own.replace(/-repair-20261012$/,'');
 assert.notEqual(previous,own,"Test must exercise a genuinely older cache key");
 const context={self:{addEventListener:(n,fn)=>handlers[n]=fn,clients:{claim:()=>Promise.resolve()}},caches:{keys:()=>Promise.resolve([own,previous,'khaemenes-prealgebra-v1','unrelated-course-cache']),delete:k=>{deleted.push(k);return Promise.resolve(true)}},URL,console};
 vm.runInNewContext(source,context);handlers.activate({waitUntil:p=>wait=p});await wait;
 assert.deepEqual(deleted,[previous],file+': only the older version of this course may be deleted');console.log('PASS:',file,'keeps current and other-course caches');
}
