/* Khaemenes Algebra I · Unit 02 Content Rebuild
   35 unique questions · 5 per lesson. Preserves q0031–q0065.
*/
(()=>{"use strict";
const rows=[
[1,"In 7x²−3x+9, what is the coefficient of x²?",["7","−3","9","2"],0,"7","The coefficient multiplying x² is 7.","structure",1],
[1,"What is the degree of 4x³−2x+8?",["1","2","3","4"],2,"3","The highest exponent is 3.","degree",1],
[1,"Which expression has three terms?",["5x","x+4","x²+3x−7","2(x+1)"],2,"x²+3x−7","Terms are separated by addition or subtraction.","terms",1],
[1,"In −6ab², which list gives the numerical coefficient and variables?",["−6; a,b","6; a,b²","−6; ab²,2","−1;6,a,b"],0,"−6; a,b","The numerical coefficient is −6; a and b are variables.","structure",2],
[1,"Which is a constant term?",["4x","−9","2y²","ab"],1,"−9","A constant has no variable factor.","terms",1],
[2,"Evaluate 3x²−2 when x=−2.",["−14","10","14","6"],1,"10","3(−2)²−2=12−2=10.","substitution",2],
[2,"If A=lw, find A when l=7 and w=4.",["11","21","28","49"],2,"28","Substitute into A=lw: 7·4=28.","formula",1],
[2,"Evaluate 2a−3b for a=5 and b=−2.",["4","16","−4","10"],1,"16","2(5)−3(−2)=10+6=16.","substitution",2],
[2,"The formula d=rt models distance. What is d for r=55 and t=3?",["58","165","18.3","110"],1,"165","d=55·3=165.","formula",1],
[2,"Evaluate (m+n)/2 for m=7 and n=13.",["5","10","20","40"],1,"10","(7+13)/2=10.","substitution",1],
[3,"Which property justifies 4(x+3)=4x+12?",["commutative","associative","distributive","identity"],2,"distributive","The factor 4 multiplies both terms inside the parentheses.","properties",1],
[3,"Which expression is equivalent to 3x+5x?",["8x","15x²","8x²","15x"],0,"8x","Like terms combine by adding coefficients.","equivalence",1],
[3,"Which statement illustrates the commutative property of multiplication?",["a(b+c)=ab+ac","ab=ba","a·1=a","(ab)c=a(bc)"],1,"ab=ba","Commutative means order may be reversed.","properties",1],
[3,"Why are 2(x+5) and 2x+10 equivalent?",["They have the same value for every x","They look similar","They have equal numbers of symbols","x must equal 5"],0,"They have the same value for every x","Equivalent expressions agree for every allowed input.","equivalence",2],
[3,"Which is NOT equivalent to x+x+x?",["3x","x+2x","x³","2x+x"],2,"x³","Repeated addition gives 3x, not x³.","equivalence",2],
[4,"Simplify 5x+3−2x+8.",["3x+11","7x+11","3x+5","7x+5"],0,"3x+11","Combine variable terms and constants separately.","combine_like_terms",1],
[4,"Expand −3(2x−5).",["−6x−15","−6x+15","6x−15","6x+15"],1,"−6x+15","Distribute −3 to both terms.","distribution",2],
[4,"Simplify 4(2x+1)−3x.",["5x+4","8x+1","11x+4","5x+1"],0,"5x+4","Distribute first: 8x+4−3x=5x+4.","distribution",2],
[4,"Which pair consists of like terms?",["3x and 3x²","4ab and −7ab","5x and 5y","2 and 2x"],1,"4ab and −7ab","Like terms have identical variable parts.","combine_like_terms",1],
[4,"A student simplifies 2(x+4) as 2x+4. What was missed?",["combining constants","distributing 2 to the 4","changing x to 2x","factoring a GCF"],1,"distributing 2 to the 4","The 2 must multiply every term inside the parentheses.","error_analysis",2],
[5,"Classify 6x⁴ as a polynomial by number of terms.",["monomial","binomial","trinomial","not a polynomial"],0,"monomial","It contains one term.","classification",1],
[5,"What is the degree of 2x⁵−x²+4?",["2","3","4","5"],3,"5","The greatest exponent is 5.","degree",1],
[5,"Which is a binomial?",["x²+4x","3x²+x−1","7x³","x²+x+1+x⁴"],0,"x²+4x","A binomial has exactly two terms.","classification",1],
[5,"Which expression is NOT a polynomial in x?",["3x²−1","x⁻¹+2","5","√2x+3"],1,"x⁻¹+2","Polynomial exponents on variables must be nonnegative integers.","classification",2],
[5,"Write 4−2x³+x in standard form.",["4+x−2x³","−2x³+x+4","x+4−2x³","−2x+x³+4"],1,"−2x³+x+4","Standard form orders terms by descending exponent.","structure",2],
[6,"Add (3x²+2x−5)+(x²−7x+4).",["4x²−5x−1","4x²+9x−1","2x²−5x+9","3x⁴−5x−1"],0,"4x²−5x−1","Combine corresponding like terms.","add_polynomials",2],
[6,"Subtract (2x²−3x+1) from (5x²+x−4).",["3x²−2x−3","3x²+4x−5","7x²−2x−3","3x²+4x−3"],1,"3x²+4x−5","Distribute the subtraction: 5x²+x−4−2x²+3x−1.","subtract_polynomials",2],
[6,"What is the sum of 4x−9 and −6x+2?",["−2x−7","10x−7","−2x+11","10x+11"],0,"−2x−7","4x−6x=−2x and −9+2=−7.","add_polynomials",1],
[6,"Which step is essential when subtracting a polynomial in parentheses?",["square every term","change the sign of every term being subtracted","combine unlike terms","drop all constants"],1,"change the sign of every term being subtracted","Subtracting a polynomial means distributing −1 to all of its terms.","subtract_polynomials",2],
[6,"If P=x²+3x and Q=2x²−x+5, find P+Q.",["3x²+2x+5","3x²+4x+5","x²+2x+5","2x⁴+2x+5"],0,"3x²+2x+5","Add like terms by degree.","add_polynomials",2],
[7,"Multiply 3x²·(−4x³).",["−12x⁵","−12x⁶","−x⁵","12x⁵"],0,"−12x⁵","Multiply coefficients and add exponents of like bases.","monomial_product",1],
[7,"Factor the GCF from 12x³+18x².",["6x²(2x+3)","3x(4x²+6x)","6x(2x²+3x)","2x²(6x+9)"],0,"6x²(2x+3)","The greatest common numerical factor is 6 and common variable factor is x².","gcf_factoring",2],
[7,"What is the GCF of 20a³b² and 30a²b⁴?",["5ab","10a²b²","10a³b⁴","20a²b²"],1,"10a²b²","Use the GCF of coefficients and the smaller exponent of each shared variable.","gcf",2],
[7,"Which expression is completely factored by GCF?",["8x²+12x=4x(2x+3)","8x²+12x=2x(4x+6)","8x²+12x=4(2x²+3x)","8x²+12x=x(8x+12)"],0,"8x²+12x=4x(2x+3)","4x is the greatest common factor.","gcf_factoring",2],
[7,"A rectangle has area 15x²+10x. If one side is 5x, what is the other side?",["3x+2","10x+5","3x²+2x","5x+2"],0,"3x+2","Factor 5x from the area: 5x(3x+2).","application_factoring",2]
];
const rebuilt=rows.map((r,i)=>({prompt:r[1],options:r[2],answer:r[3],answer_text:r[4],explanation:r[5],unit:2,lesson:r[0],category:r[6],difficulty:r[7],id:`q${String(31+i).padStart(4,"0")}`}));
if(!Array.isArray(window.ALGEBRA1_QUESTIONS))return;
window.ALGEBRA1_QUESTIONS=window.ALGEBRA1_QUESTIONS.filter(q=>Number(q.unit)!==2).concat(rebuilt);
})();