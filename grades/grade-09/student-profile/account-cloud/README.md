# Grade 09 Student Profile → Account Cloud Directory
**Phase 1: SOURCE-ONLY PREVIEW; no protected account writes.**

Canonical profile: `grades/grade-09/student-profile/index.html`. Eight-button toolbar: `dashboard-layout.js` dynamically creates `khaeProfileToolRail` with order Schedule, Student Progress, Student Portfolio, KlasaiPeer; Edit Profile, Edit Background, Yearbook, Creative Tools.

`account-cloud/grade09-directory-preview.mjs` is a standalone **pure metadata mapping**. It does not load browser localStorage, infer student identity, transmit records, create storage namespaces or alter the live profile. Its eight sections remain `NOT_COLLECTED`.

Tool-to-owner mapping is a proposed directory projection, not a claim that upstream services are commissioned. Student Progress remains owned by the subject engines. Yearbook and KlasaiPeer are external feature boundaries; access, privacy and consent must be verified before admitting content.

Future authorized bridge must use server-authenticated canonical learner/family IDs, source timestamps/digests, per-category explicit permission, immutable attachments, server-side conflicts/version checks, protected receipts, readback and restart recovery. The browser's `khaemenes_family_registry_v1`, active learner, arbitrary keys and profile data are never login authority. No sync on a single static Pages repository: GitHub is development only.

Run synthetic checks externally: `node grades/grade-09/student-profile/tests/grade09-directory-preview.test.mjs`.
