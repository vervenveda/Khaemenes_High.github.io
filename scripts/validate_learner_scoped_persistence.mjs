import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const checks = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
  checks.push(message);
}

function compile(label, source) {
  new vm.Script(source, { filename: label });
  checks.push(`compiled ${label}`);
}

const helper = read("courses/shared/learner-scope-v1.js");
const mathGate = read("courses/shared/math-entry-gate.js");
const contract = read("courses/shared/course-entry-contract.js");
const preAlgebraIndex = read("courses/mathematics/pre-algebra/index.html");
const algebraIndex = read("courses/mathematics/algebra-1/index.html");

const directLearnerPages = [
  ...[
    "index.html",
    "Unit_01_Number_Systems_Verve_Arithmetic_index.html"
  ].map(file => ({
    path: `courses/mathematics/pre-algebra/units/unit-01/${file}`,
    scope: "pre-algebra",
    base: "../../../shared"
  })),
  ...[
    "lesson-01-number-systems.html",
    "lesson-02-factors-multiples.html",
    "lesson-03-primes-divisibility.html",
    "lesson-04-gcf-lcm.html",
    "lesson-05-order-operations.html",
    "lesson-06-estimation-reasonableness.html"
  ].map(file => ({
    path: `courses/mathematics/pre-algebra/units/unit-01/lessons/${file}`,
    scope: "pre-algebra",
    base: "../../../../shared"
  })),
  ...[
    "assessment/mastery-check.html",
    "practice/core.html",
    "practice/extended.html",
    "practice/foundation.html"
  ].map(file => ({
    path: `courses/mathematics/pre-algebra/units/unit-01/${file}`,
    scope: "pre-algebra",
    base: "../../../../shared"
  })),
  ...[
    "index.html",
    "midterm-units-01-07.html",
    "final-exam-36-weeks.html"
  ].map(file => ({
    path: `courses/mathematics/pre-algebra/assessments/${file}`,
    scope: "pre-algebra",
    base: "../../../shared"
  })),
  {
    path: "courses/mathematics/algebra-1/units/unit-01/index.html",
    scope: "algebra-1",
    base: "../../../shared"
  },
  ...[
    "lesson-01-algebraic-habits-notation-mathematical-argument.html",
    "lesson-02-the-real-number-system-interval-representations.html",
    "lesson-03-operations-properties-order-of-operations.html",
    "lesson-04-units-rates-dimensional-analysis.html",
    "lesson-05-precision-rounding-significant-figures-percent-error.html",
    "lesson-06-algebra-readiness-synthesis-error-analysis.html"
  ].map(file => ({
    path: `courses/mathematics/algebra-1/units/unit-01/lessons/${file}`,
    scope: "algebra-1",
    base: "../../../../shared"
  })),
  ...[
    "assessment/mastery-check.html",
    "practice/core.html",
    "practice/extended.html",
    "practice/foundation.html"
  ].map(file => ({
    path: `courses/mathematics/algebra-1/units/unit-01/${file}`,
    scope: "algebra-1",
    base: "../../../../shared"
  })),
  ...[
    "index.html",
    "weekly-mastery.html",
    "midterm-units-01-06.html",
    "final-exam-36-weeks.html"
  ].map(file => ({
    path: `courses/mathematics/algebra-1/assessments/${file}`,
    scope: "algebra-1",
    base: "../../../shared"
  }))
];

for (const page of directLearnerPages) {
  const html = read(page.path);
  const headStart = html.indexOf("<head");
  const headEnd = html.indexOf("</head>");
  const contractAt = html.indexOf(`${page.base}/course-entry-contract.js`);
  const scopeAt = html.indexOf(`${page.base}/learner-scope-v1.js`);
  assert(
    headStart >= 0 && headEnd > headStart && contractAt > headStart &&
      scopeAt > contractAt && scopeAt < headEnd &&
      html.includes(`data-learner-scope="${page.scope}"`),
    `${page.path} loads the learner contract and ${page.scope} scope before page scripts`
  );
}

