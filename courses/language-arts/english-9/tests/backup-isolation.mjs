import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const start=source.indexOf('function importBackup(event)');
const code=source.slice(start,source.indexOf('function csvCell',start));
function attempt(backup){
 const writes=[]; let confirmations=0;
 const ctx=vm.createContext({window:{KhaemenesEnglish9Records:{profile:{learnerId:'A'}}},FileReader:class {readAsText(){this.result=JSON.stringify(backup);this.onload();}},localStorage:{setItem:(...args)=>writes.push(args)},confirm:()=>{confirmations++;return true},alert:()=>{},saveState:()=>writes.push(['dashboard']),renderAll:()=>{},state:{students:[]}});
 vm.runInContext(source.slice(source.indexOf('function validateRecords'),source.indexOf('function loadState')),ctx);vm.runInContext(code,ctx);vm.runInContext('importBackup({target:{files:[{}]}})',ctx);
 return {writes,confirmations};
}
const learner={id:'dashboard-A',academyLearnerId:'A',name:'Learner',progress:{weeks:{},exams:{}}};
const evidence={records:{'khae-ela9-progress-v1:learner:A':'{}','khae-ela9-field:notes:learner:A':'saved'}};
assert.equal(attempt({students:[learner],standaloneEvidence:evidence}).writes.length,2);
for(const bad of [
 {students:[{...learner,academyLearnerId:'B'}],standaloneEvidence:evidence},
 {students:[learner,learner],standaloneEvidence:evidence},
 {students:[learner],standaloneEvidence:{records:{'unrelated-secret':'value'}}},
 {students:[],standaloneEvidence:evidence}
]){
 const result=attempt(bad);assert.equal(result.writes.length,0);assert.equal(result.confirmations,0);
}
console.log('PASS: scoped backup accepted; mismatched learner, duplicate IDs, invalid keys and empty backups rejected before writes');
