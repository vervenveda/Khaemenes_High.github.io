# Psychology 101 — Completion Challenge / Reinforcement Plan

## Purpose

Use selected mechanics from `vervenveda/arcade.github.io` as **optional, brief completion rewards** after demanding lesson segments or successful daily completion.

The system should support motivation and recovery without interrupting mastery, turning learning into a game economy, or creating an external runtime dependency.

## Scientific terminology

Psychology 101 should model the terminology it teaches.

A game offered after a completed academic behavior is a **completion reward** or **reinforcer candidate**. It functions as **positive reinforcement** only if adding that consequence actually increases the future probability of the target behavior.

Therefore, the student-facing UI should say things such as:

- `Challenge Unlocked`
- `You completed this section — choose a short break challenge`
- `Optional completion reward`

It should not make the unsupported scientific claim that every game is automatically a reinforcer for every student.

## Non-negotiable boundaries

- The challenge is optional.
- Skipping a challenge never reduces a grade, score, mastery state, streak, or access.
- Losing a challenge never affects academic progress.
- Challenge performance is not part of psychology mastery.
- A challenge never replaces retrieval practice, assignment work, or assessment.
- No loot boxes, artificial scarcity, streak loss, variable-ratio access schedules, or coercive reward mechanics.
- No hidden or remote behavioral analytics.
- Local-only preference/state is acceptable.
- Every challenge must have a visible `Return to Lesson` / `Close` control.
- Keyboard, touch, focus visibility, reduced-motion support, and no-required-audio operation are required.
- The course should preserve an immediate exit path for students who do not want stimulation.

## Recommended reward tiers

| Tier | Target length | Best use |
|---|---:|---|
| Micro | 10–60 seconds | after a particularly dense section or completed Evidence/Data task |
| Short | 1–3 minutes | after full daily lesson completion |
| Weekly | 3–7 minutes | after weekly mastery or a major cumulative checkpoint |

The default should be **Micro**. The academic experience should never become a sequence of interruptions.

# Arcade Forensic Shortlist

## Tier A — Best daily micro-reward candidates

| Arcade source | Existing mechanic | Psychology adaptation | Fit |
|---|---|---|---|
| `Pocket_Arcade_index.html` — Reaction Test | waits for a signal, then measures reaction time | **Reaction Flash** — one or three trials, 10–20 seconds total | EXCELLENT |
| `Pocket_Arcade_index.html` — Falling Dots | touch/mouse catching round already capped at about 45 seconds | **Focus Catch** — fixed 30–45 second round | EXCELLENT |
| `a_chromatic_focus_game_index.html` | bubble-pop reflex/selective-attention play with progressive stages | **Focus Burst** — one compact 30–60 second stage | EXCELLENT |
| `Tictactoe_index.html` | one-player Tic-Tac-Toe with AI and hint | **One-Round Grid Challenge** — exactly one game, then return | VERY GOOD |
| `Hangman_index.html` | progressive word guessing with hints | **Psych Word Reveal** — one previously introduced psychology term; remove hanging imagery/name | VERY GOOD |

### Why these lead the list

They can end naturally, work with touch, require very little setup, and can be shortened without destroying the underlying mechanic.

## Tier B — Good short rewards with adaptation

| Arcade source | Existing mechanic | Psychology adaptation | Recommended boundary |
|---|---|---|---|
| `Pocket_Arcade_index.html` — 2048 Mini | compact 2048 board | **2048 Sprint** | cap at 60–90 seconds or a tiny target such as 64/128; never open-ended |
| `a_colorshift_cascade_game_index.html` | visual logic/color grid challenge | **Cascade Minute** | one small generated board or one objective |
| `a_color_clash_game_index.html` | cognitive bubble duel, target shifts, reaction scoring, adaptive AI | **Clash Sprint** | one short round; optional because it is higher stimulation |
| `Orions_connect_four_index.html` | Connect Four strategy | **One Match** | one match only; better after a full lesson than after a section |
| `Jenny's_Sudoku_index.html` | full Sudoku system | **Mini Sudoku** | adapt only a 4×4 / very small puzzle; do not launch a full long board as a popup |

## Tier C — Better as weekly unlocks, not daily popups

| Arcade source | Why it is valuable | Why it should not be the default daily reward |
|---|---|---|
| `a_lumin_gate_game_index.html` | guaranteed-solvable seeded logic, touch-friendly weaving, adaptive difficulty | richer and more absorbing; best after weekly mastery |
| `a_signal_garden_game_index.html` | seeded logic garden, local progression, accessible controls | designed as a fuller experience rather than a 30-second interruption |
| `a_mind_garden_game_index.html` | calm garden stewardship and reflective play | restorative but open-ended; better as a voluntary sanctuary reward |
| `a_quantum_storyseed_orb_game_index.html` | deterministic creative prompts, timed writing, local drafts | excellent creative reward, but can become another academic writing task if overused |
| `a_haystack_escape_game_index.html` | deterministic maze progression | better as a weekly/optional arcade visit than a daily popup |

# Games/mechanics not recommended as default Psychology popups

