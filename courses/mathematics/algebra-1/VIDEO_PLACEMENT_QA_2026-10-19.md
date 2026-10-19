# Algebra I Video Mapping and Verification — 2026-10-19

## Result
Mapped the seven existing preferred-instructor video candidates to eight specific Algebra I lessons using the **existing course-specific** `video-map.json` and the **existing canonical** `../assets/video-library/`. No new video player architecture was introduced.

All eight candidate placements have `enabled: false`; the existing two early Unit 01 staged placements also remain disabled. Each newly mapped lesson path and each shared asset file was re-fetched and found to exist; all seven shared records matched their asset IDs and were disabled.

| Algebra I lesson | Shared asset | Match notes |
|---|---|---|
| U03 L02 · One- and two-step linear equations | MATH-LINEAR-EQUATIONS-001 | Work through and verify equations |
| U04 L02 · Linear inequalities | MATH-LINEAR-INEQUALITIES-001 | Solve inequalities; sign reversal needs explicit lesson context |
| U05 L02 · Function notation and evaluation | MATH-EVALUATING-FUNCTIONS-001 | Evaluate function expressions and substitute values |
| U06 L02 · Slope from tables, graphs and points | MATH-SLOPE-FORMULA-001 | Two-point slope is directly supported; tables and graph interpretations need written lesson instruction |
| U07 L03 · Systems by substitution | MATH-SYSTEMS-ELIMINATION-SUBSTITUTION-001 | Substitution-focused portion |
| U07 L04 · Systems by elimination | MATH-SYSTEMS-ELIMINATION-SUBSTITUTION-001 | Elimination-focused portion; reuses same video |
| U09 L06 · Factoring trinomials and difference of squares | MATH-FACTORING-TRINOMIALS-001 | Introductory trinomial factoring; supplement difference-of-squares coverage |
| U10 L04 · Quadratics by factoring | MATH-QUADRATICS-FACTORING-001 | Factoring and zero-product method |

## Accessibility and playback release gate — pending
- Public web indexing confirms topic descriptions/links for some source IDs, **but is not an embedded player test**.
- Open the published lesson at desktop, tablet and phone widths; test consent-free launch, keyboard focus, title and fallback.
- Confirm actual `youtube-nocookie.com/embed/` playback and that no undesirable interruptions obscure instruction. A privacy-enhanced embed **cannot guarantee no ads**.
- Verify caption availability and readability *for each video*. Existing shared candidate metadata has `captions_verified:false`, `transcript:null`, `playback_verified:false`.
- Supply a learner-friendly text alternative where captions or video are unavailable. Existing lesson reading and worked examples remain the primary instructional path.
- Only after the above checks, set individual placement `enabled:true` and use the existing Pre-Algebra companion presentation. Never make video completion a mastery gate.

## Context and preservation
- Pre-Algebra embedded videos, transcripts, and their course placement map remain unchanged.
- Existing Algebra I Unit 01 Lesson 02/03 presentation remains unchanged.
- Student records, gradebook, and 80% mastery mechanisms remain unchanged.
- No new student-facing embeds were enabled in this pass.

## Next pass
Run a real browser/media-accessibility inspection on the published GitHub Pages site; fix specific failing captions or fallbacks and activate reviewed placements individually, not as a blanket enable operation.

## Review workspace added

The repository now provides [`video-review.html`](./video-review.html), an independent browser workspace that reads the course `video-map.json` and canonical shared asset metadata, launches the same privacy-enhanced embed format as Pre-Algebra, and exports a human-reviewed playback/caption/accessibility checklist. This is **not an automated certification**, cannot detect ads or captions itself, and never changes video activation flags or learner records. The published URL and embed were not accessible through the external verification tool in this pass, so **no video was newly approved or enabled**.
