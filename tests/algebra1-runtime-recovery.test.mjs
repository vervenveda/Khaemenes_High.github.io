import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read=p=>fs.readFileSync(new URL("../"+p,import.meta.url),"utf8");
const index=read("courses/mathematics/algebra-1/index.html");
const sw=read("courses/mathematics/algebra-1/service-worker.js");
const experience=read("courses/mathematics/algebra-1/assets/algebra1-student-experience-v2.js");
const gates=read("courses/mathematics/algebra-1/assets/course-progression-gates.js");

test("Algebra I landing no longer watches the DOM for gate synchronization",()=>{
 assert.doesNotMatch(index,/new\s+MutationObserver/);
 assert.match(index,/khaemenes-algebra1-gates-updated/);
 assert.match(index,/khaemenes-algebra1-resume-updated/);
});

test("Algebra I student experience uses explicit events instead of MutationObservers",()=>{
 assert.doesNotMatch(experience,/new\s+MutationObserver/);
 assert.match(experience,/khaemenes-algebra1-resume-updated/);
 assert.match(experience,/khaemenes-algebra1-content-ready/);
});

test("Algebra I progression gates publish explicit completion events",()=>{
 assert.match(gates,/khaemenes-algebra1-gates-updated/);
 assert.doesNotMatch(gates,/new\s+MutationObserver/);
});

test("Algebra I service worker invalidates the November 17 runtime cache",()=>{
 assert.match(sw,/khaemenes-algebra1-v45-runtime-recovery-20261118/);
 assert.doesNotMatch(sw,/khaemenes-algebra1-v44-math-compat-20261117/);
});

test("mutable runtime assets are network-first with offline cache fallback",()=>{
 assert.match(sw,/function mutableRuntimeRequest/);
 assert.match(sw,/request\.destination==="script"/);
 assert.match(sw,/request\.destination==="style"/);
 assert.match(sw,/function networkFirst/);
 assert.match(sw,/cache:"no-store"/);
 assert.match(sw,/matchReleaseCache\(request\)/);
});

test("existing controlled clients reload once after the repaired worker takes control",()=>{
 assert.match(index,/const hadController=Boolean\(navigator\.serviceWorker\.controller\)/);
 assert.match(index,/navigator\.serviceWorker\.addEventListener\("controllerchange"/);
 assert.match(index,/location\.reload\(\)/);
 assert.match(index,/registration\.update\(\)/);
});
