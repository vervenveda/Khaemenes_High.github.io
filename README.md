# Khaemenes Academy™ — High School Campus

**Verve N Veda Educational Network**

Khaemenes Academy High School is the Grades 9–12 secondary campus of the wider Khaemenes Academy learning system.

The repository contains active academic departments, grade-specific course routes, assessment systems, student/family tools, Career exploration, health and wellness connections, professional resources, and a direct transition into Khaemenes Higher Learning.

## Academic sequence

```text
Khaemenes Middle School · Grade 08
        ↓
verified readiness / transition evidence
        ↓
explicit Academy / family placement
        ↓
Khaemenes High School · Grades 09–12
        ↓
Career / Higher Learning transition
```

Promotion is deliberate. A repository boundary does not create a new learner identity and does not silently change formal placement.

## Canonical Academy architecture

```text
Academy Family Registry
        ↓
NAIB intake / resource direction / delegation
        ↓
Khaemenes Academy High School
        ↓
Archaemenes · Academy Scholar
        ↓
Grade 09 / 10 / 11 / 12 course context
        ↓
course assessment evidence / records
        ↓
adult verification where formal evidence requires it
        ↓
completion / graduation / next-stage evidence
```

Authority boundaries:

- **Academy Family Registry** owns learner identity and formal school/grade placement.
- **NAIB** receives, interprets, delegates, and connects the learner to the appropriate platform or resource.
- **Khaemenes Academy** provides Archaemenes as its institutional mentor.
- **Archaemenes** mentors as **Academy Scholar** during High School and does not award formal mastery.
- **Courses** own their own lessons, practice, assessments, and course-specific records.
- **Local course pins and resource favorites** are convenience preferences, not identity or grade authority.

## Grades 09–12

### Grade 09 — Foundations

Current pathways include:

- mathematics / Pre-Algebra and Algebra readiness;
- Integrated Science 9;
- English 9;
- Global Studies Honors / Social Studies 9;
- health, physical education, arts, music, language, technology and research resources through connected departments.

### Grade 10 — Sophomore Depth

The campus includes Grade 10 Language Arts, mathematics, social studies and connected science/health pathways with increasing independence and research expectations.

### Grade 11 — Junior Analysis

Grade 11 emphasizes advanced reading and writing, civic/economic reasoning, mathematics planning, research, evidence and postsecondary exploration.

### Grade 12 — Senior Synthesis

Grade 12 emphasizes senior-level academic work, portfolio/capstone evidence, future planning, Career exploration and direct transition into Higher Learning.

## Active departments and connected halls

The current repository and federation connect students to:

- Mathematics;
- Language Arts;
- Science;
- Social Studies & Civics;
- Physical Education;
- Health & Wellness;
- Arts and Music;
- World Languages;
- Technology / professional tools;
- Career exploration;
- research resources;
- practical life, law, civics and finance resources.

Connected Verve N Veda resources include ARSHIF, ProReSources, Firmament Law, The Verifier, Solanar, The Refrain, Bazaar Art, Khaemenes Linguistics, the Arcade, Career Portal and Higher Learning.

## Grade 08 → Grade 09 transition

High School follows the same continuity principle used at the Elementary → Middle boundary:

> **Formal placement and advanced curriculum access are separate concepts.**

A Grade 08 learner may explore selected Grade 09 material for transition planning or advanced challenge without being silently promoted.

Formal Grade 09 records should require the Academy Family Registry to resolve the learner as:

```text
stage: high
grade: grade-09
```

Preview access must not create Grade 09 certification, overwrite placement, or create a second student identity.

## High School continuity bridge

The hardening branch contains:

`assets/khaemenes-high-continuity.js`

It establishes the Academy boundary for Grades 09–12:

- reads the active Academy learner;
- recognizes `grade-09` through `grade-12`;
- requires `stage: high`;
- prefers NAIB `delegate()`;
- resolves Archaemenes as the Academy specialist;
- sends no learner/family IDs to NAIB;
- creates no local identity;
- writes no formal grade placement.

See:

`MIDDLE_TO_HIGH_CONTINUITY_AUDIT.md`

for the current audit of the Grade 08 → High School transition and Grade 09 course identity systems.

## Current Grade 09 hardening finding

The Grade 09 curriculum is academically substantial, but several course portals still use older independent local student lists.

Examples include:

- English 9;
- Integrated Science 9;
- Global Studies Honors.

These course-local student selectors must be migrated to Academy learner continuity without rewriting their strong 36-week curricula.

The target is:

```text
one Academy learner
→ many High School courses
→ separate learner-scoped course records
```

not one independently created student identity per course.

## Technology

The project remains intentionally understandable and portable:

- HTML5;
- CSS3;
- Vanilla JavaScript;
- GitHub Pages compatibility;
- local-first behavior where appropriate;
- printable educational material;
- offline/PWA behavior where implemented.

Browser-side storage is educational state and preference storage. It is not secure authentication or server authorization.

## Design standards

The High School campus follows the Verve N Veda visual system with:

- ceremonial/display typography for titles;
- readable sans-serif body typography;
- centered institutional layouts;
- restrained academic colors;
- 7px controls;
- responsive design;
- keyboard-accessible navigation;
- print-friendly course documents.

## Hardening status

Working branch:

`hardening/archaemenes-highschool`

Current work on that branch begins the same continuity migration already established in Elementary and Middle School.

`main` remains unchanged until review, validation and explicit merge approval.

## Next sequence

1. Harden the High School root around Academy Family Registry authority.
2. Add Grade 08 transition / advanced Grade 09 preview behavior.
3. Preserve local course pins as preferences only.
4. Migrate English 9 to learner-scoped Academy continuity.
5. Migrate Integrated Science 9.
6. Migrate Global Studies Honors.
7. Audit the Grade 09 mathematics pathway.
8. Continue systematically through Grades 10, 11 and 12.
9. Validate the High School → Career / Higher Learning boundary.

---

**Jennifer Kay Pearl · Khaemenes Academy · Verve N Veda**
