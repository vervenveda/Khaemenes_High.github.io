(() => {
  "use strict";

  const script = document.currentScript;
  const scope = script?.dataset?.learnerScope || "";
  const configs = {
    "pre-algebra": {
      prefixes: [
        "KHAE_OPEN_PREALGEBRA_FORGE_V2",
        "KHAE_MATH9_PREALGEBRA_",
        "khaemenes-naib-",
        "khaemenes-prealgebra-",
        "khaemenes-grade09-last-open-v1"
      ]
    }
  };
  const config = configs[scope];
  if (!config || typeof Storage === "undefined" || !window.localStorage) return;

  const raw = {
    get: Storage.prototype.getItem,
    set: Storage.prototype.setItem,
    remove: Storage.prototype.removeItem
  };
  const claimPrefix = `__khaemenes_learner_scope_v1:${encodeURIComponent(scope)}:`;
  const parse = value => {
    try { return JSON.parse(value || "null"); } catch { return null; }
  };
  const profile = () => {
    try {
      return window.KhaemenesCourseEntryContract?.readAcademyProfile?.() || null;
    } catch { return null; }
  };
  const matches = key => config.prefixes.some(prefix => key === prefix || key.startsWith(prefix));
  const claimKey = base => `${claimPrefix}${encodeURIComponent(base)}`;
  const learnerKey = (base, learnerId) => `${base}:learner:${encodeURIComponent(learnerId)}`;

  function readTarget(base, learner) {
    const target = learnerKey(base, learner.learnerId);
    if (raw.get.call(window.localStorage, target) !== null) return target;

    const claim = parse(raw.get.call(window.localStorage, claimKey(base)));
    const legacyOwner = claim?.legacyLearnerId || claim?.learnerId || null;
    if (legacyOwner && legacyOwner !== learner.learnerId) return null;

    if (!claim) {
      const legacy = raw.get.call(window.localStorage, base);
      if (legacy !== null) {
        raw.set.call(
          window.localStorage,
          claimKey(base),
          JSON.stringify({
            version: 1,
            legacyLearnerId: learner.learnerId,
            learners: [learner.learnerId],
            claimed_at: new Date().toISOString()
          })
        );
        raw.set.call(window.localStorage, target, legacy);
      }
    }
    return target;
  }

  function writeTarget(base, learner) {
    const target = learnerKey(base, learner.learnerId);
    const key = claimKey(base);
    const claim = parse(raw.get.call(window.localStorage, key)) || {
      version: 1,
      legacyLearnerId: null,
      learners: []
    };
    claim.learners = Array.isArray(claim.learners) ? claim.learners : [];
    if (!claim.learners.includes(learner.learnerId)) claim.learners.push(learner.learnerId);
    raw.set.call(window.localStorage, key, JSON.stringify(claim));
    return target;
  }

  function targetForKey(key, mode) {
    const base = String(key);
    if (!matches(base)) return base;
    const learner = profile();
    if (!learner) return base;
    return mode === "write" ? writeTarget(base, learner) : readTarget(base, learner);
  }

  Storage.prototype.getItem = function(key) {
    const target = targetForKey(key, "read");
    return target === null ? null : raw.get.call(this, target);
  };

  Storage.prototype.setItem = function(key, value) {
    const target = targetForKey(key, "write");
    raw.set.call(this, target, value);
  };

  Storage.prototype.removeItem = function(key) {
    const target = targetForKey(key, "write");
    raw.remove.call(this, target);
  };

  window.KhaemenesLearnerScope = Object.freeze({
    version: 1,
    course: scope,
    profile,
    scopedKey(base) {
      const learner = profile();
      return learner && matches(String(base))
        ? readTarget(String(base), learner) || learnerKey(String(base), learner.learnerId)
        : String(base);
    }
  });
})();
