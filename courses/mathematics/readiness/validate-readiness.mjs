import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=path.dirname(new URL(import.meta.url).pathname);
const mathRoot=path.resolve(root,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const readMath=file=>fs.readFileSync(path.join(mathRoot,file),'utf8');
const fail=msg=>{throw new Error(msg)};
const ok=(cond,msg)=>{if(!cond)fail(msg)};

const map=JSON.parse(read('readiness-map.json'));
const manifest=JSON.parse(read('integration-manifest.json'));
const html=read('index.html');
const bridge=read('course-readiness-bridge.js');
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
ok(bridge.includes('KHAEMENES_MATH_READINESS_V1'),'Shared course bridge must read the readiness record.');
ok(bridge.includes('recommendation is advisory')||bridge.includes('recommendation is <strong>'),'Shared course bridge must preserve advisory placement language.');
ok(Array.isArray(manifest.required_surfaces)&&manifest.required_surfaces.length===7,'Expected portal plus six live-course integration surfaces.');
expected.forEach(id=>ok(manifest.required_surfaces.some(x=>x.id===id),`Integration manifest missing ${id}.`));

const algebra1=readMath('algebra-1/index.html');
ok(algebra1.includes('../readiness/'),'Algebra I must link to the shared readiness engine.');
ok(algebra1.includes('../readiness/course-readiness-bridge.js'),'Algebra I must load the shared readiness bridge.');
ok(!/1 readiness week/i.test(algebra1),'Algebra I must not count readiness as an instructional week.');

const preUpgrade=readMath('pre-algebra/assets/prealgebra-archaemenes-upgrade.js');
ok(preUpgrade.includes('course-readiness-bridge.js'),'Pre-Algebra must load the shared readiness bridge.');
ok(preUpgrade.includes('countsTowardCourse:false'),'Pre-Algebra placement contract must remain non-instructional.');

const integrationFiles={
  geometry:'geometry/assets/geometry-archaemenes-upgrade.js',
  'algebra-2':'algebra-2/assets/algebra2-archaemenes-upgrade.js',
  'precalculus-trigonometry':'precalculus-trigonometry/assets/precalculus-trigonometry-archaemenes-upgrade.js',
  'calculus-1':'calculus-1/assets/calculus1-archaemenes-upgrade.js'
};
for(const [id,file] of Object.entries(integrationFiles)){
  const source=readMath(file);
  ok(source.includes('course-readiness-bridge.js'),`${id} must load the shared readiness bridge.`);
  ok(source.includes(`dataset.courseId='${id}'`)||source.includes(`dataset.courseId="${id}"`),`${id} bridge must identify its course.`);
}

const forbiddenWeekPhrases=[
  /1 readiness week/i,
  /week 1[^\n]{0,80}diagnostic/i,
  /diagnostic[^\n]{0,80}week 1/i
];
for(const id of expected){
  const courseIndex=readMath(`${id}/index.html`);
  forbiddenWeekPhrases.forEach(pattern=>ok(!pattern.test(courseIndex),`${id} appears to count readiness/diagnostic as Week 1.`));
}

console.log('PASS: shared mathematics readiness architecture and all six live-course integrations are structurally valid.');
