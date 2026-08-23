(() => {
"use strict";
const RUBRIC=[
  "4 · Complete and correct reasoning; representations, units, verification, and interpretation are explicit.",
  "3 · Substantially correct reasoning with a minor omission or small non-conceptual error.",
  "2 · Partial reasoning shows important understanding but contains a conceptual gap or incomplete verification.",
  "1 · Limited relevant work; major misconceptions or unsupported conclusion remain.",
  "0 · Blank, unrelated, or no assessable mathematical reasoning."
];
window.KhaemenesPreAlgebraExamDepth={
  "KH-MATH-PA-MIDTERM-U01-U07":{
    version:"2.0",
    title:"Midterm Constructed-Response Depth Evidence",
    selected_weight:70,
    constructed_weight:30,
    rubric_max:4,
    response_min_chars:40,
    rubric:RUBRIC,
    constructed:[
      {domain:"Unit 1 · Number structure",prompt:"A community center has 84 red tiles and 126 blue tiles. It wants the greatest possible number of identical kits with no tiles left over. Determine the number of kits and the tiles of each color per kit. Show the factor or GCF reasoning and verify that your result uses every tile."},
      {domain:"Unit 2 · Integers",prompt:"A research sensor begins at +18 m relative to sea level, descends 47 m, rises 12 m, and then descends 9 m. Model the signed changes, determine the final position, and explain how you can verify the direction and magnitude of the result."},
      {domain:"Unit 3 · Rational numbers",prompt:"A recipe uses 3/4 cup of grain per batch. You need 2 1/2 batches, but your measuring cup is marked in eighths. Determine the amount needed, express it in at least two equivalent forms, and explain why your answer is reasonable."},
      {domain:"Unit 4 · Proportional reasoning",prompt:"Plan A costs $18 for 6 units and Plan B costs $25 for 10 units. Compare the unit rates, decide which plan is less expensive per unit, and state one condition under which unit-rate comparison would not be sufficient for a real decision."},
      {domain:"Unit 5 · Percent & finance",prompt:"An $80 item is discounted 25% and then taxed 7.5% on the sale price. Compute the final price. Show why applying the tax to the original price would be a modelling error, and estimate first to check reasonableness."},
      {domain:"Unit 6 · Powers & scientific notation",prompt:"A quantity is 3.6×10^5 and another is 1.2×10^3. Determine how many times larger the first is than the second. Show the exponent reasoning, give the result in ordinary notation, and include an order-of-magnitude check."},
      {domain:"Unit 7 · Algebraic structure",prompt:"A service charges a fixed $24 fee plus $7 per hour. Write an expression for h hours, evaluate it for 5.5 hours, then rewrite or explain the structure so another learner can identify the fixed amount and rate. Verify the units in your final interpretation."}
    ]
  },
  "KH-MATH-PA-FINAL-36W":{
    version:"2.0",
    title:"Final Constructed-Response Depth Evidence",
    selected_weight:70,
    constructed_weight:30,
    rubric_max:4,
    response_min_chars:50,
    rubric:RUBRIC,
    constructed:[
      {domain:"Number & rational reasoning",prompt:"A project needs 7 1/2 meters of material. Pieces are sold in lengths of 3/4 meter for $2.40 each. Determine how many pieces must be purchased and the total cost. Show exact rational-number work, interpret the whole-piece constraint, and check reasonableness."},
      {domain:"Proportion & financial mathematics",prompt:"Two plans price the same service differently. Plan A charges $18 plus $4.50 per use; Plan B charges $7 plus $6 per use. Write models, determine the break-even number of uses, compare the plans on either side of that point, and explain one limitation of the comparison."},
      {domain:"Exponents & scientific notation",prompt:"A sample contains 4.8×10^7 particles and is divided equally among 1.2×10^3 containers. Determine particles per container in scientific notation and standard notation. Explain the exponent operation and perform an order-of-magnitude check."},
      {domain:"Expressions & equations",prompt:"A rental costs $28 plus $9 per hour and the total bill is $100. Define the variable, write and solve the equation, verify by substitution, interpret the solution with units, and identify one common algebra error that could produce a wrong answer."},
      {domain:"Inequalities & constraints",prompt:"A club has at most $250 for an event. A fixed permit costs $46 and each participant kit costs $13. Write and solve an inequality for the number of kits. Interpret the greatest feasible whole-number value and explain why the algebraic boundary must be adjusted to the context."},
      {domain:"Functions & linear relationships",prompt:"A linear relationship passes through (2,7) and (8,25). Determine the slope, write an equation in y=mx+b form, interpret slope and intercept in a plausible context, and state why extrapolating far outside the observed x-range may be risky."},
      {domain:"Geometry & measurement",prompt:"A rectangular room is 8 m by 5 m. A scale drawing uses 1 cm = 0.5 m. Determine the drawing dimensions and the real floor area. Then explain why doubling every real dimension would quadruple area rather than merely double it."},
      {domain:"Statistics & probability",prompt:"Two groups have the same mean score of 75. Group A ranges from 72 to 78; Group B ranges from 45 to 98. Explain why the equal means do not imply similar performance, identify a useful measure or display of spread, and describe one sampling question you would ask before making a broader claim."},
      {domain:"Mathematical modelling",prompt:"A model predicts monthly water use W=1200−35d, where d is the number of conservation days. Explain the variables and units, evaluate the model at d=20, test the sensitivity if the rate 35 changes by ±10%, and state at least one assumption or limitation that affects the conclusion."},
      {domain:"Algebra I readiness defense",prompt:"Choose one error you made or could plausibly make in this course involving signs, proportionality, equations, functions, units, or data. Show the incorrect reasoning, correct it, verify the correction, and explain what strategy you will carry into Algebra I to prevent the error."}
    ]
  }
};
})();