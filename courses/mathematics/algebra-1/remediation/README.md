# Algebra I Mastery Recovery Architecture

This directory defines the course-wide recovery layer between assessment evidence and targeted learning resources.

## Recovery principle
A score below 80% is not a dead end. The course identifies the exact unfinished skill, returns the learner to useful instruction/practice, preserves prior evidence, and permits reassessment until mastery is demonstrated.

## Three pathways
- **Foundation** — prerequisite rebuilding and highly scaffolded examples.
- **Core** — direct practice for the exact Algebra I skill that produced the evidence.
- **Extended** — transfer, application, challenge, labs, games, and durable-mastery work.

## Evidence flow
`assessment item -> question_id -> skill_id -> unit/lesson -> mastery status -> recommended pathway -> resource -> reassessment -> mastery/unlock`

The assessment engines already emit item-level skill evidence. This contract gives that evidence a stable destination.

## NAIB integration boundary
NAIB may consume the same evidence and recommend a lesson, worked example, practice set, worksheet, lab, project, or game. NAIB is an enhancement, not a dependency. If it is absent or offline, the local Algebra I course must still provide a complete recovery route.

## Student-facing behavior below 80%
The learner should see:
1. current score and the 80% target;
2. exact skills that need more work;
3. links back to the relevant lesson or corrective practice;
4. the specific submitted items available for review after scoring;
5. an encouraging but precise explanation of what to correct;
6. a clear **Practice & Try Again** route;
7. preserved prior attempts and best mastery evidence.

Progression unlocks only when the required mastery evidence reaches at least 80%.

## Resource registry
The next layer is a course-wide registry associating every skill ID with Foundation/Core/Extended resources. Projects and labs use the same IDs so recommendations are evidence-driven rather than generic.