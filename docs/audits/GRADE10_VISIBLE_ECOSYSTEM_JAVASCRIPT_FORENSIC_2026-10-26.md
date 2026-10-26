# High School Grade 10 — Visible Ecosystem JavaScript Forensic Repair
Date: 2026-10-26
Branch: `main`

## User-reported symptom
Raw ecosystem JavaScript appeared in the Grade 10 lessons.

## Confirmed root cause
The Grade 10 United States History Honors/Social Studies portal at
`courses/social-studies/grade-10/index.html` embeds a printable progress-report
HTML document within the JavaScript `reportHTML()` template literal.

In the pre-repair source that template contained:
- an ecosystem `vnv-beta-link.js` script tag with escaped `<\/script>`;
- a `high-school-return-to-classes.js` script tag with a literal `</script>`;
- a `high-navigation-v1.js` script tag with a literal `</script>`.

HTML parsers terminate a parent script at the first literal closing `</script>`
*even when it appears inside a JavaScript template literal*. Thus the page
browser prematurely ended its main program; the remainder could appear as
visible text or malformed markup, interrupting interactive lesson code and
report/record tools. Syntax-only compilation of the full intended JS did not
detect this boundary; the repair checks the actual HTML script-token boundary.

## Surgical correction
- Removed all script tags from the generated **offline-printable report HTML**.
- Loaded the two required High School navigation scripts at the bottom of the
  actual page, **after** the main script has closed.
- Preserved quiz data, academic content, course scoring, local evidence and
  student-state logic without alteration.
- Applied the same correction to the Grade 11 and Grade 12 Social Studies
  portals after an independent cross-grade check revealed identical defects.
- Grade 9 Social Studies's current entry page did not have that pattern.

## Verification performed
For each of Grades 10, 11 and 12:
- HTML `<script>` opening and closing tag counts match.
- The browser-delimited main inline program contains `reportHTML()`,
  `printReport()`, and `downloadReport()`, and passes JavaScript syntax checks.
- The report generator contains zero `<script>` or `</script>` tags.
- Main-page High School return and navigation scripts each appear once.
- Original report structure and course content are preserved.

New regression protections:
- `tests/social-studies-inline-report-boundaries.mjs` (Node built-ins only).
- `.github/workflows/social-studies-inline-script-boundaries.yml` on
  `main` pushes touching Grade 10–12 portals or the test.
- Grade 10 Playwright smoke test in
  `tests/test_social_studies_grade10_dashboard.py` asserting that the
  portal’s report handlers exist and that raw JavaScript does not appear
  in the lesson text.

## Remaining certification boundaries
Actual live-device Chrome behavior and successfully completed CI jobs have
not been established by this source-only investigation. A follow-up student
browser check should hard-refresh the Grade 10 Social Studies portal and
confirm that no JavaScript appears below the lessons, that tabs and weekly
work function, and that saved evidence/report printing still work.

**Scope limitation:** This confirmed failure was in the Grade 10 Social Studies
portal, not necessarily every Grade 10 subject. Representative Biology and
English lesson pages inspected did not show the same report-script boundary.
Other subject pages still require browser-level certification.
