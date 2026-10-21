// Grade 9 Science first-five-bubbles structural regression checks.
// Run: node courses/science/integrated-science-9/tools/check-first-five-bubbles.mjs
import fs from "node:fs";
import assert from "node:assert/strict";
const root=new URL("../",import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),"utf8");
const portal=read("index.html"),day1=read("units/unit-01/lessons/day-01.html"),day5=read("units/unit-02/lessons/day-05.html"),vocab=read("science-vocabulary-integration.js"),studio=read("units/unit-01/question-evidence-studio.html"),controller=read("units/unit-01/unit01.js");
assert(!portal.includes("min-width:300px"),"Portal still forces 300px minimum width");
assert(portal.includes("@media(max-width:300px)"),"255px stress rules missing");
assert(!portal.includes('</script>\\n<script'),"Literal script boundary artifact remains");
assert(day1.includes('question-evidence-studio.html'),"Original inquiry studio not linked");
assert(day1.includes('science-vocabulary-integration.js') && day5.includes('science-vocabulary-integration.js'),"Vocabulary integration missing");
assert(vocab.includes("u01d01:") && vocab.includes("u02d05:"),"Lesson-specific vocabulary missing");
assert(studio.includes("formative only") || studio.includes("formative"),"Studio must not impersonate mastery");
assert(controller.includes("function unitComplete(){return REQUIREMENTS.every(requirementComplete)}"),"Unit 01 verified mastery requirements changed");
assert(controller.includes("scienceConflict"),"Unit 01 concurrent save guard missing");
console.log("PASS: Grade 9 first-five-bubbles structural checks (9 assertions).");
