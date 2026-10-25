(()=>{
"use strict";
const bank=[];
const VERSION="unit07-abundant-v1";
function add(id,lesson,difficulty,category,prompt,options,explanation,tag,generatorId,seed){
 bank.push({id,unit:7,lesson,level:difficulty,difficulty,category,prompt,options,answer:0,answer_text:options[0],explanation,misconceptionTag:tag,reviewStatus:"generated-provisional-v1",generatorId,generatorVersion:VERSION,seed});
}
// Lesson 01 · systems as intersections and number of solutions
for(let i=1;i<=5;i++){
 const x=i+1,y=i+2,s=x+y,d=x-y;
 add(`u07-l01-ab-v-${i}`,1,1,"system-verification",`Which ordered pair solves x+y=${s} and x−y=${d}?`,[`(${x},${y})`,`(${y},${x})`,`(${s},${d})`,`(${x+1},${y})`],`Substituting (${x},${y}) makes both equations true.`,"must-satisfy-both-equations","u07-l01-verify-v1",i);
 const m=i+1,b1=i+2,b2=b1+3;
 add(`u07-l01-ab-none-${i}`,1,2,"system-solution-count",`How many solutions do y=${m}x+${b1} and y=${m}x+${b2} have?`,["No solutions","One solution","Infinitely many solutions","Exactly two solutions"],"The lines have the same slope but different intercepts, so they are parallel and never intersect.","parallel-distinct-no-solution","u07-l01-none-v1",i);
 const a=i+2,b=i+1;
 add(`u07-l01-ab-inf-${i}`,1,3,"system-equivalence",`How many solutions do ${a}x+${a}y=${a*b} and x+y=${b} have?`,["Infinitely many solutions","No solutions","One solution","Exactly two solutions"],`Dividing the first equation by ${a} gives x+y=${b}, so both equations describe the same line.`,"equivalent-equations-infinite","u07-l01-infinite-v1",i);
}
// Lesson 02 · graphing systems
for(let i=1;i<=5;i++){
 const x=i,y=i+1,b1=y-x,b2=y+x;
 add(`u07-l02-ab-int-${i}`,2,1,"graph-intersection",`The lines y=x+${b1} and y=−x+${b2} intersect at which point?`,[`(${x},${y})`,`(${y},${x})`,`(${b1},${b2})`,`(${x+1},${y})`],`At x=${x}, both equations give y=${y}; the common point is the system solution.`,"graph-intersection-common-point","u07-l02-intersection-v1",i);
 add(`u07-l02-ab-est-${i}`,2,2,"graph-estimation",`A graph suggests two lines intersect near (2.1, 3.9). What is the best next step when an exact solution matters?`,["Verify or solve the equations algebraically","Round the point and declare it exact","Use only the x-coordinate","Assume every nearby grid point also solves the system"],"Graphing can estimate an intersection; algebraic substitution can verify the exact ordered pair.","graph-estimate-vs-exact","u07-l02-estimate-v1",i);
 const m1=i+1,m2=-(i+2);
 add(`u07-l02-ab-check-${i}`,2,3,"graph-verification",`After graphing y=${m1}x+1 and y=${m2}x+4, which check confirms a proposed intersection (a,b)?`,["Substitute a for x and b for y in both equations","Check the point in only one equation","Compare only the two slopes","Check whether a and b are positive"],"A system solution must satisfy both original equations.","graph-solution-verify-both","u07-l02-check-v1",i);
}
// Lesson 03 · substitution
for(let i=1;i<=5;i++){
 const x=i+1,y=2*x+1,sum=x+y;
 add(`u07-l03-ab-sol-${i}`,3,1,"substitution-solve",`Solve y=2x+1 and x+y=${sum}.`,[`(${x},${y})`,`(${y},${x})`,`(${x+1},${y})`,`(${x},${y+1})`],`Substitute 2x+1 for y: x+2x+1=${sum}, giving x=${x} and y=${y}.`,"substitute-equivalent-expression","u07-l03-solve-v1",i);
 add(`u07-l03-ab-choice-${i}`,3,2,"substitution-choice",`For x=3y−${i} and 2x+y=10, which substitution is most direct?`,[`Replace x in the second equation with 3y−${i}`,`Replace 10 with x`,`Add the equations without aligning terms`,`Divide every term by y`],"Because x is already isolated, substituting its equivalent expression into the other equation is direct.","choose-isolated-variable-substitution","u07-l03-choice-v1",i);
 const k=i+2;
 add(`u07-l03-ab-id-${i}`,3,3,"substitution-special-case",`Substitution in a system simplifies to 0=0 after one equation is replaced by ${k} times the other. What does this indicate?`,["The equations are dependent and may have infinitely many solutions","The system has no solution","There must be exactly one solution","A sign must be reversed"],"An identity such as 0=0 signals consistent dependent equations, which describe the same line.","substitution-identity-meaning","u07-l03-identity-v1",i);
}
// Lesson 04 · elimination
for(let i=1;i<=5;i++){
 const x=i+1,y=i+2,s=x+y,d=x-y;
 add(`u07-l04-ab-elim-${i}`,4,1,"elimination-solve",`Solve x+y=${s} and x−y=${d} by elimination.`,[`(${x},${y})`,`(${y},${x})`,`(${s},${d})`,`(${x+1},${y})`],`Adding the equations eliminates y: 2x=${2*x}, so x=${x}; then y=${y}.`,"elimination-opposite-coefficients","u07-l04-solve-v1",i);
 const a=i+1;
 add(`u07-l04-ab-mult-${i}`,4,2,"elimination-multiplier",`To eliminate x from 2x+3y=7 and ${a}x−y=4, which multiplier on the first equation will make its x-coefficient oppose 2${a}x after doubling the second equation?`,[`−${a}`,String(a),"-2","2"],`Multiplying the first equation by −${a} makes its x-term −${2*a}x, opposite the doubled second equation's +${2*a}x.`,"elimination-multiplier-sign","u07-l04-multiplier-v1",i);
 add(`u07-l04-ab-sign-${i}`,4,3,"elimination-sign",`When multiplying an entire equation by −2 for elimination, what must happen?`,["Every term on both sides is multiplied by −2","Only the target variable term changes sign","Only the constants are doubled","The equality sign becomes an inequality"],"Multiplying an equation by a nonzero constant requires multiplying every term on both sides.","scale-entire-equation","u07-l04-sign-v1",i);
}
// Lesson 05 · systems from contexts
for(let i=1;i<=5;i++){
 const adult=10+i,student=5+i,na=i+2,ns=i+3,total=na+ns,revenue=adult*na+student*ns;
 add(`u07-l05-ab-ticket-${i}`,5,1,"cost-system",`A venue sold ${total} tickets: adult tickets cost $${adult}, student tickets cost $${student}, and revenue was $${revenue}. Which system models adult a and student s tickets?`,[`a+s=${total}; ${adult}a+${student}s=${revenue}`,`a+s=${revenue}; ${adult}a+${student}s=${total}`,`${adult}a+${student}s=${total}; a−s=${revenue}`,`a=s=${total}`],"One equation counts tickets; the other adds their dollar contributions.","context-two-equation-model","u07-l05-ticket-v1",i);
 const liters=10+i,conc=i+2,water=liters-conc;
 add(`u07-l05-ab-mix-${i}`,5,2,"mixture-system",`A mixture has ${liters} L total, made from ${conc} L concentrate and water. Which equation correctly represents the volume constraint?`,[`c+w=${liters}`,`cw=${liters}`,`c−w=${liters}`,`c/w=${liters}`],"Component volumes add to the total volume.","mixture-volume-sum","u07-l05-mixture-v1",i);
 const r1=40+5*i,r2=50+5*i,t=2+i,d1=r1*t,d2=r2*t;
 add(`u07-l05-ab-motion-${i}`,5,3,"motion-system",`Two travelers move for ${t} h at ${r1} km/h and ${r2} km/h. Which quantities should a motion model preserve?`,[`Distances ${d1} km and ${d2} km with consistent time and distance units`,`Speeds added directly to hours`,`Distances measured in km/h`,`Time ignored because both rates are known`],"Use d=rt with compatible units; rate times time produces distance.","motion-units-context","u07-l05-motion-v1",i);
}
// Lesson 06 · systems of linear inequalities
for(let i=1;i<=5;i++){
 const m=i+1,b=i;
 add(`u07-l06-ab-bound-${i}`,6,1,"inequality-boundary",`For y ≥ ${m}x−${b}, how is the boundary line drawn?`,["Solid, because equality is included","Dashed, because equality is included","Solid only when slope is positive","No boundary line is used"],"The ≥ symbol includes points on the boundary, so the line is solid.","included-boundary-solid","u07-l06-boundary-v1",i);
 add(`u07-l06-ab-test-${i}`,6,2,"inequality-test-point",`To decide which side of y < ${m}x+${b} to shade, what is a valid strategy?`,["Test a point not on the boundary and see whether it satisfies the inequality","Always shade above the line","Always shade the side containing the origin without testing","Reverse the inequality because a graph is used"],"A test point determines which half-plane satisfies the inequality.","half-plane-test-point","u07-l06-test-v1",i);
 const x=i,y=i+1;
 add(`u07-l06-ab-feas-${i}`,6,3,"system-inequality-feasible",`A point (${x},${y}) satisfies the first inequality but fails the second. Is it in the system's feasible region?`,["No; a system requires every inequality to hold","Yes; satisfying one condition is enough","Yes, if the first inequality is strict","Only if the point lies on a boundary"],"The solution of a system of inequalities is the overlap where all constraints are satisfied.","feasible-overlap-all-constraints","u07-l06-feasible-v1",i);
}
// Lesson 07 · feasible regions and introductory optimization
for(let i=1;i<=5;i++){
 const a=i+1,b=i+2;
 add(`u07-l07-ab-vert-${i}`,7,1,"optimization-vertices",`For a bounded polygonal feasible region and a linear objective, where should candidate maxima and minima be checked first?`,["At feasible vertices","Only at the origin","At every point on every line by brute force","At infeasible intersections"],"A linear objective on a bounded polygonal feasible region reaches extrema at feasible vertices.","linear-objective-vertices","u07-l07-vertices-v1",i);
 const verts=[[0,0],[2,0],[0,3]],A=i+1,B=i+2,vals=verts.map(([x,y])=>A*x+B*y),mx=Math.max(...vals),winner=verts[vals.indexOf(mx)];
 add(`u07-l07-ab-eval-${i}`,7,2,"objective-evaluation",`For objective P=${A}x+${B}y and feasible vertices (0,0),(2,0),(0,3), which vertex gives the greatest P?`,[`(${winner[0]},${winner[1]})`,"(0,0)",winner[0]===2?"(0,3)":"(2,0)","All vertices tie"],`Evaluate P at each vertex; the largest value is ${mx} at (${winner[0]},${winner[1]}).`,"evaluate-objective-at-vertices","u07-l07-evaluate-v1",i);
 add(`u07-l07-ab-limit-${i}`,7,3,"optimization-limitations",`A feasible region is unbounded. What is the safest conclusion about a proposed maximum of a linear objective?`,["Check whether the objective can increase indefinitely before claiming a maximum","Every unbounded region has a finite maximum","The origin is automatically the maximum","No feasible points can exist"],"An unbounded feasible region may allow the objective to grow without bound; direction and constraints must be analyzed.","unbounded-objective-caution","u07-l07-limit-v1",i);
}
if(bank.length!==105)throw new Error("Unit 07 abundant bank count drift: "+bank.length);
window.KHAE_UNIT07_ABUNDANT_BANK=bank;
})();
