(() => {
"use strict";
const PASS=80;
APP.passingTarget=PASS;

function rotateChoices(correct,wrongs,shift){
  const seen=new Set([String(correct)]),safe=[];
  for(const w of wrongs){
    let s=String(w);
    if(seen.has(s)){
      let n=1;
      do{s="Not enough information "+n++;}while(seen.has(s));
    }
    seen.add(s);safe.push(s);
  }
  while(safe.length<3){let s="Not enough information "+(safe.length+1);if(!seen.has(s)){seen.add(s);safe.push(s)}}
  const base=[String(correct),...safe.slice(0,3)],r=((shift%4)+4)%4;
  const choices=base.map((_,i)=>base[(i-r+4)%4]);
  return {choices,answer:r};
}
function I(prompt,correct,wrongs,explain,shift){const r=rotateChoices(correct,wrongs,shift);return [prompt,r.choices,r.answer,explain];}
function k(w,salt=0){return w.week+salt;}
function unitDomain(w){
  const n=Number(w.unitNumber);
  return n<=1?"number":n===2?"integers":n===3?"rational":n===4?"ratio":n===5?"percent":n===6?"powers":n===7?"algebra":n===8?"equations":n===9?"inequalities":n===10?"coordinate":n===11?"geometry":n===12?"data":n===13?"modeling":"number";
}
function bank(w,salt=0){
  const n=k(w,salt),d=unitDomain(w),S=i=>w.week+i+salt;
  if(d==="number"){
    const m0=2+n%5,a=6*m0,b=6*(m0+1),g=6;
    const value=437+n*3,rounded=Math.round(value/10)*10;
    const m=4+(n%5),factorTarget=6*m;
    return [
      I("Which set contains only integers?",[`-${m}`,"0",String(m+3),String(2*m)].join(", "),[`${m}/2, 1.5, 0, -2`,`√2, 3, 4, 5`,`π, 0, -1, 8`],"Integers include negative whole numbers, zero, and positive whole numbers.",S(0)),
      I(`What is the greatest common factor of ${a} and ${b}?`,g,[g+1,g+2,Math.min(a,b)+1],"The GCF is the greatest positive integer dividing both numbers.",S(1)),
      I(`Round ${value} to the nearest ten.`,rounded,[rounded+10,rounded-10,value],"Use the ones digit to decide whether to round the tens place up or keep it.",S(2)),
      I(`Evaluate ${m}+3×4.`,m+12,[(m+3)*4,m+7,12*m],"Multiplication is completed before addition.",S(3)),
      I(`Which number is definitely a factor of ${factorTarget}?`,6,[factorTarget+1,factorTarget+3,factorTarget+5],"Because the target was built as 6 times an integer, 6 divides it exactly.",S(4))
    ];
  }
  if(d==="integers"){
    const a=7+n%6,b=4+n%5;
    return [
      I(`What is |-${a}|?`,a,[-a,0,a+1],"Absolute value is distance from zero.",S(0)),
      I(`Compute -${a}+${b}.`,b-a,[a+b,-(a+b),a-b],"Adding a positive value to a negative value can be modeled on a number line.",S(1)),
      I(`Compute (-${a})(-${b}).`,a*b,[-a*b,a+b,0],"The product of two negative numbers is positive.",S(2)),
      I(`The temperature changes from ${b}°C to -${a}°C. What is the change?`,`${-a-b}°C`,[`${a+b}°C`,`${b-a}°C`,`${-a}°C`],"Change equals final value minus initial value.",S(3)),
      I("Which value is least?",-(a+5),[-a,-b,b],"The least value lies farthest left on the number line.",S(4))
    ];
  }
  if(d==="rational"){
    const p=2+n%4,q=p+3,den=5+n%4;
    const decs=[[1,2,"0.5"],[3,4,"0.75"],[2,5,"0.4"],[3,5,"0.6"]][n%4];
    return [
      I(`Which fraction is equivalent to ${p}/${q}?`,`${2*p}/${2*q}`,[`${p+1}/${q}`,`${2*p}/${q}`,`${p}/${2*q}`],"Equivalent fractions multiply numerator and denominator by the same nonzero number.",S(0)),
      I(`Compute 1/${den}+2/${den}.`,`3/${den}`,[`2/${den}`,`3/${2*den}`,`1/${den}`],"When denominators are equal, add the numerators.",S(1)),
      I(`Which decimal equals ${decs[0]}/${decs[1]}?`,decs[2],[String(Number(decs[2])+0.1),String(Number(decs[2])/10),String(Number(decs[2])+0.25)],"Divide numerator by denominator to convert a fraction to a decimal.",S(2)),
      I(`Compute 2/3 × 3/${den}.`,`2/${den}`,[`6/${den}`,`2/${den+3}`,`1/${den}`],"Multiply and simplify common factors.",S(3)),
      I(`A recipe uses ${p}/${q} cup of oats per batch. How much is needed for 2 batches?`,`${2*p}/${q} cup`,[`${p}/${2*q} cup`,`${p+2}/${q} cup`,`${p}/${q+2} cup`],"Two identical batches require twice the amount.",S(4))
    ];
  }
  if(d==="ratio"){
    const a=2+n%4,b=a+3,m=2+n%3,hours=3,total=hours*(8+n%5),scale=4+n%4;
    return [
      I(`Which ratio is equivalent to ${a}:${b}?`,`${a*m}:${b*m}`,[`${a+m}:${b+m}`,`${a*m}:${b}`,`${a}:${b*m}`],"Equivalent ratios multiply both terms by the same factor.",S(0)),
      I(`${total} miles in ${hours} hours is what unit rate?`,`${total/hours} mi/h`,[`${total} mi/h`,`${hours} mi/h`,`${total*hours} mi/h`],"Unit rate equals total quantity divided by the number of units.",S(1)),
      I(`Solve ${a}/${b}=x/${b*m}.`,a*m,[a+b,b*m,a],"Equivalent ratios scale both numerator and denominator by the same factor.",S(2)),
      I(`A map scale is 1 cm = ${scale} km. What distance does ${m+3} cm represent?`,`${scale*(m+3)} km`,[`${scale+m+3} km`,`${scale/(m+3)} km`,`${m+3} km`],"Multiply map length by the distance represented by each centimeter.",S(3)),
      I(`Which relationship is proportional?`,`x: 1,2,3; y: ${a},${2*a},${3*a}`,[`x: 1,2,3; y: ${a},${2*a+1},${3*a}`,`x: 1,2,3; y: ${a},${a},${a}`,`x: 1,2,3; y: ${a},${2*a},${4*a}`],"A proportional relationship has a constant multiplicative rate.",S(4))
    ];
  }
  if(d==="percent"){
    const whole=80+20*(n%5),price=50+10*(n%6),base=40+10*(n%4),inc=10,rate=5+n%4;
    const meal=40+5*(n%5);
    return [
      I(`What is 25% of ${whole}?`,whole*.25,[whole*.75,whole*.2,25],"25% is 0.25 of the whole.",S(0)),
      I(`A $${price} item is discounted 20%. What is the sale price?`,`$${(price*.8).toFixed(2)}`,[`$${(price*.2).toFixed(2)}`,`$${(price+20).toFixed(2)}`,`$${price.toFixed(2)}`],"A 20% discount leaves 80% of the original price.",S(1)),
      I(`A value rises from ${base} to ${base+inc}. What is the percent increase?`,`${Math.round(inc/base*1000)/10}%`,[`${inc}%`,`${Math.round((base+inc)/base*100)}%`,`${Math.round(base/inc*10)}%`],"Percent increase equals increase divided by original value times 100.",S(2)),
      I(`A meal costs $${meal} before a ${rate}% tip. Which expression gives the tip?`,`${meal}×${rate/100}`,[`${meal}+${rate}`,`${meal}÷${rate}`,`${rate}÷${meal}`],"Convert the percent to a decimal and multiply by the pre-tip amount.",S(3)),
      I(`Which decimal equals ${rate}%?`,String(rate/100),[String(rate/10),String(rate),String(rate/1000)],"Percent means per hundred, so divide by 100.",S(4))
    ];
  }
  if(d==="powers"){
    const a=2+n%3,b=3+n%2,p=3+n%4,root=5+n%4,num=(3+n%6)*100000;
    return [
      I(`Simplify ${a}^${b} × ${a}^2.`,`${a}^${b+2}`,[`${a*a}^${b+2}`,`${a}^${2*b}`,`${a+2}^${b}`],"When multiplying powers with the same base, add exponents.",S(0)),
      I(`Evaluate ${p}^2.`,p*p,[2*p,p+2,p*p*p],"Squaring means multiplying a number by itself.",S(1)),
      I(`What is √${root*root}?`,root,[root*2,root-1,root*root],"The principal square root is the nonnegative number whose square gives the radicand.",S(2)),
      I(`Write ${num} in scientific notation.`,`${num/100000} × 10^5`,[`${num/10000} × 10^4`,`${num/1000000} × 10^6`,`${num} × 10^0`],"Scientific notation uses a coefficient at least 1 and less than 10 times a power of ten.",S(3)),
      I("Which is greatest?",`10^${p}`,[`10^${p-1}`,`2×10^${p-1}`,`9×10^${p-1}`],"A full power of ten exceeds any single-digit multiple of the preceding power.",S(4))
    ];
  }
  if(d==="algebra"){
    const x=2+n%5,a=2+n%4,b=3+n%5;
    return [
      I(`Evaluate ${a}x+${b} when x=${x}.`,a*x+b,[a+b+x,a*x,a+x+b],"Substitute the given x-value before evaluating.",S(0)),
      I(`Which expression is equivalent to ${a}(x+${b})?`,`${a}x+${a*b}`,[`${a}x+${b}`,`${a+b}x`,`x+${a*b}`],"Distribute the factor to every term inside the parentheses.",S(1)),
      I(`Simplify ${a}x+${b}x-${x}.`,`${a+b}x-${x}`,[`${a*b}x-${x}`,`${a+b-x}x`,`${a+b}x+${x}`],"Combine like x-terms and keep the constant separate.",S(2)),
      I(`Which expression means “${b} less than ${a} times x”?`,`${a}x-${b}`,[`${b}-${a}x`,`${a}(x-${b})`,`${a}x+${b}`],"“b less than” means subtract b from the preceding quantity.",S(3)),
      I(`Which property justifies ${a}(x+${b})=${a}x+${a*b}?`,`Distributive property`,["Commutative property","Identity property","Inverse property"],"Multiplication distributes across addition.",S(4))
    ];
  }
  if(d==="equations"){
    const a=3+n%5,b=4+n%5,sol=2+n%6,c=a*sol+b;
    return [
      I(`Solve x+${b}=${b+sol}.`,`x=${sol}`,[`x=${b}`,`x=${b+sol}`,`x=${sol+b}`],"Subtract the same amount from both sides.",S(0)),
      I(`Solve ${a}x=${a*sol}.`,`x=${sol}`,[`x=${a*sol}`,`x=${a}`,`x=${sol+a}`],"Divide both sides by the nonzero coefficient.",S(1)),
      I(`Solve ${a}x+${b}=${c}.`,`x=${sol}`,[`x=${c-b}`,`x=${c/a}`,`x=${sol+1}`],"Undo addition, then divide by the coefficient.",S(2)),
      I(`Which value checks the equation 2y+${b}=${2*sol+b}?`,`y=${sol}`,[`y=${sol+1}`,`y=${b}`,`y=${2*sol}`],"A solution makes the two sides equal when substituted.",S(3)),
      I(`A taxi charges $${b} plus $${a} per mile. If the total is $${c}, which equation models miles x?`,`${a}x+${b}=${c}`,[`${b}x+${a}=${c}`,`${a}+${b}x=${c}`,`${a}x-${b}=${c}`],"Fixed charge plus per-mile rate times miles equals total cost.",S(4))
    ];
  }
  if(d==="inequalities"){
    const a=3+n%5,b=8+n%6,sol=b-a,m=2+n%4,cap=40+5*(n%5);
    return [
      I(`Solve x+${a}<${b}.`,`x<${sol}`,[`x>${sol}`,`x<${b+a}`,`x>${b+a}`],"Subtract a from both sides without changing the inequality direction.",S(0)),
      I(`Solve ${m}x≤${m*(sol+1)}.`,`x≤${sol+1}`,[`x≥${sol+1}`,`x≤${m*(sol+1)}`,`x<${sol}`],"Divide by the positive coefficient; the inequality direction stays the same.",S(1)),
      I(`Solve -2x>${-2*(sol+2)}.`,`x<${sol+2}`,[`x>${sol+2}`,`x<${-2*(sol+2)}`,`x>${-2*(sol+2)}`],"Dividing by a negative reverses the inequality sign.",S(2)),
      I(`Which description matches x≥${sol}?`,`A closed point at ${sol} with shading to the right`,[`An open point at ${sol} with shading left`,`A closed point at ${sol} with shading left`,`An open point at ${sol} with shading right`],"Greater-than-or-equal includes the endpoint and all larger values.",S(3)),
      I(`A venue can hold at most ${cap} people. Which inequality models attendance p?`,`p≤${cap}`,[`p≥${cap}`,`p<${cap}`,`p>${cap}`],"“At most” means less than or equal to the limit.",S(4))
    ];
  }
  if(d==="coordinate"){
    const x=1+n%4,y=2+n%5,m=2+n%3,b=1+n%4;
    return [
      I(`Which ordered pair has x=${x} and y=${y}?`,`(${x}, ${y})`,[`(${y}, ${x})`,`(${-x}, ${y})`,`(${x}, ${-y})`],"Ordered pairs are written (x, y).",S(0)),
      I(`A line rises ${2*m} units for a run of 2. What is its slope?`,m,[2*m,1/m,m+2],"Slope equals rise divided by run.",S(1)),
      I(`If y=${m}x+${b}, what is y when x=${x}?`,m*x+b,[m+x+b,m*x,m+b],"Substitute x into the function rule.",S(2)),
      I(`What is the y-intercept of y=${m}x-${b}?`,-b,[m,b,-m],"In y=mx+b, the constant term is the y-intercept.",S(3)),
      I(`Which table is linear with rate ${m}?`,`x: 0,1,2; y: ${b},${b+m},${b+2*m}`,[`x: 0,1,2; y: ${b},${b+m},${b+3*m}`,`x: 0,1,2; y: ${b},${b*b},${b*b*b}`,`x: 0,1,2; y: ${b},${b},${b}`],"A linear table has a constant first difference for equal x-steps.",S(4))
    ];
  }
  if(d==="geometry"){
    const l=6+n%4,wid=4+n%3,h=3+n%4,ang=35+n%10,scale=2+n%4;
    return [
      I(`A rectangle is ${l} by ${wid}. What is its area?`,l*wid,[2*l+2*wid,l+wid,l*wid*2],"Area equals length times width.",S(0)),
      I(`Two angles are complementary. One measures ${ang}°. What is the other?`,`${90-ang}°`,[`${180-ang}°`,`${ang}°`,`90°`],"Complementary angles sum to 90 degrees.",S(1)),
      I(`A right triangle has legs ${3*scale} and ${4*scale}. What is its hypotenuse?`,5*scale,[7*scale,12*scale,25*scale],"Scaled 3-4-5 right triangles preserve the Pythagorean relationship.",S(2)),
      I(`A rectangular prism measures ${l}×${wid}×${h}. What is its volume?`,l*wid*h,[l*wid,2*(l+wid+h),l+wid+h],"Volume equals length times width times height.",S(3)),
      I(`A drawing uses scale 1 cm = ${scale} m. A segment is ${h+2} cm. What is the actual length?`,`${scale*(h+2)} m`,[`${scale+h+2} m`,`${(h+2)/scale} m`,`${h+2} m`],"Multiply drawing length by the scale factor.",S(4))
    ];
  }
  if(d==="data"){
    const q=4+n%5,vals=[q,q+2,q+4,q+6],red=2+n%4,blue=7+n%4;
    const mean=vals.reduce((aa,bb)=>aa+bb,0)/vals.length;
    return [
      I(`What is the mean of ${vals.join(", ")}?`,mean,[mean-1,mean+1,vals[2]],"Add all values and divide by the number of values.",S(0)),
      I(`What is the median of ${q}, ${q+2}, ${q+5}, ${q+8}, ${q+10}?`,q+5,[q+2,q+8,q+10],"The median is the middle value in an ordered odd-sized set.",S(1)),
      I(`A bag has ${red} red and ${blue} blue tiles. What is P(red)?`,`${red}/${red+blue}`,[`${blue}/${red+blue}`,`${red}/${blue}`,`1/${red}`],"Probability equals favorable outcomes divided by total outcomes.",S(2)),
      I("Which graph is generally best for comparing values across categories?","Bar graph",["Scatter plot","Number line only","Unlabeled circle"],"Bar graphs support direct category comparisons.",S(3)),
      I("A scatter plot trends downward as x increases. What does that suggest?","A negative association",["A positive association","Causation is proven","No possible relationship"],"A downward trend suggests negative association, not automatic causation.",S(4))
    ];
  }
  const budget=100+10*(n%5);
  return [
    I(`A model has a budget limit of $${budget}. What should be recorded before solving?`,`Assumptions, variables, units, and constraints`,["Only the final number","A preferred answer before evidence","No units so the model is simpler"],"Transparent models state assumptions, quantities, units, and limits before calculation.",S(0)),
    I("Which result is strongest evidence that a model is reasonable?","The result is checked against units, scale, known constraints, and an independent estimate",["The answer is long","The calculator displayed many decimals","The result matches a preferred conclusion"],"Reasonableness checks use units, magnitude, constraints, and independent estimation.",S(1)),
    I("Two models fit the same data. What should a learner compare next?","Assumptions, error, simplicity, and how well each model predicts or explains",["Font size","Which model was written first","Only the larger numerical result"],"Model comparison should focus on evidence, assumptions, error, explanatory value, and limits.",S(2)),
    I("Why should a modelling conclusion state limitations?","To identify where assumptions or evidence restrict how far the conclusion can be applied",["To make the work sound uncertain for no reason","To avoid showing calculations","To replace evidence with opinion"],"Limitations communicate the boundaries of a model's evidence and assumptions.",S(3)),
    I("Which capstone artifact best demonstrates Algebra I readiness?","A clear model, correct calculations, multiple representations, checks, and explanation of assumptions",["A final answer with no work","A decorative graph with no labels","A copied solution with no explanation"],"Readiness is demonstrated by accurate reasoning, representations, checking, and communication.",S(4))
  ];
}

for(const w of APP.weeks){
  w.quizKey="forensic_week_"+String(w.week).padStart(2,"0");
  APP.quizBank[w.quizKey]=bank(w,0);
}
const midKeys=APP.weeks.slice(0,18).map(w=>{const key="forensic_mid_"+String(w.week).padStart(2,"0");APP.quizBank[key]=bank(w,80);return key;});
const finalKeys=APP.weeks.map(w=>{const key="forensic_final_"+String(w.week).padStart(2,"0");APP.quizBank[key]=bank(w,160);return key;});
APP.midtermDomains=midKeys;
APP.finalDomains=finalKeys;

makeExam=function(domains){
  return domains.map((key,idx)=>{
    const raw=APP.quizBank[key]?.[(idx*2+domains.length)%5];
    const p=prepareQuestion(raw);
    return {skill:key,title:p.prompt,choices:p.choices,answer:p.answer};
  });
};

window.__KHAEMENES_PREALGEBRA_FORENSIC_REPAIR__={version:"2026-08-16",weeklyBanks:APP.weeks.length,midtermItems:midKeys.length,finalItems:finalKeys.length};
if(typeof render==="function")render();
})();