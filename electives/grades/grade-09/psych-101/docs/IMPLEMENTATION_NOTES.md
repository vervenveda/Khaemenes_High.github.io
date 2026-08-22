# IMPLEMENTATION NOTES

## Current phase
Curriculum architecture first.

## Do not implement yet
Weeks 11–13 should remain student-inaccessible placeholders until their curriculum audit is complete.

## Preserve when implementation begins
- Cinzel regular-weight title stack
- Brandon Grotesque regular-weight body stack with safe local fallbacks
- centered, symmetrical professional layout
- no heavy bold typography
- vanilla HTML/CSS/JavaScript
- no external runtime dependencies
- local progress only
- explicit export/import
- print-friendly lessons
- 80% mastery semantics
- research/data/ethics strands throughout
- academic journal rather than therapeutic disclosure
- Psychology Word of the Day synchronized by lesson identity
- optional Completion Challenge system after genuine academic completion

## Psychology Word of the Day
Use the local Psychology adaptation documented in:

`reference/PSYCHOLOGY_WORD_OF_THE_DAY_PLAN.md`

Do not call the Arcade application at runtime. Preserve offline operation by using an embedded Psychology word bank.

## Completion Challenge / Reinforcement Layer
Use the plan documented in:

`reference/COMPLETION_CHALLENGE_REINFORCEMENT_PLAN.md`

Implementation rules:
- challenge offers are optional and never part of academic mastery;
- skipping or losing a challenge has no academic consequence;
- default daily challenge duration is 10–60 seconds;
- longer 1–3 minute rewards are reserved for full daily completion;
- richer 3–7 minute challenges are reserved for weekly mastery;
- challenge availability should be predictable after the target academic behavior rather than placed on a variable-ratio schedule;
- no autoplay;
- clear `Skip`, `Close`, and `Return to Lesson` controls;
- challenge modules must be local copies/adaptations with no external fonts, audio, APIs, analytics, or cross-repository runtime dependency;
- reduced-motion, keyboard, touch, visible focus, and no-required-audio operation are required;
- course language should call the games `completion rewards` or `reinforcer candidates` unless behavioral evidence establishes that they actually increase the target behavior.

## Initial local challenge set to build later
- Reaction Flash — Pocket Arcade reaction mechanic
- Focus Catch — Pocket Arcade falling-dots mechanic
- Focus Burst — compact Chromatic Focus adaptation
- Psych Word Reveal — psychology vocabulary retrieval challenge
- One-Round Grid — compact Tic-Tac-Toe challenge

The full Arcade remains separately available as an optional destination. The Psychology course should not embed full-length cabinets as routine lesson interruptions.
