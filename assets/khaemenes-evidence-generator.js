(() => {
  "use strict";

  const pending = new Map();

  function contract() {
    return window.KhaemenesEvidenceContract || null;
  }

  function submit(input) {
    const api = contract();
    if (!api) throw new Error("KhaemenesEvidenceContract is not loaded.");
    const request = api.makeRequest(input);
    pending.set(request.requestId, request);
    window.dispatchEvent(new CustomEvent("khaemenes:evidence-review-request", { detail: request }));
    return request;
  }

  function receive(input) {
    const api = contract();
    if (!api) throw new Error("KhaemenesEvidenceContract is not loaded.");
    const result = api.normalizeResult(input);
    if (result.requestId) pending.delete(result.requestId);
    window.dispatchEvent(new CustomEvent("khaemenes:evidence-review-result", { detail: result }));
    return result;
  }

  function pendingRequests() {
    return [...pending.values()];
  }

  function gradeAdvisory(result = {}) {
    const state = String(result.state || "unresolved");
    const favorable = new Set(["verified", "strongly-supported", "supported"]);
    const caution = new Set(["partially-supported", "contested", "disputed", "unverified", "insufficient-evidence", "unresolved"]);
    const challenge = new Set(["unsupported", "misleading", "false", "historically-anachronistic"]);

    if (favorable.has(state)) {
      return Object.freeze({ action: "support", mayAwardPoints: true, requiresReview: false, silentlyChangesGrade: false });
    }
    if (challenge.has(state)) {
      return Object.freeze({ action: "hold-for-review", mayAwardPoints: false, requiresReview: true, silentlyChangesGrade: false });
    }
    if (caution.has(state) || state === "opinion-or-interpretation") {
      return Object.freeze({ action: "contextual-review", mayAwardPoints: false, requiresReview: true, silentlyChangesGrade: false });
    }
    return Object.freeze({ action: "contextual-review", mayAwardPoints: false, requiresReview: true, silentlyChangesGrade: false });
  }

  window.KhaemenesEvidenceGenerator = Object.freeze({
    version: "1.0.0",
    submit,
    receive,
    pendingRequests,
    gradeAdvisory
  });
})();
