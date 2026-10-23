import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const adapter = fs.readFileSync('courses/shared/learner-scope-v1.js','utf8');
new vm.Script(adapter,{filename:'learner-scope-v1.js'});
const games = {
 'function-transformation-studio':'KHAE_FTS_V1',
 'exponential-logarithm-lab':'KHAE_EXPLOG_V1',
 'polynomial-zeros-explorer':'KHAE_POLY_V1',
 'matrix-mission-control':'KHAE_MATRIX_MISSION_V1',
 'sequence-series-studio':'KHAE_SEQUENCE_SERIES_V1',
 'complex-plane-lab':'KHAE_COMPLEX_PLANE_V1',
 'statistics-detective':'KHAE_STATISTICS_DETECTIVE_V1',
 'probability-quest':'KHAE_PROBABILITY_QUEST_V1',
 'unit-circle-navigator':'KHAE_UNIT_CIRCLE_V1',
 'trigonometric-wave-studio':'KHAE_TRIG_WAVE_STUDIO_V1',
 'trigonometric-identity-forge':'KHAE_TRIG_IDENTITY_FORGE_V1',
 'triangle-law-expedition':'KHAE_TRIANGLE_EXPEDITION_V1'
};
assert.equal(Object.keys(games).length,12);
const sameDevice=new Map(),scopeEvents=[];
function open(learner,store=sameDevice){
 class Storage {
  constructor(map){this.map=map}
  getItem(key){return this.map.get(String(key))??null}
  setItem(key,value){this.map.set(String(key),String(value))}
  removeItem(key){this.map.delete(String(key))}
  key(index){return [...this.map.keys()][index]??null}
  get length(){return this.map.size}
 }
 let profile=learner?{learnerId:learner,name:learner}:null;
 const local=new Storage(store),other=new Storage(new Map());
 const handlers=new Map();
 const document={currentScript:{dataset:{learnerScope:'math-games'}},
  readyState:'loading',addEventListener(event,callback){handlers.set(event,callback)}};
 const window={localStorage:local,addEventListener(event,callback){scopeEvents.push([event,callback])},
  KhaemenesCourseEntryContract:{readAcademyProfile:()=>profile}};
 const ctx=vm.createContext({Storage,window,document,localStorage:local,sessionStorage:other,
  JSON,Date,console,encodeURIComponent,decodeURIComponent,setTimeout(){}});
 vm.runInContext(adapter,ctx,{timeout:4000});
 assert.equal(window.KhaemenesLearnerScope?.course,'math-games','storage isolation bootstrapped');
 return {local,other,window,store,
  setProfile(id){profile=id?{learnerId:id,name:id}:null}};
}
const paths=new Set();
for(const [slug,prefix] of Object.entries(games)){
 const path='courses/mathematics/assets/learning-games/'+slug+'/index.html';
 const html=fs.readFileSync(path,'utf8');
 assert.ok(html.includes('course-entry-contract.js'),'course identity first: '+slug);
 assert.ok(html.includes('data-learner-scope="math-games"'),'storage interceptor installed: '+slug);
 assert.ok(html.indexOf('course-entry-contract.js')<html.indexOf('learner-scope-v1.js'),'identity before storage: '+slug);
 assert.ok(html.includes(prefix),'game key matches explicit scope config: '+slug);
 assert.ok(/localStorage\.getItem\(key\(\)\)/.test(html),'game resumes from scoped reader: '+slug);
 assert.ok(/localStorage\.setItem\(key\(\)/.test(html),'game writes via scoped setter: '+slug);
 paths.add(path);
 const key=prefix+'|algebra2|11|u11-l08|navigation';
 const devices=new Map();
 const a=open('learner-a',devices);
 a.local.setItem(key,JSON.stringify({solved:7,streak:4,question:'one'}));
 const expectedA=devices.get(key+':learner:learner-a');
 assert.ok(expectedA&&expectedA.includes('"solved":7'),'learner A key created: '+slug);
 assert.equal(devices.get(key),undefined,'no unowned new base record: '+slug);
 const b=open('learner-b',devices);
 assert.equal(b.local.getItem(key),null,'learner B cannot read learner A work: '+slug);
 assert.equal(b.local.getItem(key+':learner:learner-a'),null,'enumerated A record blocked: '+slug);
 b.local.setItem(key,JSON.stringify({solved:2,streak:1,question:'two'}));
 assert.equal(JSON.parse(b.local.getItem(key)).solved,2,'learner B has distinct progress: '+slug);
 assert.equal(devices.get(key+':learner:learner-a'),expectedA,'A work unchanged by B: '+slug);
 b.local.removeItem(key);
 assert.equal(b.local.getItem(key),null,'B reset deletes only B work: '+slug);
 assert.equal(devices.get(key+':learner:learner-a'),expectedA,'A work protected from B reset: '+slug);
 const again=open('learner-a',devices);
 assert.equal(JSON.parse(again.local.getItem(key)).solved,7,'A progress restored after B session: '+slug);
 // A page that changes learners while open must not be able to reassign its record.
 again.setProfile('learner-b');
 assert.equal(again.local.getItem(key),null,'stale A page cannot read B progress: '+slug);
 assert.throws(()=>again.local.setItem(key,'bad'),'stale page cannot write: '+slug);
 // Session storage is intentionally unaffected.
 const sessionKey=prefix+'-ephemeral';
 again.other.setItem(sessionKey,'tab-only');
 assert.equal(again.other.getItem(sessionKey),'tab-only');
}
// Anonymous legacy records are kept intact and are never guessed into the first account.
for(const [slug,prefix] of Object.entries(games)){
 const legacy=prefix+'|algebra2|10|u10-l04|practice';
 const oldText=JSON.stringify({solved:11,task:{id:'preserved'}}),device=new Map([[legacy,oldText]]);
 const a=open('learner-a',device);
 assert.equal(a.local.getItem(legacy),null,'unowned legacy record quarantined: '+slug);
 assert.throws(()=>a.local.setItem(legacy,'overwrite'),'cannot overwrite unidentified record: '+slug);
 assert.equal(device.get(legacy),oldText,'legacy source untouched: '+slug);
 const b=open('learner-b',device);
 assert.equal(b.local.getItem(legacy),null,'other learner cannot see unowned record: '+slug);
 assert.equal(a.window.KhaemenesLearnerScope.claimLegacy(legacy),true,'explicit legacy ownership works: '+slug);
 assert.equal(a.local.getItem(legacy),oldText,'owner sees copied progress: '+slug);
 assert.equal(b.local.getItem(legacy),null,'claimed record hidden from other learner: '+slug);
 b.local.setItem(legacy,JSON.stringify({solved:1}));
 assert.equal(JSON.parse(b.local.getItem(legacy)).solved,1,'other learner can begin separate work: '+slug);
 assert.equal(device.get(legacy),oldText,'original unowned record retained: '+slug);
 assert.equal(device.get(legacy+':learner:learner-a'),oldText,'claimed copy retained: '+slug);
}
// Without an active Academy learner, no new tracked game state may be saved.
const noProfile=open(null,new Map());
assert.throws(()=>noProfile.local.setItem('KHAE_TRIG_IDENTITY_FORGE_V1|algebra2|11','x'));
assert.equal(noProfile.local.getItem('KHAE_TRIG_IDENTITY_FORGE_V1|algebra2|11'),null);
// Existing prefixed third-party or other Academy keys must not be accidentally captured.
const device=new Map(),unrelated=open('learner-a',device);
unrelated.local.setItem('KHAE_SS10_USH_CLEAN_PORTAL_V1','civics');
unrelated.local.setItem('KHAE_SCIENCE9_PROGRESS','science');
assert.equal(device.get('KHAE_SS10_USH_CLEAN_PORTAL_V1'),'civics','non-mathematics untouched');
assert.equal(device.get('KHAE_SCIENCE9_PROGRESS'),'science','non-mathematics untouched');
assert.equal(paths.size,12);
console.log('PASS: 12 canonical mathematics games; two learners alternate on the same device; each has private question/streak/score state; old anonymous progress stays preserved and requires explicit owner; stale page and unselected profile cannot save; resets isolated; other Academy keys untouched.');
