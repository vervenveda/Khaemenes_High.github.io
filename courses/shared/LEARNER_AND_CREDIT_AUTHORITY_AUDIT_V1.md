# High School learner identity and credit authorization · audit boundary v1
Khaemenes Academy · Grades 9–12 · 2026-10-24

**Readiness status: NOT CERTIFIED for authenticated final credit or private portfolio sharing.**

The Grade 12 Social Studies HTML engine includes learner-specific Monte Carlo storage keys, a local progress gradebook, a 13-gate audit, and *provisional* local course completion. A browser-local editable evaluator checkbox is not educator authentication. Do not reuse that checkbox as an authorization token in other subjects.

## Cross-grade security and consent contract
1. Use the Academy's actual session authority to establish a canonical learner identifier and a separately authenticated educator identity; local names, UI checkboxes and storage keys are never permission credentials.
2. Bind read, write, print/export, review and issue-credit operations to exact learner, course, role and scope. Deny private data and credit issuance when the authenticated session or grant cannot be verified.
3. Preserve first-party offline **private local journaling** even when the authenticated sharing/issuance channel is unavailable. Mark locally recorded grades and self-attestation as provisional.
4. Revocation must invalidate active shared-reading and credit-issuance authority. Recheck authorization when granting access; never treat an old cached approval as perpetual authorization.
5. Test two fictional learners on one device: open form A, switch to B, verify no A data or responses in B; restart A, retake with new order, preserve prior best scores; deny B's attempt to approve A's portfolio.
6. Keep educator approval and formal transcript issuance disabled or clearly provisional until authenticated, independently reviewable permission evidence is present.

## Implementation state
This file defines the required controls; it does **not** claim grade 9–12 profile access control has been repaired, a secure STOS authorization gateway is online, or browser/CI regression has passed. The source-code changes to Grade 12's assessment key do not alone isolate all course data because the broader state remains browser-local.
