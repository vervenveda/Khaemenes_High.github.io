# Social Studies View Routing Contract

## Purpose

Course-feature cards, sidebar buttons, tabs, and direct links must address the same engine views.

A URL such as `?view=reports` is an authoritative deep link, not a decorative query parameter.

## Canonical views

Grades 9, 10, 11 Government/Economics, and Grade 11 Personal Finance:

- `dashboard`
- `week`
- `scope`
- `exams`
- `reports`
- `standards`

Grade 12:

- `dashboard`
- `week`
- `scope`
- `assessments`
- `capstone`
- `graduation`
- `reports`
- `standards`

Grade 12 does not use `audit` or `exams` as engine view names.

## URL behavior

Each engine:

1. reads `?view=` on page load;
2. accepts only allow-listed view names;
3. falls back to Dashboard for an unknown view;
4. writes the active view back to the URL when learners use tabs or navigation;
5. preserves `week=N` only when the active view is `week`;
6. when opening `?view=week` without a week number, resolves to the learner's current unlocked week;
7. writes both `view=week` and `week=N` when a learner selects a week.

This makes reloads, bookmarks, shared course-feature links, and browser history state deterministic.

## Shared shell

The Social Studies grade shell must only link to view names supported by the target engine.

Grade 12 feature routes are:

- Official Weeks → `?view=week`
- Assessments → `?view=assessments`
- Progress & Evidence → `?view=reports`
- Graduation Gates → `?view=graduation`
