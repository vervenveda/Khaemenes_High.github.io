# Student sticker reward integration

The Grades 9–12 Sticker Box interface is installed, but issuing rewards must be connected to the authoritative course unit-quiz graders.

Each qualifying unit quiz requires a persisted learner-specific score of 80% or higher. Use a stable course + unit + quiz ID and award once per quiz, even after a retake.

Do not infer a pass from course completion percentages, practice quizzes or user-editable local values.

Cosmetic storage shape: khaemenes.student.stickers.v1:<encoded-learner-id> containing earned (array of stable quiz keys) and placed (array of catalog emojis).

Test 79% no reward, 80% one reward, retake no duplicate, different quiz another reward, sibling isolation and persistence.

Client-side storage is not tamper-proof. Neither sticker issuance nor display is an academic credential.

Current status: UI is active, award issuance is pending quiz-engine integration.