/* Algebra II Unit 01 depth companion v1
   Adds representation-rich examples without replacing canonical lesson content.
   Idempotent and local/offline-first.
*/
(()=>{
"use strict";
if(document.getElementById("a2Unit01DepthCompanion"))return;
const id=document.body?.dataset?.lessonId||"";
const lessons={
"u01-l01":{
 title:"Function notation as a mapping",
 caption:"The same relationship can be read as notation, an ordered pair, a table entry, or a mapping.",
 svg:`<svg viewBox="0 0 720 250" role="img" aria-labelledby="a2v-title a2v-desc">
 <title id="a2v-title">Function mapping diagram</title><desc id="a2v-desc">Inputs map through a function rule to exactly one output each.</desc>
 <rect x="40" y="55" width="150" height="145" rx="12" fill="none" stroke="currentColor" stroke-width="3"/>
 <rect x="285" y="55" width="150" height="145" rx="12" fill="none" stroke="currentColor" stroke-width="3"/>
 <rect x="530" y="55" width="150" height="145" rx="12" fill="none" stroke="currentColor" stroke-width="3"/>
 <text x="115" y="85" text-anchor="middle">Input x</text><text x="360" y="85" text-anchor="middle">f(x)=2x+1</text><text x="605" y="85" text-anchor="middle">Output</text>
 <text x="115" y="125" text-anchor="middle">−1</text><text x="115" y="160" text-anchor="middle">2</text>
 <text x="605" y="125" text-anchor="middle">−1</text><text x="605" y="160" text-anchor="middle">5</text>
 <path d="M190 120 H285 M435 120 H530 M190 155 H285 M435 155 H530" stroke="currentColor" stroke-width="3" fill="none"/>
 </svg>`,
 examples:[
  ["Equivalent representations","If f(3)=11, record the same fact as an ordered pair and a table row.","(3,11); a table row with x=3 and f(x)=11."],
  ["Boundary case","For f(x)=1/(x−2), explain why f(2) is not an output of the function.","The denominator becomes zero; x=2 is outside the domain."],
  ["Transfer","A temperature model T(t) is measured in °C. Interpret T(6)=18 in a complete sentence.","At time t=6 in the model's time units, the modeled temperature is 18°C."]
 ]},
"u01-l02":{
 title:"Domain and range are constraints on two different axes",
 caption:"A restriction on input belongs to the horizontal axis; a restriction on output belongs to the vertical axis.",
 svg:`<svg viewBox="0 0 720 270" role="img" aria-labelledby="a2v-title a2v-desc"><title id="a2v-title">Domain and range diagram</title><desc id="a2v-desc">A coordinate plane shows an excluded x value and a minimum y value.</desc>
 <line x1="70" y1="210" x2="670" y2="210" stroke="currentColor" stroke-width="3"/><line x1="360" y1="30" x2="360" y2="245" stroke="currentColor" stroke-width="3"/>
 <line x1="500" y1="45" x2="500" y2="225" stroke="currentColor" stroke-width="2" stroke-dasharray="8 8"/>
 <text x="508" y="55">x=5 excluded</text>
 <line x1="90" y1="115" x2="655" y2="115" stroke="currentColor" stroke-width="2" stroke-dasharray="8 8"/>
 <text x="95" y="105">y=−3 minimum / boundary example</text>
 <circle cx="500" cy="210" r="8" fill="none" stroke="currentColor" stroke-width="3"/>
 </svg>`,
 examples:[
  ["Combine restrictions","Find the domain of √(x+2)/(x−4).","x≥−2, with x≠4."],
  ["Range reasoning","For y=3(x−1)²−7, identify the range and explain why.","y≥−7 because the squared term is nonnegative and the vertex is the minimum."],
  ["Context transfer","A model uses n for the number of seats in a row with at most 40 seats.","Use integer inputs, typically n∈{0,1,…,40}, rather than every real number."]
 ]},
"u01-l03":{
 title:"Transformations move points predictably",
 caption:"Track a few anchor points before trusting a graphing tool. Point mapping makes horizontal changes less mysterious.",
 svg:`<svg viewBox="0 0 720 300" role="img" aria-labelledby="a2v-title a2v-desc"><title id="a2v-title">Parent and transformed parabola</title><desc id="a2v-desc">A parent parabola and a parabola shifted right and up are shown on one coordinate plane.</desc>
 <line x1="70" y1="245" x2="675" y2="245" stroke="currentColor" stroke-width="3"/><line x1="260" y1="25" x2="260" y2="280" stroke="currentColor" stroke-width="3"/>
 <path d="M140 55 Q260 245 380 55" fill="none" stroke="currentColor" stroke-width="4"/>
 <path d="M310 95 Q430 225 550 95" fill="none" stroke="currentColor" stroke-width="4" stroke-dasharray="10 6"/>
 <circle cx="260" cy="245" r="6"/><circle cx="430" cy="225" r="6"/>
 <text x="120" y="45">y=x²</text><text x="500" y="78">y=(x−3)²+1</text>
 </svg>`,
 examples:[
  ["Anchor-point method","If (2,4) is on y=f(x), map it to y=f(x−5)+3.","(7,7). Right 5 changes x to 7; up 3 changes y to 7."],
  ["Boundary case","Explain why y=f(−x) is not a vertical reflection.","The negative is applied to the input, so it reflects the graph horizontally across the y-axis."],
  ["Parameter reasoning","For y=a(x−h)²+k, which parameters locate the vertex?","h and k; the vertex is (h,k), while a controls opening direction and vertical scale."]
 ]},
"u01-l04":{
 title:"Composition is an ordered pipeline",
 caption:"The output of the inner function becomes the input of the outer function. Order matters and domains must survive every stage.",
 svg:`<svg viewBox="0 0 720 245" role="img" aria-labelledby="a2v-title a2v-desc"><title id="a2v-title">Function composition pipeline</title><desc id="a2v-desc">Input x passes through g then f to produce f of g of x.</desc>
 <rect x="45" y="80" width="135" height="80" rx="12" fill="none" stroke="currentColor" stroke-width="3"/><text x="112" y="128" text-anchor="middle">x</text>
 <rect x="285" y="60" width="150" height="120" rx="12" fill="none" stroke="currentColor" stroke-width="3"/><text x="360" y="112" text-anchor="middle">g</text><text x="360" y="140" text-anchor="middle">inner</text>
 <rect x="540" y="60" width="150" height="120" rx="12" fill="none" stroke="currentColor" stroke-width="3"/><text x="615" y="112" text-anchor="middle">f</text><text x="615" y="140" text-anchor="middle">outer</text>
 <path d="M180 120 H285 M435 120 H540" stroke="currentColor" stroke-width="4"/><text x="470" y="102">g(x)</text><text x="592" y="215" text-anchor="middle">result: f(g(x))</text>
 </svg>`,
 examples:[
  ["Compute both orders","For f(x)=x+1 and g(x)=x², compare f∘g and g∘f.","f(g(x))=x²+1; g(f(x))=(x+1)². They are not equal."],
  ["Domain boundary","Let f(x)=√x and g(x)=x−7. Find the domain of f∘g.","x≥7 because the inner output x−7 must be nonnegative."],
  ["Decompose","Write h(x)=(3x−4)⁵ as a composition.","One choice: g(x)=3x−4 and f(u)=u⁵, so h=f∘g."]
 ]},
"u01-l05":{
 title:"Inverse functions undo and reflect",
 caption:"Algebraic undoing, coordinate swapping, and reflection across y=x are three views of the same inverse relationship.",
 svg:`<svg viewBox="0 0 720 300" role="img" aria-labelledby="a2v-title a2v-desc"><title id="a2v-title">Function and inverse reflection</title><desc id="a2v-desc">Two lines are reflected across the line y equals x.</desc>
 <line x1="75" y1="255" x2="665" y2="255" stroke="currentColor" stroke-width="3"/><line x1="210" y1="35" x2="210" y2="280" stroke="currentColor" stroke-width="3"/>
 <line x1="90" y1="275" x2="650" y2="35" stroke="currentColor" stroke-width="2" stroke-dasharray="9 7"/><text x="555" y="72">y=x</text>
 <line x1="145" y1="255" x2="510" y2="70" stroke="currentColor" stroke-width="4"/><line x1="210" y1="220" x2="590" y2="145" stroke="currentColor" stroke-width="4" stroke-dasharray="10 6"/>
 <text x="475" y="62">f</text><text x="590" y="135">f⁻¹</text>
 </svg>`,
 examples:[
  ["Algebraic inverse","Find the inverse of f(x)=(x−5)/3.","f⁻¹(x)=3x+5."],
  ["Verify by composition","Verify f(x)=4x−7 and g(x)=(x+7)/4 are inverses.","f(g(x))=x and g(f(x))=x, so the functions undo each other."],
  ["Restriction case","Why must f(x)=x² be restricted before using √x as its inverse?","Without a restriction, x² is not one-to-one; both x and −x produce the same output."]
 ]},
"u01-l06":{
 title:"Piecewise rules make boundaries visible",
 caption:"A piecewise graph is only correct when each rule is paired with the correct interval and boundary inclusion.",
 svg:`<svg viewBox="0 0 720 300" role="img" aria-labelledby="a2v-title a2v-desc"><title id="a2v-title">Piecewise function graph</title><desc id="a2v-desc">One line segment ends with an open circle and another begins with a closed circle at the boundary x equals 2.</desc>
 <line x1="65" y1="245" x2="670" y2="245" stroke="currentColor" stroke-width="3"/><line x1="300" y1="35" x2="300" y2="280" stroke="currentColor" stroke-width="3"/>
 <line x1="110" y1="210" x2="410" y2="105" stroke="currentColor" stroke-width="4"/>
 <circle cx="410" cy="105" r="8" fill="none" stroke="currentColor" stroke-width="4"/>
 <line x1="410" y1="160" x2="640" y2="160" stroke="currentColor" stroke-width="4"/>
 <circle cx="410" cy="160" r="8" fill="currentColor"/>
 <text x="420" y="270">boundary x=2</text>
 </svg>`,
 examples:[
  ["Boundary evaluation","For p(x)=x+2 when x<1 and p(x)=4 when x≥1, find p(1).","p(1)=4 because the second rule includes equality."],
  ["Absolute-value connection","Rewrite |x−3| as a piecewise function.","x−3 for x≥3 and 3−x for x<3."],
  ["Continuity test","For f(x)=2x for x<2 and f(x)=x+2 for x≥2, test continuity at x=2.","Left-hand value approaches 4 and the defined/right value is 4, so the pieces meet continuously."]
 ]}
};
const data=lessons[id];if(!data)return;
const worked=document.querySelector('[data-flow-step="worked"]')||document.querySelector(".worked")?.closest("section");
if(!worked||document.getElementById("a2Unit01DepthCompanion"))return;
const section=document.createElement("section");
section.id="a2Unit01DepthCompanion";
section.className="lesson-section algebra2-flow-card";
section.setAttribute("data-flow-step","represent");
section.innerHTML=`<p class="algebra2-flow-kicker">03B · Represent</p><h2>${data.title}</h2><p>${data.caption}</p>
<div class="a2-depth-visual">${data.svg}</div>
<h3>Deep example studio</h3><div class="a2-depth-example-grid">${data.examples.map((e,i)=>`<article><p class="eyebrow">Example ${i+1}</p><h4>${e[0]}</h4><p><strong>Prompt:</strong> ${e[1]}</p><p><strong>Resolution:</strong> ${e[2]}</p></article>`).join("")}</div>
<p class="notice"><strong>Representation check:</strong> explain the same idea in at least two forms—symbolic, graphical, tabular, verbal, or contextual—and state any domain or boundary restriction.</p>`;
worked.after(section);
const style=document.createElement("style");
style.textContent=`
#a2Unit01DepthCompanion{font-size:16px;line-height:1.65}
#a2Unit01DepthCompanion .a2-depth-visual{max-width:760px;margin:18px auto;padding:14px;border:1px solid currentColor;border-radius:7px;overflow:auto}
#a2Unit01DepthCompanion svg{display:block;width:100%;min-width:520px;height:auto}
#a2Unit01DepthCompanion svg text{font-size:18px;fill:currentColor;font-family:"Brandon Grotesque","Avenir Next",Arial,sans-serif}
#a2Unit01DepthCompanion .a2-depth-example-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
#a2Unit01DepthCompanion article{border:1px solid currentColor;border-radius:7px;padding:14px;min-width:0}
#a2Unit01DepthCompanion h4,#a2Unit01DepthCompanion p{font-size:16px}
@media(max-width:850px){#a2Unit01DepthCompanion .a2-depth-example-grid{grid-template-columns:1fr}}
@media print{#a2Unit01DepthCompanion .a2-depth-example-grid{grid-template-columns:1fr 1fr}#a2Unit01DepthCompanion svg{min-width:0}}
`;
document.head.appendChild(style);
})();
