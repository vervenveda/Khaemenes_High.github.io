(() => {
  "use strict";

  const STORAGE_KEY = "khaemenes.evidence-review-holds.v1";
  const MAX_RECORDS = 100;

  function safeRead() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(raw) ? raw.slice(-MAX_RECORDS) : [];
    } catch {
      return [];
    }
  }

  function safeWrite(records) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(-MAX_RECORDS)));
      return true;
    } catch {
      return false;
    }
  }

  function sanitize(record = {}) {
    return {
      contract: "khaemenes.answer-key-review-hold",
      contractVersion: 1,
      createdAt: String(record.createdAt || new Date().toISOString()).slice(0, 80),
      assessmentId: String(record.assessmentId || "").slice(0, 160),
      itemId: String(record.itemId || "").slice(0, 160),
      evidenceState: String(record.evidenceState || "unresolved").slice(0, 80),
      confidenceBand: String(record.confidenceBand || "low").slice(0, 40),
      note: String(record.note || "").slice(0, 1200),
      action: "hold-for-review",
      resolved: false,
      resolution: ""
    };
  }

  function add(record) {
    const next = sanitize(record);
    const records = safeRead();
    records.push(next);
    safeWrite(records);
    window.dispatchEvent(new CustomEvent("khaemenes:evidence-review-queue-updated", { detail: { count: records.length } }));
    return Object.freeze({ ...next });
  }

  function list() {
    return safeRead().map(record => Object.freeze({ ...record }));
  }

  function unresolved() {
    return list().filter(record => !record.resolved);
  }

  function resolve(index, resolution = "reviewed") {
    const records = safeRead();
    const i = Number(index);
    if (!Number.isInteger(i) || i < 0 || i >= records.length) return false;
    records[i] = {
      ...records[i],
      resolved: true,
      resolution: String(resolution || "reviewed").slice(0, 500),
      resolvedAt: new Date().toISOString()
    };
    return safeWrite(records);
  }

  window.addEventListener("khaemenes:answer-key-review-hold", event => {
    if (event?.detail) add(event.detail);
  });

  window.KhaemenesEvidenceReviewQueue = Object.freeze({
    version: "1.0.0",
    list,
    unresolved,
    resolve
  });
})();
