# Psychology Word of the Day — Integration Plan

## Purpose

Each of the **65 daily lessons** introduces one anchor psychology term. The anchor word receives deeper treatment and cumulative review; it does not replace the lesson's broader `Vocabulary in Context` list.

## Student Experience

Each term should include:
- word / term;
- pronunciation when useful;
- term type;
- formal psychological definition;
- student-friendly definition;
- course-specific example;
- related concepts;
- week/day introduced;
- one-question formative check;
- Mark Learned;
- Favorite;
- searchable local word bank.

The interaction pattern is adapted locally from `vervenveda/arcade.github.io/Learn_a_New_Word_index.html`; Psychology 101 does **not** depend on the Arcade repository at runtime.

## Lesson Synchronization

Use lesson identity rather than calendar date, for example:

`?lesson=01-03`

This keeps vocabulary synchronized with independent-study pacing. Random Review and Search may be offered outside lesson mode.

## Completion Boundary

Word-of-the-Day checks are formative. They do not independently confer weekly mastery.

## Complete 65-Term Map

| Lesson | Anchor Term | Instructional purpose |
|---|---|---|
| 01-01 | psychology | Defines the discipline and scientific scope |
| 01-02 | perspective | Introduces multiple levels of explanation |
| 01-03 | operational definition | Converts constructs into measurable variables |
| 01-04 | correlation | Anchors association-versus-causation reasoning |
| 01-05 | replication | Reinforces scientific checking and revision |
| 02-01 | neurotransmitter | Anchors neural communication without chemical myths |
| 02-02 | homeostasis | Connects nervous/endocrine regulation |
| 02-03 | neural network | Prevents single-region explanations |
| 02-04 | circadian rhythm | Anchors sleep and biological timing |
| 02-05 | neuroplasticity | Describes experience-related neural change with limits |
| 03-01 | transduction | Connects physical stimulation to neural signaling |
| 03-02 | proprioception | Expands sensory systems beyond the traditional five |
| 03-03 | perceptual constancy | Shows stable perception from changing input |
| 03-04 | inattentional blindness | Distinguishes input from conscious attention |
| 03-05 | perceptual set | Connects expectation/context to interpretation |
| 04-01 | conditioned stimulus | Anchors classical conditioning and prediction |
| 04-02 | negative reinforcement | Corrects reinforcement/punishment confusion |
| 04-03 | shaping | Demonstrates successive approximations |
| 04-04 | observational learning | Anchors learning from models and consequences |
| 04-05 | contingency | Compares cue/behavior/consequence relationships |
| 05-01 | encoding | Anchors entry of attended information into memory |
| 05-02 | semantic memory | Distinguishes knowledge from episodic/procedural memory |
| 05-03 | retrieval practice | Connects memory science to durable learning |
| 05-04 | source monitoring | Explains confusion about where information came from |
| 05-05 | pragmatics | Connects language meaning to context |
| 06-01 | algorithm | Contrasts systematic problem solving with heuristics |
| 06-02 | heuristic | Anchors efficient judgment and possible bias |
| 06-03 | framing | Shows how presentation can influence choice |
| 06-04 | validity | Anchors responsible measurement interpretation |
| 06-05 | metacognition | Names monitoring/evaluating one's own thinking |
| 07-01 | arousal | Distinguishes physiological activation from full emotion |
| 07-02 | appraisal | Connects interpretation with emotional response |
| 07-03 | intrinsic motivation | Distinguishes internally valued activity from incentives |
| 07-04 | self-efficacy | Connects expected capability with persistence |
| 07-05 | emotion regulation | Separates feeling from chosen response |
| 08-01 | cohort effect | Protects developmental inference from generation confounds |
| 08-02 | maturation | Describes biologically influenced development without destiny |
| 08-03 | scaffolding | Connects development to structured support |
| 08-04 | identity | Anchors self-understanding within social context |
| 08-05 | lifespan | Reinforces development beyond childhood |
| 09-01 | trait | Anchors dimensional individual differences |
| 09-02 | conscientiousness | Provides a concrete Big Five dimension |
| 09-03 | person-situation interaction | Prevents context-free trait conclusions |
| 09-04 | self-report | Anchors personality measurement and bias |
| 09-05 | self-concept | Distinguishes self-description from diagnosis |
| 10-01 | conformity | Anchors social influence without mind-control framing |
| 10-02 | attribution | Names explanations generated for behavior/events |
| 10-03 | bystander effect | Supports probabilistic group-context reasoning |
| 10-04 | discrimination | Distinguishes behavior from stereotype/prejudice |
| 10-05 | culture | Anchors shared context without group destiny |
| 11-01 | stress | Defines psychophysiological response to demands |
| 11-02 | allostatic load | Introduces cumulative physiological burden carefully |
| 11-03 | coping | Anchors strategy–situation fit rather than toughness |
| 11-04 | health behavior | Connects behavior with learning, opportunity, and context |
| 11-05 | resilience | Defines adaptation without invulnerability myths |
| 12-01 | diagnosis | Establishes professional clinical-classification boundary |
| 12-02 | comorbidity | Explains overlapping diagnoses and classification complexity |
| 12-03 | stigma | Connects labels, attitudes, discrimination, and secondary harm |
| 12-04 | psychotherapy | Anchors structured evidence-informed psychological treatment |
| 12-05 | confidentiality | Introduces professional privacy duties and limits |
| 13-01 | applied psychology | Connects psychological science to real-world systems |
| 13-02 | external validity | Anchors evidence transfer beyond study conditions |
| 13-03 | human factors | Applies cognition/perception to ethical design |
| 13-04 | evidence synthesis | Integrates multiple sources without flattening uncertainty |
| 13-05 | generalizability | Defines the justified scope of a conclusion |

## Recommended Psychology Word Lab Data Shape

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

## Planned Course Behavior

1. Daily lesson introduces the anchor term near the top.
2. The card opens the local Psychology Word Lab.
3. Lesson mode opens the exact assigned term.
4. Student completes one formative check.
5. Mark Learned/Favorite state remains local.
6. Weekly review may pull from the week's five terms.
7. Random Review may pull from previously introduced terms only.
8. The full lesson vocabulary list remains available beyond the anchor word.

## Design Principle

**One anchor word each day; many related terms in context; 65 cumulative terms without turning psychology into rote memorization.**