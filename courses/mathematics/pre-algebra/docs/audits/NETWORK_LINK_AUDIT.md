# Khaemenes High — Connected Network Link Audit

## Release summary

This update adds a searchable Connected Learning Network to the High School landing page.

- Total curated destinations: **48**
- Categories: **7**
- Major hubs are clearly labeled as hubs.
- Individual courses, studios, tools, halls, and games are separately labeled.
- All connected destinations open in a new tab.
- External network destinations are not added to the High School offline cache.
- The service-worker cache version is updated to `khaemenes-high-network-v2`.

## Categories

- **Research & Literacy** — 9 resources. Search, verification, archives, languages, legal literacy, world texts, philosophy, and evidence.
- **Student Tools** — 8 resources. Writing, planning, coding, files, media, drafting, and project-production workspaces.
- **Arts & Media** — 8 resources. Art courses, drawing studios, digital creation, photography, portfolios, and idea generation.
- **Music & Audio** — 6 resources. Music literacy, theory, composition, recording, performance, and scholarship.
- **STEM, Health & Earth** — 4 resources. Weather, Earth science, medicine, wellness, movement, environmental service, and scientific inquiry.
- **Games & Enrichment** — 9 resources. Selected strategy, mathematics, language, logic, civics, news, health, and creative games.
- **Civic & Life** — 4 resources. Civic learning, reflection, wellbeing, writing prompts, service, and whole-life development.

## Curation decisions

Included:
- Active educational hubs and direct app paths found in the current Verve N Veda registries.
- High-school-relevant research, writing, coding, design, art, music, science, health, environmental, civic, and enrichment tools.
- Selected games with clear educational value.

Not included in the student landing page:
- Administrative systems.
- Founder-only or legacy-control repositories.
- Communication/social-network tools that require a later privacy, moderation, identity, and backend review.
- Empty or construction-only destinations.
- Candidate campaign pages. General civic-learning resources remain available through One Nation For All.

## Upload instructions

Replace these two files in the repository root:

1. `index.html`
2. `service-worker.js`

Keep the existing `README.md`, `LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`, and `manifest.webmanifest`.
