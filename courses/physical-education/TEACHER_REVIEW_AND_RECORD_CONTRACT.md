# Physical Education 9–12 — protected assessment and records contract

Status: implementation contract, **not a deployed teacher service**.

## Authority boundary
The static course is a learning and draft-capture surface only. Browser localStorage, downloaded JSON, student-selected grades and self-checked quiz responses are **untrusted inputs**. They must never be treated as verified mastery, completion, placement or transcript credit. An authorized teacher administration service must authenticate the learner, verify enrollment and reviewer authorization, evaluate original evidence and issue signed or server-attested receipts. Do not put signing keys or administrator secrets in public HTML or JavaScript.

## Grade 9 review pipeline
1. Learner completes 36 weekly lessons with dated evidence, accessibility adaptations when relevant, and formative knowledge checks.
2. Learner exports an unverified JSON journal and sends it through the protected Academy handoff. The static course does not currently implement that handoff.
3. Protected service binds evidence to the authenticated learner, checks grade and assessment version, prevents cross-learner records, and records submission ID, reviewer, timestamp and revision history.
4. Teacher scores each weekly practical rubric: knowledge/rationale (4), safety (4), technique or accessible equivalent (4), evidence/reflection (4), adaptation/inclusion (4); 16/20 is the 80% threshold. Knowledge self-check alone never passes the weekly practical requirement.
5. Midterm follows Week 18 and protected weekly prerequisite approval. Midterm rubric totals 40; threshold 32. Final follows Week 36 and approved midterm; final totals 52; threshold 42. Draft pages may remain viewable for preparation before eligibility.
6. Teacher may return work for revision without penalizing disability, body size, speed, equipment access or protected health information.
7. Protected service issues a unique signed/attested receipt after approved scoring, with immutable course/grade/assessment version, learner binding, issuer, issued time, evidence hash and revocation status. Client caches only a display copy.
8. Student profile and family progress pages read only service-verified results; failure to contact the service displays 'verification unavailable' instead of converting drafts to passes.

## Persistence
Local browser data is a recoverable convenience only, not authoritative storage. The JSON export is intentionally marked verified:false. Imports, when added, must validate schema and learner binding and must never import verified:true from untrusted files. No automatic synchronization to STOS is claimed.

## Assessment quality
The 36-week Grade 9 question bank still uses repeated answer structure and requires independent item writing, answer-position randomization and discrimination review. Grade 10–12 require separate authored lessons and assessments; do not label generic outlines as complete courses.

## Regression gates before release
- Missing, malformed or forged local journal cannot issue a verified receipt.
- Learner switching cannot expose a previous learner's saved evidence.
- Midterm/final eligibility comes from service-approved receipts, not local checkboxes.
- Offline state clearly distinguishes draft, submitted, approved, and unavailable.
- Keyboard and screen reader navigation, mobile touch, print and JSON export work.
- Accessibility options preserve learning outcomes.
- Correct rubric totals: weekly 20/16, midterm 40/32, final 52/42.
- Every internal link and route resolves in deployment; no third-party dependencies or secrets.
