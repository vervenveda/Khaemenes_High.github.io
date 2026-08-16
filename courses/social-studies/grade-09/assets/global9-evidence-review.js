(() => {
  "use strict";

  function submitFromPacket(packet) {
    const generator = window.KhaemenesEvidenceGenerator;
    if (!generator || !packet || packet.course !== "global-studies-09") return;

    const structural = packet.structuralIntegrity || {};
    const assessment = packet.assessmentStructure || {};

    const request = generator.submit({
      grade: "09",
      subject: "Social Studies",
      course: "Global Studies Honors 9",
      assessmentId: "global9-structural-integrity",
      claimType: "documented-fact",
      claim: `The hardened Global Studies 9 assessment architecture contains ${assessment.weekly || 0} weekly objective items, ${assessment.midterm || 0} midterm items, and ${assessment.final || 0} final items, with ${structural.issueCount || 0} currently detected structural issues and weekly-to-exam overlap counts of ${structural.weeklyOverlap?.midterm || 0} for the midterm and ${structural.weeklyOverlap?.final || 0} for the final.`,
      sourceContext: "Generated from the local Grade 09 forensic audit packet. This request asks an evidence service to verify claims about the assessment package; it does not transmit learner identity or raw learner answers.",
      chronology: false
    });

    window.__KHAEMENES_GLOBAL9_EVIDENCE_REVIEW_REQUEST__ = request;
  }

  window.addEventListener("khaemenes:integrity-evidence", event => {
    submitFromPacket(event.detail);
  });

  if (window.__KHAEMENES_GLOBAL9_INTEGRITY_PACKET__) {
    submitFromPacket(window.__KHAEMENES_GLOBAL9_INTEGRITY_PACKET__);
  }
})();
