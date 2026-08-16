(() => {
  "use strict";

  const DEFAULT_WEIGHTS = Object.freeze({
    contentUnderstanding: 40,
    evidenceQuality: 20,
    sourceReliability: 15,
    claimEvidenceAlignment: 10,
    citationIntegrity: 10,
    epistemicHonesty: 5
  });

  const REVIEW_STATES = new Set([
    "partially-supported",
    "contested",
    "disputed",
    "unverified",
    "insufficient-evidence",
    "unresolved",
    "opinion-or-interpretation"
  ]);

  const CHALLENGE_STATES = new Set([
    "unsupported",
    "misleading",
    "false",
    "historically-anachronistic"
  ]);

  function clampScore(value) {
    const n = Number(value);
    return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
  }

  function rubricScore(scores = {}, weights = DEFAULT_WEIGHTS) {
    let totalWeight = 0;
    let weighted = 0;
    for (const [key, weightRaw] of Object.entries(weights)) {
      const weight = Math.max(0, Number(weightRaw) || 0);
      if (!weight) continue;
      totalWeight += weight;
      weighted += clampScore(scores[key]) * weight;
    }
    return totalWeight ? Math.round((weighted / totalWeight) * 100) / 100 : 0;
  }

  function evidenceDisposition(result = {}) {
    const state = String(result.state || "unresolved");
    if (["verified", "strongly-supported", "supported"].includes(state)) {
      return Object.freeze({ status: "clear", requiresReview: false, mayUseEvidenceScore: true });
    }
    if (CHALLENGE_STATES.has(state)) {
      return Object.freeze({ status: "hold", requiresReview: true, mayUseEvidenceScore: false });
    }
    if (REVIEW_STATES.has(state)) {
      return Object.freeze({ status: "review", requiresReview: true, mayUseEvidenceScore: false });
    }
    return Object.freeze({ status: "review", requiresReview: true, mayUseEvidenceScore: false });
  }

  function assess({ rubric = {}, evidenceResult = {}, baseScore = null, context = {} } = {}) {
    const rubricTotal = rubricScore(rubric);
    const disposition = evidenceDisposition(evidenceResult);
    const submittedBase = baseScore === null ? rubricTotal : clampScore(baseScore);

    return Object.freeze({
      contract: "khaemenes.evidence-aware-grade-advisory",
      contractVersion: 1,
      generatedAt: new Date().toISOString(),
      context: Object.freeze({
        course: String(context.course || "").slice(0, 160),
        assessmentId: String(context.assessmentId || "").slice(0, 160),
        learnerScoped: context.learnerScoped === true
      }),
      rubric: Object.freeze({
        weights: DEFAULT_WEIGHTS,
        scores: Object.freeze({ ...rubric }),
        computedScore: rubricTotal
      }),
      baseScore: submittedBase,
      evidence: Object.freeze({
        state: String(evidenceResult.state || "unresolved"),
        confidenceBand: String(evidenceResult.confidenceBand || "low"),
        disposition: disposition.status
      }),
      advisory: Object.freeze({
        scoreMayProceed: disposition.status === "clear",
        reviewRequired: disposition.requiresReview,
        holdReason: disposition.status === "hold" ? "Evidence review challenges the factual basis or answer-key assumption." : disposition.status === "review" ? "Evidence remains incomplete, contested, interpretive, or unresolved." : "",
        silentlyChangesGrade: false,
        awardsMastery: false,
        changesPlacement: false
      })
    });
  }

  function challengeKey({ assessmentId = "", itemId = "", evidenceResult = {}, note = "" } = {}) {
    const disposition = evidenceDisposition(evidenceResult);
    if (!disposition.requiresReview) return null;

    const record = Object.freeze({
      contract: "khaemenes.answer-key-review-hold",
      contractVersion: 1,
      createdAt: new Date().toISOString(),
      assessmentId: String(assessmentId).slice(0, 160),
      itemId: String(itemId).slice(0, 160),
      evidenceState: String(evidenceResult.state || "unresolved"),
      confidenceBand: String(evidenceResult.confidenceBand || "low"),
      note: String(note || "").trim().slice(0, 1200),
      action: "hold-for-review",
      silentlyChangesGrade: false,
      automaticallyChangesKey: false,
      requiresHumanOrGovernedReview: true
    });

    window.dispatchEvent(new CustomEvent("khaemenes:answer-key-review-hold", { detail: record }));
    return record;
  }

  window.KhaemenesEvidenceGrading = Object.freeze({
    version: "1.0.0",
    weights: DEFAULT_WEIGHTS,
    rubricScore,
    evidenceDisposition,
    assess,
    challengeKey
  });
})();
