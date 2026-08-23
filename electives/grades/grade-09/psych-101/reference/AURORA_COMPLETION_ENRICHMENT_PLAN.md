# Psychology 101 — Aurora Completion & Enrichment Plan

## Purpose

Review selected mechanics from `vervenveda/aurora.github.io` for use as **optional, local-first completion rewards, creative microbreaks, and weekly enrichment experiences** in Grade 9 Psychology 101.

Aurora adds a different kind of reinforcement option than the Arcade: not only reflex/logic games, but also calm creativity, visual matching, drawing, prompt generation, and low-pressure exploration.

The same scientific boundary applies:

> A completion activity is a **reward / reinforcer candidate**. It is positive reinforcement only if adding it actually increases the future probability of the target academic behavior for that learner under those conditions.

No Aurora activity should control mastery, grades, access, or assessment outcomes.

## Core boundaries

- Optional only.
- No penalty for skipping, losing, closing, or declining to write/draw.
- No private emotional disclosure required.
- No therapeutic claims or treatment framing inside the Psychology course.
- No streak-loss mechanics, coercive daily-use mechanics, or variable-ratio access.
- No remote analytics.
- Local-only state is acceptable.
- Psychology adaptations must remove external runtime dependencies.
- Every activity needs a visible `Return to Lesson` / `Close` control.
- Reduced-motion, keyboard, touch, and no-required-audio support are required.
- Richer Aurora experiences belong after daily/weekly completion rather than between every lesson section.

# Strongest Aurora candidates

## Tier A — Excellent short completion rewards

| Aurora source | Existing mechanic | Psychology adaptation | Best use |
|---|---|---|---|
| `apps/color_alchemy_index.html` | RGB sliders used to match a target hue with immediate similarity scoring | **Color Match Minute** — one target, one check, optional second try | Week 3 especially; 30–60 sec |
| `apps/SpinSpire_index.html` | visual spinner generates creative prompts | **Creative Spark Spin** — use a new neutral, school-safe prompt bank | daily completion; 1–2 min |
| `apps/brain_maze_index.html` | local maze, adjustable difficulty, no-score option, gentle exit goal | **Maze Minute** — one compact solo maze, no “Mom Brain” framing | daily/weekly; 1–3 min |
| `apps/AuraInk_index.html` | touch/mouse drawing canvas with multiple brush modes | **Doodle Break** — blank local canvas, 60–120 sec, save optional | daily completion; calm creative option |

### Why these are strong

They are intrinsically finite or can be made finite, work well on touch devices, and provide genuinely different reward experiences: perceptual matching, surprise/choice, spatial exploration, and open creative play.

## Tier B — Strong weekly / richer enrichment candidates

| Aurora source | Existing mechanic | Psychology adaptation | Boundary |
|---|---|---|---|
| `apps/inspiration_mosaic_index.html` | build a visual/text mosaic with tiles and celebratory milestones | **Concept Mosaic** or **Inspiration Mosaic** | weekly mastery; 3–7 min; no points economy needed |
| `apps/creative_mind_odyssey_index.html` | prompt generator, response space, themes, local gallery/library | **Curiosity Odyssey** | weekly or project-break enrichment; remove score/streak and private-reflection pressure |
| `apps/niche_venn_index.html` | interactive three-circle Venn synthesis | **Applied Psychology Venn** | best in Week 13 project/application work rather than as a generic reward |

## Tier C — Keep as separate voluntary sanctuary experiences

Several Aurora tools are meaningful, but they should not become completion contingencies inside Psychology 101 because their current purpose is reflective, emotional, spiritual, or wellness-oriented.

Examples include:

- `apps/quiet_wins_index.html`
- `apps/daily_spark_index.html`
- breathing / grounding tools
- affirmation gardens
- daily journal / letter-to-me tools
- evening prayer / reflection tools
- emotional-weather style tools

These may remain available through an **Optional Aurora / Calm & Creative** doorway, but the course should never imply that a student needs to use them because of an emotional state, nor should it treat participation as evidence of mental health, coping ability, or academic engagement.

### Why `Quiet Wins` stays separate

`Quiet Wins` intentionally invites personal reflection and explicitly says nothing is a test. That design is valuable and should remain protected from becoming an academic reward requirement. If exposed from Psychology 101, it should be a voluntary sanctuary link with no completion data flowing back to the course.

### Why `Daily Spark` is not copied as-is

The current app includes streak tracking and Move/Create/Connect/Gratitude prompts. Psychology 101 can borrow the **one-minute prompt** idea, but should not import streak pressure or require personal gratitude/social tasks as academic consequences.

# Required sanitization before local reuse

Several Aurora files contain external dependencies or framing that is appropriate in Aurora but not in the sovereign Psychology course.

Before adaptation:

1. remove Google Font requests and use the course's local-safe font stack;
2. remove remote images/audio/assets;
3. remove share buttons that send users outside the course unless explicitly retained as optional navigation;
4. remove healing/treatment claims from reward modules;
5. remove streak, score, or level systems when they would create pressure rather than a brief reward;
6. replace personal/emotional prompt banks with neutral creative prompts unless the activity is deliberately kept in the separate sanctuary layer;
7. keep all challenge state local to the browser;
8. ensure the activity ends naturally or enforces a short maximum duration.

# Recommended Aurora-derived modules

Add these after the first Arcade-derived challenge set is stable:

1. **Color Match Minute** — from Color Alchemist.
2. **Creative Spark Spin** — from SpinSpire / Creative Wheel mechanics, using a new Psychology-safe prompt bank.
3. **Maze Minute** — from Brain Maze, simplified and retitled.
4. **Doodle Break** — from AuraInk's canvas mechanics, fully local and dependency-free.
5. **Concept Mosaic** — from Inspiration Mosaic, reserved primarily for weekly mastery or Week 13 synthesis.

## Psychology-specific lesson pairings

| Psychology unit | Particularly good Aurora pairing |
|---|---|
| Week 3 — Sensation, Perception & Attention | Color Match Minute |
| Week 5 — Memory & Language | Creative Spark Spin / Psych Word Reveal |
| Week 6 — Thinking & Decision-Making | Maze Minute |
| Week 7 — Emotion & Motivation | Doodle Break as an optional creative reward, with no emotional interpretation |
| Week 10 — Social & Cultural Psychology | Concept Mosaic using supplied public concepts rather than private disclosures |
| Week 13 — Applied Psychology & Research Synthesis | Applied Psychology Venn / Concept Mosaic |

The challenge should remain a **reward layer**, not an additional assignment. A unit pairing may give the activity thematic resonance, but performance in the activity does not become psychology evidence or mastery data.

# Combined challenge menu

The eventual student-facing completion card can offer five classes:

- **Focus** — Reaction Flash, Focus Catch, Focus Burst
- **Logic** — One-Round Grid, Maze Minute, Cascade Minute
- **Words** — Psych Word Reveal
- **Create** — Color Match Minute, Creative Spark Spin, Doodle Break
- **Calm** — voluntary Aurora sanctuary link, never tied to grade/mastery and never prescribed from student behavior

A student may choose a preferred category locally. `Surprise me` can randomly select within the already-earned optional reward pool.

# Design principle

**Arcade supplies quick play. Aurora supplies creative breathing room. Psychology 101 can use both without turning either one into a requirement.**

## Verdict

**GREEN — Aurora adds a valuable second enrichment lane.**

Use the playful/creative mechanics locally, keep therapeutic or deeply personal experiences separate and voluntary, and preserve the course boundary that completion rewards never become evidence about a student's psychology.
