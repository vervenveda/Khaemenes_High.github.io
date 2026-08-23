(()=>{
"use strict";
const RUBRIC=[
  "4 · Complete and correct reasoning; representations, units, verification, interpretation, and relevant limitations are explicit.",
  "3 · Substantially correct reasoning with a minor omission or small non-conceptual error.",
  "2 · Partial reasoning shows important understanding but contains a conceptual gap, incomplete verification, or weak interpretation.",
  "1 · Limited relevant work; major misconceptions or unsupported conclusions remain.",
  "0 · Blank, unrelated, or no assessable mathematical reasoning."
];
window.KhaemenesAlgebra1ExamDepth={
  "KH-MATH-A1-MIDTERM-U01-U06":{
    version:"2.0",
    title:"Midterm Constructed-Response Depth Evidence",
    selected_weight:70,
    constructed_weight:30,
    rubric_max:4,
    response_min_chars:50,
    rubric:RUBRIC,
    constructed:[
      {domain:"Unit 01 · Mathematical truth, units & precision",prompt:"A laboratory records a distance as 2.48 km and a travel time as 3.6 minutes. Determine the average speed in meters per second. Show dimensional analysis so units cancel correctly, state a justified level of precision, and describe one independent check that would help detect a conversion or magnitude error."},
      {domain:"Unit 02 · Expressions & polynomial structure",prompt:"A student claims 3(x+4)+2x²−5x is equivalent to 2x²−2x+4. Analyze the claim. Show a correct structural simplification, identify the first incorrect step the student may have made, and verify your final expression using a value of x or an algebraically independent check."},
      {domain:"Unit 03 · Equations, proportions & models",prompt:"A service charges a fixed $36 setup fee plus $8.50 per hour. A customer can spend at most $125, but first solve the equality for the exact break-even time. Define a variable, build and solve the equation, verify by substitution, interpret the units, and explain how the model would change when the spending limit is treated as a constraint rather than an equality."},
      {domain:"Unit 04 · Inequalities & absolute-value constraints",prompt:"A manufactured part should measure 18.0 cm with tolerance no greater than 0.25 cm. Write an absolute-value inequality, solve it as a compound inequality and interval, then determine whether measurements 17.72 cm, 17.80 cm, and 18.24 cm are acceptable. Explain endpoint inclusion and one common inequality error to avoid."},
      {domain:"Unit 05 · Functions & multiple representations",prompt:"A delivery rule is C(n)=12+4.5n for whole-number package counts from 0 through 30. Explain the domain and range in context, create at least three input-output pairs, interpret C(8), and explain why treating every real number as an allowed input would misrepresent the situation. State one other representation that would make a different feature easier to see."},
      {domain:"Unit 06 · Linear models, residuals & limitations",prompt:"A fitted model for a process is y=2.8x+14. An observation at x=20 is y=67. Compute the prediction and residual, interpret the slope and residual in context using units of your choice, and explain why a useful linear model report should include the observed data range and residual behavior before using the model for extrapolation."}
    ]
  },
  "KH-MATH-A1-FINAL-36W":{
    version:"2.0",
    title:"Final Constructed-Response Depth Evidence",
    selected_weight:70,
    constructed_weight:30,
    rubric_max:4,
    response_min_chars:60,
    rubric:RUBRIC,
    constructed:[
      {domain:"Precision, units & algebraic verification",prompt:"A model requires converting 54 miles per hour to meters per second and then using that rate for a 35-second interval. Carry out the conversion and distance calculation with units, state reasonable precision, verify the magnitude independently, and explain why a numerically plausible answer with incompatible units should not be accepted."},
      {domain:"Expressions, equations & proportional modelling",prompt:"A community program charges $28 plus $6.75 per participant and has a budget of $190. Write the cost expression, solve the equality that marks the budget boundary, then convert the result into an inequality-based whole-participant decision. Verify the arithmetic and explain why the contextual answer may differ from the raw algebraic boundary."},
      {domain:"Inequalities & constraints",prompt:"A storage system must keep temperature T within 4 degrees of 22°C and must also satisfy T≥19°C. Represent both requirements, determine the combined feasible interval, test two boundary values, and explain how AND versus OR reasoning changes the meaning of a system of constraints."},
      {domain:"Functions & representations",prompt:"A function is defined by f(x)=2x+5 for x<3 and f(x)=x²−4 for x≥3. Evaluate values on both sides of the boundary, determine f(3), describe an appropriate domain, and explain how a table, graph, and symbolic rule each reveal different information about the same relationship."},
      {domain:"Linear models & systems",prompt:"Plan A costs A=42+4x and Plan B costs B=18+7x. Find and verify the break-even point, determine which plan is cheaper before and after it, interpret the intersection as a system solution, and state one real-world factor that could make the two-equation comparison incomplete."},
      {domain:"Exponentials & sequences",prompt:"An account begins with $2,500 and grows 4.5% per year. Build an exponential model, estimate the balance after 6 years, compare this with a linear model that adds 4.5% of the original principal each year, and explain why the difference between the models grows over time."},
      {domain:"Polynomials, factoring & quadratics",prompt:"A rectangular design has area A(x)=−x²+18x and meaningful widths 0≤x≤18. Factor the expression, identify its zeros, determine the maximum area and where it occurs, and explain how factored form and vertex form support different parts of the analysis."},
      {domain:"Radicals & coordinate geometry",prompt:"Points A(−2,3) and B(7,15) define a segment. Find its midpoint and exact distance, simplify the radical if possible, provide a decimal approximation, and explain how the Pythagorean theorem supports the distance formula and how units would enter a physical interpretation."},
      {domain:"Statistics, finance & evidence",prompt:"Two groups have the same mean of 72, but one has standard deviation 3 and the other standard deviation 18. Explain what that tells you about spread, identify another display or statistic you would inspect, and describe how sample selection, misleading graph scales, or omitted financial assumptions could weaken a quantitative claim even when its arithmetic is correct."},
      {domain:"Integrated modelling & Algebra I defense",prompt:"Choose a realistic question that could be modeled with Algebra I. Define variables and units, propose an equation or function, state assumptions and a feasible domain, show one calculation or prediction, describe how you would validate the model, test the sensitivity of one important input, identify a limitation or fairness concern, and explain what evidence would make you confident defending the model."}
    ]
  }
};
const MASTERY=80;
const safe=(key,fallback={})=>{try{return JSON.parse(localStorage.getItem(key)||"null")||fallback}catch{return fallback}};
function unitMastered(n){if(n===1)return Number(safe("khaemenes-algebra1-unit01-a3-v1",{best:{}})?.best?.mastery)>=MASTERY;const p=safe(`khaemenes-algebra1-unit${String(n).padStart(2,"0")}-progress-v1`,{completed:[],scores:{}});return Number(p?.scores?.mastery)>=MASTERY||Array.isArray(p?.completed)&&p.completed.includes("mastery")}
function weekMastered(n){const r=safe("khaemenes-algebra1-weekly-mastery-v2",{weeks:{}})?.weeks?.[n];return Number(r?.best)>=MASTERY||Array.isArray(r?.attempts)&&r.attempts.some(a=>a?.mastery_met===true)}
function cumulativeMastered(key){const r=safe(key,null);return !!(r&&r.mastery===true)}
function missingFor(id){const missing=[];if(id==="KH-MATH-A1-MIDTERM-U01-U06"){for(let u=1;u<=6;u++)if(!unitMastered(u))missing.push(`Unit ${String(u).padStart(2,"0")} mastery`);for(let w=2;w<=18;w++)if(!weekMastered(w))missing.push(`Week ${String(w).padStart(2,"0")} mastery`)}else if(id==="KH-MATH-A1-FINAL-36W"){for(let u=1;u<=13;u++)if(!unitMastered(u))missing.push(`Unit ${String(u).padStart(2,"0")} mastery`);for(let w=2;w<=36;w++)if(!weekMastered(w))missing.push(`Week ${String(w).padStart(2,"0")} mastery`);if(!cumulativeMastered("khaemenes-algebra1-midterm-result-v1"))missing.push("reviewed Midterm mastery")}return missing}
function enforceExamGate(){const C=window.EXAM_CONFIG;if(!C)return;const missing=missingFor(C.id);if(!missing.length)return;const main=document.getElementById("main");if(!main)return;const list=missing.slice(0,12).map(x=>`<li>${x}</li>`).join("");const more=missing.length>12?`<p>Plus ${missing.length-12} additional prerequisite gate(s).</p>`:"";main.innerHTML=`<section class="hero"><div class="wrap"><p class="eyebrow">Strict 80% Mastery Gate</p><h1>${C.title} is locked</h1><p class="lead">Every prerequisite lesson/weekly/unit gate must be complete before this cumulative examination opens.</p><div class="actions"><a class="btn primary" href="../assessments/weekly-mastery.html">Return to Weekly Mastery</a><a class="btn" href="../#units">Review Units</a></div></div></section><section class="block"><div class="wrap"><article class="card"><h2>Still required</h2><ul>${list}</ul>${more}<p class="notice">A score below ${MASTERY}% remains saved as evidence, but it does not unlock the next graded stage.</p></article></div></section>`}
setTimeout(enforceExamGate,0);
})();