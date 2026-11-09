# High School Student Profile — Universal Feature Manifest
**Baseline:** 2026-11-08 | **Scope:** Grades 09–12 | **Status:** Source-audited, runtime parity NOT certified
**Mode:** Documentation-only baseline. No changes to learner records, runtime behavior, STOS or production configuration.

## Purpose
Freeze a single expected feature vocabulary and test contract while preserving genuine grade-specific content. The HTML entrypoints and shared JavaScript modules were inspected on the repository default branch. A referenced script is evidence of code inclusion, not proof of successful runtime operation.

## Baseline sources
- `grades/grade-09/student-profile/index.html` — SHA fa892461a2f5ffeb907a177e80f861e016860b48
- `grades/grade-10/student-profile/index.html` — SHA 6ad40a74929eeb4dbfc7e5bcd6825a2c1e40ccb8
- `grades/grade-11/student-profile/index.html` — SHA 7330bf03d993ea787a5da6e83e9bb6ed8177ca93
- `grades/grade-12/student-profile/index.html` — SHA ce69459b8aa51704b0a0def825cf1f650b4d3bba
- `grades/grade-09/student-profile/dashboard-layout.js` — SHA 8b27858d187ec16c09ebf79bc10e1bfa8d35e7cd
- `grades/shared/grade09-blueprint-upper-grade.js` — SHA dbad71e3d83b0a24f2ba1b6cb2e0bbaab32efbf7
- `grades/grade-09/student-profile/study-studio.js` — SHA 0e88376c3e1009ce2ac64a9c999fdba8d380e0cd
- `grades/shared/upper-grade-klasaipeer-studio.js` — SHA a5eae8e315b825b051225a547ef185c6dd8069e7
- `grades/shared/student-sticker-box.js` — SHA c97d9ee481555d243908b3a63238608aef3fe056
- `grades/shared/high-school-profile-grade-context.js` — SHA 2772ed3794c1b646069c56df9068796ff4d0e828

## Universal toolbar contract
The canonical *logical* actions for the Profile Tools rail are:
1. Edit Profile — registered learner editor at `grades/grade-XX/student-profile/profile/`.
2. Class Progress — registered learner's class progress dialog.
3. Schedule — registered grade's schedule dialog.
4. KlasaiPeer — grade-appropriate study studio; NOT a claim of active AI chat.
5. Yearbook — grade-appropriate Yearbook dialog / known Yearbook Studio route.
6. Creative Tools — reveal creative tools area without disorienting navigation.
7. Student Portfolio — portfolio area / learning evidence route.
8. Customize Background — eligible learner appearance dialog; for a wrong-grade visit, safe route to registered campus instead of unauthorized editor.

**Observed source:** Grade 09 dashboard declares seven base actions, including the label `Portfolio`; Grade 10–12 blueprint declares seven base actions with `Student Portfolio`. The common background module injects an eighth control for eligible learners; the upper-grade blueprint provides a safe return link for certain mismatched-grade visits. Therefore, 8 controls is an *expected authorized-state result*, not independently runtime-verified. The photo dialog exists but intentionally does not add a ninth toolbar button. Do not count absent or conditional controls as a regression without checking the current learner state.

