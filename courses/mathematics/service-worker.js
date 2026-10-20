"use strict";
const CACHE_PREFIX="khaemenes-math-shared-resources-";
const CACHE_NAME=CACHE_PREFIX+"v2-20261020";
const GAME_FILES=[
  "./",
  "./index.html",
  "./assets/shared-game-launcher.js",
  "./assets/learning-games/game-registry.json",
  "./assets/learning-games/number-family/index.html",
  "./assets/learning-games/factors-and-multiples/index.html",
  "./assets/learning-games/prime-spy-composite/index.html",
  "./assets/learning-games/gcf-lcm-challenge/index.html",
  "./assets/learning-games/operation-stepper/index.html",
  "./assets/learning-games/estimate-defender/index.html",
  "./assets/learning-games/integer-compass/index.html",
  "./assets/learning-games/opposite-mirror/index.html",
  "./assets/learning-games/integer-rank/index.html",
  "./assets/learning-games/integer-sum-lab/index.html",
  "./assets/learning-games/opposite-shift/index.html",
  "./assets/learning-games/sign-forge/index.html",
  "./assets/learning-games/dividing-integers/index.html",
  "./assets/learning-games/coordinated-mission-control/index.html",
  "./assets/learning-games/common-ground/index.html",
  "./assets/learning-games/decimal-signal/index.html",
  "./assets/learning-games/fraction-forge/index.html",
  "./assets/learning-games/fraction-quotient/index.html",
  "./assets/learning-games/group-or-cycle/index.html",
  "./assets/learning-games/ratio-atelier/index.html",
  "./assets/learning-games/rational-navigator/index.html",
  "./assets/learning-games/rational-rank/index.html",
  "./assets/learning-games/reciprocal-relay/index.html",
  "./assets/learning-games/scale-forge/index.html",
  "./assets/learning-games/equation-balance-lab/index.html",
  "./assets/learning-games/inequality-number-line/index.html",
  "./assets/learning-games/slope-and-rate-studio/index.html",
  "./assets/learning-games/linear-systems-mission/index.html",
  "./assets/learning-games/polynomial-factoring-forge/index.html",
  "./assets/learning-games/quadratic-graph-lab/index.html",
  "./assets/learning-games/proof-path-builder/index.html",
  "./assets/learning-games/transformation-plane/index.html",
  "./assets/learning-games/congruence-similarity-lab/index.html",
  "./assets/learning-games/circle-theorem-studio/index.html",
  "./assets/learning-games/right-triangle-trig/index.html",
  "./assets/learning-games/function-transformation-studio/index.html",
  "./assets/learning-games/exponential-logarithm-lab/index.html",
  "./assets/learning-games/polynomial-zeros-explorer/index.html",
  "./assets/learning-games/matrix-mission-control/index.html",
  "./assets/learning-games/sequence-series-studio/index.html",
  "./assets/learning-games/complex-plane-lab/index.html",
  "./assets/learning-games/statistics-detective/index.html",
  "./assets/learning-games/probability-quest/index.html",
  "./assets/learning-games/unit-circle-navigator/index.html",
  "./assets/learning-games/trigonometric-wave-studio/index.html",
  "./assets/learning-games/trigonometric-identity-forge/index.html",
  "./assets/learning-games/triangle-law-expedition/index.html",
  "./assets/learning-games/algebra-evidence-interval-lab/index.html",
  "./assets/learning-games/exponent-pattern-explorer/index.html",
  "./assets/learning-games/exponent-properties-lab/index.html",
  "./assets/learning-games/interest-fees-decision-lab/index.html",
  "./assets/learning-games/irrational-root-estimation-quest/index.html",
  "./assets/learning-games/market-math-mission/index.html",
  "./assets/learning-games/percent-benchmark-studio/index.html",
  "./assets/learning-games/percent-change-mission/index.html",
  "./assets/learning-games/percent-of-quantity-lab/index.html",
  "./assets/learning-games/percent-rate-whole-detective/index.html",
  "./assets/learning-games/percentage-point-change-studio/index.html",
  "./assets/learning-games/perfect-powers-roots-quest/index.html",
  "./assets/learning-games/power-grouping-quest/index.html",
  "./assets/learning-games/proportion-solver-mission/index.html",
  "./assets/learning-games/ratio-table-trail/index.html",
  "./assets/learning-games/scientific-notation-operations-mission/index.html",
  "./assets/learning-games/scientific-notation-signal-lab/index.html",
  "./assets/learning-games/small-business-math-lab/index.html",
  "./assets/learning-games/algebra-reasoning-foundations/index.html",
  "./assets/learning-games/algebra-structure-balance-challenge/index.html",
  "./assets/learning-games/algebra-functions-systems-challenge/index.html",
  "./assets/learning-games/algebra-exponents-radicals-challenge/index.html",
  "./assets/learning-games/algebra-evidence-modelling-challenge/index.html",
  "./assets/learning-games/algebra-language-lab/index.html",
  "./assets/learning-games/expression-translator-studio/index.html",
  "./assets/learning-games/equivalence-forge/index.html",
  "./assets/learning-games/angle-polygon-studio/index.html",
  "./assets/learning-games/boundary-area-lab/index.html",
  "./assets/learning-games/pythagorean-distance-mission/index.html",
  "./assets/learning-games/surface-volume-studio/index.html",
  "./assets/learning-games/piecewise-boundary-lab/index.html",
  "./assets/learning-games/geometry-foundations-sort/index.html",
  "./assets/learning-games/quadrilateral-detective/index.html",
  "./assets/learning-games/polygon-design-lab/index.html",
  "./assets/learning-games/geometric-probability-lab/index.html"
];

