# Mathematics Interactive Worksheet Design Standard v1

**Recorded:** 2026-11-17  
**Scope:** Khaemenes High School mathematics learning pages  
**Initial implementation target:** Geometry  
**Reference model:** Pre-Algebra's clean centered worksheet architecture  
**Status:** Research-informed design standard; implementation pending browser/student validation

## 1. Purpose

The Academy mathematics lesson should function primarily as an **interactive mathematical worksheet**, not as a long-form digital textbook page.

The design goal is to reduce irrelevant visual search, preserve working-memory capacity for mathematics, make mathematical representations easy to compare, and move students deliberately from supported reasoning to independent application.

The standard does not claim that one page architecture guarantees learning gains. It translates converging research findings into a testable Academy design.

## 2. Evidence base

### Cognitive load and multimedia organization
Research on multimedia learning supports:
- removing nonessential competing material;
- signaling the structure of essential information;
- placing corresponding words and visuals near one another;
- avoiding split attention between a diagram and a remote explanation.

For mathematics, this means the diagram, equation, construction, table, prompt, and response area should be spatially integrated whenever they belong to the same reasoning step.

### Worked examples
Worked examples are especially useful during early skill acquisition in structured domains such as mathematics. They reduce unnecessary problem-search load and help students notice the sequence and rationale of solution steps.

Worked examples should transition into active problem solving rather than replace it.

### Self-explanation
Prompting learners to explain why a step is valid, which theorem applies, why an incorrect approach fails, or what changed between two representations can improve conceptual understanding and transfer.

Geometry-specific studies support self-explanation with heuristic worked examples for proof learning.

### Correct / incorrect example comparison
Mathematics learners can benefit from comparing correct and incorrect examples when the comparison is scaffolded. This is particularly useful for misconceptions, theorem selection, sign/notation errors, and invalid proof steps.

### Interleaving and spacing
Practice should not remain permanently blocked by one problem type. Once initial fluency is established, some practice should mix previously learned problem structures so students must identify the appropriate strategy rather than merely repeat the most recent procedure.

### Digital feedback
Digitally delivered instructional feedback is most useful when it helps the learner understand the next action rather than merely revealing correctness.

### Structural visualization
Recent mathematics research supports segmenting lengthy problem information and using structural representations such as tables when they clarify relationships and reduce unnecessary cognitive load.

## 3. Canonical mathematics worksheet flow

A lesson should normally follow this sequence:

1. **Recall**
   - 1–3 brief prerequisite retrieval items.
   - No long review lecture.
   - Immediate low-stakes response.

2. **See the idea**
   - One central mathematical representation.
   - Geometry: diagram/construction.
   - Algebra: equation, graph, table, or expression.
   - Explanatory labels placed directly beside the relevant feature.

3. **Worked example**
   - Complete solution shown in meaningful steps.
   - Each step names or signals the governing mathematical reason when appropriate.
   - Avoid decorative duplication.

4. **Explain / Notice**
   - One or two self-explanation prompts.
   - Examples: “Why is this theorem valid here?” “What changed?” “Which information is irrelevant?” “Why is this step not reversible?”

5. **Guided try**
   - Similar problem with partial scaffolding.
   - Student enters/selects/constructs the missing reasoning.
   - Hints should be optional and progressively revealing.

6. **Independent worksheet**
   - Symmetrical problem grid.
   - Even item counts where practical.
   - Student response space immediately adjacent to each problem.
   - Geometry diagrams remain with their questions.

7. **Compare / Error analysis**
   - Periodic correct-vs-incorrect or strategy-vs-strategy comparison.
   - Do not force this into every lesson; use where misconceptions or strategy choice matter.

8. **Mixed retrieval / transfer**
   - A small number of prior-unit or prior-skill problems.
   - Require strategy selection rather than repeating one blocked format.

9. **Check and feedback**
   - Feedback should identify what was correct, what needs attention, and what the learner should do next.
   - Do not reveal full solutions prematurely when a smaller hint is enough.

10. **Reflect / evidence**
   - Short reflection or confidence/evidence statement.
   - Mastery/evaluator controls remain visible and usable.
   - Optional reference material may remain collapsed.

## 4. Geometry-specific architecture

### Primary workspace
The mathematical diagram or construction is the central object.

Preferred pattern:
- diagram;
- nearby labels/givens;
- prompt;
- response/control;
- feedback;
- next prompt.

