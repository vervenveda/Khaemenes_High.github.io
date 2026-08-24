(()=>{
"use strict";
const VERSION="1.0";
const MASTERY=80;
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const text=v=>String(v??"").trim();

const FAMILIES={
 reasoning:{label:"Mathematical reasoning",steps:[
  "Name the mathematical claim before manipulating symbols.",
  "Identify the definition, property, or equality rule that authorizes the next step.",
  "Change only what the rule permits; do not replace reasoning with phrases such as ‘move it.’",
  "Check the result independently—often by substitution, reverse operations, a second representation, or a counterexample.",
  "State why the evidence supports or disproves the original claim."
 ],example:["Claim: x = 6 solves 2x + 5 = 17.","Substitute 6 into the original equation: 2(6)+5=17.","The left side becomes 17, matching the right side, so the proposed value is verified."]},
 numbers:{label:"Number structure",steps:[
  "Identify the number form exactly before converting or approximating it.",
  "Classify using definitions: integer, rational, irrational, real, interval endpoint, or other required set.",
  "Keep exact forms exact until an approximation is actually requested.",
  "When translating inequalities and intervals, decide separately whether each endpoint is included.",
  "Check whether the classification or representation still names the same values."
 ],example:["Translate −3 < x ≤ 8.","−3 is excluded, so use a parenthesis. 8 is included, so use a bracket.","Interval form: (−3, 8]."]},
 operations:{label:"Operations and algebraic structure",steps:[
  "Read grouping, powers, multiplication/division, and addition/subtraction as structure—not as a left-to-right string.",
  "Simplify only operations whose priority is established.",
  "When using a property, say what changes: order, grouping, or distribution.",
  "Keep signs attached to their terms and distribute a negative factor to every term in the group.",
  "Verify by evaluating the original and rewritten expressions at the same test value when useful."
 ],example:["Evaluate 18 ÷ 3 × 2.","Multiplication and division have equal priority, so work left to right: 18÷3=6.","Then 6×2=12."]},
 units:{label:"Units, rates, and dimensional analysis",steps:[
  "Write the quantity together with its unit; the unit is part of the mathematics.",
  "Choose a conversion ratio equal to 1 and orient it so the unwanted unit cancels.",
  "Multiply numerators and denominators without dropping units.",
  "Check dimensional consistency before trusting the number.",
  "State the result with the requested unit and reasonable precision."
 ],example:["Convert 72 km/h to m/s.","72 km/h × 1000 m/1 km × 1 h/3600 s.","Kilometers and hours cancel, leaving 20 m/s."]},
 precision:{label:"Precision and error",steps:[
  "Separate accuracy (closeness to a reference) from precision (resolution/repeatability).",
  "Identify the precision justified by the measuring tool or source data.",
  "Carry enough working digits to avoid premature rounding.",
  "For percent error, compute |measured−accepted| ÷ |accepted| × 100%.",
  "Report a result whose digits do not claim more information than the evidence supports."
 ],example:["Measured 106; accepted 100.","Absolute error = |106−100|=6.","Percent error = 6/100 ×100%=6%."]},
 equations:{label:"Solving equations",steps:[
  "Read the equation as a balance: both sides have equal value.",
  "Simplify each side when useful, including distribution and combining like terms.",
  "Use inverse operations on the entire side to isolate the variable; apply the same valid operation to both sides.",
  "Continue until the variable is isolated or the equation reduces to an identity/contradiction.",
  "Substitute the candidate into the original equation—not merely the last line—to verify it.",
  "If the equation came from a context, decide whether the verified value is meaningful in that context."
 ],example:["Solve 3x+4=19.","Subtract 4 from both sides: 3x=15. Divide both sides by 3: x=5.","Check: 3(5)+4=19, so x=5 is verified."]},
 proportions:{label:"Proportions and percent relationships",steps:[
  "Identify what each ratio compares and keep corresponding quantities in matching positions.",
  "Translate percents to decimals or fractions before calculating.",
  "For a proportion a/b=c/d, cross-products come from multiplying both sides by bd; they are not a magic shortcut.",
  "Solve the resulting equation and preserve units.",
  "Check that the scale, percent, or rate is plausible in context."
 ],example:["3 cups serve 8 people. Flour for 20 people?", "Use f/20=3/8.","8f=60, so f=7.5 cups."]},
 inequalities:{label:"Inequalities and solution sets",steps:[
  "Solve much like an equation while remembering that the result represents many possible values.",
  "Add or subtract the same quantity on both sides without changing the inequality direction.",
  "When multiplying or dividing by a negative number, reverse the inequality symbol.",
  "For compound inequalities, decide whether conditions mean intersection (‘and’) or union (‘or’).",
  "Represent the answer consistently as an inequality, interval, graph, or contextual range.",
  "Test a value inside and outside the proposed solution set."
 ],example:["Solve −2x+5>11.","Subtract 5: −2x>6. Divide by −2 and reverse the sign.","x<−3."]},
 functions:{label:"Functions and representations",steps:[
  "Identify the input, output, rule, and any contextual restrictions.",
  "To evaluate, substitute the input everywhere the variable appears and preserve grouping.",
  "Determine domain from the rule and from the real-world context; determine range from resulting outputs.",
  "Move among equation, table, graph, and verbal description without changing the relationship.",
  "Use intercepts, rate of change, extrema, or transformations to describe important features.",
  "Check that each allowed input has exactly one output."
 ],example:["For f(x)=2x−3, find f(5).","Substitute 5: f(5)=2(5)−3.","f(5)=7."]},
 linear:{label:"Linear functions and models",steps:[
  "Identify two points or a rate-and-starting-value description.",
  "Compute slope as change in output ÷ change in input: (y₂−y₁)/(x₂−x₁).",
  "Choose a useful form—slope-intercept, point-slope, or standard form—and substitute known information.",
  "Interpret slope and intercept with units and context.",
  "Use the model only over a defensible domain and compare predictions with observed values when data are involved.",
  "Check a known point in the equation."
 ],example:["Points (1,4) and (3,10).","Slope=(10−4)/(3−1)=6/2=3.","Using y=3x+b and (1,4): b=1, so y=3x+1."]},
 systems:{label:"Systems and simultaneous constraints",steps:[
  "Write each condition as an equation or inequality using the same variable meanings.",
  "Choose graphing, substitution, or elimination based on the structure you see.",
  "Solve for a common ordered pair or feasible region.",
  "Substitute the solution into every original condition; satisfying only one equation is not enough.",
  "Classify one solution, no solution, or infinitely many solutions from the relationships.",
  "Interpret the intersection or feasible region in context."
 ],example:["x+y=7 and x−y=1.","Add the equations: 2x=8, so x=4. Then y=3.","Check (4,3) in both equations."]},
 exponents:{label:"Exponents, sequences, and exponential change",steps:[
  "Decide whether the situation uses repeated addition (linear/arithmetic) or repeated multiplication (exponential/geometric).",
  "Apply exponent laws only to the operations they govern: products, quotients, and powers of powers.",
  "For exponential models, identify initial value and growth/decay factor per time interval.",
  "Keep the time unit consistent with the exponent.",
  "Compare successive differences or ratios to verify the pattern.",
  "Interpret predictions cautiously outside the observed domain."
 ],example:["A value starts at 200 and grows 5% each year.","Growth factor=1.05.","After t years: V=200(1.05)^t."]},
 polynomials:{label:"Polynomial structure and factoring",steps:[
  "Write terms clearly with signs attached and identify degree, coefficients, and like terms.",
  "For addition/subtraction, combine only matching variable powers.",
  "For multiplication, distribute every term and apply exponent laws to like bases.",
  "For factoring, first remove the greatest common factor, then look for a recognized pattern.",
  "Verify a factorization by multiplying back to the original polynomial.",
  "When factors represent an equation equal to zero, connect factors to possible zeros."
 ],example:["Factor 12x³+18x².","The GCF is 6x².","12x³+18x²=6x²(2x+3). Redistributing verifies the factorization."]},
 quadratics:{label:"Quadratic functions and equations",steps:[
  "Identify the quadratic form and what you need: graph features, zeros, vertex, or solutions.",
  "Use standard form to read a,b,c; factored form to reveal zeros; vertex form to reveal the vertex and axis.",
  "Choose a solving method that fits the structure: factoring, square roots, completing the square, or quadratic formula.",
  "If using the quadratic formula, substitute a,b,c with signs and simplify the discriminant first.",
  "Connect algebraic solutions to x-intercepts when graphically appropriate.",
  "Verify solutions in the original equation and interpret any contextual restrictions."
 ],example:["Solve x²−5x+6=0.","Factor: (x−2)(x−3)=0.","Zero-product property gives x=2 or x=3; both verify."]},
 rational:{label:"Radical and rational expressions",steps:[
  "State domain restrictions before simplifying or solving; denominators cannot be zero and even-root radicands must meet real-number conditions.",
  "Simplify factors before combining expressions, but never cancel terms across addition.",
  "When solving rational equations, clear denominators with a valid common multiple while preserving restrictions.",
  "When solving radical equations, isolate the radical before raising powers.",
  "Check every candidate in the original problem because clearing denominators or squaring can introduce invalid values.",
  "Report excluded or extraneous values explicitly."
 ],example:["Solve √(x+1)=5.","Square both sides: x+1=25, so x=24.","Check: √25=5, so x=24 is valid."]},
 statistics:{label:"Data, statistics, and evidence",steps:[
  "Identify the variables, units, population/sample, and the question the data can actually answer.",
  "Choose a representation that matches the data type and comparison you need.",
  "Calculate summary measures carefully and keep the denominator visible for percentages.",
  "For association or regression, distinguish pattern from causation and inspect residuals or outliers.",
  "Compare centers and spreads rather than relying on one dramatic value.",
  "State limitations, uncertainty, and the source of the data in the conclusion."
 ],example:["Data: 2,5,7,7,9.","Sum=30 and n=5.","Mean=30/5=6; that one number should be interpreted alongside spread and context."]},
 modelling:{label:"Mathematical modelling",steps:[
  "Frame a precise question and identify who or what could be affected by the model.",
  "Define variables, units, domain, assumptions, and data sources before calculating.",
  "Choose a representation or model whose structure matches the relationship.",
  "Calculate, then verify using another representation, a known data point, or an independent method.",
  "Test sensitivity: change an assumption or input and observe how the conclusion changes.",
  "State what the model does not capture, including uncertainty or fairness concerns.",
  "Communicate the conclusion as evidence-based reasoning, not as certainty beyond the model."
 ],example:["A taxi costs $6 plus $2.50 per mile and the budget is $31.","Model 6+2.50m=31, so 2.50m=25 and m=10.","Interpretation: 10 miles is the modelled maximum under the stated fare assumptions."]},
 general:{label:"Algebra mechanics",steps:[
  "Identify the mathematical objects, the requested result, and any units or domain restrictions.",
  "Write the governing definition, property, equation, or representation before calculating.",
  "Work one justified transformation at a time and keep signs/grouping visible.",
  "Check the result independently rather than trusting the final line alone.",
  "Interpret what the result means and state any important limitation."
 ],example:["Start with a precise representation.","Carry out one justified step at a time.","Verify and interpret the result before moving on."]}
};

function familyFor(title,concept){
 const s=(title+" "+concept).toLowerCase();
 if(/model|ethical|sensitivity|assumption|projectile|optimization|fairness/.test(s))return "modelling";
 if(/quadratic|parabola|vertex|discriminant|completing the square/.test(s))return "quadratics";
 if(/system|elimination|substitution.*system|feasible/.test(s))return "systems";
 if(/inequal|absolute value|constraint|interval.*solution/.test(s))return "inequalities";
 if(/rational expression|radical|square root|extraneous|denominator/.test(s))return "rational";
 if(/polynomial|monomial|factor|gcf|special product|zero product/.test(s))return "polynomials";
 if(/exponent|scientific notation|sequence|geometric|exponential|compound interest/.test(s))return "exponents";
 if(/regression|residual|scatter|statistics|data|distribution|box plot|mean|median|probab/.test(s))return "statistics";
 if(/linear function|slope|intercept|line|rate of change/.test(s))return "linear";
 if(/function|domain|range|piecewise|transformation|input|output/.test(s))return "functions";
 if(/proportion|percent|direct variation|unit rate|ratio/.test(s))return "proportions";
 if(/equation|inverse operation|literal|formula|solve|identity|contradiction/.test(s))return "equations";
 if(/unit|dimensional|rate.*unit|conversion/.test(s))return "units";
 if(/precision|round|significant|percent error|accuracy/.test(s))return "precision";
 if(/real number|rational|irrational|interval representation|number system/.test(s))return "numbers";
 if(/order of operations|distributive|property|like term|expression|equivalence/.test(s))return "operations";
 if(/argument|claim|counterexample|verification|reasoning|proof/.test(s))return "reasoning";
 return "general";
}

function lessonContext(){
 const page=window.PAGE_REF||null;
 if(page?.type==="lesson"&&window.ALGEBRA1_DATA){
  const lesson=window.ALGEBRA1_DATA.lessons?.find(l=>Number(l.unit)===Number(page.unit)&&Number(l.number)===Number(page.lesson));
  const unit=window.ALGEBRA1_DATA.units?.find(u=>Number(u.number)===Number(page.unit));
  const bank=window.ALGEBRA1_QUESTIONS||[];
  const questions=(lesson?.question_ids||[]).map(id=>bank.find(q=>q.id===id)).filter(Boolean);
  return lesson?{schema:"course",unit,lesson,questions}:null;
 }
 const match=location.pathname.match(/unit-(\d{2})/i),unitNo=match?Number(match[1]):null;
 const D=unitNo?window[`KHAE_UNIT${String(unitNo).padStart(2,"0")}`]:null;
 const lessonNo=Number(document.body?.dataset?.lesson||0);
 if(D&&lessonNo){
  const lesson=D.lessons?.find(l=>Number(l.number)===lessonNo);
  const questions=(D.questions||[]).filter(q=>Number(q.lesson)===lessonNo);
  return lesson?{schema:"dedicated",unit:D.unit,lesson,questions}:null;
 }
 return null;
}

function style(){
 if(document.getElementById("khaeDeepLessonStyles"))return;
 const s=document.createElement("style");s.id="khaeDeepLessonStyles";s.textContent=`
 .deep-concept-card{position:relative;cursor:pointer;transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease}.deep-concept-card:hover,.deep-concept-card:focus-within{transform:translateY(-2px);border-color:var(--forest,#17392f)!important;box-shadow:0 14px 34px rgba(20,40,32,.10)!important}.deep-concept-open{margin-top:12px;min-height:38px!important;padding:7px 10px!important;border-radius:7px!important;font-size:.78rem!important}.deep-concept-note{margin:8px 0 0;color:var(--muted,#66736d);font-size:.77rem}.deep-dialog{width:min(920px,calc(100vw - 28px));max-height:min(88vh,900px);padding:0;border:1px solid rgba(20,40,32,.2);border-radius:14px;background:#fffdf8;color:#17251f;box-shadow:0 28px 80px rgba(12,28,24,.28);overflow:hidden}.deep-dialog::backdrop{background:rgba(7,18,15,.62);backdrop-filter:blur(4px)}.deep-dialog-shell{max-height:88vh;overflow:auto}.deep-dialog-head{position:sticky;top:0;z-index:2;display:flex;justify-content:space-between;gap:18px;align-items:start;padding:22px 24px;border-bottom:1px solid rgba(20,40,32,.13);background:rgba(255,253,248,.97);backdrop-filter:blur(12px);text-align:left}.deep-dialog-head h2{margin:3px 0 0;color:#17392f;font-family:Cinzel,Georgia,serif;font-size:clamp(1.55rem,3vw,2.35rem);font-weight:500;line-height:1.05}.deep-dialog-kicker{margin:0;color:#71363e;font:600 .67rem Cinzel,Georgia,serif;letter-spacing:.15em;text-transform:uppercase}.deep-close{width:40px;height:40px;flex:0 0 40px;display:grid;place-items:center;border:1px solid rgba(20,40,32,.18);border-radius:7px;background:#fff;color:#17392f;font-size:1.35rem}.deep-dialog-body{padding:24px;text-align:left}.deep-section{margin:0 0 22px;padding:20px;border:1px solid rgba(20,40,32,.12);border-radius:11px;background:#fbf8f0}.deep-section h3{margin:0 0 10px;color:#17392f;font-family:Cinzel,Georgia,serif;font-weight:500}.deep-section p:last-child,.deep-section ol:last-child,.deep-section ul:last-child{margin-bottom:0}.deep-section ol,.deep-section ul{padding-left:1.25rem}.deep-section li{margin:.42rem 0}.deep-worked{background:#f3f7f4}.deep-error{background:#fbf2ed;border-left:4px solid #8a4d42}.deep-check{background:#f5f2e9;border-left:4px solid #b48b45}.deep-example-steps{display:grid;gap:8px;margin-top:12px}.deep-example-step{padding:10px 12px;border:1px solid rgba(20,40,32,.11);border-radius:7px;background:#fff}.focused-check{margin:18px 0 14px;padding:15px;border:1px solid rgba(20,40,32,.14);border-radius:11px;background:#fffdf8}.focused-check-top{display:flex;justify-content:space-between;gap:12px;align-items:center}.focused-check-label{font:600 .72rem Cinzel,Georgia,serif;letter-spacing:.1em;text-transform:uppercase;color:#17392f}.focused-check-count{color:#66736d;font-size:.8rem}.focused-track{height:8px;margin-top:10px;overflow:hidden;border-radius:999px;background:#e7e1d5}.focused-track span{display:block;height:100%;width:0;background:linear-gradient(90deg,#6f9688,#b48b45)}.focused-dots{display:grid;grid-template-columns:repeat(10,minmax(20px,1fr));gap:5px;margin-top:11px}.focused-dot{min-height:28px;padding:0;border:1px solid rgba(20,40,32,.16)!important;border-radius:999px!important;background:#fff!important;color:#53615a!important;font-size:.7rem!important}.focused-dot.answered{color:#fff!important;background:#527866!important;border-color:#527866!important}.focused-dot.current{outline:2px solid #b48b45;outline-offset:2px}.focused-nav{display:flex;justify-content:space-between;gap:8px;margin-top:14px}.focused-nav button{min-height:40px!important;padding:7px 11px!important;border-radius:7px!important}.focused-question[hidden]{display:none!important}.focused-score-lock{opacity:.48;pointer-events:none}.focused-hint{margin:10px 0 0;color:#66736d;font-size:.82rem;text-align:center}@media(max-width:640px){.deep-dialog-body{padding:14px}.deep-dialog-head{padding:17px}.deep-section{padding:15px}.focused-dots{grid-template-columns:repeat(5,1fr)}}@media print{.deep-concept-open,.deep-dialog,.focused-check,.focused-nav{display:none!important}.focused-question[hidden]{display:block!important}}
 `;document.head.appendChild(s);
}

let dialog=null,ctx=null;
function ensureDialog(){
 if(dialog)return dialog;
 dialog=document.createElement("dialog");dialog.className="deep-dialog";dialog.id="deepLessonDialog";
 dialog.innerHTML=`<div class="deep-dialog-shell"><header class="deep-dialog-head"><div><p class="deep-dialog-kicker" id="deepDialogKicker">Deep Lesson</p><h2 id="deepDialogTitle">Lesson</h2></div><button class="deep-close" type="button" aria-label="Close deep lesson">×</button></header><div class="deep-dialog-body" id="deepDialogBody"></div></div>`;
 document.body.appendChild(dialog);
 dialog.querySelector(".deep-close").addEventListener("click",()=>dialog.close());
 dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
 return dialog;
}
function objectiveFor(l,i){const a=l.objectives||[];return a[i%Math.max(a.length,1)]||a[0]||"Explain and apply this idea accurately."}
function workedContent(l,fam){
 if(Array.isArray(l.examples)&&l.examples.length){return l.examples.slice(0,2).map(e=>({problem:e.problem||"Worked example",steps:[e.reasoning||"Work the structure carefully.",`Result: ${e.answer??"Verify the result."}`]}));}
 if(l.mystery)return [{problem:l.mystery,steps:[l.mystery_answer||"Reason through the structure and verify the result."]}];
 return [{problem:FAMILIES[fam].example[0],steps:FAMILIES[fam].example.slice(1)}];
}
function errorContent(l){return l.wrong?{problem:l.wrong,repair:l.wrong_answer||"Find the earliest invalid step and repair it."}:{problem:l.error_analysis||"Identify the first step that changes the mathematical meaning.",repair:"Name the rule that was violated, repair that step, and then continue from the corrected work."}}
function openConcept(index){
 if(!ctx)return;const l=ctx.lesson,concept=l.concepts?.[index]||l.concepts?.[0]||"Core lesson idea",fam=familyFor(l.title,concept),F=FAMILIES[fam],work=workedContent(l,fam),err=errorContent(l),qs=(ctx.questions||[]).slice(index*2,index*2+3);const d=ensureDialog();
 d.querySelector("#deepDialogKicker").textContent=`Unit ${String(ctx.unit?.number||ctx.lesson?.unit||"").padStart(2,"0")} · ${F.label} · Concept ${index+1}`;
 d.querySelector("#deepDialogTitle").textContent=l.title;
 d.querySelector("#deepDialogBody").innerHTML=`
  <section class="deep-section"><h3>The idea</h3><p><strong>${esc(concept)}</strong></p><p>${esc(objectiveFor(l,index))}</p></section>
  <section class="deep-section"><h3>Mechanics · how to do the mathematics</h3><ol>${F.steps.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></section>
  <section class="deep-section deep-worked"><h3>Worked example</h3>${work.map(w=>`<p><strong>${esc(w.problem)}</strong></p><div class="deep-example-steps">${w.steps.map((x,j)=>`<div class="deep-example-step"><strong>${j+1}.</strong> ${esc(x)}</div>`).join("")}</div>`).join("")}</section>
  <section class="deep-section deep-error"><h3>Common error · repair the reasoning</h3><p><strong>${esc(err.problem)}</strong></p><p>${esc(err.repair)}</p></section>
  <section class="deep-section"><h3>Why this works</h3><p>The procedure is not a list of tricks. Each step preserves the mathematical relationship, definition, quantity, or model described in the lesson. If a step cannot be justified, pause there and repair it before continuing.</p><p><strong>Verification habit:</strong> use the original equation, another representation, a unit check, a boundary case, or a known data point whenever one is available.</p></section>
  <section class="deep-section deep-check"><h3>What the lesson check expects</h3><p>The scored check remains separate. These stems show the kinds of thinking represented in the lesson bank without revealing answer choices or answer keys.</p>${qs.length?`<ul>${qs.map(q=>`<li>${esc(q.prompt)}</li>`).join("")}</ul>`:"<p>Be ready to apply the idea, explain a step, diagnose an error, and verify a result.</p>"}<p><strong>Mastery target:</strong> ${MASTERY}% or higher before normal progression.</p></section>`;
 if(typeof d.showModal==="function")d.showModal();else d.setAttribute("open","");
}

function enhanceConcepts(){
 ctx=lessonContext();if(!ctx||!Array.isArray(ctx.lesson?.concepts)||!ctx.lesson.concepts.length)return;
 let cards=[];
 if(ctx.schema==="course")cards=[...document.querySelectorAll(".concept-grid > .card")];
 else{
  const learn=[...document.querySelectorAll("article.card.full")].find(a=>/3\s*·\s*Learn/i.test(a.querySelector(".eyebrow")?.textContent||"")||/Objectives/i.test(a.querySelector("h2")?.textContent||""));
  cards=learn?[...learn.querySelectorAll(":scope .grid > .card")]:[];
 }
 cards.slice(0,ctx.lesson.concepts.length).forEach((card,i)=>{
  if(card.dataset.deepEnhanced==="true")return;card.dataset.deepEnhanced="true";card.classList.add("deep-concept-card");
  const note=document.createElement("p");note.className="deep-concept-note";note.textContent="Open the full teaching lesson for mechanics, worked examples, error repair, and assessment connection.";
  const b=document.createElement("button");b.type="button";b.className="deep-concept-open";b.textContent="Open full lesson";b.addEventListener("click",e=>{e.stopPropagation();openConcept(i)});
  card.append(note,b);card.tabIndex=0;card.setAttribute("role","button");card.setAttribute("aria-label",`Open full lesson for concept ${i+1}: ${ctx.lesson.concepts[i]}`);
  card.addEventListener("click",e=>{if(e.target.closest("button,a,input,textarea,select"))return;openConcept(i)});card.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&!e.target.closest("button,a,input,textarea,select")){e.preventDefault();openConcept(i)}});
 });
}