const VIDEO_FILES=[
  "./assets/video-library/number-systems.json",
  "./assets/video-library/order-of-operations.json",
  "./assets/video-library/solving-linear-equations.json",
  "./assets/video-library/linear-inequalities-introduction.json",
  "./assets/video-library/evaluating-functions-introduction.json",
  "./assets/video-library/slope-formula.json",
  "./assets/video-library/systems-elimination-substitution.json",
  "./assets/video-library/factoring-trinomials-introduction.json",
  "./assets/video-library/quadratic-equations-factoring.json",
  "./assets/video-library/transversal-angles-khan.json",
  "./assets/video-library/scale-drawings-khan.json",
  "./assets/video-library/pythagorean-mathantics.json",
  "./assets/video-library/area-mathantics.json",
  "./assets/video-library/surface-area-nets-khan.json",
  "./assets/video-library/geometry-two-column-proof-khan.json",
  "./assets/video-library/geometric-transformations-organic.json",
  "./assets/video-library/right-triangle-trig-organic.json",
  "./assets/video-library/circles-geometry-organic.json",
  "./assets/video-library/triangular-prism-volume-organic.json",
  "./assets/video-library/angle-bisector-construction-khan.json",
  "./assets/video-library/triangle-congruence-organic.json",
  "./assets/video-library/similar-triangles-organic.json",
  "./assets/video-library/circle-tangent-secant-organic.json",
  "./assets/video-library/circle-tangent-angle-theorems-organic.json",
  "./assets/video-library/triangle-centers-organic.json",
  "./assets/video-library/circle-central-inscribed-overview-organic.json",
  "./assets/video-library/circle-power-theorems-organic.json",
  "./assets/video-library/solid-cross-sections-emath.json",
  "./assets/video-library/hl-postulate-organic.json",
  "./assets/video-library/circle-standard-equation-khan.json",
  "./assets/video-library/volume-pyramid-organic.json",
  "./assets/video-library/volume-cone-organic.json",
  "./assets/video-library/volume-sphere-organic.json",
  "./assets/video-library/cpctc-proofs-organic.json",
  "./assets/video-library/3d-volume-scaling-khan.json",
  "./assets/video-library/functions-introduction.json",
  "./assets/video-library/parent-functions-transformations-organic.json",
  "./assets/video-library/solving-logarithmic-equations-organic.json",
  "./assets/video-library/conditional-probability-independence-khan.json",
  "./assets/video-library/rational-functions-asymptotes-holes-organic.json",
  "./assets/video-library/geometric-series-introduction-khan.json",
  "./assets/video-library/trig-equations-multiple-angles-organic.json",
  "./assets/video-library/law-of-cosines-organic.json",
  "./assets/video-library/normal-distribution-introduction-khan.json",
  "./assets/video-library/matrix-row-operations-organic.json",
  "./assets/video-library/infinite-geometric-series-khan.json",
  "./assets/video-library/complex-numbers-basic-operations-organic.json",
  "./assets/video-library/polynomial-long-division-organic.json",
  "./assets/video-library/synthetic-division-polynomials-organic.json",
  "./assets/video-library/exponential-growth-decay-organic.json",
  "./assets/video-library/rational-zero-theorem-organic.json",
  "./assets/video-library/solving-exponential-equations-organic.json",
  "./assets/video-library/matrix-inverse-row-reduction-organic.json",
  "./assets/video-library/sigma-notation-sums-khan.json",
  "./assets/video-library/law-of-sines-ambiguous-case-organic.json",
  "./assets/video-library/polynomial-multiplicity-graph-organic.json",
  "./assets/video-library/determinant-3x3-organic.json",
  "./assets/video-library/binomial-theorem-khan-india.json",
  "./assets/video-library/pythagorean-identities-organic.json",
  "./assets/video-library/zscore-comparison-khan.json"
];
const SHARED_FILES=[...new Set([...GAME_FILES,...VIDEO_FILES])];

self.addEventListener("install",event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    await cache.addAll(SHARED_FILES.map(path=>new Request(path,{cache:"reload"})));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE_NAME).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

function isSharedMathResource(url){
  return url.origin===self.location.origin &&
    (url.pathname.includes("/courses/mathematics/assets/learning-games/") ||
     url.pathname.includes("/courses/mathematics/assets/video-library/") ||
     url.pathname.endsWith("/courses/mathematics/assets/shared-game-launcher.js") ||
     url.pathname.endsWith("/courses/mathematics/assets/video-companion-v1.js"));
}

self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET")return;
  const url=new URL(request.url);
  if(!isSharedMathResource(url))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    const hit=await cache.match(request,{ignoreSearch:true});
    if(hit)return hit;
    try{
      const response=await fetch(request);
      if(response&&response.ok)await cache.put(request,response.clone());
      return response;
    }catch{
      return Response.error();
    }
  })());
});
