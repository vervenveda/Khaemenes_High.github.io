# 2026-11-19 — English 9 six-task Daily Learning Portal (protected preview)

**Source authority:** user-approved saved file `khaemenes_english_daily_landing_template.html`, dated November 18, 2026 (17,578-byte Library HTML source; complete markup and scripts examined before use).

**Scope:** Grade 09 only; source and tests staged on `recovery/english-09-12-minimal-lesson-boundaries-20261119`. No production merge or learner-data migration.

## New complete HTML page

- `courses/language-arts/english-9/daily-learning/index.html` — one complete 22.7 KB source file adapted from the original six-card template.
- Daily date, opening thought, progress bar, print, and six expandable task cards retained **in order**: Daily To-Do Schedule; Daily Vocabulary (10 Words); Daily Journal; Daily Reading Assignment; Daily Questionnaire; Exit Ticket & Reflection.
- Direct `../weeks/week-01/day-01/` native lesson entry, Week 01 studio, preserved 36-week `../course-workspace.html`, and Grade 09 Student Profile links.
- Explicit instruction that local organizer checkmarks/drafts do **not** confer course mastery, credit or sovereign cloud persistence; JSON draft export added for learner-managed backup.
- Resume Last Opened English 9 Lesson link may use existing Grade 09 last-launch URL **only** when it points inside an expected English 9 weekly route. Never injects arbitrary external URL.

## Canonical chrome

- Shared High School `vnv-dual-ticker-v1.js` (333 + auto populated), official VNV header mount, no second handwritten header or hamburger.
- Shared `english-landing-class-tools-v1.js` expanded only to match this additional Grade 09 daily route; embedded translator and canonical bottom-left class tools.
- Official bottom-right ecosystem toolbar; existing VNV language script.
- Existing template CSS retained as a single HTML-owned presentation stylesheet, with content header/footer scoped so they do not alter universal chrome. Main navigation uses 7px radius and 16px text. Existing task and progress markup preserved.

## Class routing

- `courses/shared/high-school-eight-class.js`: Grade 09 English first-step now points to `english-9/daily-learning/`.
- `grades/grade-09/student-profile/student-course-registry.js`: English 9 Class action resolves to this daily organizer, not to the minimal public course homepage or assessment. Existing last genuine lesson launch is preserved when the Class link opens the organizer.
- Other courses and Grade 10–12 Class routes unchanged.

## Verification

- `tools/validate-english-minimal-lesson-boundary.mjs` covers original template six cards, date and progress controls, original and new inline script compilation, canonical Chrome references, Grade 09 Class→Daily route, first native lesson link, approved course workspaces, and other English 9–12 weekly inventory.
- Recovery workflow `.github/workflows/english-minimal-lesson-boundary-recovery.yml` now observes Grade 09 Daily HTML, shared class catalog, and toolbar configuration, and performs Node syntax checks.
- Source-level GitHub Actions **PASS** on run 44640450248.
- **HOLD:** browser visual/interactive acceptance, script network fetches, actual per-student resume records, responsive/print UI, and full High School regression acceptance. No production deployment authorized.

## Protected boundaries

Original English 9 Week 01 Day 01 daily lesson, all 144 English weekly entry pages, existing English grade masters, assessments, student pins, learner evidence and cloud commissioning not edited in this increment. The new organizer is NOT the academic source of truth and does not replace the daily lesson engine.
