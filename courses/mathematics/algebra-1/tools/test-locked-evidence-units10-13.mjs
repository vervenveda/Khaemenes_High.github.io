import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const base=path.resolve(import.meta.dirname,"..");
const src=fs.readFileSync(path.join(base,"assets","unit-mastery-engine-v3.js"),"utf8");

for(const marker of [
  "MASTERY=80,COUNT=25",
  'BLUEPRINT="algebra1-unit-mastery-v3"',
  "if(graded)return",
  "scoreButton.disabled=true",
  "input.disabled=true",
  'resetButton.textContent="Retry same form"',
  "record.attempts.push(attempt)",
  "const persisted=save(record)",
  "No mastery credit was recorded",
  'result_schema:"khaemenes-algebra1-unit-mastery-v5"',
  'evidenceSchema:"algebra1-answer-evidence-v3"',
  'selectionPolicy:"fixed-lesson-balanced-no-shuffle-v3"',
  'retryFormPolicy:"fixed-no-shuffle"',
  "selectedDisplayIndex",
  "selectedOriginalIndex",
  "correctDisplayIndex",
  "correctOriginalIndex",
  "selectedText",
  "correctText",
  "eligiblePoolSize",
  'formSources:[...new Set(current.map(q=>q._formSource||"shared-base"))]',
  "formSeed",
  "optionOrder:[...order]"
]) assert.ok(src.includes(marker),"current v3 mastery engine is missing "+marker);

assert.ok(src.includes("result.persisted===true&&result.verified===true"),"shared storage adapter writes must require explicit persistence verification");
assert.ok(src.includes("localStorage.setItem(KEY,raw)")&&src.includes("localStorage.getItem(KEY)===raw"),"direct local storage fallback must require exact read-back verification");
assert.ok(src.includes('if(persisted){'),"saved-success UI must be guarded by persistence success");

const retiredV2=["legacy","mastery","engine","v2.js"].join("-");
for(let unit=10;unit<=13;unit++){
  const page=fs.readFileSync(path.join(base,"units",`unit-${unit}`,"assessment","mastery-check.html"),"utf8");
  assert.ok(page.includes("unit-mastery-engine-v3.js"),`Unit ${unit} formal mastery does not load current v3`);
  assert.ok(!page.includes(retiredV2),`Unit ${unit} still references retired v2`);
}
console.log("PASS Units 10–13 use fixed-form Algebra I mastery engine v3 with verified persistence and no retired v2 hooks");
