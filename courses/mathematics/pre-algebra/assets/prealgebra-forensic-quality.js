(() => {
  "use strict";
  const frame=document.getElementById("courseFrame");
  if(!frame)return;
  frame.addEventListener("load",()=>{
    const doc=frame.contentDocument;if(!doc)return;
    window.setTimeout(()=>{
      const script=doc.createElement("script");
      script.textContent=`(()=>{
"use strict";
APP.passingTarget=80;
const R=(p,c,w,e)=>[p,c,0,e];
function rotate(raw,shift){
  const [prompt,choices,answer,explain]=raw,old=[...choices];shift=((shift%4)+4)%4;const next=old.map((_,i)=>old[(i-shift+4)%4]);return[prompt,next,(answer+shift)%4,explain];
}
const G={
 number:w=>[
R("Which value is greatest?",[String(w+8),String(w+3),String(w-2),String(-w)],[],"Compare values on the number line."),
R("Round "+(438+w*7)+" to the nearest ten.",[String(Math.round((438+w*7)/10)*10),String(Math.floor((438+w*7)/10)*10),String(Math.ceil((438+w*7)/100)*100),String(438+w*7)],[],"Use the ones digit to round to the nearest ten."),
R("Which expression equals "+(6+w)+"×4?",[String((6+w)*4),String(6+w+4),String((6+w)*3),String((6+w)*5)],[],"Multiplication represents equal groups."),
R("A box holds "+(5+w%4)+" rows of 8 tiles. How many tiles?",[String((5+w%4)*8),String((5+w%4)+8),String((5+w%4)*4),String((5+w%4)*16)],[],"Multiply rows by tiles per row."),
R("Which is a factor of "+((w%5+4)*6)+"?",["6","5","7","11"],[],"A factor divides the number with no remainder.")],
 integers:w=>[
R("What is |"+(-(8+w))+"|?",[String(8+w),String(-(8+w)),"0",String(9+w)],[],"Absolute value is distance from zero."),
R("Compute "+(-(4+w%6))+" + "+(9+w%5)+".",[String(5-w%6+w%5),String(-13-w%6-w%5),String(13+w%6+w%5),String(4+w%6)],[],"Combine signed values on a number line."),
R("The temperature changes from "+(3+w%4)+"°C to "+(-(4+w%3))+"°C. What is the change?",[String(-(7+w%4+w%3))+"°C",String(7+w%4+w%3)+"°C",String(-(1+w%3))+"°C",String(3+w%4)+"°C"],[],"Change = final − initial."),
R("Compute (−"+(3+w%5)+")(−"+(2+w%4)+").",[String((3+w%5)*(2+w%4)),String(-((3+w%5)*(2+w%4))),String(5+w%5+w%4),"0"],[],"The product of two negative numbers is positive."),
R("Which is least?",[String(-(12+w)),String(-(5+w%4)),String(w%3),String(4+w%2)],[],"Farther left on the number line means smaller.")],
 rational:w=>[
R("Which fraction is equivalent to 3/4?",["6/8","4/5","9/16","3/8"],[],"Multiply numerator and denominator by the same nonzero value."),
R("Compute 1/"+(4+w%3)+" + 2/"+(4+w%3)+".",["3/"+(4+w%3),"3/"+(8+2*(w%3)),"1/"+(4+w%3),"2/"+(4+w%3)],[],"With equal denominators, add numerators."),
R("Which decimal equals 3/5?",["0.6","0.35","0.3","0.8"],[],"3 ÷ 5 = 0.6."),
R("Compute 2/3 × 3/"+(5+w%3)+".",["2/"+(5+w%3),"5/"+(8+w%3),"6/"+(8+w%3),"1/3"],[],"Multiply numerators and denominators, then simplify."),
R("Which value lies between 0.4 and 0.5?",["0.45","0.35","0.55","0.6"],[],"0.45 is greater than 0.4 and less than 0.5.")],
 ratio:w=>[
R("Which ratio is equivalent to 3:5?",["9:15","6:8","12:25","15:20"],[],"Multiply both terms by the same factor."),
R((18+w*2)+" miles in 3 hours is what unit rate?",[String((18+w*2)/3)+" mi/h",String(18+w*2)+" mi/h","3 mi/h",String((18+w*2)*3)+" mi/h"],[],"Unit rate = total quantity ÷ number of units."),
R("If 4 notebooks cost $"+(12+w%3*4)+", what is the cost per notebook?",["$"+((12+w%3*4)/4).toFixed(2),"$4.00","$"+(12+w%3*4).toFixed(2),"$"+((12+w%3*4)/2).toFixed(2)],[],"Divide total cost by 4."),
R("Solve 2/5 = x/"+(20+w%3*5)+".",[String((20+w%3*5)*2/5),String((20+w%3*5)/2),String((20+w%3*5)*5/2),"2"],[],"Use equivalent ratios or cross products."),
R("A scale uses 1 cm = "+(4+w%4)+" km. What does 6 cm represent?",[String(6*(4+w%4))+" km",String(10+w%4)+" km",String((4+w%4)/6)+" km",String(6+4+w%4)+" km"],[],"Multiply map length by the scale rate.")],
 percent:w=>[
R("What is 25% of "+(80+w*4)+"?",[String((80+w*4)*.25),String((80+w*4)*.75),String((80+w*4)+25),"25"],[],"25% = 0.25; multiply by the whole."),
R("A $"+(60+w*5)+" item is discounted 20%. What is the sale price?",["$"+((60+w*5)*.8).toFixed(2),"$"+((60+w*5)*.2).toFixed(2),"$"+(80+w*5).toFixed(2),"$"+(60+w*5).toFixed(2)],[],"Subtract 20% of the original price, or multiply by 0.80."),
R("45 is what percent of 60?",["75%","25%","60%","105%"],[],"45 ÷ 60 × 100 = 75%."),
R("A value rises from 40 to 50. What is the percent increase?",["25%","10%","20%","80%"],[],"Increase 10 ÷ original 40 = 0.25."),
R("Which decimal equals 7%?",["0.07","0.7","7.0","0.007"],[],"Percent means per hundred; divide by 100.")],
 algebra:w=>[
R("Evaluate 3x+2 when x="+(2+w%5)+".",[String(3*(2+w%5)+2),String(5+w%5),String(6+w%5),String(3*(2+w%5))],[],"Substitute the given x-value."),
R("Which expression is equivalent to 4(x+3)?",["4x+12","4x+3","x+12","7x"],[],"Distribute 4 to both terms."),
R("Solve x+"+(5+w%4)+"="+(12+w%4)+".",["7",String(17+2*(w%4)),String(5+w%4),String(12+w%4)],[],"Subtract the same amount from both sides."),
R("Solve 3x="+(18+3*(w%4))+".",[String(6+w%4),String(18+3*(w%4)),String(15+3*(w%4)),"3"],[],"Divide both sides by 3."),
R("Which property justifies 2(a+b)=2a+2b?",["Distributive property","Commutative property","Identity property","Inverse property"],[],"Multiplication distributes over addition.")],
 coordinate:w=>[
R("Which point has x="+(w%4-2)+" and y="+(3-w%3)+"?",["("+(w%4-2)+", "+(3-w%3)+")","("+(3-w%3)+", "+(w%4-2)+")","("+(2-w%4)+", "+(3-w%3)+")","(0, 0)"],[],"Ordered pairs are written (x, y)."),
R("A line rises 6 and runs 3. Its slope is…",["2","1/2","9","3"],[],"Slope = rise/run = 6/3."),
R("If y=2x+1, what is y when x="+(2+w%4)+"?",[String(2*(2+w%4)+1),String(2+w%4+1),String(4+w%4),String(2*(2+w%4))],[],"Substitute x into the function rule."),
R("Which table could represent a constant rate of 3?",["x: 0,1,2; y: 1,4,7","x: 0,1,2; y: 1,3,9","x: 0,1,2; y: 3,3,3","x: 0,1,2; y: 0,1,4"],[],"The y-values increase by 3 for every increase of 1 in x."),
R("What is the y-intercept of y=4x−5?",["−5","4","5","−4"],[],"In y=mx+b, b is the y-intercept.")],
 geometry:w=>[
R("A rectangle is "+(6+w%4)+" by "+(4+w%3)+". Its area is…",[String((6+w%4)*(4+w%3)),String(2*(6+w%4)+2*(4+w%3)),String(10+w%7),String((6+w%4)+(4+w%3))],[],"Area = length × width."),
R("Two angles are complementary. One is "+(35+w%10)+"°. The other is…",[String(90-(35+w%10))+"°",String(180-(35+w%10))+"°",String(35+w%10)+"°","90°"],[],"Complementary angles sum to 90°."),
R("A right triangle has legs 3 and 4. Its hypotenuse is…",["5","7","12","25"],[],"3²+4²=5²."),
R("Which transformation preserves distance and angle measure?",["Rotation","Non-uniform stretch","Horizontal scaling by 2 only","Vertical scaling by 3 only"],[],"Rigid transformations preserve distances and angles."),
R("The circumference of a circle with radius 5 is…",["10π","25π","5π","20π"],[],"C=2πr=10π.")],
 data:w=>[
R("What is the mean of 4, 6, 8, and "+(10+w%4)+"?",[String((28+10+w%4-10)/4),"7","8",String(10+w%4)],[],"Add all values and divide by 4."),
R("What is the median of 2, 5, 7, 9, 12?",["7","5","9","35"],[],"The middle ordered value is 7."),
R("A bag has 3 red and 7 blue tiles. P(red)=…",["3/10","7/10","3/7","1/3"],[],"Probability = favorable outcomes ÷ total outcomes."),
R("Which graph is usually best for comparing categories?",["Bar graph","Scatter plot","Number line only","Circle with no labels"],[],"Bar graphs compare category values."),
R("A scatter plot trends upward from left to right. This suggests…",["A positive association","A negative association","No possible relationship","Causation is proven"],[],"An upward trend indicates positive association, not automatic causation.")]
};
function domainFor(w){const s=(w.quizKey||"").toLowerCase();if(G[s])return s;const t=(w.domain+" "+w.title).toLowerCase();if(t.includes("integer"))return"integers";if(t.includes("fraction")||t.includes("rational"))return"rational";if(t.includes("ratio")||t.includes("rate")||t.includes("proportion"))return"ratio";if(t.includes("percent"))return"percent";if(t.includes("coordinate")||t.includes("function")||t.includes("linear")||t.includes("slope"))return"coordinate";if(t.includes("geometr"))return"geometry";if(t.includes("data")||t.includes("stat")||t.includes("probab"))return"data";if(t.includes("equation")||t.includes("expression")||t.includes("algebra"))return"algebra";return"number";}
for(const w of APP.weeks){const d=domainFor(w),raw=G[d](w.week);w.quizKey="forensic_"+String(w.week).padStart(2,"0");APP.quizBank[w.quizKey]=raw.map((x,i)=>rotate(x,w.week+i));}
APP.midtermDomains=APP.weeks.slice(0,18).map(w=>w.quizKey);
APP.finalDomains=APP.weeks.map(w=>w.quizKey);
const oldMake=makeExam;
makeExam=function(domains){let arr=[];domains.forEach((d,idx)=>{const bank=APP.quizBank[d]||[];if(!bank.length)return;const raw=bank[(idx*3+domains.length)%bank.length],p=prepareQuestion(raw);arr.push({skill:d,title:p.prompt,choices:p.choices,answer:p.answer});});return arr;};
if(typeof render==="function")render();
})();`;
      doc.body.appendChild(script);
    },120);
  });
})();