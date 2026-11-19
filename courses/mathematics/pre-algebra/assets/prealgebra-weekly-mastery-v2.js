(function weeklyAsset(){
"use strict";
if(window.KhaemenesPreAlgebraWeeklyMasteryV2?.bank)return;
const VERSION="2.0.0";
const DIMS=["procedural-fluency","multi-step-application","representation-interpretation","error-analysis","transfer-reasoning"];
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){const t=b;b=a%b;a=t}return a};
function q(w,i,dim,prompt,answer,distractors,explanation){
 const options=[String(answer),...distractors.map(String)];
 if(new Set(options).size!==options.length)throw new Error("duplicate-option:"+w+":"+i);
 return {id:`pa-w${String(w).padStart(2,"0")}-q${String(i).padStart(2,"0")}`,week:w,dimension:dim,prompt,options,answer:0,answer_text:String(answer),explanation};
}
function number(w){const g=2+w%5,m=5+w%4,a=4*g,b=6*g;return[
 q(w,1,DIMS[0],`Find GCF(${a}, ${b}).`,2*g,[g,4*g,12*g],"Use common prime factors or factor lists."),
 q(w,2,DIMS[0],`Find LCM(${3*g}, ${4*g}).`,12*g,[6*g,7*g,24*g],"Three and four are relatively prime after the common factor g."),
 q(w,3,DIMS[1],`A center has ${a} red and ${b} blue markers. What is the greatest number of identical kits with none left?`,2*g,[g,4*g,6*g],"The greatest number of equal kits is the GCF."),
 q(w,4,DIMS[1],`Evaluate ${18+w}−3(4)+2.`,8+w,[4+w,14+w,56+w],"Multiply before addition and subtraction."),
 q(w,5,DIMS[2],`Which is the most specific set containing −${m}?`,"integers",["whole numbers","natural numbers","irrational numbers"],"Negative whole-number values are integers."),
 q(w,6,DIMS[2],`Between which consecutive integers does √${m*m+3} lie?`,`${m} and ${m+1}`,[`${m-1} and ${m}`,`${m+1} and ${m+2}`,`${m+2} and ${m+3}`],"Compare with consecutive perfect squares."),
 q(w,7,DIMS[3],"A learner evaluates 24÷6×2 as 24÷12=2. What is the error?","Multiplication and division at the same priority are done left to right",["Multiplication must always be first","Division is never allowed first","The result must be 24"],"Multiplication and division share priority."),
 q(w,8,DIMS[3],`A learner says ${m*m+1} is a perfect square because it is close to ${m*m}. What must be checked?`,"Whether an integer squared equals it exactly",["Whether it is even","Whether it is above 10","Whether its digits add to 9"],"Perfect-square status is exact."),
 q(w,9,DIMS[4],`Estimate ${50+10*(w%4)}×${19+w%3} using compatible numbers.`,(50+10*(w%4))*20,[(50+10*(w%4))+(19+w%3),(50+10*(w%4))*2,50+10*(w%4)],"Use nearby compatible factors to judge magnitude."),
 q(w,10,DIMS[4],"Why is every integer rational?","Any integer n can be written as n/1",["Every integer is positive","Rational numbers cannot be negative","Integers have no fractions"],"A rational number is a ratio of integers with nonzero denominator.")
]}
function integers(w){const a=5+w%7,b=9+w%5;return[
 q(w,1,DIMS[0],`Evaluate −${a}+${b}.`,b-a,[a+b,a-b,-a-b],"Combine signed quantities."),
 q(w,2,DIMS[0],`Evaluate (−${a})(−${b}).`,a*b,[-a*b,a+b,-a-b],"Two negative factors give a positive product."),
 q(w,3,DIMS[1],`Temperature starts at −${a}°C, rises ${b}°C, then falls 3°C. Final temperature?`,b-a-3,[b-a+3,a-b-3,a+b-3],"Model each change as a signed number."),
 q(w,4,DIMS[1],`What is the distance between −${a} and ${b}?`,a+b,[b-a,a-b,a*b],"Distance is absolute difference."),
 q(w,5,DIMS[2],`Which expression means move ${b} units left from −${a}?`,`−${a}−${b}`,[`−${a}+${b}`,`${a}−${b}`,`${a}+${b}`],"Left on a number line corresponds to subtraction."),
 q(w,6,DIMS[2],`Order −${a+2}, −${a}, ${a} least to greatest.`,`−${a+2}, −${a}, ${a}`,[`−${a}, −${a+2}, ${a}`,`${a}, −${a}, −${a+2}`,`−${a}, ${a}, −${a+2}`],"Farther left is smaller."),
 q(w,7,DIMS[3],`A learner says −${a}−${b}=${b-a}. What is the error?`,"Subtracting a positive moves farther negative",["Two negatives always make positive","Subtraction means multiplication","Absolute value comes first"],"The correct value is the negative of the sum."),
 q(w,8,DIMS[3],"A learner says |−12|=−12. What misconception is shown?","Absolute value is distance from zero and is nonnegative",["Absolute value means opposite sign","Only positives have absolute value","Absolute value is always zero"],"Distance cannot be negative."),
 q(w,9,DIMS[4],`An account changes by −$${a}, +$${b}, and −$4. Net signed change?`,b-a-4,[b-a+4,a+b+4,-a-b-4],"Add the signed changes."),
 q(w,10,DIMS[4],"Why can elevation and account balance use the same integer rules?","Both are quantities measured relative to a chosen zero with direction",["They use the same physical unit","All negatives mean loss","Context never matters"],"Integers model relative position and change.")
]}
function rational(w){const a=2+w%3,b=a+2;return[
 q(w,1,DIMS[0],`Evaluate ${a}/${b} + 1/${b}.`,`${a+1}/${b}`,[`${a}/${b+1}`,`${a+1}/${2*b}`,`${a*b+1}/${b}`],"Same denominators allow numerator addition."),
 q(w,2,DIMS[0],`Evaluate (${a}/${b})(${b}/${a+1}).`,`${a}/${a+1}`,[`${b}/${a+1}`,`${a*b}/${a+1}`,`${a+1}/${a}`],"Cancel the common factor b."),
 q(w,3,DIMS[1],`A recipe uses 3/4 cup per batch. Amount for ${a+1} batches?`,`${3*(a+1)}/4 cups`,[`${a+4}/4 cups`,`${a+1}/3 cups`,`${4*(a+1)}/3 cups`],"Multiply the unit amount by batch count."),
 q(w,4,DIMS[1],`A ${a+2}-meter board is cut into 1/2-meter pieces. How many full pieces?`,2*(a+2),[a+2,2*a+1,Math.floor((a+2)/2)],"Dividing by one-half doubles."),
 q(w,5,DIMS[2],"Which representation is exactly 0.25?","1/4",["1/5","25/10","2.5"],"0.25=25/100=1/4."),
 q(w,6,DIMS[2],"Which lies between 1/2 and 3/4?","5/8",["1/4","7/8","4/3"],"5/8=0.625."),
 q(w,7,DIMS[3],"A learner writes 2/3+1/4=3/7. What is the error?","Unlike fractions require a common denominator before adding",["Only denominators are added","Fractions cannot be added","The result must exceed 2"],"Numerators and denominators are not added independently."),
 q(w,8,DIMS[3],"A learner divides by 2/3 by multiplying by 2/3. Repair?","Multiply by the reciprocal 3/2",["Add 3/2","Subtract 2/3","Square 2/3"],"Division by a fraction uses its reciprocal."),
 q(w,9,DIMS[4],`Which is larger: ${a}/${b} or ${a+1}/${b+1}?`,`${a+1}/${b+1}`,[`${a}/${b}`,"They are equal","Cannot compare"],"Cross-products show the second is larger when b>a."),
 q(w,10,DIMS[4],"Why keep an exact fraction instead of a rounded decimal in some calculations?","It avoids introducing rounding error",["Decimals are not numbers","Fractions are always smaller","Decimals cannot be multiplied"],"Exact forms preserve exact value.")
]}
function ratio(w){const r=2+w%5,n=3+w%4;return[
 q(w,1,DIMS[0],`If ${n} items cost $${n*r}, unit price?`,`$${r}`,[`$${n}`,`$${n*r}`,`$${n+r}`],"Divide total by count."),
 q(w,2,DIMS[0],`Solve x/${n}=${r}/${2*r}.`,n/2,[n,2*n,r+n],"The right ratio is one-half."),
 q(w,3,DIMS[1],`Map scale 1 cm=${r} km. What does ${n} cm represent?`,`${r*n} km`,[`${r+n} km`,`${n/r} km`,`${r} km`],"Multiply by the scale rate."),
 q(w,4,DIMS[1],`A recipe uses ${r} cups for ${n} servings. Water for ${2*n} servings?`,`${2*r} cups`,[`${r} cups`,`${r+n} cups`,`${2*r*n} cups`],"Doubling servings doubles a proportional quantity."),
 q(w,5,DIMS[2],`Which equation has constant of proportionality ${r}?`,`y=${r}x`,[`y=x+${r}`,`y=${r}/x`,`x=${r}y+${r}`],"Direct proportion has form y=kx."),
 q(w,6,DIMS[2],`In y=${r}x, what is ${r}?`,"constant of proportionality",["y-intercept","x-coordinate","fixed fee"],"It is the constant ratio y/x."),
 q(w,7,DIMS[3],`A learner calls y=${r}x+5 proportional. What is wrong?`,"The nonzero intercept prevents a constant y/x ratio",["All lines are proportional","The slope must be zero","Proportions cannot use variables"],"Proportional graphs pass through the origin."),
 q(w,8,DIMS[3],"A learner compares package totals although sizes differ. Better comparison?","unit rates",["only the bigger package","number of digits","sum of prices"],"Unit rates normalize quantity."),
 q(w,9,DIMS[4],`Plan A: $${r*n} for ${n} units. Plan B: $${(r+1)*(n+1)} for ${n+1}. Cheaper per unit?`,"Plan A",["Plan B","Equal","Cannot determine"],`The rates are $${r} and $${r+1}.`),
 q(w,10,DIMS[4],"Why must a scale drawing use one linear scale factor in every direction?","Different directional factors distort shape and destroy similarity",["Only area matters","Scale never affects shape","Different factors create congruence"],"Uniform scaling preserves similarity.")
]}
function percent(w){const p=10+5*(w%5),base=100+20*(w%4);return[
 q(w,1,DIMS[0],`What is ${p}% of ${base}?`,base*p/100,[p,base-p,base+p],"Convert percent to decimal and multiply."),
 q(w,2,DIMS[0],`${base*p/100} is ${p}% of what number?`,base,[p,base*p/100,base+p],"Divide part by decimal percent."),
 q(w,3,DIMS[1],`A $${base} item is discounted ${p}%. Sale price?`,`$${(base*(1-p/100)).toFixed(2)}`,[`$${(base*p/100).toFixed(2)}`,`$${(base*(1+p/100)).toFixed(2)}`,`$${base-p}`],"Use original price times 1−rate."),
 q(w,4,DIMS[1],`A value rises from ${base} to ${base+20}. Percent increase?`,`${(20/base*100).toFixed(1)}%`,["20%",`${(20/(base+20)*100).toFixed(1)}%`,`${base/20}%`],"Change divided by original."),
 q(w,5,DIMS[2],"Which multiplier represents a 12% increase?","1.12",["0.12","0.88","12"],"Increase multiplier is 1+r."),
 q(w,6,DIMS[2],"How do percentage points differ from percent change?","Percentage points subtract percentages directly; percent change uses the original percentage as a base",["They are identical","Percent change is only money","Percentage points require squaring"],"They use different reference structures."),
 q(w,7,DIMS[3],"A learner subtracts $20 for every 20% discount. Error?","A percent discount depends on the original price",["Discounts are always $20","Percent means divide by 20","Sale prices must rise"],"Percent is proportional to the base."),
 q(w,8,DIMS[3],"A learner computes percent increase using the new value as denominator. Correct denominator?","original value",["new value","average value","100"],"Percent change uses the starting value."),
 q(w,9,DIMS[4],`Simple interest on $${base*5} at 4% for 2 years?`,`$${(base*5*.04*2).toFixed(2)}`,[`$${(base*5*.04).toFixed(2)}`,`$${base*5+2}`,"$8.00"],"Use I=Prt."),
 q(w,10,DIMS[4],"Why does −20% followed by +20% not return to the start?","The second percentage uses a different base",["Percent operations cannot repeat","20% always means 20 units","The signs cancel"],"Successive percent changes compound on changing bases.")
]}
function exponents(w){const b=2+w%4,e=2+w%3;return[
 q(w,1,DIMS[0],`Evaluate ${b}^${e}.`,b**e,[b*e,b+e,(b+1)**e],"Repeated multiplication."),
 q(w,2,DIMS[0],`Simplify ${b}^3·${b}^2.`,`${b}^5`,[`${b}^6`,`${2*b}^5`,`${b}^1`],"Add exponents for same base products."),
 q(w,3,DIMS[1],`A square has area ${(b+3)**2} cm². Side length?`,`${b+3} cm`,[`${2*(b+3)} cm`,`${(b+3)**2} cm`,`${b+2} cm`],"Take the positive square root."),
 q(w,4,DIMS[1],"(6×10^5)/(2×10^2) equals?","3×10^3",["3×10^7","12×10^3","4×10^3"],"Divide coefficients and subtract exponents."),
 q(w,5,DIMS[2],"Which is standard scientific notation?","4.7×10^6",["47×10^5","0.47×10^7","4700000×10^0"],"Coefficient magnitude is at least 1 and less than 10."),
 q(w,6,DIMS[2],`What is ${b}^0 for nonzero ${b}?`,"1",["0",String(b),String(1/b)],"Any nonzero base to exponent zero equals 1."),
 q(w,7,DIMS[3],`A learner simplifies (${b}²)^3 as ${b}^5. Error?`,"Power-of-a-power exponents multiply, giving exponent 6",["Exponents subtract","Base must double","Result is zero"],"Multiply the exponents."),
 q(w,8,DIMS[3],"A learner writes √50=25. What was confused?","Square root with division by 2",["50 is a perfect square","Roots double numbers","Only odd numbers have roots"],"√50 is about 7.07."),
 q(w,9,DIMS[4],`Which is larger for ${b}>1: ${b}^4 or ${b}^3?`,`${b}^4`,[`${b}^3`,"Equal","Cannot compare"],"An extra factor greater than 1 increases the value."),
 q(w,10,DIMS[4],"Why is scientific notation useful in models?","It makes extreme magnitudes easier to compare and compute without changing scale",["It makes measurements exact","It removes units","It guarantees certainty"],"Scientific notation is a representation of magnitude.")
]}
function algebra(w){const a=2+w%4,b=3+w%5;return[
 q(w,1,DIMS[0],`Evaluate ${a}x+${b} for x=${a+1}.`,a*(a+1)+b,[a+b,a*(a+1),2*a+b],"Substitute then evaluate."),
 q(w,2,DIMS[0],`Simplify ${a}x+${b}x.`,`${a+b}x`,[`${a*b}x²`,`${a+b}x²`,`${a*b}x`],"Add coefficients of like terms."),
 q(w,3,DIMS[1],`A service charges $${b} plus $${a}/hour. Expression for h hours?`,`${b}+${a}h`,[`${a*b}h`,`${b}h+${a}`,`${a+b}+h`],"Fixed fee plus rate times hours."),
 q(w,4,DIMS[1],`Expand ${a}(x+${b}).`,`${a}x+${a*b}`,[`${a}x+${b}`,`x+${a*b}`,`${a+b}x`],"Distribute to both terms."),
 q(w,5,DIMS[2],`In ${a}x+${b}, what is ${a}?`,"coefficient of x",["constant","variable","exponent"],"A coefficient multiplies a variable."),
 q(w,6,DIMS[2],`Which form exposes factors of x²+${a+b}x+${a*b}?`,`(x+${a})(x+${b})`,[`x(x+${a+b})+${a*b}`,`x²+${a+b}x+${a*b}`,`(x+${a+b})²`],"Factored form shows multiplicative structure."),
 q(w,7,DIMS[3],`A learner combines ${a}x+${b} as ${a+b}x. Error?`,"Unlike terms cannot be combined",["Coefficients should multiply","x should be squared","Constants are zero"],"Variable and constant terms are unlike."),
 q(w,8,DIMS[3],`A learner expands ${a}(x+${b}) as ${a}x+${b}. Error?`,"The factor must multiply every term inside",["Variable should disappear","Only constants distribute","Parentheses mean subtraction"],"Distributive property applies to every term."),
 q(w,9,DIMS[4],`Are 2(x+${b}) and 2x+${2*b} equivalent for every x?`,"yes",["no","only x=0","only positive x"],"Distributive property proves equality."),
 q(w,10,DIMS[4],"Why rewrite an expression if its value is unchanged?","Different equivalent forms reveal different structure and may simplify reasoning",["Rewriting changes solutions","It removes variables","Only expanded form is valid"],"Equivalent forms emphasize different features.")
]}
function equations(w){const a=2+w%4,b=3+w%6,x=4+w%5,c=a*x+b;return[
 q(w,1,DIMS[0],`Solve ${a}x+${b}=${c}.`,x,[x+1,x-1,c-b],"Undo the constant, then divide."),
 q(w,2,DIMS[0],`Solve x/${a}+${b}=${x+b}.`,a*x,[x,a*(x+b),a*x+b],"Subtract b, then multiply by a."),
 q(w,3,DIMS[1],`Taxi fee $${b} plus $${a}/mile totals $${c}. Miles?`,x,[x+1,a*x,Math.round(c/a)],"Model b+am=c."),
 q(w,4,DIMS[1],"If A=lw, solve for w.","A/l",["A−l","Al","l/A"],"Divide by l when l≠0."),
 q(w,5,DIMS[2],`Which equation means '${b} more than ${a} times x is ${c}'?`,`${a}x+${b}=${c}`,[`${b}x+${a}=${c}`,`${a}(x+${b})=${c}`,`x+${a+b}=${c}`],"Translate multiplication and addition."),
 q(w,6,DIMS[2],"What does an equation balance model show?","Equivalent operations on both sides preserve equality",["Only addition is allowed","One side can change alone","Variables are literal weights"],"Equality is maintained by equivalent operations."),
 q(w,7,DIMS[3],`A learner divides only ${a}x by ${a} in ${a}x+${b}=${c}. Error?`,"An operation must apply consistently to the entire side or after isolating the term",["Division is never allowed","Variable must disappear","No solution exists"],"Equivalent operations preserve full expressions."),
 q(w,8,DIMS[3],"A solution is not checked in the original equation. What risk remains?","An algebra or transcription error may go unnoticed",["Checking changes the solution","Only inequalities need checks","Solutions cannot be verified"],"Substitution verifies equality."),
 q(w,9,DIMS[4],`For ${a}x+${b}=c, if c increases by ${a}, how does x change?`,"x increases by 1",["x decreases by 1","x doubles","x is unchanged"],"x=(c−b)/a."),
 q(w,10,DIMS[4],"Why isolate different variables in a formula?","The same relationship can answer for a different unknown",["It changes the law","It guarantees valid inputs","It removes units"],"Literal rearrangement changes viewpoint, not relationship.")
]}
function inequalities(w){const a=2+w%4,b=3+w%5,c=10+w%6;return[
 q(w,1,DIMS[0],`Solve x+${b}<${c+b}.`,`x<${c}`,[`x>${c}`,`x<${c+b}`,`x>${c+b}`],"Subtract b."),
 q(w,2,DIMS[0],`Solve −${a}x≤−${a*c}.`,`x≥${c}`,[`x≤${c}`,`x>${c}`,`x<${c}`],"Divide by a negative and reverse the sign."),
 q(w,3,DIMS[1],`Budget $${a*c+b}, fixed fee $${b}, each item $${a}. Greatest items?`,c,[c+1,c-1,a*c],"Solve b+an≤budget."),
 q(w,4,DIMS[1],`Height must be at least ${c} cm. Which condition?`,`h≥${c}`,[`h>${c}`,`h≤${c}`,`h<${c}`],"At least includes equality."),
 q(w,5,DIMS[2],`Which number-line description matches x<${c}?`,"open dot at c, shade left",["closed dot at c, shade left","open dot at c, shade right","closed dot at c, shade right"],"Strict less-than excludes endpoint and goes left."),
 q(w,6,DIMS[2],`What does ${b}≤x≤${c} mean?`,`x is between ${b} and ${c}, inclusive`,[`x<${b} or x>${c}`,`x=${b} only`,`x=${c} only`],"Both boundaries included."),
 q(w,7,DIMS[3],"A learner divides an inequality by −3 but keeps the symbol. Error?","The inequality direction must reverse",["Variable must turn positive","Division is forbidden","Endpoint becomes zero"],"Negative scaling reverses order."),
 q(w,8,DIMS[3],"A learner reports 7.8 people as the maximum feasible count. Repair?","Use the greatest feasible whole number, 7",["Round automatically to 8","Keep 7.8 people","Multiply by 10"],"Discrete contexts require integer interpretation."),
 q(w,9,DIMS[4],`If x≤${c}, is x=${c+1} a solution?`,"no",["yes","only if positive","cannot check"],"Substitute into the condition."),
 q(w,10,DIMS[4],"Why can inequalities have infinitely many solutions?","They describe ranges satisfying a condition rather than one exact value",["They cannot be solved","Variables are infinite","Only graphs have solutions"],"Constraints often define intervals or rays.")
]}
function functions(w){const m=2+w%4,b=1+w%5,x=3+w%4;return[
 q(w,1,DIMS[0],`For y=${m}x+${b}, find y at x=${x}.`,m*x+b,[m+b,x+b,m*x-b],"Substitute."),
 q(w,2,DIMS[0],`Slope between (1,${m+b}) and (3,${3*m+b})?`,m,[m+1,m-1,2*m],"Change in y divided by change in x."),
 q(w,3,DIMS[1],`Service starts at ${b} and rises ${m}/use. Cost after ${x} uses?`,`${m*x+b}`,[`${b}`,`${x+b}`,`${m*x}`],"Use y=mx+b."),
 q(w,4,DIMS[1],`A table rises ${m} in y for each +1 in x. Rate of change?`,m,[1,b,m+1],"Constant first difference is slope."),
 q(w,5,DIMS[2],`In y=${m}x+${b}, y-intercept means?`,`output ${b} when x=0`,[`rate ${m}`,`x-value ${b}`,"maximum output"],"Intercept is starting output."),
 q(w,6,DIMS[2],"What best shows whether rate of change is constant?","equal-step table or a straight-line graph",["pie chart","single number","photo"],"Linear structure shows constant differences."),
 q(w,7,DIMS[3],"A learner computes slope as change in x/change in y. Error?","Slope is change in y divided by change in x",["Slope is x+y","Slope cannot be negative","Only intercept matters"],"Slope is rise/run."),
 q(w,8,DIMS[3],"A learner calls every increasing table linear. What else must hold?","Equal x-changes must produce constant y-changes",["All y-values positive","x begins at zero","four rows exactly"],"Increasing alone is insufficient."),
 q(w,9,DIMS[4],`Compare y=${m}x+${b} and y=${m+1}x+${b}. Which grows faster?`,`y=${m+1}x+${b}`,[`y=${m}x+${b}`,"same rate","cannot compare"],"Larger positive slope grows faster."),
 q(w,10,DIMS[4],"Why can linear extrapolation be risky?","The relationship may change outside the observed domain",["Lines stop beyond data","Slope becomes undefined","All extrapolation is negative"],"Model assumptions may fail outside evidence.")
]}
function geometry(w){const l=4+w%5,h=3+w%4;return[
 q(w,1,DIMS[0],`Area of rectangle ${l} m by ${h} m?`,`${l*h} m²`,[`${2*(l+h)} m`,`${l+h} m²`,`${l*h} m³`],"Area=length×width; perimeter uses linear units, area uses square units, and volume uses cubic units."),
 q(w,2,DIMS[0],`Right triangle legs ${3*h} and ${4*h}. Hypotenuse?`,5*h,[7*h,12*h,Math.sqrt(25*h)],"Scaled 3-4-5 triangle."),
 q(w,3,DIMS[1],`Room ${l} m by ${h} m drawn at 1 cm=1 m. Drawing dimensions?`,`${l} cm by ${h} cm`,[`${l*h} cm by 1 cm`,`${10*l} cm by ${10*h} cm`,`${l+h} cm by 1 cm`],"Apply scale consistently."),
 q(w,4,DIMS[1],`Rectangular prism ${l} by ${h} by 2 units. Volume?`,`${2*l*h} cubic units`,[`${l*h} square units`,`${2*(l+h)} cubic units`,`${l+h+2} cubic units`],"Volume=lwh."),
 q(w,5,DIMS[2],"Appropriate unit for floor area?","square meters",["meters","cubic meters","degrees"],"Area uses squared length."),
 q(w,6,DIMS[2],"Best representation for exact spatial relationships?","labeled scale drawing with units",["unlabeled sketch","photo only","list without measurements"],"Scale and labels make relationships auditable."),
 q(w,7,DIMS[3],"A learner doubles both rectangle dimensions and says area doubles. Error?","Area quadruples because it scales by the square of the length factor",["Area unchanged","Area halves","Only perimeter changes"],"Two dimensions each gain factor 2."),
 q(w,8,DIMS[3],"A learner reports 36 m for area. What is wrong?","Area requires square units such as m²",["36 cannot be area","meters are time","number must be squared"],"Dimensional units matter."),
 q(w,9,DIMS[4],"If all lengths scale by 3, area scales by?","9",["3","6","1"],"Area factor is 3²."),
 q(w,10,DIMS[4],"Why report measurement precision or tolerance?","Measured evidence has limited precision and should not imply false certainty",["Measurements are always exact","Tolerance changes definitions","Units replace uncertainty"],"Responsible measurement distinguishes exact theory from measured data.")
]}
function data(w){const a=4+w%5;return[
 q(w,1,DIMS[0],`Mean of ${a}, ${a+2}, ${a+4}?`,a+2,[a,a+3,a+6],"Middle value is mean of symmetric values."),
 q(w,2,DIMS[0],`Range of ${a}, ${a+3}, ${a+8}?`,8,[a+8,3,a+2],"Max−min."),
 q(w,3,DIMS[1],"Fair die: P(even)?","1/2",["1/3","2/3","1/6"],"Three of six outcomes."),
 q(w,4,DIMS[1],`Bag has ${a} blue and ${a} red counters. P(blue)?`,"1/2",[`${a}/2`,`1/${2*a}`,"1"],"Half are blue."),
 q(w,5,DIMS[2],"Best display for shape and spread of one numerical distribution?","dot plot or histogram",["pie chart only","single mean only","unlabeled list"],"These show distribution shape."),
 q(w,6,DIMS[2],"Same mean but very different ranges means?","Equal center does not imply equal spread",["Groups are identical","Range determines mean","Means invalid"],"Center and spread differ."),
 q(w,7,DIMS[3],"Only volunteers from one club represent whole school. Concern?","selection bias",["too many variables","negative probability","causation proven"],"Volunteer group may not represent target."),
 q(w,8,DIMS[3],"Truncated y-axis exaggerates difference. Inspect?","axis scale and baseline",["title color","only sample size","bar shape"],"Scale can distort perception."),
 q(w,9,DIMS[4],"Dataset A range 4, Dataset B range 20, similar means. More variable by range?","Dataset B",["Dataset A","same","cannot compare"],"Larger range means more spread by that measure."),
 q(w,10,DIMS[4],"Why doesn't a huge sample automatically remove bias?","Systematic selection flaws can persist as sample size grows",["Large samples prove causation","Bias equals random error","Sample size changes population"],"Size reduces random variability, not systematic bias.")
]}
function modeling(w){const n=40+5*(w%5),r=3+w%4,f=100+20*(w%3);return[
 q(w,1,DIMS[0],`For C=${f}+${r}n, find C at n=${n}.`,f+r*n,[f+n,r*n,f*r+n],"Substitute."),
 q(w,2,DIMS[0],`For C=${f}+${r}n, fixed cost?`,f,[r,n,f+r],"Constant term."),
 q(w,3,DIMS[1],`Budget $${f+r*(n+10)} under C=${f}+${r}n. Largest whole n?`,n+10,[n,n+11,Math.floor((f+r*(n+10))/r)],"Solve the constraint."),
 q(w,4,DIMS[1],`If rate ${r} changes to ${r+1}, how much does C change at n=${n}?`,n,[r,r+1,n+1],"One extra dollar/unit times n units."),
 q(w,5,DIMS[2],"Most reproducible report?","defines variables, units, data, equation, assumptions, and validation",["final number only","unlabeled graph","hidden assumptions"],"Reproduction requires method details."),
 q(w,6,DIMS[2],"What does sensitivity analysis show?","how outputs change when inputs or assumptions change",["only original answer","graph color","proof uncertainty is zero"],"It probes dependence on uncertain inputs."),
 q(w,7,DIMS[3],"A model adds dollars and people. First problem?","incompatible units",["numbers too small","addition impossible","people must be percentages"],"Added terms need compatible units."),
 q(w,8,DIMS[3],"A model fits current data, so learner claims it is valid forever. Missing?","domain and limitation analysis",["larger font","another variable","second equal sign"],"Good fit does not justify unlimited extrapolation."),
 q(w,9,DIMS[4],"Why separate recommendation from numerical result?","Decisions also depend on assumptions, uncertainty, constraints, and values",["Recommendations forbidden","Results are opinions","Equations cannot inform decisions"],"Evidence supports but does not dictate all decisions."),
 q(w,10,DIMS[4],"Critique reveals a valid weakness. Strongest response?","revise the model or qualify the conclusion and document the change",["hide critique","keep conclusion","delete evidence"],"Transparent revision strengthens modelling.")
]}
const GEN={number,integers,rational,ratio,percent,exponents,algebra,equations,inequalities,functions,geometry,data,modeling};
function install(){
 if(typeof APP==="undefined"||!Array.isArray(APP.weeks)||APP.weeks.length!==36)return false;
 const bank={},rowsByWeek=new Map(APP.weeks.map(row=>[Number(row.week),row]));
 for(const row of APP.weeks){
  const w=Number(row.week),fn=GEN[row.domain];
  if(!fn)throw new Error("missing-generator:"+row.domain);
  let questions=fn(w);
  let retrievalFrom=null;
  if(w>1){
   const lag=1+(w%3),priorWeek=Math.max(1,w-lag),priorRow=rowsByWeek.get(priorWeek),priorFn=GEN[priorRow?.domain];
   if(!priorFn)throw new Error("missing-retrieval-generator:"+priorWeek);
   const priorQuestions=priorFn(priorWeek);
   retrievalFrom=priorWeek;
   for(const idx of [0,9]){
    const source=priorQuestions[idx],target=questions[idx];
    questions[idx]={...source,id:target.id,week:w,retrieval_from_week:priorWeek,retrieval_source_domain:priorRow.domain};
   }
  }
  const counts=Object.fromEntries(DIMS.map(d=>[d,questions.filter(x=>x.dimension===d).length]));
  if(questions.length!==10||!DIMS.every(d=>counts[d]===2))throw new Error("blueprint:"+w);
  questions.forEach(x=>{if(x.options.length!==4||x.answer!==0)throw new Error("question:"+x.id)});
  bank[String(w)]={week:w,unit:Number(row.unitNumber),title:row.title,domain:row.domain,version:VERSION,dimensions:counts,current_count:w===1?10:8,delayed_count:w===1?0:2,retrieval_from_week:retrievalFrom,questions};
  row.quiz=questions.map(x=>[x.prompt,x.options,x.answer,x.id,x.dimension,x.retrieval_from_week??null]);
 }
 const all=Object.values(bank).flatMap(x=>x.questions);
 if(all.length!==360||new Set(all.map(x=>x.id)).size!==360)throw new Error("count-drift");
 window.KhaemenesPreAlgebraWeeklyMasteryV2={version:VERSION,dimensions:DIMS,bank,install,ready:true};
 window.dispatchEvent(new CustomEvent("khaemenes-prealgebra-weekly-mastery-v2-ready",{detail:{version:VERSION,weeks:36,questions:360,weekly_blueprint:"8-current+2-delayed",dimensions:DIMS.slice()}}));
 try{if(typeof render==="function")render()}catch{}
 return true;
}
window.KhaemenesPreAlgebraWeeklyMasteryV2={version:VERSION,dimensions:DIMS,bank:null,install,ready:false};
try{install()}catch(error){window.KhaemenesPreAlgebraWeeklyMasteryV2.ready=false;console.error("Pre-Algebra weekly mastery v2 failed closed:",error)}
})();
