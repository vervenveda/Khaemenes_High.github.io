/* Khaemenes Algebra I · Unit 03 Content Rebuild
   35 unique questions · 5 per lesson. Preserves q0066–q0100.
*/
(()=>{"use strict";
const rows=[
[1,"Which operation undoes adding 9 to a variable?",["add 9","subtract 9","multiply by 9","divide by 9"],1,"subtract 9","Subtraction by 9 is the inverse of addition by 9.","inverse_operations",1],
[1,"If x−7=12, which equation correctly verifies x=19?",["19−7=12","19+7=12","12−7=19","19÷7=12"],0,"19−7=12","Substitute the proposed solution into the original equation.","verification",1],
[1,"Why must the same operation be performed on both sides of an equation?",["to make both sides positive","to preserve equality","to remove every variable","to create integers"],1,"to preserve equality","Equivalent operations on both sides preserve the equality relationship.","equality",1],
[1,"Which value solves 4+x=−3?",["−7","−1","1","7"],0,"−7","Subtract 4 from both sides: x=−7.","inverse_operations",1],
[1,"A student claims x=5 solves 3x+1=15. What does substitution show?",["true because 3(5)+1=15","false because 3(5)+1=16","true because 5+1=6","false because 15−5=10"],1,"false because 3(5)+1=16","Verification evaluates the original equation at the claimed solution.","verification",2],
[2,"Solve 5x=−35.",["−7","−6","6","7"],0,"−7","Divide both sides by 5.","one_step_equations",1],
[2,"Solve 2x+7=19.",["5","6","12","13"],1,"6","Subtract 7, then divide by 2.","two_step_equations",1],
[2,"Solve x/4−3=2.",["−4","5","8","20"],3,"20","Add 3 to get x/4=5, then multiply by 4.","two_step_equations",2],
[2,"Which first step is most efficient for −3x+8=20?",["add 8","subtract 8","divide by −3","multiply by −3"],1,"subtract 8","Undo the added 8 before undoing multiplication by −3.","solution_strategy",1],
[2,"Solve −6=3−3x.",["−3","−1","1","3"],3,"3","Subtract 3: −9=−3x, then divide by −3.","two_step_equations",2],
[3,"Solve 3(x+4)=27.",["5","7","9","13"],0,"5","Divide by 3 or distribute: x+4=9, so x=5.","distribution_equations",1],
[3,"Solve 4x−3+2x=21.",["3","4","6","8"],1,"4","Combine like terms: 6x−3=21, then solve.","multi_step_equations",1],
[3,"Solve 2(3x−1)+5=21.",["2","3","4","6"],1,"3","Distribute and combine: 6x+3=21, so x=3.","multi_step_equations",2],
[3,"What should be done first in 5(x−2)+3x=22?",["combine 5x and 3x before distributing","distribute 5 across x−2","subtract 22 from both sides","divide everything by x"],1,"distribute 5 across x−2","Parentheses must be resolved before combining the resulting like terms.","solution_strategy",1],
[3,"Solve 7−2(3x+1)=−7.",["−1","1","2","3"],2,"2","Distribute: 5−6x=−7; subtract 5 and divide by −6.","multi_step_equations",2],
[4,"Solve 5x+2=3x+14.",["4","6","8","12"],1,"6","Move variable terms to one side: 2x=12.","variables_both_sides",1],
[4,"What type of equation is 4(x+2)=4x+8?",["one solution","no solution","identity; infinitely many solutions","quadratic"],2,"identity; infinitely many solutions","Both sides simplify to the same expression.","identity",1],
[4,"What type of equation is 2x+5=2x−1?",["one solution","no solution","infinitely many solutions","x=−6"],1,"no solution","Subtracting 2x gives the false statement 5=−1.","contradiction",1],
[4,"Solve 7x−9=5x+3.",["−6","3","6","12"],2,"6","Subtract 5x and add 9: 2x=12.","variables_both_sides",1],
[4,"After simplifying an equation you obtain 0=0. What does this mean?",["x=0 only","there is no solution","every value in the domain is a solution","the equation was solved incorrectly"],2,"every value in the domain is a solution","A true identity means both sides are equivalent for all allowed values.","identity",2],
[5,"Solve A=lw for w.",["w=A−l","w=A/l","w=l/A","w=Al"],1,"w=A/l","Divide both sides by l, assuming l≠0.","literal_equations",1],
[5,"Solve y=mx+b for x.",["x=(y−b)/m","x=(y+b)/m","x=my−b","x=m/(y−b)"],0,"x=(y−b)/m","Subtract b, then divide by m.","literal_equations",2],
[5,"The formula P=2l+2w gives perimeter. Solve for l.",["l=P−2w","l=(P−2w)/2","l=P/2+2w","l=2P−w"],1,"l=(P−2w)/2","Subtract 2w and divide by 2.","formula_rearrangement",2],
[5,"Solve v=u+at for t.",["t=(v−u)/a","t=(v+u)/a","t=a(v−u)","t=v−u−a"],0,"t=(v−u)/a","Isolate at, then divide by a.","formula_rearrangement",2],
[5,"Why is rearranging a formula useful?",["It changes the physical relationship","It isolates the quantity needed for a particular problem","It removes all units","It guarantees integer answers"],1,"It isolates the quantity needed for a particular problem","Equivalent rearrangements let us calculate different quantities from the same relationship.","formula_reasoning",1],
[6,"Solve the proportion 3/5=x/20.",["8","12","15","25"],1,"12","Cross products give 5x=60.","proportions",1],
[6,"If y varies directly with x and y=18 when x=6, what is the constant of variation?",["2","3","6","12"],1,"3","For y=kx, k=y/x=18/6=3.","direct_variation",1],
[6,"A $60 item is discounted 25%. What is the discount amount?",["$12","$15","$20","$45"],1,"$15","25% of 60 is 0.25·60=15.","percent_equations",1],
[6,"If y=4x, what is y when x=−3?",["−12","−7","1","12"],0,"−12","Direct variation uses the constant multiplier 4.","direct_variation",1],
[6,"A recipe uses 2 cups of rice for 5 servings. How many cups are needed for 20 servings?",["4","8","10","50"],1,"8","The scale factor from 5 to 20 servings is 4, so 2·4=8.","proportional_reasoning",2],
[7,"A car travels 180 miles in 3 hours at constant speed. What equation models distance d after t hours?",["d=3t","d=60t","d=180t","d=183t"],1,"d=60t","The rate is 180/3=60 miles per hour.","distance_model",1],
[7,"A savings account starts with $120 and receives $25 each month. Which model gives balance B after m months?",["B=120m+25","B=25m+120","B=145m","B=120−25m"],1,"B=25m+120","The initial value is 120 and monthly rate is 25.","financial_model",1],
[7,"A 20-liter mixture is 30% juice. How many liters are juice?",["3","6","14","17"],1,"6","0.30·20=6 liters.","mixture_model",1],
[7,"Two cyclists move in opposite directions at 12 mph and 15 mph. How far apart are they after 2 hours?",["6 miles","27 miles","42 miles","54 miles"],3,"54 miles","Their separation rate is 12+15=27 mph; 27·2=54.","rate_model",2],
[7,"A phone plan costs $18 plus $4 per gigabyte. If the bill is $42, how many gigabytes were used?",["4","6","10","15"],1,"6","Solve 18+4g=42: 4g=24, so g=6.","financial_model",2]
];
const rebuilt=rows.map((r,i)=>({prompt:r[1],options:r[2],answer:r[3],answer_text:r[4],explanation:r[5],unit:3,lesson:r[0],category:r[6],difficulty:r[7],id:`q${String(66+i).padStart(4,"0")}`}));
if(!Array.isArray(window.ALGEBRA1_QUESTIONS))return;
window.ALGEBRA1_QUESTIONS=window.ALGEBRA1_QUESTIONS.filter(q=>Number(q.unit)!==3).concat(rebuilt);
})();