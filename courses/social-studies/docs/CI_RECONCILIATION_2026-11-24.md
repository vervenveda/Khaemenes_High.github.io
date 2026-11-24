# Social Studies CI Reconciliation · 2026-11-24

## Purpose

Reconcile legacy Social Studies CI guards with the certified post-hardening architecture without disabling meaningful checks.

## Reconciled guards

### Grade 9 weekly path authority
The old guard hard-coded dozens of exact lesson-specific phrases. Those snapshots were brittle because curriculum wording can improve while the actual contract remains intact.

The replacement still verifies:
- all 36 canonical week directories;
- canonical student packet, teacher guide and quiz presence;
- compatibility directory presence;
- compatibility README ownership declaration;
- redirect-only legacy HTML;
- canonical/compatibility quiz byte identity;
- Week 05/08 historical assessment doorway integrity;
- Week 27 canonical/versioned packet ownership;
- semantic weekly rubric requirements in every canonical Grade 9 packet.

### Weekly rubric parity
The guard continues to verify:
- all five active engine rubric markers;
- 162 canonical student packets;
- essential question;
- learning target/objective;
- vocabulary;
- required evidence/assignment;
- rubric/success criteria;
- constructed response;
- 80% mastery language.

It no longer depends on a single custom Week 1 capitalization string beyond the semantic contract.

### Four-year certification
The certification now verifies the current architecture rather than duplicating packet prose:
- 162 canonical packets;
- 162 canonical teacher guides;
- 162 canonical quizzes;
- compatibility redirect ownership and quiz identity;
- canonical grade-door shell markers;
- five active engine parity markers;
- Grade 9 evaluator-owned progression;
- Grades 10–12/PF weekMastered progression;
- academic-record bridge and assessment adapter;
- keyboard skip navigation;
- learner ownership contract;
- view routing contract;
- written-evidence progression contract;
- presentation authority contract;
- canonical VNV ticker/header/translator/toolbars.

## Repository-wide failing jobs

The following red jobs observed on main are High School-wide suites, not Social Studies-specific certification jobs:

- High School Learning Architecture Regression
- High School Record and Route Validation
- Grade-aware course execution matrix
- High School Forensic State

They execute broad cross-program checks spanning mathematics, English, science, navigation, offline cache, profile/runtime ownership, and release topology.

This Bubble does **not** weaken or bypass those suites. Their step-level failure logs are not available through the current repository connector, so altering their tests without evidence would risk hiding unrelated regressions.

## Policy

A failing CI guard should be changed only when its expectation is demonstrably obsolete or its architecture contract has formally changed. Unknown failures remain visible until their exact failing assertion can be reproduced.
