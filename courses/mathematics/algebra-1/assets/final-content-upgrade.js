/* Khaemenes Algebra I · A+++ Final Exam Content Rebuild
   100 unique cumulative items · Units 01–13 · definitive-answer standard.
   Loaded after EXAM_CONFIG and before exam-engine.js.
*/
(()=>{"use strict";const C=window.EXAM_CONFIG;if(!C||C.id!=="KH-MATH-A1-FINAL-36W")return;
const Q=[];const add=(u,l,c,s,d,p,o,a,e)=>Q.push({id:`A1-FIN-${String(Q.length+1).padStart(3,"0")}`,unit:u,lesson:l,category:c,skill:s,difficulty:d,prompt:p,options:o,answer:a,answer_text:o[a],explanation:e});
// U01 Foundations — 8
add(1,1,"reasoning","verify-solution",1,"Which action directly verifies that x=−2 solves 4x+3=−5?",["Substitute −2 into the original equation","Divide −2 by 4","Change −5 to 5","Graph x=−2 only"],0,"Substitution produces −5=−5.");
add(1,1,"properties","distributive-property",1,"Which property justifies −3(a+4)=−3a−12?",["Associative","Distributive","Commutative","Identity"],1,"The outside factor multiplies both terms.");
add(1,2,"real_numbers","irrational-number",1,"Which number is irrational?",["−0.6","11/4","√11","25"],2,"√11 is not a ratio of integers.");
add(1,3,"order_ops","evaluate",1,"Evaluate 24÷3+2(5−1).",["10","12","14","16"],3,"24÷3=8 and 2·4=8, for 16.");
add(1,3,"expressions","simplify",2,"Simplify 4(3x−2)−5x.",["7x−8","12x−7","17x−8","7x+8"],0,"12x−8−5x=7x−8.");
add(1,4,"rates","unit-rate",1,"A cyclist travels 54 miles in 3 hours. What is the unit rate?",["16 mph","18 mph","27 mph","162 mph"],1,"54÷3=18 mph.");
add(1,5,"precision","percent-error",2,"A measurement is 76 when the accepted value is 80. Percent error?",["4%","5%","20%","95%"],1,"4/80·100%=5%.");
add(1,6,"error_analysis","distribution-error",2,"A student says 5(2x−3)=10x−3. What is wrong?",["5 was not distributed to −3","2x should become x²","10x should be −10x","Nothing is wrong"],0,"The correct constant term is −15.");
// U02 Expressions/polynomials — 8
add(2,1,"structure","coefficient",1,"What is the coefficient of x² in 7x³−4x²+x−9?",["7","−4","1","−9"],1,"The numerical factor on x² is −4.");
add(2,2,"substitution","evaluate-expression",1,"Evaluate 3a²−2b for a=−2,b=5.",["2","12","22","−22"],0,"3·4−10=2.");
add(2,3,"equivalence","equivalent-expression",2,"Which is equivalent to 2(4x+5)+3x?",["11x+10","8x+8","14x+5","11x+5"],0,"8x+10+3x=11x+10.");
add(2,4,"combine","like-terms",1,"Simplify 9y−6+2−4y.",["5y−4","13y−8","5y−8","13y−4"],0,"Combine variable terms and constants.");
add(2,5,"polynomials","degree",1,"What is the degree of 8x⁵−x³+6?",["3","5","6","8"],1,"The greatest exponent is 5.");
add(2,6,"poly_ops","addition",1,"Simplify (3x²+4x−1)+(5x²−x+6).",["8x²+3x+5","8x⁴+3x+5","2x²+5x+5","8x²+5x−7"],0,"Combine like-degree terms.");
add(2,6,"poly_ops","subtraction",2,"Simplify (7x²−2x+3)−(4x²+5x−1).",["3x²−7x+4","11x²+3x+2","3x²+3x+2","11x²−7x+4"],0,"Distribute the subtraction then combine.");
add(2,7,"factoring","gcf",2,"Factor 21x³+14x² completely by GCF.",["7x²(3x+2)","7x(3x²+2x)","x²(21x+14)","14x²(1.5x+1)"],0,"The GCF is 7x².");
// U03 Equations — 8
add(3,1,"equations","one-step",1,"Solve x+17=9.",["−26","−8","8","26"],1,"Subtract 17.");
add(3,2,"equations","two-step",1,"Solve 4x−7=21.",["5","7","14","28"],1,"4x=28, so x=7.");
add(3,3,"equations","distribution",2,"Solve 2(3x+1)−4=16.",["2","3","4","5"],1,"6x−2=16, so x=3.");
add(3,4,"equation_types","identity",2,"Classify 5(x−2)=5x−10.",["one solution","no solution","identity","quadratic"],2,"Both sides are equivalent for every x.");
add(3,4,"equations","both-sides",2,"Solve 9x−4=6x+17.",["5","6","7","9"],2,"3x=21.");
add(3,5,"literal","rearrange",2,"Solve V=πr²h for h.",["h=V/(πr²)","h=Vπr²","h=πr²/V","h=V/(πr)"],0,"Divide by πr².");
add(3,6,"proportion","solve",1,"Solve 5/8=x/24.",["10","15","16","19"],1,"8x=120, so x=15.");
add(3,7,"modeling","equation-model",2,"A club charges $18 membership plus $6 per visit. A member spends $60. How many visits?",["6","7","8","10"],1,"18+6v=60 gives v=7.");
// U04 Inequalities — 8
add(4,1,"inequalities","one-step",1,"Solve x−6≥11.",["x≥5","x≥17","x≤5","x≤17"],1,"Add 6.");
add(4,2,"inequalities","negative-multiply",2,"Solve −3x<18.",["x<−6","x>−6","x<6","x>6"],1,"Divide by −3 and reverse the sign.");
add(4,2,"inequalities","multi-step",2,"Solve 5x+4≤29.",["x≤5","x≥5","x≤25","x≥25"],0,"5x≤25.");
add(4,3,"compound","and",2,"Solve 1≤2x+3<9.",["−1≤x<3","−2≤x<6","x≤−1 or x>3","1≤x<9"],0,"Subtract 3 and divide by 2.");
add(4,3,"compound","interval",1,"Which interval represents x≤−2 or x>4?",["(−2,4]","(−∞,−2]∪(4,∞)","[−2,4)","(−∞,4)"],1,"The OR statement forms a union.");
add(4,4,"absolute","equation",1,"Solve |x+2|=6.",["x=4 or −8","x=8 or −4","x=6 or −2","x=4 only"],0,"x+2=±6.");
add(4,5,"graphing","boundary",1,"For y≤−2x+5, the boundary line should be:",["dashed","solid","vertical","omitted"],1,"≤ includes the boundary.");
add(4,6,"modeling","constraint",2,"A van carries at most 12 passengers. If a are adults and c are children, which constraint applies?",["a+c≤12","a+c≥12","a−c≤12","12a+c=1"],0,"At most means no more than 12.");
// U05 Functions — 8
add(5,1,"functions","definition",1,"Which relation is a function?",["{(1,2),(1,4)}","{(−2,5),(0,5),(3,8)}","{(4,1),(4,7)}","{(2,3),(2,6),(5,9)}"],1,"Each input has one output.");
add(5,2,"domain_range","domain",1,"For f(x)=1/(x+6), which input is excluded?",["−6","0","1","6"],0,"x=−6 makes the denominator zero.");
add(5,2,"domain_range","range",1,"What is the range of {(1,4),(2,7),(3,4),(5,9)}?",["{1,2,3,5}","{4,7,9}","{1,2,3,4,5,7,9}","all reals"],1,"Range is the set of distinct outputs.");
add(5,3,"notation","evaluate",1,"If f(x)=x²−3, find f(4).",["5","8","13","19"],2,"16−3=13.");
add(5,4,"representations","table-rule",2,"x:0,1,2,3; y:−2,2,6,10. Which rule fits?",["y=4x−2","y=2x−4","y=4x+2","y=x−2"],0,"Slope is 4 and intercept −2.");
add(5,5,"rate_change","average-rate",2,"If f(2)=7 and f(6)=19, average rate of change?",["2","3","4","12"],1,"(19−7)/(6−2)=3.");
add(5,6,"transformations","shift",2,"Compared with f(x), g(x)=f(x+4)−1 shifts the graph:",["right 4 up 1","left 4 down 1","left 1 down 4","right 1 up 4"],1,"Inside +4 shifts left; outside −1 shifts down.");
add(5,7,"modeling","representation",1,"Which representation most directly shows exact paired data values?",["table","unlabeled graph","verbal title","color legend"],0,"Tables display exact input-output pairs.");
// U06 Linear functions/data — 8
add(6,1,"linear","slope",1,"Find slope through (−1,2) and (3,10).",["1/2","2","4","8"],1,"Rise 8 over run 4 gives 2.");
add(6,1,"linear","interpret-slope",1,"In y=6x−9, what is the rate of change?",["−9","6","9","−6"],1,"The coefficient of x is the slope.");
add(6,2,"linear","point-slope",2,"Line of slope −3 through (2,5):",["y−5=−3(x−2)","y+5=3(x+2)","y−2=−3(x−5)","y+2=−3(x+5)"],0,"Use y−y₁=m(x−x₁).");
add(6,3,"parallel_perpendicular","parallel",1,"A line parallel to y=4x+1 has slope:",["−4","−1/4","1/4","4"],3,"Parallel lines share slope.");
add(6,3,"parallel_perpendicular","perpendicular",2,"A line perpendicular to slope −2/5 has slope:",["2/5","5/2","−5/2","−2/5"],1,"Use the negative reciprocal.");
add(6,4,"scatter","association",1,"Points fall from left to right and cluster near a line. This indicates:",["positive association","negative association","no association","quadratic minimum"],1,"As x rises, y tends to fall.");
add(6,5,"regression","residual",2,"Observed=31, predicted=35. Residual observed−predicted?",["−4","4","31","66"],0,"31−35=−4.");
add(6,6,"modeling","extrapolation",2,"Why is extrapolation less certain than interpolation?",["It predicts outside the observed data range","It always uses a quadratic","It eliminates residuals","It requires zero slope"],0,"Outside-range behavior may differ from the observed pattern.");
// U07 Systems — 8
add(7,1,"systems","solution-meaning",1,"A solution to a system of two equations is:",["a point satisfying both equations","the y-intercept of either line","any point on one line","the slope of the steeper line"],0,"It must make both equations true.");
add(7,2,"systems","substitution",2,"Solve y=x+1 and y=7−x.",["(2,3)","(3,4)","(4,3)","(6,1)"],1,"x+1=7−x gives x=3,y=4.");
add(7,3,"systems","elimination",2,"Solve x+y=9 and x−y=3.",["(3,6)","(6,3)","(9,3)","(6,6)"],1,"Adding gives 2x=12, then y=3.");
add(7,4,"systems","classification",1,"Two distinct parallel lines form a system with:",["one solution","no solution","infinitely many solutions","exactly two solutions"],1,"Parallel distinct lines never intersect.");
add(7,4,"systems","classification",1,"Two equations representing the same line have:",["no solution","one solution","infinitely many solutions","two solutions"],2,"Every point on the shared line satisfies both.");
add(7,5,"systems_inequalities","solution-region",2,"A point in the solution of a system of inequalities must:",["satisfy every inequality","satisfy exactly one inequality","lie on every boundary","have positive coordinates"],0,"The solution is the overlap of all constraints.");
add(7,6,"modeling","system-model",2,"Adult tickets cost $10 and student tickets $6. 20 tickets bring $152. Which system models this?",["a+s=20;10a+6s=152","a+s=152;10a+6s=20","10a+s=20;a+6s=152","a−s=20;10a−6s=152"],0,"One equation counts tickets and the other revenue.");
add(7,7,"verification","check-system",2,"Does (2,3) solve x+y=5 and 2x−y=1?",["yes","no, first equation fails","no, second equation fails","no, both fail"],0,"2+3=5 and 4−3=1.");
// U08 Exponents/sequences/exponential — 8
add(8,1,"exponents","product-rule",1,"Simplify x⁴·x³.",["x⁷","x¹²","2x⁷","x"],0,"Add exponents with the same base.");
add(8,1,"exponents","power-rule",1,"Simplify (a³)⁴.",["a⁷","a¹²","4a³","a"],1,"Multiply exponents.");
add(8,2,"exponents","negative-exponent",1,"Rewrite x⁻³ using positive exponents.",["−x³","1/x³","x/3","3/x"],1,"A negative exponent indicates a reciprocal.");
add(8,3,"scientific_notation","multiply",2,"(3×10⁴)(2×10³)=",["6×10⁷","5×10⁷","6×10¹²","6×10¹"],0,"Multiply coefficients and add powers of ten.");
add(8,4,"sequences","arithmetic",1,"What is the next term: 7,12,17,22,...?",["25","26","27","29"],2,"Add 5.");
add(8,4,"sequences","geometric",1,"What is the common ratio of 5,15,45,135,...?",["2","3","5","10"],1,"Each term is multiplied by 3.");
add(8,5,"exponential","growth-model",2,"Which model represents 6% annual growth from initial value 500?",["500(1.06)^t","500(0.94)^t","500+1.06t","6(500)^t"],0,"Growth factor is 1+0.06.");
add(8,6,"exponential","decay-interpretation",2,"For P=900(0.8)^t, what percent decrease occurs each period?",["8%","20%","80%","120%"],1,"0.8=1−0.2.");
// U09 Polynomials/factoring — 7
add(9,1,"polynomials","leading-term",1,"What is the leading term of −4x⁵+2x²−7?",["−4x⁵","2x²","−7","5"],0,"Highest-degree term comes first.");
add(9,2,"poly_ops","multiply-monomial",1,"Simplify 3x(2x²−5x+4).",["6x³−15x²+12x","6x²−15x+12","5x³−x²+7x","6x³−5x²+4"],0,"Distribute 3x to each term.");
add(9,3,"poly_ops","binomial-product",2,"Expand (x+4)(x−3).",["x²+x−12","x²−7x−12","x²+x+12","x²−x−12"],0,"x²−3x+4x−12=x²+x−12.");
add(9,4,"factoring","gcf",1,"Factor 12x²−18x.",["6x(2x−3)","3x(4x−6)","6(2x²−3x)","2x(6x−9)"],0,"6x is the greatest common factor.");
add(9,5,"factoring","trinomial",2,"Factor x²+7x+12.",["(x+3)(x+4)","(x−3)(x−4)","(x+2)(x+6)","(x−2)(x−6)"],0,"3+4=7 and 3·4=12.");
add(9,6,"factoring","difference-squares",1,"Factor x²−49.",["(x−7)(x+7)","(x−49)(x+1)","(x−7)²","prime"],0,"Use a²−b²=(a−b)(a+b).");
add(9,7,"zeros","zero-product",2,"Solve (x−2)(x+5)=0.",["x=2 or −5","x=−2 or 5","x=2 only","x=−5 only"],0,"Set each factor equal to zero.");
// U10 Quadratics — 7
add(10,1,"quadratics","opening",1,"For y=3x²−2x+1, the parabola opens:",["up","down","left","right"],0,"Positive leading coefficient means upward.");
add(10,2,"quadratics","vertex-form",1,"Vertex of y=(x+3)²−4?",["(3,−4)","(−3,−4)","(−3,4)","(3,4)"],1,"Vertex form gives h=−3,k=−4.");
add(10,3,"quadratics","zeros",1,"Zeros of y=(x−6)(x+1)?",["6 and −1","−6 and 1","6 and 1","−6 and −1"],0,"Set each factor to zero.");
add(10,4,"quadratics","factor-solve",2,"Solve x²−9x+20=0.",["x=4 or 5","x=−4 or −5","x=2 or 10","x=1 or 20"],0,"Factor (x−4)(x−5).");
add(10,5,"quadratics","square-root",1,"Solve (x−1)²=16.",["x=5 or −3","x=4 or −4","x=17 or −15","x=5 only"],0,"x−1=±4.");
add(10,6,"quadratics","discriminant",2,"For x²+4x+8=0, the discriminant is:",["−16","0","16","48"],0,"16−32=−16.");
add(10,7,"quadratics","optimization",2,"For h(t)=−16t²+48t+2, when is maximum height reached?",["1 s","1.5 s","2 s","3 s"],1,"Vertex time is −48/(2·−16)=1.5.");
// U11 Radicals/rational exponents/coordinate geometry — 7
add(11,1,"radicals","simplify",1,"Simplify √72.",["6√2","8√2","12√2","36√2"],0,"72=36·2.");
add(11,1,"radicals","operations",2,"Simplify 3√5+2√5.",["5√5","5√10","6√5","√25"],0,"Like radicals combine by coefficients.");
add(11,2,"rational_exponents","convert",1,"x^(1/2) is equivalent to:",["x/2","√x","2x","1/x²"],1,"Exponent 1/2 denotes square root.");
add(11,2,"rational_exponents","evaluate",2,"Evaluate 27^(2/3).",["3","6","9","18"],2,"Cube root 27 is 3, then square: 9.");
add(11,3,"coordinate_geometry","distance",2,"Distance between (0,0) and (6,8)?",["7","10","14","100"],1,"√(36+64)=10.");
add(11,4,"coordinate_geometry","midpoint",1,"Midpoint of (−2,4) and (6,10)?",["(2,7)","(4,14)","(2,14)","(8,6)"],0,"Average corresponding coordinates.");
add(11,5,"coordinate_geometry","slope",2,"What is the slope from (−3,1) to (1,9)?",["1/2","2","4","8"],1,"Rise 8 over run 4 gives 2.");
// U12 Statistics/financial math/evidence — 7
add(12,1,"statistics","mean",1,"Mean of 4,7,9,10?",["7","7.5","8","30"],1,"Sum 30 divided by 4 is 7.5.");
add(12,1,"statistics","median",1,"Median of 2,5,8,11,15?",["5","8","11","15"],1,"The middle ordered value is 8.");
add(12,2,"statistics","iqr",2,"If Q1=12 and Q3=27, what is the IQR?",["15","19.5","39","324"],0,"IQR=Q3−Q1=15.");
add(12,3,"statistics","association-causation",2,"A strong association between two variables proves causation:",["always","only with positive slope","not by itself","only for large samples"],2,"Association alone does not establish a causal mechanism.");
add(12,4,"finance","simple-interest",1,"Simple interest on $800 at 5% for 3 years?",["$40","$120","$920","$1,200"],1,"I=Prt=800·0.05·3=120.");
add(12,5,"finance","compound-growth",2,"Which expression gives $1000 growing 4% annually for t years?",["1000(1.04)^t","1000(0.96)^t","1000+4t","1040t"],0,"Annual growth factor is 1.04.");
add(12,6,"evidence","sample-bias",2,"Which sample is most likely biased when estimating school-wide lunch preference?",["randomly select students from every grade","survey only members of the cooking club","use a stratified random sample by grade","randomly choose student IDs"],1,"Cooking-club members may not represent the whole school.");
// U13 Integrated modeling capstone — 8
add(13,1,"modeling","define-variables",1,"What should be done before building an algebraic model of a real situation?",["define relevant quantities and variables","choose the most complicated equation","discard units","assume every relationship is linear"],0,"Clear variables and quantities establish what the model represents.");
add(13,1,"modeling","units",1,"Why should units be tracked through a model?",["They help test whether quantities and results are meaningful","They make every graph linear","They eliminate estimation","They guarantee causation"],0,"Dimensional consistency is an important validity check.");
add(13,2,"model_selection","linear-v-exponential",2,"A quantity increases by about 8% of its current value each year. Which model family is most appropriate?",["linear","exponential","constant","absolute-value only"],1,"Constant percent change indicates exponential behavior.");
add(13,2,"model_selection","quadratic-context",2,"A projectile rises and then falls under a constant-gravity model. Which family commonly models height versus time?",["quadratic","constant","inverse only","piecewise constant"],0,"Projectile height is commonly quadratic in time.");
add(13,3,"constraints","domain-context",2,"A model predicts −4.2 people. What is the strongest interpretation?",["The result may be outside the meaningful domain or require contextual interpretation","Negative people are physically observed","The algebra must always be wrong","Round automatically to −4 people"],0,"Model outputs must be checked against real constraints.");
add(13,4,"validation","residuals",2,"Residuals show a curved pattern around a fitted line. What does this suggest?",["A linear model may be missing structure","The line is necessarily perfect","All observations are errors","The slope must be zero"],0,"Systematic residual structure signals model mismatch.");
add(13,5,"decision_making","assumptions",2,"Two models fit historical data similarly. Which additional factor matters when choosing between them?",["assumptions, domain, interpretability, and intended use","the longer equation automatically wins","the model with more symbols always wins","choose randomly"],0,"Fit is only one component of responsible model selection.");
add(13,6,"communication","claim-evidence",2,"A strong mathematical conclusion should include:",["a claim supported by calculations/evidence and limitations","only the final number","only a graph title","a prediction without assumptions"],0,"Responsible conclusions connect evidence to claims and state limits.");
C.questions=Q;C.question_count=Q.length;C.threshold=80;C.assessment_version="2.0-a-plus-plus-first-draft";
})();