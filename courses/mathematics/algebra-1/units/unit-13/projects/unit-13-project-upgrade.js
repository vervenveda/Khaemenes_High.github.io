/* Unit 13 capstone project enhancement */
(()=>{
"use strict";
function run(){
 const R=window.PAGE_REF||{};if(Number(R.unit)!==13||R.type!=="project")return;
 const main=document.querySelector("#main");if(!main)return;
 setTimeout(()=>{
  const card=main.querySelector(".card.col7");if(!card)return;
  card.innerHTML=`<h2>Algebra I Integrated Modelling Portfolio & Oral Defence</h2>
  <p>Choose an invented, classroom-safe, or responsibly sourced public-data decision problem that can be addressed with Algebra I mathematics. Your final product must show the modelling process, not just a final answer.</p>
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