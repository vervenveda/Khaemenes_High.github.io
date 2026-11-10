# High School Student Profile Editors — Learner Switch and Family Return Audit
**Date:** November 10, 2026
**Branch:** `hardening/high-profile-family-context-2026-11-09`
**Mode:** Review branch only; no production deployment, student storage mutation, or STOS T03 change.

## Scope
Grade 09 photo, background, details and preferences editor modules are reused for the Grades 10–12 Student Profile experience. The Grade 09 standalone Profile editor has separate page initialization. The four Grade 09–12 Student Profile dashboards need a predictable route back to Family Portal.

## Repairs staged
1. **Photo editor learner revalidation.** `student-profile-photo.js` now requires `KhaemenesHighProfileGradeContext.activeForGrade(pageGrade)` and rejects conflicting StudentProfileV2 or course-entry identity. Rechecks learner ownership immediately before writing an asynchronously processed photograph and refreshes on family changes and relevant storage changes.
2. **Background editor ownership.** `student-profile-background.js` now requires the same validated registered learner for its `person()` identity. The primary multi-choice save refuses guest/no-learner context, and image uploads revalidate ownership directly before saving. Existing isolated guest-only decorative previews and other individual controls remain, and require additional acceptance testing.
3. **Preferences scoping.** `student-profile-preferences.js` no longer uses an unscoped base storage key when no validated learner exists. Profile design writes and resets require a learner-specific key, and preferences refresh with family changes.
4. **Personal details visibility.** `student-profile-details.js` now returns no active learner for the wrong registered family/grade, withholding learner-specific details from the wrong grade view.
5. **Grade 09 editor initialization and return navigation.** `grades/grade-09/student-profile/profile/index.html` now loads shared family-grade context before the preferences/details modules. Added an explicit Family Portal link beside Edit My Profile in Grades 09–12 student dashboard heroes.

## Checks performed
- JavaScript syntax parsed successfully for all four editor modules, Grade 09 standalone profile editor inline scripts, and test source `grades/tests/high-profile-editor-switch.test.cjs`.
- Source assertions confirmed a post-image-processing owner check, validated background writes, no unscoped preference-key fallback, grade-specific personal-details context, and the Grade 09 editor script load order.
- **Full Node test runner and browser tests remain unexecuted.** Source checks do not prove multi-tab runtime behavior, image processing races, modal state transitions, or server authorization.
- This is browser-local consistency hardening, **not** a backend-authenticated, read-only parent session.

## Outstanding acceptance gates
- Run synthetic Node tests and interactive browser tests using two or more synthetic learners, across grades, before merging.
- Verify photo/background dialogs close or reset their contents when the selected learner changes while the dialog remains open.
- Confirm the standalone profile form save handlers read back the same selected learner when saving and that other grade-level tools also enforce ownership.
- Audit other individual background controls (sticker/page color/image removal) for consistency when active identity is absent; they may still update isolated guest decoration.
- Preserve a normal Family Portal return link but do not treat the link as an authenticated parent account switch.
- STOS T03 must authorize actual family relationships, observer reads and academic writes on the server. This branch does not activate T03, alter course mastery, or migrate student records.
