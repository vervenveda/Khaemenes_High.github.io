# 2026-11-20 · High School repository five-bubble hardening

Repository: `vervenveda/Khaemenes_High.github.io`

## 1. Service-worker / cache hardening
- Advanced cache generation to `khaemenes-high-v43-eight-class-hardening-20261120`.
- Removed stale precache references to the retired seven-class schedule/runtime.
- Added the current eight-class/profile/Portfolio/Grade 12 PE/Capstone runtime surfaces.
- Added `tests/test-service-worker-current-runtime.cjs` to require current assets and reject the legacy seven-class entries.
- No learner storage is cleared or migrated by this change.

## 2. Machine-checkable course authority
Every entry in `courses/shared/course-execution-matrix-v1.json` now declares:
- current lesson resolver
- weekly assessment owner
- midterm owner
- final owner
- mastery owner
- persistence owner/schema
- Portfolio publisher
- completion-record owner

Unresolved boundaries are explicitly `pending-verification`; they are not represented as certified.
Known explicit holds include the Higher Learning return-record bridge and portfolio publication standardization for course families that do not yet have a shared publisher.

## 3. Read-only evidence provenance bridge
Added `portfolio/portfolio-evidence-receipts.js`.
- Reads only already-published learner continuation snapshots.
- Does not read assessment answers.
- Does not mutate specialist gradebooks.
- Does not write Portfolio/course records.
- Does not award mastery, grades, or credit.
- Emits normalized assessment receipts with learner/course/assessment ids, score, source, timestamps, record format, and a clearly labeled non-cryptographic FNV-1a change-detection fingerprint.

The academic progress report now includes receipt counts and receipt data in JSON exports.

## 4. Student Profile dependency ownership
Added `grades/shared/high-school-profile-runtime-contract-v1.json` and `tests/test-high-school-profile-runtime-contract.cjs`.
The contract requires exact-once critical dependencies for Grades 9–12 and forbids:
- `high-school-global-chrome-v2.js`
- `seven-class-schedule.js`
- `upper-grade-seven-class.js`

This is a static ownership guard, not a new runtime layer.

## 5. Repository-wide release gate
Added `tests/test-high-school-release-gate.cjs`.
The fast release contract checks:
- all execution-matrix entries and JSON sources exist
- authority contracts are complete
- path-backed authority owners exist
- execution-sweep routes exist
- four profile contracts exist
- current service-worker generation is active
- legacy seven-class cache owners are absent
- Portfolio hardening files and receipt bridge are connected
- the 80% mastery floor remains intact

The release gate reports explicit `pending-verification` authority holds instead of converting them into false PASS states.

## CI
`.github/workflows/course-execution-matrix.yml` now runs the release gate plus:
- service-worker current-runtime regression
- Portfolio evidence-receipt regression
- profile-runtime ownership regression
- existing execution/course/assessment suites

## Verification boundary
These changes harden source/static contracts. GitHub Actions completion and browser/device acceptance remain separate evidence layers. No learner storage, assessment attempts, specialist gradebooks, or official transcript grades were rewritten.
