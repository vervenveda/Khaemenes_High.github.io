# Science 9 Record Authority Handoff

**Course:** International Integrated Science 9  
**Course code:** KH-SCI-IIS9  
**Status:** Public evidence handoff implemented; protected official issuance remains outside this learner repository.

## What is now wired

The Science Evidence Portfolio can export a `khaemenes-science9-course-evidence-handoff` package for the currently selected learner. The package contains only learner-scoped formative investigation evidence already stored in the browser.

This package is designed for **intentional transfer** into a future protected Academy / Account Cloud review workflow. It is not a network sync and does not silently transmit learner data.

## What the browser is forbidden to claim

The public exporter cannot create or assert:

- official mastery;
- an official midterm or final result;
- course credit;
- a transcript entry;
- administrator approval;
- a signed Academy record.

Those actions require the protected Noema + NAIB/Administration assessment authority described in `courses/shared/shared/assessment-authority/`.

## Protected issuance sequence

1. Establish authenticated learner identity.
2. Receive the learner's intentionally transferred public formative evidence, if used.
3. Administer or validate the protected supervised assessment version.
4. Grade protected responses behind the private authority boundary.
5. Review identity, evidence, score and credit decision.
6. Produce an administrator-approved record that satisfies `admin-approved-record.schema.json`.
7. Issue a signed course record satisfying `signed-record.schema.json`.
8. Only then may the Academy account/transcript system treat the course as authoritative credit.

## Account Cloud boundary

No public Science 9 page currently possesses a production Account Cloud write credential, private signing key, or authenticated credit-issuance capability. This is deliberate. The exported handoff is a portable admission package, not a claim that the protected Account Cloud intake is already commissioned.

When the protected intake becomes available, it should accept this handoff only as **supporting formative evidence** and must independently obtain authenticated official assessment/approval evidence before issuing credit.

## Privacy and integrity

- Export occurs only after the learner deliberately presses the handoff button.
- The package contains the selected learner identifier and saved Science 9 formative records.
- It contains no password, token, private key, official answer key or hidden assessment material.
- Browser-local evidence remains editable by the device owner and therefore non-authoritative.
- A signed record proves the reviewed Academy issuance, not the trustworthiness of an unsigned browser score.
