# English 9 Audit Pass 02 - Course Connections

## Outcome

English 9 now follows the public semantic shape established by the finalized Pre-Algebra course without modifying any Pre-Algebra file.

## Connected in this pass

- Canonical `course-map.json` covering 12 units and all 36 weeks exactly once.
- Canonical Unit 1 `unit-map.json` covering lessons, practice, assessment, project, guides, print resources, and support resources.
- Root portal Weeks 1-3 aligned with the Unit 1 coursebook titles and direct anchors.
- Empty Unit 1 lesson, reading, and assessment routes replaced with working routes.
- Shared course header exposes Learning Lab, Archaemenes, and Beta on formal course pages.
- Root portal exposes the same features plus records and core educator resources.
- Learning Lab provides three transparent practice games, a claim-evidence-reasoning builder, a sentence-boundary pattern check, a revision comparison tool, and curated public app routes.
- Archaemenes provides local, rule-based guidance informed only by course activity stored in the current browser.
- Public Beta provides a local feedback worksheet and an explicit release boundary.

## Safety and evidence boundaries

- No hidden administrative, network, storage, or mentor-chain topology is exposed.
- No learner writing or progress is transmitted by the new pages.
- Mentor guidance is not represented as live messaging, grading, counseling, or surveillance.
- Game scores and tool use are practice evidence only until reviewed by a parent or educator.
- External public apps are optional enrichment and open with `noopener noreferrer`.
- Unit 1 is identified as complete; Units 2-12 remain mapped and under development.

## Verification

- 76 HTML files checked for local link targets.
- Inline JavaScript and shared `course.js` passed syntax checks.
- Course map contains 12 units and 36 unique weeks.
- Unit 1 mastery threshold is 80 percent.
- `git diff --check` passed.
- Pre-Algebra changed-path count: zero.

Automated visual browser verification was attempted but the workspace does not contain a Playwright browser executable. Visual QA remains a required follow-up before the draft pull request is marked ready.
