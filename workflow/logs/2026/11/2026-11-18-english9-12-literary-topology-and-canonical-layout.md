# 2026-11-18 · English 9–12 literary tools, page topology and VNV/KA design

- Repository: `vervenveda/Khaemenes_High.github.io`
- Companion repository: `vervenveda/proresource_hub.github.io`
- Date/timezone: 2026-11-18 · America/New_York
- Type: forensic source audit / browser-reported defect / architectural hardening / curriculum connectivity / design standardization
- State: repository changes COMMITTED and re-read for source invariants; live cross-device interaction and performance certification HOLD

## Conversation summary and decisions

The approved `VNV/KA Canonical Page Architecture & Design Blueprint v1.0` and existing landing-page template are the **one source of design authority**. Apply the entire blueprint in one coordinated pass, not by stacking successive narrow CSS overrides or asking the user to supervise individual controls.

Canonical page characteristics: one 333 Network ticker and one AutoPopulate ticker in order; full-width official VNV/KA header with identity anchored left and branched hamburger anchored right; translator where supported; centered Cinzel hero (proper eyebrow/title/description hierarchy); crisp parchment content, charcoal accents, light cream text on charcoal; equal grids and aligned card widths; 7px radius; visible controls and body copy never below 16px; lower-left Class Tools and lower-right official ecosystem toolbar; centered footer; no duplicate owners or unapproved repository buttons.

High school English course content, grade-specific reading assignments, grading/80% mastery rules, protected exam pages, student IDs, academic evidence and learner records are not to be altered by design changes. The Citation Studio's existing encrypted records, passphrases, file hash limits, and exports remain authoritative in its own engine.

## Observations and lessons learned

| ID | Evidence | Learning and rule | State |
| --- | --- | --- | --- |
| E01 | English 9 Day 1 opt-in audit showed 1 ticker each, 1 header, no duplicate IDs, no overflow; reported 30px scrollbar gutter. | Use `document.documentElement.clientWidth` for centering diagnostics rather than comparing to `window.innerWidth`. | Diagnostic committed; one live report showed `mainCentered: PASS`. |
| E02 | Multiple Day 1 style/layout controllers competed over the same sections. | One page-level presentation owner, while official header, toolbars, citations, assessment and learner records each retain their separate owners. | Page consolidation committed. |
| E03 | User experienced information overload above Day 1's learning activity. | Teach in a visible Retrieve → Learn → Practice → Apply → Reflect sequence; collapse secondary resources rather than the actual first task. | Day 1 source revised; learner study still to be conducted. |
| E04 | Literary Toolkit page caused Chrome 'Page Unresponsive' and high reported disk activity. | Stop shared orchestration on the affected page, avoid polling diagnostics, isolate suspected scripts, restore individual official components only when safe. No definitive root cause or quantitative performance measurement is established. | Recovery committed; performance regression HOLD. |
| E05 | Literary Toolkit had only a few literary-specific direct destinations; class toolbar initially pointed mainly to general hubs. | Use one subject-aware 12-category directory; keep upper-grade toolkits grade-specific; companion tools do not award mastery or automatically synchronize evidence. | Directories committed. |
| E06 | Citation Studio screenshot showed tiny dark app, off-brand fonts, cramped navigation and duplicate top strip. | Apply the full Academy blueprint to both outer iframe shell and internal research interface, with parchment as the main working canvas and Sections drawer collapsed by default. | Multiple source revisions committed; final visual sign-off HOLD. |
| E07 | Citation Studio bibliography export contained a literal HTML closing script sequence inside inline JS. | Escape embedded `</script>` sequence in an export template to preserve host-script parsing. | Fixed and source syntax checked. |
| E08 | AffixSix was described as a morphology game but its actual implementation is a connect-six strategy game. | Inspect gameplay before assigning learning labels; never imply unrelated game practice is evidence for a reading unit. | Corrected toolkit classification. |
| E09 | The left Class Tools component already has a grade-aware path guard and an exam exclusion. | Reuse the shared idempotent component across Grades 9–12; explicit `data-english-course` allows companion Citation Studio; do not create competing left toolbars. | Component and fallback installer committed. |

## Curriculum and research-informed choices

- Mayer/Moreno cognitive-load principles: remove duplicate/competing navigation.
- Segmenting and signaling: meaningful learner-paced instructional stages, clear hierarchy and current task.
- Progressive disclosure: secondary source, settings and tool information behind one intentional control.
- Retrieval and distributed practice: reading, application and reflection should require evidence, not just passive consumption.
- CAST UDL and WCAG: keyboard controls, focus visibility, text size, mobile reflow and alternatives for student expression.
- Preserve authentic source custody and distinguish source titles actually assigned from unspecified additional readings.

## Changed files and representative commits

