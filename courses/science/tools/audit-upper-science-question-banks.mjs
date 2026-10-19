#!/usr/bin/env node
/**
 * Read-only structural audit for the Grade 10–12 public practice banks.
 * Run from any working directory with: node courses/science/tools/audit-upper-science-question-banks.mjs
 *
 * This validates bank structure and duplication hazards. It does not prove that
 * every scientific answer is correct or replace browser/runtime assessment tests.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../..");
const courses = [
  {
    name: "Biology 10",
    rel: "courses/science/biology-10/question-bank.js",
    variable: "KhaemenesBiology10QuestionBank",
    minimum: 150
  },
  {
    name: "Chemistry 11",
    rel: "courses/science/chemistry-11/question-bank.js",
    variable: "KhaemenesChemistry11QuestionBank",
    minimum: 150
  },
  {
    name: "Physics & Engineering 12",
    rel: "courses/science/physics-engineering-12/question-bank.js",
    variable: "KhaemenesPhysics12QuestionBank",
    minimum: 150
  }
];

const failures = [];
const notes = [];
const normalizeText = value => String(value ?? "").toLowerCase().replace(/\s+/gu, " ").trim();
// Keep signs and scientific punctuation: -150 and 150 are not duplicate answers.
const normalizeOption = value => normalizeText(value);

function inspectCourse(course) {
  const file = path.join(repoRoot, course.rel);
  if (!fs.existsSync(file)) {
    failures.push(`missing bank file: ${course.rel}`);
    return;
  }

  const raw = fs.readFileSync(file, "utf8");
  const assignment = new RegExp(
    `window\\.${course.variable}\\s*=\\s*(\\[[\\s\\S]*\\])\\s*;?\\s*$`
  );
  const match = raw.match(assignment);
  if (!match) {
    failures.push(`${course.name}: cannot parse ${course.variable} assignment`);
    return;
  }

  let bank;
  try {
    bank = JSON.parse(match[1]);
  } catch (error) {
    failures.push(`${course.name}: invalid JSON bank payload: ${error.message}`);
    return;
  }
  if (!Array.isArray(bank)) {
    failures.push(`${course.name}: bank payload is not an array`);
    return;
  }
  if (bank.length < course.minimum) {
    failures.push(`${course.name}: bank has only ${bank.length} questions (minimum ${course.minimum})`);
  }

  const ids = new Set();
  const prompts = new Map();
  const weeks = new Map();
  const optionDupes = [];
  let missingDifficulty = 0;

  for (const [index, question] of bank.entries()) {
    const label = question?.id || `row ${index + 1}`;
    if (!question || typeof question !== "object" || Array.isArray(question)) {
      failures.push(`${course.name}: invalid item ${label}`);
      continue;
    }

    const id = String(question.id ?? "").trim();
    if (!id) failures.push(`${course.name}: missing ID at row ${index + 1}`);
    else if (ids.has(id)) failures.push(`${course.name}: duplicate ID ${id}`);
    ids.add(id);

    const prompt = String(question.prompt ?? "").trim();
    const normalizedPrompt = normalizeText(prompt);
    if (!normalizedPrompt) failures.push(`${course.name}: missing prompt for ${label}`);
    else if (prompts.has(normalizedPrompt)) {
      failures.push(`${course.name}: duplicate prompt ${prompts.get(normalizedPrompt)} / ${label}`);
    } else prompts.set(normalizedPrompt, label);

    const options = Array.isArray(question.options) ? question.options : [];
    if (options.length < 2) failures.push(`${course.name}: fewer than two options for ${label}`);
    const optionKeys = options.map(normalizeOption);
    if (new Set(optionKeys).size !== optionKeys.length) optionDupes.push(label);

    if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer >= options.length) {
      failures.push(`${course.name}: invalid answer index for ${label}`);
    }
    if (!String(question.explanation ?? "").trim()) failures.push(`${course.name}: missing explanation for ${label}`);
    if (!Number.isInteger(question.week) || question.week < 1 || question.week > 36) {
      failures.push(`${course.name}: invalid week tag for ${label}`);
    } else {
      weeks.set(question.week, (weeks.get(question.week) || 0) + 1);
    }
    if (!String(question.source ?? "").trim()) failures.push(`${course.name}: missing source tag for ${label}`);
    if (!String(question.type ?? "").trim()) failures.push(`${course.name}: missing type tag for ${label}`);
    if (!String(question.difficulty ?? "").trim()) missingDifficulty++;

    if (course.name === "Chemistry 11" && options.some(option => /[₂₃₄₅₆₇₈₉]{2,}/u.test(String(option)))) {
      failures.push(`${course.name}: malformed consecutive subscripts for ${label}`);
    }
  }

  if (optionDupes.length) {
    failures.push(`${course.name}: repeated option text within ${optionDupes.length} question(s): ${optionDupes.slice(0, 12).join(", ")}`);
  }
  if (missingDifficulty) notes.push(`${course.name}: ${missingDifficulty} question(s) have no difficulty tag`);

  const uncovered = Array.from({ length: 36 }, (_, index) => index + 1).filter(week => !weeks.has(week));
  notes.push(`${course.name}: ${bank.length} items; ${ids.size} unique IDs; ${prompts.size} unique prompts; ${weeks.size}/36 week tags represented${uncovered.length ? `; untagged weeks: ${uncovered.join(", ")} (review whether exam-only weeks are intentional)` : ""}`);
  console.log(`${failures.some(failure => failure.startsWith(course.name + ":")) ? "CHECK" : "PASS"} ${course.name}: ${bank.length} questions; ${weeks.size}/36 weeks tagged`);
}

for (const course of courses) inspectCourse(course);

if (notes.length) {
  console.log("\nNotes:");
  notes.forEach(note => console.log(" - " + note));
}
if (failures.length) {
  console.error("\nFAIL:");
  failures.forEach(failure => console.error(" - " + failure));
  process.exit(1);
}
console.log("\nPASS: structural question-bank checks completed. Scientific answer correctness and live UI behavior require separate review.");
