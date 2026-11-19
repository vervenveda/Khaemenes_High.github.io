# 2026-11-19 · Algebra II Math Engine v2.3.0 representative canary

**Status:** ISOLATED BRANCH PROOF PASS · PRODUCTION ROLLOUT HOLD · BROWSER/DEVICE HOLD

**Branch:** `recovery/algebra2-v230-representative-canary-20261119`

## Recovery contract
Preserve Algebra II 92 native standard Units 01–13 lessons, `assets/lesson-tools.js` mastery rubric, `KhaemenesAlgebra2Progression`, lesson note drafts, lesson question/diagram/game content, assessment firewall and 80% mastery gates. Do not DOM-clone other mathematics courses. The v2.3.0 adapter is a presentation/checklist layer, not academic authority.

## Representative source proof
- `units/unit-01/lessons/u01-l01.html` — Function Language, Notation & Evaluation: preserves existing flow, local note/reflection and native lesson-tools script.
- `units/unit-10/lessons/u10-l06.html` — Amplitude, Period, Phase & Vertical Shifts: preserves its trigonometric-depth companion, game launcher and existing lesson tools.
- Both canaries include **one** `algebra2-math-lesson-v2-adapter.js?v=2.3.0` tag **after** the native lesson-tools script. Only these two lesson HTML files changed.
- `tools/validate-algebra2-canary-source.mjs` checks version, one adapter tag, dependency order, native lesson content/evidence controls, assessment route and the native progression/80% contract.
- `.github/workflows/algebra2-canary-source-proof.yml` runs this limited source proof on the isolated branch. Run 44630100992 **PASS**.
- No production lesson, landing page, assessment, learner profile, cloud, or STOS code was changed.

## Additional recorded CI finding
- Global engine-coverage guard is expected to **FAIL** on the isolated branch because Algebra II is 2/92, and no partial deployment is authorized. Main branch retains the declared 0/92 pending state and certified Pre-Algebra 97/97, Algebra I 87/87, Geometry 90/90.
- Existing High School Mathematics Lesson Launch Validation separately reported three Pre-Algebra component hash mismatches: `assessments/assets/exam-engine.js`, `assessments/administration-guide.html`, `records/course-completion-certificate.html`. This is not caused by the isolated Algebra II adapter tags and must be audited independently; do not reseal checksums automatically.

## Mandatory next gates before 92-lesson enrollment
1. Browser acceptance of both canaries on desktop, tablet portrait and landscape, mobile and print, including dynamic mastery/checklist synchronization, keyboard navigation and no overlay/ticker duplication.
2. Resolve any real adapter/native progression conflicts on the branch, not via a production mass patch.
3. Review all 92 native lesson URLs, required dependencies, and each unit's progression routing; retain assessment firewall.
4. Stage the 92-lesson rollout on a separate guarded branch with zero manual redirection of curriculum. Require strict 92/92 guard + CI and approval prior to merge.
5. Audit the existing Pre-Algebra component-hash mismatches separately before certifying all mathematics checks green.

The last known production-safe Algebra II state is **native lessons intact; adapter available; rollout not promoted**.
