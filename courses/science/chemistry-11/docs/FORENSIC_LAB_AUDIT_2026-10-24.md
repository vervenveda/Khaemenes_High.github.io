# Chemistry 11 · 36-week forensic lab audit · 2026-10-24

## Scope and method
Main-branch course-map review of all 36 weekly topics and labs; repository-tree verification of 36 weekly HTML landing pages and 180 day-specific deep-lesson HTML files; direct HTML sampling across 18 non-anchor weeks and all eight anchor weeks. This report does not claim all 180 lesson contents or interactive controls were opened in a browser.

## Findings
**36/36 weeks mapped:** One Week N lab/investigation activity or examination/correction alternative is specified in the map. Week 18 is midterm/corrections, and Week 36 is cumulative examination and portfolio defense; these should not be counted as new wet-lab hours.

**8/8 anchored deep investigations embedded** in Week 01, 03, 05, 10, 15, 20, 25 and 32 weekly HTML. Their topics now agree with the original course map. These are safe simulated/data investigations, not claims that learners completed physical laboratory investigations.

**Grade evidence:** Sampled non-anchor pages retain five journal input fields and a browser-local save handler. A new comprehensive Node regression test checks every weekly index, five lesson file paths, evidence fields, safety language, anchor structure, and 80% map policy.

## Outstanding release blockers
1. **25% lab-inquiry time unproven.** Course metadata states a >=25% instructional-time target, but weekly map titles, eight labs and route counts alone do not establish minutes spent in original investigative work. Requires a logged denominator (actual instructional minutes) and numerator (actual qualifying investigation minutes), with teacher review and reasonable alternative paths.
2. **Learner isolation unproven for Chemistry evidence.** The sampled page's direct localStorage key uses course/week/day text without a canonical learner ID. The separate learner-scope script may add protections, but its effective authorization and reload behavior were not demonstrated in this audit. Do not present two-child browser evidence isolation as certified.
3. **Browser persistence untested.** Source includes getItem/setItem event wiring, but full entry, reload, learner-switch, export and import journeys require controlled fictional-data testing.
4. **Safety audit is structural only.** Supplied simulation/data paths and general safety notices are visible; appropriate science educator review is still needed to certify any supervised experiment.
5. **CI status unverified.** Tests were committed and added to GitHub Actions but no passing execution result was retrieved. Do not label runtime tests green.

## Release recommendation
Retain current first-party offline journal; do not enable shared private portfolio review or formal credit issuance without authenticated authority. Next implement a privacy-safe two-learner harness and an inquiry-minute evidence ledger using fictional records, then certify a passing GitHub Actions run and actual browser journeys.
