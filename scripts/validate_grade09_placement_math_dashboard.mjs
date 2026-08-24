import fs from 'node:fs';
import vm from 'node:vm';

const ROOT = process.cwd();
const read = path => fs.readFileSync(`${ROOT}/${path}`, 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const registryPath = 'grades/grade-09/student-profile/student-course-registry.js';
const dashboardPath = 'grades/grade-09/student-profile/index.html';
const dailyPath = 'grades/grade-09/student-profile/daily-lessons/index.html';
const preNavPath = 'courses/mathematics/pre-algebra/assets/prealgebra-student-navigation.js';
const registrySource = read(registryPath);
const dashboard = read(dashboardPath);
const daily = read(dailyPath);
const preNav = read(preNavPath);

// Static contract: one grade-neutral mathematics pathway with both current options.
assert(registrySource.includes('id:"pre-algebra"'), 'Pre-Algebra missing from Grade 09 registry.');
assert(registrySource.includes('id:"algebra-1"'), 'Algebra I missing from Grade 09 registry.');
assert(registrySource.includes('MATH_PATHWAY_KEY="khaemenes-high-math-pathway-v1"'), 'Mathematics pathway key missing.');
assert(registrySource.includes('A1_DIAGNOSTIC_RESULT_KEY="khaemenes-algebra1-diagnostic-result-v1"'), 'Algebra I diagnostic evidence key missing.');
assert(registrySource.includes('resolveContinueFor'), 'Asynchronous next-action resolver missing.');
assert(registrySource.includes('unit-map.json'), 'Algebra I canonical unit-map lookup missing.');
assert(registrySource.includes('Array.from({length:13}'), 'All 13 Algebra I unit maps are not included in the resolver contract.');
assert(!registrySource.includes('pre-algebra/units/unit-01/lessons/lesson-01-number-systems.html'), 'Grade 09 registry still hard-codes Pre-Algebra Lesson 01.');
assert(registrySource.indexOf('const explicit=explicitMathPathway();') < registrySource.indexOf('if(hasAlgebraCourseEvidence())return "algebra-1";'), 'Explicit current mathematics pathway must be considered before inferred Algebra I evidence.');

for (let unit = 1; unit <= 13; unit++) {
  const id = String(unit).padStart(2, '0');
  assert(fs.existsSync(`${ROOT}/courses/mathematics/algebra-1/units/unit-${id}/unit-map.json`), `Missing Algebra I Unit ${id} map.`);
}

for (const [label, html] of [['dashboard', dashboard], ['daily lessons', daily]]) {
  assert(html.includes('registry.resolveContinueFor(course.id)'), `${label} does not use the canonical next-action resolver.`);
  assert(!html.includes("course.id==='pre-algebra'"), `${label} still has Pre-Algebra-only presentation logic.`);
  assert(html.includes('registry.isMathCourse(course.id)'), `${label} does not identify mathematics pathway cards.`);
  assert(html.includes('registry.shouldRefreshForStorageKey(event.key)'), `${label} does not refresh when mathematics evidence changes.`);
}
assert(dashboard.includes('Manage Classes &amp; Mathematics Pathway'), 'Dashboard mathematics-pathway manager copy missing.');
assert(dashboard.includes('only one mathematics course is treated as the active pinned pathway at a time'), 'Dashboard single-math-path explanation missing.');
assert(daily.includes('Complete today’s mathematics step, then finish English reading.'), 'Daily note example is not grade-neutral.');
assert(!daily.includes('Finish Pre-Algebra, then complete English reading.'), 'Old Pre-Algebra-specific daily note remains.');

// Pre-Algebra's own pin control must respect the same one-math-path rule.
assert(preNav.includes('MATH_PATHWAY_KEY="khaemenes-high-math-pathway-v1"'), 'Pre-Algebra pin control does not share the math pathway key.');
assert(preNav.includes('OTHER_MATH_ID="algebra-1"'), 'Pre-Algebra pin control does not know the alternate math pathway.');
assert(preNav.includes('id!==OTHER_MATH_ID'), 'Pinning Pre-Algebra does not remove Algebra I from active pins.');
assert(preNav.includes('writeJSON(MATH_PATHWAY_KEY,COURSE_ID)'), 'Pinning Pre-Algebra does not record the current math pathway.');

// Validate inline student-page JavaScript syntax as well as shared external scripts.
for (const [label, html] of [['dashboard', dashboard], ['daily', daily]]) {
  const blocks = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match => match[1].trim()).filter(Boolean);
  blocks.forEach((code, index) => new vm.Script(code, { filename: `${label}-inline-${index + 1}.js` }));
}
new vm.Script(registrySource, { filename: registryPath });
new vm.Script(preNav, { filename: preNavPath });

