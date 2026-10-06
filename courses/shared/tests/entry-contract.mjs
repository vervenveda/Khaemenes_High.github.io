import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = new URL('..', import.meta.url);
const read = path => fs.readFileSync(new URL(path, root), 'utf8');
const json = path => JSON.parse(read(path));

const catalog = json('./course-entry-catalog.json');
assert.equal(catalog.schema, 'khaemenes-course-entry-catalog-v1');
assert.equal(catalog.overall_ready_percent, 80);
assert.equal(catalog.essential_strand_floor_percent, 80);
assert.deepEqual(catalog.courses.map(course => course.course_id), [
  'math-prealgebra', 'math-algebra1', 'math-geometry', 'math-algebra2',
  'math-precalculus-trigonometry', 'math-calculus1', 'english-9', 'grade09-global-studies-honors',
  'integrated-science-9', 'psychology-101', 'physical-education-9-12'
]);
for (const course of catalog.courses.filter(course => course.course_id.startsWith('math-') && course.course_id !== 'math-prealgebra')) {
  assert.equal(course.status, 'shared-entry-gate');
  assert.deepEqual(course.essential_strands, ['overall']);
  assert.ok(course.readiness_key.startsWith('khaemenes-math-'));
}
assert.equal(catalog.courses.find(course => course.course_id === 'psychology-101').entry_mode, 'direct-entry-with-learner-scope');
assert.equal(catalog.courses.find(course => course.course_id === 'physical-education-9-12').mode, 'federated');

const template = json('./course-readiness-template.json');
assert.equal(template.routing_contract.overall_ready_percent, 80);
assert.equal(template.routing_contract.essential_strand_floor_percent, 80);
assert.equal(template.routing_contract.unit_0_exit_percent, 80);

const preAlgebra = json('../mathematics/pre-algebra/diagnostic/readiness-assessment-v3.json');
assert.equal(preAlgebra.mastery_threshold_percent, 80);
assert.equal(preAlgebra.strand_policy.ready_percent_per_essential_strand, 80);

const social = json('../social-studies/grade-09/data/readiness-profile.json');
assert.equal(social.essential_strand_floor_percent, 80);
assert.match(social.routing.advance.condition, /essential strand >= 80/);
assert.match(social.routing.unit_0_refresher.condition, /essential strand < 80/);

const source = read('./course-entry-contract.js');
const store = new Map([
  ['khaemenes_active_learner_v1', JSON.stringify('learner_A')],
  ['khaemenes_family_registry_v1', JSON.stringify({ learners: { learner_A: { learnerId: 'learner_A', nickname: 'A' } } })]
]);
const context = vm.createContext({
  window: { localStorage: { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) } }
});
vm.runInContext(source, context);
const api = context.window.KhaemenesCourseEntryContract;
assert.equal(api.overallReadyPercent, 80);
assert.equal(api.essentialStrandFloorPercent, 80);
assert.equal(api.scopedKey('khaemenes_test_v1'), 'khaemenes_test_v1:learner:learner_A');
assert.equal(api.routeFor(80, { one: 80 }, ['one']), 'advance');
assert.equal(api.routeFor(80, { one: 79 }, ['one']), 'unit_0_refresher');
assert.equal(api.isReady({ course_id: 'demo', route: 'advance', overall_percent: 80, strand_scores: { one: 80 } }, ['one'], 'demo'), true);
assert.equal(api.isReady({ course_id: 'demo', route: 'advance', overall_percent: 80, strand_scores: { one: 79 } }, ['one'], 'demo'), false);

assert.match(read('./math-entry-gate.js'), /mathReadinessKey/);
console.log('PASS: shared entry contract, math sequence catalog, 80% thresholds, and learner scoping');
