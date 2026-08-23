import fs from "node:fs";
import assert from "node:assert/strict";

const doorway=fs.readFileSync("assets/khaemenes-mentor-link.js","utf8");
const surface=fs.readFileSync("mentor/index.html","utf8");

assert.ok(!doorway.includes("artist1970.github.io"),"mentor doorway must not route to the legacy cross-origin mentor");
assert.ok(doorway.includes('MENTOR_PATH="/Khaemenes_High.github.io/mentor/"'),"mentor doorway must use the High School same-ecosystem mentor surface");
assert.ok(doorway.includes("subjectContext"),"mentor doorway must derive subject context");
assert.ok(!doorway.includes("?subject=science&source="),"mentor doorway must not hard-code science");
assert.ok(doorway.includes('params.set("stage","high")'),"mentor doorway must publish High School stage context");
assert.ok(!/learnerId|familyId/.test(doorway.split("function mentorURL")[1]?.split("function mount")[0]||""),"mentor URL builder must not place learner/family IDs in the URL");

assert.ok(surface.includes("khaemenes-family-registry.js"),"mentor surface must load the canonical Family Registry");
assert.ok(surface.includes("khaemenes-naib-mentor-router.js"),"mentor surface must load the canonical NAIB mentor router");
assert.ok(surface.includes("at least 80% mastery"),"mentor surface must state the Academy mastery boundary");
assert.ok(surface.includes("cannot unlock future curriculum"),"mentor surface must reject progression bypass");
assert.ok(surface.includes("reveal locked quiz/test items"),"mentor surface must reject locked assessment disclosure");
assert.ok(surface.includes("allowLockedAssessmentDisclosure:false"),"transport context must explicitly forbid locked assessment disclosure");
assert.ok(surface.includes("allowProgressionBypass:false"),"transport context must explicitly forbid progression bypass");
assert.ok(surface.includes("https://vervenveda.com/assets/vnv-beta-link.js"),"mentor surface must retain canonical Beta doorway");

console.log("Khaemenes High mentor bridge: PASS");
