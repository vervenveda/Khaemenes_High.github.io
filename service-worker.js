"use strict";

const CACHE_VERSION = "khaemenes-high-v36-five-algebra-formative-games-20261014";
// Generated from canonical game-registry.json; validated by tools/test-math-game-offline-cache.mjs.
// Every canonical game and its shared runtime must be available on a newly installed offline worker.
const GAME_PRECACHE_FILES = [
  "./courses/mathematics/assets/learning-games/algebra-evidence-modelling-challenge/index.html",
  "./courses/mathematics/assets/learning-games/algebra-exponents-radicals-challenge/index.html",
  "./courses/mathematics/assets/learning-games/algebra-functions-systems-challenge/index.html",
  "./courses/mathematics/assets/learning-games/algebra-reasoning-foundations/index.html",
  "./courses/mathematics/assets/learning-games/algebra-structure-balance-challenge/index.html",

  "./courses/mathematics/assets/learning-games/number-family/index.html",
  "./courses/mathematics/assets/learning-games/factors-and-multiples/index.html",
  "./courses/mathematics/assets/learning-games/prime-spy-composite/index.html",
  "./courses/mathematics/assets/learning-games/gcf-lcm-challenge/index.html",
  "./courses/mathematics/assets/learning-games/operation-stepper/index.html",
  "./courses/mathematics/assets/learning-games/estimate-defender/index.html",
  "./courses/mathematics/assets/learning-games/integer-compass/index.html",
  "./courses/mathematics/assets/learning-games/opposite-mirror/index.html",
  "./courses/mathematics/assets/learning-games/integer-rank/index.html",
  "./courses/mathematics/assets/learning-games/integer-sum-lab/index.html",
  "./courses/mathematics/assets/learning-games/opposite-shift/index.html",
  "./courses/mathematics/assets/learning-games/sign-forge/index.html",
  "./courses/mathematics/assets/learning-games/dividing-integers/index.html",
  "./courses/mathematics/assets/learning-games/coordinated-mission-control/index.html",
  "./courses/mathematics/assets/learning-games/common-ground/index.html",
  "./courses/mathematics/assets/learning-games/decimal-signal/index.html",
  "./courses/mathematics/assets/learning-games/fraction-forge/index.html",
  "./courses/mathematics/assets/learning-games/fraction-quotient/index.html",
  "./courses/mathematics/assets/learning-games/group-or-cycle/index.html",
  "./courses/mathematics/assets/learning-games/ratio-atelier/index.html",
  "./courses/mathematics/assets/learning-games/rational-navigator/index.html",
  "./courses/mathematics/assets/learning-games/rational-rank/index.html",
  "./courses/mathematics/assets/learning-games/reciprocal-relay/index.html",
  "./courses/mathematics/assets/learning-games/scale-forge/index.html",
  "./courses/mathematics/assets/learning-games/equation-balance-lab/index.html",
  "./courses/mathematics/assets/learning-games/inequality-number-line/index.html",
  "./courses/mathematics/assets/learning-games/slope-and-rate-studio/index.html",
  "./courses/mathematics/assets/learning-games/linear-systems-mission/index.html",
  "./courses/mathematics/assets/learning-games/polynomial-factoring-forge/index.html",
  "./courses/mathematics/assets/learning-games/quadratic-graph-lab/index.html",
  "./courses/mathematics/assets/learning-games/proof-path-builder/index.html",
  "./courses/mathematics/assets/learning-games/transformation-plane/index.html",
  "./courses/mathematics/assets/learning-games/congruence-similarity-lab/index.html",
  "./courses/mathematics/assets/learning-games/circle-theorem-studio/index.html",
  "./courses/mathematics/assets/learning-games/right-triangle-trig/index.html",
  "./courses/mathematics/assets/learning-games/function-transformation-studio/index.html",
  "./courses/mathematics/assets/learning-games/exponential-logarithm-lab/index.html",
  "./courses/mathematics/assets/learning-games/polynomial-zeros-explorer/index.html",
  "./courses/mathematics/assets/learning-games/matrix-mission-control/index.html",
  "./courses/mathematics/assets/learning-games/sequence-series-studio/index.html",
  "./courses/mathematics/assets/learning-games/complex-plane-lab/index.html",
  "./courses/mathematics/assets/learning-games/statistics-detective/index.html",
  "./courses/mathematics/assets/learning-games/probability-quest/index.html",
  "./courses/mathematics/assets/learning-games/unit-circle-navigator/index.html",
  "./courses/mathematics/assets/learning-games/trigonometric-wave-studio/index.html",
  "./courses/mathematics/assets/learning-games/trigonometric-identity-forge/index.html",
  "./courses/mathematics/assets/learning-games/triangle-law-expedition/index.html",
  "./courses/mathematics/assets/learning-games/algebra-evidence-interval-lab/index.html",
  "./courses/mathematics/assets/learning-games/exponent-pattern-explorer/index.html",
  "./courses/mathematics/assets/learning-games/exponent-properties-lab/index.html",
  "./courses/mathematics/assets/learning-games/interest-fees-decision-lab/index.html",
  "./courses/mathematics/assets/learning-games/irrational-root-estimation-quest/index.html",
  "./courses/mathematics/assets/learning-games/market-math-mission/index.html",
  "./courses/mathematics/assets/learning-games/percent-benchmark-studio/index.html",
  "./courses/mathematics/assets/learning-games/percent-change-mission/index.html",
  "./courses/mathematics/assets/learning-games/percent-of-quantity-lab/index.html",
  "./courses/mathematics/assets/learning-games/percent-rate-whole-detective/index.html",
  "./courses/mathematics/assets/learning-games/percentage-point-change-studio/index.html",
  "./courses/mathematics/assets/learning-games/perfect-powers-roots-quest/index.html",
  "./courses/mathematics/assets/learning-games/power-grouping-quest/index.html",
  "./courses/mathematics/assets/learning-games/proportion-solver-mission/index.html",
  "./courses/mathematics/assets/learning-games/ratio-table-trail/index.html",
  "./courses/mathematics/assets/learning-games/scientific-notation-operations-mission/index.html",
  "./courses/mathematics/assets/learning-games/scientific-notation-signal-lab/index.html",
  "./courses/mathematics/assets/learning-games/small-business-math-lab/index.html",
];
const GAME_RUNTIME_FILES = [
  "./courses/mathematics/assets/game-return-route.js",
  "./courses/mathematics/assets/shared-game-launcher.js",
  "./courses/mathematics/pre-algebra/assets/prealgebra-game-spotlight-v1.js",
  "./courses/mathematics/assets/learning-games/round-policy.js",
  "./courses/shared/course-entry-contract.js",
  "./courses/shared/learner-scope-v1.js",
  "./courses/mathematics/assets/learning-games/game-registry.json",
];
// Legacy Pre-Algebra/course pages are kept, with duplicate entries removed.
const OTHER_PRECACHE_FILES = [
  "./courses/shared/upper-english-records.js",
  "./assets/vervenveda-parchment.css",
  "./index.html",
  "./README.md",
  "./LICENSE",
  "./SECURITY.md",
  "./CONTRIBUTING.md",
  "./manifest.webmanifest",
  "./grades/grade-09/",
  "./grades/grade-09/index.html",
  "./grades/grade-09/course-catalog.json",
  "./grades/grade-09/planner.json",
  "./courses/mathematics/pre-algebra/",
  "./courses/mathematics/pre-algebra/index.html",
  "./courses/mathematics/pre-algebra/course-ui.css",
  "./courses/mathematics/pre-algebra/course-map.json",
  "./courses/mathematics/pre-algebra/diagnostic/",
  "./courses/mathematics/pre-algebra/diagnostic/index.html",
  "./courses/mathematics/pre-algebra/units/unit-01/",
  "./courses/mathematics/pre-algebra/units/unit-01/README.md",
  "./courses/mathematics/pre-algebra/units/unit-01/assessment/mastery-check.html",
  "./courses/mathematics/pre-algebra/units/unit-01/assets/assessment-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-01/assets/lesson-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-01/assets/unit-dashboard.js",
  "./courses/mathematics/pre-algebra/units/unit-01/assets/unit.css",
  "./courses/mathematics/pre-algebra/units/unit-01/family-guide.html",
  "./courses/mathematics/pre-algebra/units/unit-01/index.html",
  "./courses/mathematics/pre-algebra/units/unit-01/lessons/lesson-01-number-systems.html",
  "./courses/mathematics/pre-algebra/units/unit-01/lessons/lesson-02-factors-multiples.html",
  "./courses/mathematics/pre-algebra/units/unit-01/lessons/lesson-03-primes-divisibility.html",
  "./courses/mathematics/pre-algebra/units/unit-01/lessons/lesson-04-gcf-lcm.html",
  "./courses/mathematics/pre-algebra/units/unit-01/lessons/lesson-05-order-operations.html",
  "./courses/mathematics/pre-algebra/units/unit-01/lessons/lesson-06-estimation-reasonableness.html",
  "./courses/mathematics/pre-algebra/units/unit-01/practice/core.html",
  "./courses/mathematics/pre-algebra/units/unit-01/practice/extended.html",
  "./courses/mathematics/pre-algebra/units/unit-01/practice/foundation.html",
  "./courses/mathematics/pre-algebra/units/unit-01/projects/number-systems-investigation.html",
  "./courses/mathematics/pre-algebra/units/unit-01/standards-map.json",
  "./courses/mathematics/pre-algebra/units/unit-01/unit-map.json",
  "./courses/mathematics/pre-algebra/units/unit-01/vocabulary.json",
  "./courses/mathematics/pre-algebra/units/unit-02/",
  "./courses/mathematics/pre-algebra/units/unit-02/README.md",
  "./courses/mathematics/pre-algebra/units/unit-02/assessment/mastery-check.html",
  "./courses/mathematics/pre-algebra/units/unit-02/assets/assessment-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-02/assets/lesson-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-02/assets/unit-dashboard.js",
  "./courses/mathematics/pre-algebra/units/unit-02/assets/unit.css",
  "./courses/mathematics/pre-algebra/units/unit-02/family-guide.html",
  "./courses/mathematics/pre-algebra/units/unit-02/index.html",
  "./courses/mathematics/pre-algebra/units/unit-02/lessons/lesson-01-integers-in-context.html",
  "./courses/mathematics/pre-algebra/units/unit-02/lessons/lesson-02-opposites-absolute-value.html",
  "./courses/mathematics/pre-algebra/units/unit-02/lessons/lesson-03-compare-order-integers.html",
  "./courses/mathematics/pre-algebra/units/unit-02/lessons/lesson-04-adding-integers.html",
  "./courses/mathematics/pre-algebra/units/unit-02/lessons/lesson-05-subtracting-integers.html",
  "./courses/mathematics/pre-algebra/units/unit-02/lessons/lesson-06-multiply-divide-integers.html",
  "./courses/mathematics/pre-algebra/units/unit-02/lessons/lesson-07-coordinate-plane-signed-change.html",
  "./courses/mathematics/pre-algebra/units/unit-02/lessons/lesson-08-multi-step-integer-applications.html",
  "./courses/mathematics/pre-algebra/units/unit-02/practice/core.html",
  "./courses/mathematics/pre-algebra/units/unit-02/practice/extended.html",
  "./courses/mathematics/pre-algebra/units/unit-02/practice/foundation.html",
  "./courses/mathematics/pre-algebra/units/unit-02/projects/signed-data-investigation.html",
  "./courses/mathematics/pre-algebra/units/unit-02/standards-map.json",
  "./courses/mathematics/pre-algebra/units/unit-02/unit-map.json",
  "./courses/mathematics/pre-algebra/units/unit-02/vocabulary.json",
  "./courses/mathematics/pre-algebra/units/unit-03/README.md",
  "./courses/mathematics/pre-algebra/units/unit-03/assessment/mastery-check.html",
  "./courses/mathematics/pre-algebra/units/unit-03/assets/assessment-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-03/assets/lesson-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-03/assets/unit-dashboard.js",
  "./courses/mathematics/pre-algebra/units/unit-03/assets/unit.css",
  "./courses/mathematics/pre-algebra/units/unit-03/family-guide.html",
  "./courses/mathematics/pre-algebra/units/unit-03/index.html",
  "./courses/mathematics/pre-algebra/units/unit-03/lessons/lesson-01-rational-numbers-fraction-meaning.html",
  "./courses/mathematics/pre-algebra/units/unit-03/lessons/lesson-02-equivalent-fractions-simplifying.html",
  "./courses/mathematics/pre-algebra/units/unit-03/lessons/lesson-03-compare-order-rational-numbers.html",
  "./courses/mathematics/pre-algebra/units/unit-03/lessons/lesson-04-add-subtract-rational-numbers.html",
  "./courses/mathematics/pre-algebra/units/unit-03/lessons/lesson-05-multiply-fractions-mixed-numbers.html",
  "./courses/mathematics/pre-algebra/units/unit-03/lessons/lesson-06-divide-fractions-complex-fractions.html",
  "./courses/mathematics/pre-algebra/units/unit-03/lessons/lesson-07-decimal-operations-repeating-decimals.html",
  "./courses/mathematics/pre-algebra/units/unit-03/lessons/lesson-08-conversions-estimation-applications.html",
  "./courses/mathematics/pre-algebra/units/unit-03/practice/core.html",
  "./courses/mathematics/pre-algebra/units/unit-03/practice/extended.html",
  "./courses/mathematics/pre-algebra/units/unit-03/practice/foundation.html",
  "./courses/mathematics/pre-algebra/units/unit-03/projects/rational-quantity-investigation.html",
  "./courses/mathematics/pre-algebra/units/unit-03/standards-map.json",
  "./courses/mathematics/pre-algebra/units/unit-03/unit-map.json",
  "./courses/mathematics/pre-algebra/units/unit-03/vocabulary.json",
  "./courses/mathematics/pre-algebra/units/unit-04/README.md",
  "./courses/mathematics/pre-algebra/units/unit-04/assessment/mastery-check.html",
  "./courses/mathematics/pre-algebra/units/unit-04/assets/assessment-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-04/assets/lesson-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-04/assets/unit-dashboard.js",
  "./courses/mathematics/pre-algebra/units/unit-04/assets/unit.css",
  "./courses/mathematics/pre-algebra/units/unit-04/family-guide.html",
  "./courses/mathematics/pre-algebra/units/unit-04/index.html",
  "./courses/mathematics/pre-algebra/units/unit-04/lessons/lesson-01-ratio-meaning-equivalent-ratios.html",
  "./courses/mathematics/pre-algebra/units/unit-04/lessons/lesson-02-ratio-tables-double-number-lines.html",
  "./courses/mathematics/pre-algebra/units/unit-04/lessons/lesson-03-rates-unit-rates-fair-comparisons.html",
  "./courses/mathematics/pre-algebra/units/unit-04/lessons/lesson-04-proportional-tables-graphs-equations.html",
  "./courses/mathematics/pre-algebra/units/unit-04/lessons/lesson-05-solving-proportions-direct-variation.html",
  "./courses/mathematics/pre-algebra/units/unit-04/lessons/lesson-06-scale-drawings-maps-similar-figures.html",
  "./courses/mathematics/pre-algebra/units/unit-04/lessons/lesson-07-proportional-vs-nonproportional.html",
  "./courses/mathematics/pre-algebra/units/unit-04/lessons/lesson-08-conversions-multistep-proportional-modelling.html",
  "./courses/mathematics/pre-algebra/units/unit-04/practice/core.html",
  "./courses/mathematics/pre-algebra/units/unit-04/practice/extended.html",
  "./courses/mathematics/pre-algebra/units/unit-04/practice/foundation.html",
  "./courses/mathematics/pre-algebra/units/unit-04/projects/community-scale-rate-investigation.html",
  "./courses/mathematics/pre-algebra/units/unit-04/standards-map.json",
  "./courses/mathematics/pre-algebra/units/unit-04/unit-map.json",
  "./courses/mathematics/pre-algebra/units/unit-04/vocabulary.json",
  "./courses/mathematics/pre-algebra/units/unit-05/",
  "./courses/mathematics/pre-algebra/units/unit-05/README.md",
  "./courses/mathematics/pre-algebra/units/unit-05/assessment/mastery-check.html",
  "./courses/mathematics/pre-algebra/units/unit-05/assets/assessment-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-05/assets/lesson-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-05/assets/unit-dashboard.js",
  "./courses/mathematics/pre-algebra/units/unit-05/assets/unit.css",
  "./courses/mathematics/pre-algebra/units/unit-05/family-guide.html",
  "./courses/mathematics/pre-algebra/units/unit-05/index.html",
  "./courses/mathematics/pre-algebra/units/unit-05/lessons/lesson-01-percent-meaning-benchmarks-equivalent-forms.html",
  "./courses/mathematics/pre-algebra/units/unit-05/lessons/lesson-02-finding-percent-of-quantity.html",
  "./courses/mathematics/pre-algebra/units/unit-05/lessons/lesson-03-finding-percent-rate-or-whole.html",
  "./courses/mathematics/pre-algebra/units/unit-05/lessons/lesson-04-percent-increase-decrease-relative-change.html",
  "./courses/mathematics/pre-algebra/units/unit-05/lessons/lesson-05-discounts-tax-tips-commission.html",
  "./courses/mathematics/pre-algebra/units/unit-05/lessons/lesson-06-markup-profit-loss-break-even.html",
  "./courses/mathematics/pre-algebra/units/unit-05/lessons/lesson-07-simple-interest-fees-financial-comparisons.html",
  "./courses/mathematics/pre-algebra/units/unit-05/lessons/lesson-08-percentage-points-repeated-change-decisions.html",
  "./courses/mathematics/pre-algebra/units/unit-05/practice/core.html",
  "./courses/mathematics/pre-algebra/units/unit-05/practice/extended.html",
  "./courses/mathematics/pre-algebra/units/unit-05/practice/foundation.html",
  "./courses/mathematics/pre-algebra/units/unit-05/projects/consumer-financial-decision-investigation.html",
  "./courses/mathematics/pre-algebra/units/unit-05/standards-map.json",
  "./courses/mathematics/pre-algebra/units/unit-05/unit-map.json",
  "./courses/mathematics/pre-algebra/units/unit-05/vocabulary.json",
  "./courses/mathematics/pre-algebra/units/unit-06/",
  "./courses/mathematics/pre-algebra/units/unit-06/README.md",
  "./courses/mathematics/pre-algebra/units/unit-06/assessment/mastery-check.html",
  "./courses/mathematics/pre-algebra/units/unit-06/assets/assessment-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-06/assets/lesson-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-06/assets/unit-dashboard.js",
  "./courses/mathematics/pre-algebra/units/unit-06/assets/unit.css",
  "./courses/mathematics/pre-algebra/units/unit-06/family-guide.html",
  "./courses/mathematics/pre-algebra/units/unit-06/index.html",
  "./courses/mathematics/pre-algebra/units/unit-06/lessons/lesson-01-exponent-meaning-powers-grouping.html",
  "./courses/mathematics/pre-algebra/units/unit-06/lessons/lesson-02-zero-negative-exponents-patterns.html",
  "./courses/mathematics/pre-algebra/units/unit-06/lessons/lesson-03-exponent-properties-equivalent-expressions.html",
  "./courses/mathematics/pre-algebra/units/unit-06/lessons/lesson-04-square-cube-roots-perfect-powers.html",
  "./courses/mathematics/pre-algebra/units/unit-06/lessons/lesson-05-estimating-irrational-roots.html",
  "./courses/mathematics/pre-algebra/units/unit-06/lessons/lesson-06-scientific-notation-powers-ten.html",
  "./courses/mathematics/pre-algebra/units/unit-06/lessons/lesson-07-operations-scientific-notation-applications.html",
  "./courses/mathematics/pre-algebra/units/unit-06/practice/core.html",
  "./courses/mathematics/pre-algebra/units/unit-06/practice/extended.html",
  "./courses/mathematics/pre-algebra/units/unit-06/practice/foundation.html",
  "./courses/mathematics/pre-algebra/units/unit-06/projects/scale-of-universe-investigation.html",
  "./courses/mathematics/pre-algebra/units/unit-06/standards-map.json",
  "./courses/mathematics/pre-algebra/units/unit-06/unit-map.json",
  "./courses/mathematics/pre-algebra/units/unit-06/vocabulary.json",
  "./courses/mathematics/pre-algebra/units/unit-07/",
  "./courses/mathematics/pre-algebra/units/unit-07/README.md",
  "./courses/mathematics/pre-algebra/units/unit-07/assessment/mastery-check.html",
  "./courses/mathematics/pre-algebra/units/unit-07/assets/assessment-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-07/assets/lesson-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-07/assets/unit-dashboard.js",
  "./courses/mathematics/pre-algebra/units/unit-07/assets/unit.css",
  "./courses/mathematics/pre-algebra/units/unit-07/family-guide.html",
  "./courses/mathematics/pre-algebra/units/unit-07/index.html",
  "./courses/mathematics/pre-algebra/units/unit-07/lessons/lesson-01-variables-terms-coefficients-constants.html",
  "./courses/mathematics/pre-algebra/units/unit-07/lessons/lesson-02-translating-words-contexts-expressions.html",
  "./courses/mathematics/pre-algebra/units/unit-07/lessons/lesson-03-evaluating-expressions-substitution.html",
  "./courses/mathematics/pre-algebra/units/unit-07/lessons/lesson-04-properties-operations-equivalent-structure.html",
  "./courses/mathematics/pre-algebra/units/unit-07/lessons/lesson-05-distributive-property-factoring.html",
  "./courses/mathematics/pre-algebra/units/unit-07/lessons/lesson-06-combining-like-terms-simplifying.html",
  "./courses/mathematics/pre-algebra/units/unit-07/lessons/lesson-07-formulas-multivariable-expressions.html",
  "./courses/mathematics/pre-algebra/units/unit-07/lessons/lesson-08-structural-modelling-patterns-error-analysis.html",
  "./courses/mathematics/pre-algebra/units/unit-07/practice/core.html",
  "./courses/mathematics/pre-algebra/units/unit-07/practice/extended.html",
  "./courses/mathematics/pre-algebra/units/unit-07/practice/foundation.html",
  "./courses/mathematics/pre-algebra/units/unit-07/projects/algebraic-model-design-investigation.html",
  "./courses/mathematics/pre-algebra/units/unit-07/standards-map.json",
  "./courses/mathematics/pre-algebra/units/unit-07/unit-map.json",
  "./courses/mathematics/pre-algebra/units/unit-07/vocabulary.json",
  "./courses/mathematics/pre-algebra/units/unit-08/",
  "./courses/mathematics/pre-algebra/units/unit-08/README.md",
  "./courses/mathematics/pre-algebra/units/unit-08/assessment/mastery-check.html",
  "./courses/mathematics/pre-algebra/units/unit-08/assets/assessment-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-08/assets/lesson-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-08/assets/unit-dashboard.js",
  "./courses/mathematics/pre-algebra/units/unit-08/assets/unit.css",
  "./courses/mathematics/pre-algebra/units/unit-08/family-guide.html",
  "./courses/mathematics/pre-algebra/units/unit-08/index.html",
  "./courses/mathematics/pre-algebra/units/unit-08/lessons/lesson-01-equality-solutions-balance-model.html",
  "./courses/mathematics/pre-algebra/units/unit-08/lessons/lesson-02-one-step-addition-subtraction.html",
  "./courses/mathematics/pre-algebra/units/unit-08/lessons/lesson-03-one-step-multiplication-division.html",
  "./courses/mathematics/pre-algebra/units/unit-08/lessons/lesson-04-two-step-equations-operation-order.html",
  "./courses/mathematics/pre-algebra/units/unit-08/lessons/lesson-05-multistep-distribution-like-terms.html",
  "./courses/mathematics/pre-algebra/units/unit-08/lessons/lesson-06-variables-both-sides-identities-contradictions.html",
  "./courses/mathematics/pre-algebra/units/unit-08/lessons/lesson-07-rearranging-formulas-literal-equations.html",
  "./courses/mathematics/pre-algebra/units/unit-08/lessons/lesson-08-context-equations-verification-error-analysis.html",
  "./courses/mathematics/pre-algebra/units/unit-08/practice/core.html",
  "./courses/mathematics/pre-algebra/units/unit-08/practice/extended.html",
  "./courses/mathematics/pre-algebra/units/unit-08/practice/foundation.html",
  "./courses/mathematics/pre-algebra/units/unit-08/projects/equation-formula-design-investigation.html",
  "./courses/mathematics/pre-algebra/units/unit-08/standards-map.json",
  "./courses/mathematics/pre-algebra/units/unit-08/unit-map.json",
  "./courses/mathematics/pre-algebra/units/unit-08/vocabulary.json",
  "./courses/mathematics/pre-algebra/units/unit-09/README.md",
  "./courses/mathematics/pre-algebra/units/unit-09/assessment/mastery-check.html",
  "./courses/mathematics/pre-algebra/units/unit-09/assets/assessment-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-09/assets/lesson-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-09/assets/unit-dashboard.js",
  "./courses/mathematics/pre-algebra/units/unit-09/assets/unit.css",
  "./courses/mathematics/pre-algebra/units/unit-09/family-guide.html",
  "./courses/mathematics/pre-algebra/units/unit-09/index.html",
  "./courses/mathematics/pre-algebra/units/unit-09/lessons/lesson-01-inequality-meaning-symbols-solution-sets.html",
  "./courses/mathematics/pre-algebra/units/unit-09/lessons/lesson-02-number-line-graphs-interval-descriptions.html",
  "./courses/mathematics/pre-algebra/units/unit-09/lessons/lesson-03-one-step-inequalities-order-preservation.html",
  "./courses/mathematics/pre-algebra/units/unit-09/lessons/lesson-04-negative-multipliers-reversal.html",
  "./courses/mathematics/pre-algebra/units/unit-09/lessons/lesson-05-multistep-variables-both-sides.html",
  "./courses/mathematics/pre-algebra/units/unit-09/lessons/lesson-06-compound-inequalities-and-or.html",
  "./courses/mathematics/pre-algebra/units/unit-09/lessons/lesson-07-contextual-constraints-discrete-solutions.html",
  "./courses/mathematics/pre-algebra/units/unit-09/practice/core.html",
  "./courses/mathematics/pre-algebra/units/unit-09/practice/extended.html",
  "./courses/mathematics/pre-algebra/units/unit-09/practice/foundation.html",
  "./courses/mathematics/pre-algebra/units/unit-09/projects/constraint-design-investigation.html",
  "./courses/mathematics/pre-algebra/units/unit-09/standards-map.json",
  "./courses/mathematics/pre-algebra/units/unit-09/unit-map.json",
  "./courses/mathematics/pre-algebra/units/unit-09/vocabulary.json",
  "./courses/mathematics/pre-algebra/units/unit-10/README.md",
  "./courses/mathematics/pre-algebra/units/unit-10/assessment/mastery-check.html",
  "./courses/mathematics/pre-algebra/units/unit-10/assets/assessment-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-10/assets/lesson-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-10/assets/unit-dashboard.js",
  "./courses/mathematics/pre-algebra/units/unit-10/assets/unit.css",
  "./courses/mathematics/pre-algebra/units/unit-10/family-guide.html",
  "./courses/mathematics/pre-algebra/units/unit-10/index.html",
  "./courses/mathematics/pre-algebra/units/unit-10/lessons/lesson-01-coordinate-plane-ordered-pairs-quadrants.html",
  "./courses/mathematics/pre-algebra/units/unit-10/lessons/lesson-02-patterns-sequences-rules.html",
  "./courses/mathematics/pre-algebra/units/unit-10/lessons/lesson-03-relations-inputs-outputs-functions.html",
  "./courses/mathematics/pre-algebra/units/unit-10/lessons/lesson-04-tables-graphs-equations-words.html",
  "./courses/mathematics/pre-algebra/units/unit-10/lessons/lesson-05-rate-change-tables-graphs-contexts.html",
  "./courses/mathematics/pre-algebra/units/unit-10/lessons/lesson-06-slope-intercepts-linear-equations.html",
  "./courses/mathematics/pre-algebra/units/unit-10/lessons/lesson-07-linear-nonlinear-function-notation.html",
  "./courses/mathematics/pre-algebra/units/unit-10/lessons/lesson-08-linear-modelling-prediction-residuals.html",
  "./courses/mathematics/pre-algebra/units/unit-10/practice/core.html",
  "./courses/mathematics/pre-algebra/units/unit-10/practice/extended.html",
  "./courses/mathematics/pre-algebra/units/unit-10/practice/foundation.html",
  "./courses/mathematics/pre-algebra/units/unit-10/projects/linear-relationship-data-story-investigation.html",
  "./courses/mathematics/pre-algebra/units/unit-10/standards-map.json",
  "./courses/mathematics/pre-algebra/units/unit-10/unit-map.json",
  "./courses/mathematics/pre-algebra/units/unit-10/vocabulary.json",
  "./courses/mathematics/pre-algebra/units/unit-11/README.md",
  "./courses/mathematics/pre-algebra/units/unit-11/assessment/mastery-check.html",
  "./courses/mathematics/pre-algebra/units/unit-11/assets/assessment-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-11/assets/lesson-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-11/assets/unit-dashboard.js",
  "./courses/mathematics/pre-algebra/units/unit-11/assets/unit.css",
  "./courses/mathematics/pre-algebra/units/unit-11/family-guide.html",
  "./courses/mathematics/pre-algebra/units/unit-11/index.html",
  "./courses/mathematics/pre-algebra/units/unit-11/lessons/lesson-01-measurement-systems-units-precision.html",
  "./courses/mathematics/pre-algebra/units/unit-11/lessons/lesson-02-angles-lines-transversals-polygons.html",
  "./courses/mathematics/pre-algebra/units/unit-11/lessons/lesson-03-perimeter-circumference-composite-boundaries.html",
  "./courses/mathematics/pre-algebra/units/unit-11/lessons/lesson-04-area-polygons-circles-composite-figures.html",
  "./courses/mathematics/pre-algebra/units/unit-11/lessons/lesson-05-scale-drawings-similarity-dilations.html",
  "./courses/mathematics/pre-algebra/units/unit-11/lessons/lesson-06-right-triangles-pythagorean-distance.html",
  "./courses/mathematics/pre-algebra/units/unit-11/lessons/lesson-07-surface-area-nets-volume.html",
  "./courses/mathematics/pre-algebra/units/unit-11/lessons/lesson-08-coordinate-geometry-design-constraints-error.html",
  "./courses/mathematics/pre-algebra/units/unit-11/practice/core.html",
  "./courses/mathematics/pre-algebra/units/unit-11/practice/extended.html",
  "./courses/mathematics/pre-algebra/units/unit-11/practice/foundation.html",
  "./courses/mathematics/pre-algebra/units/unit-11/projects/accessible-space-scale-design-investigation.html",
  "./courses/mathematics/pre-algebra/units/unit-11/standards-map.json",
  "./courses/mathematics/pre-algebra/units/unit-11/unit-map.json",
  "./courses/mathematics/pre-algebra/units/unit-11/vocabulary.json",
  "./courses/mathematics/pre-algebra/units/unit-12/README.md",
  "./courses/mathematics/pre-algebra/units/unit-12/assessment/mastery-check.html",
  "./courses/mathematics/pre-algebra/units/unit-12/assets/assessment-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-12/assets/lesson-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-12/assets/unit-dashboard.js",
  "./courses/mathematics/pre-algebra/units/unit-12/assets/unit.css",
  "./courses/mathematics/pre-algebra/units/unit-12/family-guide.html",
  "./courses/mathematics/pre-algebra/units/unit-12/index.html",
  "./courses/mathematics/pre-algebra/units/unit-12/lessons/lesson-01-data-questions-variables-populations-samples.html",
  "./courses/mathematics/pre-algebra/units/unit-12/lessons/lesson-02-frequency-tables-dot-plots-histograms-box-plots.html",
  "./courses/mathematics/pre-algebra/units/unit-12/lessons/lesson-03-measures-center-mean-median-mode-weighted-mean.html",
  "./courses/mathematics/pre-algebra/units/unit-12/lessons/lesson-04-variability-range-iqr-mad-outliers.html",
  "./courses/mathematics/pre-algebra/units/unit-12/lessons/lesson-05-comparing-distributions-misleading-displays.html",
  "./courses/mathematics/pre-algebra/units/unit-12/lessons/lesson-06-probability-models-sample-spaces-relative-frequency.html",
  "./courses/mathematics/pre-algebra/units/unit-12/lessons/lesson-07-compound-probability-tree-diagrams-simulation.html",
  "./courses/mathematics/pre-algebra/units/unit-12/lessons/lesson-08-sampling-bias-association-evidence-decisions.html",
  "./courses/mathematics/pre-algebra/units/unit-12/practice/core.html",
  "./courses/mathematics/pre-algebra/units/unit-12/practice/extended.html",
  "./courses/mathematics/pre-algebra/units/unit-12/practice/foundation.html",
  "./courses/mathematics/pre-algebra/units/unit-12/projects/community-data-evidence-investigation.html",
  "./courses/mathematics/pre-algebra/units/unit-12/standards-map.json",
  "./courses/mathematics/pre-algebra/units/unit-12/unit-map.json",
  "./courses/mathematics/pre-algebra/units/unit-12/vocabulary.json",
  "./courses/mathematics/pre-algebra/units/unit-13/README.md",
  "./courses/mathematics/pre-algebra/units/unit-13/assessment/mastery-check.html",
  "./courses/mathematics/pre-algebra/units/unit-13/assets/assessment-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-13/assets/lesson-engine.js",
  "./courses/mathematics/pre-algebra/units/unit-13/assets/unit-dashboard.js",
  "./courses/mathematics/pre-algebra/units/unit-13/assets/unit.css",
  "./courses/mathematics/pre-algebra/units/unit-13/family-guide.html",
  "./courses/mathematics/pre-algebra/units/unit-13/index.html",
  "./courses/mathematics/pre-algebra/units/unit-13/lessons/lesson-01-frame-meaningful-safe-answerable-question.html",
  "./courses/mathematics/pre-algebra/units/unit-13/lessons/lesson-02-select-variables-mathematics-data-representations.html",
  "./courses/mathematics/pre-algebra/units/unit-13/lessons/lesson-03-build-calculate-verify-revise-model.html",
  "./courses/mathematics/pre-algebra/units/unit-13/lessons/lesson-04-test-assumptions-sensitivity-uncertainty-fairness.html",
  "./courses/mathematics/pre-algebra/units/unit-13/lessons/lesson-05-communicate-defend-reflect-readiness.html",
  "./courses/mathematics/pre-algebra/units/unit-13/practice/core.html",
  "./courses/mathematics/pre-algebra/units/unit-13/practice/extended.html",
  "./courses/mathematics/pre-algebra/units/unit-13/practice/foundation.html",
  "./courses/mathematics/pre-algebra/units/unit-13/projects/mathematical-modelling-capstone-portfolio.html",
  "./courses/mathematics/pre-algebra/units/unit-13/standards-map.json",
  "./courses/mathematics/pre-algebra/units/unit-13/tools/modelling-verification-studio.html",
  "./courses/mathematics/pre-algebra/units/unit-13/unit-map.json",
  "./courses/mathematics/pre-algebra/units/unit-13/vocabulary.json",
  "./courses/mathematics/pre-algebra/assessments/",
  "./courses/mathematics/pre-algebra/assessments/index.html",
  "./courses/mathematics/pre-algebra/assessments/midterm-units-01-07.html",
  "./courses/mathematics/pre-algebra/assessments/final-exam-36-weeks.html",
  "./courses/mathematics/pre-algebra/assessments/administration-guide.html",
  "./courses/mathematics/pre-algebra/assessments/assessment-map.json",
  "./courses/mathematics/pre-algebra/assessments/assets/assessment-suite.css",
  "./courses/mathematics/pre-algebra/assessments/assets/exam-engine.js",
  "./courses/mathematics/pre-algebra/records/README.md",
  "./courses/mathematics/pre-algebra/records/course-completion-certificate.html",
  "./docs/releases/ASSESSMENT_RECORDS_RELEASE.md",
  "./docs/audits/ASSESSMENT_RECORDS_VALIDATION.md",
];
// Offline entrances for all four mathematics courses. Use the correct course as
// a fallback if the requested unit/lesson was not previously cached.
const COURSE_OFFLINE_FILES = [
  "./courses/mathematics/pre-algebra/index.html",
  "./courses/mathematics/algebra-1/index.html",
  "./courses/mathematics/geometry/index.html",
  "./courses/mathematics/algebra-2/index.html"
];
const COURSE_VISUAL_FILES = ["./assets/math-course-visual-unifier.css?v=20261013"];
const PRECACHE_FILES = [...new Set([...GAME_PRECACHE_FILES, ...GAME_RUNTIME_FILES, ...COURSE_OFFLINE_FILES, ...COURSE_VISUAL_FILES, ...OTHER_PRECACHE_FILES])];