// Runtime contract with an isolated localStorage/fetch simulation.
const store = new Map();
const localStorage = {
  getItem(key) { return store.has(key) ? store.get(key) : null; },
  setItem(key, value) { store.set(key, String(value)); },
  removeItem(key) { store.delete(key); }
};
const unitMaps = new Map();
for (let unit = 1; unit <= 13; unit++) {
  const id = String(unit).padStart(2, '0');
  unitMaps.set(unit, JSON.parse(read(`courses/mathematics/algebra-1/units/unit-${id}/unit-map.json`)));
}
const context = {
  window: {},
  localStorage,
  location: { pathname: '/Khaemenes_High.github.io/grades/grade-09/student-profile/' },
  URLSearchParams,
  console,
  fetch: async url => {
    const match = String(url).match(/unit-(\d{2})\/unit-map\.json$/);
    const map = match ? unitMaps.get(Number(match[1])) : null;
    return map ? { ok: true, json: async () => map } : { ok: false, status: 404, json: async () => ({}) };
  }
};
vm.createContext(context);
vm.runInContext(registrySource, context, { filename: registryPath });
const R = context.window.KhaemenesGrade09Courses;
assert(R, 'Registry did not expose its public API.');
assert(R.getCourse('pre-algebra') && R.getCourse('algebra-1'), 'Both math pathways must be available.');

store.clear();
let next = await R.resolveContinueFor('algebra-1');
assert(next.url.endsWith('/algebra-1/diagnostic/'), 'First-time Algebra I must open the readiness diagnostic.');
assert(next.actionLabel.includes('Readiness'), 'First-time Algebra I action must identify readiness.');

store.set('khaemenes-algebra1-diagnostic-result-v1', JSON.stringify({ attempt_history: [{ percent: 82 }] }));
next = await R.resolveContinueFor('algebra-1');
assert(next.url.includes('/units/unit-01/lessons/lesson-01-algebraic-habits-notation-mathematical-argument.html'), 'Completed diagnostic should route to the first unmastered canonical Algebra I lesson.');

store.set('khaemenes-algebra1-unit01-a3-v1', JSON.stringify({ best: { 'lesson-1': 90, 'lesson-2': 88, 'lesson-3': 80 } }));
next = await R.resolveContinueFor('algebra-1');
assert(next.url.includes('weekly-mastery.html?week=2'), 'After Week 2 lessons, Week 2 mastery should be next.');

store.set('khaemenes-algebra1-weekly-mastery-v2', JSON.stringify({ weeks: { 2: { best: 90 } } }));
next = await R.resolveContinueFor('algebra-1');
assert(next.url.includes('/units/unit-01/lessons/lesson-04-units-rates-dimensional-analysis.html'), 'After Week 2 mastery, the next Week 3 lesson should open.');

store.set('khaemenes-high-math-pathway-v1', JSON.stringify('pre-algebra'));
assert(R.mathPathway() === 'pre-algebra', 'Deliberate Pre-Algebra selection must override advisory Algebra I diagnostic evidence.');
R.setPinned('algebra-1', true);
assert(R.mathPathway() === 'algebra-1', 'Pinning Algebra I must make Algebra I the current math pathway.');
assert(R.pinnedIds().includes('algebra-1') && !R.pinnedIds().includes('pre-algebra'), 'Only one mathematics course may be pinned as current at a time.');

store.clear();
const pre = R.continueFor('pre-algebra');
assert(pre.url.endsWith('/courses/mathematics/pre-algebra/'), 'Pre-Algebra without continuation evidence must return to course home, not Lesson 01.');

console.log('PASS: Grade 09 placement-aware mathematics dashboard contract validated.');