function focusQuestionSet(){
 const host=document.getElementById("questions")||document.querySelector("#questionHost")||null;if(!host||host.dataset.focusedEnhanced==="true")return;
 const questions=[...host.querySelectorAll(".question")].filter(q=>!q.closest(".constructed-block"));if(questions.length<2)return;
 host.dataset.focusedEnhanced="true";questions.forEach(q=>q.classList.add("focused-question"));
 let current=0;
 const panel=document.createElement("div");panel.className="focused-check";panel.innerHTML=`<div class="focused-check-top"><span class="focused-check-label">Focused problem view</span><span class="focused-check-count" aria-live="polite"></span></div><div class="focused-track" aria-hidden="true"><span></span></div><div class="focused-dots" aria-label="Question progress"></div><div class="focused-nav"><button type="button" data-prev>← Previous</button><button type="button" data-next>Next →</button></div><p class="focused-hint">One problem at a time. Your answers remain saved by the course engine.</p>`;
 host.parentNode.insertBefore(panel,host);const count=panel.querySelector(".focused-check-count"),bar=panel.querySelector(".focused-track span"),dots=panel.querySelector(".focused-dots"),prev=panel.querySelector("[data-prev]"),next=panel.querySelector("[data-next]");
 questions.forEach((_,i)=>{const b=document.createElement("button");b.type="button";b.className="focused-dot";b.textContent=String(i+1);b.setAttribute("aria-label",`Go to question ${i+1}`);b.onclick=()=>show(i);dots.appendChild(b)});
 const dotButtons=[...dots.children];
 function answered(q){return !!q.querySelector('input[type="radio"]:checked, input[type="checkbox"]:checked, textarea:not(:placeholder-shown), input[type="text"]:not(:placeholder-shown)')}
 function update(){const done=questions.filter(answered).length;count.textContent=`Question ${current+1} of ${questions.length} · ${done} answered`;bar.style.width=`${Math.round(done/questions.length*100)}%`;dotButtons.forEach((b,i)=>{b.classList.toggle("answered",answered(questions[i]));b.classList.toggle("current",i===current)});prev.disabled=current===0;next.disabled=current===questions.length-1;next.textContent=current===questions.length-1?"Last problem":"Next →"}
 function show(i){current=Math.max(0,Math.min(questions.length-1,i));questions.forEach((q,j)=>q.hidden=j!==current);update();questions[current].scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"});questions[current].querySelector("input,textarea,button")?.focus({preventScroll:true})}
 prev.onclick=()=>show(current-1);next.onclick=()=>show(current+1);host.addEventListener("change",update);host.addEventListener("input",update);
 const score=document.getElementById("score")||document.getElementById("submitButton");if(score){score.addEventListener("click",e=>{const firstMissing=questions.findIndex(q=>!answered(q));if(firstMissing>=0){e.preventDefault();e.stopImmediatePropagation();show(firstMissing);const msg=document.getElementById("scoreMsg")||document.getElementById("status")||document.getElementById("result");if(msg)msg.textContent="Complete this problem before scoring the set.";return}setTimeout(update,0)},true)}
 const reset=document.getElementById("reset")||document.getElementById("resetButton");reset?.addEventListener("click",()=>setTimeout(()=>show(0),0));show(0);
}

function enhance(){style();enhanceConcepts();focusQuestionSet()}
window.KhaemenesAlgebra1LearningExperience={version:VERSION,enhance,focusQuestionSet,enhanceConcepts};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(enhance,0),{once:true});else setTimeout(enhance,0);
})();
