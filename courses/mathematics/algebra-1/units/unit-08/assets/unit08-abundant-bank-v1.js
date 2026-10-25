(()=>{
"use strict";
const bank=[];
const VERSION="unit08-abundant-v1";
function add(id,lesson,difficulty,category,prompt,options,explanation,tag,generatorId,seed){
 bank.push({id,unit:8,lesson,level:difficulty,difficulty,category,prompt,options,answer:0,answer_text:options[0],explanation,misconceptionTag:tag,reviewStatus:"generated-provisional-v1",generatorId,generatorVersion:VERSION,seed});
}
// Lesson 01 · exponent laws
for(let i=1;i<=5;i++){
 const a=i+2,b=i+3;
 add(`u08-l01-ab-prod-${i}`,1,1,"exponent-product",`Simplify x^${a} · x^${b}.`,[`x^${a+b}`,`x^${a*b}`,`2x^${a+b}`,`x^${Math.abs(a-b)}`],`For the same base, add exponents: ${a}+${b}=${a+b}.`,"product-rule-add-exponents","u08-l01-product-v1",i);
 const n=i+6,d=i+1;
 add(`u08-l01-ab-quot-${i}`,1,2,"exponent-quotient",`Simplify x^${n}/x^${d}, assuming x≠0.`,[`x^${n-d}`,`x^${n+d}`,`x^${n*d}`,`${n-d}x`],`For equal nonzero bases, subtract exponents: ${n}−${d}=${n-d}.`,"quotient-rule-subtract-exponents","u08-l01-quotient-v1",i);
 const p=i+2,q=i+1;
 add(`u08-l01-ab-power-${i}`,1,3,"power-of-power",`Simplify (x^${p})^${q}.`,[`x^${p*q}`,`x^${p+q}`,`${q}x^${p}`,`x^${Math.abs(p-q)}`],`A power raised to a power multiplies exponents: ${p}·${q}=${p*q}.`,"power-rule-multiply-exponents","u08-l01-power-v1",i);
}
// Lesson 02 · zero, negative and rational exponents
for(let i=1;i<=5;i++){
 const a=i+2;
 add(`u08-l02-ab-zero-${i}`,2,1,"zero-exponent",`For nonzero a, what is a^${0}?`,["1","0","a","undefined"],"Every nonzero base raised to the zero power equals 1.","zero-exponent-nonzero-base","u08-l02-zero-v1",i);
 add(`u08-l02-ab-neg-${i}`,2,2,"negative-exponent",`Rewrite x^−${a} using positive exponents, assuming x≠0.`,[`1/x^${a}`,`−x^${a}`,`1/(${a}x)`,`x^${a}`],"A negative exponent denotes the reciprocal of the corresponding positive power.","negative-exponent-reciprocal","u08-l02-negative-v1",i);
 const n=(i+2)*(i+2),root=i+2;
 add(`u08-l02-ab-rat-${i}`,2,3,"rational-exponent",`Evaluate ${n}^(1/2) as the principal real value.`,[String(root),String(-root),String(n/2),String(n)],`The exponent 1/2 denotes the principal square root, √${n}=${root}.`,"principal-root-vs-plus-minus","u08-l02-rational-v1",i);
}
// Lesson 03 · scientific notation
for(let i=1;i<=5;i++){
 const coeff=(i+2)/10+2,exp=i+2,standard=coeff*Math.pow(10,exp);
 add(`u08-l03-ab-norm-${i}`,3,1,"scientific-normalize",`Write ${standard} in normalized scientific notation.`,[`${coeff}×10^${exp}`,`${coeff*10}×10^${exp-1}`,`${coeff/10}×10^${exp+1}`,`${standard}×10^0`],`Normalized scientific notation uses a coefficient at least 1 and less than 10: ${coeff}×10^${exp}.`,"scientific-normalization","u08-l03-normalize-v1",i);
 const a=i+1,b=i+2,e1=i+2,e2=i+1,coef=a*b,exp2=e1+e2;
 add(`u08-l03-ab-mult-${i}`,3,2,"scientific-multiply",`Multiply (${a}×10^${e1})(${b}×10^${e2}).`,[`${coef}×10^${exp2}`,`${a+b}×10^${exp2}`,`${coef}×10^${e1-e2}`,`${coef}×10^${e1*e2}`],`Multiply coefficients and add powers of ten: ${a*b}×10^${e1+e2}.`,"scientific-product-exponents","u08-l03-multiply-v1",i);
 const c=i+2,e=i+3;
 add(`u08-l03-ab-add-${i}`,3,3,"scientific-add",`Compute ${c}×10^${e} + ${i+1}×10^${e}.`,[`${c+i+1}×10^${e}`,`${c+i+1}×10^${2*e}`,`${c*(i+1)}×10^${e}`,`${c+i+1}×10^0`],`When powers of ten match, add coefficients and keep 10^${e}.`,"align-powers-before-addition","u08-l03-add-v1",i);
}
// Lesson 04 · arithmetic and geometric sequences
for(let i=1;i<=5;i++){
 const first=i+2,d=i+1;
 add(`u08-l04-ab-ar-${i}`,4,1,"arithmetic-sequence",`Sequence ${first}, ${first+d}, ${first+2*d}, ${first+3*d}, … is:`,[`Arithmetic with common difference ${d}`,`Geometric with ratio ${d}`,`Arithmetic with difference ${first}`,`Neither arithmetic nor geometric`],`Each term increases by the constant difference ${d}.`,"difference-vs-ratio","u08-l04-arithmetic-v1",i);
 const g=i+1,r=2+i%2;
 add(`u08-l04-ab-geo-${i}`,4,2,"geometric-sequence",`Sequence ${g}, ${g*r}, ${g*r*r}, ${g*r*r*r}, … is:`,[`Geometric with common ratio ${r}`,`Arithmetic with difference ${r}`,`Geometric with ratio ${g}`,`Neither`],`Each term is multiplied by the constant factor ${r}.`,"geometric-common-ratio","u08-l04-geometric-v1",i);
 const a1=i+3,r2=i+2;
 add(`u08-l04-ab-exp-${i}`,4,3,"geometric-explicit",`A geometric sequence has a₁=${a1} and ratio ${r2}. Which explicit rule is correct?`,[`aₙ=${a1}(${r2})^(n−1)`,`aₙ=${a1}+${r2}(n−1)`,`aₙ=${r2}(${a1})^(n−1)`,`aₙ=${a1}(${r2})^n+${r2}`],"A geometric sequence multiplies by r each step, giving aₙ=a₁r^(n−1).","geometric-explicit-rule","u08-l04-explicit-v1",i);
}
// Lesson 05 · exponential growth and decay
for(let i=1;i<=5;i++){
 const pct=5*i;
 add(`u08-l05-ab-grow-${i}`,5,1,"growth-factor",`What multiplicative factor represents ${pct}% growth per period?`,[String(1+pct/100),String(pct/100),String(1-pct/100),String(1+pct)],`Growth factor=1+r=1+${pct/100}=${1+pct/100}.`,"percent-to-growth-factor","u08-l05-growth-v1",i);
 const dpct=5*i;
 add(`u08-l05-ab-decay-${i}`,5,2,"decay-factor",`What multiplicative factor represents ${dpct}% decay per period?`,[String(1-dpct/100),String(1+dpct/100),String(dpct/100),String(dpct)],`Decay factor=1−r=1−${dpct/100}=${1-dpct/100}.`,"percent-to-decay-factor","u08-l05-decay-v1",i);
 add(`u08-l05-ab-compare-${i}`,5,3,"linear-vs-exponential",`Which description is exponential rather than linear?`,["The quantity is multiplied by the same factor each equal time interval","The quantity increases by the same fixed amount each interval","The quantity has zero change","The quantity alternates signs with no rule"],"Exponential change is multiplicative; linear change is additive.","multiplicative-vs-additive-change","u08-l05-compare-v1",i);
}
// Lesson 06 · compound interest, half-life and modelling
for(let i=1;i<=5;i++){
 const P=1000+100*i,r=0.05,years=i,amount=Number((P*Math.pow(1+r,years)).toFixed(2));
 add(`u08-l06-ab-int-${i}`,6,1,"compound-interest",`$${P} earns 5% interest compounded annually for ${years} year(s). Which expression gives the balance?`,[`${P}(1.05)^${years}`,`${P}(0.05)^${years}`,`${P}+0.05·${years}`,`${P}(1.5)^${years}`],`Annual compound interest uses P(1+r)^t; here the numerical balance is about $${amount}.`,"compound-growth-factor","u08-l06-interest-v1",i);
 const initial=160*Math.pow(2,i-1),halves=i,remaining=initial/Math.pow(2,halves);
 add(`u08-l06-ab-half-${i}`,6,2,"half-life",`A sample begins at ${initial} g and passes through ${halves} half-life interval(s). How much remains?`,[`${remaining} g`,`${initial-halves} g`,`${initial/halves} g`,`${initial*halves} g`],`Each half-life multiplies the amount by 1/2, so ${initial}(1/2)^${halves}=${remaining} g.`,"repeated-halving","u08-l06-half-v1",i);
 add(`u08-l06-ab-limit-${i}`,6,3,"exponential-model-limit",`An exponential model was calibrated over 5 years. What should be stated before using it to predict 50 years ahead?`,["The extrapolation assumes the same growth/decay mechanism continues far beyond observed data","The prediction is exact because exponentials never change form","Rounding and domain no longer matter","The initial value can be ignored"],"Long extrapolation requires explicit assumptions about whether the mechanism, rate, units, and domain remain credible.","exponential-extrapolation-limit","u08-l06-limit-v1",i);
}
if(bank.length!==90)throw new Error("Unit 08 abundant bank count drift: "+bank.length);
window.KHAE_UNIT08_ABUNDANT_BANK=bank;
})();