assert(
  preAlgebraIndex.indexOf("learner-scope-v1.js") >= 0 &&
    preAlgebraIndex.indexOf("learner-scope-v1.js") < preAlgebraIndex.indexOf("const STORAGE_KEY"),
  "Pre-Algebra installs learner scoping before its state loader"
);
assert(
  preAlgebraIndex.includes('data-learner-scope="pre-algebra"'),
  "Pre-Algebra declares its learner-scope profile"
);
assert(
  algebraIndex.includes("../../shared/course-entry-contract.js") &&
    algebraIndex.includes("../../shared/math-entry-gate.js"),
  "Algebra I keeps the Academy contract and learner gate at entry"
);
assert(
  helper.includes("legacyLearnerId") &&
    helper.includes("learners") &&
    helper.includes("KHAE_OPEN_PREALGEBRA_FORGE_V2"),
  "Pre-Algebra adapter preserves legacy ownership and independent learner slots"
);
assert(
  helper.includes('"algebra-1"') &&
    helper.includes('"khaemenes-algebra1-"') &&
    helper.includes("khaemenes_math_unit"),
  "Learner adapter covers Algebra I records and the legacy Pre-Algebra worksheet key"
);

assert(
  mathGate.includes("readScopedTarget") &&
    mathGate.includes("writeScopedTarget") &&
    mathGate.includes("legacyLearnerId"),
  "Algebra I gate migrates legacy records and permits new learner slots"
);

compile("course-entry-contract.js", contract);
compile("learner-scope-v1.js", helper);
compile("math-entry-gate.js", mathGate);

class MemoryStorage {
  constructor() {
    this.values = new Map();
  }
  getItem(key) {
    const value = this.values.get(String(key));
    return value === undefined ? null : value;
  }
  setItem(key, value) {
    this.values.set(String(key), String(value));
  }
  removeItem(key) {
    this.values.delete(String(key));
  }
}

const storage = new MemoryStorage();
let activeProfile = { learnerId: "ahja", name: "Ahja" };
const legacyKey = "KHAE_OPEN_PREALGEBRA_FORGE_V2";
const legacyValue = JSON.stringify({ schemaVersion: 2, students: [{ id: "legacy", name: "Existing learner" }] });
storage.setItem(legacyKey, legacyValue);

const context = {
  window: {
    localStorage: storage,
    KhaemenesCourseEntryContract: {
      readAcademyProfile() {
        return activeProfile;
      }
    }
  },
  localStorage: storage,
  Storage: MemoryStorage,
  document: { currentScript: { dataset: { learnerScope: "pre-algebra" } } },
  encodeURIComponent,
  Date,
  JSON,
  console
};
vm.runInNewContext(helper, context, { filename: "learner-scope-v1.js" });

assert(
  context.localStorage.getItem(legacyKey) === legacyValue,
  "First learner can read preserved legacy Pre-Algebra work"
);
assert(
  storage.getItem(`${legacyKey}:learner:ahja`) === legacyValue &&
    storage.getItem(legacyKey) === legacyValue,
  "Legacy work is copied to Ahja without deleting the original"
);

activeProfile = { learnerId: "thaeden", name: "Thaeden" };
assert(
  context.localStorage.getItem(legacyKey) === null,
  "Second learner cannot read the first learner's inherited record"
);
const thaedenValue = JSON.stringify({ schemaVersion: 2, students: [{ id: "new", name: "Thaeden" }] });
context.localStorage.setItem(legacyKey, thaedenValue);
assert(
  storage.getItem(`${legacyKey}:learner:thaeden`) === thaedenValue &&
    context.localStorage.getItem(legacyKey) === thaedenValue,
  "Second learner receives an independent writable record"
);

activeProfile = { learnerId: "ahja", name: "Ahja" };
assert(
  context.localStorage.getItem(legacyKey) === legacyValue,
  "Switching back restores Ahja's original progress"
);

const algebraStorage = new MemoryStorage();
let algebraProfile = { learnerId: "ahja", name: "Ahja" };
const algebraKey = "khaemenes-algebra1-course-v1";
const algebraLegacy = JSON.stringify({ version: 1, students: [{ id: "legacy-algebra", name: "Existing Algebra learner" }] });
algebraStorage.setItem(algebraKey, algebraLegacy);