| Workstream | Paths | Change / verification |
| --- | --- | --- |
| Canonical left class tools | `courses/shared/high-school-class-tools-left-v1.js` | Scope enabled through explicit `data-english-course`; exam exclusion retained; commit `f247c30c7b1a`. |
| Universal high-school chrome entry | `assets/high-school-global-chrome-v2.js` | One-time, idempotent left toolbar loader for English 9–12 paths, excluding assessment/diagnostic pages; commit `d5f04d5657cb`; JS syntax pass. |
| English 9 Literary Toolkit | `courses/language-arts/english-9/learning-tools.html` | 12 literary categories, loading recovery, manual opt-in diagnostic, breadcrumbs, button contrast, both official toolbars; left toolbar commit `579f54bf51a8`. |
| English 9 Day 1 | `courses/language-arts/english-9/weeks/week-01/day-01/index.html`; `vnv-lesson-forensic-probe.js` | Curriculum-forward page hierarchy and source custody maintained. |
| Upper English course landings | `courses/language-arts/english-{10,11,12}/index.html` | Six equal hero actions with new grade-specific Toolkit and Evidence links; left toolbar; final landing commits `fed9ff8a7f76`, `176c04cd15f0`, `17952482f7d2`. |
| Upper English Toolkits | `courses/language-arts/english-{10,11,12}/learning-tools.html` | New pages: six-button nav, 12 literary categories, canonical chrome/translator/footer, both toolbars, canonical Reading anchor. Initial commits `36bdb3f146ea`, `c522ae2e43fd`, `a7c4d0475b1f`; anchors subsequently corrected. |
| Companion Citation Studio shell | `vervenveda/proresource_hub.github.io:Protools/Evidence_Citation_Studio/index.html` | Canonical hero and parchment frame, official ticker/header/toolbar, full-width identity/menu, duplicate support-strip retired, left toolbar mounted; commits `ee4336eabe8b`, `fcc37e4baae9`. |
| Companion Citation Studio inner app | `vervenveda/proresource_hub.github.io:Protools/Evidence_Citation_Studio/studio-core.html` | Parchment-first studio, collapsed Sections drawer, removed redundant hero emblem, centered sections and cards; commit `d66ffc336927`; export script parsing repaired earlier. |
| Other companion landings | PROSE Writer Studio, AffixSix, Learn a New Word, English 9 Week 01 and Reading Dossier | Focused typography, navigation and return-path upgrades, preserving original engines. |

## Forensic integrity checks

| Check | Result | Qualification |
| --- | --- | --- |
| HTML source fetched before editing and again for targeted regressions | PASS where inspected | Not a live end-to-end browser test |
| Citation Studio iframe, hash/file limit, source-link sanitization and encryption symbols | PASS in source | Encryption workflows not reenacted on private data |
| Citation and English page inline JavaScript syntax | PASS in inspected revisions | No claim of full runtime behavior |
| Grade 10–12 Toolkit files and `#literary-toolbox` anchors | COMMITTED | Test deployed URLs after CDN updates |
| Class Tools on English 9–12 landings and new Toolkit pages | COMMITTED | Count visible instances and check footer/toolbar clearance in browser |
| Exclusion from assessment/diagnostic paths | CODE GUARD PRESENT | Live protected-exam regression HOLD |
| Citation Studio typography, logo/menu positioning, color contrast and restored ticker order | SOURCE PATCHED | Live visual proof HOLD |
| Chrome stall and disk activity | ROOT CAUSE UNPROVEN | Test one tab without aggressive diagnostic polling |

## Next steps and acceptance gates

- [ ] Run opt-in **read-only** diagnostics at 100% browser zoom: each ticker exactly once, header and branched menu once, ecosystem and left toolbars once, no duplicate IDs or overflow.
- [ ] Verify opening and closing Citation Studio's Sections drawer, all research buttons, citation creation, project audit, backup/restore with synthetic data only, and safe return to Toolkit.
- [ ] Verify live navigation to all 12 category destinations for Grades 9–12; account for external applications that do not share learner persistence.
- [ ] Verify left and right toolbars do not cover text areas, footer, drawer or protected assessment actions at tablet sizes.
- [ ] Audit curriculum coverage and missing per-day tools separately; do not equate visual blueprint completion with curricular certification.
- [ ] Keep cross-device learner persistence and official account authority under the pending Account Cloud/STOS commissioning effort.

## Safety and closure

No live learner records or private keys were inspected. This work did not approve game scores as grades, change original learner attempts, unlock mastery, or migrate persistent storage. **GitHub source acceptance is not equivalent to deployed-browser certification**. Preserve fail-closed assessment rules and original application behavior.
## Same-day addendum · all-page left toolbar coverage

Additional implementation following the request to make the left-side Class Tools available consistently:

- Hardened `courses/shared/high-school-class-tools-left-v1.js` with a global idempotence guard, explicit `data-english-course` fallback, grade-aware `?course=english-N` companion routing and protected quiz/exam/assessment/diagnostic exclusions. Commit `7d7063937842`.
- Shared high-school chrome now mounts the left toolbar once for applicable English 9–12 course/lesson paths where that chrome is loaded. Commit `d5f04d5657cb`. Files with their own explicit script tags continue to use the same shared component.
- Directly installed Class Tools on English 9 toolkit, English 9–12 course landing pages and the Citation Studio outer page. Also installed on PROSE Writer Studio, AffixSix and Learn a New Word. Representative companion commits `8ac76dc47eea`, `bc4868122bb4`, `ee852680bf6c`.
- Created English 10/11/12 Literary Toolkit pages with 12 resource pathways, six symmetric entry buttons, canonical first-party chrome, left Class Tools, right ecosystem toolbar and centered footer. Added exact `#literary-toolbox` anchor for the Reading shortcut and `?course=english-N` on companion tools.
- Connected English 10/11/12 landing pages through six centered choices including Literary Toolkit and Evidence Studio.
- Re-fetched the outer Citation Studio, the inner studio, all English 9–12 toolkits, three companion applications, and sample English 10–12 Week 01 Day 1 pages. Inline script syntax passed in the inspected sources; representative daily pages load the shared global chrome, allowing the single left-toolbar owner to mount.

**Important scope qualification:** The architecture covers the inspected English 9–12 pages using the shared global chrome, plus the explicitly patched literary companion pages. This does not certify every unrelated Academy repository page. A complete sitewide crawl, actual interaction verification, accessibility checks, and exam-gate regression remain pending.

**New acceptance rule:** Every student-facing, non-assessment English 9–12 page should show one working collapsed Class Tools dock on the lower-left and one official ecosystem dock on the lower-right. Do not show it on assessments, diagnostics, quizzes, exams, midterms or finals. Verify mobile/tablet clearance and avoid inserting multiple competing toolbars.
