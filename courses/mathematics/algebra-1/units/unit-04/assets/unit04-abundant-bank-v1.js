(()=>{
"use strict";
const bank=[];
const VERSION="unit04-abundant-v1";
function add(id,lesson,difficulty,category,prompt,options,explanation,tag,generatorId,seed){
 bank.push({id,unit:4,lesson,level:difficulty,difficulty,category,prompt,options,answer:0,answer_text:options[0],explanation,misconceptionTag:tag,reviewStatus:"generated-provisional-v1",generatorId,generatorVersion:VERSION,seed});
}
// Lesson 01 · inequality meaning, number lines, interval notation
for(let i=1;i<=5;i++){
 const a=i-3;
 add(`u04-l01-ab-i-${i}`,1,1,"interval-notation",`Which interval represents x ≥ ${a}?`,[`[${a}, ∞)`,`(${a}, ∞)`,`(−∞, ${a}]`,`(−∞, ${a})`],`The boundary ${a} is included, so use a bracket at ${a}; values extend to the right.`,"included-endpoint-bracket","u04-l01-interval-v1",i);
 const b=i+2;
 add(`u04-l01-ab-e-${i}`,1,2,"endpoint",`For x < ${b}, how should the boundary at ${b} appear on a number line?`,[`Open circle at ${b}, shade left`,`Closed circle at ${b}, shade left`,`Open circle at ${b}, shade right`,`Closed circle at ${b}, shade right`],`A strict inequality excludes ${b}, so the endpoint is open, and x<${b} shades left.`,"open-vs-closed-endpoint","u04-l01-endpoint-v1",i);
 const c=i+1;
 add(`u04-l01-ab-t-${i}`,1,3,"translation",`Which inequality matches the interval (−∞, ${c}]?`,[`x ≤ ${c}`,`x < ${c}`,`x ≥ ${c}`,`x > ${c}`],`The interval extends left without bound and includes ${c}, so x≤${c}.`,"interval-to-inequality","u04-l01-translate-v1",i);
}
// Lesson 02 · one-step and multi-step inequalities
for(let i=1;i<=5;i++){
 const a=i+2,x=i+1,total=a*x;
 add(`u04-l02-ab-o-${i}`,2,1,"one-step-inequality",`Solve ${a}x ≤ ${total}.`,[`x ≤ ${x}`,`x ≥ ${x}`,`x < ${x}`,`x ≤ ${total}`],`Divide by positive ${a}; the inequality direction stays the same, giving x≤${x}.`,"positive-division-direction","u04-l02-one-step-v1",i);
 const m=i+2,x2=i+2,b=i+3,c=m*x2+b;
 add(`u04-l02-ab-m-${i}`,2,2,"multi-step-inequality",`Solve ${m}x + ${b} < ${c}.`,[`x < ${x2}`,`x > ${x2}`,`x ≤ ${x2}`,`x < ${c-b}`],`Subtract ${b}, then divide by positive ${m}; x<${x2}.`,"multi-step-positive-inequality","u04-l02-multi-v1",i);
 const boundary=i+1,test=boundary-1;
 add(`u04-l02-ab-v-${i}`,2,3,"test-value",`The solution is x > ${boundary}. Which test value should fail the original inequality if the solution is correct?`,[String(test),String(boundary+1),String(boundary+2),String(boundary+5)],`${test} is not greater than ${boundary}, so it belongs outside the solution set and should fail the original inequality.`,"solution-vs-nonsolution-test","u04-l02-test-v1",i);
}
// Lesson 03 · negative multipliers and sign reversal
for(let i=1;i<=5;i++){
 const n=i+2,bound=i+1,total=-(n)*bound;
 add(`u04-l03-ab-n-${i}`,3,1,"negative-division",`Solve −${n}x < ${total}.`,[`x > ${bound}`,`x < ${bound}`,`x ≥ ${bound}`,`x > −${bound}`],`Dividing by −${n} reverses the inequality, so x>${bound}.`,"reverse-on-negative-division","u04-l03-negative-v1",i);
 const a=i+1,b=i+4;
 add(`u04-l03-ab-r-${i}`,3,2,"order-reversal",`If ${a} < ${b}, what must be true after multiplying both sides by −1?`,[`−${a} > −${b}`,`−${a} < −${b}`,`−${a} = −${b}`,`The order cannot be compared`],`Reflecting both numbers across zero reverses their order: −${a}>−${b}.`,"negative-scaling-order","u04-l03-order-v1",i);
 const k=i+2,x=i+2,b0=i+3,right=-(k)*x+b0;
 add(`u04-l03-ab-m-${i}`,3,3,"negative-multistep",`Solve −${k}x + ${b0} ≥ ${right}.`,[`x ≤ ${x}`,`x ≥ ${x}`,`x < ${x}`,`x ≤ −${x}`],`Subtract ${b0}, then divide by −${k}; the inequality reverses, giving x≤${x}.`,"negative-coefficient-multistep","u04-l03-multistep-v1",i);
}
// Lesson 04 · compound inequalities
for(let i=1;i<=5;i++){
 const low=i-3,high=i+4;
 add(`u04-l04-ab-a-${i}`,4,1,"compound-and",`Which interval represents ${low} < x ≤ ${high}?`,[`(${low}, ${high}]`,`[${low}, ${high})`,`(−∞, ${low}) ∪ [${high}, ∞)`,`[${low}, ${high}]`],`AND means intersection: x lies between the boundaries, excluding ${low} and including ${high}.`,"compound-and-endpoints","u04-l04-and-v1",i);
 const a=i+1,b=i+5;
 add(`u04-l04-ab-o-${i}`,4,2,"compound-or",`Which interval represents x < ${a} OR x ≥ ${b}?`,[`(−∞, ${a}) ∪ [${b}, ∞)`,`[${a}, ${b})`,`(${a}, ${b}]`,`(−∞, ${b}] `],`OR means union: values left of ${a} together with values at or right of ${b}.`,"compound-or-union","u04-l04-or-v1",i);
 const center=i+2,radius=i+1,low2=center-radius,high2=center+radius;
 add(`u04-l04-ab-s-${i}`,4,3,"compound-solve",`Solve ${low2} ≤ x + ${i} ≤ ${high2}.`,[`${low2-i} ≤ x ≤ ${high2-i}`,`${low2+i} ≤ x ≤ ${high2+i}`,`x ≤ ${low2-i} or x ≥ ${high2-i}`,`${low2-i} < x < ${high2-i}`],`Subtract ${i} from all three parts of the chained inequality.`,"compound-three-part-operation","u04-l04-solve-v1",i);
}
// Lesson 05 · absolute value equations
for(let i=1;i<=5;i++){
 const center=i+1,dist=i+2,left=center-dist,right=center+dist;
 add(`u04-l05-ab-t-${i}`,5,1,"absolute-two-solutions",`Solve |x − ${center}| = ${dist}.`,[`x=${left} or x=${right}`,`x=${right} only`,`x=${left} only`,`x=${center}`],`Points ${dist} units from ${center} are ${center}−${dist}=${left} and ${center}+${dist}=${right}.`,"absolute-distance-two-points","u04-l05-two-v1",i);
 const c=i+2;
 add(`u04-l05-ab-z-${i}`,5,2,"absolute-zero-case",`How many real solutions does |x + ${c}| = 0 have?`,["1","0","2","infinitely many"],`Absolute value is zero only when its inside expression is zero, so x=−${c} is the single solution.`,"absolute-zero-one-solution","u04-l05-zero-v1",i);
 const neg=-(i+1);
 add(`u04-l05-ab-n-${i}`,5,3,"absolute-no-solution",`How many real solutions does |2x − ${i}| = ${neg} have?`,["0","1","2","4"],"An absolute value cannot equal a negative number, so there are no real solutions.","absolute-negative-no-solution","u04-l05-none-v1",i);
}
// Lesson 06 · absolute-value inequalities and contextual tolerance
for(let i=1;i<=5;i++){
 const center=i+2,rad=i+1,low=center-rad,high=center+rad;
 add(`u04-l06-ab-in-${i}`,6,1,"absolute-inside",`Solve |x − ${center}| < ${rad}.`,[`${low} < x < ${high}`,`x < ${low} or x > ${high}`,`${low} ≤ x ≤ ${high}`,`x > ${high}`],`Distance from ${center} less than ${rad} means x lies strictly inside (${low},${high}).`,"absolute-less-inside","u04-l06-inside-v1",i);
 const center2=i+3,rad2=i+2,low2=center2-rad2,high2=center2+rad2;
 add(`u04-l06-ab-out-${i}`,6,2,"absolute-outside",`Solve |x − ${center2}| ≥ ${rad2}.`,[`x ≤ ${low2} or x ≥ ${high2}`,`${low2} ≤ x ≤ ${high2}`,`x < ${low2} or x > ${high2}`,`${low2} < x < ${high2}`],`Distance at least ${rad2} from ${center2} lies on or outside the two boundaries ${low2} and ${high2}.`,"absolute-greater-outside","u04-l06-outside-v1",i);
 const target=50+10*i,tol=i+1,lo=target-tol,hi=target+tol;
 add(`u04-l06-ab-c-${i}`,6,3,"tolerance-model",`A measurement must stay within ${tol} units of target ${target}. Which constraint models acceptable values m?`,[`|m − ${target}| ≤ ${tol}`,`|m − ${target}| ≥ ${tol}`,`m ≤ ${lo} or m ≥ ${hi}`,`|m + ${target}| ≤ ${tol}`],`“Within ${tol}” means the distance from ${target} is at most ${tol}, so |m−${target}|≤${tol}.`,"tolerance-distance-model","u04-l06-context-v1",i);
}
if(bank.length!==90)throw new Error("Unit 04 abundant bank count drift: "+bank.length);
window.KHAE_UNIT04_ABUNDANT_BANK=bank;
})();
