# Academy Entry Routing Contract · 2026-10-06

Item 1 of the cross-course hardening list establishes one placement boundary for the learner-facing routes.

The shared contract is `courses/shared/course-entry-contract.js` and the course inventory is `courses/shared/course-entry-catalog.json`. A ready route requires 80% overall and at least 80% in every essential strand. A result below either threshold routes to the course’s conditional foundation or targeted-refresh path. Readiness stays separate from course mastery and never downgrades completed work.

The local routes now use the Academy learner identity when reading or writing entry evidence:

| Course | Entry evidence | Current route |
|---|---|---|
| Pre-Algebra | Existing v3 diagnostic and NAIB profile | Compatibility reference; existing student path preserved |
| English 9 | New learner-scoped readiness record from the diagnostic | Official landing and direct weekly pages require the readiness route |
| Global Studies Honors 9 | Existing learner-scoped readiness gateway | Essential-strand metadata is aligned to 80% |
| Integrated Science 9 | Existing readiness gateway and six-week foundations bridge | Main dashboard and Unit 1 gateway use the learner-scoped route |
| Psychology 101 | Learner-scoped direct entry (elective) | Local course opens only with a selected Academy learner; no placement diagnostic is required for this elective |
| Physical Education | Federated Medicament Health Academy route | Route is catalogued; protected cross-site identity/readiness handoff remains provider-owned |

Science’s dashboard no longer creates or saves a default student when no Academy learner is selected. English’s landing and official week pages show the readiness gate before opening course work. Diagnostic records include the learner identifier and use the same scoped key pattern as the Social Studies adapter.

The Physical Education route is deliberately recorded as federated. The High repository can publish the route and contract metadata, but it cannot enforce protected continuity across a different origin until the shared account authority exists.
