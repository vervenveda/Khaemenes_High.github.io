import fs from "node:fs";
import assert from "node:assert/strict";

const doorway=fs.readFileSync("assets/khaemenes-mentor-link.js","utf8");
const surface=fs.readFileSync("mentor/index.html","utf8");
const voice=fs.readFileSync("assets/khaemenes-archaemenes-voice.js","utf8");
const mentorManifest=JSON.parse(fs.readFileSync("mentor-manifest.json","utf8"));
const authority=JSON.parse(fs.readFileSync("academy-authority.json","utf8"));
const mentorContract=JSON.parse(fs.readFileSync("mentor-contract.json","utf8"));
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

assert.equal(mentorContract.version,3,"mentor contract must use hardened v3 boundaries");
assert.equal(mentorContract.sessionBoundary?.bindLearnerAtPageOpen,true,"mentor contract must bind the learner at page open");
assert.equal(mentorContract.sessionBoundary?.crossLearnerContinuation,false,"mentor contract must forbid cross-learner continuation");
assert.equal(mentorContract.sessionBoundary?.guestPreviewTransport,"local-only","guest mentor sessions must remain local-only");
assert.equal(mentorContract.transportBoundary?.timeoutMilliseconds,8000,"mentor transport must have a bounded timeout");
assert.deepEqual(mentorContract.transportBoundary?.localOnlyIntents,["assessment","protected"],"assessment and protected intents must stay local");
assert.equal(mentorContract.transportBoundary?.allowGradeChange,false,"mentor transport must not change grades");
assert.equal(mentorContract.transportBoundary?.allowMasteryAward,false,"mentor transport must not award mastery");
assert.ok(surface.includes("pageLearnerId")&&surface.includes("learnerSessionCurrent")&&surface.includes("blockLearnerSession"),"mentor surface must bind and freeze learner identity");
assert.ok(surface.includes("khaemenes:learner-changed")&&surface.includes('window.addEventListener("storage"'),"mentor surface must react to learner changes");
assert.ok(surface.includes('transportableIntents=new Set(["concept","mistake","study","plan"])'),"mentor transport must use an explicit tutoring-intent allowlist");
assert.ok(surface.includes("Assessment/protected requests and guest previews stay local-only"),"mentor must fail closed before transport for protected scopes");
assert.ok(surface.includes("withMentorTimeout")&&surface.includes("mentor-transport-timeout"),"mentor transport must be time bounded");
assert.ok(surface.includes("allowGradeChange:false")&&surface.includes("allowMasteryAward:false")&&surface.includes("allowPlacementChange:false"),"mentor transport context must deny grade/mastery/placement mutation");
assert.ok(surface.includes("requestedSource.startsWith")&&surface.includes("/Khaemenes_High.github.io/")&&surface.includes("/stos/khaemenes/high/"),"mentor source context must be restricted to trusted High School prefixes");

assert.ok(surface.includes("../assets/khaemenes-archaemenes-voice.js"),"mentor surface must load the Archaemenes voice bridge");
assert.ok(surface.includes('id="voicePreview"')&&surface.includes('id="voiceMode"')&&surface.includes('id="voiceAuto"'),"mentor surface must expose optional voice controls");
assert.ok(surface.includes("Voice is presentation only"),"mentor surface must state the voice authority boundary");
assert.ok(surface.includes("microphone=()"),"mentor surface must keep microphone permission disabled");

assert.ok(voice.includes("speechSynthesis")&&voice.includes("SpeechSynthesisUtterance"),"voice bridge must provide browser-local speech fallback");
assert.ok(voice.includes("registerProvider"),"voice bridge must reserve a custom provider contract");
assert.ok(voice.includes("custom-provider-unavailable"),"voice bridge must fail closed when custom voice is selected without a provider");
assert.ok(voice.includes("storesConversationText:false")&&voice.includes("microphoneRequired:false"),"voice bridge must declare privacy-safe presentation behavior");
assert.ok(!voice.includes("fetch(")&&!voice.includes("XMLHttpRequest")&&!voice.includes("WebSocket")&&!voice.includes("http://")&&!voice.includes("https://"),"voice bridge must not call a network");
assert.ok(mentorManifest.mentorVoice?.profileId==="archaemenes-high-v1","mentor manifest must pin the Archaemenes voice profile");
assert.equal(mentorManifest.mentorVoice?.authority,"presentation-only","mentor manifest must keep voice presentation-only");
assert.equal(mentorManifest.mentorVoice?.requiresMicrophone,false,"mentor voice must not require a microphone");
assert.equal(authority.mentorVoicePresentation?.authority,"presentation-only","Academy authority must deny voice any instructional authority");
assert.equal(authority.mentorVoicePresentation?.assessmentAuthority,false,"voice must have no assessment authority");
assert.equal(authority.mentorVoicePresentation?.progressionAuthority,false,"voice must have no progression authority");
assert.equal(authority.mentorVoicePresentation?.gradeAuthority,false,"voice must have no grade authority");

console.log("Khaemenes High mentor bridge: PASS");
