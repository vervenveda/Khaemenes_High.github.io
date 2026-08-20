# Pre-Algebra Substantial v21 Audit

## Repository scope reviewed

Course: `courses/mathematics/pre-algebra/`

The live architecture contains:

- 36 instructional weeks
- 1 readiness diagnostic
- 13 numbered units
- 97 detailed lesson pages
- 39 pathway practice pages: Foundation, Core, and Extended for each numbered unit
- 13 unit mastery checks
- 13 applied investigations or capstone records
- teacher guides, family guides, vocabulary files, unit maps, standards maps, and answer keys
- 56-question Units 01–07 midterm
- 80-question comprehensive final examination
- parent-issued course completion certificate and verification record
- local-first progress and offline architecture

## Structural conclusion

The detailed course tree is sound and already academically substantial. It should not be replaced wholesale.

The primary weakness was the course-home orchestration layer. The prior portal described all 36 weeks, but much of its Monday–Friday classwork language repeated a generic template, and several generated practice families covered only the easiest portion of the stated weekly objectives.

## Proven portal defects corrected

1. **CSV row separation**
   - The prior export functions joined records through an escaped source-line continuation rather than a literal newline.
   - v21 uses `lines.join("\n")`.

2. **Potential duplicate correct option**
   - The prior generated translation item could produce `2x + 2` as both the keyed answer and a distractor when the random value was 2.
   - v21 uses a deduplicating multiple-choice constructor and audits answer uniqueness.

3. **Undercoverage in generated practice**
   - The former portal did not fully generate practice for several stated topics, including LCM, negative and compound inequalities, literal equations, scientific-notation operations, IQR/MAD concepts, compound probability, simulation, causation limits, sensitivity analysis, and modelling readiness.
   - v21 includes 112 distinct skill families distributed across all 36 weeks.

4. **Generic classwork**
   - v21 replaces repeated weekly language with week-specific essential questions, governing rules, applications, misconceptions, vocabulary, evidence requirements, and five substantial daily assignments.

5. **Course record depth**
   - v21 adds weekly classwork, mastery, portfolio, reflection, evidence, attempt, course-grade, backup, migration, report, and portfolio records.

6. **Canonical and internal navigation**
   - The course canonical now matches the actual Pre-Algebra route.
   - Mathematics Hall navigation resolves to the correct parent directory.

## Calculator status

`tools/calculator` is under development.

It is intentionally not linked as a required course tool. The portal reserves the integration and documents that the calculator should be validated for:

- safe expression parsing
- degree/radian behavior
- visible expression and result separation
- memory and history accuracy
- keyboard access
- screen-reader labels
- mobile layout
- error handling
- assessment-use policy

## Validation completed

- HTML parsed successfully
- no duplicate static HTML IDs
- one self-contained stylesheet
- one self-contained script
- no required third-party libraries
- JavaScript passed `node --check`
- weeks are contiguous from 1 through 36
- unit durations total 36 weeks
- detailed numbered-unit lesson count totals 97
- 180 daily classwork sessions are generated
- 112 unique practice skill families are mapped
- 2,240 generated audit items were tested
- every generated item contained a prompt and explanation
- every numeric key was finite
- every multiple-choice answer appeared exactly once
- no generated choice set contained duplicate normalized choices
- CSV exports use real newline delimiters
- calculator remains nonrequired and disabled

## Limits of this audit

The repository connector and local Chromium environment did not provide a dependable full rendered screenshot pass. Validation was structural, syntactic, mathematical-generator, data-integrity, and route-contract based. A manual visual review after upload remains appropriate for final spacing and print appearance.
