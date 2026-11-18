import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read=p=>fs.readFileSync(p,'utf8');
const app=read('courses/social-studies/grade-10/app.js');
const data=JSON.parse(read('courses/social-studies/grade-10/course-data.js').replace(/^window[.]KHAEMENES_SOCIAL_STUDIES_DATA\s*=\s*/, '').trim().replace(/;$/, ''));
new vm.Script(app,{filename:'grade10-app.js'});
const start=app.indexOf('const COURSE='),end=app.indexOf('function normalize(s)',start);
assert.ok(start>=0&&end>start,'actual gradebook authority extracted');
const authority=app.slice(start,end);

const raw=new Map();
const oldKey=data.metadata.storageKey;
const legacyKey='KHAE_SS10_USH_CLEAN_PORTAL_V1';
const legacyGradebook=JSON.stringify({version:2,activeId:'old',students:[{id:'old',name:'Unassigned',quizzes:{1:{bestPercent:90,attempts:2}}}]});
const historical=JSON.stringify({students:[{id:'historic',progress:{weeks:{1:{quiz:{best:90}}}}}]});
raw.set(oldKey,legacyGradebook);
raw.set(legacyKey,historical);

let profile=null;
const storage={
 getItem(key){return raw.has(key)?raw.get(key):null},
 setItem(key,value){raw.set(String(key),String(value))},
 removeItem(key){raw.delete(key)}
};
function load(){
 const context={window:{KHAEMENES_SOCIAL_STUDIES_DATA:data,
   KhaemenesCourseEntryContract:{readAcademyProfile:()=>profile?{learnerId:profile}:null}},
   localStorage:storage,location:{search:''},URLSearchParams,encodeURIComponent,Date,Math,console};
 vm.createContext(context);
 vm.runInContext(authority+';window.recordAudit={loadDB,saveDB,getKey:()=>KEY,getEntry:()=>ENTRY_OWNER,getState:()=>db,setState:v=>{db=v},getSnapshot:()=>savedSnapshot};',context);
 return context.window.recordAudit;
}

// Guests never inherit shared-device course records or create a new record.
let guest=load();
assert.equal(guest.getKey(),null);
assert.equal(guest.getState().students.length,0);
assert.throws(()=>guest.saveDB(),/Select an Academy learner/);
assert.equal(raw.get(oldKey),legacyGradebook);
assert.equal(raw.get(legacyKey),historical);

// New Academy learners start isolated; neither receives the unassigned data.
profile='academy-A';
let a=load(),keyA=a.getKey();
assert.equal(keyA,oldKey+':academy:academy-A');
assert.equal(a.getState().students.length,0);
a.getState().students.push({id:'a',name:'Student A',quizzes:{}});
a.saveDB();
assert.equal(JSON.parse(raw.get(keyA)).academyLearnerId,'academy-A');
assert.equal(JSON.parse(raw.get(keyA)).students.length,1);
profile='academy-B';
let b=load(),keyB=b.getKey();
assert.notEqual(keyA,keyB);
assert.equal(b.getState().students.length,0);
b.getState().students.push({id:'b',name:'Student B'});
b.saveDB();
assert.equal(JSON.parse(raw.get(keyA)).students[0].id,'a');

// Existing tab must not write after Academy selection changes.
assert.throws(()=>a.saveDB(),/Academy learner changed/);
profile=null;
assert.throws(()=>b.saveDB(),/Select an Academy learner/);
profile='academy-A';
let tab1=load(),tab2=load();
tab1.getState().students[0].name='New';
tab1.saveDB();
tab2.getState().students[0].name='Stale';
assert.throws(()=>tab2.saveDB(),/Another tab modified/);
assert.equal(JSON.parse(raw.get(keyA)).students[0].name,'New');

// Invalid existing data must be preserved and blocked, not overwritten.
const corrupt='{"version":2,"students":[],"academyLearnerId":"academy-B"}';
raw.set(keyA,corrupt);
const recovery=load();
assert.equal(recovery.getSnapshot(),'__blocked__');
assert.throws(()=>recovery.saveDB(),/recovery is required/);
assert.equal(raw.get(keyA),corrupt);
assert.equal(raw.get(oldKey),legacyGradebook);
assert.equal(raw.get(legacyKey),historical);
console.log('PASS: Grade 10 Academy owner bound; guests denied; legacy unclaimed; cross-learner isolation; switched identity denied; stale-tab denial; malformed records preserved.');
