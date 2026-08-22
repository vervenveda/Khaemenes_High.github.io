# Psychology Word of the Day — Integration Plan

## Purpose

Adapt the learning pattern from `vervenveda/arcade.github.io/Learn_a_New_Word_index.html` into Psychology 101 so that **each of the 65 daily lessons introduces one anchor psychology term**.

This is not a replacement for each lesson's full `Vocabulary in Context` list. It is a daily focus word that receives deeper treatment and cumulative review.

## Integration rule

Every daily lesson receives one **Psychology Word of the Day** directly aligned to that day's content.

The student experience should include:
- word / term;
- pronunciation when useful;
- part of speech or term type;
- formal psychological definition;
- student-friendly definition;
- course-specific example;
- related concepts;
- week and day introduced;
- one-question formative check;
- Mark Learned;
- Favorite;
- searchable psychology word bank;
- local-only progress.

The original LeArnA design already demonstrates a useful pattern: an embedded hard-wired bank, daily word display, pronunciation, definition, simple definition, example, synonyms, search, favorites, learned-state tracking, and a quick quiz. Psychology 101 should **adapt that engine locally rather than depend on the Arcade repository at runtime** so the course remains offline-capable and sovereign.

## Lesson synchronization

The psychology adaptation should be lesson-driven, not calendar-driven.

Each lesson will request its assigned term by lesson identity, for example:

`?lesson=01-01`

This prevents a student completing lessons on a different calendar schedule from receiving the wrong vocabulary term.

The tool may still offer Random Review and Search outside lesson mode.

## Completion boundary

The Word of the Day is formative vocabulary practice. A vocabulary mini-quiz should **not independently confer weekly mastery**. Weekly mastery remains governed by the course assessment policy.

## 50 locked daily anchor terms

These terms correspond to the 50 daily lesson plans already academically locked in Weeks 1–10.

| Lesson | Anchor Term | Why it belongs here |
|---|---|---|
| 01-01 | psychology | Defines the discipline and its scientific scope. |
| 01-02 | perspective | Introduces multiple levels/lenses of psychological explanation. |
| 01-03 | operational definition | Converts abstract constructs into measurable variables. |
| 01-04 | correlation | Anchors association-versus-causation reasoning. |
| 01-05 | replication | Reinforces scientific checking, revision, and converging evidence. |
| 02-01 | neurotransmitter | Anchors neural communication without one-chemical/one-behavior myths. |
| 02-02 | homeostasis | Connects nervous and endocrine regulation. |
| 02-03 | neural network | Prevents single-region explanations of complex behavior. |
| 02-04 | circadian rhythm | Anchors consciousness, sleep, and biological timing. |
| 02-05 | neuroplasticity | Describes experience-related neural change without unlimited-change claims. |
| 03-01 | transduction | Connects physical stimulation to neural signaling. |
| 03-02 | proprioception | Expands sensory understanding beyond the traditional five senses. |
| 03-03 | perceptual constancy | Shows how stable perception can arise from changing sensory input. |
| 03-04 | inattentional blindness | Demonstrates the distinction between sensory input and conscious attention. |
| 03-05 | perceptual set | Connects expectation and context to interpretation. |
| 04-01 | conditioned stimulus | Anchors classical conditioning and predictive learning. |
| 04-02 | negative reinforcement | Corrects the common reinforcement-versus-punishment misconception. |
| 04-03 | shaping | Demonstrates learning through successive approximations. |
| 04-04 | observational learning | Anchors learning through models and observed consequences. |
| 04-05 | contingency | Helps compare relationships among cues, behaviors, and consequences. |
| 05-01 | encoding | Anchors how attended information enters memory processing. |
| 05-02 | semantic memory | Distinguishes knowledge memory from episodic and procedural memory. |
| 05-03 | retrieval practice | Connects memory science to durable learning. |
| 05-04 | source monitoring | Explains how remembered content can become separated from its origin. |
| 05-05 | pragmatics | Connects language meaning to social and situational context. |
| 06-01 | algorithm | Contrasts systematic problem solving with faster heuristics. |
| 06-02 | heuristic | Anchors efficient judgment and its possible biases. |
| 06-03 | framing | Shows how equivalent information can influence choice through presentation. |
| 06-04 | validity | Anchors responsible interpretation of psychological measurement. |
| 06-05 | metacognition | Names the process of monitoring and evaluating one's own thinking. |
| 07-01 | arousal | Distinguishes physiological activation from the full experience of emotion. |
| 07-02 | appraisal | Connects interpretation of situations with emotional response. |
| 07-03 | intrinsic motivation | Distinguishes internally valued activity from externally driven incentives. |
| 07-04 | self-efficacy | Connects expected capability with effort, strategy, and persistence. |
| 07-05 | emotion regulation | Anchors the distinction between experiencing emotion and choosing a response. |
| 08-01 | cohort effect | Protects developmental conclusions from historical-generation confounds. |
| 08-02 | maturation | Describes biologically influenced developmental change without destiny claims. |
| 08-03 | scaffolding | Connects cognitive/language development to structured support. |
| 08-04 | identity | Anchors adolescence as development of self-understanding within social context. |
| 08-05 | lifespan | Reinforces that development continues beyond childhood and adolescence. |
| 09-01 | trait | Anchors dimensional description of relatively stable individual differences. |
| 09-02 | conscientiousness | Provides a concrete Big Five dimension for evidence-based trait reasoning. |
| 09-03 | person-situation interaction | Prevents the assumption that traits operate identically in every context. |
| 09-04 | self-report | Anchors personality measurement and its limitations. |
| 09-05 | self-concept | Connects personality, values, identity, and self-description without diagnosis. |
| 10-01 | conformity | Anchors social influence without implying mindless obedience. |
| 10-02 | attribution | Names explanations people generate for behavior and events. |
| 10-03 | bystander effect | Supports group-context reasoning and probability rather than inevitability. |
| 10-04 | discrimination | Distinguishes behavior/action from stereotype and prejudice. |
| 10-05 | culture | Anchors shared context without treating group membership as individual destiny. |

## Weeks 11–13

The final 15 anchor terms remain intentionally **unassigned until Weeks 11–13 pass their academic audits**. This preserves the course rule that unfinished curriculum is not represented as final.

## Recommended Psychology Word Lab data shape

```js
{
  id: "psych-01-03-operational-definition",
  lesson: "01-03",
  word: "operational definition",
  pronunciation: "",
  termType: "research-method term",
  definition: "...",
  simpleDefinition: "...",
  example: "...",
  relatedConcepts: ["variable", "measurement", "validity"],
  week: 1,
  day: 3,
  difficulty: 5,
  tags: ["research", "measurement"]
}
```

## Planned course behavior

1. The daily lesson introduces the anchor term near the top of the page.
2. A compact `Word of the Day` card can open the local Psychology Word Lab.
3. Lesson mode opens the exact assigned term.
4. Student completes a one-question formative check.
5. The word is added to the student's local Learned vocabulary if marked learned.
6. Weekly review may pull from the five terms introduced that week.
7. The searchable bank grows to 65 locked anchor terms by the end of the course.
8. The full lesson vocabulary list remains available for academic depth beyond the single anchor term.

## Design principle

**One new anchor word each day; many related terms in context; cumulative vocabulary grows without turning psychology into memorization.**
