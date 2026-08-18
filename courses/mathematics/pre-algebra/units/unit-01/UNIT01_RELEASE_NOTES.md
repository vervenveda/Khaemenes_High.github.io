# Pre-Algebra Unit 1 Release

## Release identifier

`khaemenes-high-unit01-v4`

## New instructional unit

`courses/mathematics/pre-algebra/units/unit-01/`

### Included

- Six complete interactive lessons
- Twenty-four-term multilingual vocabulary bridge
- Foundation practice with hints
- Core practice
- Extended practice
- Twenty-question mastery check
- Public answer-key JSON
- Number Systems Investigation project
- Teacher guide and family guide
- Draft standards crosswalk
- Local progress, reflections, project records, and exports
- Printable views and offline precaching

## Updated files

- Root `index.html`, `README.md`, `manifest.webmanifest`, and `service-worker.js`
- Pre-Algebra `index.html` and `course-map.json`

## Upload order

Upload the full `courses/mathematics/pre-algebra/units/unit-01/` directory first. Then replace the two Pre-Algebra files and four root files listed above. Perform one hard refresh after deployment so the browser replaces service-worker version 3 with version 4.


## Checkpoint 1 hardening · Unit home and progression

- Standardized Unit 1 mastery at 80%.
- Separated lesson review marks from scored lesson mastery.
- Added migration logic so older manual review marks cannot count as mastery.
- Added a visible Unit 2 progression gate requiring all lesson practices at 80%+ and the Unit 1 Mastery Check at 80%+.
- Restored backward-compatible sacred design tokens used by existing lesson pages.
- Added a functional dark theme to the shared Unit 1 design system.
