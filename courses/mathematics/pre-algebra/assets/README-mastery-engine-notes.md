# Pre-Algebra Mastery Engine Architecture

This course uses a single Academy progression contract:

- the NAIB readiness assessment is pre-course and does not count as a course week;
- ready learners enter the official 36-week course at Unit 1;
- learners assigned prerequisite reinforcement complete conditional Unit 0 first, producing a 42-week route;
- every scored lesson requires at least 80% before the next lesson opens;
- every weekly/unit mastery assessment requires at least 80% before advancement;
- `reviewed` is a study-state marker and never substitutes for `mastered`;
- best demonstrated mastery is preserved across retries, while latest score and attempt history remain available for review.

Units 2–13 share the generic lesson and dashboard engines. Unit 1 retains its richer interactive engines as core files and uses thin wrappers so its factor, number-inspector, GCF/LCM, expression, estimation, and related learning labs are not lost.
