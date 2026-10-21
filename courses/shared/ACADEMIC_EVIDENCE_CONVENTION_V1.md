# Khaemenes Academy — Shared Academic Evidence Convention v1

**Status:** Optional cross-subject formative evidence standard. **Scope:** Science, Mathematics, Language Arts, Linguistics and other Academy programs. **Authority:** This file specifies an interoperable *document format*, not a grading or student-account system.

## Required printable identity
- Centered heading **Khaemenes Academy**.
- Student name; date; grade; subject; unit; lesson.
- Title or investigation/question; clearly labeled evidence type.
- Parent/teacher reviewer name, review date, feedback, next learning goal and signature space.
- Print text must be readable, wrap long citations, and not depend on color to convey meaning.

## Evidence fields (optional when inapplicable)
1. **Research question / purpose:** A testable question, reading prompt, or project objective.
2. **Sources and citations:** Title, author/organization, publication or URL, access date (for web resources), and source limitations. No fabricated citations.
3. **Vocabulary:** Term, meaning in the learner's words, context/example, and optional translation. Link to shared Academy language/dictionary tools; do not fork their lexicons.
4. **Subject connections:** Original subject and related subject(s), with a short explanation.
5. **Evidence:** Observations, measurements, calculations, passage references, textual analysis, or artifacts. Distinguish observation from interpretation.
6. **Claim / reasoning:** Conclusion tied to evidence with limitations and uncertainty.
7. **Reflection / next steps:** Learner reflection and questions to investigate next.
8. **Parent/teacher review:** Review fields as above; review does not confer grades or credits.

## Safe reuse contract
- This document is **not** a mandate to alter assessment engines, thresholds, report cards, mastered state, official transcripts or learner accounts.
- Prefer printable HTML / PDF or downloadable text/JSON; no upload, tracking, network dependencies, or automatic persistence. Show an export/print reminder when unsaved.
- Personal records belong to learners/families; public repositories contain no real learner data, names, notes or credentials.
- Local backups and printed records must not be described as encrypted, authenticated, synchronized or centrally stored.
- Explicitly mark completed activity evidence **formative / ungraded** unless an existing authorized assessment engine separately establishes a grade.
- At a minimum ensure keyboard-accessible controls, visible focus, narrow-screen wrapping and meaningful print styles.
- Cross-subject integration should use relative local links when within the same repository and verified public destinations for independent campuses.

## Recommended machine-readable interchange
If a subject later supports explicit JSON export, use a namespaced, versioned *envelope* (without requiring it for print-only worksheets):

```json
{
  "schema": "khaemenes-academic-evidence-v1",
  "status": "formative_ungraded",
  "academy": "Khaemenes Academy",
  "grade": "9",
  "subject": "Integrated Science",
  "unit": "05",
  "lesson": "09",
  "student": "",
  "date": "",
  "researchQuestion": "",
  "sources": [],
  "vocabulary": [],
  "subjectConnections": [],
  "evidence": "",
  "reasoning": "",
  "reflection": "",
  "nextSteps": "",
  "review": {"reviewer":"","date":"","feedback":"","signature":""}
}
```

The envelope is a **portable document**, not an import contract into scored records. Existing Science 9 `khaemenes-science-formative-portfolio-v1` backups retain their current separate restoration semantics. No automatic conversion/import is authorized.

## First adoption and extension
- **Science 9:** [Academic Evidence Companion](../science/integrated-science-9/academic-evidence-companion.html) and [Investigation Portfolio](../science/integrated-science-9/science-evidence-portfolio.html).
- **Research/vocabulary:** [Science 9 academic desk](../science/integrated-science-9/academic-research-desk.html).
- **Other departments:** Adopt these printable field names and review conventions without modifying legacy lesson or grade data. Use the first subject's implementation as a reference; make department-specific navigation adaptations separately.

## Quality gate
A subject adopting this convention should verify: all identity fields; citations/vocabulary/evidence/reflection; review; print/export; no scored-storage mutations; optionality; responsive accessibility; and accurate labeling as formative. Browser/device certification remains an independent check.
