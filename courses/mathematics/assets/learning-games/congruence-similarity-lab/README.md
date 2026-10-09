# Congruence & Similarity Lab · Sovereign Game 09

Standalone, original, offline-capable HTML/CSS/JS learning game for Khaemenes Academy.

## Installation

Place `index.html` at:
`courses/mathematics/assets/learning-games/congruence-similarity-lab/index.html`

The shared lesson launcher supports `data-game="congruence-similarity-lab"` and query parameter `mode`.

Supported modes: `congruence`, `correspondence`, `similarity`, `scale`, `mixed`. Aliases: `triangle`, `triangles`, `parts`, `similar`, `dilation`, `proportion`.

## Curriculum scope

1. Triangle congruence tests: SSS, SAS, ASA, AAS, HL.
2. Corresponding sides and angles based on ordered triangle names.
3. Similarity tests: AA, SAS similarity, SSS similarity.
4. Scale factors and missing corresponding side lengths.
5. Mixed challenges.

## Pedagogical boundaries

This first release uses guided verbal givens and schematic SVG triangles, explicitly not drawn to scale. It does **not** establish theorems by visual appearance, supply full two-column proofs, cover ambiguous SSA, or assess similarity from measured diagrams. Answers are locally generated; unlimited retries and hints are provided. The score is a practice counter, **not** an Academy mastery certification or automatic gradebook integration.

## Privacy and portability

No libraries, CDNs, external assets, telemetry, accounts, or network calls. Local browser storage is optional and progress can be exported as JSON. Works by opening `index.html` directly.

## QA notes

Perform manual keyboard, screen reader, mobile, and browser QA after deployment. Mathematical generation is deterministic in structure but randomized in operands; validate in live browser before student certification.
