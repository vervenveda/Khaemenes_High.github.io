# Khaemenes Academy — Learner-owned Pre-Algebra archive v1

## Purpose

A student or an adult authorized for the family learner may save an offline ZIP containing a **single selected** Pre-Algebra course learner's browser-local work. The archive is a portable backup and a future T03 import input candidate, **not a verified academic transcript or authority credential**.

Entry points:
- Pre-Algebra Course Dashboard / Course Records Office: `records/learner-archive.html?mode=course`
- Grade 9 Student Profile: `records/learner-archive.html?mode=student`
- Family Portal progress card (only if `KhaemenesFamilyRegistry.canAdult(adultId, learnerId, "progress.view")`): `records/learner-archive.html?mode=parent&learnerId=<learner-id>`

Student-profile mode requires an active family learner and an explicit family-to-course association. Parent mode checks active adult, correct family learner and permission, then requires an explicit browser-local association with the course student's ID. Neither an identical name nor a URL parameter establishes a verified identity. The parent association is labelled `parent-asserted-local-only`.

## Files in ZIP (uncompressed, standard ZIP/STORE format)

- `progress.json`: schema, timestamp, one course learner's 36-week progress, quizzes, assignments, exams and capstone plus learner-scoped drafts and locally recorded activity events
- `report.html`: VNV and Khaemenes Academy printable report
- `activity-evidence.json`: captured, learner-scoped game/video openings; no completed/watched claim without a separate certified event source
- `unattributed-record-notice.json`: counts of legacy unit and exam records lacking verifiable learner ownership; **no cross-student raw record contents**
- `README.txt`: privacy, provenance and restore caveats
- `manifest.json`: file list, timestamps, SHA-256 digests when available, learner ID, course ID, and explicit non-authoritative status

Archives are not encrypted. Users are responsible for protected storage and should avoid sharing raw student backups. Export runs in the user's browser; nothing is transmitted.

## Data fidelity

Current course state `KHAE_OPEN_PREALGEBRA_FORGE_V2` holds weekly lesson checks, assignment checks, quiz attempts/marks, exam records, and capstone work for each course learner. Those values are preserved rather than recomputed. Learner-specific ungraded drafts (`khaemenes-prealgebra-lesson-draft-v2:<course-learner-id>:...`) and events (`khaemenes-prealgebra-activity-v1:<course-learner-id>`) are included when available.

Existing individual unit progress keys and assessment scores are browser-global. They **must not** be silently associated with whichever learner happens to be selected. They are excluded from the student ZIP until a proper learner-scoped evidence migration or explicit authorized reconciliation is implemented. A missing record is **not** a score of zero.

Game opens are not proof the student played or mastered the game. Video opens are not proof of viewing. Existing shared game score keys are not imported as learner-owned unless they are migrated with valid ownership evidence.

## T03 future-import contract (NOT IMPLEMENTED)

A future sovereign T03 importer must:
1. Authenticate the importing adult or learner and validate permission for the specified family learner.
2. Parse ZIP in a safe sandbox, with explicit compressed/uncompressed limits, path validation, and file manifest allowlist.
3. Verify SHA-256 and file sizes against the manifest; reject mismatches or malformed data.
4. Validate schema and expected course/learner identifiers, including authorized course-to-family association.
5. Stage a read-only comparison/preview; never overwrite existing learner grades or best demonstrated mastery.
6. Reconcile unit evidence individually, quarantine unassigned historical records, and obtain explicit approval for merges.
7. Produce a tamper-evident receipt of what was imported, rejected, or held for review. Never assume this browser-local ZIP is a cryptographically signed teacher transcript.

Do not claim that ZIP import, student account binding, STOS commissioning, or end-to-end browser recovery has been certified. A runtime and print-preview QA pass remains required.

## Unit completion reminder

The course reminder checks the active course learner's weekly checkpoint evidence for the complete set of weeks in each official unit (five days, three assignments and 80% or better quiz per week). It does not infer ownership from browser-global unit assessment keys. Reminders are advisory, not a substitute for the official mastery gate. Selecting *Remind me later* suppresses repeated prompts within the same browser session; choosing export marks that unit's reminder as acknowledged.

