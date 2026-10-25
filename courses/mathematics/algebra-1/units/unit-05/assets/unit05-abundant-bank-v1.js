(()=>{
"use strict";
const bank=[];
const VERSION="unit05-abundant-v1";
function add(id,lesson,difficulty,category,prompt,options,explanation,tag,generatorId,seed){
 bank.push({id,unit:5,lesson,level:difficulty,difficulty,category,prompt,options,answer:0,answer_text:options[0],explanation,misconceptionTag:tag,reviewStatus:"generated-provisional-v1",generatorId,generatorVersion:VERSION,seed});
}
// Lesson 01 · relations and function tests
for(let i=1;i<=5;i++){
 const a=i,b=i+1,c=i+2;
 add(`u05-l01-ab-r-${i}`,1,1,"relations",`Which relation is a function?`,[`{(${a},2),(${b},2),(${c},3)}`,`{(${a},2),(${a},3),(${b},4)}`,`{(${b},1),(${b},2)}`,`{(${c},0),(${c},1),(${a},2)}`],"A relation is a function when every input is paired with exactly one output; different inputs may share an output.","one-output-per-input","u05-l01-relation-v1",i);
 add(`u05-l01-ab-m-${i}`,1,2,"mapping",`A mapping sends input ${a} to both ${b} and ${c}. What does that prove?`,["The relation is not a function","The relation is one-to-one","The outputs must be equal","The input is not in the domain"],`One input, ${a}, has two different outputs, so the relation fails the function rule.`,"multiple-outputs-one-input","u05-l01-mapping-v1",i);
 add(`u05-l01-ab-v-${i}`,1,3,"vertical-line-test",`A graph is intersected twice by the vertical line x=${i}. What conclusion is valid?`,["The graph is not a function of x","The graph must be linear","The graph has no range","Two different inputs share one output"],"A vertical line hitting the graph more than once means one x-value has multiple y-values.","vertical-line-test","u05-l01-vertical-v1",i);
}
// Lesson 02 · function notation and evaluation
for(let i=1;i<=5;i++){
 const m=i+2,b=i+1,x=i-2,y=m*x+b;
 add(`u05-l02-ab-l-${i}`,2,1,"function-evaluation",`If f(x)=${m}x+${b}, find f(${x}).`,[String(y),String(m+x+b),String(m*(x+b)),String(y+m)],`Substitute x=${x}: f(${x})=${m}(${x})+${b}=${y}.`,"function-substitution","u05-l02-linear-v1",i);
 const n=i+2,x2=-(i+1),y2=x2*x2+n;
 add(`u05-l02-ab-q-${i}`,2,2,"quadratic-evaluation",`If g(x)=x²+${n}, find g(${x2}).`,[String(y2),String(-(x2*x2)+n),String(x2*x2-n),String(x2+n)],`Use parentheses for the negative input: (${x2})²+${n}=${y2}.`,"negative-input-squaring","u05-l02-quadratic-v1",i);
 const a=i+2,b0=i+3,target=a*(i+1)+b0,sol=i+1;
 add(`u05-l02-ab-s-${i}`,2,3,"solve-function-value",`For h(x)=${a}x+${b0}, solve h(x)=${target}.`,[`x=${sol}`,`x=${target-b0}`,`x=${sol+1}`,`x=${a}`],`Solve ${a}x+${b0}=${target}; subtract ${b0} and divide by ${a}, giving x=${sol}.`,"function-output-vs-input","u05-l02-solve-v1",i);
}
// Lesson 03 · domain and range
for(let i=1;i<=5;i++){
 const a=i,b=i+2,c=i+4;
 add(`u05-l03-ab-d-${i}`,3,1,"finite-domain",`For {(${a},${a+5}),(${b},${b+5}),(${c},${c+5})}, what is the domain?`,[`{${a},${b},${c}}`,`{${a+5},${b+5},${c+5}}`,"all real numbers",`{${a},${c}}`],"The domain is the set of input, or first-coordinate, values.","domain-input-set","u05-l03-finite-v1",i);
 const excluded=i+2;
 add(`u05-l03-ab-r-${i}`,3,2,"rational-domain",`Which input is excluded from f(x)=1/(x−${excluded})?`,[String(excluded),"0",String(-excluded),String(excluded+1)],`The denominator is zero at x=${excluded}, so that input is excluded.`,"denominator-zero-domain","u05-l03-rational-v1",i);
 const cap=10+i;
 add(`u05-l03-ab-c-${i}`,3,3,"context-domain",`A model uses n for the number of students in a group, with capacity ${cap}. Which contextual domain is most reasonable?`,[`whole numbers 0 through ${cap}`,`all real numbers`,`all negative integers`,`all numbers greater than ${cap}`],`A student count is discrete, cannot be negative, and cannot exceed capacity ${cap}.`,"context-restricts-domain","u05-l03-context-v1",i);
}
// Lesson 04 · multiple representations and rules
for(let i=1;i<=5;i++){
 const m=i+2,b=i+1,y0=b,y1=m+b,y2=2*m+b;
 add(`u05-l04-ab-t-${i}`,4,1,"table-rule",`A table has x: 0,1,2 and y: ${y0},${y1},${y2}. Which rule fits all three pairs?`,[`y=${m}x+${b}`,`y=${b}x+${m}`,`y=${m}x`,`y=x+${b}`],`The y-values increase by ${m}, and y=${b} when x=0, so y=${m}x+${b}.`,"slope-intercept-from-table","u05-l04-table-v1",i);
 const a=i+1;
 add(`u05-l04-ab-v-${i}`,4,2,"rule-verification",`A proposed rule is y=${a+2}x+${a}. Which check best tests it against a table?`,["Substitute every listed x-value and compare every predicted y-value","Check only the first row","Compare only the largest y-value","Count the number of rows"],"A proposed rule must fit every given input-output pair, not just a convenient example.","verify-rule-all-data","u05-l04-verify-v1",i);
 add(`u05-l04-ab-r-${i}`,4,3,"representation-choice",`Which representation most directly reveals whether a function has a turning point or an intercept pattern?`,["A graph","A single ordered pair","A vocabulary definition","One isolated output"],"A graph makes global shape, turning behavior, and intercepts visually accessible.","representation-purpose","u05-l04-representation-v1",i);
}
// Lesson 05 · transformations
for(let i=1;i<=5;i++){
 const k=i+1;
 add(`u05-l05-ab-v-${i}`,5,1,"vertical-shift",`Compared with y=x², what does y=x²+${k} do?`,[`Shift up ${k}`,`Shift down ${k}`,`Shift right ${k}`,`Reflect across the x-axis`],`Adding ${k} outside the function increases every output by ${k}, a vertical shift up.`,"inside-vs-outside-shift","u05-l05-vertical-v1",i);
 const h=i+1;
 add(`u05-l05-ab-h-${i}`,5,2,"horizontal-shift",`Compared with y=|x|, what does y=|x−${h}| do?`,[`Shift right ${h}`,`Shift left ${h}`,`Shift up ${h}`,`Stretch vertically by ${h}`],`Replacing x with x−${h} shifts the graph right ${h}.`,"horizontal-shift-sign","u05-l05-horizontal-v1",i);
 const a=i+2;
 add(`u05-l05-ab-s-${i}`,5,3,"reflection-stretch",`Compared with y=|x|, what does y=−${a}|x| do?`,[`Reflect across the x-axis and vertically stretch by factor ${a}`,`Reflect across the y-axis only`,`Shift down ${a}`,`Horizontally stretch by factor ${a}`],`The negative sign reflects outputs across the x-axis; |${a}| multiplies output magnitudes by ${a}.`,"reflection-vs-stretch","u05-l05-stretch-v1",i);
}
// Lesson 06 · piecewise functions and discrete models
for(let i=1;i<=5;i++){
 const b=i+1;
 add(`u05-l06-ab-b-${i}`,6,1,"piecewise-boundary",`f(x)=x+${b} for x<${i}, and 2x for x≥${i}. Which rule applies at x=${i}?`,["The 2x rule","The x+"+b+" rule","Both rules","Neither rule"],`The condition x≥${i} includes the boundary x=${i}.`,"piecewise-boundary-ownership","u05-l06-boundary-v1",i);
 const split=i,neg=-i,offset=i+2;
 add(`u05-l06-ab-e-${i}`,6,2,"piecewise-evaluation",`g(x)=x−${offset} for x<0 and x² for x≥0. Find g(${neg}).`,[String(neg-offset),String(neg*neg),String(neg+offset),String(offset)],`Because ${neg}<0, use x−${offset}: ${neg}−${offset}=${neg-offset}.`,"choose-piecewise-rule","u05-l06-evaluate-v1",i);
 const threshold=5*i,base=i+4,extra=i+2;
 add(`u05-l06-ab-c-${i}`,6,3,"tiered-model",`A service costs $${base} for up to ${threshold} units and $${base+extra} above ${threshold}. What kind of model best represents this pricing?`,["A piecewise function with separate domain conditions","One constant rule for every input","A relation with two outputs for every input","A continuous quadratic model"],"Tiered pricing changes rules at a boundary, which is naturally represented by a piecewise function.","tiered-context-piecewise","u05-l06-context-v1",i);
}
// Lesson 07 · arithmetic sequences and inverse thinking
for(let i=1;i<=5;i++){
 const first=i+2,d=i+2,t4=first+3*d,next=first+4*d;
 add(`u05-l07-ab-n-${i}`,7,1,"arithmetic-next",`The arithmetic sequence begins ${first}, ${first+d}, ${first+2*d}, ${t4}, … What is the next term?`,[String(next),String(t4+d+1),String(t4*2),String(first+d)],`The common difference is ${d}; add it to ${t4} to get ${next}.`,"common-difference-next-term","u05-l07-next-v1",i);
 const a1=i+3,d2=i+1;
 add(`u05-l07-ab-e-${i}`,7,2,"explicit-sequence",`An arithmetic sequence has a₁=${a1} and common difference ${d2}. Which explicit rule is correct?`,[`aₙ=${a1}+${d2}(n−1)`,`aₙ=${a1}n+${d2}`,`aₙ=${d2}+${a1}(n−1)`,`aₙ=${a1}+${d2}n+1`],`Arithmetic sequences use aₙ=a₁+d(n−1).`,"sequence-explicit-form","u05-l07-explicit-v1",i);
 const start=i+2,d3=i+2,n=i+4,value=start+(n-1)*d3;
 add(`u05-l07-ab-i-${i}`,7,3,"inverse-sequence",`For aₙ=${start}+${d3}(n−1), which term number has value ${value}?`,[`n=${n}`,`n=${n-1}`,`n=${value}`,`n=${d3}`],`Solve ${start}+${d3}(n−1)=${value}; this gives n=${n}.`,"inverse-term-number","u05-l07-inverse-v1",i);
}
if(bank.length!==105)throw new Error("Unit 05 abundant bank count drift: "+bank.length);
window.KHAE_UNIT05_ABUNDANT_BANK=bank;
})();
