(()=>{
"use strict";
const bank=[];
const VERSION="unit09-abundant-v1";
function add(id,lesson,difficulty,category,prompt,options,explanation,tag,generatorId,seed){
 bank.push({id,unit:9,lesson,level:difficulty,difficulty,category,prompt,options,answer:0,answer_text:options[0],explanation,misconceptionTag:tag,reviewStatus:"generated-provisional-v1",generatorId,generatorVersion:VERSION,seed});
}
// Lesson 01 · polynomial vocabulary and standard form
for(let i=1;i<=5;i++){
 const d=i+2,a=i+3;
 add(`u09-l01-ab-deg-${i}`,1,1,"polynomial-degree",`What is the degree of ${a}x^${d}−2x+7?`,[String(d),String(a),"2","7"],`The greatest exponent is ${d}, so the polynomial degree is ${d}.`,"degree-vs-coefficient","u09-l01-degree-v1",i);
 const c=i+2;
 add(`u09-l01-ab-std-${i}`,1,2,"standard-form",`Which is standard form for ${c}+3x−${i+1}x³?`,[`−${i+1}x³+3x+${c}`,`${c}+3x−${i+1}x³`,`3x−${i+1}x³+${c}`,`−${i+1}x+3x³+${c}`],"Standard form orders terms from greatest exponent to least.","descending-degree-standard-form","u09-l01-standard-v1",i);
 add(`u09-l01-ab-non-${i}`,1,3,"non-polynomial",`Which expression is not a polynomial in x?`,[`x^−${i}+2`,`x^${i+2}+3x−1`,`${i+1}x²+5`,`7`],"A polynomial cannot contain a variable raised to a negative exponent.","negative-exponent-not-polynomial","u09-l01-nonpoly-v1",i);
}
// Lesson 02 · adding and subtracting polynomials
for(let i=1;i<=5;i++){
 const a=i+2,b=i+1,c=i+3,d=i;
 add(`u09-l02-ab-add-${i}`,2,1,"polynomial-addition",`Simplify (${a}x²+${b}x)+(${c}x²−${d}x).`,[`${a+c}x²+${b-d}x`,`${a*c}x⁴+${b-d}x`,`${a+c}x²+${b+d}x`,`${a+c+b-d}x²`],"Combine coefficients only for terms with the same variable powers.","combine-like-degrees","u09-l02-add-v1",i);
 const p=i+5,q=i+2,r=i+1,s0=i+3;
 add(`u09-l02-ab-sub-${i}`,2,2,"polynomial-subtraction",`Simplify (${p}x²+${q}x−${r})−(${i+1}x²−${s0}x+${i}).`,[`${p-(i+1)}x²+${q+s0}x−${r+i}`,`${p-(i+1)}x²+${q-s0}x−${r-i}`,`${p+i+1}x²+${q+s0}x−${r+i}`,`${p-(i+1)}x²+${q+s0}x+${r+i}`],"Distribute the subtraction to every term in the second polynomial, then combine like terms.","subtract-entire-polynomial","u09-l02-subtract-v1",i);
 add(`u09-l02-ab-ver-${i}`,2,3,"polynomial-verification",`Which is a strong independent check of a proposed polynomial sum?`,["Substitute a convenient x-value into the original and simplified expressions and compare","Count terms only","Compare only the leading coefficient","Change every minus sign to plus"],"Substitution can reveal whether two expressions give the same output at a test input.","verify-polynomial-by-substitution","u09-l02-verify-v1",i);
}
// Lesson 03 · multiplying monomials and polynomials
for(let i=1;i<=5;i++){
 const a=i+2,b=i+1,p=i+1,q=i+2;
 add(`u09-l03-ab-mono-${i}`,3,1,"monomial-product",`Multiply ${a}x^${p} · ${b}x^${q}.`,[`${a*b}x^${p+q}`,`${a+b}x^${p+q}`,`${a*b}x^${p*q}`,`${a*b}x^${Math.abs(q-p)}`],"Multiply coefficients and add exponents on the common base x.","monomial-coefficient-exponent-rules","u09-l03-monomial-v1",i);
 const k=i+2,c=i+3,d=i+1;
 add(`u09-l03-ab-dist-${i}`,3,2,"monomial-distribution",`Expand ${k}x(${c}x+${d}).`,[`${k*c}x²+${k*d}x`,`${k*c}x²+${d}x`,`${k+c}x²+${k+d}x`,`${k*c}x+${k*d}`],`Distribute ${k}x to both terms, applying x·x=x².`,"distribute-monomial-all-terms","u09-l03-distribute-v1",i);
 const a0=i+1,b0=i+2;
 add(`u09-l03-ab-bin-${i}`,3,3,"binomial-product",`Expand (x+${a0})(x+${b0}).`,[`x²+${a0+b0}x+${a0*b0}`,`x²+${a0*b0}`,`x²+${a0+b0}`,`2x²+${a0*b0}`],"Multiply every term: the two cross terms combine to (a+b)x.","binomial-cross-terms","u09-l03-binomial-v1",i);
}
// Lesson 04 · special products
for(let i=1;i<=5;i++){
 const a=i+1;
 add(`u09-l04-ab-square-${i}`,4,1,"square-binomial",`Expand (x+${a})².`,[`x²+${2*a}x+${a*a}`,`x²+${a*a}`,`x²+${a}x+${a*a}`,`x²−${2*a}x+${a*a}`],`(x+a)²=x²+2ax+a², including the middle cross term.`,"missing-middle-term","u09-l04-square-v1",i);
 const b=i+2;
 add(`u09-l04-ab-diff-${i}`,4,2,"difference-squares",`Expand (x−${b})(x+${b}).`,[`x²−${b*b}`,`x²+${b*b}`,`x²−${2*b}x+${b*b}`,`x²+${2*b}x+${b*b}`],"The opposite cross terms cancel, leaving x²−b².","difference-of-squares-product","u09-l04-difference-v1",i);
 add(`u09-l04-ab-id-${i}`,4,3,"identity-check",`Which identity is valid for all real x and a?`,["(x+a)²=x²+2ax+a²","(x+a)²=x²+a²","(x−a)²=x²−a²","(x+a)(x−a)=x²+a²"],"Expanding by distribution confirms the middle term 2ax in the square of a binomial.","special-product-identity","u09-l04-identity-v1",i);
}
// Lesson 05 · GCF factoring
for(let i=1;i<=5;i++){
 const g=i+2,a=g*(i+3),b=g*(i+5);
 add(`u09-l05-ab-num-${i}`,5,1,"gcf-numerical",`Factor the GCF from ${a}x+${b}.`,[`${g}(${a/g}x+${b/g})`,`${a}(x+${b})`,`${g}x(${a/g}+${b/g})`,`${a/g}(x+${b/g})`],`The greatest common numerical factor is ${g}; divide every term by ${g}.`,"greatest-common-numerical-factor","u09-l05-number-v1",i);
 const c1=2*(i+2),c2=3*(i+2),xp=i+3,xq=i+2;
 add(`u09-l05-ab-var-${i}`,5,2,"gcf-variable",`What is the complete GCF of ${c1}x^${xp} and ${c2}x^${xq}?`,[`${i+2}x^${xq}`,`${i+2}x^${xp}`,`${c1*c2}x^${xp+xq}`,`x^${xq}`],`Use gcd(${c1},${c2})=${i+2} and the smaller exponent x^${xq}.`,"gcf-minimum-exponent","u09-l05-variable-v1",i);
 const n=i+2;
 add(`u09-l05-ab-neg-${i}`,5,3,"negative-gcf",`Why might factoring −${n} from −${n}x²−${2*n}x be useful?`,[`It leaves a polynomial with positive leading coefficient inside: −${n}(x²+2x)`,`It changes the expression's value`,`It removes the x terms entirely`,`It makes the GCF equal to 1`],"A negative GCF can make the leading coefficient inside the parentheses positive while preserving equivalence.","strategic-negative-gcf","u09-l05-negative-v1",i);
}
// Lesson 06 · trinomials and difference of squares
for(let i=1;i<=5;i++){
 const a=i+2,b=i+3,sum=a+b,prod=a*b;
 add(`u09-l06-ab-tri-${i}`,6,1,"monic-trinomial",`Factor x²+${sum}x+${prod}.`,[`(x+${a})(x+${b})`,`(x−${a})(x−${b})`,`(x+${sum})(x+${prod})`,`(x+${a+b})(x+1)`],`${a} and ${b} multiply to ${prod} and add to ${sum}.`,"factor-pair-sum-product","u09-l06-trinomial-v1",i);
 const n=i+2;
 add(`u09-l06-ab-dos-${i}`,6,2,"factor-difference-squares",`Factor x²−${n*n}.`,[`(x−${n})(x+${n})`,`(x−${n})²`,`(x+${n})²`,`(x−${n*n})(x+1)`],`x²−${n*n} is a difference of squares: (x−${n})(x+${n}).`,"difference-squares-factor","u09-l06-difference-v1",i);
 const primeConst=[2,5,7,11,13][i-1];
 add(`u09-l06-ab-prime-${i}`,6,3,"prime-over-integers",`Which statement about x²+x+${primeConst} is safest before claiming an integer factorization?`,["Check integer factor pairs of the constant and their sums; if none match 1, it is prime over the integers under this method","It always factors because it is a trinomial","Use (x+1)(x+"+primeConst+") regardless of the middle term","Drop the constant term"],"Factoring requires factor pairs whose product and sum match the trinomial coefficients; no matching integer pair means the taught integer pattern does not factor it.","recognize-prime-trinomial","u09-l06-prime-v1",i);
}
// Lesson 07 · zeros, factors and modelling
for(let i=1;i<=5;i++){
 const a=i+2,b=i+1;
 add(`u09-l07-ab-zero-${i}`,7,1,"zero-product",`Find the zeros of (x−${a})(x+${b})=0.`,[`x=${a} or x=−${b}`,`x=−${a} or x=${b}`,`x=${a+b}`,`x=0 only`],`Set each factor equal to zero: x−${a}=0 or x+${b}=0.`,"zero-product-factor-to-zero","u09-l07-zeros-v1",i);
 const r=i+1;
 add(`u09-l07-ab-mult-${i}`,7,2,"multiplicity",`In f(x)=(x−${r})²(x+2), what is the multiplicity of zero x=${r}?`,["2","1","3","0"],`The factor (x−${r}) appears twice, so the zero has multiplicity 2.`,"factor-exponent-multiplicity","u09-l07-multiplicity-v1",i);
 const max=10+i;
 add(`u09-l07-ab-context-${i}`,7,3,"polynomial-context",`A polynomial model for production is meaningful only for 0≤x≤${max}. A zero occurs at x=${max+5}. How should it be interpreted?`,["It is algebraically a zero but outside the stated contextual domain","It must be the most important practical solution","The domain restriction can be ignored","It proves the model is invalid everywhere"],"Algebraic solutions must be checked against the model's domain and contextual meaning.","zero-context-domain","u09-l07-context-v1",i);
}
if(bank.length!==105)throw new Error("Unit 09 abundant bank count drift: "+bank.length);
window.KHAE_UNIT09_ABUNDANT_BANK=bank;
})();
