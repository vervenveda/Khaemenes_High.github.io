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

console.log(`Learner-scoped persistence validation passed (${checks.length} checks).`);
