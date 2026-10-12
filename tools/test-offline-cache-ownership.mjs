import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const paths=[10,11,12].map(g=>`courses/language-arts/english-${g}/service-worker.js`).concat([10,11,12].map(g=>`courses/social-studies/grade-${g}/service-worker.js`),'courses/social-studies/grade-11/personal-finance/service-worker.js');
for(const file of paths){
 const handlers={},deleted=[];let wait;
 const source=fs.readFileSync(file,'utf8');const own=source.match(/const\s+(CACHE_NAME|CACHE)\s*=\s*["']([^"']+)/)[2];
 const previous=own.replace(/-repair-20261012$/,'');
 const context={self:{addEventListener:(n,fn)=>handlers[n]=fn,clients:{claim:()=>Promise.resolve()}},caches:{keys:()=>Promise.resolve([own,previous,'khaemenes-prealgebra-v1','unrelated-course-cache']),delete:k=>{deleted.push(k);return Promise.resolve(true)}},URL,console};
 vm.runInNewContext(source,context);handlers.activate({waitUntil:p=>wait=p});await wait;
 assert.deepEqual(deleted,[previous],file+': only the older version of this course may be deleted');console.log('PASS:',file,'keeps current and other-course caches');
}
