# 2026-11-17 · Mathematics Interactive Worksheet Research for Geometry

- Repository: `vervenveda/Khaemenes_High.github.io`
- Timezone: America/New_York
- Type: research · instructional design · Geometry
- State: research documented; design standard committed; implementation pending

## Founder vision

Geometry should become an **interactive worksheet experience**: clean, organized and mathematically active, drawing on the successful Pre-Algebra presentation model while using research specific to mathematics learning.

## Prior Academy evidence recovered

The English 9–12 research workflow already recorded several cross-domain principles:
- reduce competing mental demands;
- keep related source/question material adjacent;
- prioritize retrieval/practice and spaced review;
- use adjustable/graduated supports;
- keep pages centered, symmetrical and readable;
- keep long passages left-aligned inside centered containers;
- collapse optional support while keeping required learning material available.

Source:
- `workflow/logs/2026/11/2026-11-16-research-based-english9-12-lesson-layout-plan.md`

These principles remain useful, but Mathematics needs a domain-specific implementation.

## Mathematics-specific research synthesis

### 1. Worked examples plus active problem solving
Research on cognitive load and mathematics supports worked examples for initial acquisition, followed by actual problem solving. Recent equation-learning research also supports including active problem solving rather than worked-example-only sequences.

**Academy implication:** use **Worked Example -> Guided Try -> Independent Try**, not explanation-only pages.

### 2. Self-explanation
Mathematics research supports prompts asking students to explain why a solution step works or why an incorrect example is incorrect. Geometry proof research specifically supports heuristic examples plus self-explanation prompts.

**Academy implication:** each lesson should contain a small number of high-value “Why?” / “Which theorem?” / “What changed?” prompts rather than many passive explanation cards.

### 3. Correct / incorrect example comparison
Algebra research found conceptual-learning benefits from incorrect examples and comparison when paired with guidance.

**Academy implication:** add targeted error-analysis cards where misconceptions matter; do not use them as decorative extras.

### 4. Spatial contiguity
Multimedia-learning research strongly supports placing corresponding words and visuals near one another.

**Academy implication for Geometry:** a diagram, givens, theorem prompt, answer field and feedback should be one local task cluster. Do not make students scan from a diagram to a remote sidebar.

### 5. Signaling
Research shows cues can direct visual attention toward the relevant text-diagram relationship.

**Academy implication:** use restrained highlighting, numbering, arrows, labels and step markers to identify the exact part of a diagram or expression under discussion.

### 6. Interleaving and spacing
Mathematics studies support some interleaved and spaced practice, particularly after learners have enough competence to distinguish problem types.

**Academy implication:** teach a new pattern coherently first, then add a small “mixed retrieval / choose the method” section rather than making every initial practice set mixed.

### 7. Structural visualization
Recent eighth-grade mathematics research found that segmented text and tabular representations can reduce cognitive load and improve problem solving in complex word problems.

**Academy implication:** segment long mathematical prompts into givens / relationships / target / representation rather than presenting dense paragraphs.

### 8. Digital feedback
Research on digitally delivered feedback supports feedback design as an important moderator of learning.

**Academy implication:** feedback should say more than correct/incorrect: identify the relevant misconception or next mathematical action, while avoiding immediate full-solution disclosure when a smaller hint is sufficient.

## New Academy standard

Created:
- `courses/shared/MATHEMATICS_INTERACTIVE_WORKSHEET_DESIGN_STANDARD_V1.md`

Commit:
- `938435d3939f6d538aa4e3fc0a59048500c68ecf`

The standard defines a canonical mathematics worksheet flow:

**Recall -> See the Idea -> Worked Example -> Explain/Notice -> Guided Try -> Independent Worksheet -> Compare/Error Analysis -> Mixed Retrieval/Transfer -> Check/Feedback -> Reflect/Evidence**

## Geometry-specific recommendation

Prototype the new architecture on:
- `courses/mathematics/geometry/units/unit-01/lessons/u01-l01.html`

Reason:
- establishes definitions, notation, diagram reading and precise mathematical language used throughout Geometry;
- low enough in the dependency chain to test before scaling;
- rich enough to test diagram/text contiguity, self-explanation and interactive worksheet controls.

## Guardrails

- Do not alter mathematical standards or mastery threshold.
- Do not expose assistance inside protected assessments.
- Do not convert the entire course before one prototype passes browser/tablet/student testing.
- Preserve printable evidence.
- Preserve accessibility and keyboard use.
- Interaction must serve a mathematical action, not novelty.

## Next action

Build the Unit 01 Lesson 01 prototype using the new standard while keeping the existing lesson content and mastery authority intact. Compare it directly with the existing Geometry page and the Pre-Algebra reference before propagation.
