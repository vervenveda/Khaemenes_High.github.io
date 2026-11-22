# Upper Science Instruction Engine v1

**Scope:** Biology 10, Chemistry 11, Physics & Engineering 12  
**Pilot:** Biology 10 · Week 01 · Day 01  
**Status:** opt-in pilot

## Purpose

Provide one reusable instructional presentation controller for upper High School Science without replacing course content, assessment, evidence, learner records, mastery, or page-shell systems.

## Seven stages

1. Recall & Prepare
2. Learn & Model
3. Guided Reasoning
4. Investigate & Analyze
5. Check & Correct
6. Explain & Revise
7. Reflect & Transfer

The engine maps existing lesson sections by their instructional headings. It does not manufacture course-specific curriculum. If a lesson does not expose enough verified sections, the engine fails open and leaves the original lesson visible.

## Authority firewall

The engine does **not** own:
- grades or mastery;
- completion/unlock state;
- learner records;
- localStorage/sessionStorage/indexedDB/cookies;
- network writes;
- course routing;
- assessments;
- tickers;
- header/hamburger;
- translator/language chrome;
- universal toolbars;
- retired global chrome/page-regulator behavior.

Safety sections remain visible while guided stages are selected.

## Pilot acceptance

The Biology 10 Week 01 Day 01 pilot must retain:
- explicit science instruction;
- worked example;
- guided question;
- independent work;
- misconception check;
- formative understanding check;
- mentor evidence conference;
- teacher guidance;
- existing formative evidence bridge;
- original course navigation and footer.

Expansion to Chemistry 11 or Physics 12 remains gated on source contract PASS and browser/device review.
