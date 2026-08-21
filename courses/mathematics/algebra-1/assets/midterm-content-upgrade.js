/* Khaemenes Algebra I · A+++ Midterm Content Rebuild
   60 unique items · Units 01–06 · 10 per unit · definitive-answer standard.
   Loaded after inline EXAM_CONFIG and before exam-engine.js.
*/
(()=>{"use strict";
const C=window.EXAM_CONFIG;if(!C||C.id!=="KH-MATH-A1-MIDTERM-U01-U06")return;
const R=[
[1,1,"reasoning","verify-equation-solution",1,"Which method best verifies that x=5 solves 3x−4=11?",["Substitute 5 into the original equation","Repeat the solving steps without checking","Round 5 to the nearest ten","Change every subtraction sign"],0,"Substitution gives 3(5)−4=11, a true statement."],
[1,1,"properties","distributive-property",1,"Which property justifies 6(x−2)=6x−12?",["Commutative","Distributive","Associative","Identity"],1,"The factor 6 multiplies both terms inside the parentheses."],
[1,2,"real_numbers","identify-irrational",1,"Which number is irrational?",["0.45","−11","√7","5/8"],2,"√7 cannot be written as a ratio of integers."],
[1,2,"intervals","inequality-to-interval",2,"Which interval represents x<3?",["[3,∞)","(−∞,3)","(−∞,3]","(3,∞)"],1,"A strict inequality excludes 3 and includes every smaller real number."],
[1,3,"order_ops","order-of-operations",1,"Evaluate 18−2(5+1).",["6","16","24","96"],0,"Parentheses first: 18−2·6=6."],
[1,3,"expressions","distribute-combine",2,"Simplify 5(2x−3)+x.",["11x−15","10x−14","11x−3","6x−15"],0,"Distribute to get 10x−15, then combine x terms."],
[1,4,"rates","unit-rate",1,"A train travels 315 miles in 4.5 hours. What is its average speed?",["60 mph","65 mph","70 mph","75 mph"],2,"315÷4.5=70 miles per hour."],
[1,4,"scale","proportional-scale",2,"A blueprint uses 1 cm for 2.5 m. A wall measures 6 cm on the blueprint. What is its actual length?",["8.5 m","15 m","20 m","25 m"],1,"6·2.5=15 meters."],
[1,5,"precision","percent-error",2,"A measured value is 47.5 and the accepted value is 50. What is the percent error?",["2.5%","5%","47.5%","95%"],1,"|47.5−50|/50·100%=5%."],
[1,6,"error_analysis","identify-distribution-error",2,"A student rewrites −2(x+7) as −2x+7. What correction is needed?",["Change −2x to 2x","Distribute −2 to 7, giving −14","Replace x with x²","No correction is needed"],1,"The factor −2 must multiply both x and 7."],

[2,1,"structure","coefficient",1,"In −9x³+4x−6, what is the coefficient of x³?",["−9","3","4","−6"],0,"The numerical factor multiplying x³ is −9."],
[2,1,"terms","identify-terms",1,"How many terms are in 4a²−3a+8?",["1","2","3","4"],2,"The expression has three terms separated by addition or subtraction."],
[2,2,"substitution","evaluate-expression",2,"Evaluate 2m²−3n for m=−3 and n=4.",["6","18","30","−30"],0,"2(9)−12=6."],
[2,2,"formula","formula-evaluation",1,"The formula V=lwh gives rectangular-prism volume. Find V for l=5,w=3,h=4.",["12","20","60","120"],2,"5·3·4=60 cubic units."],
[2,3,"equivalence","equivalent-expressions",2,"Which expression is equivalent to 4(2x+3)−x?",["7x+12","8x+2","9x+12","7x+3"],0,"Distribute and combine: 8x+12−x=7x+12."],
[2,4,"combine_like_terms","simplify-expression",2,"Simplify 7x−4+3−2x.",["5x−1","9x−1","5x−7","9x+7"],0,"7x−2x=5x and −4+3=−1."],
[2,5,"classification","polynomial-classification",1,"Which expression is a binomial?",["5x³","x²−9","x²+3x+2","x⁴+x³+x²+x"],1,"x²−9 has exactly two terms."],
[2,5,"degree","polynomial-degree",1,"What is the degree of 3x⁶−2x⁴+x−8?",["3","4","6","8"],2,"The greatest exponent is 6."],
[2,6,"subtract_polynomials","polynomial-subtraction",2,"Simplify (5x²−2x+1)−(2x²+3x−4).",["3x²−5x+5","7x²+x−3","3x²+x−3","7x²−5x+5"],0,"Distribute the subtraction and combine like terms."],
[2,7,"gcf_factoring","factor-gcf",2,"Factor 18x³−24x² completely by GCF.",["6x²(3x−4)","3x²(6x−8)","6x(3x²−4x)","2x²(9x−12)"],0,"The greatest common factor is 6x²."],

[3,1,"inverse_operations","one-step-equation",1,"Solve x−13=−4.",["−17","−9","9","17"],2,"Add 13 to both sides to get x=9."],
[3,2,"two_step_equations","solve-two-step",1,"Solve 5x+8=−17.",["−5","−3","3","5"],0,"Subtract 8 to get 5x=−25, then divide by 5."],
[3,3,"multi_step_equations","distribution-equation",2,"Solve 3(2x−5)+4=25.",["4","5","6","7"],2,"6x−15+4=25 gives 6x=36, so x=6."],
[3,3,"multi_step_equations","combine-and-solve",2,"Solve 7x−4−2x=21.",["3","4","5","7"],2,"Combine to 5x−4=21, so x=5."],
[3,4,"variables_both_sides","solve-both-sides",2,"Solve 8x+3=5x+24.",["5","6","7","9"],2,"Subtract 5x and 3 to get 3x=21."],
[3,4,"equation_types","classify-equation",2,"Classify 2(3x−1)=6x−2.",["one solution","no solution","identity with infinitely many solutions","quadratic"],2,"Both sides simplify to the same expression."],
[3,5,"literal_equations","rearrange-formula",2,"Solve C=2πr for r.",["r=C−2π","r=C/(2π)","r=2π/C","r=2πC"],1,"Divide both sides by 2π."],
[3,6,"proportions","solve-proportion",1,"Solve 7/9=x/27.",["18","21","24","27"],1,"Cross multiplication gives 9x=189, so x=21."],
[3,6,"percent_equations","percent-change",2,"A $240 bicycle is discounted 15%. What is the sale price?",["$36","$204","$225","$276"],1,"The discount is $36, so the sale price is $204."],
[3,7,"financial_model","linear-context",2,"A rental costs $35 plus $12 per hour. The total is $95. How many hours were rented?",["4","5","6","8"],1,"35+12h=95 gives 12h=60 and h=5."],

[4,1,"inequalities","solve-inequality",1,"Solve x+9>4.",["x>−5","x<−5","x>13","x<13"],0,"Subtract 9 from both sides."],
[4,2,"inequalities","negative-coefficient",2,"Solve −4x≥20.",["x≥−5","x≤−5","x≥5","x≤5"],1,"Dividing by −4 reverses the inequality: x≤−5."],
[4,2,"inequalities","multi-step-inequality",2,"Solve 3x−7≤11.",["x≤6","x≥6","x≤4/3","x≥4/3"],0,"Add 7 and divide by 3: x≤6."],
[4,3,"compound_inequalities","and-inequality",2,"Solve −2<3x+1≤10.",["−1<x≤3","−3<x≤9","x<−1 or x≥3","−1≤x<3"],0,"Subtract 1 then divide by 3: −1<x≤3."],
[4,3,"compound_inequalities","or-inequality",2,"Which set describes x<−4 or x≥2?",["(−4,2)","(−∞,−4)∪[2,∞)","[−4,2)","(−∞,2)"],1,"An OR compound inequality is the union of the two solution intervals."],
[4,4,"absolute_value","absolute-equation",1,"Solve |x−3|=7.",["x=4 or 10","x=−4 or 10","x=−10 or 4","x=3 or 7"],1,"x−3=7 or x−3=−7, giving 10 or −4."],
[4,4,"absolute_value","absolute-inequality",2,"Solve |x|<5.",["x<−5 or x>5","−5<x<5","x≤−5 or x≥5","−5≤x≤5"],1,"Distance from zero is less than 5 only between −5 and 5."],
[4,5,"graphing_inequalities","boundary-line",1,"For y<2x+1, how should the boundary y=2x+1 be drawn?",["solid","dashed","vertical","not drawn"],1,"A strict inequality excludes the boundary, so use a dashed line."],
[4,5,"graphing_inequalities","test-point",2,"Does (0,0) satisfy y≥−x+2?",["yes, because 0≥−2","yes, because 0≥2","no, because 0 is not at least 2","no, because x cannot be zero"],2,"Substitution gives 0≥2, which is false."],
[4,6,"modeling_inequalities","constraint-model",2,"A theater holds at most 240 people. If a adults and c children attend, which constraint models capacity?",["a+c≥240","a+c≤240","a−c≤240","240a+c≤1"],1,"At most means the total cannot exceed 240."],

[5,1,"functions","function-definition",1,"Which relation is a function?",["{(1,2),(1,5),(3,7)}","{(−1,4),(0,4),(2,6)}","{(2,3),(2,3),(2,8)}","{(4,1),(4,2),(5,3)}"],1,"Each input in the second relation has exactly one output."],
[5,1,"functions","vertical-line-test",1,"What does the vertical-line test determine?",["whether a graph is linear","whether each x-value has at most one y-value","whether a graph has a y-intercept","whether all outputs are positive"],1,"A function cannot assign two different outputs to one input."],
[5,2,"domain_range","domain-from-context",2,"A taxi model C=4+2.5m uses miles m for a trip limited to 0 through 30 miles. What is the contextual domain?",["all real numbers","m≥4","0≤m≤30","2.5≤m≤30"],2,"The input is trip distance restricted to 0 through 30 miles."],
[5,2,"domain_range","range-from-table",1,"For points (−2,5),(0,1),(3,5),(4,−1), what is the range?",["{−2,0,3,4}","{−1,1,5}","{−2,−1,0,1,3,4,5}","all real numbers"],1,"The distinct output values are −1,1,and 5."],
[5,3,"function_notation","evaluate-function",1,"If f(x)=3x−7, find f(6).",["11","18","25","−11"],0,"3(6)−7=11."],
[5,3,"function_notation","solve-function-value",2,"If g(x)=2x+5, for what x is g(x)=17?",["5","6","11","22"],1,"2x+5=17 gives x=6."],
[5,4,"representations","table-to-rule",2,"A table has x:0,1,2,3 and y:4,7,10,13. Which rule fits?",["y=3x+4","y=4x+3","y=x+4","y=3^x+4"],0,"Outputs increase by 3 and y=4 when x=0."],
[5,5,"rate_of_change","average-rate",2,"For f(1)=5 and f(4)=17, what is the average rate of change from x=1 to x=4?",["3","4","6","12"],1,"(17−5)/(4−1)=12/3=4."],
[5,6,"transformations","function-shift",2,"Compared with f(x)=x², what does g(x)=f(x−3)+2 do?",["left 3, down 2","right 3, up 2","right 2, up 3","left 2, down 3"],1,"Replacing x with x−3 shifts right 3; adding 2 shifts up 2."],
[5,7,"model_evaluation","representation-choice",2,"Which representation is usually best for seeing exact input-output pairs from a small data set?",["table","verbal description only","unlabeled sketch","equation with hidden parameters"],0,"A table displays exact paired values directly."],

[6,1,"linear_functions","slope-from-points",1,"Find the slope through (2,3) and (6,11).",["1/2","2","4","8"],1,"(11−3)/(6−2)=8/4=2."],
[6,1,"linear_functions","slope-intercept",1,"In y=−3x+8, identify the slope and y-intercept.",["slope 8, intercept −3","slope −3, intercept 8","slope 3, intercept −8","slope −8, intercept 3"],1,"Slope-intercept form is y=mx+b."],
[6,2,"linear_equations","point-slope-form",2,"Which equation is the line with slope 4 through (2,−1)?",["y+1=4(x−2)","y−1=4(x+2)","y+2=4(x−1)","y−2=−4(x+1)"],0,"Point-slope form is y−y₁=m(x−x₁)."],
[6,2,"linear_equations","standard-form",2,"Rewrite y=2x−5 in standard form Ax+By=C.",["2x−y=5","2x+y=−5","x−2y=5","5x−y=2"],0,"Move y left: 2x−y=5."],
[6,3,"parallel_perpendicular","parallel-lines",1,"Which slope is parallel to a line with slope −5/2?",["2/5","−5/2","5/2","−2/5"],1,"Distinct parallel nonvertical lines have equal slopes."],
[6,3,"parallel_perpendicular","perpendicular-lines",2,"Which slope is perpendicular to 3/4?",["4/3","−4/3","−3/4","3/4"],1,"Perpendicular nonvertical slopes are negative reciprocals."],
[6,4,"scatterplots","correlation",1,"A scatterplot rises from left to right with points clustered near a line. This suggests:",["strong positive association","strong negative association","no association","a vertical function"],0,"As x increases, y tends to increase."],
[6,5,"regression","residual",2,"A model predicts 42 but the observed value is 38. What is the residual observed−predicted?",["−4","4","38","80"],0,"Residual=38−42=−4."],
[6,6,"model_evaluation","extrapolation",2,"Why can predicting far beyond the observed x-values be risky?",["The relationship may change outside the data range","A line cannot have large x-values","Residuals become exactly zero","Slope automatically reverses"],0,"Extrapolation assumes the observed relationship continues beyond available evidence."],
[6,8,"decision_making","linear-model-interpretation",2,"A cost model C=18+7n represents a fixed fee plus cost per item. What does 7 represent?",["the fixed fee","the cost per additional item","the number of items","the maximum cost"],1,"The coefficient of n is the marginal cost per item."]
];
C.questions=R.map((r,i)=>({id:`A1-MID-${String(i+1).padStart(3,"0")}`,unit:r[0],lesson:r[1],category:r[2],skill:r[3],difficulty:r[4],prompt:r[5],options:r[6],answer:r[7],answer_text:r[6][r[7]],explanation:r[8]}));
C.question_count=C.questions.length;C.threshold=80;C.assessment_version="2.0-a-plus-plus-first-draft";
})();