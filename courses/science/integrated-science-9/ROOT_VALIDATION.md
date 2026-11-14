# Root Course Validation

## Package

Khaemenes Academy — International Integrated Science 9  
Course code: `KH-SCI-IIS9`

## Current release truth

The canonical `course-map.json` reports a **36-week course with readiness plus Units 01–12 open**. The student-facing package contains 180 daily lesson pages (5 readiness lessons plus 175 unit lessons), cumulative public practice assessments, learner-scoped formative evidence, portfolio/backup tools, and unit-level learning resources.

“Open” means the student route is released in the public course. It does **not** by itself mean browser/device certification, protected summative mastery, accreditation, or transcript authority.

## Automated checks completed

- HTML/source structure and JavaScript runtime validation
- Required course-map and root resources present
- Course duration confirmed at 36 weeks
- Thirteen instructional sections confirmed: readiness plus Units 01–12
- All thirteen sections are currently marked `open`
- Learner-scope isolation and cross-unit record checks
- Cross-tab stale-save and competing-record safeguards
- Science question-bank structure and answer-integrity checks
- Unit 01–12 progression and record checks
- Portfolio, backup and restore source-level regression checks
- Public entry-route and grade-aware execution checks
- Duplicate-ID/source-level presentation checks in dedicated blueprint workflows
- No public official answer-key or protected official final authority is exposed by the student navigation

## Release-state vocabulary

1. **Open** — student route is available.
2. **Source validated** — repository automation and static/simulated behavior checks pass.
3. **Browser/device validated** — real browser, viewport, keyboard, print, offline and assistive-technology checks have been performed on the exact release commit.
4. **Certified** — required browser/device evidence is complete and no critical release defect remains.
5. **Transcript-authoritative** — protected supervised summative results and educator/Academy verification have been accepted by the authoritative academic-record system.

Do not collapse these states into one status.

## Manual certification still required

The B01–B14 matrix in `RELEASE-CERTIFICATION.md` remains the authoritative human browser/device gate. Until that evidence is completed on an exact release SHA, the course remains **source validated / conditionally released**, not fully certified.

## Maintenance rule

Any substantive functional change after browser/device certification requires targeted retesting. Curriculum changes must keep the unit standards maps, pacing guides, student checklists, assessment boundaries, and release documentation synchronized.
