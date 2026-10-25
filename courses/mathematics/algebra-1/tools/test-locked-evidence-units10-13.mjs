import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const base=path.resolve(import.meta.dirname,"..");
const src=fs.readFileSync(path.join(base,"assets","legacy-mastery-engine-v2.js"),"utf8");

for(const marker of [
  "if(graded)return",
  "scoreButton.disabled=true",
  "input.disabled=true",
  'resetButton.textContent="Begin a new attempt"',
  "record.attempts.push(attempt)",
  "const persisted=save(record)",
  "No mastery credit was recorded",
  'evidenceSchema:"algebra1-answer-evidence-v2"',
  '"algebra1-late-unit-monte-carlo-v1"',
  '"algebra1-unit13-capstone-depth-v1"',
  "bankVersion,",
  '"lesson-balanced-low-overlap-v1"',
  '"lesson-balanced-capstone-depth-low-overlap-v1"',
  "capstoneQuantitativeMinimum:Number(R.unit)===13?10:null",
  "capstoneQuantitativeCount:Number(R.unit)===13?",
  "capstoneLessonQuantitativeCounts:Number(R.unit)===13?",
  "selectedDisplayIndex",
  "selectedOriginalIndex",
  "correctDisplayIndex",
  "correctOriginalIndex",
  "selectedText",
  "correctText",
  "eligiblePoolSize",
  "formSources:[...new Set(current.map(q=>q._formSource||\"shared-base\"))]",
  "formSeed",
  "immediatePriorOverlap",
  "optionOrder:[...order]"
]){
  assert.ok(src.includes(marker),"late-unit mastery engine is missing "+marker);
}

assert.match(
  src,
  /function save\(p\)\{try\{localStorage\.setItem\(KEY,JSON\.stringify\(p\)\);return true\}catch\{return false\}\}/,
  "late-unit storage writes must return a success flag"
);
assert.ok(!src.includes('Best ${s.scores.mastery}% saved.'),"legacy unconditional saved-success message remains");
assert.ok(src.includes('if(persisted){'),"saved-success UI must be guarded by persistence success");

for(let unit=10;unit<=13;unit++){
  const page=fs.readFileSync(path.join(base,"units",`unit-${unit}`,"assessment","mastery-check.html"),"utf8");
  assert.ok(page.includes("legacy-mastery-engine-v2.js"),`Unit ${unit} formal mastery does not load the hardened shared engine`);
}

console.log("PASS Units 10–13 lock graded mastery answers, preserve v2 evidence, and record Monte Carlo form metadata");
