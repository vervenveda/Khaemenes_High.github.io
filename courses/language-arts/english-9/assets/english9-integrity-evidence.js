(() => {
  "use strict";

  const frame = document.getElementById("courseFrame");
  if (!frame) return;

  const CONTRACT_VERSION = 1;
  const COURSE = "english-09";
  const MAX_ATTEMPTS = 24;
  const POLL_MS = 250;

  function cleanIssue(issue) {
    if (!issue || typeof issue !== "object") return null;
    const clean = {
      type: String(issue.type || "unknown"),
      scope: String(issue.scope || "unknown")
    };
    if (Number.isInteger(issue.week)) clean.week = issue.week;
    if (Number.isInteger(issue.index)) clean.index = issue.index;
    if (Number.isFinite(issue.count)) clean.count = Number(issue.count);
    if (Number.isFinite(issue.answer)) clean.answerIndex = Number(issue.answer);
    return clean;
  }

  function duplicateGroups(groups) {
    if (!Array.isArray(groups)) return [];
    return groups.map((group, groupIndex) => ({
      group: groupIndex + 1,
      uses: Array.isArray(group?.uses)
        ? group.uses.map(use => ({
            scope: String(use?.scope || "unknown"),
            ...(Number.isInteger(use?.week) ? { week: use.week } : {}),
            ...(Number.isInteger(use?.index) ? { index: use.index } : {})
          }))
        : []
    }));
  }

  function buildPacket(audit) {
    const counts = audit?.counts || {};
    const positions = Array.isArray(audit?.answerPositions)
      ? audit.answerPositions.slice(0, 4).map(value => Number(value) || 0)
      : [0, 0, 0, 0];
    const issues = Array.isArray(audit?.issues)
      ? audit.issues.map(cleanIssue).filter(Boolean)
      : [];

    return Object.freeze({
      contract: "khaemenes.learning-integrity-evidence",
      contractVersion: CONTRACT_VERSION,
      producer: "Khaemenes High School",
      course: COURSE,
      grade: "09",
      branchContext: "hardening/archaemenes-highschool",
      masteryTargetPercent: 80,
      generatedAt: new Date().toISOString(),
      sourceAuditGeneratedAt: audit?.generatedAt || null,
      privacy: {
        containsLearnerIdentity: false,
        containsRawLearnerAnswers: false,
        containsAssessmentPromptText: false,
        networkTransport: false
      },
      assessmentStructure: {
        weekly: Number(counts.weekly) || 0,
        midterm: Number(counts.midterm) || 0,
        final: Number(counts.final) || 0,
        total: Number(counts.total) || 0
      },
      structuralIntegrity: {
        issueCount: issues.length,
        issues,
        exactPromptDuplicateGroupCount: Array.isArray(audit?.exactPromptDuplicates)
          ? audit.exactPromptDuplicates.length
          : 0,
        exactPromptDuplicateGroups: duplicateGroups(audit?.exactPromptDuplicates),
        answerPositions: positions,
        weeklyOverlap: {
          midterm: Number(audit?.weeklyOverlap?.midterm) || 0,
          final: Number(audit?.weeklyOverlap?.final) || 0
        }
      },
      authority: {
        awardsMastery: false,
        changesPlacement: false,
        changesLearnerIdentity: false,
        routesMentors: false
      }
    });
  }

  function publish(packet) {
    window.__KHAEMENES_ENGLISH9_INTEGRITY_PACKET__ = packet;
    window.dispatchEvent(new CustomEvent("khaemenes:integrity-evidence", {
      detail: packet
    }));
  }

  function collect(attempt = 0) {
    const win = frame.contentWindow;
    const audit = win?.__KHAEMENES_ENGLISH9_FORENSIC_AUDIT__;
    if (audit) {
      publish(buildPacket(audit));
      return;
    }
    if (attempt < MAX_ATTEMPTS) {
      window.setTimeout(() => collect(attempt + 1), POLL_MS);
    }
  }

  frame.addEventListener("load", () => {
    window.setTimeout(() => collect(0), 300);
  });
})();
