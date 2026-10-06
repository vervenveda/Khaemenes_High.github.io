import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../assets/week1-workspace.js',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../weeks/week-01/index.html',import.meta.url),'utf8');
const fieldNames=[...html.matchAll(/data-save-field="([^"]+)"/g)].map(x=>x[1]);
const old=['day1-reflection','day2-pattern','day3-trail','day4-analysis','day5-analysis','day5-reflection','claim','evidence','reflection'];assert(old.every(k=>fieldNames.includes('week-01-'+k)));
function open(store=new Map(),id='A',quota=false){
 const element=(dataset={})=>({dataset,value:'',hidden:false,textContent:'',disabled:false,events:{},attrs:{},addEventListener(t,f){this.events[t]=f},setAttribute(k,v){this.attrs[k]=v},focus(){this.focused=true},remove(){}});
 const ids=Object.fromEntries(['week1-save-status','week1-save-error','preserve-baseline','baseline-copy','baseline-status','workspace-heading','previous-step','next-step','export-week1',...Array.from({length:5},(_,i)=>['read','practice','write','check'].map(p=>`heading-${i+1}-${p}`)).flat()].map(k=>[k,element()]));
 const fields=fieldNames.map(saveField=>element({saveField}));const phases=Array.from({length:5},(_,i)=>['read','practice','write','check'].map(phase=>element({day:String(i+1),phase}))).flat();const days=Array.from({length:5},(_,i)=>element({selectDay:String(i+1)}));const steps=['read','practice','write','check'].map(selectPhase=>element({selectPhase}));const prepared=element();let exported;
 const selectors={'[data-managed-save="week1"]':fields,'.phase':phases,'[data-select-day]':days,'[data-select-phase]':steps};
 const document={getElementById:k=>ids[k],querySelector:s=>s==='[data-managed-progress="week1"]'?prepared:{},querySelectorAll:s=>selectors[s]||[],body:{appendChild(){}},createElement(){const a=element();a.click=()=>{};return a}};
 const key=k=>k+':learner:'+id;store.set('khaemenes_active_learner_v1',JSON.stringify(id));
 vm.runInNewContext(source,{window:{KhaemenesEnglish9Records:{profile:{learnerId:id},storageKey:key}},document,localStorage:{getItem:k=>store.get(k)??null,setItem(k,v){if(quota)throw Error('quota');store.set(k,v)}},location:{hash:''},history:{replaceState(){}},Date,Blob,URL:{createObjectURL(b){exported=b;return 'blob:test'},revokeObjectURL(){}},setTimeout(){}});
 return {ids,fields,phases,days,steps,prepared,key,exported:()=>exported};
}
const store=new Map();let a=open(store);assert.equal(a.phases.filter(p=>!p.hidden).length,1);a.days[2].events.click();a.steps[2].events.click();assert(a.phases.find(p=>p.dataset.day==='3'&&p.dataset.phase==='write').hidden===false);assert.equal(open(store).ids['workspace-heading'].textContent,'Day 3 of 5 · Step 3 of 4 · Write');
let baseline=a.fields.find(f=>f.dataset.saveField==='week-01-day1-baseline');baseline.value='Original';baseline.events.input();a.ids['preserve-baseline'].events.click();baseline.value='Revised';baseline.events.input();a.ids['preserve-baseline'].events.click();assert.equal(store.get(a.key('khae-ela9-field:week-01-baseline-snapshot')),'Original');
let b=open(store,'B');assert.equal(b.fields.find(f=>f.dataset.saveField==='week-01-day1-baseline').value,'');
a=open(new Map());let f=a.fields[0];store.clear();const staleStore=new Map();a=open(staleStore);f=a.fields[0];staleStore.set(a.key('khae-ela9-field:'+f.dataset.saveField),'Other tab');f.value='Draft';f.events.input();assert.equal(staleStore.get(a.key('khae-ela9-field:'+f.dataset.saveField)),'Other tab');assert.equal(a.ids['week1-save-error'].hidden,false);
a=open(new Map(),'A',true);a.fields[0].value='Keep me';a.fields[0].events.input();assert.equal(a.fields[0].value,'Keep me');assert.equal(a.ids['week1-save-status'].textContent,'Work is not saved.');a.ids['export-week1'].events.click();const backup=JSON.parse(await a.exported().text());assert.equal(backup.writing[fieldNames[0]],'Keep me');assert.equal(backup.learnerId,'A');assert.equal(backup.containsUnsavedDrafts,true);
a=open(new Map([['khae-ela9-progress-v1:learner:A','broken']]));assert.equal(a.ids['week1-save-error'].hidden,false);
console.log('PASS: Week 1 focused navigation, scoped resume, nine original fields, learner isolation, immutable baseline, stale writes, quota failure, draft backup and corrupt progress protection');
