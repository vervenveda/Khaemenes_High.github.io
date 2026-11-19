# High School Mathematics · Mathematics Engine v2.3.0 Release Parity Closeout

**Date:** 2026-11-19  
**Courses:** Pre-Algebra · Algebra I · Geometry  
**Type:** repair · release parity · cache rotation · validation  
**Scope:** Mathematics Engine lesson-adapter query tokens and offline release boundaries only.  
**Assessment firewall:** no assessment items, scores, mastery thresholds, learner records, or curriculum content changed.

## Trigger

The fresh four-course forensic sweep found that the three Mathematics Engine adapter courses had source adapters at **v2.3.0** while representative lessons/service-worker release lists still referenced **?v=2.2.3**.

Affected architecture:
- Pre-Algebra
- Algebra I
- Geometry

Algebra II uses its own progression architecture and was not affected by this adapter-token issue.

## Concurrent repository repair observed

During implementation, repository head advanced concurrently.

A refreshed audit confirmed that the stale lesson tokens had already been corrected to **?v=2.3.0** across representative pages in all three courses.

Current representative confirmation:
- Pre-Algebra Unit 03 Lesson 07 → `prealgebra-math-lesson-v2-adapter.js?v=2.3.0`
- Algebra I Unit 10 Lesson 01 → `algebra1-math-lesson-v2-adapter.js?v=2.3.0`
- Geometry Unit 06 Lesson 01 → `geometry-math-lesson-v2-adapter.js?v=2.3.0`

Algebra I service worker had also concurrently advanced to:
- `khaemenes-algebra1-v47-evidence-offline-20261119`
- adapter precache token `?v=2.3.0`

## Cache boundary repairs completed in this pass

### Pre-Algebra

Service worker cache:
- before: `v24-assessment-firewall-20261119`
- after: **`v25-engine-parity-20261119`**

Commit:
- `1db0738336f441fa0a6ae3ba92d70653b6f05bca`

Purpose:
- force a fresh release cache after lesson HTML moved to the v2.3.0 adapter token;
- prevent a device from retaining pre-parity cached lesson HTML under the old release namespace.

### Geometry

Service worker cache:
- before: `khaemenes-geometry-v19-hardening-20261119`
- after: **`khaemenes-geometry-v20-engine-parity-20261119`**

Geometry service worker now precaches:
- `geometry-math-lesson-v2-adapter.js?v=2.3.0`

Commit:
- `cb8a48c2aa832fa0c605141d0055ac362fb40226`

### Algebra I

No additional cache bump was required in this pass because the refreshed repository already contained:
- `khaemenes-algebra1-v47-evidence-offline-20261119`
- v2.3.0 adapter precache parity.

## Validation

Repository workflow:

**Mathematics Engine lesson-shell integrity**  
Run number: **115**  
Run ID: **44560229592**  
Head: `cb8a48c2aa832fa0c605141d0055ac362fb40226`  
Result: **PASS**

This confirms the repository-wide Mathematics Engine lesson-shell contract is green after the release-parity/cache closeout.

A previous run at concurrent head `08f059389645ee80dfc4842e46a92f283948311f` was also already green after the lesson-token corrections landed.

## Temporary migration tooling

A one-use migration utility/workflow was briefly created while the stale-token population was being assessed. The repository advanced concurrently before that migration executed, making its original cache assumptions stale.

It was removed after the direct cache closeout so no obsolete one-use repair mechanism remains in the repository.

Cleanup commits:
- `1d80f7ee7f851455c086a13ecdfcb714ae891af2`
- `01364909174492de9e7d94448d75783b5dbb78bc`

## Final state

| Course | Adapter source | Lesson token | Offline release |
| --- | --- | --- | --- |
| Pre-Algebra | 2.3.0 | 2.3.0 | v25 engine parity |
| Algebra I | 2.3.0 | 2.3.0 | v47 evidence/offline |
| Geometry | 2.3.0 | 2.3.0 | v20 engine parity |
| Algebra II | n/a — separate architecture | n/a | v16 hardening r2 |

**Priority 1 from the four-course forensic sweep: CLOSED / PASS.**

Next recommended priority:
**evidence-chain parity** — remove summary-only or legacy-completion progression shortcuts in Pre-Algebra, Algebra I, and Geometry so all four courses meet Algebra II's stricter evidence-chain standard.