## Full-length strategy cabinets

`Chess_Studio_index.html`, `Checkers_Variant_Lab_index.html`, `Backgammon_index.html`, and full-length Connect Four/Sudoku sessions are useful games but usually too long for a completion popup. They can remain available through the broader Arcade / Games button.

## IQ-labelled games

`IQ-mini_index.html`, `IQ-Quantum_index.html`, and `Trivia_mini_IQ_index.html` should **not** be used as routine reward popups in Psychology 101.

Week 6 explicitly teaches that intelligence is a construct measured imperfectly and that a score is not a person's identity or total intelligence. Presenting an `IQ` game as a casual reward risks contradicting that instructional guardrail.

Logic questions from those games could be reused only if stripped of IQ-ranking language and reframed as ordinary logic puzzles.

## Kids Bubble Pop as-is

`games/kids/Bubble_Pop_index.html` has useful tap-and-pop mechanics, but its current presentation is designed for Pre-K/Kindergarten and includes remote audio files. Do not embed it unchanged in Grade 9 Psychology.

Its mechanic could inspire a mature **Psych Bubble Burst** that asks students to tap a target term, definition, graph feature, or research-method concept while remaining fully local.

# Recommended Psychology completion flow

## A. Tough-section microbreak

Used sparingly on lessons marked as cognitively dense.

1. Student completes the required section task.
2. A small non-blocking card appears: `Focus break unlocked`.
3. Choices: `Play 30 sec`, `Different challenge`, `Skip`.
4. Challenge opens in a modal layer.
5. The challenge ends automatically or offers a clear close control.
6. Focus returns to the next lesson section.

Recommended pool:

- Reaction Flash
- Focus Catch
- Focus Burst
- Psych Word Reveal

## B. Daily completion reward

After the local lesson completion record is legitimately earned:

- offer one Short challenge;
- never autoplay it;
- allow the student to select a preferred challenge class: `word`, `logic`, `focus`, `calm`, or `surprise`;
- show `Continue / Finish Lesson` as the visually equal alternative.

## C. Weekly mastery reward

After weekly mastery at the course threshold:

- offer one Weekly challenge from Lumin Gate, Signal Garden, Mind Garden, Storyseed Orb, or another approved local cabinet;
- the academic next week remains unlocked by the mastery rule, not by playing the reward.

# Local implementation strategy

Do **not** make Psychology 101 depend on `arcade.github.io` at runtime.

Instead:

1. Extract/adapt the selected game mechanics into local Psychology challenge modules.
2. Remove external fonts, audio, analytics, remote APIs, and cross-repository dependencies.
3. Keep each module self-contained in vanilla HTML/CSS/JS.
4. Use same-origin local files so the course works offline.
5. Preserve the Arcade originals as their own independent games.

Suggested future structure:

```text
psych-101/
  challenges/
    index.html
    reaction-flash.html
    focus-catch.html
    focus-burst.html
    psych-word-reveal.html
    one-round-grid.html
    cascade-minute.html
    lumin-gate-mini.html
  data/
    challenge-map.js
```

# Lesson configuration model

Each lesson can declare whether a challenge is appropriate.

```js
{
  lesson: "06-04",
  challenge: {
    enabled: true,
    trigger: "lesson-complete",
    tier: "micro",
    pool: ["reaction-flash", "focus-catch", "one-round-grid"]
  }
}
```

A particularly difficult lesson could also define one optional section break:

```js
{
  lesson: "06-04",
  sectionBreak: {
    after: "assessment-fairness-case",
    challenge: "focus-burst",
    maxSeconds: 45
  }
}
```

# Selection policy

Random selection may be used **within an already-earned reward choice**, but the availability of the reward itself should remain predictable after the target academic behavior.

This avoids accidentally building a variable-ratio reward schedule into the learning environment.

A better design is:

**Complete → Reward is predictably available → Student chooses whether/how to use it.**

# Psychology-specific teaching opportunity

Week 4 can explicitly use the feature itself as a scientific example:

> The course offers a game after completion. Is the game automatically a positive reinforcer?

Correct answer:

> No. It is a candidate consequence. It functions as positive reinforcement only if adding it increases the future probability of the target behavior for that learner under those conditions.

This makes the interface consistent with the psychology it teaches.

# Recommended first implementation set

Build only five local challenge modules first:

1. **Reaction Flash** — extracted from Pocket Arcade Reaction Test.
2. **Focus Catch** — extracted from Pocket Arcade Falling Dots; 30–45 seconds.
3. **Focus Burst** — compact adaptation of Chromatic Focus.
4. **Psych Word Reveal** — vocabulary game using previously introduced Psychology Word of the Day terms.
5. **One-Round Grid** — compact Tic-Tac-Toe challenge.

That set gives five distinct reward experiences — reaction, motor focus, selective attention, vocabulary retrieval, and strategy — without overwhelming the course.

## Verdict

**GREEN — integrate as an optional Completion Challenge system.**

The best design is not “games everywhere.” It is a restrained, predictable reward layer that appears after genuine academic effort, remains optional, ends quickly, and never controls mastery.
