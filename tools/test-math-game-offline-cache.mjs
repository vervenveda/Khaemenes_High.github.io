import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const script = fs.readFileSync("service-worker.js", "utf8");
const registry = JSON.parse(fs.readFileSync("courses/mathematics/assets/learning-games/game-registry.json", "utf8"));
new vm.Script(script, { filename: "service-worker.js" });
const host = "https://academy.example/Khaemenes_High.github.io/";
const gamePaths = Object.values(registry.games).map(game => "./" + game.canonical_path);
assert.equal(gamePaths.length, 48, "canonical shared game count");

function boot({failCritical = false} = {}) {
  const events = {}, namedCaches = new Map(), fetched = [], call = { skipWaiting: 0, claim: 0, addAll: 0 };
  class Request {
    constructor(input, options = {}) {
      this.url = new URL(typeof input === "string" ? input : input.url, host).href;
      this.cache = options.cache || "default";
      this.mode = options.mode || "navigate";
      this.method = options.method || "GET";
    }
  }
  const normalize = input => new URL(typeof input === "string" ? input : input.url, host).href;
  const cache = {
    stored: new Map(),
    async addAll(requests) {
      call.addAll++;
      if (failCritical) throw Error("Simulated missing canonical asset");
      for (const request of requests) this.stored.set(normalize(request), {
        url: normalize(request), source: "precache"
      });
    },
    async add(request) {
      this.stored.set(normalize(request), { url: normalize(request), source: "precache" });
    },
    async put(request, response) {
      this.stored.set(normalize(request), response);
    },
    async match(request) { return this.stored.get(normalize(request)); }
  };
  const caches = {
    async open(key) {
      if (!namedCaches.has(key)) namedCaches.set(key, cache);
      return namedCaches.get(key);
    },
    async keys() { return [...namedCaches.keys()]; },
    async delete(key) { return namedCaches.delete(key); }
  };
  const self = {
    location: { origin: new URL(host).origin },
    addEventListener(name, fn) { events[name] = fn; },
    async skipWaiting() { call.skipWaiting++; },
    clients: { async claim() { call.claim++; } }
  };
  const context = vm.createContext({
    self, Request, URL, caches, console, Promise,
    fetch: async request => {
      fetched.push(request.url);
      throw Error("Simulated offline");
    }
  });
  vm.runInContext(script, context, { timeout: 4000 });
  const evaluate = expression => vm.runInContext(expression, context, { timeout: 500 });
  return { events, cache, context, evaluate, Request, host, call, fetched };
}
async function install(instance) {
  let pending;
  instance.events.install({ waitUntil(promise) { pending = promise; } });
  assert.ok(pending, "service worker install registered");
  await pending;
}
const worker = boot();
const actualGames = Array.from(worker.evaluate("GAME_PRECACHE_FILES"));
const runtime = Array.from(worker.evaluate("GAME_RUNTIME_FILES"));
const everything = Array.from(worker.evaluate("PRECACHE_FILES"));
const expected = new Set(gamePaths);
assert.equal(new Set(actualGames).size, actualGames.length, "canonical game paths unique");
assert.deepEqual(actualGames.slice().sort(), gamePaths.slice().sort(), "precache matches canonical registry");
assert.equal(runtime.length, 7, "core game runtime dependencies");
assert.ok(runtime.includes("./courses/mathematics/assets/shared-game-launcher.js"));
assert.ok(runtime.includes("./courses/mathematics/pre-algebra/assets/prealgebra-game-spotlight-v1.js"));
assert.ok(runtime.includes("./courses/mathematics/assets/game-return-route.js"));
assert.ok(runtime.includes("./courses/shared/learner-scope-v1.js"));
assert.ok(runtime.includes("./courses/shared/course-entry-contract.js"));
assert.ok(runtime.includes("./courses/mathematics/assets/learning-games/round-policy.js"));
assert.ok(runtime.includes("./courses/mathematics/assets/learning-games/game-registry.json"));
assert.equal(new Set(everything).size, everything.length, "no duplicate precache requests");

for (const file of [...actualGames, ...runtime]) {
  assert.ok(fs.existsSync(file), "critical offline file must exist: " + file);
  assert.ok(everything.includes(file), "critical file missing from release cache: " + file);
  assert.ok(!worker.evaluate("shouldNeverCache(new URL(" + JSON.stringify(new URL(file,host).href) + "))"),
    "critical file must not be teacher-only: " + file);
}
for (const file of everything) {
  assert.ok(!/teacher(?:\/|$)|teacher-guide|teacher-keys|answer[-_]?key/i.test(file),
    "teacher-only file must not be precached: " + file);
}
await install(worker);
assert.equal(worker.call.addAll, 1, "critical games installed atomically");
assert.equal(worker.call.skipWaiting, 1, "successfully installed worker activates");
for (const path of [...actualGames, ...runtime]) {
  assert.ok(worker.cache.stored.has(new URL(path, host).href),
    "installed worker must contain: " + path);
}
async function offlineNavigate(url) {
  let promise;
  const request = new worker.Request(url, { mode: "navigate" });
  worker.events.fetch({
    request,
    respondWith(p) { promise = p; }
  });
  assert.ok(promise, "navigation handled by service worker");
  return await promise;
}
for (const game of ["unit-circle-navigator", "trigonometric-wave-studio",
  "trigonometric-identity-forge", "triangle-law-expedition",
  "coordinated-mission-control", "integer-compass"]) {
  const prefix = host + "courses/mathematics/assets/learning-games/" + game + "/";
  const regular = await offlineNavigate(prefix + "index.html?course=algebra2&unit=11&lesson=u11-l08&mode=navigation");
  const directory = await offlineNavigate(prefix + "?course=algebra2&lesson=u11-l08");
  assert.equal(regular?.url, prefix + "index.html", game + " offline query canonicalized");
  assert.equal(directory?.url, prefix + "index.html", game + " offline directory canonicalized");
}
assert.ok(worker.fetched.length>=12, "network was genuinely unavailable");
const invalid = boot({failCritical:true});
await assert.rejects(install(invalid), /Simulated missing canonical asset/,
  "worker should not activate when a required math game cannot install");
assert.equal(invalid.call.skipWaiting, 0, "failed offline bundle cannot replace the working release");
console.log("PASS: all " + actualGames.length +
 " canonical math games and " + runtime.length +
 " runtime files precached atomically; " + everything.length +
 " unique release assets; lesson-query and directory URLs work offline; missing critical file aborts install.");
