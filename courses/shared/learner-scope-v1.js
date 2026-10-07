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

  function targetFor(base, learner) {
    const target = learnerKey(base, learner.learnerId);
    if (raw.get.call(window.localStorage, target) !== null) return target;

    const claim = parse(raw.get.call(window.localStorage, claimKey(base)));
    if (claim && claim.learnerId !== learner.learnerId) return null;

    if (!claim) {
      const legacy = raw.get.call(window.localStorage, base);
      if (legacy !== null) {
        raw.set.call(
          window.localStorage,
          claimKey(base),
          JSON.stringify({
            version: 1,
            learnerId: learner.learnerId,
            claimed_at: new Date().toISOString()
          })
        );
        raw.set.call(window.localStorage, target, legacy);
      }
    }
    return target;
  }

  function targetForKey(key) {
    const base = String(key);
    if (!matches(base)) return base;
    const learner = profile();
    return learner ? targetFor(base, learner) : base;
  }

  function ensureClaim(base, learner) {
    const key = claimKey(base);
    if (raw.get.call(window.localStorage, key) === null) {
      raw.set.call(
        window.localStorage,
        key,
        JSON.stringify({
          version: 1,
          learnerId: learner.learnerId,
          claimed_at: new Date().toISOString()
        })
      );
    }
  }

  Storage.prototype.getItem = function(key) {
    const target = targetForKey(key);
    return target === null ? null : raw.get.call(this, target);
  };

  Storage.prototype.setItem = function(key, value) {
    const base = String(key);
    const target = targetForKey(base);
    if (target === null) return;
    const learner = matches(base) ? profile() : null;
    if (learner) ensureClaim(base, learner);
    raw.set.call(this, target, value);
  };

  Storage.prototype.removeItem = function(key) {
    const target = targetForKey(key);
    if (target !== null) raw.remove.call(this, target);
  };

  window.KhaemenesLearnerScope = Object.freeze({
    version: 1,
    course: scope,
    profile,
    scopedKey(base) {
      const learner = profile();
      return learner && matches(String(base))
        ? targetFor(String(base), learner)
        : String(base);
    }
  });
})();
