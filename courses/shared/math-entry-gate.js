(() => {
  "use strict";

  const contract = window.KhaemenesCourseEntryContract;
  const html = document.documentElement;
  const courseId = html.dataset.mathCourseId || "";
  const readinessKey = html.dataset.mathReadinessKey || "";
  const entryMode = html.dataset.mathEntry || "course";
  const evidenceKey = html.dataset.mathEvidenceKey || "";
  const evidencePath = html.dataset.mathEvidencePath || "";
  const prefixes = (html.dataset.mathStoragePrefixes || "").split(",").map(x => x.trim()).filter(Boolean);
  const academyHref = "https://vervenveda.com/Khaemenes_Academy.github.io/";

  const raw = {
    get: Storage.prototype.getItem,
    set: Storage.prototype.setItem,
    remove: Storage.prototype.removeItem
  };
  const claimPrefix = `__khaemenes_legacy_claim_v1:${encodeURIComponent(courseId)}:`;
  const parseLegacy = value => {
    try { return JSON.parse(value || "null"); } catch { return null; }
  };
  const claimKey = base => `${claimPrefix}${encodeURIComponent(base)}`;
  const learnerTarget = (base, profile) => contract.scopedKey(base, profile);

  function migrateLegacy(base, profile) {
    const target = learnerTarget(base, profile);
    if (raw.get.call(localStorage, target) !== null) return target;
    const claim = parseLegacy(raw.get.call(localStorage, claimKey(base)));
    if (claim && claim.learnerId !== profile.learnerId) return null;
    if (!claim) {
      const legacy = raw.get.call(localStorage, base);
      if (legacy !== null) {
        raw.set.call(
          localStorage,
          claimKey(base),
          JSON.stringify({
            version: 1,
            learnerId: profile.learnerId,
            claimed_at: new Date().toISOString()
          })
        );
        raw.set.call(localStorage, target, legacy);
      }
    }
    return target;
  }

  const scoped = key => {
    if (!key || key.includes(":learner:")) return key;
    const learnerScoped = key === "khaemenes-high-pinned-courses-v2" ||
      prefixes.some(prefix => key === prefix || key.startsWith(prefix));
    if (!learnerScoped) return key;
    const profile = contract?.readAcademyProfile?.();
    return profile ? migrateLegacy(key, profile) : null;
  };
  Storage.prototype.getItem = function(key) {
    const target = scoped(String(key));
    return target === null ? null : raw.get.call(this, target);
  };
  Storage.prototype.setItem = function(key, value) {
    const target = scoped(String(key));
    if (target !== null) raw.set.call(this, target, value);
  };
  Storage.prototype.removeItem = function(key) {
    const target = scoped(String(key));
    if (target !== null) raw.remove.call(this, target);
  };
  function parse(value) { try { return JSON.parse(value || "null"); } catch { return null; } }
  function readScoped(base, profile) {
    if (!profile || !base) return null;
    try {
      const target = migrateLegacy(base, profile);
      return target === null ? null : parseLegacy(raw.get.call(localStorage, target));
    } catch { return null; }
  }
  function number(value) {
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 && n <= 100 ? n : null;
  }
  function extractScore(value) {
    if (!value || typeof value !== "object") return null;
    const preferred = ["overall_percent", "overallPercent", "percent", "percentage", "score", "bestScore", "best_score"];
    for (const key of preferred) {
      const n = number(value[key]);
      if (n !== null) return n;
    }
    if (Array.isArray(value.attempts)) {
      for (const attempt of [...value.attempts].reverse()) {
        const n = extractScore(attempt);
        if (n !== null) return n;
      }
    }
    for (const child of Object.values(value)) {
      const n = extractScore(child);
      if (n !== null) return n;
    }
    return null;
  }
  function publishReadiness() {
    if (entryMode !== "diagnostic" || !readinessKey || !evidenceKey || !contract) return;
    const profile = contract.readAcademyProfile?.();
    const evidence = readScoped(evidenceKey, profile);
    const score = extractScore(evidencePath ? evidence?.[evidencePath] : evidence);
    if (!profile || score === null) return;
    const signature = `${profile.learnerId}:${evidence?.[evidencePath]?.attempts?.length || evidence?.attempts?.length || "one"}:${score}`;
    if (publishReadiness.last === signature) return;
    publishReadiness.last = signature;
    try {
      contract.writeJSON(readinessKey, {
        schema: "khaemenes-course-readiness-v1",
        version: 1,
        course_id: courseId,
        source: "math-diagnostic",
        submitted_at: new Date().toISOString(),
        overall_percent: score,
        strand_scores: { overall: { percent: score, source: "diagnostic" } },
        route: contract.routeFor(score, { overall: score }, ["overall"]),
        trust: { classification: "browser-local-self-scored", authoritative: false, editable_storage: true }
      }, profile);
      window.dispatchEvent(new CustomEvent("khaemenes:math-readiness-saved", { detail: { courseId, score } }));
    } catch {}
  }

  function decision() {
    const profile = contract?.readAcademyProfile?.();
    if (!profile) return { allow: false, title: "Choose your learner", message: "Select your learner in the Academy Family Portal before opening this mathematics course. Course records stay separated by Academy learner.", href: academyHref, label: "Return to Academy sign-in" };
    if (entryMode === "diagnostic") return { allow: true, profile };
    const readiness = contract.readJSON(readinessKey, null, profile);
    const latest = contract.latest(readiness);
    if (contract.readinessIsValid(latest, courseId) && latest.route === "advance") return { allow: true, profile, pathway: "core" };
    if (contract.readinessIsValid(latest, courseId) && latest.route === "advance_with_targeted_refresh") return { allow: true, profile, pathway: "supported" };
    const evidence = readScoped(evidenceKey, profile);
    if (!contract.readinessIsValid(latest, courseId) && evidence && extractScore(evidencePath ? evidence?.[evidencePath] : evidence) !== null) return { allow: true, profile, pathway: "returning_learner" };
    if (latest?.route === "unit_0_refresher") return { allow: false, title: "Continue your mathematics readiness", message: "This result recommends a targeted prerequisite refresh before the official course sequence. Work at your own pace; there is no deadline.", href: html.dataset.mathDiagnosticHref || "diagnostic/", label: "Open readiness diagnostic" };
    return { allow: false, title: "Begin with mathematics readiness", message: "Complete the low-stakes readiness check first. It keeps the course path and saved work tied to the selected Academy learner.", href: html.dataset.mathDiagnosticHref || "diagnostic/", label: "Open readiness diagnostic" };
  }

  function mount(result) {
    if (result.allow) { html.dataset.mathEntryOpen = "true"; return; }
    html.dataset.mathEntryBlocked = "true";
    const gate = document.createElement("section");
    gate.setAttribute("role", "dialog"); gate.setAttribute("aria-modal", "true"); gate.setAttribute("aria-labelledby", "mathEntryTitle");
    gate.style.cssText = "position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:20px;background:rgba(7,14,24,.96);color:#f7f2e8";
    const card = document.createElement("article"); card.style.cssText = "width:min(640px,100%);padding:26px;border:1px solid #d8b45f;border-radius:12px;background:#151d28;font:400 16px/1.6 system-ui,sans-serif";
    const title = document.createElement("h1"); title.id = "mathEntryTitle"; title.textContent = result.title; title.style.cssText = "margin:0 0 12px;font:400 1.65rem/1.2 system-ui,sans-serif";
    const text = document.createElement("p"); text.textContent = result.message;
    const open = document.createElement("a"); open.href = result.href; open.textContent = result.label; open.style.cssText = "display:inline-block;padding:11px 15px;border:1px solid #d8b45f;border-radius:8px;color:#f7f2e8;text-decoration:none";
    const home = document.createElement("a"); home.href = academyHref; home.textContent = "Academy sign-in"; home.style.cssText = "display:inline-block;margin-left:10px;padding:11px 15px;border:1px solid #75879a;border-radius:8px;color:#f7f2e8;text-decoration:none";
    card.append(title, text, open, home); gate.append(card);
    document.querySelectorAll("body > :not(script)").forEach(node => { node.inert = true; });
    document.body.append(gate); open.focus();
  }

  window.KhaemenesMathEntry = Object.freeze({ decision, publishReadiness, scopedKey: scoped });
  if (entryMode === "diagnostic") {
    publishReadiness();
    window.addEventListener("storage", publishReadiness);
    window.setInterval(publishReadiness, 500);
  }
  const run = () => mount(decision());
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, { once: true }); else run();
})();
