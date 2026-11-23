# Fresh High School Science Forensic Audit — 2026-11-23

## Scope
Fresh department-level audit after five-bubble hardening. Evidence included current source, the new strict 720-lesson workflow, Chrome smoke matrix, repository-wide route/dependency validation, dedicated course validators, and representative Grade 9–12 lesson pages.

## Current release verdict
**HOLD for full department A+++ runtime release.**

The curriculum architecture remains strong, but this audit found a high-severity runtime dependency defect and two certification-design defects that invalidate a simple "all green" interpretation.

## Verified strengths
- 720/720 daily lesson destinations remain present.
- Designated engine markers are present 180/180 in each grade according to the department source audit.
- Four-year program-authority validator passed.
- New Chrome 4-grade × 4-viewport load/print smoke step passed.
- Science Student Experience Regression has recent green runs.
- Physics 12 dedicated strict certification run 45207214341 passed on commit 1406bab944291c2a9c7d6af301812e0cedf99e65.
- New cross-grade coherence, inquiry-state, portfolio, and browser-matrix authority artifacts are present.

## Critical forensic finding — shared upper-science engine path
Repository-wide High School Record and Route Validation run 45210389996 failed. Its dependency scan reported:

**FAIL: 536 missing local references**

The logs repeatedly resolve upper-grade lesson references such as:
`../../../../shared/upper-science-instruction-engine-v1.js`
to the nonexistent:
`courses/science/shared/upper-science-instruction-engine-v1.js`

Representative Biology 10, Chemistry 11, and Physics 12 lessons confirm this path pattern. The same lessons correctly use five parent traversals for other files in `courses/shared/`, for example:
`../../../../../shared/course-entry-contract.js`

Therefore the upper-science engine marker can be present while the actual runtime engine request is broken.

This also explains a certification blind spot: dedicated Physics strict certification can pass because it checks marker/source text, not whether the referenced engine file resolves.

## Strict 720 workflow result
High School Science Curriculum Certification run **45210390048**:
- Program authority validation: PASS
- Chrome browser/device smoke matrix: PASS
- Strict 720-lesson curriculum audit: FAIL

Audit metrics:
| Course | Inventory | Engine marker | Core contract | Depth certified | Inquiry marker | Uncertainty | Discipline depth |
|---|---:|---:|---:|---:|---:|---:|---:|
| Integrated Science 9 | 180/180 | 180/180 | 0/180 | 0/180 | 165/180 | 165/180 | 52/180 |
| Biology 10 | 180/180 | 180/180 | 43/180 | 36/180 | 82/180 | 173/180 | 144/180 |
| Chemistry 11 | 180/180 | 180/180 | 112/180 | 112/180 | 120/180 | 180/180 | 180/180 |
| Physics 12 | 180/180 | 180/180 | 161/180 | 97/180 | 174/180 | 177/180 | 114/180 |

These numbers must not be interpreted naively as curriculum quality scores because the department audit currently demands every core marker, including investigation, on every ordinary page. That conflicts with the approved five-day rhythm where full investigation is intentionally concentrated on Thursday and other days serve phenomenon, concept, data, and CER roles.

## Next five bubbles

### Bubble 1 — repair the broken upper-science runtime loader paths
Severity: **critical**.
Audit all 540 upper-grade daily lessons and correct only references that resolve to the nonexistent `courses/science/shared/` path. Then rerun the repository dependency/route validator and the course runtime regressions.

### Bubble 2 — replace all-page marker strictness with day-role certification
Severity: **high**.
The department strict audit should certify the approved weekly rhythm rather than require investigation/CER/phenomenon simultaneously on every lesson. Proposed role-aware contract:
- Monday: phenomenon + prediction/model
- Tuesday: explicit teaching + vocabulary + worked examples
- Wednesday: data/math/model + uncertainty
- Thursday: investigation/simulation/design + safety
- Friday: retrieval + misconception repair + CER/evidence revision + portfolio
Universal requirements can remain engine, learning objective, accessible practice/evidence, differentiation, teacher/parent guidance, standards/metadata as appropriate.

Protected MID/FINAL pages should use separate assessment-boundary criteria.

### Bubble 3 — make Chrome smoke fail on missing scripts/resources
Severity: **high**.
The current headless Chrome smoke passed while the shared engine path was broken because it only required a rendered DOM and engine marker. Add browser-network/console failure detection or a pre-browser local dependency crawl so required script/CSS 404s fail the smoke gate.

### Bubble 4 — preserve the forensic report even when strict certification fails
Severity: **medium**.
The strict step exits before the JSON command runs, and artifact upload is then skipped. Generate JSON first or in an always-running step, upload with `if: always()`, and fail certification in a separate final gate. A red build should preserve its evidence.

### Bubble 5 — bind new program contracts to actual learner evidence/UI
Severity: **medium/high**.
The coherence map, inquiry completion states, and four-year portfolio spine are now canonical source authorities, but they are not yet uniformly bound into real Grade 9–12 learner evidence, Student Portfolio, parent progress, and authorized review/mastery transitions. Implement without allowing browser-local state to manufacture educator-reviewed or authoritative mastery.

## Final interpretation
The fresh audit changes the priority order. Curriculum expansion is not the next task. First restore runtime integrity of the upper-science engine, then repair certification semantics, then strengthen the browser gate, then preserve failure artifacts, then bind longitudinal evidence into the learner experience.

Until Bubble 1 is repaired and route validation is green, the department should remain **SOURCE-CURRICULUM STRONG / RUNTIME RELEASE HOLD**.