const mathContext = {
  window: {
    localStorage: algebraStorage,
    addEventListener() {},
    KhaemenesCourseEntryContract: {
      readAcademyProfile() {
        return algebraProfile;
      },
      scopedKey(base, profile) {
        return `${base}:learner:${encodeURIComponent(profile.learnerId)}`;
      }
    }
  },
  localStorage: algebraStorage,
  Storage: MemoryStorage,
  document: {
    readyState: "loading",
    documentElement: {
      dataset: {
        mathEntry: "course",
        mathCourseId: "math-algebra1",
        mathReadinessKey: "khaemenes-math-algebra1-readiness-v1",
        mathStoragePrefixes: "khaemenes-algebra1-",
        mathEvidenceKey: "khaemenes-algebra1-diagnostic-result-v1",
        mathDiagnosticHref: "diagnostic/"
      }
    },
    addEventListener() {}
  },
  encodeURIComponent,
  Date,
  JSON,
  console
};
vm.runInNewContext(mathGate, mathContext, { filename: "math-entry-gate.js" });

assert(
  mathContext.localStorage.getItem(algebraKey) === algebraLegacy,
  "Algebra I first learner can read preserved legacy work"
);
assert(
  algebraStorage.getItem(`${algebraKey}:learner:ahja`) === algebraLegacy &&
    algebraStorage.getItem(algebraKey) === algebraLegacy,
  "Algebra I migration preserves the original unscoped record"
);

algebraProfile = { learnerId: "thaeden", name: "Thaeden" };
assert(
  mathContext.localStorage.getItem(algebraKey) === null,
  "Algebra I second learner cannot read the first learner's inherited record"
);
const algebraThaeden = JSON.stringify({ version: 1, students: [{ id: "new-algebra", name: "Thaeden" }] });
mathContext.localStorage.setItem(algebraKey, algebraThaeden);
assert(
  algebraStorage.getItem(`${algebraKey}:learner:thaeden`) === algebraThaeden &&
    mathContext.localStorage.getItem(algebraKey) === algebraThaeden,
  "Algebra I second learner receives an independent writable record"
);


const algebraScopeStorage = new MemoryStorage();
let directProfile = { learnerId: "ahja", name: "Ahja" };
const algebraDirectKey = "khaemenes-algebra1-unit01-a3-v1";
const algebraDirectLegacy = JSON.stringify({ version: 1, best: { "lesson-1": 80 } });
algebraScopeStorage.setItem(algebraDirectKey, algebraDirectLegacy);

const algebraScopeContext = {
  window: {
    localStorage: algebraScopeStorage,
    KhaemenesCourseEntryContract: {
      readAcademyProfile() {
        return directProfile;
      }
    }
  },
  localStorage: algebraScopeStorage,
  Storage: MemoryStorage,
  document: { currentScript: { dataset: { learnerScope: "algebra-1" } } },
  encodeURIComponent,
  Date,
  JSON,
  console
};
vm.runInNewContext(helper, algebraScopeContext, { filename: "learner-scope-v1-algebra.js" });

assert(
  algebraScopeContext.localStorage.getItem(algebraDirectKey) === algebraDirectLegacy &&
    algebraScopeStorage.getItem(`${algebraDirectKey}:learner:ahja`) === algebraDirectLegacy,
  "Algebra I Unit 1 direct records migrate intact to Ahja"
);

directProfile = { learnerId: "thaeden", name: "Thaeden" };
assert(
  algebraScopeContext.localStorage.getItem(algebraDirectKey) === null,
  "Algebra I Unit 1 direct records stay hidden from a second learner"
);
const algebraDirectThaeden = JSON.stringify({ version: 1, best: { "lesson-1": 92 } });
algebraScopeContext.localStorage.setItem(algebraDirectKey, algebraDirectThaeden);
assert(
  algebraScopeStorage.getItem(`${algebraDirectKey}:learner:thaeden`) === algebraDirectThaeden,
  "Algebra I Unit 1 direct records write to the second learner slot"
);

console.log(`Learner-scoped persistence validation passed (${checks.length} checks).`);
