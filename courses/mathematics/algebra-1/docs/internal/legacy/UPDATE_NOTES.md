# Algebra I Open-Age Upgrade Notes

## What was inspected

The deployed Algebra I directory contains a complete 36-week architecture with 13 units, 87 detailed lessons, 180 study sessions, three pathways, unit mastery checks, projects, multilingual vocabulary, diagnostic, midterm, final, gradebook, portfolio, records, and offline support.

## Repairs included

1. Reframed the landing page as **open-age and placement-based** rather than Grade 10.
2. Rebuilt the visual gateway with modern typography, larger spacing, responsive grids, and the same black/gold/blue family used by the upgraded Pre-Algebra portal.
3. Added the upper-right **Profile**, **Pin to Profile**, **Course Menu**, and **Theme** controls.
4. Linked both K badges to `https://khaemenesacademy.org/`.
5. Removed the nonexistent `../grade-10/` header route.
6. Activated the upgraded Khaemenes Scientific Calculator v4 throughout the landing page and dynamically replaces the old “under development” calculator cards.
7. Preserved the existing Algebra I storage key so prior learner records remain available.
8. Added direct hash routing for dashboard, week, scope, units, practice, assessments, gradebook, portfolio, and teacher views.
9. Added a safeguard for the existing practice engine’s repeated global radio names and IDs by clearing the inactive generator before a new set is created.
10. Updated the course map, README, and web-app manifest for open-age use.
11. Added a High School profile bridge so the new `algebra-1` pin can be displayed by the existing student profile.

## Repository cleanup

Delete the one-byte file:

`courses/mathematics/algebra-1/a`

It is not part of the course architecture.

## Upload order

1. Replace `courses/mathematics/algebra-1/index.html`.
2. Replace `courses/mathematics/algebra-1/course-map.json`.
3. Replace `courses/mathematics/algebra-1/README.md`.
4. Replace `courses/mathematics/algebra-1/manifest.webmanifest`.
5. Add `courses/mathematics/algebra-1/algebra1-profile-bridge.js`.
6. Add the one-line script from `HIGH_SCHOOL_PROFILE_SNIPPET.html` before `</body>` in the High School root `index.html`.
7. Delete the stray `courses/mathematics/algebra-1/a` file.

The existing `course-data.js`, question bank, assessments, units, lessons, and app logic remain in place.
