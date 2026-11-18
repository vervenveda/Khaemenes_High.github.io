# November 18, 2026 · Algebra I runtime responsiveness recovery

## Trigger

Founder reported that the Algebra I course was not responsive today.

## Confirmed runtime risks

1. The Algebra I service worker still used cache release:
   `khaemenes-algebra1-v44-math-compat-20261117`.

2. Non-navigation assets were served cache-first. Mutable JavaScript, CSS, shared math runtime, and JSON could therefore continue running November 17 code even after November 18 source repairs were committed.

3. The Algebra I course landing still used a MutationObserver on the unit progression grid to synchronize lesson locks.

4. `algebra1-student-experience-v2.js` still used:
   - a MutationObserver on the resume link; and
   - a second MutationObserver on `#main` to repeatedly re-run page enhancement.

These patterns were inconsistent with the November 18 High School chrome recovery rule: one-time / explicit-event updates, no mutation-driven remount loops.

## Repairs

### Service worker

Bumped release cache to:
`khaemenes-algebra1-v45-runtime-recovery-20261118`.

Mutable runtime requests now use network-first behavior with cache fallback:
- JavaScript;
- CSS;
- JSON;
- shared course scripts;
- shared mathematics assets;
- High School global chrome;
- dual ticker guard.

Navigation remains network-first with offline fallback.

Old Algebra I caches are removed during activation.

The course landing now explicitly requests a worker update. If an existing service worker controlled the page and the repaired worker takes control, the page reloads once automatically so the learner does not need to clear storage or manually refresh twice.

### Landing synchronization

Removed the unit-grid MutationObserver.

`course-progression-gates.js` now publishes:
`khaemenes-algebra1-gates-updated`.

The landing listens for that explicit event and runs `syncLocks()`.

The resume-link updater publishes:
`khaemenes-algebra1-resume-updated`.

### Student experience

Removed both MutationObservers from:
`algebra1-student-experience-v2.js`.

The dashboard now synchronizes resume state through:
- explicit `khaemenes-algebra1-resume-updated` events; and
- a finite startup recovery schedule.

Dynamic course content can request enhancement through:
`khaemenes-algebra1-content-ready`.

No curriculum, question bank, mastery threshold, learner score, attempt history, or progression evidence was changed.

## Validation

PASS:
- Algebra I landing inline JavaScript parses.
- Algebra I service worker parses.
- Algebra I student-experience JavaScript parses.
- Algebra I progression-gate JavaScript parses.
- Landing MutationObserver count: 0.
- Student-experience MutationObserver count: 0.
- Progression-gate MutationObserver count: 0.
- Service-worker runtime cache is v45.
- Mutable runtime strategy is network-first with cache fallback.
- Existing controlled clients receive one recovery reload after worker takeover.

Regression contract:
`tests/algebra1-runtime-recovery.test.mjs`.

## Acceptance boundary

Source-level recovery is complete. Live acceptance should verify:
- course buttons respond;
- unit cards open or display intentional mastery locks;
- lesson drawers open;
- resume action updates;
- lower-left Math Tools opens;
- header/hamburger remain responsive;
- no persistent full-page busy state;
- phone/tablet/desktop interaction;
- offline fallback remains functional after a successful online refresh.

Do not clear learner records as part of recovery testing.
