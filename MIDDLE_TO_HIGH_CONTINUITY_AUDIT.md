# Khaemenes Academy · Middle School → High School Continuity Audit

Branch: `hardening/archaemenes-highschool`

## Scope

This audit begins at the Grade 08 High School readiness boundary and follows the learner into the High School campus and current Grade 09 course entry points.

The goal is continuity without inventing a second identity system or silently promoting a learner.

Canonical transition:

```text
Grade 08 learner
    ↓
verified middle-school completion + transition evidence
    ↓
explicit Academy / family placement change
    ↓
Academy Family Registry
  stage: high
  grade: grade-09
    ↓
NAIB intake / resource direction / delegation
    ↓
Khaemenes Academy High School
    ↓
Archaemenes · Academy Scholar
    ↓
Grade 09 course context
    ↓
course-specific assessment evidence / records
```

## High School root audit

The current root `index.html` is visually modern and already contains:

- Grades 09–12 learning halls;
- course and department routes;
- Career and Higher Learning transitions;
- central resource federation integration;
- Academy Family Registry and the Academy school bridge;
- PWA/service-worker support;
- Verve N Veda navigation.

However, the root also maintains a separate local profile under:

`khaemenes-high-profile-v1`

That local profile contains its own student name and grade selector.

This duplicates identity/placement concepts that belong to the Academy Family Registry.

### Required boundary

The hardened root should treat:

- Academy Family Registry = learner identity + formal stage + formal grade;
- local High School profile = optional preferences only;
- pinned courses = local convenience only;
- course records = owned by each course;
- High School root = doorway/navigation, not gradebook authority.

A local grade dropdown must not override formal placement.

## Grade 09 course audit

### English 9

`courses/language-arts/english-9/index.html`

Current course strengths:

- 36-week curriculum;
- weekly reading suggestions;
- interactive lessons;
- quizzes and explanations;
- midterm and final;
- portfolio evidence;
- reports and local backup.

Current architecture issue:

- the course creates and deletes its own students;
- it contains an independent Active Student selector;
- course identity is therefore separate from the Academy Family Registry.

The curriculum does not need to be rewritten. The identity and record layer needs migration to Academy learner continuity.

### Integrated Science 9

`courses/science/integrated-science-9/index.html`

Current course strengths:

- 36-week phenomenon-based science curriculum;
- investigations and data tools;
- CER writing;
- pathway support;
- assessment and report tools;
- printable behavior.

Current architecture issue:

- it creates its own local students;
- learner selection is course-local;
- course identity is not yet bound to the Academy Family Registry.

Again, the curriculum should be preserved while the identity/record layer is hardened.

### Global Studies Honors · Grade 09

`courses/social-studies/grade-09/index.html`

Current course strengths:

- 36-week Global Studies Honors structure;
- geography, history, civics, economics and media literacy;
- primary/secondary source analysis;
- argument writing;
- civic capstone;
- local reports and backups.

Current architecture issue:

- it maintains a separate Student Record selector;
- it can add/demo/delete students independently of the Academy;
- formal learner identity is not yet Academy-scoped.

## Grade 08 → Grade 09 bridge

The Grade 08 hardened architecture already keeps completion separate from promotion.

High School should preserve that rule.

A Grade 08 learner may visit High School for transition planning or advanced preview, but formal Grade 09 records should remain locked until the Family Registry reports:

```text
stage: high
grade: grade-09
```

Recommended entry contexts:

- `?entry=grade08-transition`
- `?entry=grade08-advanced-preview`

These are navigation context only.

They must never carry learner IDs, family IDs, credentials, or grade authority in the URL.

## Advanced learner principle

High School should follow the same principle established at the Grade 05 → Grade 06 boundary:

> Formal placement and curriculum access are separate concepts.

An advanced Grade 08 learner may preview selected Grade 09 resources without becoming a formal Grade 09 learner.

Preview mode must not:

- create a Grade 09 course record;
- issue a Grade 09 certificate;
- rewrite Academy placement;
- create a second learner identity.

## Archaemenes continuity

Archaemenes remains the institutional Khaemenes Academy mentor.

High School uses the `academy-scholar` presentation.

The learner does not receive a new mentor identity merely because they moved from Middle School to High School.

NAIB delegates the learner to Khaemenes Academy / High School or another relevant resource. Khaemenes Academy provides Archaemenes.

## New continuity bridge

The hardening branch now contains:

`assets/khaemenes-high-continuity.js`

The bridge:

- reads only the active Academy Family Registry learner;
- requires `stage: high`;
- normalizes and accepts `grade-09` through `grade-12`;
- prefers NAIB `delegate()`;
- retains `assignMentor()` only as transition compatibility;
- resolves Archaemenes as the Academy specialist;
- sends no learner ID or family ID to NAIB;
- creates no local identity;
- writes no grade placement.

## Recommended High School hardening sequence

1. Replace root local identity/grade authority with Academy Family Registry continuity.
2. Keep course pins and resource favorites as non-authoritative local preferences.
3. Add Grade 08 transition and advanced-preview handling to the High School root.
4. Externalize root inline CSS/JS and add CSP/no-referrer hardening.
5. Migrate Grade 09 core courses first:
   - English 9;
   - Integrated Science 9;
   - Global Studies Honors;
   - the Grade 09 mathematics pathway.
6. Convert course-local student lists into learner-scoped Academy records with safe legacy migration.
7. Separate learner practice from adult-verified formal evidence where formal certification is issued.
8. Audit Grade 10, Grade 11 and Grade 12 in sequence.
9. Preserve explicit High School → Higher Learning transition rather than auto-promotion.

## Upstream dependency

The central Academy Family Registry still needs the formal `stage + grade` model hardened across the ecosystem.

Until it can supply values such as:

```text
stage: high
grade: grade-09
```

High School continuity should fail closed rather than invent placement locally.

## Status

**The High School campus is modern and academically extensive, but its root and Grade 09 course identity layers are still older than the hardened Elementary/Middle architecture. The new branch establishes the canonical continuity bridge without changing `main`.**
