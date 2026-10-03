Estimation, Compatible Numbers & Reasonableness, with estimate-defender.html as its designated Math Break game.

Repository-ready file

Download estimate-defender.html

Backup copy

Download Lesson 6 · Synced Estimate Defender

The major change is that Estimate Defender is no longer only an “identify the reasonable numerical answer” game. Lesson 6 treats estimation as a decision-making process: identify the purpose, choose an appropriate strategy, explain what numbers changed, and then check the answer's scale.

I added a four-part Animated Instruction Studio:

Purpose Controls Precision — animates 398 + 607 → 400 + 600 ≈ 1,000, then distinguishes a quick magnitude estimate from the exact result 1,005.
Choose the Strategy — visually pairs addition/subtraction with rounding or front-end estimation, multiplication with benchmark factors, division with compatible numbers, and money/planning with practical estimates.
Reasonableness Shield — examines the false report 48 × 19 = 9,120, raises the benchmark 50 × 20 ≈ 1,000, and visually rejects the reported answer because its magnitude is wrong.
Estimate or Exact? — contrasts planning food for roughly 300 people with charging a final debit-card purchase. Planning can appropriately use an estimate; final payment requires an exact value.

Those examples come directly from the lesson's instructional approach and Estimation Laboratory, including 398 + 607, 598 ÷ 29, 49 × 21, and practical money estimation.

The actual game now mixes several types of missions instead of repeatedly asking the same question. Students encounter Reasonableness Defense, Strategy Selection, Precision Decision, Upper/Lower Benchmark, and Estimation Reasoning missions.

For example, the game can now ask:

598 ÷ 29

and require the student to recognize compatible numbers as the best strategy:

600 ÷ 30 = 20

Or it can present:

425 ÷ 8 = 531.25

and ask whether the answer is reasonable. The student uses:

400 ÷ 8 ≈ 50

to identify 531.25 as a place-value/magnitude error.

It also includes contextual questions such as whether planning attendance should use an estimate versus whether a final financial charge requires an exact amount. That distinction is explicitly part of the Lesson 6 objectives.

I synchronized the pathways too. Foundation concentrates on familiar rounding and basic magnitude. Core mixes rounding, compatible numbers, benchmark factors, front-end estimation, and justification. Extended introduces upper benchmarks, uncertainty, planning ranges, and deeper precision/reasonableness decisions—the same progression specified in the lesson.

The game now points directly back to:

units/unit-01/lessons/lesson-06-estimation-reasonableness.html

and uses its own local best-score key without interfering with the lesson engine.

The 80% mastery threshold remains synchronized with the course: Lesson 6 uses a 20-question practice with 16/20 required for mastery.

I also extracted the completed JavaScript and ran it through Node's syntax checker: it passes cleanly.

At this point, all six Unit 1 companion games have the same general learning rhythm:

lesson concept → animated explanation → guided visual reasoning → game application → immediate explanation → missed-item review → 80% mastery → return to lesson.
