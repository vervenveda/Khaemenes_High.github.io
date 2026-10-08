# Proof Path Builder · Khaemenes Academy

An original offline-capable Geometry proof game. No dependencies, tracking, remote resources, or third-party scripts.

## Install

Copy `index.html` into:
`courses/mathematics/assets/learning-games/proof-path-builder/index.html`

The game supports lesson launcher query parameters `mode=angles`, `mode=triangles`, `mode=parallel`, `mode=proof` (aliases: `angle`, `congruence`, `logic`). It accepts `course`, `unit`, and `lesson` parameters without requiring them.

## Curriculum coverage

- Angle relationships: vertical angles, linear pairs, complementary angles.
- Triangle congruence: SSS, SAS, ASA.
- Parallel lines: corresponding and alternate interior angles, corresponding-angles converse.
- Proof logic: midpoint, transitive congruence, reflexive property, SSS.

This is an introductory **guided proof-chain** game, not a freeform formal proof checker. The game contains 12 authored proofs with 2–4 steps each; the order of questions cycles through each mission. It does not claim to cover all Geometry proof standards.

## Accessibility and QA

Buttons and selector are keyboard operable; text describes givens independently of diagrams; feedback uses a live region. Browser screen-reader and cross-device QA remain pending. Progress is stored in localStorage, with manual JSON export.

## Integration policy

Do not add to canonical registry or modify lesson pages until the uploaded game is confirmed in GitHub main. Link via existing `assets/shared-game-launcher.js` before `</body>`.
