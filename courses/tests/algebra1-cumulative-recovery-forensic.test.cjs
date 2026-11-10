"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"../mathematics/algebra-1/assets/exam-engine.js"),"utf8");
// Source contract guard: never silently overwrite an invalid draft, and always retain the exact recovery bytes.
assert.match(source,/draftFrozen=true;return \{answers:\{\},responses:\{\},submitted:false\}/);
assert.match(source,/if\(draftFrozen\)\{explainDraftRecovery\(\);return false\}/);
assert.match(source,/localStorage\.getItem\(C\.storage_key\)!==draftSnapshot/);
assert.match(source,/draft_raw:raw/);
assert.match(source,/draft_changed_since_load:raw!==draftSnapshot/);
// Identity contract: a crashed two-stage submission must keep its same attempt ID.
assert.match(source,/draft\.attempt_id=makeAttemptId\(\);draft\.submitted=true/);
assert.match(source,/attempt_id:draft\.attempt_id\|\|null/);
assert.match(source,/matchingAttempt\(ev,attempt\.attempt_id\)/);
assert.match(source,/if\(existing\)return ev/);
assert.match(source,/if\(!draft\.attempt_id\)\{explainDraftRecovery\(\);return\}/);
assert.match(source,/if\(draftFrozen\|\|draftRecoveryRequired\(\)\)/);
// Explicit note: these guards are not a browser transactional or cross-device test.
console.log("Algebra I cumulative recovery source guards PASS (synthetic/static; not browser E2E).");
