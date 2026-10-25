(()=>{
"use strict";
const bank=[];
const VERSION="unit06-abundant-v1";
function add(id,lesson,difficulty,category,prompt,options,explanation,tag,generatorId,seed){
 bank.push({id,unit:6,lesson,level:difficulty,difficulty,category,prompt,options,answer:0,answer_text:options[0],explanation,misconceptionTag:tag,reviewStatus:"generated-provisional-v1",generatorId,generatorVersion:VERSION,seed});
}
// Lesson 01 · rate of change and slope
for(let i=1;i<=5;i++){
 const x1=i,y1=i+2,dx=i+2,m=i+1,x2=x1+dx,y2=y1+m*dx;
 add(`u06-l01-ab-p-${i}`,1,1,"slope-points",`Find the slope through (${x1},${y1}) and (${x2},${y2}).`,[String(m),String(dx),String(y2-y1),String(m+1)],`Slope=(${y2}−${y1})/(${x2}−${x1})=${m}.`,"rise-over-run","u06-l01-points-v1",i);
 const type=i%4;
 const pairs=type===0?[[0,3],[2,3],"zero"]:type===1?[[4,1],[4,7],"undefined"]:type===2?[[0,6],[2,2],"negative"]:[[0,1],[2,7],"positive"];
 add(`u06-l01-ab-t-${i}`,1,2,"slope-type",`What type of slope does the line through (${pairs[0][0]},${pairs[0][1]}) and (${pairs[1][0]},${pairs[1][1]}) have?`,[pairs[2],"positive","negative","zero"].filter((v,idx,a)=>a.indexOf(v)===idx).concat(["undefined"]).slice(0,4),`Comparing the changes in y and x identifies the slope as ${pairs[2]}.`,"slope-type-classification","u06-l01-type-v1",i);
 const rate=5*i+10,hours=i+2,change=rate*hours;
 add(`u06-l01-ab-c-${i}`,1,3,"context-rate",`A tank gains ${change} liters in ${hours} hours at a constant rate. What is the rate of change?`,[`${rate} liters/hour`,`${change} liters/hour`,`${hours} liters/hour`,`${rate} hours/liter`],`Rate of change=${change}/${hours}=${rate} liters per hour.`,"rate-units-direction","u06-l01-context-v1",i);
}
// Lesson 02 · slope from tables, graphs and points
for(let i=1;i<=5;i++){
 const m=i+1,b=i+2,x0=0,x1=2,x2=4,y0=b,y1=2*m+b,y2=4*m+b;
 add(`u06-l02-ab-tab-${i}`,2,1,"table-slope",`A table has x: 0,2,4 and y: ${y0},${y1},${y2}. What is the slope?`,[String(m),String(2*m),String(b),String(m+1)],`Each x-step is 2 and each y-step is ${2*m}, so slope=${2*m}/2=${m}.`,"table-delta-ratio","u06-l02-table-v1",i);
 const a=i,b0=i+3,c=i+4,d=b0+2*(c-a);
 add(`u06-l02-ab-order-${i}`,2,2,"point-order",`Using points (${a},${b0}) and (${c},${d}), why does reversing point order give the same slope?`,["Both numerator and denominator change sign, so their ratio is unchanged","Only the numerator changes sign","Only the denominator changes sign","Slope depends on which point is listed first"],"Reversing point order negates both differences, leaving the quotient unchanged.","consistent-subtraction-order","u06-l02-order-v1",i);
 const m2=i+2,b2=i;
 add(`u06-l02-ab-const-${i}`,2,3,"constant-rate",`For x: 0,1,2,3 and y: ${b2},${b2+m2},${b2+2*m2},${b2+3*m2}, what evidence shows a constant rate of change?`,[`Every +1 in x corresponds to +${m2} in y`,`The y-values are all equal`,`The x-values decrease`,`The ratio y/x is defined at x=0`],`Equal input steps produce the same output change ${m2}, so the rate is constant.`,"constant-differences","u06-l02-constant-v1",i);
}
// Lesson 03 · slope-intercept form
for(let i=1;i<=5;i++){
 const m=i+1,b=i+2;
 add(`u06-l03-ab-eq-${i}`,3,1,"slope-intercept-equation",`Which equation has slope ${m} and y-intercept ${b}?`,[`y=${m}x+${b}`,`y=${b}x+${m}`,`y=${m+b}x`,`y=x+${m+b}`],`In y=mx+b, m is slope and b is the y-intercept.`,"slope-vs-intercept","u06-l03-equation-v1",i);
 const b2=5*i,m2=i+2;
 add(`u06-l03-ab-int-${i}`,3,2,"intercept-meaning",`A cost model is C=${m2}h+${b2}. What does ${b2} represent?`,[`The initial cost when h=0`,`The cost added per hour`,`The number of hours`,`The maximum possible cost`],`The constant term is the output at h=0, so it is the initial cost.`,"initial-value-vs-rate","u06-l03-intercept-v1",i);
 const rate=3*i+2,start=10+i;
 add(`u06-l03-ab-context-${i}`,3,3,"linear-context",`A quantity starts at ${start} and increases by ${rate} each period. Which model fits period x?`,[`y=${rate}x+${start}`,`y=${start}x+${rate}`,`y=${rate+start}x`,`y=${start}−${rate}x`],`The rate is the coefficient of x and the starting value is the intercept.`,"rate-initial-value-placement","u06-l03-context-v1",i);
}
// Lesson 04 · point-slope and standard form
for(let i=1;i<=5;i++){
 const m=i+1,x1=i,y1=i+3;
 add(`u06-l04-ab-ps-${i}`,4,1,"point-slope",`Which point-slope equation has slope ${m} and passes through (${x1},${y1})?`,[`y−${y1}=${m}(x−${x1})`,`y+${y1}=${m}(x+${x1})`,`y−${x1}=${m}(x−${y1})`,`y=${m}x+${y1}`],`Point-slope form is y−y₁=m(x−x₁).`,"point-slope-coordinate-placement","u06-l04-point-v1",i);
 const A=i+2,B=i+1,C=A*B*2;
 add(`u06-l04-ab-int-${i}`,4,2,"standard-intercepts",`For ${A}x+${B}y=${C}, what is the x-intercept?`,[`(${C/A},0)`,`(0,${C/B})`,`(${A},0)`,`(${C},0)`],`Set y=0: ${A}x=${C}, so x=${C/A}.`,"standard-form-intercept","u06-l04-intercept-v1",i);
 const c=i+3;
 add(`u06-l04-ab-special-${i}`,4,3,"special-lines",`Which equation represents a vertical line through x=${c}?`,[`x=${c}`,`y=${c}`,`y=${c}x`,`x+y=${c}`],`Every point on a vertical line has the same x-coordinate, ${c}.`,"vertical-vs-horizontal-line","u06-l04-special-v1",i);
}
// Lesson 05 · parallel and perpendicular lines
for(let i=1;i<=5;i++){
 const m=i+1;
 add(`u06-l05-ab-par-${i}`,5,1,"parallel",`What slope must a line parallel to y=${m}x+3 have?`,[String(m),String(-m),`−1/${m}`,String(1/m)],"Parallel nonvertical lines have equal slopes.","parallel-equal-slope","u06-l05-parallel-v1",i);
 const p=i+2;
 add(`u06-l05-ab-perp-${i}`,5,2,"perpendicular",`What slope is perpendicular to slope ${p}?`,[`−1/${p}`,`1/${p}`,String(-p),String(p)],"Perpendicular nonvertical slopes are negative reciprocals.","perpendicular-negative-reciprocal","u06-l05-perp-v1",i);
 const m2=i+1,x0=i,y0=i+2,b0=y0-m2*x0;
 add(`u06-l05-ab-write-${i}`,5,3,"parallel-equation",`Which line is parallel to y=${m2}x−4 and passes through (${x0},${y0})?`,[`y=${m2}x+${b0}`,`y=−${m2}x+${b0}`,`y=(−1/${m2})x+${b0}`,`y=${m2+1}x+${b0}`],`Keep slope ${m2}; using the point gives intercept ${b0}.`,"parallel-through-point","u06-l05-write-v1",i);
}
// Lesson 06 · scatterplots, correlation and lines of fit
for(let i=1;i<=5;i++){
 const desc=i%2?"as x increases, y generally increases":"as x increases, y generally decreases";
 const ans=i%2?"positive correlation":"negative correlation";
 add(`u06-l06-ab-dir-${i}`,6,1,"correlation-direction",`A scatterplot shows that ${desc}. Which description is most appropriate?`,[ans,i%2?"negative correlation":"positive correlation","no association","proof of causation"],`The overall direction is ${ans}; association alone does not prove causation.`,"correlation-direction","u06-l06-direction-v1",i);
 add(`u06-l06-ab-cause-${i}`,6,2,"association-causation",`A strong correlation appears between two variables. What conclusion is justified without additional evidence?`,["They are associated, but correlation alone does not establish causation","One variable definitely causes the other","The relationship must be linear forever","Every data point must lie on one line"],"Correlation describes association; causal claims require stronger design and evidence.","correlation-not-causation","u06-l06-causation-v1",i);
 const max=20+5*i,inside=max-2,outside=max+20;
 add(`u06-l06-ab-extra-${i}`,6,3,"interpolation-extrapolation",`A line of fit was built from x-values 0 through ${max}. Which prediction is interpolation?`,[`Predict at x=${inside}`,`Predict at x=${outside}`,`Predict at x=−${outside}`,`Use the line to claim causation`],`${inside} lies inside the observed x-range, so this is interpolation.`,"interpolation-vs-extrapolation","u06-l06-interpolation-v1",i);
}
// Lesson 07 · regression, residuals and limitations
for(let i=1;i<=5;i++){
 const predicted=30+5*i,observed=predicted+(i-3),res=observed-predicted;
 add(`u06-l07-ab-res-${i}`,7,1,"residual",`Observed value ${observed}, predicted value ${predicted}. What is the residual?`,[String(res),String(-res),String(observed+predicted),String(Math.abs(res)+1)],`Residual=observed−predicted=${observed}−${predicted}=${res}.`,"residual-sign","u06-l07-residual-v1",i);
 add(`u06-l07-ab-pattern-${i}`,7,2,"residual-pattern",`Residuals are mostly positive at small x, negative in the middle, and positive again at large x. What does that suggest?`,["A curved pattern remains, so a linear model may be inadequate","The linear model is automatically perfect","Residual signs do not matter","The variables must be causally related"],"A systematic residual pattern means the model is missing structure; random scatter around zero is more consistent with a suitable linear model.","residual-pattern-model-fit","u06-l07-pattern-v1",i);
 const upper=50+10*i;
 add(`u06-l07-ab-limit-${i}`,7,3,"model-limitation",`A regression model was fit using x-values from 10 to ${upper}. Which prediction needs the strongest caution?`,[`x=${upper+100}`,`x=${upper-5}`,`x=20`,`x=10`],`x=${upper+100} is far outside the observed domain, so the prediction is substantial extrapolation.`,"extrapolation-domain-limit","u06-l07-limit-v1",i);
}
// Lesson 08 · modelling, prediction and decisions
for(let i=1;i<=5;i++){
 const start=20+5*i,rate=3+i;
 add(`u06-l08-ab-model-${i}`,8,1,"build-model",`A quantity begins at ${start} and changes by +${rate} each period. Which linear model fits?`,[`y=${rate}x+${start}`,`y=${start}x+${rate}`,`y=${rate+start}x`,`y=${start}−${rate}x`],"The starting value is the intercept and the per-period change is the slope.","build-linear-model","u06-l08-model-v1",i);
 const af=5+i,ar=2+i,bf=10+i,br=i+4,x=i+5,cA=af+ar*x,cB=bf+br*x;
 const winner=cA<cB?"Plan A":"Plan B";
 add(`u06-l08-ab-plan-${i}`,8,2,"compare-plans",`Plan A costs ${af}+${ar}x and Plan B costs ${bf}+${br}x. At x=${x}, which plan costs less?`,[`${winner} (${Math.min(cA,cB)})`,`${winner==="Plan A"?"Plan B":"Plan A"} (${Math.max(cA,cB)})`,"They always cost the same","There is not enough information"],`Substitute x=${x}: Plan A=${cA}, Plan B=${cB}; ${winner} is lower.`,"compare-models-at-input","u06-l08-plan-v1",i);
 const rate2=i+3,start2=i+10,x2=i+4,pred=rate2*x2+start2;
 add(`u06-l08-ab-decision-${i}`,8,3,"decision-model",`For y=${rate2}x+${start2}, the model predicts ${pred} at x=${x2}. What should accompany a defensible decision based on that prediction?`,["State relevant assumptions and whether x is within a credible domain","Treat the prediction as certain","Ignore units and context","Assume the relationship continues forever"],"A model-based decision should name assumptions, units, domain, uncertainty, and limits.","model-decision-limitations","u06-l08-decision-v1",i);
}
if(bank.length!==120)throw new Error("Unit 06 abundant bank count drift: "+bank.length);
window.KHAE_UNIT06_ABUNDANT_BANK=bank;
})();
