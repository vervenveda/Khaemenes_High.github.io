# High School Grade 09–12 Profile Editor — Modal Identity & Form Save Hardening
**Date:** November 10, 2026
**Branch:** `hardening/high-profile-family-context-2026-11-09`
**Status:** Review branch only; no merge, no deployment, no learner data accessed.

## Scope and staged fixes
The Grade 09 photo and background modules are shared across the Grade 10–12 dashboard pages. The Grade 09 standalone editor contains a separate personal-profile save form.

1. **Photo modal lifecycle:** Captures the validated learner ID when the modal opens and closes the dialog when family/learner selection changes, including storage events from another tab. Clears its upload selection. Existing post-decode ownership recheck is preserved.
2. **Background modal lifecycle:** Captures the learner on open; rejects opening without a registered grade-matching learner, and closes the dialog if that owner changes. Clears pending file input on identity changes.
3. **Individual color/sticker controls:** Section color, page color, reset, page sticker, upload and image removal actions now require the selected registered learner. Writes use learner-specific storage keys rather than browser guest fallback. When no owner is available, edit inputs are disabled; read-only decorative preview behavior remains separate.
4. **Grade 09 standalone form:** Requires `activeForGrade("09")`, removes unscoped profile-key fallback and rechecks exact selected learner and grade immediately before the main profile write. Refreshes form content on family-change, browser storage-change and page-show selection changes.
5. **Regression coverage:** `grades/tests/high-profile-editor-dialog-identity.test.cjs` verifies dialog switch handling, learner-specific background actions, and Grade 09 form write guards.

## Verification
- JavaScript parsing passed for photo, background and profile form scripts and newly authored regression source.
- Source assertions confirmed dialog close conditions and selected-learner checks on background writes and form saves.
- Actual Node `--test`, end-to-end modal interaction, synthetic multi-learner browser execution, race injection, cross-device behavior and backend ACL tests **have not been run**. This audit does not claim runtime success.
- No real student records, grades, passwords, photos or private profile contents were accessed or migrated.

## Follow-up gates
- Confirm photo/background dialog closure occurs before a queued upload can write after cross-tab switches.
- Inspect every individual profile photo/shape/badge writer and all dynamically attached yearbook/profile studio adapters for independent ownership checks.
- Test Grades 9–12 dashboard and standalone Grade 09 profile in browser, including switching family and learner while dialogs are open, refresh, focus and offline.
- Implement authenticated guardian read-only access and server-side learner/record permissions through STOS T03 before claiming actual parent observer security.
- Preserve production main and existing unscoped historical record containers until independently verified migration.

## Boundary
Browser-local family selection and grade validation reduce accidental cross-student edits but do not constitute authentication or server-enforced authorization. This change does not turn student editors into read-only parent viewers, and it does not commission T03.
