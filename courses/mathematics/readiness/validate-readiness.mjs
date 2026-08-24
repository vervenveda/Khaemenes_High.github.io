import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=path.dirname(new URL(import.meta.url).pathname);
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const fail=msg=>{throw new Error(msg)};
const ok=(cond,msg)=>{if(!cond)fail(msg)};

const map=JSON.parse(read('readiness-map.json'));
const manifest=JSON.parse(read('integration-manifest.json'));
const html=read('index.html');
const bridge=read('course-readiness-bridge.js');
const portal=read('portal-entry.js');
const bankSource=read('question-bank.js');
const sandbox={window:{}};
vm.createContext(sandbox);
vm.runInContext(bankSource,sandbox);
const bank=sandbox.window.KHAEMENES_MATH_READINESS_BANK;

ok(map.instructional_time===false,'Readiness must not be instructional time.');
ok(map.counts_toward_course===false,'Readiness must not count toward course completion.');
ok(manifest.instructional_time===false,'Integration manifest must keep readiness outside instructional time.');
ok(manifest.counts_toward_course===false,'Integration manifest must keep readiness outside course completion.');
ok(map.result_contract?.storage_key==='KHAEMENES_MATH_READINESS_V1','Unexpected readiness storage key.');
ok(manifest.storage_key===map.result_contract.storage_key,'Manifest and readiness map storage keys must match.');

const expected=['pre-algebra','algebra-1','geometry','algebra-2','precalculus-trigonometry','calculus-1'];
ok(Array.isArray(map.placement_levels)&&map.placement_levels.length===expected.length,'Expected six placement destinations.');
ok(JSON.stringify(map.placement_levels.map(x=>x.id))===JSON.stringify(expected),'Placement destination order changed.');

const pre=map.placement_levels.find(level=>level.id==='pre-algebra');
ok(pre?.course_path==='../pre-algebra/diagnostic/','Pre-Algebra recommendation must route through the NAIB diagnostic gateway.');
ok(pre?.shared_result_can_unlock===false,'Shared readiness must not unlock Pre-Algebra.');
ok(manifest.pre_algebra_entry_authority?.route==='pre-algebra/diagnostic/','Manifest must preserve the Pre-Algebra diagnostic authority.');
ok(manifest.pre_algebra_entry_authority?.shared_readiness_can_unlock===false,'Manifest must prohibit shared-readiness bypass of Pre-Algebra gates.');

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
  'KHAEMENES_MATH_READINESS_V1',
  'Intentional Reassessment',
  'recommendedCourse',
  'reviewDomains',
  'NAIB'
].forEach(token=>ok(html.includes(token),`index.html missing readiness contract token: ${token}`));

ok(!/weekRec\(|progress\.weeks/i.test(html),'Readiness engine must not write instructional-week progress.');
ok(bridge.includes('KHAEMENES_MATH_READINESS_V1'),'Shared bridge must read the readiness record.');
ok(bridge.includes('../pre-algebra/diagnostic/'),'Shared bridge must defer Pre-Algebra to the NAIB diagnostic.');
ok(bridge.includes('cannot unlock or bypass'),'Shared bridge must state that Pre-Algebra gates cannot be bypassed.');
ok(!portal.includes('deprecateLegacyDiagnosticCard'),'Portal entry must not rewrite the Pre-Algebra diagnostic card.');
ok(portal.includes('does not replace the Pre-Algebra NAIB readiness gateway'),'Portal entry must preserve the Pre-Algebra exception.');

console.log('PASS: shared mathematics readiness engine is self-contained, non-instructional, and compatible with the Pre-Algebra NAIB/Unit 0 mastery contract.');
