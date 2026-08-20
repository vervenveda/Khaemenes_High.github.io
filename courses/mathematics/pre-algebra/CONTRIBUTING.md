# Contributing to Khaemenes High

Thank you for helping build an accessible, international high-school program for grades 9–12.

Contributions may include curriculum, translations, standards mappings, accessibility improvements, code, design, documentation, assessments, teacher resources, family guides, or issue reports.

## Guiding commitments

Every contribution should protect:

- Learner dignity
- Free and meaningful educational access
- Academic accuracy
- Accessibility
- Privacy
- Cultural respect
- Clear source attribution
- International adaptability
- Safe and maintainable technology

## Before contributing

1. Read `README.md`.
2. Read `LICENSE`.
3. Read `SECURITY.md`.
4. Search existing issues and pull requests.
5. For a large new course, department, data model, or platform feature, open a planning issue before implementation.
6. Do not publicly file a security vulnerability. Follow `SECURITY.md`.

## Types of contributions

### Curriculum

A complete lesson contribution should normally include:

- Course and unit
- Intended pathway: Foundation, Core, or Extended
- Learning objectives
- Prerequisites
- Student-friendly vocabulary
- Concept explanation
- Worked examples
- Guided practice
- Independent practice
- Real-world or cross-disciplinary application
- Mastery check
- Answer key with reasoning
- Teacher notes
- Accessibility alternatives
- Standards metadata
- Sources and licensing

Avoid answer-only worksheets without instruction, reasoning, or feedback.

### Assessments

Assessments should:

- Measure the stated learning goals
- Include an accessible format
- Avoid unnecessary time pressure
- Use clear scoring criteria
- Include reasoning or performance tasks where appropriate
- Avoid cultural assumptions unrelated to the skill
- Provide a secure teacher version when answers should not be public
- Never include real student information

### Translations

Translations must preserve meaning, age appropriateness, mathematical or scientific notation, accessibility labels, and respectful language.

Do not rely on unreviewed machine translation for a final educational release.

For right-to-left languages, test:

- Reading order
- Navigation order
- Forms
- Equations
- Tables
- Mixed-language content
- Punctuation
- Screen-reader output

### Standards mappings

A standards mapping must identify:

- Framework name
- Issuing authority
- Version or publication year
- Jurisdiction
- Course, grade, or stage
- Standard identifier
- Short paraphrase where permitted
- Curriculum objective being mapped
- Mapping confidence or review status
- Source location

Do not copy restricted standards text beyond what its license permits.

### Code

Code contributions should:

- Use semantic HTML
- Work with keyboard navigation
- Preserve visible focus
- Support reduced motion
- Avoid unnecessary dependencies
- Avoid inline secrets
- Fail safely when offline
- Keep private data out of logs
- Use clear names and comments
- Avoid breaking existing saved progress
- Include migration logic when storage formats change

## Branch and pull-request workflow

Use a focused branch name, for example:

```text
course/pre-algebra-unit-01
feature/grade-09-dashboard
accessibility/keyboard-grade-cards
translation/es-foundation-shell
docs/security-reporting
```

Keep each pull request focused on one logical change.

A pull request should include:

- What changed
- Why it changed
- How it was tested
- Screenshots for visible changes
- Accessibility checks
- Offline checks when relevant
- New or changed data formats
- Sources and licenses
- Remaining limitations

## File and naming conventions

Use lowercase folder names and hyphen-separated paths:

```text
courses/mathematics/pre-algebra/
grades/grade-09/
locales/es/
standards/united-states/
```

Use stable identifiers in structured curriculum data:

```text
math-prealgebra-u01-l03
science-biology-u02-l05
ela-grade09-u01-assessment
```

Do not use a student name, teacher name, email address, or other personal information in sample data.

## Accessibility acceptance checklist

Before submitting a user-interface change, verify:

- All actions can be completed with a keyboard
- Focus order is logical
- Focus is visible
- Heading order is meaningful
- Controls have accessible names
- Text remains usable at 200% zoom
- Information does not rely on color alone
- Motion respects reduced-motion preferences
- Forms provide labels and understandable errors
- Dialogs manage focus and can be closed without a mouse
- The page remains understandable with styles disabled
- Print output is usable when the feature is printable

## Curriculum acceptance checklist

Before submitting curriculum, verify:

- Learning goals are measurable
- Facts and worked solutions are accurate
- Instructions are understandable
- Examples represent varied people and contexts respectfully
- Units and currencies are identified
- The lesson does not assume one national system unless labeled
- Foundation support is available
- Extended learning is meaningful rather than merely longer
- Answers explain reasoning
- Sources are documented
- Third-party content is legally reusable
- The lesson works in print or has a print alternative

## Privacy rules

Do not submit:

- Real learner records
- Real classroom exports
- Credentials
- Private messages
- Private assessment results
- Medical or disability records
- Government identifiers
- Precise home addresses
- Sensitive family information

Use obviously fictional sample information.

## Licensing contributions

By submitting a contribution, you confirm that:

- You created the contribution or have permission to submit it
- It does not knowingly violate another party’s rights
- Software contributions may be distributed under the repository’s MIT License
- Original educational content contributions may be distributed under CC BY-NC-SA 4.0
- Third-party material is clearly identified with its source and license

## Review standards

Maintainers may request changes for:

- Factual or mathematical errors
- Accessibility barriers
- Privacy risks
- Unclear licensing
- Cultural stereotyping
- Unmaintainable code
- Unnecessary dependencies
- Incomplete reasoning
- Weak or unverifiable sources
- Conflict with the project’s educational mission

Review is collaborative. A request for revision is not a rejection of the contributor.

## Community conduct

Be respectful, patient, specific, and focused on the work.

Harassment, discrimination, threats, exposure of personal information, plagiarism, and deliberate educational misinformation are not acceptable.
