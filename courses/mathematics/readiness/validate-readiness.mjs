import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=path.dirname(new URL(import.meta.url).pathname);
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const fail=msg=>{throw new Error(msg)};
const ok=(cond,msg)=>{if(!cond)fail(msg)};

const map=JSON.parse(read('readiness-map.json'));
const html=read('index.html');
const bankSource=read('question-bank.js');
const sandbox={window:{}};
vm.createContext(sandbox);
vm.runInContext(bankSource,sandbox);
const bank=sandbox.window.KHAEMENES_MATH_READINESS_BANK;

ok(map.instructional_time===false,'Readiness must not be instructional time.');
ok(map.counts_toward_course===false,'Readiness must not count toward course completion.');
ok(map.result_contract?.storage_key==='KHAEMENES_MATH_READINESS_V1','Unexpected readiness storage key.');
ok(Array.isArray(map.placement_levels)&&map.placement_levels.length===6,'Expected six placement destinations.');

const expected=['pre-algebra','algebra-1','geometry','algebra-2','precalculus-trigonometry','calculus-1'];
ok(JSON.stringify(map.placement_levels.map(x=>x.id))===JSON.stringify(expected),'Placement destination order changed.');
map.placement_levels.forEach(level=>{
  ok(level.course_path&&level.course_path.startsWith('../'),'Every placement destination must have a relative course path.');
  ok(Array.isArray(level.required_domains)&&level.required_domains.length>=4,`${level.id} needs prerequisite domains.`);
});

ok(Array.isArray(bank)&&bank.length===48,`Expected 48 readiness questions, found ${bank?.length}.`);
const ids=bank.map(q=>q.id);
ok(new Set(ids).size===ids.length,'Question IDs must be unique.');
for(let tier=1;tier<=6;tier++){
  const qs=bank.filter(q=>q.tier===tier);
  ok(qs.length===8,`Tier ${tier} must contain exactly 8 questions.`);
  qs.forEach(q=>{
    ok(typeof q.prompt==='string'&&q.prompt.trim().length>5,`${q.id} has weak prompt.`);
    ok(Array.isArray(q.choices)&&q.choices.length===4,`${q.id} must have four choices.`);
    ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.choices.length,`${q.id} has invalid answer index.`);
    ok(typeof q.domain==='string'&&q.domain.trim(),`${q.id} is missing a domain.`);
  });
}

[
  'This is not Week 1',
  'countsTowardCourse:false',
  'KHAEMENES_MATH_READINESS_V1',
  'Intentional Reassessment',
  'recommendedCourse',
  'reviewDomains',
  'NAIB'
].forEach(token=>ok(html.includes(token),`index.html missing readiness contract token: ${token}`));

ok(!/weekRec\(|progress\.weeks|course completion.*true/i.test(html),'Readiness engine appears to write instructional-week progress.');
console.log('PASS: shared mathematics readiness architecture is structurally valid.');
