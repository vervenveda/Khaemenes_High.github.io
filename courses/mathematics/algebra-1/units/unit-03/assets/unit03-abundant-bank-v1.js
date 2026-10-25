(()=>{
"use strict";
const bank=[];
const VERSION="unit03-abundant-v1";
function add(id,lesson,difficulty,category,prompt,options,explanation,tag,generatorId,seed){
 bank.push({id,unit:3,lesson,level:difficulty,difficulty,category,prompt,options,answer:0,answer_text:options[0],explanation,misconceptionTag:tag,reviewStatus:"generated-provisional-v1",generatorId,generatorVersion:VERSION,seed});
}
// Lesson 01 · equality, inverse operations, verification
for(let i=1;i<=5;i++){
 const c=i+4,d=2*i+12,x=d-c;
 add(`u03-l01-ab-i-${i}`,1,1,"inverse-operations",`For x + ${c} = ${d}, which operation isolates x while preserving equality?`,[`Subtract ${c} from both sides`,`Subtract ${c} from the left side only`,`Multiply both sides by ${c}`,`Add ${d} to both sides`],`Subtracting the same value from both sides preserves equality and gives x=${x}.`,"inverse-operation-both-sides","u03-l01-inverse-v1",i);
 const a=i+2,v=i+1,b=i+3,total=a*v+b;
 add(`u03-l01-ab-v-${i}`,1,2,"verification",`Which substitution verifies that x = ${v} solves ${a}x + ${b} = ${total}?`,[`${a}(${v}) + ${b} = ${total}`,`${a} + ${v} + ${b} = ${total}`,`${a}(${total}) + ${b} = ${v}`,`${a}(${v}) = ${total} + ${b}`],`Substitution into the original equation gives the true statement ${total}=${total}.`,"verification-by-substitution","u03-l01-verification-v1",i);
 const k=i+2;
 add(`u03-l01-ab-p-${i}`,1,3,"equality-principle",`A learner changes ${k}x = ${k*6} to x = 6. Which justification is valid?`,[`Divide both sides by ${k}; applying the same nonzero operation preserves equality`,`Cancel ${k} only on the left because x is unknown`,`Move ${k} across the equals sign and change its sign`,`Replace ${k} with 1 without changing the right side`],`Dividing both sides by the same nonzero number preserves the equality and yields x=6.`,"same-operation-both-sides","u03-l01-equality-v1",i);
}
// Lesson 02 · one-step and two-step equations
for(let i=1;i<=5;i++){
 const a=i+2,x=i+3,total=a*x;
 add(`u03-l02-ab-o-${i}`,2,1,"one-step",`Solve ${a}x = ${total}.`,[`x=${x}`,`x=${total-a}`,`x=${total+a}`,`x=${a}`],`Divide both sides by ${a}: x=${x}.`,"inverse-multiplication-division","u03-l02-one-step-v1",i);
 const m=i+2,v=i+1,b=i+4,c=m*v+b;
 add(`u03-l02-ab-t-${i}`,2,2,"two-step",`Solve ${m}x + ${b} = ${c}.`,[`x=${v}`,`x=${v+1}`,`x=${v-1}`,`x=${c-b}`],`Subtract ${b}, then divide by ${m}: ${m}x=${m*v}, so x=${v}.`,"two-step-operation-order","u03-l02-two-step-v1",i);
 const n=i+2,constant=i+3,result=-(n*(i+1))+constant,solution=i+1;
 add(`u03-l02-ab-n-${i}`,2,3,"negative-coefficient",`Solve −${n}x + ${constant} = ${result}.`,[`x=${solution}`,`x=−${solution}`,`x=${solution+1}`,`x=${n}`],`Subtract ${constant}: −${n}x=−${n*solution}; divide by −${n} to get x=${solution}.`,"negative-coefficient-sign","u03-l02-negative-v1",i);
}
// Lesson 03 · multi-step equations
for(let i=1;i<=5;i++){
 const k=i+2,b=i+1,x=i+2,total=k*(x+b);
 add(`u03-l03-ab-d-${i}`,3,1,"distribution-equation",`Solve ${k}(x + ${b}) = ${total}.`,[`x=${x}`,`x=${x+b}`,`x=${total-k}`,`x=${total/k}`],`Divide by ${k} to get x+${b}=${x+b}; subtract ${b}, so x=${x}.`,"distribution-or-division-sequence","u03-l03-distribute-v1",i);
 const a=i+2,bcoef=i+3,c=i+4,x2=i+1,total2=(a+bcoef)*x2+c;
 add(`u03-l03-ab-c-${i}`,3,2,"combine-and-solve",`Solve ${a}x + ${bcoef}x + ${c} = ${total2}.`,[`x=${x2}`,`x=${x2+1}`,`x=${x2-1}`,`x=${a+bcoef}`],`Combine like terms to get ${a+bcoef}x+${c}=${total2}; then isolate x=${x2}.`,"combine-like-terms-before-isolating","u03-l03-combine-v1",i);
 const n=i+2,q=i+1,x3=i+2,right=-(n)*(x3-q)+2*x3;
 add(`u03-l03-ab-s-${i}`,3,3,"negative-distribution",`Solve −${n}(x − ${q}) + 2x = ${right}.`,[`x=${x3}`,`x=−${x3}`,`x=${q}`,`x=${x3+1}`],`Distribute the negative factor to both terms, combine x-terms, and isolate x. Substitution confirms x=${x3}.`,"negative-distribution-sign","u03-l03-negative-v1",i);
}
// Lesson 04 · variables on both sides, identities, contradictions
for(let i=1;i<=5;i++){
 const a=i+5,b=i+2,x=i+1,c=i+2,d=a*x+b-c*x;
 add(`u03-l04-ab-o-${i}`,4,1,"both-sides-one-solution",`Solve ${a}x + ${b} = ${c}x + ${d}.`,[`x=${x}`,`x=${x+1}`,`x=−${x}`,`infinitely many solutions`],`Subtract ${c}x and ${b}; the equation reduces to ${a-c}x=${d-b}, so x=${x}.`,"variables-both-sides-isolation","u03-l04-one-v1",i);
 const k=i+2,b0=i+1;
 add(`u03-l04-ab-i-${i}`,4,2,"identity",`Classify ${k}(x + ${b0}) = ${k}x + ${k*b0}.`,["identity: infinitely many solutions","contradiction: no solution","one solution","two solutions"],`Distribution makes both sides identical, so every real x satisfies the equation.`,"identity-recognition","u03-l04-identity-v1",i);
 const m=i+3,left=m*(i+1),right=left+1;
 add(`u03-l04-ab-c-${i}`,4,3,"contradiction",`Classify ${m}x + ${left} = ${m}x + ${right}.`,["contradiction: no solution","identity: infinitely many solutions","one solution","x=0 only"],`Subtracting ${m}x leaves ${left}=${right}, a false statement, so there is no solution.`,"contradiction-recognition","u03-l04-contradiction-v1",i);
}
// Lesson 05 · literal equations
for(let i=1;i<=5;i++){
 const label=i+1;
 add(`u03-l05-ab-p-${i}`,5,1,"literal-product",`Solve V = lwh for h, assuming lw ≠ 0.`,["h = V/(lw)","h = Vlw","h = lw/V","h = V − lw"],"Divide both sides by the complete product lw to isolate h.","literal-equation-divide-product","u03-l05-product-v1",i);
 add(`u03-l05-ab-m-${i}`,5,2,"slope-formula",`Solve y = mx + b for m, assuming x ≠ 0.`,["m = (y − b)/x","m = y − bx","m = x/(y − b)","m = (y + b)/x"],"Subtract b, then divide the entire result by x: m=(y−b)/x.","literal-equation-grouped-division","u03-l05-slope-v1",i);
 add(`u03-l05-ab-r-${i}`,5,3,"perimeter-formula",`Solve P = 2l + 2w for w.`,["w = (P − 2l)/2","w = P − 2l/2","w = P/(2l + 2)","w = (P + 2l)/2"],"Subtract 2l from both sides, then divide the entire difference by 2.","literal-equation-parentheses","u03-l05-perimeter-v1",i);
}
// Lesson 06 · proportions, direct variation, percent
for(let i=1;i<=5;i++){
 const den=i+3,num=i+1,x=i+2,rightDen=den*(i+2),rightNum=x*(i+2);
 add(`u03-l06-ab-p-${i}`,6,1,"proportion",`Solve x/${den} = ${rightNum}/${rightDen}.`,[`x=${x}`,`x=${rightNum}`,`x=${den}`,`x=${x+den}`],`The right ratio simplifies to ${x}/${den}, so x=${x}; cross-products give the same result.`,"proportion-cross-product","u03-l06-proportion-v1",i);
 const k=i+2,x0=i+3,y0=k*x0,newX=i+5,newY=k*newX;
 add(`u03-l06-ab-d-${i}`,6,2,"direct-variation",`y varies directly with x. If y=${y0} when x=${x0}, what is y when x=${newX}?`,[`${newY}`,`${y0+newX}`,`${k+newX}`,`${newY+k}`],`k=y/x=${k}; therefore y=${k}(${newX})=${newY}.`,"direct-variation-constant","u03-l06-direct-v1",i);
 const pct=10+5*i,whole=40+20*i,part=pct*whole/100;
 add(`u03-l06-ab-r-${i}`,6,3,"percent",`What is ${pct}% of ${whole}?`,[`${part}`,`${pct+whole}`,`${whole-part}`,`${pct*whole}`],`Convert ${pct}% to ${pct/100} and multiply by ${whole}: ${part}.`,"percent-decimal-conversion","u03-l06-percent-v1",i);
}
// Lesson 07 · contextual equation models
for(let i=1;i<=5;i++){
 const fixed=i+3,rate=i+4,hours=i+2,total=fixed+rate*hours;
 add(`u03-l07-ab-s-${i}`,7,1,"service-model",`A service charges $${fixed} plus $${rate} per hour. The bill is $${total}. How many hours were used?`,[`${hours} hours`,`${hours+1} hours`,`${rate} hours`,`${total-rate} hours`],`Model ${fixed}+${rate}h=${total}; subtract ${fixed} and divide by ${rate}, giving h=${hours}.`,"fixed-plus-rate-model","u03-l07-service-v1",i);
 const speed=40+10*i,time=i+1,distance=speed*time;
 add(`u03-l07-ab-d-${i}`,7,2,"distance-model",`A vehicle travels ${distance} miles at a constant ${speed} mi/h. How long does the trip take?`,[`${time} hours`,`${distance+speed} hours`,`${distance} hours`,`${speed/time} hours`],`From d=rt, t=d/r=${distance}/${speed}=${time} hours.`,"distance-rate-time-units","u03-l07-distance-v1",i);
 const price=50+10*i,pct=10+5*i,discount=price*pct/100,sale=price-discount;
 add(`u03-l07-ab-f-${i}`,7,3,"financial-model",`An item costs $${price} and is discounted ${pct}%. What is the sale price?`,[`$${sale}`,`$${discount}`,`$${price+pct}`,`$${price-discount/100}`],`The discount is ${pct/100}·${price}=$${discount}; subtract it from the original price to get $${sale}.`,"discount-vs-sale-price","u03-l07-finance-v1",i);
}
if(bank.length!==105)throw new Error("Unit 03 abundant bank count drift: "+bank.length);
window.KHAE_UNIT03_ABUNDANT_BANK=bank;
})();
