(()=>{
"use strict";
const q=(id,prompt,options,answer,explanation,dimension)=>({id,prompt,options,answer,explanation,dimension});
const B=window.KhaemenesAlgebra1WeeklyMasteryV2=window.KhaemenesAlgebra1WeeklyMasteryV2||{};
Object.assign(B,{
"1":{week:1,unit:0,title:"Readiness Confirmation",focus:"Pre-Algebra readiness for Algebra I",graded:false,unit_path:"../diagnostic/",questions:[
q("a1-w01-q01","Evaluate −6 + 14 − 9.",["−11","−1","1","17"],1,"−6+14=8 and 8−9=−1.","procedural-fluency"),
q("a1-w01-q02","Simplify 3(2x−5)+4x.",["10x−15","6x−1","10x−5","7x−15"],0,"Distribute first, then combine like terms: 6x−15+4x=10x−15.","procedural-fluency"),
q("a1-w01-q03","A recipe uses 3 cups for 8 servings. At the same rate, how many cups are needed for 20 servings?",["6","7.5","8","9"],1,"3/8=c/20 gives c=7.5 cups.","multi-step-application"),
q("a1-w01-q04","A taxi charges $4 plus $2.50 per mile. Which expression gives the cost for m miles?",["4m+2.5","2.5(m+4)","4+2.5m","6.5m"],2,"The fixed charge is 4 and the variable charge is 2.5m.","representation-interpretation"),
q("a1-w01-q05","Which point lies in Quadrant II?",["(−3,4)","(3,4)","(−3,−4)","(3,−4)"],0,"Quadrant II has negative x and positive y.","representation-interpretation"),
q("a1-w01-q06","A student solves 5x+7=22 as 5x=29. What is the first error?",["They should divide by 5 first","They added 7 instead of subtracting 7","They should change x to −x","22 should become 15 by division"],1,"Subtract 7 from both sides to preserve equality.","error-analysis"),
q("a1-w01-q07","A student says 2³+2²=2⁵. Which correction is valid?",["2³+2²=12","2³+2²=2⁶","2³+2²=10","2³+2²=32"],0,"Exponent addition applies to multiplication of like bases, not addition: 8+4=12.","error-analysis"),
q("a1-w01-q08","If f(x)=3x−2, which ordered pair lies on the graph?",["(2,2)","(2,4)","(4,2)","(0,3)"],1,"f(2)=6−2=4, so (2,4) lies on the graph.","transfer-reasoning"),
q("a1-w01-q09","A quantity changes from 80 to 92. What is the percent increase?",["12%","15%","18%","115%"],1,"The increase is 12; 12/80=0.15=15%.","multi-step-application"),
q("a1-w01-q10","Which check gives the strongest evidence that x=−3 solves 4x+5=−7?",["Round −3","Substitute −3 into the original equation","Repeat the final subtraction","Graph only the left side"],1,"Substitution tests the proposed solution in the original statement.","transfer-reasoning")
]},
"2":{week:2,unit:1,title:"Mathematical Truth & Real Numbers",focus:"Claims, properties, number sets, intervals, exact values",graded:true,unit_path:"../units/unit-01/",questions:[
q("a1-w02-q01","Which property justifies 5(a+2)=5a+10?",["Associative","Distributive","Commutative","Identity"],1,"The factor 5 multiplies both terms inside the parentheses.","procedural-fluency"),
q("a1-w02-q02","What is the smallest standard real-number set containing −12?",["Natural","Whole","Integer","Irrational"],2,"−12 is an integer.","procedural-fluency"),
q("a1-w02-q03","Which interval represents −4 < x ≤ 7?",["[−4,7]","(−4,7]","[−4,7)","(−4,7)"],1,"−4 is excluded and 7 is included.","representation-interpretation"),
q("a1-w02-q04","Which expression names an exact irrational value?",["1.414","√2","1.41","7/5"],1,"√2 is exact; the decimals are approximations.","representation-interpretation"),
q("a1-w02-q05","A learner claims every nonterminating decimal is irrational. Which example disproves the claim?",["π","√3","0.272727…","√10"],2,"A repeating decimal is rational even though it does not terminate.","error-analysis"),
q("a1-w02-q06","A student writes 4(x+3)=4x+3. What is the earliest error?",["The 4 was not distributed to 3","x should be squared","The 3 should be negative","The parentheses cannot be removed"],0,"Distribution requires multiplying both terms by 4.","error-analysis"),
q("a1-w02-q07","Which value is a counterexample to the claim ‘for every real x, x²≥x’?",["2","1","1/2","−2"],2,"For x=1/2, x²=1/4, which is less than 1/2.","transfer-reasoning"),
q("a1-w02-q08","A sensor accepts values greater than −2 but no more than 5. Which statement models the rule?",["−2≤x<5","−2<x≤5","x<−2 or x>5","−2<x<5"],1,"The lower endpoint is excluded and the upper endpoint is included.","multi-step-application"),
q("a1-w02-q09","Why does subtracting 9 from both sides of x+9=14 preserve the solution?",["Equal operations preserve equality","Nine changes sign when moved","Variables ignore constants","Subtraction always comes first"],0,"Applying the same operation to equal quantities preserves equality.","transfer-reasoning"),
q("a1-w02-q10","A research note uses √50≈7.071. Which form should be retained when an exact value is required?",["7","7.1","5√2","50/7"],2,"√50 simplifies exactly to 5√2.","multi-step-application")
]},
"3":{week:3,unit:1,title:"Units, Precision & Verification",focus:"Dimensional analysis, rates, rounding, percent error, synthesis",graded:true,unit_path:"../units/unit-01/",questions:[
q("a1-w03-q01","Convert 72 km/h to meters per second.",["20 m/s","7.2 m/s","25.9 m/s","200 m/s"],0,"72×1000/3600=20 m/s.","procedural-fluency"),
q("a1-w03-q02","A measured value is 96 and the accepted value is 100. What is the percent error?",["96%","4%","0.04%","104%"],1,"|96−100|/100×100%=4%.","procedural-fluency"),
q("a1-w03-q03","A car travels 150 miles in 3 hours. Which unit rate and unit are correct?",["50 hours/mile","450 miles/hour","50 miles/hour","0.02 miles/hour"],2,"150÷3=50 and the units are miles per hour.","representation-interpretation"),
q("a1-w03-q04","A ruler is marked to the nearest millimeter. Which report most reasonably matches that precision for a length near 12.3 cm?",["12.300000 cm","12.3 cm","12 cm exactly","12.34726 cm"],1,"The measurement should not imply far more precision than the instrument supports.","representation-interpretation"),
q("a1-w03-q05","A student converts 5 ft to inches by multiplying by 1 ft/12 in. What is wrong?",["The conversion factor is inverted","Feet cannot convert to inches","Five must be squared","The answer must be negative"],0,"Use 12 in/1 ft so feet cancel.","error-analysis"),
q("a1-w03-q06","A learner reports 40 miles ÷ 2 hours = 20 hours/mile. Diagnose the error.",["The number 20 is wrong","The units were reversed","Division cannot be used","The time should be squared"],1,"The numerical rate is 20, but it is miles per hour.","error-analysis"),
q("a1-w03-q07","A medication calculation gives 0.0042 g. How many milligrams is this?",["0.0042 mg","0.42 mg","4.2 mg","4200 mg"],2,"Multiply grams by 1000: 0.0042 g=4.2 mg.","multi-step-application"),
q("a1-w03-q08","A machine part is specified as 25.0±0.2 mm. Which measured value is outside tolerance?",["24.9 mm","25.1 mm","25.2 mm","25.3 mm"],3,"The accepted range is 24.8 to 25.2 mm inclusive.","multi-step-application"),
q("a1-w03-q09","Which verification is most independent after a unit-conversion calculation?",["Check that units cancel to the required unit and estimate magnitude","Repeat the same keystrokes","Delete the units","Round before checking"],0,"Dimensional cancellation plus a magnitude estimate tests the structure independently.","transfer-reasoning"),
q("a1-w03-q10","An answer is numerically correct but its units are dimensionally impossible. What is the strongest conclusion?",["Accept it because the number matches","Reject the reasoning until the unit error is resolved","Erase only the unit label","Convert the number to a percent"],1,"A coincidental number does not validate dimensionally invalid reasoning.","transfer-reasoning")
]},
"4":{week:4,unit:2,title:"Variables, Terms & Evaluation",focus:"Expression anatomy, substitution, coefficients, degree",graded:true,unit_path:"../units/unit-02/",questions:[
q("a1-w04-q01","In 7x²−3x+5, what is the coefficient of x²?",["2","7","−3","5"],1,"The coefficient multiplying x² is 7.","procedural-fluency"),
q("a1-w04-q02","Evaluate 2a²−3b when a=−3 and b=4.",["6","30","−30","−6"],0,"2(9)−12=6.","procedural-fluency"),
q("a1-w04-q03","Which phrase matches 5n−8?",["Eight less than five times n","Five less than eight times n","Five times the difference n−8","Eight divided by five n"],0,"5n−8 means five times n, then subtract eight.","representation-interpretation"),
q("a1-w04-q04","A rectangle has width w and length w+3. Which expression represents its perimeter?",["w(w+3)","2w+3","4w+6","2w+6"],2,"P=2w+2(w+3)=4w+6.","multi-step-application"),
q("a1-w04-q05","A student evaluates 3x² at x=−2 as (3·−2)²=36. What is the error?",["The coefficient 3 is not part of the square","Negative values cannot be squared","The exponent should be 3","The answer should use x"],0,"3x² means 3·(x²), so 3·4=12.","error-analysis"),
q("a1-w04-q06","A learner says 4x and 4x² are like terms because both contain x. Why is that false?",["Their coefficients differ","Their variable parts have different exponents","Like terms cannot contain variables","x² equals 2x"],1,"Like terms require identical variable parts, including exponents.","error-analysis"),
q("a1-w04-q07","If C=18+7h models a service cost, what does 18 represent?",["Hourly rate","Number of hours","Fixed initial charge","Total after one hour"],2,"The constant term is the cost when h=0.","representation-interpretation"),
q("a1-w04-q08","A formula A=1/2bh gives triangle area. What is A when b=12.5 and h=8?",["50","100","20.5","200"],0,"A=0.5×12.5×8=50.","multi-step-application"),
q("a1-w04-q09","Which expression has degree 4?",["3x³+4x","7x⁴−x²+1","4x+4","x²y³"],1,"For a one-variable polynomial, the greatest exponent is 4.","transfer-reasoning"),
q("a1-w04-q10","Why is identifying terms before simplifying useful?",["It reveals which parts may legally combine","It makes every coefficient positive","It removes all exponents","It guarantees a linear expression"],0,"Term structure prevents combining unlike quantities.","transfer-reasoning")
]},
"5":{week:5,unit:2,title:"Properties & Polynomial Structure",focus:"Equivalence, distribution, like terms, monomials and polynomial classification",graded:true,unit_path:"../units/unit-02/",questions:[
q("a1-w05-q01","Simplify 4(2x−3)−5x.",["3x−12","13x−3","8x−8","3x−3"],0,"8x−12−5x=3x−12.","procedural-fluency"),
q("a1-w05-q02","Simplify 6x²−4x+3+2x²+7x−5.",["8x⁴+3x−2","8x²+3x−2","4x²+11x+8","8x²−11x−2"],1,"Combine like powers: 8x²+3x−2.","procedural-fluency"),
q("a1-w05-q03","Which expression is equivalent to 9x+18?",["9(x+2)","18(x+9)","3(x+6)","9(x+18)"],0,"Factoring out 9 gives 9(x+2).","representation-interpretation"),
q("a1-w05-q04","How should 5x³−2x+7 be classified?",["Monomial of degree 3","Binomial of degree 5","Trinomial of degree 3","Trinomial of degree 1"],2,"It has three terms and highest exponent 3.","representation-interpretation"),
q("a1-w05-q05","A student simplifies 3(x+4)+2x as 5x+4. What was missed?",["The 3 must multiply the 4","2x cannot combine with 3x","The x must be squared","The parentheses require division"],0,"3(x+4)=3x+12, so the result is 5x+12.","error-analysis"),
q("a1-w05-q06","A learner combines 2x²+5x as 7x³. Which rule was misused?",["Unlike terms cannot be combined by adding exponents","All coefficients must multiply","x² always equals 2x","Addition requires factoring first"],0,"Exponents do not add when unlike terms are added.","error-analysis"),
q("a1-w05-q07","A square has side x+3. Which expanded expression gives its area?",["x²+6x+9","x²+9","2x+6","x²+3x+9"],0,"(x+3)²=x²+6x+9.","multi-step-application"),
q("a1-w05-q08","The cost of n tickets is 12n and a $5 fee is added. If four friends split the total equally, which expression is each share?",["12n+5/4","(12n+5)/4","3n+5","48n+20"],1,"The entire total must be divided by 4.","multi-step-application"),
q("a1-w05-q09","Why can 2(a+b)+3(a+b) be written 5(a+b)?",["The common factor (a+b) is combined using distribution in reverse","Parentheses may always be deleted","a and b both equal 1","The exponents add"],0,"Treat (a+b) as a shared factor.","transfer-reasoning"),
q("a1-w05-q10","Which rewrite makes the structure of 6x²+12x most visible for identifying a common factor?",["6x(x+2)","18x²","3x(2x+12)","6(x²+12x)"],0,"6x is the greatest common monomial factor.","transfer-reasoning")
]},
"6":{week:6,unit:2,title:"Polynomial Operations & Common Factors",focus:"Add/subtract polynomials, multiply monomials, factor the GCF, structural synthesis",graded:true,unit_path:"../units/unit-02/",questions:[
q("a1-w06-q01","Subtract (3x²−2x+5) from (8x²+x−4).",["5x²+3x−9","11x²−x+1","5x²−x−9","5x²+3x+1"],0,"Distribute the subtraction: 8x²+x−4−3x²+2x−5=5x²+3x−9.","procedural-fluency"),
q("a1-w06-q02","Multiply −3x²(4x−5).",["−12x³+15x²","−12x²+15x","12x³−15x²","−7x³"],0,"Distribute −3x² to both terms.","procedural-fluency"),
q("a1-w06-q03","Factor 18x³−24x² completely by the GCF.",["6x²(3x−4)","6x(3x²−4x)","3x²(6x−8)","18x²(x−24)"],0,"The GCF is 6x².","representation-interpretation"),
q("a1-w06-q04","Which product has degree 5?",["(2x²)(3x³)","(x²)+(x³)","5x·x³","(x²)(x²)"],0,"When multiplying powers of x, exponents add: 2+3=5.","representation-interpretation"),
q("a1-w06-q05","A student subtracts (2x²−5x+1) and changes only the first sign. What is the correction?",["Change the sign of every term in the subtracted polynomial","Never change signs when subtracting","Multiply all exponents by −1","Combine before subtracting"],0,"Subtraction distributes −1 across the entire polynomial.","error-analysis"),
q("a1-w06-q06","A learner factors 12x²+18x as 6(2x²+3x). Why is the factorization incomplete?",["A common x also remains","Six is not a factor","The signs are wrong","The polynomial cannot be factored"],0,"The GCF is 6x, giving 6x(2x+3).","error-analysis"),
q("a1-w06-q07","A rectangular garden has dimensions 3x and 2x+5. Which expression gives its area?",["6x²+15x","5x+5","6x²+5","6x+15"],0,"Multiply 3x(2x+5).","multi-step-application"),
q("a1-w06-q08","A manufacturer makes n batches. Each batch uses 4x²+3x units of material, but 2x units are recycled per batch. Which expression models net material for n batches?",["n(4x²+x)","4nx²+3x−2x","n(4x²+5x)","4x²+n"],0,"Per batch net is 4x²+3x−2x=4x²+x, then multiply by n.","multi-step-application"),
q("a1-w06-q09","Why does factoring help compare two polynomial expressions?",["It can expose shared structure and zeros hidden by expansion","It changes the value","It eliminates variables","It makes every polynomial linear"],0,"Factoring preserves value while revealing multiplicative structure.","transfer-reasoning"),
q("a1-w06-q10","Which check best verifies 6x(2x+3)=12x²+18x?",["Redistribute the factor and compare terms","Substitute x=0 only and stop","Delete x from both sides","Compare only coefficients"],0,"Expansion verifies the factorization for all x symbolically.","transfer-reasoning")
]},
"7":{week:7,unit:3,title:"Equality & Linear Equation Fluency",focus:"Equality, inverse operations, one-step and two-step equations, verification",graded:true,unit_path:"../units/unit-03/",questions:[
q("a1-w07-q01","Solve 5x−7=18.",["x=5","x=11/5","x=−5","x=25"],0,"Add 7, then divide by 5: x=5.","procedural-fluency"),
q("a1-w07-q02","Solve x/4+3=8.",["x=5","x=20","x=32","x=44"],1,"Subtract 3, then multiply by 4: x=20.","procedural-fluency"),
q("a1-w07-q03","Which equation models ‘seven less than three times n is 20’?",["7−3n=20","3(n−7)=20","3n−7=20","7n−3=20"],2,"Three times n is 3n; seven less is 3n−7.","representation-interpretation"),
q("a1-w07-q04","What does the solution x=6 mean for 4x+2=26?",["Only the left side equals 6","Substituting 6 makes both sides equal 26","The equation has six terms","x may be any value larger than 6"],1,"A solution makes the original equation true.","representation-interpretation"),
q("a1-w07-q05","A student solves 2x+9=17 by writing 2x=26. What is the first error?",["They added 9 instead of subtracting 9","They should square both sides","They divided too early","Seventeen is not a constant"],0,"Subtract 9 from both sides.","error-analysis"),
q("a1-w07-q06","A learner divides only the left side of 6x=30 by 6. Why is that invalid?",["The same nonzero operation must be applied to both sides","Thirty cannot be divided","x must stay multiplied","Division is forbidden in equations"],0,"Equality is preserved only when both sides receive the same valid operation.","error-analysis"),
q("a1-w07-q07","A streaming plan costs $12 plus $4 per movie. The bill is $36. How many movies were rented?",["4","6","8","12"],1,"12+4m=36 gives 4m=24 and m=6.","multi-step-application"),
q("a1-w07-q08","A temperature is 18°C and drops d degrees to reach −5°C. Which equation and solution are correct?",["18+d=−5; d=−23","18−d=−5; d=23","d−18=−5; d=13","18d=−5; d=−5/18"],1,"A drop of d gives 18−d=−5, so d=23.","multi-step-application"),
q("a1-w07-q09","Which method is the strongest verification after solving 7x−4=31?",["Substitute the solution into 7x−4 and compare with 31","Repeat the final division only","Round the solution","Change 31 to another value"],0,"Substitution checks the original equation.","transfer-reasoning"),
q("a1-w07-q10","Why is ‘move the 4 to the other side’ weaker than ‘add 4 to both sides’?",["The second statement names the equality-preserving operation","Moving terms is slower","Four cannot cross an equals sign","Only addition is allowed in algebra"],0,"Naming the operation exposes why equivalence is preserved.","transfer-reasoning")
]},
"8":{week:8,unit:3,title:"Multi-Step, Both-Sides & Literal Equations",focus:"Distribution, like terms, identities/contradictions, formulas",graded:true,unit_path:"../units/unit-03/",questions:[
q("a1-w08-q01","Solve 3(x−4)+5=2x+1.",["x=8","x=−8","x=4","x=−4"],0,"3x−12+5=2x+1, so 3x−7=2x+1 and x=8.","procedural-fluency"),
q("a1-w08-q02","Solve 5x+7=2x−8.",["x=5","x=−5","x=−1/5","x=15"],1,"3x=−15, so x=−5.","procedural-fluency"),
q("a1-w08-q03","Classify 4(x+2)=4x+8.",["One solution","No solution","Identity: infinitely many solutions","Two solutions"],2,"Both sides are equivalent for every x.","representation-interpretation"),
q("a1-w08-q04","Solve A=1/2bh for h, assuming b≠0.",["h=A/(2b)","h=2A/b","h=Ab/2","h=b/(2A)"],1,"Multiply by 2 and divide by b: h=2A/b.","representation-interpretation"),
q("a1-w08-q05","A student expands 2(3x−5) as 6x−5. What is the first error?",["The 2 was not distributed to −5","Three and x cannot multiply","The sign before 5 must become positive","The equation must be squared"],0,"Distribution gives 6x−10.","error-analysis"),
q("a1-w08-q06","A learner reaches 0=7 after simplifying an equation and then reports x=7. What should the conclusion be?",["No solution","x=7","All real numbers","x=0"],0,"A false statement such as 0=7 means the original equation is a contradiction.","error-analysis"),
q("a1-w08-q07","The perimeter of a rectangle is P=2L+2W. Solve for W, then find W when P=50 and L=9.",["W=16","W=25","W=8","W=32"],2,"W=(P−2L)/2=(50−18)/2=16, wait this equals 16; therefore option 0.","multi-step-application"),
q("a1-w08-q08","A formula d=rt models distance. If d=315 km and t=4.5 h, what is r?",["70 km/h","71.5 km/h","319.5 km/h","1417.5 km/h"],0,"r=d/t=315/4.5=70 km/h.","multi-step-application"),
q("a1-w08-q09","Why can an equation with variables on both sides have zero, one, or infinitely many solutions?",["Simplification may produce a false statement, a variable equation, or an identity","Variables randomly disappear","Every equation has three answers","It depends only on whether coefficients are even"],0,"The simplified relationship determines the solution type.","transfer-reasoning"),
q("a1-w08-q10","Which step best verifies a rearranged literal formula?",["Substitute the rearranged expression back into the original formula and simplify","Check one coefficient only","Remove the units","Change every variable to 1"],0,"Back-substitution checks algebraic equivalence.","transfer-reasoning")
]},
"9":{week:9,unit:3,title:"Proportions, Rates & Equation Models",focus:"Direct variation, percent equations, rates, mixtures, distance and finance",graded:true,unit_path:"../units/unit-03/",questions:[
q("a1-w09-q01","Solve x/12=5/8.",["x=6.5","x=7.5","x=17","x=96"],1,"x=12·5/8=7.5.","procedural-fluency"),
q("a1-w09-q02","Find 18% of 250.",["32","45","68","450"],1,"0.18×250=45.","procedural-fluency"),
q("a1-w09-q03","A direct variation has y=18 when x=6. Which equation represents it?",["y=3x","y=12x","y=x+12","y=18x+6"],0,"k=y/x=3, so y=3x.","representation-interpretation"),
q("a1-w09-q04","A tank drains at 4.5 liters per minute from an initial 80 liters. Which model gives volume V after t minutes?",["V=4.5t+80","V=80−4.5t","V=80t−4.5","V=4.5−80t"],1,"The initial value is 80 and the rate of change is −4.5.","representation-interpretation"),
q("a1-w09-q05","A student solves x/6=4/9 by adding 6 and 9. What principle is missing?",["A proportion preserves multiplicative ratios; use equivalent fractions or cross products","All fractions must be added","Denominators should be ignored","x must equal 4"],0,"Proportions are multiplicative relationships.","error-analysis"),
q("a1-w09-q06","A learner models a $30 fixed fee plus $8 per hour as C=30h+8. What is reversed?",["The fixed amount and hourly rate","The variable and units","Addition and equality","Nothing"],0,"The correct model is C=30+8h.","error-analysis"),
q("a1-w09-q07","A trip of 210 miles is driven partly at 50 mph for 2 hours and then at 55 mph. How long is the second part?",["1 h","2 h","110/55 h","Both 2 h and 110/55 h"],3,"The first part covers 100 miles; 110 miles remain, and 110/55=2 hours.","multi-step-application"),
q("a1-w09-q08","An $80 item is discounted 25% and then taxed 8% on the sale price. What is the final price?",["$60.00","$64.80","$66.40","$69.12"],1,"Sale price is $60; tax is $4.80, so total is $64.80.","multi-step-application"),
q("a1-w09-q09","Why should a solution to a rate model include units?",["Units connect the algebraic value to the quantity being interpreted","Units make equations longer","Units change the numerical solution","Rates have no meaning without decimals"],0,"A numerical result without units may not answer the contextual question.","transfer-reasoning"),
q("a1-w09-q10","Two plans have equal unit rates but different fixed fees. What additional information is needed to choose the cheaper plan?",["Expected usage amount","Color of the bill","Whether the rates are integers","The alphabetic variable used"],0,"Total cost depends on both fixed fee and expected usage.","transfer-reasoning")
]}
});
})();