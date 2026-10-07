import fs from "node:fs";
import assert from "node:assert/strict";

const doorway=fs.readFileSync("assets/khaemenes-mentor-link.js","utf8");
const surface=fs.readFileSync("mentor/index.html","utf8");
const neutralFiles=[
  "stos/mentor/index.html",
  "stos/khaemenes/student/index.html",
  "stos/khaemenes/family/index.html",
  "stos/khaemenes/assets/khaemenes-family-registry.js",
  "stos/khaemenes/assets/khaemenes-naib-mentor-router.js",
  "stos/khaemenes/assets/vnv-beta-link.js"
];
for(const file of neutralFiles)assert.ok(fs.existsSync(file),`neutral deferred STOS file missing: ${file}`);
for(const file of neutralFiles.filter(file=>file.endsWith(".js"))){
  const bridge=fs.readFileSync(file,"utf8");
  assert.ok(!bridge.includes("fetch(")&&!bridge.includes("XMLHttpRequest")&&!bridge.includes("WebSocket")&&!bridge.includes("http://")&&!bridge.includes("https://"),`neutral STOS bridge must not call a network: ${file}`);
}
assert.ok(fs.readFileSync("stos/mentor/index.html","utf8").includes("does not call STOS Secure Server"),"STOS mentor doorway must remain an inert fallback");

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
assert.ok(surface.includes("/stos/khaemenes/assets/vnv-beta-link.js"),"mentor surface must retain canonical Beta doorway");

console.log("Khaemenes High mentor bridge: PASS");
