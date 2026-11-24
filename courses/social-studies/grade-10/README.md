# Khaemenes Academy · Grade 10 United States History Honors

**Production student portal:** [index.html](index.html). The production portal now uses the same canonical-data pattern as the surrounding high-school social studies program.

**Canonical runtime:** `course-data.js` is the authoritative Grade 10 curriculum source and `app.js` is the authoritative student-portal renderer. The public `index.html` loads those files directly. Do not re-embed a second curriculum copy inside `index.html`.

**Migration safeguard:** the previous embedded production page was preserved at `workflow/legacy-index-pre-canonical-migration-2026-11-16.html`. On first load, `app.js` checks for the former `KHAE_SS10_USH_CLEAN_PORTAL_V1` browser record and migrates compatible lesson, assignment, quiz, and exam evidence into the canonical `khaemenes_grade10_social_studies_v1` record without deleting the legacy record.

## Weekly path authority
- **Canonical weekly curriculum owner:** `weeks/week-01/` through `weeks/week-36/`.
- The historical sibling paths `week-01/` through `week-36/` are compatibility mirrors only; they are not an independent curriculum source.
- Do not author or revise curriculum in the historical `week-XX/` paths.
- Repository validation requires every compatibility-mirror filename and file body to remain byte-identical to its canonical `weeks/week-XX/` counterpart. Any drift fails CI.
- The Grade 10 student runtime opens standalone weekly packets from the canonical `weeks/` tree.

## Course
- 36 weeks, five lesson days each week, three principal assignments weekly.
- Weekly objective mastery threshold: **80%**; midterm 80% before opening Week 19.
- The final is gated on completion of Week 36 and midterm objective mastery.
- Weekly assignments must be submitted, but checkbox completion is not equivalent to a teacher-scored academic grade.
- Activity progress and objective quiz results are visible. An authoritative course grade remains **pending teacher grading** until rubric-based assignment, journal, and written-exam evidence is recorded.
- Assessment attempts and learner records remain in browser localStorage. Export JSON before clearing browser data.

## Known limitations and next hardening
1. The canonical curriculum is now externalized and active; continue parity testing against printable packets, teacher tools, and offline caches before retiring any historical compatibility files.
2. Course grading still needs a teacher-scored rubric and official gradebook integration; activity percentage is not a transcript grade.
3. Browser-only records are not tamper-resistant. Offline exports provide backup, not trusted credential verification.
4. Weekly quiz banks are currently ten reviewed objective questions per week. Future expansion should add larger reviewed banks while preserving the 80% mastery rule and correction-based retakes.
5. Continue auditing printable student evidence, Academy-first titles, source traceability, and teacher-review handoff.

## Progression regression checks
- New learner: Week 2 disabled.
- Quiz below 80%, even with other boxes checked: next week disabled.
- Quiz at least 80% with missing assignments or lesson: next week disabled.
- All five lessons, all three assignments and quiz at least 80%: next week enabled.
- Week 18 complete but midterm below 80%: Week 19 disabled.
- Import/export retains previously saved records and the same storage key.
- Academic grade is not inferred from checkboxes.

## Midterm paths (October 2026)
- The **active student portal** (`index.html`) contains a 40-item reviewed objective midterm pool. Its shared Monte Carlo assessment adapter normally draws **30** questions, randomizing question and answer order while retaining the same 80% objective mastery threshold.
- The **standalone printable exam** (`assessments/midterm.html`) remains a separate 50-objective-question form with three teacher-scored written responses and its own browser draft store. It is **not** a synchronized view of the portal bank, and completing it does **not automatically update the portal's 80% midterm gate**.
- For official progression, use the portal midterm; use the separate exam only as a supervised supplementary/printable assessment until a deliberate grading/record bridge is developed. Teacher-scored written work must be reviewed separately and should not be represented as an automatically certified course grade.
- Follow-up: verify randomized form persistence, offline printing, teacher rubric, and cross-path evidence reporting in a browser.


## State/localization rule
Grade 10 U.S. History Honors is **state-localizable by requirement**. State history, state constitutions/government, Indigenous nations, civil-rights cases, migration, labor/economic evidence, archives, and civic records should be layered into the national course where appropriate. See `STATE_LOCALIZATION_GUIDE.md`. The 80% mastery standard is not localizable.