const SENSITIVE_CACHE_PATTERNS = [
  /\/teacher(?:\/|$)/i,
  /teacher-guide/i,
  /teacher-keys/i,
  /answer[-_]?keys?/i,
  /final[-_]?key/i,
  /midterm[-_]?key/i
];
function shouldNeverCache(url){
  return SENSITIVE_CACHE_PATTERNS.some(pattern=>pattern.test(url.pathname));
}

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_VERSION).then(async cache => {
    // The game bundle is atomic: do not activate a release with missing canonical games.
    const required = [...new Set([...GAME_PRECACHE_FILES, ...GAME_RUNTIME_FILES, ...COURSE_OFFLINE_FILES, ...COURSE_VISUAL_FILES])];
    await cache.addAll(required.map(path => new Request(path, { cache: "reload" })));
    const needed = new Set(required);
    // Preserve the existing best-effort caching policy for all other course material.
    await Promise.allSettled(PRECACHE_FILES.filter(path => !needed.has(path))
      .map(path => cache.add(new Request(path, { cache: "reload" }))));
  }).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("khaemenes-high-") && key !== CACHE_VERSION).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

function fallbackFor(url) {
  const path = url.pathname;
  // A unit number without its course is ambiguous. Resolve the course prefix first.
  const course = path.match(/\/courses\/mathematics\/(pre-algebra|algebra-1|algebra-2|geometry)(?:\/|$)/i);
  if (course) {
    const base = "./courses/mathematics/" + course[1].toLowerCase() + "/";
    const suffix = path.slice(course.index + course[0].length);
    const unit = suffix.match(/^units\/unit-(0[1-9]|1[0-3])(?:\/|$)/i);
    const choices = unit ? [base + "units/unit-" + unit[1] + "/index.html"] : [];
    // Retain the pre-Algebra assessment and record fallbacks, but only for pre-Algebra.
    if (course[1].toLowerCase() === "pre-algebra") {
      if (suffix.startsWith("assessments/")) choices.push(base + "assessments/index.html");
      if (suffix.startsWith("records/")) choices.push(base + "records/course-completion-certificate.html");
      if (suffix.startsWith("diagnostic/")) choices.push(base + "diagnostic/index.html");
    }
    choices.push(base + "index.html");
    return choices;
  }
  if (/\/grades\/grade-09(?:\/|$)/.test(path)) return ["./grades/grade-09/index.html"];
  return ["./index.html"];
}

