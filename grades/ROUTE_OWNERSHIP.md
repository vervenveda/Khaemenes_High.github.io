# High School Grade Route Ownership

The `grades/` tree is a **student routing and compatibility layer**, not the canonical academic authority namespace.

## Authority rule
- Canonical course curriculum, engines, assessments and course-owned records live under `courses/`, unless the ownership manifest explicitly declares a compatibility content root.
- Grade pages may launch, route, summarize or preserve old bookmarks.
- Grade routes must not silently fork curriculum, assessment authority, mastery policy or learner records.
- Placement Mathematics remains course-owned and is not grade-owned.
- Preview pages such as `grades/grade-10/technology/` are non-authoritative until promoted through the canonical ownership manifest and execution matrix.

## Source of truth
`courses/shared/high-school-course-ownership-manifest-v1.json`

Any new Grade 9–12 course route must first declare whether it is an active course, compatibility route, preview, catalog plan or federated handoff.
