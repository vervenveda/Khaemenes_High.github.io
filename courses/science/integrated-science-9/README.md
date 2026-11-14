# International Integrated Science 9

**Course code:** KH-SCI-IIS9  
**Subtitle:** Life, Matter, Energy and Earth Systems  
**Repository:** `vervenveda/Khaemenes_High.github.io`  
**Path:** `courses/science/integrated-science-9/`

This directory is the canonical home of Khaemenes Academy's Grade 9 integrated science course.

## Current status

The full 36-week student course is released through readiness plus Units 01–12. It contains 180 daily lesson pages, unit investigations and tools, cumulative public practice assessments, learner-scoped formative evidence, portfolio/backup support, pacing guides and student checklists.

The repository's automated Science 9 learner-journey, learner-isolation, assessment/runtime, and grade-aware execution checks provide **source-level release evidence**. Real-browser/device certification remains a separate gate and is tracked in `RELEASE-CERTIFICATION.md`.

Public midterm/final material is formative practice. Official summative mastery must remain separately supervised, authenticated and protected.

## Design contract

The course preserves the Khaemenes High system:

- Foundation, Core, and Extended pathways
- 36-week structure
- Local-first learner-scoped progress and evidence
- Offline and low-bandwidth support with explicit certification limits
- Print-friendly student records
- Multilingual vocabulary readiness
- Keyboard, screen-reader, reduced-motion, RTL and narrow-width support targets
- Definitive objective answers or explicit evidence-based rubrics
- Separation of public student practice from protected official summative authority
- Safety tiers for home-safe, supervised and qualified-laboratory work
- Science/engineering practices, source evaluation, uncertainty and ethical reasoning

## Canonical structure

```text
integrated-science-9/
├── index.html
├── course-map.json
├── diagnostic/                 # Week 1 / Unit 00
├── units/
│   ├── unit-01/
│   ├── ...
│   └── unit-12/
├── assessments/                # Public formative benchmarks and practice exams
├── science-evidence-portfolio.html
├── course-ui.js
├── course-ui.css
├── RELEASE-CERTIFICATION.md
├── ROOT_VALIDATION.md
└── STANDARDS_CROSSWALK.md
```

## Release rule

A unit may be **open** when its student route and required source-level quality gates are released. Course-wide **certification** additionally requires the human browser/device evidence matrix to pass on the exact release commit. Transcript authority requires a protected Academy record handoff; public formative records alone never create official mastery.

Every released unit must retain a student checklist, pacing guide, standards mapping, mastery evidence path and synchronized release documentation.
