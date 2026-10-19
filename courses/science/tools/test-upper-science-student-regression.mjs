#!/usr/bin/env node
/**
 * Source/engine regression checks for upper-grade science student assessments.
 * Run from repository root:
 *   node courses/science/tools/test-upper-science-student-regression.mjs
 *
 * This is a deterministic Node VM test, not a substitute for live browser testing.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../../..");
const ENGINE_PATH = path.join(ROOT, "courses/shared/monte-carlo-assessment-v1.js");
const courses = [
  {
    id: "biology-10",
    title: "Biology 10",
    dashboard: "courses/science/biology-10/index.html",
    bankPath: "courses/science/biology-10/question-bank.js",
    bankGlobal: "KhaemenesBiology10QuestionBank",
    learnerScope: "biology-10"
  },
  {
    id: "chemistry-11",
    title: "Chemistry 11",
    dashboard: "courses/science/chemistry-11/index.html",
    bankPath: "courses/science/chemistry-11/question-bank.js",
    bankGlobal: "KhaemenesChemistry11QuestionBank",
    learnerScope: "chemistry-11"
  },
  {
    id: "physics-engineering-12",
    title: "Physics & Engineering 12",
    dashboard: "courses/science/physics-engineering-12/index.html",
    bankPath: "courses/science/physics-engineering-12/question-bank.js",
    bankGlobal: "KhaemenesPhysics12QuestionBank",
    learnerScope: "physics-engineering-12"
  }
];

const failures = [];
const checks = [];
function check(name, fn) {
  try {
    fn();
    checks.push(name);
    console.log("PASS " + name);
  } catch (error) {
    failures.push(name + ": " + (error?.stack || error));
    console.error("FAIL " + name + ": " + error.message);
  }
}
function read(relative) {
  const absolute = path.resolve(ROOT, relative);
  assert.ok(absolute.startsWith(ROOT + path.sep), "path must remain inside repository");
  assert.ok(fs.existsSync(absolute), "missing file: " + relative);
  return fs.readFileSync(absolute, "utf8");
}
function createStorage() {
  const data = new Map();
  return {
    getItem(key) { return data.has(String(key)) ? data.get(String(key)) : null; },
    setItem(key, value) { data.set(String(key), String(value)); },
    removeItem(key) { data.delete(String(key)); },
    clear() { data.clear(); },
    dump(key) { return data.get(String(key)); }
  };
}
function loadEngine() {
  const localStorage = createStorage();
  const win = {};
  const context = { window: win, localStorage, console, Date, Math, Uint32Array, Blob: globalThis.Blob };
  vm.runInNewContext(read("courses/shared/monte-carlo-assessment-v1.js"), context, {
    filename: "monte-carlo-assessment-v1.js",
    timeout: 3000
  });
  assert.ok(win.KhaeMonteCarloAssessment, "assessment API should load");
  return { api: win.KhaeMonteCarloAssessment, localStorage };
}
function parseBank(course) {
  const win = {};
  vm.runInNewContext(read(course.bankPath), { window: win }, { filename: course.bankPath, timeout: 3000 });
  const bank = win[course.bankGlobal];
  assert.ok(Array.isArray(bank), course.title + " question bank must be an array");
  return bank;
}
function localTargetExists(source, raw) {
  if (!raw || raw.startsWith("#") || raw.startsWith("//") || raw.startsWith("/") ||
      raw.includes("${") || /^(?:[a-z][a-z0-9+.-]*:)/i.test(raw)) return true;
  const stripped = raw.split("#", 1)[0].split("?", 1)[0];
  if (!stripped) return true;
  let decoded;
  try { decoded = decodeURIComponent(stripped); } catch { return false; }
  const base = path.posix.dirname(source);
  const target = path.posix.normalize(path.posix.join(base, decoded));
  if (target === ".." || target.startsWith("../")) return false;
  return fs.existsSync(path.join(ROOT, target)) ||
    fs.existsSync(path.join(ROOT, target, "index.html")) ||
    (!path.posix.extname(target) && fs.existsSync(path.join(ROOT, target + ".html")));
}

for (const course of courses) {
  check(course.title + " dashboard learner scoping and assessment guard", () => {
    const html = read(course.dashboard);
    assert.ok(html.includes('data-learner-scope="' + course.learnerScope + '"'),
      "dashboard must declare its own learner scope");
    assert.ok(html.includes("monte-carlo-assessment-v1.js"), "shared assessment engine must load");
    assert.ok(html.includes(course.bankPath.split("/").pop()), "course bank must load");
    assert.ok(html.includes("MC.isActive("), "submission must check active session identity");
    assert.ok(html.includes("assessmentConflict"), "assessment must track cross-tab/session conflicts");
    assert.ok(html.includes("MC.saveResponse("), "answer changes must be persisted as responses");
    assert.ok(html.includes("MC.complete("), "completed sessions must be closed by the shared engine");
    assert.ok(html.includes("stateSnapshot"), "submission must detect a changed learner/course snapshot");
  });

  check(course.title + " dashboard local href/src targets", () => {
    const html = read(course.dashboard);
    const attrs = /\b(?:href|src)\s*=\s*(["'])(.*?)\1/gi;
    const missing = [];
    for (const match of html.matchAll(attrs)) {
      const raw = match[2].trim();
      if (!localTargetExists(course.dashboard, raw)) missing.push(raw);
    }
    assert.deepEqual(missing, [], "missing local targets: " + missing.join(", "));
  });

  check(course.title + " bank is unique and assessable", () => {
    const bank = parseBank(course);
    assert.ok(bank.length >= 150, "bank should support meaningful randomization");
    const ids = new Set();
    const prompts = new Set();
    for (const [i, q] of bank.entries()) {
      assert.ok(q && typeof q === "object", "invalid bank item " + i);
      assert.ok(String(q.id ?? "").trim(), "missing ID at item " + i);
      assert.ok(!ids.has(String(q.id)), "duplicate ID " + q.id);
      ids.add(String(q.id));
      const prompt = String(q.prompt ?? "").trim().toLowerCase().replace(/\s+/g, " ");
      assert.ok(prompt, "missing prompt at item " + i);
      assert.ok(!prompts.has(prompt), "duplicate prompt " + q.id);
      prompts.add(prompt);
      assert.ok(Array.isArray(q.options) && q.options.length >= 2, "bad options for " + q.id);
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length,
        "bad answer index for " + q.id);
      assert.ok(String(q.explanation ?? "").trim(), "missing explanation for " + q.id);
    }
  });
}

check("Monte Carlo engine syntax and API", () => {
  new vm.Script(read("courses/shared/monte-carlo-assessment-v1.js"), { filename: "monte-carlo-assessment-v1.js" });
});

check("Monte Carlo resume preserves question and option order", () => {
  const { api, localStorage } = loadEngine();
  const bank = Array.from({ length: 40 }, (_, i) => ({
    id: "q" + i, prompt: "Prompt " + i, options: ["A", "B", "C", "D"], answer: i % 4,
    explanation: "Explanation " + i, domain: "domain-" + (i % 5), source: "core", type: i % 2 ? "evidence" : "concept", week: i % 36 + 1
  }));
  const opts = { kind: "test", count: 20 };
  const first = api.openSession("course::test", bank, opts);
  const firstMaterialized = api.materialize(bank, first);
  const resumed = api.openSession("course::test", bank, opts);
  const resumedMaterialized = api.materialize(bank, resumed);
  assert.equal(resumed.id, first.id, "refresh/resume should keep the same active session");
  assert.deepEqual(Array.from(resumed.questionIds), Array.from(first.questionIds));
  assert.equal(
    JSON.stringify(resumedMaterialized.map(q => [q.id, ...q.optionOrder])),
    JSON.stringify(firstMaterialized.map(q => [q.id, ...q.optionOrder])),
    "refresh/resume must preserve randomized option order"
  );
});

check("Monte Carlo rejects stale session writes and prevents double completion", () => {
  const { api, localStorage } = loadEngine();
  const bank = Array.from({ length: 8 }, (_, i) => ({
    id: "id" + i, prompt: "Prompt " + i, options: ["yes", "no"], answer: i % 2,
    explanation: "Because", domain: "d" + i, source: "core", type: "concept", week: i + 1
  }));
  const session = api.openSession("learner-a::quiz", bank, { kind: "quiz", count: 5 });
  const chosen = Array.from(session.questionIds)[0];
  assert.equal(api.saveResponse("learner-a::quiz", chosen, 1, session.id), true);
  assert.equal(api.saveResponse("learner-a::quiz", "not-in-session", 0, session.id), false);
  assert.equal(api.complete("learner-a::quiz", { score: 4, total: 5 }, session.id).attempts.length, 1);
  assert.equal(api.isActive("learner-a::quiz", session.id), false, "completed attempt must no longer be active");
  assert.equal(api.saveResponse("learner-a::quiz", chosen, 0, session.id), false, "stale response must be rejected");
  const secondComplete = api.complete("learner-a::quiz", { score: 5, total: 5 }, session.id);
  const stored = JSON.parse(localStorage.getItem("learner-a::quiz"));
  assert.equal(stored.attempts.length, 1, "repeated completion must not duplicate an attempt");
  assert.equal(secondComplete.conflict, true, "completion with no matching active session should report conflict");
});

check("80% mastery messaging and public-practice boundary are explicit", () => {
  for (const course of courses) {
    const html = read(course.dashboard);
    assert.ok(/80%/.test(html), course.title + " should display mastery target");
    assert.ok(/practice/i.test(html), course.title + " should distinguish public practice");
  }
});

console.log("\\nUpper science student regression: " + checks.length + " checks passed; " + failures.length + " failed.");
if (failures.length) {
  console.error(failures.join("\\n"));
  process.exit(1);
}
