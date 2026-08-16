(() => {
  "use strict";

  const STATES = Object.freeze([
    "verified",
    "strongly-supported",
    "supported",
    "partially-supported",
    "contested",
    "disputed",
    "unverified",
    "unsupported",
    "misleading",
    "false",
    "opinion-or-interpretation",
    "historically-anachronistic",
    "insufficient-evidence",
    "unresolved"
  ]);

  const CLAIM_TYPES = Object.freeze([
    "documented-fact",
    "primary-source-statement",
    "legal-finding",
    "statistical-observation",
    "historical-record",
    "scholarly-interpretation",
    "journalistic-analysis",
    "inference",
    "opinion",
    "allegation",
    "disputed-claim",
    "prediction"
  ]);

  function text(value, max = 4000) {
    return String(value ?? "").trim().replace(/\s+/g, " ").slice(0, max);
  }

  function integer(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? Math.trunc(n) : fallback;
  }

  function bool(value) {
    return value === true;
  }

  function makeRequest(input = {}) {
    const claimType = CLAIM_TYPES.includes(input.claimType) ? input.claimType : "documented-fact";
    return Object.freeze({
      contract: "khaemenes.evidence-review-request",
      contractVersion: 1,
      requestId: text(input.requestId || `evidence-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, 120),
      generatedAt: new Date().toISOString(),
      educationalContext: Object.freeze({
        school: "Khaemenes Academy",
        grade: text(input.grade || "09", 12),
        subject: text(input.subject, 120),
        course: text(input.course, 160),
        unit: text(input.unit, 160),
        assessmentId: text(input.assessmentId, 160)
      }),
      claim: Object.freeze({
        type: claimType,
        text: text(input.claim, 5000),
        timeContext: text(input.timeContext, 500),
        sourceContext: text(input.sourceContext, 1500)
      }),
      requestedChecks: Object.freeze({
        factualSupport: input.factualSupport !== false,
        sourceIndependence: input.sourceIndependence !== false,
        chronology: input.chronology !== false,
        interpretationVsFact: input.interpretationVsFact !== false,
        contradictoryEvidence: input.contradictoryEvidence !== false,
        uncertainty: input.uncertainty !== false
      }),
      privacy: Object.freeze({
        containsLearnerIdentity: false,
        containsRawCredentials: false,
        containsPrivateRouting: false,
        containsHiddenPrompting: false
      }),
      authority: Object.freeze({
        awardsMastery: false,
        changesPlacement: false,
        silentlyChangesGrade: false,
        mayTriggerHumanReview: true
      })
    });
  }

  function normalizeResult(input = {}) {
    const state = STATES.includes(input.state) ? input.state : "unresolved";
    return Object.freeze({
      contract: "khaemenes.evidence-review-result",
      contractVersion: 1,
      requestId: text(input.requestId, 120),
      reviewedAt: text(input.reviewedAt || new Date().toISOString(), 80),
      state,
      confidenceBand: ["low", "moderate", "high"].includes(input.confidenceBand) ? input.confidenceBand : "low",
      evidence: Object.freeze({
        independentSources: Math.max(0, integer(input.independentSources)),
        primarySources: Math.max(0, integer(input.primarySources)),
        contradictionsPresent: bool(input.contradictionsPresent),
        anachronismRisk: bool(input.anachronismRisk),
        interpretationPresentedAsFact: bool(input.interpretationPresentedAsFact),
        uncertaintyPresent: input.uncertaintyPresent !== false
      }),
      educationalUse: Object.freeze({
        mayInformFeedback: true,
        mayTriggerReview: true,
        maySilentlyChangeGrade: false
      })
    });
  }

  window.KhaemenesEvidenceContract = Object.freeze({
    version: "1.0.0",
    states: STATES,
    claimTypes: CLAIM_TYPES,
    makeRequest,
    normalizeResult
  });
})();
