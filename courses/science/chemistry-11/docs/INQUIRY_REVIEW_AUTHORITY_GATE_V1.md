# Chemistry 11 · Inquiry-time review authority gate v1

## Current release status
Learner-entered instructional and qualifying inquiry minutes are **provisional local evidence**. The printable educator worksheet is **not a credential, electronic approval, or secure authorization**. A 25% share is an instructional target, not an auto-issued pass.

## Required validation before educator electronic signoff
- Canonical learner identity, precise Chemistry 11 course identity, and authenticated educator identity must be established by the Academy's authoritative service. An editable local registry or checkbox is insufficient.
- Permission must be scoped to the learner, course, action and evidence set; deny on missing, expired or revoked grant. Recheck at submission time.
- Freeze or reference an exact digest/version of learner entries submitted for review; revisions after approval must invalidate the old approval.
- The educator reviews evidence descriptions against lesson artifacts, excludes routine instruction from the qualifying numerator, reconciles minutes with attendance and documented work, and signs a correction-ready review.
- Store an append-only approved decision with reviewer identity, grant identifier, timestamp, evidence digest, verified total minutes, verified qualifying minutes, ratio, rationale and revocation state in an access-controlled service. Never publish private learner details to a public GitHub repository.
- Deny final credit or private data sharing on authorization or service failure. Offline journal and print/export remain usable.

## Required fictional regression
1. Learner A records 90 minutes inquiry and 30 minutes ordinary instruction; learner B sees no A record.
2. Switch learner in the original A tab; further A-tab writes fail, including after focus.
3. Reload A and recover both entries; malformed saved content must lock future saves without overwriting it.
4. Fabricated educator checkbox, self-signed record, expired token or revoked grant must never yield an approved decision.
5. Modify previously reviewed entries; prior review must no longer authorize revised evidence.
6. Evidence review remains provisional until the actual Academy/STOS authorization service provides a verified, revocable permission record.

## Implementation notes
As of October 24, 2026, the HTML print worksheet, provisional inquiry ledger and fictional storage-isolation regression are implemented. The authoritative educator service, approval record, digest binding and revocation checks are **not** implemented. CI and real-browser end-to-end passing status are not established by this document.
