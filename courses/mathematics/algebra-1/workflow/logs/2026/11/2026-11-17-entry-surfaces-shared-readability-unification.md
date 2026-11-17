# 2026-11-17 · Algebra I Entry Surfaces and Shared Readability Unification

- Repository: `vervenveda/Khaemenes_High.github.io`
- Timezone: America/New_York
- Type: repair · visual unification · accessibility · topology
- State: source repairs committed; static verification PASS for repaired patterns; live browser/device acceptance HOLD
- Authority: `workflow/blueprints/high-school-landing-pages/algebra-1.md`

## Scope

Presentation-only unification of Algebra I course entry surfaces and shared student-experience architecture against the Academy Mathematics target established during the Pre-Algebra pass.

No learner records, grades, assessment answers, question banks, mastery gates, assessment history, storage migrations or course chronology were changed.

## Source audit findings

1. Course landing contained a major peer split using `1.15fr .85fr`.
2. Diagnostic and Unit 01–13 entry pages lacked an explicit translator declaration.
3. Unit 01–13 entry pages embedded a legacy `14px !important` body typography policy.
4. Shared `assets/styles.css` used a `minmax(0,1fr) 320px` practice/assessment rail and sticky `.practice-side`.
5. Shared student-experience CSS retained multiple sub-16px labels/actions and a 15.5px mobile body size.
6. Representative lesson HTML from Units 01, 05, 10 and 13 still embeds the older 14px policy, but the shared Algebra I student-experience layer can safely provide the rendered readability floor.
7. Unit 01 Lesson 01 is intentionally frozen from behavioral enhancement; it therefore required a presentation-only exception so shared CSS + translator still load without enabling behavioral changes.
8. Official high-school global chrome and dual-ticker assets contain both 333 and AutoPopulate behavior. Landing-page chrome parity remains a separate follow-up because the course landing uses its own custom ticker/header implementation.

## Committed repairs

### Course landing
- `courses/mathematics/algebra-1/index.html`
  - major start grid normalized from `1.15fr .85fr` to equal two-column peers;
  - sub-16px source typography declarations normalized to 16px where applicable.
- Commits:
  - `093228b9c134bb95de7d56b6534f65a955036078`
  - `95e960230ef13ff4daf5eda2c7ec4651ed189598`

### Diagnostic
- `courses/mathematics/algebra-1/diagnostic/index.html`
  - official translator added;
  - source typography floor normalized to 16px.
- Commits:
  - `0ab680360716483c277b6b4b0f87fe106e2d6deb`
  - `7b84ef6dea5e99844cdaf817a6109d2f51512e4b`

### Unit 01–13 entry pages
All 13 unit `index.html` files:
- changed embedded 14px body/print floor to 16px;
- added official VNV language script.
- Unit 01–03 commits:
  - `0cd071e29555a1d2a61970ca72dd09f330cf98ab`
  - `62a21ba42393c55591e800bda3ab2ac34168209c`
  - `1ff8b338654bc4f5c2844a204c34cc078e79724c`
- Unit 04–08 commits:
  - `1ee6adfa033f07b0273244fc480315436c86f117`
  - `d01d93405421a4362b3a64fe6b0425b4fe9b52b6`
  - `8626086acf5be34c226563bb3a7adf7f1876a658`
  - `f118d900626f8b4f81b53c88f06d65725e8d7dc6`
  - `31dec423a68073a49b67b87e4e768fc68f77c2b3`
- Unit 09–13 commits:
  - `918769091232bacaf47b666a5518d072118a744c`
  - `22c2e707cc26dc3e277b9abb51595f2c8aa40dff`
  - `bbf314b588b87a0c7065169eef26e3b00273ce13`
  - `8e0522989a130c31d27e84cb54d8a04574c8ef28`
  - `68b6c3107fb3e95343325c21c686b9a70a7d1f5a`

### Shared practice / assessment architecture
- `courses/mathematics/algebra-1/assets/styles.css`
  - removed the 320px secondary rail from `.practice-layout`;
  - changed `.practice-side` from sticky to static;
  - normalized explicit sub-16px declarations to 16px.
- Commit: `fe5f1975afe06a5b95f3a7b5bb43c3e4c0e13f88`

### Shared student experience
- `courses/mathematics/algebra-1/assets/algebra1-student-experience-v2.css`
  - normalized explicit sub-16px declarations to 16px;
  - mobile body floor corrected from 15.5px to 16px.
- Commit: `4d35440c8992cead07dc99ff2f6e5e348958531b`

- `courses/mathematics/algebra-1/assets/algebra1-student-experience-v2.js`
  - added idempotent official translator loader for Algebra I student surfaces;
  - frozen Unit 01 Lesson 01 remains excluded from behavioral enhancement, but now receives presentation-only shared CSS and translator.
- Commits:
  - `48930f89cc5336c4ec90aeb16adcd6b53dc8008e`
  - `afe3149cf1aba1d73c1bc635494d99d5f3b1acb3`

## Static verification

PASS:
- landing no longer contains the `1.15fr .85fr` major split;
- Diagnostic + Unit 01–13 entry pages contain translator coverage;
- Unit 01–13 entry pages no longer contain the legacy 14px embedded body floor;
- shared `styles.css` no longer contains the 320px practice rail or sticky `.practice-side`;
- shared student-experience CSS contains no explicit px font sizes below 16;
- dual-ticker/global-chrome assets confirm 333 + AutoPopulate capability;
- Unit 01 Lesson 01 behavior remains frozen while presentation layer is permitted.

## Remaining HOLD / next audit

1. Course landing still uses a custom header/ticker architecture rather than the same explicit dual-ticker/global-chrome loader used by Unit pages; normalize only after duplicate-instance risk is inspected.
2. Representative lessons still contain old embedded 14px source declarations, although the shared experience layer now supplies the rendered 16px floor. A full lesson-source cleanup may be desirable later, but should be pattern-driven rather than 87 manual edits.
3. Assessment/practice pages need source and rendered acceptance after the shared rail removal.
4. Browser/device acceptance remains HOLD: desktop, tablet portrait, tablet landscape and phone.
5. Live deployment should be checked for exactly one 333 ticker + one AutoPopulate ticker after landing chrome normalization.

## Next action

Audit and normalize Algebra I landing chrome/ticker parity and representative lesson/assessment rendered topology, then continue through the next shared pattern rather than editing isolated pages.
