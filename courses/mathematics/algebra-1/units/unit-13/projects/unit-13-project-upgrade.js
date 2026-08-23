/* Unit 13 capstone project enhancement + protected pacing runway */
(()=>{
"use strict";
function run(){
 const R=window.PAGE_REF||{};if(Number(R.unit)!==13||R.type!=="project")return;
 const main=document.querySelector("#main");if(!main)return;
 const root=R.root||"../../../";
 setTimeout(()=>{
  const card=main.querySelector(".card.col7");if(!card)return;
  card.innerHTML=`<h2>Algebra I Integrated Modelling Portfolio & Oral Defence</h2>
  <p>Choose an invented, classroom-safe, or responsibly sourced public-data decision problem that can be addressed with Algebra I mathematics. Your final product must show the modelling process, not just a final answer.</p>
  <div class="notice"><strong>Pacing protection:</strong> formal Unit 13 remains Week 36. The Weeks 33–35 runway below is planning and drafting only. It does not award lesson, weekly, unit, capstone, or Final mastery; it exists so the culminating week is not overloaded with project setup.</div>
  <h3>Weeks 33–35 · Non-graded capstone runway</h3>
  <ol>
   <li><strong>Week 33 · Frame:</strong> choose the decision question, identify stakeholders, define quantities and units, set ethical/privacy boundaries, and identify what evidence would be needed.</li>
   <li><strong>Week 34 · Prepare evidence:</strong> assemble fictional, aggregated, or responsibly sourced public data; sketch at least three useful representations; document assumptions and data limitations.</li>
   <li><strong>Week 35 · Draft and test:</strong> build a preliminary model, verify at least one calculation independently, identify two inputs for sensitivity testing, and note what evidence could force revision.</li>
  </ol>
  <p><strong>Important:</strong> the runway may prepare artifacts, but the five formal Unit 13 lessons and their 80% lesson checks remain locked until normal Unit 12 progression is complete.</p>
  <h3>Week 36 · Formal evidence sequence</h3>
  <ol>
   <li><strong>Formal synthesis lessons:</strong> complete Unit 13 Lessons 01–05 and reach at least 80% on each lesson check.</li>
   <li><strong>Weekly mastery:</strong> complete Week 36 mastery at 8/10 or better after all five Week 36 lesson gates are met.</li>
   <li><strong>Unit mastery:</strong> complete the fixed 20-question Unit 13 formal mastery check at 16/20 or better.</li>
   <li><strong>Portfolio & oral defence:</strong> finalize the model, present the evidence, answer reviewer questions, and receive an evaluator capstone score of at least 80% for course-completion eligibility.</li>
   <li><strong>Final examination:</strong> the cumulative Final opens only after its canonical course prerequisites are met. Its existing selected-response, constructed-response, and overall 80% requirements remain unchanged.</li>
  </ol>
  <div class="actions no-print"><a class="btn" href="${root}units/unit-13/">Unit 13 Home</a><a class="btn" href="${root}assessments/weekly-mastery.html?week=36">Week 36 Mastery</a><a class="btn" href="${root}units/unit-13/assessment/mastery-check.html">Unit 13 Mastery</a><a class="btn primary" href="${root}assessments/final-exam-36-weeks.html">Final Examination</a></div>
  <h3>Final portfolio requirements</h3>
  <ol>
   <li><strong>Frame:</strong> state a precise decision question, stakeholders, quantities, units, domain, criteria, assumptions, and ethical/privacy boundaries.</li>
   <li><strong>Represent:</strong> create at least three complementary representations such as equations, tables, graphs, diagrams, or distributions.</li>
   <li><strong>Integrate Algebra I:</strong> use at least three major course ideas, with at least one drawn from functions/models and one from data/evidence or financial/quantitative reasoning.</li>
   <li><strong>Calculate:</strong> show exact or appropriately rounded work, preserve units, and explain what each result means.</li>
   <li><strong>Validate:</strong> verify key calculations independently, compare predictions with constraints/data, and inspect error or residual evidence where applicable.</li>
   <li><strong>Revise:</strong> document at least one model or assumption change made because of evidence.</li>
   <li><strong>Test sensitivity:</strong> vary at least two important inputs or assumptions and identify any threshold where the recommendation changes.</li>
   <li><strong>Address uncertainty and fairness:</strong> identify uncertainty sources, limitations, and who could benefit or bear risk under the decision.</li>
   <li><strong>Conclude:</strong> make a recommendation explicitly bounded by domain, assumptions, evidence, and uncertainty.</li>
   <li><strong>Defend:</strong> present the model and answer reviewer questions about choices, alternatives, errors, limitations, and what evidence could change the conclusion.</li>
   <li><strong>Reflect:</strong> identify the strongest evidence of Algebra I readiness and one skill to strengthen next.</li>
  </ol>
  <p class="notice"><strong>Safety & privacy:</strong> use fictional scenarios or appropriately aggregated/public data. Do not collect classmates’ financial, health, location, account, disciplinary, or other sensitive personal information.</p>`;
 },0);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run);else run();
})();