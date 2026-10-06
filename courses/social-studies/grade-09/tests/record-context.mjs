import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),source=fs.readFileSync(new URL('assets/grade09-records.js',root),'utf8'),gate=fs.readFileSync(new URL('assets/grade09-entry-gate.js',root),'utf8');
const course='khaemenes_grade09_social_studies_v1';
function open(map=new Map(),id=null,quota=false){
 if(id){map.set('khaemenes_active_learner_v1',JSON.stringify(id));map.set('khaemenes_family_registry_v1',JSON.stringify({learners:{A:{learnerId:'A',nickname:'A'},B:{learnerId:'B',nickname:'B'}}}));}else map.delete('khaemenes_active_learner_v1');
 const storage={getItem:k=>map.get(k)??null,setItem(k,v){if(quota)throw Error('quota');map.set(k,v)},removeItem:k=>map.delete(k)};
 const window={localStorage:storage,addEventListener(){}};const context={window,document:{readyState:'loading',addEventListener(){},querySelector(){return null}},Date,Map,Set,URL,location:{href:'https://example.test/course/'}};vm.runInNewContext(source,context);vm.runInNewContext(gate,context);return {api:window.KhaemenesSS9Records,decision:window.KhaemenesSocialStudies9Entry.decision,map};
}
const fresh=()=>({version:1,activeId:null,students:[],settings:{}});
const map=new Map([[course,JSON.stringify({version:1,activeId:'legacy',students:[{id:'legacy',name:'Legacy',assignments:{'1-1':{text:'Preserve me'}}}],settings:{}})]]);
const legacy=map.get(course);const a=open(map,'A');assert.equal(a.api.storage.getItem(course),null);let db=a.api.prepareDB(fresh());assert.equal(db.activeId,'A');a.api.storage.setItem(course,JSON.stringify(db));assert.equal(map.get(course),legacy);
a.api.storage.getItem('khaemenes_ss9_readiness_v1');a.api.storage.setItem('khaemenes_ss9_readiness_v1',JSON.stringify({route:'advance',overall_percent:100,strand_scores:Object.fromEntries(['claim_evidence_inference','source_provenance_corroboration','chronology_causation_change','geography_maps_networks','data_quantitative_reasoning','argument_comparison_ethics'].map(k=>[k,100]))}));assert(a.decision().allow);
const backup=a.api.exportDB(db);const b=open(map,'B');assert.equal(b.api.storage.getItem(course),null);assert.equal(b.decision().allow,false);assert.throws(()=>b.api.importDB(backup));assert.equal(map.get(course),legacy);
const corrupt=new Map([[course,'{broken']]);let c=open(corrupt);assert.throws(()=>c.api.storage.getItem(course));assert.throws(()=>c.api.storage.setItem(course,JSON.stringify(fresh())));assert.equal(corrupt.get(course),'{broken');
c=open(new Map([[course,JSON.stringify(fresh())]]));c.api.storage.getItem(course);c.map.set(course,JSON.stringify({...fresh(),teacherPasscode:'changed'}));assert.throws(()=>c.api.storage.setItem(course,JSON.stringify(fresh())));assert(c.api.isBlocked());
c=open(new Map(),null,true);c.api.storage.getItem(course);assert.throws(()=>c.api.storage.setItem(course,JSON.stringify(fresh())));assert(c.api.isBlocked());
c=open();assert.throws(()=>c.api.importDB({...fresh(),students:[{id:'x',name:'X'},{id:'x',name:'X'}]}));assert.throws(()=>c.api.importDB(JSON.parse('{"version":1,"activeId":null,"students":[],"settings":{},"__proto__":{}}')));
const other={version:1,activeId:'new',students:[{id:'old',name:'Old',assignments:{'1-1':{text:'old'}}},{id:'new',name:'New'}],settings:{}};c=open(new Map([[course,JSON.stringify(other)]]));assert.equal(c.decision().allow,false);
assert.equal(c.api.importDB(fresh()).version,1);
console.log('PASS: learner-specific placement and records, untouched legacy work, wrong-learner backup rejection, corrupt/stale/quota protection, schema validation and active-only returning entry');
