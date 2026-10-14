import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const helper=fs.readFileSync('courses/shared/learner-scope-v1.js','utf8');
let checks=0;
function context(scope, values=new Map(), learner='a'){
 class MemoryStorage { constructor(){this.values=values}getItem(k){return this.values.get(String(k))??null}setItem(k,v){this.values.set(String(k),String(v))}removeItem(k){this.values.delete(String(k))}key(i){return [...this.values.keys()][i]??null}get length(){return this.values.size} }
 let profile={learnerId:learner,name:learner};const storage=new MemoryStorage();
 const c={Storage:MemoryStorage,localStorage:storage,window:{localStorage:storage,addEventListener(){},KhaemenesCourseEntryContract:{readAcademyProfile:()=>profile}},document:{currentScript:{dataset:{learnerScope:scope}},readyState:'loading',addEventListener(){}},Date,JSON,console};
 vm.createContext(c);vm.runInContext(helper,c);return {c,storage,values,switchTo:id=>profile=id?{learnerId:id,name:id}:null};
}
for(const [scope,key] of [['pre-algebra','khaemenes-prealgebra-u01-mastery-v1'],['algebra-1','khaemenes-algebra1-course-v1'],['geometry','khaemenes-geometry-assessment-records-v1'],['algebra-2','khaemenes-algebra2-assessment-records-v1'],['english-10','khae-ela10-state-v1'],['english-11','khae-ela11-state-v1'],['english-12','khae-ela12-state-v1'],['math-games','khaemenes.circle-theorem-studio.v1']]){
 const legacy='{"best_percent":100}',map=new Map([[key,legacy]]);
 const a=context(scope,map);
 assert.equal(a.storage.getItem(key),null,'Unclaimed records require ownership review');
 assert.throws(()=>a.storage.setItem(key,'new'),'Unclaimed device evidence cannot be overwritten');
 assert.equal(map.get(key),legacy);
 assert.equal(a.c.window.KhaemenesLearnerScope.claimLegacy(key),true);
 assert.equal(a.storage.getItem(key),legacy);assert.equal(map.get(key),legacy);
 assert.equal(a.storage.getItem(key+':learner:a'),legacy,'Already scoped reads are idempotent');
 const b=context(scope,map,'b');assert.equal(b.storage.getItem(key),null);
 assert.equal(b.storage.getItem(key+':learner:a'),null,'Foreign enumerated keys are unreadable');
 b.storage.setItem(key,'b record');assert.equal(b.storage.getItem(key),'b record');
 assert.equal(map.get(key+':learner:a'),legacy);assert.ok(![...map.keys()].some(k=>/:learner:.*:learner:/.test(k)));
 b.switchTo('a');assert.throws(()=>b.storage.setItem(key,'stale b'),'Stale pages cannot write to the newly selected learner');
 const fresh=context(scope,map,'a');assert.equal(fresh.storage.getItem(key),legacy);checks+=12;
}
const groupKey='KHAE_OPEN_PREALGEBRA_FORGE_V2';
const groupText=JSON.stringify({students:[{id:'old-a',name:'A',weeks:{1:true}},{id:'old-b',name:'B',weeks:{2:true}}],activeId:'old-a'});
const groupMap=new Map([[groupKey,groupText]]),groupA=context('pre-algebra',groupMap),groupB=context('pre-algebra',groupMap,'b');
assert.equal(groupA.c.window.KhaemenesLearnerScope.claimLegacy(groupKey),false,'Mixed-student records require an explicit saved-student choice');
assert.equal(groupA.c.window.KhaemenesLearnerScope.claimLegacy(groupKey,'old-a'),true);
assert.equal(groupB.c.window.KhaemenesLearnerScope.claimLegacy(groupKey,'old-b'),true);
assert.equal(JSON.parse(groupA.storage.getItem(groupKey)).students.length,1);
assert.equal(JSON.parse(groupB.storage.getItem(groupKey)).students[0].id,'old-b');
assert.equal(groupMap.get(groupKey),groupText,'The original multi-student record remains available');checks+=6;
// Reproduce the actual Pre-Algebra Unit 02 prefix enumeration against another learner's evidence.
const map=new Map();const a=context('pre-algebra',map);a.storage.setItem('khaemenes-prealgebra-u01-mastery-v1',JSON.stringify({best_percent:100}));
const b=context('pre-algebra',map,'b');
const source=fs.readFileSync('courses/mathematics/pre-algebra/units/unit-02/assets/lesson-engine.js','utf8');
const gate=source.match(/function unitMastered\(n\)\{[\s\S]*?return false\}/)[0];
vm.runInContext('const MIN=80,pad=n=>String(n).padStart(2,"0");function read(k){try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}}function bestFromResult(r){return Number(r?.best_percent)||0}'+gate,b.c);
assert.equal(vm.runInContext('unitMastered(1)',b.c),false,'Learner B must not inherit A prerequisite mastery');checks++;
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)])}
for(const course of ['pre-algebra','algebra-1','geometry','algebra-2'])for(const file of walk('courses/mathematics/'+course).filter(p=>p.endsWith('.html'))){
 const html=fs.readFileSync(file,'utf8');if(!/<head\\b/i.test(html))continue;
 // Standalone, review-only teaching resources do not access learner identity or evidence.
 // Keep this exemption narrow and require zero storage or network dependencies.
 if(file.replaceAll('\\','/').startsWith('courses/mathematics/algebra-1/instructional-repair-pack/resource-studio/')){
  assert.ok(!/\b(?:localStorage|sessionStorage|indexedDB)\s*[.(]/.test(html),file+': staged resources cannot touch storage');
  assert.ok(!/<script\b[^>]*\bsrc\s*=/.test(html),file+': staged resources cannot load scripts');
  assert.ok(!/\b(?:fetch|XMLHttpRequest)\s*\(/.test(html),file+': staged resources cannot fetch data');
  checks++;continue;
 }
 const head=html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];assert.ok(head,file);
 assert.equal((html.match(/learner-scope-v1\.js/g)||[]).length,1,file+': adapter must load exactly once');
 assert.ok(head.indexOf('course-entry-contract.js')<head.indexOf('learner-scope-v1.js'),file+': contract precedes storage');
 for(const match of head.matchAll(/<script[^>]*src="([^"]*(?:course-entry-contract|learner-scope-v1)\.js[^\"]*)"/g))assert.ok(fs.existsSync(path.resolve(path.dirname(file),match[1].split('?')[0])),file+': identity dependency exists');
 checks++;
}
console.log(`Learner-scoped persistence validation passed (${checks} checks, identity switches, explicit recovery, direct math routes and cross-learner Unit 02 regression).`);
