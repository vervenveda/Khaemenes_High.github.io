# High School Five-Bubble Hardening — 2026-11-23

## Bubble 1 — Legacy shared dependency firewall
- Added `tools/validate-high-school-legacy-dependencies-v1.cjs`.
- Active High School code is forbidden from depending on `courses/shared/shared/`.
- The nested directory remains quarantined compatibility material only; it cannot regain runtime authority.
- The canonical ownership manifest now records a zero-active-runtime-dependency policy.

## Bubble 2 — Canonical student-profile runtime ownership
- Added `grades/shared/high-school-profile-runtime-v2.json`.
- Grade 09 remains the canonical markup blueprint.
- Grades 10–12 retain their compatibility entrances but one shared upper-grade runtime owns grade-specific profile behavior.
- Registered learner grade remains authoritative through `high-school-profile-grade-context.js`.
- Independent upper-grade learner/progression engines are prohibited and validated.

## Bubble 3 — PWA/offline topology alignment
- Bumped the service worker to `khaemenes-high-v44-topology-hardening-20261123`.
- Added every execution-matrix course entrance to the topology precache list.
- Replaced the Pre-Algebra-heavy PWA shortcut list with balanced Grade 9–12 and core-subject entrances.
- Added `tools/validate-high-school-offline-topology-v1.cjs`.

## Bubble 4 — World Languages federation
- Added `courses/shared/high-school-world-languages-federation-v1.json`.
- Verified the public outbound instruction route through Khaemenes Linguistics.
- High School owns the two-year graduation requirement; Linguistics owns instruction.
- Cross-repository transcript return remains an explicit HOLD until an audited return-record bridge is commissioned.

## Bubble 5 — Release certification state machine
- Added `courses/shared/high-school-release-certification-v1.json`.
- Route presence and static engine/curriculum contracts can no longer be represented as full release certification.
- Browser runtime, device acceptance and offline acceptance must each pass before `release-certified` is permitted.
- Federated placement handoffs cannot be locally release-certified without a return-record audit.

## CI integration
The Grade-aware course execution workflow now runs:
- canonical ownership validation;
- zero legacy runtime dependency validation;
- shared profile runtime validation;
- World Languages federation validation;
- PWA/offline topology validation;
- release certification validation;
- the existing High School release, service-worker, portfolio, execution-matrix and subject regressions.

## Safety boundary
No mastery threshold, historical learner attempt, course-specific Math/Science authority, learner identity record, or assessment authority was replaced by this hardening pass.