async function cachedCourseFallback(url) {
  for (const path of fallbackFor(url)) {
    const cached = await matchReleaseCache(path);
    if (cached) return cached;
  }
  return null;
}

// A game launched from a lesson has ?course=...&lesson=...&mode=... parameters.
// The HTML is the same canonical file, so offline lookup may omit those parameters
// without changing the URL or any learner-scoped localStorage records.
async function cachedNavigation(request) {
  const exact = await matchReleaseCache(request);
  if (exact) return exact;
  const url = new URL(request.url);
  const match = url.pathname.match(/\/courses\/mathematics\/assets\/learning-games\/[a-z0-9-]+\/(?:index\.html)?$/i);
  if (!match) return null;
  const canonicalPath = url.pathname.endsWith("/") ? url.pathname + "index.html" : url.pathname;
  return matchReleaseCache(url.origin + canonicalPath);
}

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (shouldNeverCache(url)) {
    event.respondWith(fetch(request, { cache: "no-store" }));
    return;
  }
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(response => { if (response && response.ok) { const copy = response.clone(); caches.open(CACHE_VERSION).then(cache => cache.put(request, copy)); } return response; }).catch(async () => (await cachedNavigation(request)) || (await cachedCourseFallback(url)) || matchReleaseCache("./index.html")));
    return;
  }
  event.respondWith(matchReleaseCache(request).then(cached => { const network = fetch(request).then(response => { if (response && response.ok) { const copy = response.clone(); caches.open(CACHE_VERSION).then(cache => cache.put(request, copy)); } return response; }).catch(() => cached); return cached || network; }));
});

