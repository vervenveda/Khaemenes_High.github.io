# High School Student Profile 2×4 Toolbar Audit — 2026-11-20

## Scope
Grades 09, 10, 11, and 12. Eight visible toolbar actions each (32 grade/action combinations). Source review and automated routing/owner checks; not a certified authenticated browser click-through.

## Defects and remedies
1. **Grade 09 Schedule regression:** Legacy dialog creation and the `showModal()` Schedule button were reintroduced, superseding the full standalone page. Removed the old Schedule modal owner and reparenting; direct `schedule/` anchor restored. Legacy schedule mount remains hidden and non-authoritative.
2. **Grades 10–12 Schedule regression:** A concurrent main-branch update restored `showUpperSchedule()` despite the standalone Schedule release. Removed that superseded function and wired each toolbar to its own `student-profile/schedule/` page.
3. **Grades 11–12 duplicate Edit Background:** Grade mismatch handling inserted a ninth, redundant toolbar item. Removed the extra button while preserving the original background action's redirect to the registered grade.
4. **Browser script cache:** Versioned the Grade 09 dashboard script and canonical upper-grade toolbar script in each upper-grade profile.

## Canonical action matrix
| Toolbar action | Grade 09 | Grades 10–12 | Source owner |
| --- | --- | --- | --- |
| Schedule | Standalone HTML page | Grade-specific standalone HTML page | Grade 09 dashboard / shared upper-grade blueprint |
| Student Progress | Existing class-progress popup | Existing upper-grade progress popup | Grade-specific progress dialog |
| Student Portfolio | Shared portfolio page with Grade 09 query | Shared portfolio page with actual grade query | Portfolio workspace |
| KlasaiPeer | Existing Study Studio open method | Shared upper-grade Study Studio open method | Existing studio JS |
| Edit Profile | Grade 09 profile editor | Own grade's profile editor | Profile pages |
| Edit Background | Existing background dialog | Same learner-scoped background dialog | Shared profile background module |
| Yearbook | Existing Grade 09 Yearbook dialog | Existing upper-grade Yearbook dialog | Existing Yearbook controllers |
| Creative Tools | Existing dynamically mounted ecosystem tools | Existing Grade 09-blueprint rooms panel | Existing feature modules |

## Verification evidence
- `node tools/validate-grade09-schedule-page-route.mjs`: confirms Grade 09 opens standalone Schedule, without owning any Schedule popup; verifies Grade 10–12 pages remain independent.
- `node tools/validate-high-school-profile-eight-tools.mjs`: confirms exact eight labels/order for both toolbar owners, 32 course-profile action slots, owned feature scripts, destination files, and no extra Edit Background.
- Automated workflow **Four-Grade Profile 2x4 Toolbar Regression**: PASS on PR #92 branch (2026-11-20).
- Review PR: https://github.com/vervenveda/Khaemenes_High.github.io/pull/92
- Earlier PR #91 is superseded due to the concurrent main-branch upper-grade popup regression.

## Outstanding live acceptance
Use authenticated student profiles in Grades 09–12 and check each of the 8 actions on desktop and tablet, including keyboard, focus return, grade mismatch, and browser back. Source-level PASS is not a device-level certification. Do not delete grades or learner storage to test toolbar behavior.

## Data and authority preservation
No course scores, readiness history, quizzes, final exams, transcripts, personal progress data, STOS, Account Cloud, or canonical VNV gateway scripts changed.
