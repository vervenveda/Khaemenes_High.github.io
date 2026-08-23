# NAIB Readiness & Conditional 42-Week Pathway

## Purpose
Grade 9 Global Studies Honors remains a **36-week official curriculum**. Before entry, every learner may take a low-stakes readiness assessment. The page produces a transparent readiness record; **NAIB remains the routing authority** and may use that evidence when assigning the learner to the appropriate pathway.

## Pathways

```text
Readiness Assessment
        ↓
  readiness evidence
        ↓
       NAIB
   ┌────┴─────┐
   │          │
Ready      Bridge recommended
   │          │
Official   Prep Unit P1–P6
Week 1         │
   │       80% mastery
   │          │
   └────→ Official Week 1
```

- **Ready pathway:** 36 official weeks.
- **Bridge pathway:** 6 prep weeks + 36 official weeks = **42-week supported pathway**.
- Prep is not punishment, remediation labeling, or a lower track. It is a skills bridge.
- Prep scores do not lower the official course grade.
- The learner enters official Week 1 after demonstrating 80% mastery on the Prep Gateway Check.

## Readiness domains
The diagnostic measures prerequisite *skills*, not prior mastery of the Grade 9 historical content:
1. Reading for claim, evidence, context, and qualification.
2. Source/provenance reasoning.
3. Chronology, sequencing, and period reasoning.
4. Geography, maps, scale, and spatial reasoning.
5. Quantitative/data literacy.
6. Historical argument: cause, comparison, corroboration, uncertainty, and ethical explanation.

## Recommendation rule
- Overall score **80% or higher** and no domain below **60%** → evidence supports direct entry.
- Otherwise → evidence supports the six-week Prep Unit.
- Teachers/NAIB may still use context, accommodations, language access, interrupted schooling, or other authorized evidence. The browser assessment does not make a permanent placement decision.

## Prep Unit · six weeks
| Prep Week | Focus | Transfer target |
|---|---|---|
| P1 | Reading History Like an Investigator | claim, evidence, inference, qualification |
| P2 | Sources, Provenance & Corroboration | creator, audience, purpose, context, reliability-for-a-claim |
| P3 | Time, Chronology & Causation | sequence, duration, continuity/change, mechanism |
| P4 | Maps, Geography & Human Systems | scale, legend, spatial pattern, environment without determinism |
| P5 | Data, Graphs & Quantitative Claims | units, denominator, percentage, trend, uncertainty |
| P6 | Argument, Ethics & Course Readiness | thesis, evidence, counterevidence, moral reasoning without compelled viewpoint |

Each prep week uses retrieval → model → guided practice → independent transfer → mastery check. Students may retry after corrections. P6 ends with a cumulative Gateway Check requiring 80%.

## NAIB public contract
The readiness page stores a bounded public result under:

`khaemenes_ss9_readiness_v1`

and dispatches a browser event:

`khaemenes:readiness-result`

Payload fields are limited to assessment version, timestamp, overall score, domain scores, recommendation, and suggested prep focus. The public page must not contain private Noema/NAIB implementation, credentials, model keys, hidden reasoning, or cross-ecosystem identity logic.

NAIB may read the result through its authorized integration and make the routing decision. The course page itself does **not** assign a mentor or claim to be NAIB.

## Mastery contract
Prep completion is stored separately under:

`khaemenes_ss9_prep_v1`

The completion object records lesson mastery and Gateway Check status. Once gateway mastery is at least 80%, the learner is directed to official Week 1.