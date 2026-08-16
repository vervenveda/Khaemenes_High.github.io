(() => {
  "use strict";

  function submitScienceReview() {
    const generator = window.KhaemenesEvidenceGenerator;
    const frame = document.getElementById("courseFrame");
    const audit = frame?.contentWindow?.__KHAEMENES_SCIENCE9_FORENSIC__;
    if (!generator || !audit) return false;

    const request = generator.submit({
      grade: "09",
      subject: "Science",
      course: "Integrated Science 9",
      assessmentId: "science9-forensic-runtime",
      claimType: "documented-fact",
      claim: "The hardened Integrated Science 9 runtime uses an 80% mastery threshold, preserves explicit cumulative assessment gates, and leaves the standalone midterm-score gap visible rather than fabricating a score.",
      sourceContext: "Generated from the local Science 9 forensic runtime state. This request is limited to curriculum and assessment-integrity claims and contains no learner identity or raw learner answers.",
      interpretationVsFact: true,
      contradictoryEvidence: true,
      uncertainty: true
    });

    window.__KHAEMENES_SCIENCE9_EVIDENCE_REVIEW_REQUEST__ = request;
    return true;
  }

  const frame = document.getElementById("courseFrame");
  if (!frame) return;

  frame.addEventListener("load", () => {
    let tries = 0;
    const timer = window.setInterval(() => {
      tries++;
      if (submitScienceReview() || tries > 24) window.clearInterval(timer);
    }, 250);
  });
})();
