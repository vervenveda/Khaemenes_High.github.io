(()=>{
"use strict";
const bank=[];
const VERSION="unit13-capstone-depth-v1";
function add(id,lesson,difficulty,category,prompt,options,explanation,tag,seed){
 bank.push({
  id,unit:13,lesson,difficulty,category,prompt,options,answer:0,answer_text:options[0],explanation,
  misconceptionTag:tag,reviewStatus:"generated-provisional-v1",
  generatorId:"a1-u13-capstone-depth",generatorVersion:VERSION,seed,
  capstoneDepth:"quantitative",capstoneSkill:category
 });
}

// Lesson 01 · Frame a complex and ethical modelling question
add("u13-depth-l01-01",1,2,"decision-constraint",
 "A community shuttle model is C=180+3.50r dollars for r riders. If the trip budget is at most $390, what rider count is the largest allowed by the model?",
 ["60 riders","54 riders","66 riders","110 riders"],
 "Solve 180+3.50r≤390: 3.50r≤210, so r≤60. The decision question must preserve the budget constraint and the unit riders.",
 "constraint-model-solve",101);
add("u13-depth-l01-02",1,2,"units-and-rate",
 "An energy model is E=0.75h, where E is kilowatt-hours and h is operating hours. What does the coefficient 0.75 represent?",
 ["0.75 kilowatt-hours per operating hour","0.75 operating hours per kilowatt-hour","0.75 kilowatt-hours total regardless of time","0.75 dollars per hour"],
 "In E=0.75h, the coefficient is the output change per input unit: 0.75 kWh for each operating hour.",
 "rate-unit-interpretation",102);
add("u13-depth-l01-04",1,3,"constraint-window",
 "A water-supply model is V=240−12t liters after t hours. The plan requires at least 156 liters remaining. What is the latest whole hour allowed by the model?",
 ["7 hours","6 hours","8 hours","13 hours"],
 "Solve 240−12t≥156: −12t≥−84, so t≤7. The model therefore allows at most 7 whole hours under the stated safety constraint.",
 "constraint-window-inequality",116);

add("u13-depth-l01-03",1,3,"ethical-threshold",
 "A screening model flags a case when S=12+0.08n exceeds 20, where n is a count of observed events. At what smallest whole-number n does the model begin flagging?",
 ["101","100","99","160"],
 "12+0.08n>20 gives 0.08n>8, so n>100. The smallest whole-number count is 101; a high-impact threshold should then be reviewed for fairness and evidence quality.",
 "threshold-inequality",103);

// Lesson 02 · Choose variables, assumptions, data and representations
add("u13-depth-l02-01",2,2,"model-from-table",
 "A data table contains (x,y)=(0,5),(2,11),(4,17),(6,23). Which equation matches the constant rate in the table?",
 ["y=3x+5","y=6x+5","y=3x+2","y=5x+3"],
 "Every +2 in x produces +6 in y, so slope=6/2=3. Since y=5 when x=0, the model is y=3x+5.",
 "table-to-linear-model",104);
add("u13-depth-l02-02",2,2,"model-family-data",
 "A quantity takes values 100, 120, 144 at equally spaced times. Which model feature is supported by these data?",
 ["A constant multiplicative factor of 1.20","A constant additive change of 20","A constant second difference of 24","A constant value of 120"],
 "120/100=1.20 and 144/120=1.20, so the data support exponential growth with a constant factor 1.20.",
 "difference-vs-ratio-model-choice",105);
add("u13-depth-l02-04",2,3,"quadratic-from-table",
 "A table has x=0,1,2,3 and y=2,5,10,17. Which equation matches all four values?",
 ["y=x²+2x+2","y=3x+2","y=2x²+3","y=2(2^x)"],
 "The first differences are 3,5,7 and the second differences are constant at 2. Substitution confirms y=x²+2x+2 for all four inputs.",
 "table-to-quadratic-model",117);

add("u13-depth-l02-03",2,3,"competing-models-break-even",
 "Two cost models are A=25+4h and B=10+6h. At what h do the models predict the same cost?",
 ["h=7.5","h=5","h=15","h=17.5"],
 "Set 25+4h=10+6h. Then 15=2h, so h=7.5. This is the break-even input for comparing the two models.",
 "model-break-even",106);

// Lesson 03 · Build, calculate, validate and revise
add("u13-depth-l03-01",3,2,"build-and-predict",
 "A linear model passes through (4,18) and (10,42). Using that model, what value is predicted at x=15?",
 ["62","60","58","72"],
 "Slope=(42−18)/(10−4)=24/6=4. Using 18=4(4)+b gives b=2, so y=4x+2 and y(15)=62.",
 "two-point-model-prediction",107);
add("u13-depth-l03-02",3,3,"exponential-prediction",
 "A population model is P=500(1.08)^t. What does it predict after 2 time periods?",
 ["583.2","540","580","630"],
 "P=500(1.08)^2=500(1.1664)=583.2.",
 "exponential-multistep-evaluation",108);
add("u13-depth-l03-04",3,3,"break-even-system",
 "A project has cost C=200+5x and revenue R=9x. At what x do the models break even?",
 ["50","25","40","100"],
 "Break-even occurs when cost equals revenue: 200+5x=9x, so 200=4x and x=50.",
 "linear-system-break-even",118);

add("u13-depth-l03-03",3,3,"quadratic-optimization",
 "A height model is h(t)=−5t²+20t+1. What maximum height does the model predict?",
 ["21","20","16","41"],
 "The vertex occurs at t=−20/(2·−5)=2. Then h(2)=−5(4)+40+1=21.",
 "quadratic-vertex-output",109);

// Lesson 04 · Test sensitivity, uncertainty and fairness
add("u13-depth-l04-01",4,2,"sensitivity-calculation",
 "For C=100+8x, the baseline input is x=20. If x rises to 23, how much does the model output increase?",
 ["24","3","8","184"],
 "C(20)=260 and C(23)=284, so the output increases by 24. Equivalently, slope 8 times input change 3 gives 24.",
 "sensitivity-output-change",110);
add("u13-depth-l04-02",4,3,"uncertainty-propagation",
 "A measured input is x=12±0.5 and the model is y=4x+7. Using the endpoint method, what output interval results?",
 ["53 to 57","54.5 to 55.5","48 to 52","55 to 59"],
 "The input interval is 11.5 to 12.5. Evaluating y=4x+7 gives 53 to 57.",
 "linear-uncertainty-propagation",111);
add("u13-depth-l04-04",4,3,"assumption-sensitivity",
 "A baseline model is P=80(1.05)^2. A revised assumption uses 7% growth, P=80(1.07)^2. About how much larger is the revised prediction?",
 ["3.39","1.60","8.00","11.44"],
 "Baseline P=88.20. Revised P=91.592. The increase is 91.592−88.20=3.392, about 3.39.",
 "growth-assumption-sensitivity",119);

add("u13-depth-l04-03",4,3,"fairness-error-comparison",
 "Absolute prediction errors for Group A are 2,4,6 and for Group B are 1,8,9. What is the difference between the groups' mean absolute errors?",
 ["2","4","6","8"],
 "Group A MAE=(2+4+6)/3=4. Group B MAE=(1+8+9)/3=6. The difference is 2, which warrants investigation of unequal model performance.",
 "group-mae-comparison",112);

// Lesson 05 · Present, defend and reflect
add("u13-depth-l05-01",5,3,"validation-model-comparison",
 "On the same holdout cases, Model A residuals are −2,1,3,−2 and Model B residuals are −1,5,−4,6. Which model has the lower mean absolute error, and what is it?",
 ["Model A, MAE 2","Model B, MAE 2","Model A, MAE 4","Model B, MAE 4"],
 "Model A absolute errors sum to 8, so MAE=2. Model B absolute errors sum to 16, so MAE=4. Model A performs better by this measure.",
 "holdout-mae-comparison",113);
add("u13-depth-l05-02",5,3,"decision-threshold",
 "A recommendation is issued only when predicted savings S=120−8m are at least $40. What is the largest m that still meets the recommendation rule?",
 ["10","9","11","20"],
 "Solve 120−8m≥40: −8m≥−80, so m≤10. The recommendation changes once m exceeds 10.",
 "decision-threshold-inequality",114);
add("u13-depth-l05-04",5,3,"holdout-error-comparison",
 "Actual holdout values are 22,29,44. Model A predicts 20,30,40; Model B predicts 23,33,41. Which model has the lower mean absolute error?",
 ["Model A, MAE about 2.33","Model B, MAE about 2.33","Model A, MAE about 2.67","Model B, MAE about 2.67"],
 "Model A absolute errors are 2,1,4, giving MAE=7/3≈2.33. Model B errors are 1,4,3, giving MAE=8/3≈2.67.",
 "holdout-error-comparison",120);

add("u13-depth-l05-03",5,3,"uncertainty-communication",
 "Three defensible scenarios predict 480, 520, and 560 units. If 520 is used as the central scenario, which concise uncertainty statement matches the scenario spread?",
 ["520 ±40 units across the tested scenarios","520 ±80 units across the tested scenarios","480 ±40 units across the tested scenarios","560 ±40 units across the tested scenarios"],
 "The tested range is 480 to 560, which is 40 below and 40 above the central value 520.",
 "scenario-uncertainty-communication",115);

if(bank.length!==20)throw new Error("Unit 13 capstone depth bank count drift: "+bank.length);
window.ALGEBRA1_UNIT13_CAPSTONE_DEPTH=Object.freeze(bank);
window.ALGEBRA1_UNIT13_CAPSTONE_META=Object.freeze({
 version:VERSION,
 itemCount:20,
 targetEligible:80,
 delivered:20,
 quantitativeMinimumPerForm:10,
 lessonQuantitativeMinimum:Object.freeze({1:2,2:2,3:2,4:2,5:2})
});
})();
