# November 18, 2026 · High School cross-grade runtime recovery

## Trigger

After Pre-Algebra and Algebra I became unresponsive, the Founder requested verification that the same shared-runtime problem had not affected other High School grades and courses worked on the previous day.

## Scope checked

Major landing surfaces were inspected across:
- High School root;
- Grades 09–12;
- Student Profile dashboards Grades 09–12;
- Pre-Algebra, Algebra I, Geometry, Algebra II;
- English 9–12;
- Integrated Science 9, Biology 10, Chemistry 11, Physics & Engineering 12;
- Social Studies 9–12;
- Physical Education;
- Electives.

The forensic signature was:
- stale/cache-first service workers;
- document MutationObservers used for repeated UI repair;
- repeated interval-driven UI repair;
- blocking inert/overlay patterns;
- duplicate shared navigation loads.

## Findings and repairs

### Mathematics

The same stale-runtime pattern was confirmed across the remaining mathematics courses:
- Pre-Algebra cache release v22;
- Geometry cache release v17 plus a landing MutationObserver;
- Algebra II cache release v13 plus a landing MutationObserver.

All four mathematics courses now use November 18 recovery workers and request explicit service-worker updates with one takeover reload for already-controlled clients.

Current releases:
- Pre-Algebra v23;
- Algebra I v45;
- Geometry v18;
- Algebra II v14.

Geometry and Algebra II no longer use MutationObservers to repeatedly inject activity cards.

### Shared High School worker

The root High School service worker controls grade pages and courses without a narrower worker. Its release was dated November 18 but its non-navigation runtime strategy was still cache-first.

It was upgraded to:
`khaemenes-high-v42-runtime-recovery-20261118`.

Mutable JS, CSS, JSON, manifests and shared assets are now network-first with release-cache fallback.

The High School front door now uses `updateViaCache:"none"`, calls `registration.update()`, and reloads once when a repaired worker takes control of an existing client.

The remaining homepage ticker-height MutationObserver was removed and replaced with finite startup retries plus ResizeObserver on the two ticker elements only.

### English

English 10–12 had November 15 cache-first service workers. They were upgraded to:
- `khae-english10-v7-runtime-recovery-20261118`;
- `khae-english11-v7-runtime-recovery-20261118`;
- `khae-english12-v7-runtime-recovery-20261118`.

Their mutable runtime is network-first with offline fallback, and their landing pages explicitly update/recover the worker.

English 9 has no course-specific service worker. Its single `setInterval` is the intentional reading timer. Apparent duplicate language-script text belongs to its printable-report HTML template rather than a second live page script.

### Grades, profiles, Science, Social Studies, PE and Electives

Grades 09–12 landing pages, Science 9–12, Social Studies 9–12, PE and the four Student Profile dashboards showed no remaining broad MutationObserver or repeating-interval pattern after repair.

The Grade 9 Student Profile had one short-lived support-card MutationObserver. It was replaced with finite retries and an explicit profile-ready event.

The Electives landing loaded `high-navigation-v1.js` twice. The second compatibility load was removed.

These pages inherit the recovered root High School worker unless a narrower course worker owns their scope.

## Runtime recovery releases

- High School root: v42
- Pre-Algebra: v23
- Algebra I: v45
- Geometry: v18
- Algebra II: v14
- English 10: v7
- English 11: v7
- English 12: v7

All active recovery service-worker files parse successfully and use network-first mutable-runtime handling with cache fallback.

## Safety boundary

No curriculum, question bank, score, mastery threshold, learner record, Family Registry data, profile data, assessment attempt history, or Account Cloud/STOS record was cleared or rewritten.

## Regression protection

Added:
`tests/high-school-runtime-recovery-parity.test.mjs`

The contract checks major cross-grade/course landing surfaces for MutationObserver regressions and locks the recovered worker versions and fresh-runtime policy.

## Acceptance boundary

Source verification is complete. Live browser acceptance is still required to prove:
- High School front door responsiveness;
- grade landing navigation;
- Student Profile controls;
- one representative course per department;
- service-worker takeover/reload;
- tablet portrait/landscape behavior;
- offline fallback after a successful online refresh.

Status: **CROSS-GRADE SOURCE RECOVERY PASS · LIVE BROWSER ACCEPTANCE PENDING**.
