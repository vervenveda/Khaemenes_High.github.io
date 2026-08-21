/* Unit 12 project-specific enhancement.
   Add after ../../../assets/unit-page.js on Evidence & Financial Decision Audit project page.
*/
(()=>{
"use strict";
function run(){
 const R=window.PAGE_REF||{};if(Number(R.unit)!==12||R.type!=="project")return;
 const main=document.querySelector("#main");if(!main)return;
 setTimeout(()=>{
  const card=main.querySelector(".card.col7");if(!card)return;
  card.innerHTML=`<h2>Evidence & Financial Decision Audit</h2>
  <p>Build a defensible comparison using invented, classroom, or responsibly sourced public data. The goal is not to recommend a real financial product; it is to demonstrate quantitative reasoning.</p>
  <ol>
   <li>Frame one statistical question and identify the population, variables, units, and a defensible sampling or data-source plan.</li>
   <li>Create a small non-identifying data set or use an approved public data set. Describe center, spread, shape, and any unusual values.</li>
   <li>Create two appropriate displays and explain why each representation is useful and not misleading.</li>
   <li>Analyze one bivariate relationship. Describe association, compute at least two residuals from a simple model, and state why association does or does not support causation.</li>
   <li>Create or analyze a two-way table and compute at least two conditional relative frequencies or probabilities.</li>
   <li>Compare two fictional financial options using rates, time, fees, taxes/discounts, total cost or growth, and one explicit risk/uncertainty assumption.</li>
   <li>Audit one quantitative claim: identify its numerator/denominator, time period, source, absolute and relative change when relevant, and at least one limitation.</li>
   <li>Conclude with an evidence-based decision and explain what additional information could change it.</li>
  </ol>
  <p class="notice"><strong>Privacy & safety:</strong> do not collect classmates’ financial details, account information, precise location, health data, or other sensitive personal information. Use invented scenarios or appropriately aggregated/public data.</p>`;
 },0);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run);else run();
})();