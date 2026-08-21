/* Unit 11 project-specific enhancement.
   Add after ../../assets/unit-page.js on the Unit 11 project page.
*/
(()=>{
"use strict";
function run(){
 const R=window.PAGE_REF||{}; if(Number(R.unit)!==11||R.type!=="project")return;
 const main=document.querySelector("#main"); if(!main)return;
 setTimeout(()=>{
  const card=main.querySelector(".card.col7"); if(!card)return;
  card.innerHTML=`<h2>Accessibility Coordinate Design Challenge</h2>
  <p>Design a small public space on a coordinate plane. Your plan must use Unit 11 mathematics to justify accessibility, spacing, and safety decisions.</p>
  <ol>
   <li>Choose a scale and place an entrance, destination, rest point, and one circular safety or activity zone.</li>
   <li>Use the distance formula to calculate at least three exact distances. Keep radicals exact, then give useful decimal approximations.</li>
   <li>Use midpoint reasoning to place at least one feature exactly halfway between two locations.</li>
   <li>Write an equation for your circular zone and identify its center and radius.</li>
   <li>Verify algebraically whether at least two proposed points are inside, on, or outside that circle.</li>
   <li>Use a rational exponent or equivalent radical form in at least one calculation.</li>
   <li>Test one alternative layout and explain which design better satisfies your stated accessibility or safety constraint.</li>
   <li>State assumptions, units, one limitation, and a final evidence-based recommendation.</li>
  </ol>
  <p class="notice"><strong>Privacy:</strong> use invented or public-space measurements only. Do not include a learner’s home address, precise location, or personal mobility/medical information.</p>`;
 },0);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run);else run();
})();