self.addEventListener("message", event => { if (event.data === "SKIP_WAITING") self.skipWaiting(); });

function matchReleaseCache(request){return caches.open(CACHE_VERSION).then(cache=>cache.match(request));}


/* Student-requested offline course pack caching. Do not cache restricted materials. */
self.addEventListener("message",event=>{
  const data=event.data;
  if(!data||data.type!=="KHAE_OFFLINE_PACK_V1")return;
  const port=event.ports&&event.ports[0];
  const incoming=Array.isArray(data.paths)?data.paths:[];
  const safe=incoming.slice(0,1500).filter(path=>
    typeof path==="string"&&/^courses\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9_./-]+\.(?:html|css|js|json|svg|png|webp)$/i.test(path)&&
    !path.includes("..")&&!shouldNeverCache(new URL(path,self.registration.scope))
  );
  event.waitUntil((async()=>{
    let ok=0,failed=0;const errors=[];
    try{
      const cache=await caches.open(CACHE_VERSION);
      for(const path of safe){
        try{
          const url=new URL(path,self.registration.scope);
          const response=await fetch(new Request(url.href,{cache:"reload",credentials:"same-origin"}));
          if(!response.ok)throw Error("HTTP "+response.status);
          await cache.put(url.href,response);
          ok++;
        }catch(e){failed++;if(errors.length<8)errors.push(path+" "+String(e?.message||e))}
        if((ok+failed)%10===0)port?.postMessage({type:"progress",ok,failed,total:safe.length});
      }
      port?.postMessage({type:"done",ok,failed,total:safe.length,errors});
    }catch(e){port?.postMessage({type:"error",message:String(e?.message||e),ok,failed})}
  })());
});
