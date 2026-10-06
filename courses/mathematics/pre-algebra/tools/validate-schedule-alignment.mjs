import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const appSource=html.slice(html.indexOf('const APP ='),html.indexOf('const STORAGE_KEY'));
const context=vm.createContext({window:{},console,URL,location:{href:'https://example.org/course/'},
 document:{currentScript:{src:'https://example.org/course/assets/prealgebra-archaemenes-upgrade.js'},
  getElementById:()=>null,createElement:()=>({}),head:{appendChild(){}},
 },});
vm.runInContext(appSource+'\nlet state={students:[]};let activeWeek=1;function save(){};function render(){};',context);
vm.runInContext(fs.readFileSync(path.join(root,'assets/prealgebra-archaemenes-upgrade.js'),'utf8'),context);
const app=JSON.parse(vm.runInContext('JSON.stringify(APP)',context));
const map=JSON.parse(fs.readFileSync(path.join(root,'course-map.json'),'utf8'));
assert.equal(app.weeks.length,36);
assert.equal(map.units.reduce((sum,u)=>sum+u.weeks,0),36);
assert.equal(app.weeks.some(w=>w.unitNumber===0),false,'Diagnostic must not occupy an official week');
for(const unit of map.units){
 const actual=app.weeks.filter(w=>w.unitNumber===unit.number);
 assert.equal(actual.length,unit.weeks,`Unit ${unit.number}: planner/map duration mismatch`);
 assert.equal(app.units.find(u=>u.number===unit.number)?.weeks,unit.weeks,`Unit ${unit.number}: runtime unit duration mismatch`);
 const unitMap=JSON.parse(fs.readFileSync(path.join(root,unit.path,'unit-map.json'),'utf8'));
 assert.equal(unitMap.unit.duration_weeks,unit.weeks,`Unit ${unit.number}: unit map duration mismatch`);
 for(const week of actual)assert.equal(week.path,unit.path,`Week ${week.week}: incorrect unit destination`);
}
assert.equal(app.weeks[0].unitNumber,1);
assert.equal(app.weeks[35].unitNumber,13);
console.log('Schedule alignment passed: runtime planner, 13 unit durations, destinations and canonical maps agree across 36 weeks.');
