/* Algebra II exceptional-depth representation companion · Units 02–03
   Loaded automatically by lesson-tools for matching lessons.
*/
(()=>{"use strict";
if(document.getElementById("a2DepthCompanionV2"))return;
const id=document.body?.dataset?.lessonId||"";
const data={
"u02-l01":{kind:"structure",title:"Read polynomial structure before calculating",caption:"Degree, leading term, coefficients, and missing powers predict behavior before any arithmetic.",examples:[
["Boundary case","For P(x)=(a−2)x⁵+4x³−1, what happens when a=2?","The fifth-degree term disappears; the polynomial becomes degree 3."],
["Representation change","Rewrite −4+2x³−x⁶ in standard form and identify the leading term.","−x⁶+2x³−4; leading term −x⁶."],
["Transfer","Explain why 3/x+2x is not a polynomial.","3/x=3x⁻¹ uses a negative exponent, which violates polynomial exponent rules."]]},
"u02-l02":{kind:"operations",title:"Equivalent forms preserve the same polynomial",caption:"Expansion, combination, and factoring should change form without changing value.",examples:[
["Verification","Expand (x−3)(x+4), then test x=2 in both forms.","x²+x−12; both forms give −6 at x=2."],
["Error repair","Why is subtracting a polynomial different from subtracting only its first term?","The negative sign distributes to every term of the polynomial."],
["Transfer","How can standard form prove two polynomial expressions are identical?","Transform both exactly to the same coefficients for every power of x."]]},
"u02-l03":{kind:"end",title:"The leading term governs the far ends",caption:"Local wiggles may be complicated, but degree parity and leading-coefficient sign control global end behavior.",examples:[
["Compare","Contrast 3x⁴−2x+1 and −3x⁴−2x+1.","Both are even degree; the first rises at both ends, the second falls at both ends."],
["Boundary case","What if the stated leading coefficient becomes zero?","Re-identify the actual leading nonzero term before predicting end behavior."],
["Model critique","A polynomial population model becomes negative far outside the data range. What changes?","The interpretation domain must be restricted; extrapolation is not automatically valid."]]},
"u02-l04":{kind:"icycle",title:"Powers of i form a four-step cycle",caption:"Reduce large exponents modulo 4, then connect multiplication by i to a quarter-turn in the complex plane.",examples:[
["Cycle","Simplify i⁵³.","53 mod 4=1, so i⁵³=i."],
["Combined reasoning","Simplify i⁵³+i²².","i+(−1)=−1+i."],
["Representation","What does multiplying by i do to a+bi?","It maps (a,b) to (−b,a), a 90° counterclockwise rotation."]]},
"u02-l05":{kind:"complex",title:"Complex arithmetic has algebraic and geometric meaning",caption:"Operate symbolically while tracking real and imaginary coordinates in the complex plane.",examples:[
["Conjugate product","Compute (2+i)(2−i).","5; conjugates eliminate the imaginary cross terms."],
["Division","Simplify (3+4i)/(1−i).","Multiply by 1+i to obtain (−1+7i)/2."],
["Transfer","If |z|=3 and |w|=5, predict |zw|.","15 because modulus is multiplicative."]]},
"u02-l06":{kind:"quadratic",title:"A negative discriminant moves the zeros off the real axis",caption:"The parabola may have no x-intercepts while the quadratic still has two complex zeros.",examples:[
["Discriminant","For x²−4x+13=0, interpret Δ.","Δ=−36, so the roots are a nonreal conjugate pair."],
["Exact solution","Solve 2x²+4x+5=0.","x=−1±(√6/2)i."],
["Construct","Build a monic real quadratic with zero 3+2i.","Use conjugate 3−2i: x²−6x+13."]]},
"u02-l07":{kind:"plane",title:"Conjugate, modulus, and rotation share one plane",caption:"Coordinates make complex operations visible: conjugation reflects, modulus measures distance, and multiplication by i rotates.",examples:[
["Distance","Find |−5+12i|.","13."],
["Conjugate","Reflect −2+5i across the real axis.","−2−5i."],
["Rotation","Multiply 2−i by i.","1+2i, the coordinate image after a quarter-turn counterclockwise."]]},
"u02-l08":{kind:"fta",title:"Degree counts zeros when multiplicity and complex roots are included",caption:"Complete factorization over the complex numbers reconciles degree, multiplicity, conjugate pairs, and linear factors.",examples:[
["Count","How many complex zeros does a degree-7 polynomial have counting multiplicity?","Exactly 7."],
["Conjugate requirement","A real polynomial has zero −1+4i. What else is required?","−1−4i."],
["Construct","Build a real polynomial from zeros 2, −3, and i.","Include −i: (x−2)(x+3)(x²+1), up to a nonzero leading constant."]]},

"u03-l01":{kind:"division",title:"Polynomial division preserves a dividend identity",caption:"Every step should support dividend = divisor × quotient + remainder.",examples:[
["Missing term","Why insert 0x² when dividing x³−4x+1?","It keeps like powers aligned through subtraction."],
["Verify","Check (2x³+3x²−8x−12)/(x+2).","Quotient 2x²−x−6; multiplying back gives the dividend."],
["Transfer","Predict quotient degree for degree 8 divided by degree 3.","Degree 5, assuming nonzero leading coefficients."]]},
"u03-l02":{kind:"synthetic",title:"Synthetic division compresses the same linear-division structure",caption:"Coefficients flow through repeated multiply-and-add steps, and the final entry is the remainder.",examples:[
["Sign","For divisor x+3, what synthetic number is used?","−3."],
["Missing coefficient","Encode x³−4x+7 for synthetic division.","1, 0, −4, 7."],
["Interpret","A synthetic row ends 2,−1,−1,4. What is special about 4?","It is the remainder, not a quotient coefficient."]]},
"u03-l03":{kind:"factor",title:"Remainder, factor, zero, and intercept are linked representations",caption:"Exact evaluation turns a division statement into factor and graph evidence.",examples:[
["Remainder","If P(2)=−3, what is the remainder on division by x−2?","−3."],
["Factor","If P(−4)=0, what factor follows?","x+4."],
["Parameter","For P(x)=x³+kx²−5x+3, require x−1 as a factor.","Set P(1)=0, so k=1."]]},
"u03-l04":{kind:"candidates",title:"The Rational Root Theorem narrows the search; it does not finish it",caption:"Candidate generation and exact testing are separate steps.",examples:[
["Candidate set","List candidates for 2x³+x−3.","±1, ±3, ±1/2, ±3/2."],
["Verification","A graph suggests 1.5. What exact test follows?","Verify 3/2 is a theorem candidate, then evaluate or divide exactly."],
["Limitation","Why might √2 be absent from the list?","The theorem only lists possible rational roots."]]},
"u03-l05":{kind:"solve",title:"Solve higher-degree equations by reducing degree systematically",caption:"A verified zero creates a factor; divide, then continue until every root is accounted for.",examples:[
["Factor chain","Solve x³−4x²−x+4=0.","Factor by grouping: (x−4)(x−1)(x+1)=0."],
["Completeness","Why not stop after finding one quartic zero?","The remaining cubic can contain additional zeros."],
["Count","What confirms completeness for degree 6?","Six complex zeros counting multiplicity must be represented."]]},
"u03-l06":{kind:"multiplicity",title:"Multiplicity determines how the graph meets an intercept",caption:"Even multiplicity touches; odd multiplicity crosses; larger multiplicity flattens the local graph.",examples:[
["Read factors","Describe (x+3)²(x−1)³ near each zero.","Touch at −3; cross with flattening at 1."],
["Degree","Zeros with multiplicities 2,4,1 require what least degree?","7."],
["Reconstruct","Combine multiplicity behavior with leading-term end behavior.","Use both local intercept behavior and global ends; neither alone determines the full graph."]]},
"u03-l07":{kind:"residual",title:"A model is judged by residuals, domain, context, and simplicity",caption:"A strong fit is evidence, not permission for unlimited extrapolation or causal claims.",examples:[
["Residual","Observed 12, predicted 10.5. Find observed−predicted.","1.5."],
["Model choice","Cubic and degree-8 fits are similar, but the degree-8 model oscillates wildly at the edges.","Prefer the simpler validated model unless added complexity has defensible structure."],
["Limit","Why does R²=0.99 not prove causation?","Good fit describes association within the data; it does not establish a causal mechanism."]]}
};
const item=data[id];if(!item)return;
const svg=(kind)=>{
const common='viewBox="0 0 760 300" role="img" aria-labelledby="a2v-title a2v-desc"';
const title=t=>'<title id="a2v-title">'+t+'</title>';
const desc=d=>'<desc id="a2v-desc">'+d+'</desc>';
const axis='<line x1="70" y1="245" x2="700" y2="245" stroke="currentColor" stroke-width="3"/><line x1="260" y1="35" x2="260" y2="275" stroke="currentColor" stroke-width="3"/>';
if(kind==="structure")return `<svg ${common}>${title("Polynomial structure ladder")}${desc("Terms are ordered from highest degree to constant to identify leading structure.")}<text x="70" y="65">−x⁶</text><text x="210" y="105">+ 0x⁵ + 0x⁴</text><text x="430" y="145">+ 2x³</text><text x="565" y="185">+ 0x² + 0x</text><text x="660" y="225">− 4</text><path d="M85 78 L650 228" stroke="currentColor" stroke-width="2" stroke-dasharray="8 7"/></svg>`;
if(kind==="operations")return `<svg ${common}>${title("Polynomial area model")}${desc("A rectangle is partitioned to represent distribution of two binomials.")}<rect x="160" y="70" width="420" height="160" fill="none" stroke="currentColor" stroke-width="3"/><line x1="370" y1="70" x2="370" y2="230" stroke="currentColor" stroke-width="2"/><line x1="160" y1="150" x2="580" y2="150" stroke="currentColor" stroke-width="2"/><text x="265" y="120">x·x</text><text x="470" y="120">x·4</text><text x="265" y="200">−3·x</text><text x="470" y="200">−3·4</text></svg>`;
if(kind==="end")return `<svg ${common}>${title("Polynomial end behavior")}${desc("Two curves illustrate even positive and odd negative end behaviors.")}${axis}<path d="M95 70 Q260 255 425 70" fill="none" stroke="currentColor" stroke-width="4"/><path d="M440 65 C500 70 520 220 675 235" fill="none" stroke="currentColor" stroke-width="4" stroke-dasharray="10 6"/><text x="95" y="55">even, + leading</text><text x="485" y="55">odd, − leading</text></svg>`;
if(kind==="icycle")return `<svg ${common}>${title("Cycle of powers of i")}${desc("A four-node cycle shows 1, i, negative 1, and negative i repeating.")}<circle cx="380" cy="150" r="100" fill="none" stroke="currentColor" stroke-width="3"/><text x="380" y="35" text-anchor="middle">i</text><text x="515" y="155">−1</text><text x="380" y="285" text-anchor="middle">−i</text><text x="225" y="155">1</text><path d="M300 80 Q380 30 460 80" fill="none" stroke="currentColor" stroke-width="3"/><text x="380" y="78" text-anchor="middle">× i</text></svg>`;
if(kind==="complex"||kind==="plane")return `<svg ${common}>${title("Complex plane operations")}${desc("A point and its conjugate are reflected across the real axis; a radius from the origin represents modulus.")}${axis}<line x1="260" y1="45" x2="260" y2="275" stroke="currentColor" stroke-width="3"/><circle cx="480" cy="105" r="8" fill="currentColor"/><circle cx="480" cy="385" r="0"/><circle cx="480" cy="245" r="8" fill="currentColor"/><line x1="260" y1="245" x2="480" y2="105" stroke="currentColor" stroke-width="3"/><line x1="480" y1="105" x2="480" y2="245" stroke="currentColor" stroke-width="2" stroke-dasharray="7 7"/><text x="495" y="100">a+bi</text><text x="495" y="265">a−bi</text><text x="310" y="155">|z|</text></svg>`;
if(kind==="quadratic")return `<svg ${common}>${title("Quadratic with no real intercepts")}${desc("An upward parabola stays above the x-axis, while a note indicates complex conjugate zeros.")}${axis}<path d="M135 70 Q330 215 525 70" fill="none" stroke="currentColor" stroke-width="4"/><text x="520" y="100">Δ &lt; 0</text><text x="520" y="135">complex conjugate zeros</text></svg>`;
if(kind==="fta")return `<svg ${common}>${title("Degree and zero count")}${desc("A degree five polynomial branches to five zero slots, including a conjugate pair.")}<text x="380" y="45" text-anchor="middle">degree 5</text><path d="M380 55 V95 M380 95 H125 M380 95 H635" stroke="currentColor" stroke-width="3"/><g><text x="125" y="140">r₁</text><text x="250" y="140">r₂</text><text x="375" y="140">a+bi</text><text x="500" y="140">a−bi</text><text x="625" y="140">r₅</text></g><text x="380" y="215" text-anchor="middle">multiplicity + conjugacy complete the count</text></svg>`;
if(kind==="division")return `<svg ${common}>${title("Polynomial division identity")}${desc("Boxes show divisor times quotient plus remainder reconstructing the dividend.")}<rect x="55" y="95" width="175" height="90" rx="7" fill="none" stroke="currentColor" stroke-width="3"/><rect x="295" y="95" width="175" height="90" rx="7" fill="none" stroke="currentColor" stroke-width="3"/><rect x="545" y="95" width="145" height="90" rx="7" fill="none" stroke="currentColor" stroke-width="3"/><text x="142" y="145" text-anchor="middle">divisor × quotient</text><text x="260" y="145">+</text><text x="382" y="145" text-anchor="middle">remainder</text><text x="505" y="145">=</text><text x="617" y="145" text-anchor="middle">dividend</text></svg>`;
if(kind==="synthetic")return `<svg ${common}>${title("Synthetic division flow")}${desc("Coefficient row shows repeated multiply and add operations ending in a remainder.")}<text x="75" y="80">c</text><line x1="115" y1="55" x2="115" y2="235" stroke="currentColor" stroke-width="3"/><text x="170" y="80">aₙ</text><text x="300" y="80">aₙ₋₁</text><text x="430" y="80">…</text><text x="570" y="80">a₀</text><path d="M175 105 L300 155 L430 105 L570 155" fill="none" stroke="currentColor" stroke-width="3"/><line x1="145" y1="180" x2="635" y2="180" stroke="currentColor" stroke-width="2"/><text x="570" y="220">remainder</text></svg>`;
if(kind==="factor")return `<svg ${common}>${title("Factor zero intercept equivalence")}${desc("Three linked boxes show factor x minus r, equation P of r equals zero, and x-intercept r comma zero.")}<rect x="55" y="95" width="190" height="90" rx="7" fill="none" stroke="currentColor" stroke-width="3"/><rect x="285" y="95" width="190" height="90" rx="7" fill="none" stroke="currentColor" stroke-width="3"/><rect x="515" y="95" width="190" height="90" rx="7" fill="none" stroke="currentColor" stroke-width="3"/><text x="150" y="145" text-anchor="middle">factor (x−r)</text><text x="380" y="145" text-anchor="middle">P(r)=0</text><text x="610" y="145" text-anchor="middle">intercept (r,0)</text><path d="M245 140 H285 M475 140 H515" stroke="currentColor" stroke-width="3"/></svg>`;
if(kind==="candidates")return `<svg ${common}>${title("Rational root candidate filter")}${desc("Factors of the constant and leading coefficient combine into p over q candidates, then exact testing identifies actual zeros.")}<text x="105" y="65">factors of p</text><text x="540" y="65">factors of q</text><path d="M125 85 L315 145 M565 85 L445 145" stroke="currentColor" stroke-width="3"/><rect x="285" y="125" width="190" height="70" rx="7" fill="none" stroke="currentColor" stroke-width="3"/><text x="380" y="168" text-anchor="middle">± p/q candidates</text><path d="M380 195 V240" stroke="currentColor" stroke-width="3"/><text x="380" y="270" text-anchor="middle">test exactly → actual zeros</text></svg>`;
if(kind==="solve")return `<svg ${common}>${title("Polynomial factor chain")}${desc("A higher-degree polynomial is reduced after each verified zero until linear or quadratic factors remain.")}<text x="380" y="45" text-anchor="middle">degree 4 polynomial</text><path d="M380 55 V95" stroke="currentColor" stroke-width="3"/><rect x="250" y="95" width="260" height="55" rx="7" fill="none" stroke="currentColor" stroke-width="3"/><text x="380" y="130" text-anchor="middle">verified factor × cubic</text><path d="M380 150 V190" stroke="currentColor" stroke-width="3"/><rect x="250" y="190" width="260" height="55" rx="7" fill="none" stroke="currentColor" stroke-width="3"/><text x="380" y="225" text-anchor="middle">continue until all zeros counted</text></svg>`;
if(kind==="multiplicity")return `<svg ${common}>${title("Multiplicity graph behavior")}${desc("One curve touches and turns at an even-multiplicity zero; another crosses with flattening at an odd-multiplicity zero.")}${axis}<path d="M100 120 Q185 245 270 120" fill="none" stroke="currentColor" stroke-width="4"/><path d="M390 225 C455 225 500 125 565 125 C615 125 650 75 690 65" fill="none" stroke="currentColor" stroke-width="4"/><text x="120" y="90">even: touch</text><text x="505" y="90">odd &gt;1: cross + flatten</text></svg>`;
return `<svg ${common}>${title("Polynomial model and residual evidence")}${desc("Observed points, a fitted curve, and a residual baseline illustrate model validation.")}<circle cx="125" cy="190" r="7"/><circle cx="220" cy="145" r="7"/><circle cx="315" cy="130" r="7"/><circle cx="410" cy="105" r="7"/><circle cx="505" cy="80" r="7"/><path d="M100 200 Q300 120 540 70" fill="none" stroke="currentColor" stroke-width="3"/><line x1="120" y1="245" x2="650" y2="245" stroke="currentColor" stroke-width="2"/><text x="570" y="235">residual zero line</text></svg>`;
};
const worked=document.querySelector('[data-flow-step="worked"]');
if(!worked)return;
const section=document.createElement("section");
section.id="a2DepthCompanionV2";section.className="lesson-section algebra2-flow-card";section.dataset.flowStep="represent";
section.innerHTML=`<p class="algebra2-flow-kicker">03B · Represent</p><h2>${item.title}</h2><p>${item.caption}</p><div class="a2-depth-visual">${svg(item.kind)}</div><h3>Deep example studio</h3><div class="a2-depth-example-grid">${item.examples.map((e,i)=>`<article><p class="eyebrow">Example ${i+1}</p><h4>${e[0]}</h4><p><strong>Prompt:</strong> ${e[1]}</p><p><strong>Resolution:</strong> ${e[2]}</p></article>`).join("")}</div><p class="notice"><strong>Representation check:</strong> express the governing idea in at least two forms and state the condition, restriction, multiplicity, or model limit that controls validity.</p>`;
worked.after(section);
const style=document.createElement("style");
style.textContent=`#a2DepthCompanionV2{font-size:16px;line-height:1.65}#a2DepthCompanionV2 .a2-depth-visual{max-width:780px;margin:18px auto;padding:14px;border:1px solid currentColor;border-radius:7px;overflow:auto}#a2DepthCompanionV2 svg{display:block;width:100%;min-width:540px;height:auto}#a2DepthCompanionV2 svg text{font-size:18px;fill:currentColor;font-family:"Brandon Grotesque","Avenir Next",Arial,sans-serif}#a2DepthCompanionV2 .a2-depth-example-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}#a2DepthCompanionV2 article{border:1px solid currentColor;border-radius:7px;padding:14px;min-width:0}#a2DepthCompanionV2 h4,#a2DepthCompanionV2 p{font-size:16px}@media(max-width:850px){#a2DepthCompanionV2 .a2-depth-example-grid{grid-template-columns:1fr}}@media print{#a2DepthCompanionV2 .a2-depth-example-grid{grid-template-columns:1fr 1fr}#a2DepthCompanionV2 svg{min-width:0}}`;
document.head.appendChild(style);
})();