## Cross-grade feature contracts
| Feature | G09 source | G10–G12 source | Acceptance test |
|---|---|---|---|
| Identity/profile hero | Own entry & dashboard layout | Upper-grade shared blueprint | Correct learner, grade, accessible hero |
| Edit Profile/photo/appearance | Grade 09 editor modules | Reuses Grade 09 editor modules | Changes scoped to registered learner; no academic record mutation |
| Daily Lessons | `daily-lessons/` link | `daily-lessons/` links | Route resolves correctly for each grade |
| Grades | `grades/` link | `grades/` links | Display appropriate authorized academic records |
| Games | `games/` link | `games/` links | Route valid and grade appropriate |
| Schedule / Manage Classes | Grade 09 schedule & manager | Upper-grade schedule/manager | 8 slots; pin/unpin and safe dialog behavior |
| Class Progress | G09 dialog | Upper-grade dialog | Read-only progress; no cross-learner disclosure |
| Student Portfolio | Area and learning evidence link | Area and learning evidence link | Visible, correct placement, authorized navigation |
| Study Notes | Local learner/course key | Local grade/learner/course key | Save/load and explicit retention status |
| Flashcards | Generated from notes, in-memory deck | Equivalent studio actions | Build/flip/next; persisted decks NOT yet verified |
| Whiteboard | Canvas drawing/clear | Canvas drawing/clear | Pointer interactions; persisted image NOT yet verified |
| Yearbook | Grade 09 Yearbook dialog | Upper-grade Yearbook dialog | Close, return focus, correct external studio route |
| Stickers | Shared sticker box | Shared sticker box | Reward eligibility validated; prevent duplicate claims |
| Course Catalogue | Shared catalogue | Shared catalogue | Filter/search and grade-appropriate routes |
| Checkpoints | Shared disclosure | Shared + G10 customization | Consistent placement and expand/collapse behavior |
| Visitor tour | Guest invitation script | Guest invitation script | No dead buttons; guest route does not expose private data |

**Evidence classification:** `source-present` = script, markup or route seen; `behavior-pending` = browser interaction not tested; `cloud-pending` = no authoritative STOS retention receipt inspected.

## Intentional grade-specific experiences
- Grade 09: Freshman Discovery Studio, transition/study-habits focus.
- Grade 10: Sophomore exploration and elective/goal direction; do not invent a distinct existing module without verifying it.
- Grade 11: Junior-Year Planning.
- Grade 12: Senior-Year Success & Beyond.
Preserve appropriate conversational maturity while keeping identical core tool actions and permissions.

## Open forensic issues (not yet repaired)
- **P0 persistence boundary:** Browser `localStorage` currently stores notes and multiple personalization elements. Cross-device/cloud retention is NOT established. T03 authority must be separately commissioned/verified; do not claim integration.
- **P1 rewards:** `student-sticker-box.js` advertises a sticker after an 80%+ unit quiz; intended daily rule is 5 completed classes. This manifest DOES NOT authorize changing academic grading or issuing rewards.
- **P1 study documents:** Whiteboard lacks verified save/restore; generated flashcard deck is held in memory. Preserve current functionality until a versioned learner-scoped document contract exists.
- **P1 grade routing:** Grade 11/12 `My Profile` landing card uses a fragment anchor, while separate Edit My Profile action uses `profile/`. Verify card semantics before standardizing.
- **P1 differing dialog stacks:** G09 dashboard/dialogs and G10–12 upper-grade dialogs are different implementations; compare focus restoration, empty states and missing-module behavior.
- **P1 guest and wrong-grade controls:** Registered grade must be authoritative, visitor actions must invite tour/sign-up, and no student record may be shown from a mismatched grade.
- **P2 visual parity:** Confirm typography minimum 16px, 7px radius, charcoal/cream contrast, two tickers, one header, responsive layout, focus visibility and no horizontal overflow.
- **P2 deployment dependencies:** Profile pages load assets from `vervenveda.com` and other application origins; verify links and origin-specific storage before STOS migration.

## Browser regression test grid (future work)
For each grade test: (a) own registered learner; (b) registered learner from different grade; (c) unregistered guest; (d) no storage / blocked storage; (e) narrow tablet; (f) desktop; (g) direct load and reload. Verify:
- One canonical header and expected tickers; all Profile Tools labels, count and action destinations.
- Dialog open/close/Escape/return-focus; no inaccessible or inert buttons.
- Eight-class schedule, pinned class launch, Daily Lessons/Grades/Games navigation.
- Notes persistence within same browser and explicit warning about cross-device retention.
- Grade isolation for notes, appearance, stickers and student progress.
- No unintended cross-origin navigation, no academic mutation from cosmetic controls.
- Each grade's distinctive panel remains visible and appropriately worded.

## Change control and next isolated task
This document establishes expectations only. Next task, separately: harden the Grade 09 KlasaiPeer study studio's learner-owned notes/flashcard/whiteboard document model using isolated tests; do not modify live academic data, front-door gateway, T01 or T03 authority. Re-audit G10–G12 after the G09 contract is demonstrated.

**No runtime changes in this manifest commit.**
