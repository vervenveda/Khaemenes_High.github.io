# English 9–12 · Week/Day Source Propagation Validation
## Authenticated Reading/Source Learner Path

**Validation date:** 2026-11-15  
**Scope:** English 9–12 · Weeks 01–36 · standalone daily lessons where present  
**Result:** PASS

## Purpose

Unit-level source custody is useful only if the learner can see the authenticated source at the point of instruction. This propagation layer connects the validated Unit 01–12 custody records to the actual week/day learner path.

## Canonical propagation layer

New shared file:

`courses/shared/week-source-custody-v1.js`

The layer:
- derives grade and week from the learner URL;
- maps all 36 weeks in English 9, 10, 11 and 12;
- presents a compact **Authenticated Reading / Source** card;
- identifies the exact recorded source or the required custody state;
- links to the corresponding Unit reading-custody dossier;
- links directly to a stable source when a single direct source is appropriate;
- updates the rendered legacy **Reading/source family** field where present so the student does not see a contradictory generic label;
- distinguishes PASS, CONDITIONAL, HOLD and BLOCK states;
- performs no grading, scoring, storage or network retrieval.

## Weekly topology

Coverage:
- English 9: Weeks 01–36
- English 10: Weeks 01–36
- English 11: Weeks 01–36
- English 12: Weeks 01–36

**Total weekly source mappings: 144**

All four canonical grade `assets/course.js` files load the shared propagation layer on weekly routes.

Validation:
- shared script parse: PASS
- English 9 course.js parse: PASS
- English 10 course.js parse: PASS
- English 11 course.js parse: PASS
- English 12 course.js parse: PASS
- shared-layer localStorage references: 0
- shared-layer fetch calls: 0

## Standalone daily lesson topology

Repository topology contains **65 standalone daily HTML pages**, all in English 9:
- Weeks 01–13
- five daily pages per week

English 10–12 and English 9 Weeks 14–36 keep daily instruction inside weekly pages, so the weekly source layer already covers their daily learner flow.

The 65 English 9 standalone daily pages are driven by 13 canonical daily engines:
- `daily-lesson.js`
- `week02-daily.js`
- `week03-daily.js`
- `week04-daily.js`
- `week05-daily.js`
- `week06-daily.js`
- `week07-daily.js`
- `week08-daily.js`
- `week09-daily.js`
- `week10-daily.js`
- `week11-daily.js`
- `week12-daily.js`
- `week13-daily.js`

All 13 daily engines now load the same canonical custody layer.

Daily-route validation:
- all 13 daily engines parse: PASS
- all 13 contain the canonical custody loader
- daily route dossier paths correctly climb one additional directory level
- representative Day 01 and Day 61 pages use the expected canonical daily engines

## Learner-facing behavior

The source card uses four fail-closed states:

- **PASS** — the learner receives the recorded source/edition and direct access when appropriate.
- **CONDITIONAL** — the course permits a choice/current/media/research source, but the exact item must be recorded before entering graded work.
- **HOLD** — an outside assessment passage or selected source cannot be treated as released until provenance is complete.
- **BLOCK** — the source is prohibited from an authoritative path until exact metadata and lawful access exist.

Examples:
- exact plays/novels/poems identify the recorded edition;
- research weeks identify item-level source-record requirements;
- current Census/USAJOBS material preserves retrieval/date context;
- media-publication weeks preserve separate asset rights;
- capstone/final weeks preserve provenance inheritance and block unrecorded outside material.

## Legacy generic labels

The audit found stale learner-facing labels such as:
- “teacher-selected”;
- “approved novel”;
- “public-domain or licensed drama excerpt”;
- “selected criticism”;
- “complete novel or drama”;
- “short story or novel excerpt.”

The propagation layer synchronizes the rendered **Reading/source family** field with the authenticated custody record where that field exists. This avoids duplicating source metadata into 144 HTML pages and reduces future version drift.

The original curriculum wording remains in source HTML as a curricular category/history unless a separate content migration is intentionally approved.

## Authority boundary

This propagation layer:
- creates no learner-data key;
- writes no localStorage;
- makes no network fetch;
- changes no quiz/test/final;
- changes no score;
- changes no mastery state;
- changes no portfolio authority;
- changes no evaluator authority.

It is presentation and source-navigation logic only.

## Final decision

**The authenticated reading/source record is now propagated from Unit custody to the Week 01–36 learner path across English 9–12, including all 65 standalone English 9 daily lessons.**

The next quality frontier is a browser/runtime visual regression of representative source cards across:
- desktop;
- tablet landscape/portrait;
- phone;
- print;
- PASS / CONDITIONAL / HOLD / BLOCK states.
