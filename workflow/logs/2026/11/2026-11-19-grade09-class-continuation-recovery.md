# Grade 09 Class continuation: surgical recovery
Date: 2026-11-19
Repository: vervenveda/Khaemenes_High.github.io
Mode: scoped source fix, preservation-first; no data migration, lesson rewrite, or assessment changes.

## Reproduced source fault
The Grade 09 registry's safeCourseURL compared a repository-relative course.prefix against canonical absolute https://vervenveda.com/... FIRST_STEPS and saved URLs. This rejected legitimate instructional destinations and silently returned defaultContinue, commonly a public course landing. The upper-grade shared class manager uses a different continuation contract and was not changed.

## Repairs committed
- a7a724b: allow parsed same-origin URLs within an approved course path while retaining exact prefix approval for cross-repository language handoffs.
- ff85f08: do not replace saved continuation with a cross-course or unauthorized external launch.
- f81589a through d9a4dc0: add/strengthen in-memory Node VM regression of English 9, Pre-Algebra diagnostic, Social Studies 9, Science 9, resumed lessons, rejection and French handoff.
- ce58960: add Grade 09 Lesson Continuation Guard workflow.
- 660079f: version the Grade 09 registry loader, avoiding an older cached JS reference on the student dashboard.

## Source route existence checks
Verified tracked files exist for:
- English 9 Week 01 Day 01 index
- Pre-Algebra diagnostic index
- Social Studies 9 Week 01 student packet (redirect stub to weeks/week-01)
- Integrated Science 9 readiness diagnostic

## Protected boundaries
No edits to assessment question banks, grade/score/mastery policies, parent records, user localStorage, or existing course lessons; no global chrome injection; no changes to Vervenveda index or other grade profiles.

## Acceptance
Source commits and four route files verified via GitHub. Automated workflow has been created, but successful Actions execution has NOT been independently observed. Desktop/tablet learner runtime acceptance remains HOLD. Grade 10–12 continued-step verification and Algebra II adapter enrollment remain HOLD, not implied PASS.

## Next
1. Inspect Grade 09 workflow result and run 4-profile authenticated navigation proof.
2. Confirm each pinned course opens the last approved assigned step, not a public landing; verify 80% gates are never bypassed.
3. Test current browser worker delivery without clearing student storage.
4. Only then address Algebra II's native ordinary/multistep lesson proof, and separate UI/assessment work.
