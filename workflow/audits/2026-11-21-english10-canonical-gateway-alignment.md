# English 10 · Canonical VNV Gateway Chrome Audit & Alignment

**Date:** 2026-11-21 · **Target:** `courses/language-arts/english-10/grades/grade-10/index.html`

## Canonical source traced

Source read directly: `vervenveda/vervenveda.github.io/index.html`, Git blob `dd8b85b3584121aad86d401dc23627e6c9b3e976`, including its ecosystem directory, browser-ticker stack and the referenced shared assets.

| Function | Exact canonical source or High School adapter | Target reuse |
| --- | --- | --- |
| 333 Network ticker | Gateway `#networkTicker`; published `https://vervenveda.com/assets/vnv-333-ticker.js` | Existing High School `assets/vnv-dual-ticker-v1.js` mounts canonical ticker once |
| Auto-populating page-link ticker | Gateway `https://vervenveda.com/assets/vnv-ticker-autopopulate.js` and `VNV_TICKER.autoPopulate` | Same High School dual-ticker guard mounts shared engine |
| Official gateway-style header | Gateway `.site-header`, full-width `.header-inner`, Academy brand and header actions | Corresponding markup and presentation styles, no duplicate header renderer |
| Hamburger/directory | `https://vervenveda.com/assets/vnv-ecosystem-menu.js` and `vnv-ecosystem-menu.css` | One shared menu button in `[data-vnv-ecosystem-slot]`, no additional hamburger |
| Lower-left universal course tools | `https://vervenveda.com/assets/vnv-class-tools-toolbar.js?v=1.6.1` | Existing `courses/language-arts/assets/english-landing-class-tools-v1.js` shared configuration. Reused for nested grade entry via limited match rule extension |
| Lower-right ecosystem toolbar | `https://vervenveda.com/assets/vnv-ecosystem-toolbar.js` | One canonical script, no local competitor |
| Translator | Gateway `https://vervenveda.com/Khaemenes_Linguistics.github.io/assets/khaemenes-translator-loader.js?v=1.1.1` + `https://vervenveda.com/assets/vnv-language.js` | Loader and canonical language tool; an early hidden `data-vnv-language-mount` is moved into the lower-left toolbar by existing shared English landing configuration |

**Note:** The gateway also has presentation-specific inline orchestration and an admin convenience gate. These are **not** account authentication and are not copied into the English 10 landing page. The existing High School dual-ticker adapter is the intended shared way to mount the same 333/AutoPopulate assets without duplicating the gateway's inline bootstrap.

## Grade 10 landing remediation

The nested Grade 10 course-entry page formerly used a standalone Grade Entry layout with its own brand/navigation links, independent theme toggle, a 14 px typography override, no top tickers, no lower-left toolbar/translator, and a three-button section pointing to Course Home/Week 1/Records. It is now aligned to:

- One full-width Academy branded header and a single official ecosystem hamburger.
- Two canonical top tickers using the existing High School dual-ticker asset.
- Charcoal hero with `Khaemenes Academy` eyebrow **33px**, `English 10` title **66px**, sophomore descriptor **24px**, Cinzel/Brandon fallback.
- Exactly three centered learner/parent/enrollment doorways.
- Concise About English 10 section, one **2×2** features grid, symmetrical cards, 7px radius, charcoal and cream contrast and center-aligned charcoal footer.
- Existing Grade 10 profile/parent enrollment routes; no learner grade, records, assessments, course bank or storage modified.
- One lower-left universal toolbar with its existing embedded Translator action, and one lower-right official ecosystem toolbar.

## Scope and safety

**Modified:** only the nested English 10 Grade 10 entry HTML and the existing shared English landing toolbar URL matcher, plus a new dedicated regression suite/workflow. The primary `courses/language-arts/english-10/index.html` is the **active 36-week English II learner portal**, including its own student/course state, renderers, quizzes, reports and records. It was **not overwritten** or downgraded into a static landing: that would risk breaking existing saved learner journeys and links. Unit, week, assessment and main portal routes were not migrated.

**Validation:** `tests/english10-canonical-entry.test.mjs` was committed with six structural regressions for official script uniqueness, ticker paths, header menu, left translator dock, 33/66/24 typography, 2×2 course features, three access routes, and absence of superseded grade-entry controls. A dedicated workflow `.github/workflows/english10-canonical-entry.yml` runs them on changes. The test **has not yet been executed on the owner's Mac**; browser runtime layout, tickers, hamburger, translator dialog, tablet geometry and parent/learner navigation remain **pending live acceptance**. No runtime/CI green assertion is made here.

**Safe next step:** run `node --test tests/english10-canonical-entry.test.mjs` in the High School checkout, then inspect the nested English 10 grade-entry route in Chrome. After those acceptance checks, review the primary English II portal separately before any further replacement of its presentation owner.
