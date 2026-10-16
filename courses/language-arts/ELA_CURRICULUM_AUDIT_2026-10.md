# Khaemenes High — English and Language Arts Curriculum Integrity Audit
**Audit snapshot:** 2026-10-16 · **Scope:** English 9–12 · `main` only

## Inventory and preservation boundaries

- English 9: 36 weekly plans, 12 units; 13 opening weeks already include five standalone daily lesson pages each. Keep the canonical weekly workspaces, assessment and gradebook, and original reading assignments intact.
- English 10: 36 weeks, 12 units, five instructional sequences per weekly classroom; Week 01 has individual daily learning studios.
- English 11 and 12: each has 36 weekly classrooms, 12 unit sequences, full daily instruction sections inside weekly pages, plus five detailed standalone Week 01 companion lessons built in Repair 03.
- The canonical curricula, browser curriculum mirrors, and weekly HTML lesson pages are distinct surfaces. A new QA gate now checks parity and confirms every weekly quiz renders the canonical versioned bank instead of stale embedded fallback questions.

## Major findings and addressed repair

**High priority — repetitive weekly quiz questions:** Before hardening, English 10–12 reused two identical question prompts across all 36 weeks in each course (72 of 180 questions per course, 40%). The original answer positions for English 11 and 12 used only indices 0, 1, and 3. This limited discrimination of specific reading and language skills.

**Repair:** English 10, 11, and 12 now have two week-contextual scenario/transfer items per week (216 new prompts across 108 weeks). Their answer options are deterministically rebalanced with answer keys preserved. Original three questions per week, weekly scores, student note storage, 80% mastery logic, and grader routines remain unchanged. Canonical `curriculum.json` and browser `assets/curriculum-data.js` agree exactly. Weekly runtime uses that source; legacy inline quiz JSON remains available only as a fallback.

## Remaining priorities before declaring A+++

1. **Assess the remaining generic items:** The other three questions per weekly quiz include repeated templates and common distractor patterns. Conduct a teacher-reviewed content/item-analysis sweep; a five-question weekly quiz is only a short formative check, not sufficient by itself to certify literary analysis, speaking, or research mastery.
2. **Reading custody and authenticity:** Some unit plans specify teacher-/family-selected, licensed, or public-domain literary works rather than a single bundled text. Confirm that each student has an accessible, legally reusable text or a fully specified local alternative, with author/source attribution, actual excerpts, complexity notes, and translations where appropriate.
3. **Performance-based assessment:** Verify that rubric categories for analytical writing, oral argument, original reading responses, source reliability, revision and research correspond to actual student evidence and teacher-scored work, not completion clicks or multiple-choice scores alone.
4. **Daily studio coverage:** Preserve English 9 Weeks 01–13 and English 10–12 Week 01 standalone studios. Expand isolated days gradually where the existing five-day weekly classroom does not provide sufficient examples, independent readings, teacher notes or low-stakes misconception checks.
5. **Progression and record integrity:** Test learner switching, multi-tab conflicts, offline export/restore, cumulative grading, midterm/final authority, family access and device navigation. Do not mistake passing static routes for a completed family beta test.
6. **Course-to-course coherence:** Confirm scaffolding from evidence and short literary analysis in Grade 9 through rhetoric and research in Grades 10–11 and independent inquiry, critical perspectives and a defendable senior capstone in Grade 12.

## Academic constraints

- Do not claim automatic AP, IB, Cambridge, district, accreditation, scholarship, or diploma approval.
- Maintain named authors, provenance, licensing and textual accuracy for actual works. Newly invented learning scenarios must be identified as practice, not historical records.
- Preserve original strong units, local learner-scoped scores, 80% thresholds and the Grade 9 isolated lessons.
- Teacher moderation remains necessary for original paragraphs, essays, research products, oral performances and interpretation of contested texts.

## Current verification

`node tools/validate-ela-curriculum-quality.mjs` checks all 108 weekly instructional/quiz routes, 540 quiz items, 216 contextual questions, canonical-to-browser parity, answer-key range and distribution, and preservation of 65 existing English 9 standalone lessons. CI does not replace direct pedagogical and family beta testing.
