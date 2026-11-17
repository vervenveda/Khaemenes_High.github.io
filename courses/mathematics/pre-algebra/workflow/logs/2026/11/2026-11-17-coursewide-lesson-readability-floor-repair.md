# Pre-Algebra · Course-Wide Lesson Readability Floor Repair

**Date:** 2026-11-17  
**Type:** audit · accessibility · shared-engine repair  
**Course:** Pre-Algebra  
**Repository:** `vervenveda/Khaemenes_High.github.io`

## Trigger

During the Unit 13 closeout check, later-generation Pre-Algebra lessons were found to contain the older embedded typography rule:

`font-size: 14px !important`

This conflicts with the Academy requirement that ordinary readable text and controls not fall below 16px.

## Representative source audit

The first lesson from each Unit 01–13 was checked for:

- legacy 310/330/333/350px lesson side rail;
- sticky lesson record side panel;
- official 333 ticker;
- AutoPopulate ticker;
- official translator;
- inherited 14px body policy.

### Results

- Units 01–13 sampled: **no legacy lesson side rail**
- Units 01–13 sampled: **no sticky lesson record rail**
- Units 01–13 sampled: official 333 ticker present
- Units 01–13 sampled: AutoPopulate ticker present
- Units 01–13 sampled: official translator present
- Units 01–03 sampled: old 14px body rule not detected
- Units 04–13 sampled: old 14px body rule detected

The repository contains 376 Pre-Algebra HTML surfaces total, including student lessons, assessments, teacher/family guides, practice pages, tools and printables. This repair intentionally targets the shared student lesson engines first rather than treating every HTML artifact as the same page type.

## Repair strategy

Rather than editing dozens of lesson HTML files individually, the accessibility floor was added to the existing unit lesson engines for Units 04–13.

Injected runtime presentation policy:

- ordinary body baseline: **18px**
- ordinary paragraphs, list items, labels, links, controls, table cells, legends, small text, brand copy and common feedback/support text: **minimum 16px**
- no changes to scoring, mastery, learner data, gates, assessment content, answer recovery, navigation logic or lesson chronology

This is a presentation-only shared-engine repair.

## Affected shared engines

- `units/unit-04/assets/lesson-engine.js`
- `units/unit-05/assets/lesson-engine.js`
- `units/unit-06/assets/lesson-engine.js`
- `units/unit-07/assets/lesson-engine.js`
- `units/unit-08/assets/lesson-engine.js`
- `units/unit-09/assets/lesson-engine.js`
- `units/unit-10/assets/lesson-engine.js`
- `units/unit-11/assets/lesson-engine.js`
- `units/unit-12/assets/lesson-engine.js`
- `units/unit-13/assets/lesson-engine.js`

## Commit sequence

- Unit 04: `a6adb75064c38377cffb8d9fb13e94f4f6ae9550`
- Unit 05: `825a167553e5018d291c94292c54c40ecc99101d`
- Unit 06: `e5473598a4aa5e6934a881a525133840731799da`
- Unit 07: `d1d224ad291672baeb252c943fb46feeed844c74`
- Unit 08: `930a6cee2c2879035c8aa7b97c937b5c1253da5e`
- Unit 09: `06dbb67e17f9adf8f7081d6b91f0f1bd6c9dd645`
- Unit 10: `1d5021e5495dbedc47158f3aff6c55adb6741e29`
- Unit 11: `748ce6294ceb95604197532ebd73b1c5fb361343`
- Unit 12: `bb1130a083f7266c0422bdbcf90f7f50af9d4ad4`
- Unit 13: `8e390c88115eca0482a8d28e34800347e43f59be`

## Remaining scope / HOLD

- Browser/device acceptance remains required to confirm no card overflow or header crowding after the larger readable-text floor.
- Unit dashboards, assessments, practice pages, guides, tools and printables are separate surface classes and still require their own typography acceptance before the entire 376-file tree can be declared universally compliant.
- This log does not claim that every printable or teacher-only page has a 16px screen floor.

## Next step

Run the Pre-Algebra student-facing closeout audit: landing page, Unit 00/readiness, Unit 01–13 dashboards and representative lessons, then record a final architecture state with any remaining browser/device HOLDs.
