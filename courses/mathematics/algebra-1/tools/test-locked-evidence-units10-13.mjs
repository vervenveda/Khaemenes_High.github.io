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

assert.ok(
  src.includes("result.persisted===true&&result.verified===true"),
  "shared storage adapter writes must require explicit persistence verification"
);
assert.ok(
  src.includes("localStorage.setItem(KEY,raw)")&&src.includes("localStorage.getItem(KEY)===raw"),
  "direct local storage fallback must require exact read-back verification"
);
assert.ok(!src.includes('Best ${s.scores.mastery}% saved.'),"legacy unconditional saved-success message remains");
assert.ok(src.includes('if(persisted){'),"saved-success UI must be guarded by persistence success");

for(let unit=10;unit<=13;unit++){
  const page=fs.readFileSync(path.join(base,"units",`unit-${unit}`,"assessment","mastery-check.html"),"utf8");
  assert.ok(page.includes("unit-mastery-engine-v3.js"),`Unit ${unit} formal mastery does not load the current hardened v3 engine`);
}

console.log("PASS Units 10–13 retain hardened compatibility evidence semantics and live mastery pages load the current v3 engine");
