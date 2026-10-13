# Algebra II Units 10–11 · Student beta-testing checklist

**Scope:** Khaemenes Academy Algebra II Unit 10 Lessons 01–10 and Unit 11 Lessons 01–08.  
**Purpose:** Verify a complete student round trip from a lesson into a shared mathematics game and back, preserving unfinished work and independent course records.  
**Privacy:** Do not record student names, passwords, login tokens, identifying screenshots, or private learner notes in GitHub Issues. Describe the device/browser, page, lesson, and observed result only.

## Before testing

- Use the Academy learner profile intended for this test. Choose an existing profile; do not create a duplicate learner.
- In the same browser/device, keep ordinary local storage enabled. Private/incognito windows, different browsers, and different devices **do not share local game progress**.
- Never reset or erase real student work just to conduct this test. Use a test learner profile or the game's JSON export first.
- Start with the [Unit 10 overview](https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/algebra-2/units/unit-10/) or [Unit 11 overview](https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/algebra-2/units/unit-11/). Follow normal Academy lesson unlocking and prerequisite requirements.

## Primary round trip · Unit 11 Lesson 08

1. Open **Unit 11 → Lesson 08**. Find two game cards immediately after “Guided and independent practice”: **Coordinated Mission Control** and **Triangle Law Expedition**. Neither should cover or replace the lesson, local note, or next-lesson link.
2. Start **Coordinated Mission Control**. Confirm the active course is **Algebra II** and the game displays an advanced vector/navigation round.
3. Select one answer **without submitting**, return with **← Return to Unit 11, Lesson 8**, and reopen the same game. The same mission and selected choice should be present.
4. Check the answer. Before moving to the next mission, return to Lesson 08, reopen, and confirm the answer is still checked, the score is unchanged, and **Next mission** is available. You should not receive a second attempt or new round.
5. Advance, intentionally answer another question incorrectly, return and reopen. Confirm the missed-question count is preserved; the game must not reset the round.
6. Finish the round. Return and reopen. A completed round should remain reflected in the existing best score, while a **new** round can begin without restoring the finished round.
7. Now launch **Triangle Law Expedition** from the same lesson. Start a navigation mission; enter an answer, or intentionally answer incorrectly. Return and reopen. The same case and unfinished progress must remain available, independently of Coordinated Mission Control.
8. Save a harmless practice note in Lesson 08. Reopen both games and return again. Confirm the lesson note and completion checkbox state remain unchanged. Game practice must not award a unit exam grade or unlock restricted assessments.

## Unit 10 Lesson 10 · Integer Compass

1. Open **Unit 10 → Lesson 10** and select **Integer Compass · Vector Components**.
2. Confirm the Algebra II course and vector-component questions, select an answer, leave, and reopen the same lesson game. The selection should be restored.
3. Submit an answer, leave again and reopen. The checked outcome, score, and Next mission action should be preserved.
4. Continue until the end. The best score should still appear after returning, but the finished question sequence should not be forced on the student again.

## Accessible use and layout

- **Tablet/phone:** Try portrait and landscape. Look for horizontal page overflow, cut-off controls, overlays on the graph, tiny labels, or buttons that require zooming.
- **Keyboard:** Use Tab / Shift+Tab to locate both lesson game links, game controls, and the top return-to-lesson link. Every focused control should remain visible.
- **Screen reader where available:** Confirm the question, options, and correct/incorrect feedback can be read in a sensible order without duplicated announcements.
- **Help and retries:** Use a hint, get one answer wrong, then correct it. The problem should stay in place, and hinted/corrected work should not falsely count as unaided mastery in the newer expedition games.
- **Fresh lesson or different mode:** Switching to another lesson or mode must not overwrite the previous lesson's unfinished mission.
- **Refresh:** Reload at least once while a mission is unfinished. Verify that local progress returns in the same browser and selected learner.

## Record a bug (without private student data)

Record: **Unit/Lesson · Game · Device/browser · Steps to reproduce · Expected result · Actual result · Whether the result repeats**. If sharing an image, crop student profiles, private notes, IDs, and other identifying information first.

**Pass criteria:** Both Lesson 08 game cards appear; launching, returning, and resuming work succeed; Integer Compass also resumes; student notes and official grades are preserved; there are no broken navigation paths or unusable small-screen controls.

**Limitations:** GitHub CI checks mathematics, DOM logic, storage snapshots, route mapping and accessibility attributes, but cannot substitute for actual testing on each family device and browser.