Do not place a diagram in one column and its explanation in a persistent remote sidebar.

### Proof
Proof learning should expose the reasoning path:
- Given / Goal;
- relevant visual;
- theorem/property choices;
- step/reason pairing;
- self-explanation checkpoint;
- final proof or defense.

Heuristic worked examples should show not just **what** step was written but **why that move was chosen**.

### Constructions
Construction pages should support:
- target;
- tools/constraints;
- one step at a time;
- visual state;
- “why this step?” prompt;
- completed construction;
- transfer problem.

### Measurement / trigonometry
Place the diagram, known/unknown labels, formula choice, substitution, computation, units, and interpretation in one coherent visual sequence.

### CAD / modelling
Separate:
- design constraint;
- model;
- measurement/evidence;
- validation;
- limitation/revision.

## 5. Page-organization rules

- Center the learning workspace.
- No persistent instructional sidebars.
- One primary learning column or one balanced task grid.
- Keep corresponding text and visual representations physically close.
- Use equal peer grids.
- Minimum readable text/control size: 16px.
- Long explanatory prose remains left-aligned inside centered containers.
- Use whitespace to separate reasoning stages, not decorative boxes around every sentence.
- Optional supports may be collapsed by default.
- Current task, student response and feedback should not require large scroll jumps.
- Preserve tablet portrait and landscape usability.
- Do not require hover for essential information.
- Avoid unnecessary simultaneous animation or motion.

## 6. Interaction rules

Every interactive element must support a mathematical action:
- enter an answer;
- choose a theorem/strategy;
- manipulate or inspect a representation;
- reveal a hint;
- compare approaches;
- check reasoning;
- record evidence;
- move to the next mastery step.

Do not add interaction merely for novelty.

## 7. Adaptive support without hidden difficulty reduction

Supports may include:
- Hint 1: identify the relevant quantity/property.
- Hint 2: identify the theorem/formula/relationship.
- Hint 3: show the first reasoning step.
- Worked solution: available after a genuine attempt or educator-defined condition.

The mathematical target remains unchanged unless the learner is explicitly using a different approved pathway.

## 8. Recommended Geometry lesson card hierarchy

**Always visible**
- lesson title / objective;
- current mathematical task;
- diagram or representation;
- response area;
- feedback;
- lesson progress / mastery state.

**Collapsed by default when not immediately needed**
- vocabulary reference;
- extended explanation;
- alternate pathway supports;
- connected studio/tools;
- optional enrichment;
- full worked solution after attempt.

**Never hidden when needed for the current task**
- givens;
- units;
- formula/theorem choices;
- accessibility labels;
- required instructions.

## 9. Practice progression

Within a lesson:
- worked example;
- guided near example;
- independent near example(s);
- comparison/error-analysis item where useful;
- transfer item;
- small mixed-retrieval item.

Across lessons:
- gradually fade scaffolds;
- increase strategy selection;
- interleave prior skills after initial competence;
- retain spaced retrieval of high-value prerequisites.

## 10. Assessment boundary

Interactive worksheet assistance belongs to learning/practice surfaces.

Protected quizzes, unit mastery checks, midterm and final must follow their existing assistance and assessment rules. The worksheet engine must not leak hints, solutions, or answer-state into protected assessments.

## 11. Validation plan

Before broad deployment:
1. Prototype one Geometry lesson using this standard.
2. Test tablet landscape, tablet portrait, desktop and phone.
3. Check completion time, scroll distance, input usability and diagram readability.
4. Verify all grading/mastery/history behavior remains unchanged.
5. Beta test with a real learner.
6. Compare against the existing Geometry lesson and Pre-Algebra reference.
7. Revise the standard before course-wide propagation.

## 12. Initial Geometry prototype recommendation

Use **Unit 01 Lesson 01** as the first structural prototype because it establishes notation, diagrams, definitions and reasoning habits used throughout the course.

Prototype structure:
- Recall: identify point/line/plane from a diagram.
- See: one annotated geometric figure.
- Worked example: translate a diagram into precise notation.
- Explain: distinguish defined term / undefined term and explain why precision matters.
- Guided try: label a new figure.
- Interactive worksheet: even problem grid with inline answer fields or selectable reasoning.
- Error analysis: inspect one imprecise or invalid notation example.
- Transfer: interpret a less familiar figure.
- Reflect/evidence: one concise reasoning statement plus existing mastery control.
