(()=>{
"use strict";
const bank=[];
const VERSION="unit02-abundant-v1";
function add(id,lesson,difficulty,category,prompt,options,explanation,tag,generatorId,seed){
 bank.push({id,unit:2,lesson,level:difficulty,difficulty,category,prompt,options,answer:0,answer_text:options[0],explanation,misconceptionTag:tag,reviewStatus:"generated-provisional-v1",generatorId,generatorVersion:VERSION,seed});
}
// Lesson 01 · variables, terms, factors, coefficients, degree
for(let i=1;i<=5;i++){
 const a=i+2,b=i+4,c=i+6;
 add(`u02-l01-ab-c-${i}`,1,1,"structure",`In ${a}x² + ${b}x − ${c}, what is the coefficient of x²?`,[String(a),String(b),String(-c),"2"],`The coefficient is the numerical factor multiplying x², so it is ${a}.`,"coefficient-vs-exponent","u02-l01-coefficient-v1",i);
 const p=i+1,q=2,deg=p+q;
 add(`u02-l01-ab-d-${i}`,1,2,"degree",`What is the degree of ${i+3}x^${p}y²?`,[String(deg),String(p),"2",String((i+3))],`For a monomial, add variable exponents: ${p}+2=${deg}.`,"monomial-degree-sum","u02-l01-degree-v1",i);
 const k=i+1;
 add(`u02-l01-ab-t-${i}`,1,3,"terms-factors",`How many terms are in ${k}a²b − ${k+2}ab + ${k+4}?`,["3","5","2","1"],"Addition and subtraction separate three terms; multiplication happens inside each term.","terms-vs-factors","u02-l01-terms-v1",i);
}
// Lesson 02 · evaluating and substitution
for(let i=1;i<=5;i++){
 const a=i+2,x=i-3,b=i+4,ans=a*x+b;
 add(`u02-l02-ab-l-${i}`,2,1,"evaluation",`Evaluate ${a}x + ${b} when x = ${x}.`,[String(ans),String(a*(x+b)),String(a+x+b),String(ans+a)],`Substitute x=${x}: ${a}(${x})+${b}=${ans}.`,"substitution-order","u02-l02-linear-v1",i);
 const n=i+2,ans2=n*n-2*n;
 add(`u02-l02-ab-n-${i}`,2,2,"negative-substitution",`Evaluate x² + 2x when x = −${n}.`,[String(ans2),String(-(n*n)-2*n),String(n*n+2*n),String(n*n)],`Use parentheses: (−${n})²+2(−${n})=${n*n}−${2*n}=${ans2}.`,"negative-value-grouping","u02-l02-negative-v1",i);
 const l=i+3,w=i+5,area=l*w;
 add(`u02-l02-ab-f-${i}`,2,3,"formula",`A rectangle has length ${l} cm and width ${w} cm. Using A = lw, what is its area?`,[`${area} cm²`,`${l+w} cm²`,`${2*(l+w)} cm²`,`${area} cm`],`Substitute into A=lw: ${l}·${w}=${area} cm².`,"formula-substitution-units","u02-l02-formula-v1",i);
}
// Lesson 03 · properties, equivalence, structural reasoning
const propRows=[
 ["a+b=b+a","commutative property of addition","associative property","distributive property","additive identity"],
 ["(ab)c=a(bc)","associative property of multiplication","commutative property","multiplicative inverse","distributive property"],
 ["a+0=a","additive identity property","additive inverse property","commutative property","zero-product property"],
 ["a·1=a","multiplicative identity property","multiplicative inverse property","associative property","distributive property"],
 ["a(b+c)=ab+ac","distributive property","commutative property","associative property","identity property"]
];
propRows.forEach((r,i)=>add(`u02-l03-ab-p-${i+1}`,3,1,"properties",`Which property justifies ${r[0]}?`,[r[1],r[2],r[3],r[4]],`The rewrite uses the ${r[1]}.`,"property-identification","u02-l03-properties-v1",i+1));
for(let i=1;i<=5;i++){
 const a=i+2,b=i+1,c=i+3;
 add(`u02-l03-ab-e-${i}`,3,2,"equivalence",`Which expression is equivalent to ${a}(x+${b})+${c}x?`,[`${a+c}x+${a*b}`,`${a+c}x+${b}`,`${a*c}x+${a*b}`,`${a+c+b}x`],`Distribute ${a} and combine x-terms: ${a}x+${a*b}+${c}x=${a+c}x+${a*b}.`,"distribution-and-combination","u02-l03-equivalence-v1",i);
 const n=i+1;
 add(`u02-l03-ab-x-${i}`,3,3,"counterexample",`Which value disproves the claim x² = ${n}x for every real x?`,[String(n+1),String(n),"0",String(-n)],`At x=${n+1}, x²=${(n+1)*(n+1)} while ${n}x=${n*(n+1)}, so the two expressions are unequal.`,"counterexample-universal-claim","u02-l03-counterexample-v1",i);
}
// Lesson 04 · distribution and like terms
for(let i=1;i<=5;i++){
 const a=i+2,b=i+4,c=i+1;
 add(`u02-l04-ab-c-${i}`,4,1,"combine",`Simplify ${a}x + ${b}x − ${c}.`,[`${a+b}x−${c}`,`${a*b}x−${c}`,`${a+b-c}x`,`${a+b}x+${c}`],`Combine only the like x-terms: (${a}+${b})x−${c}=${a+b}x−${c}.`,"combine-like-terms","u02-l04-combine-v1",i);
 const f=i+2,k=i+1;
 add(`u02-l04-ab-d-${i}`,4,2,"distribution",`Expand −${f}(x − ${k}).`,[`−${f}x+${f*k}`,`−${f}x−${f*k}`,`${f}x−${f*k}`,`−${f}x+${k}`],`Distribute −${f} to both terms: −${f}x + ${f*k}.`,"negative-distribution","u02-l04-distribute-v1",i);
 const g=i+2,h=i+3;
 add(`u02-l04-ab-f-${i}`,4,3,"factoring",`Factor the greatest common numerical factor from ${g*h}x + ${g*(h+2)}.`,[`${g}(${h}x+${h+2})`,`${h}(${g}x+${g+2})`,`${g*h}(x+${h+2})`,`${g}(x+${h+2})`],`The greatest common factor is ${g}; dividing each term by ${g} gives ${h}x+${h+2}.`,"greatest-common-factor","u02-l04-factor-v1",i);
}
// Lesson 05 · polynomial classification
for(let i=1;i<=5;i++){
 const d=i+2,a=i+3;
 add(`u02-l05-ab-d-${i}`,5,1,"polynomial-degree",`What is the degree of ${a}x^${d} − 2x + 7?`,[String(d),String(a),"2","7"],`The degree is the greatest exponent of x, which is ${d}.`,"coefficient-vs-degree","u02-l05-degree-v1",i);
 const degree=(i%3)+2;
 add(`u02-l05-ab-c-${i}`,5,2,"classification",`Classify ${i+2}x^${degree} − x + ${i+4} by degree and number of terms.`,[`${degree===2?"quadratic":degree===3?"cubic":"quartic"} trinomial`,`${degree===2?"quadratic":degree===3?"cubic":"quartic"} binomial`,"linear trinomial","not a polynomial"],`The greatest exponent is ${degree}, and the expression has three nonzero terms.`,"polynomial-classification","u02-l05-classification-v1",i);
 const a0=i+2,b0=i+4;
 add(`u02-l05-ab-s-${i}`,5,3,"standard-form",`Which is the standard form of ${b0} + ${a0}x − ${i+1}x³?`,[`−${i+1}x³+${a0}x+${b0}`,`${b0}+${a0}x−${i+1}x³`,`${a0}x−${i+1}x³+${b0}`,`−${i+1}x+${a0}x³+${b0}`],"Standard form lists terms in descending powers of x.","standard-form-order","u02-l05-standard-v1",i);
}
// Lesson 06 · adding and subtracting polynomials
for(let i=1;i<=5;i++){
 const a=i+1,b=i+2,c=i+3,d=i;
 add(`u02-l06-ab-a-${i}`,6,1,"poly-add",`Simplify (${a}x²+${b}x)+(${c}x²−${d}x).`,[`${a+c}x²+${b-d}x`,`${a*c}x⁴+${b-d}x`,`${a+c}x²+${b+d}x`,`${a+c+b-d}x²`],`Combine coefficients of matching powers: (${a}+${c})x²+(${b}−${d})x.`,"matching-powers-addition","u02-l06-add-v1",i);
 const p=i+4,q=i+2,r=i+1,s0=i+3;
 add(`u02-l06-ab-s-${i}`,6,2,"poly-subtract",`Simplify (${p}x²+${q}x−${r}) − (${i+1}x²−${s0}x+${i}).`,[`${p-(i+1)}x²+${q+s0}x−${r+i}`,`${p-(i+1)}x²+${q-s0}x−${r-i}`,`${p+i+1}x²+${q+s0}x−${r+i}`,`${p-(i+1)}x²+${q+s0}x+${r+i}`],"Subtracting a polynomial means adding the opposite of every term, then combining matching powers.","subtract-entire-polynomial","u02-l06-subtract-v1",i);
 const x=i+1;
 add(`u02-l06-ab-v-${i}`,6,3,"verification",`A proposed simplification says (2x²+${i}x)+(x²−x)=3x²+${i-1}x. Which check is strongest?`,[`Substitute x=${x} into both original and simplified expressions and compare the values`,"Count the terms in each expression","Compare only the leading coefficients","Change x to x²"],"Substitution tests whether the two expressions agree at a chosen input and can reveal an incorrect simplification.","substitution-verification","u02-l06-verify-v1",i);
}
// Lesson 07 · monomial multiplication and GCF
for(let i=1;i<=5;i++){
 const p=i+1,q=i+2;
 add(`u02-l07-ab-m-${i}`,7,1,"monomial-product",`Multiply x^${p} · x^${q}.`,[`x^${p+q}`,`x^${p*q}`,`2x^${p+q}`,`x^${Math.abs(q-p)}`],`For equal bases, add exponents: ${p}+${q}=${p+q}.`,"multiply-exponents-vs-add","u02-l07-multiply-v1",i);
 const g=i+2,a=g*(i+3),b=g*(i+5);
 add(`u02-l07-ab-g-${i}`,7,2,"gcf",`Factor the GCF from ${a}x² + ${b}x.`,[`${g}x(${a/g}x+${b/g})`,`${g}(${a/g}x²+${b/g}x)`,`${a}x(x+${b})`,`${g}x²(${a/g}+${b/g})`],`The common numerical factor is ${g} and both terms contain x, so the GCF is ${g}x.`,"complete-gcf-variable-factor","u02-l07-gcf-v1",i);
 const c1=2*(i+2),c2=3*(i+2),xp=i+3,xq=i+2,yp=3,yq=2;
 add(`u02-l07-ab-f-${i}`,7,3,"gcf-multivariable",`What is the complete GCF of ${c1}x^${xp}y³ and ${c2}x^${xq}y²?`,[`${i+2}x^${xq}y²`,`${i+2}x^${xp}y³`,`${c1*c2}x^${xp+xq}y⁵`,`x^${xq}y²`],`Use gcd(${c1},${c2})=${i+2} and the smaller exponents x^${xq} and y².`,"gcf-minimum-exponents","u02-l07-multigcf-v1",i);
}
if(bank.length!==105)throw new Error("Unit 02 abundant bank count drift: "+bank.length);
window.KHAE_UNIT02_ABUNDANT_BANK=bank;
})();
