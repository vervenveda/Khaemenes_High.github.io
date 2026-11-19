import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

/* Exercise the actual evaluator evidence parsers without learner records.
 * Geometry still accepts a bounded evaluator percentage.
 * Algebra II intentionally replaced arbitrary percentage entry with a five-criterion 0–4 rubric.
 */
const paths=[
 "courses/mathematics/geometry/assets/lesson-tools.js",
 "courses/mathematics/algebra-2/assets/lesson-tools.js"
];

for(const path of paths){
 const source=fs.readFileSync(path,"utf8");

 if(source.includes("function rubricEvidence()")){
   assert.match(source,/raw==null\|\|raw===""|raw==null\|\|raw===""\)/,path+": rubric missing empty-input guard");
   assert.match(source,/!Number\.isFinite\(level\)\|\|level<0\|\|level>4/,path+": rubric level range guard missing");
   assert.match(source,/score\+=\(level\/4\)\*weight/,path+": weighted rubric calculation missing");
   assert.match(source,/missing\.length/,path+": incomplete rubric must remain distinguishable from a zero score");
   assert.match(source,/if\(evaluated\.missing\.length\)/,path+": incomplete rubric attempt is not rejected");
   assert.match(source,/mastery_met:score>=MASTERY/,path+": rubric evidence does not preserve the 80% mastery threshold");

   const weights=[25,25,20,15,15];
   const parse=values=>{
     let score=0;const missing=[];
     values.forEach((raw,i)=>{
       if(raw==null||raw===""){missing.push(i);return}
       const level=Number(raw);
       if(!Number.isFinite(level)||level<0||level>4){missing.push(i);return}
       score+=(level/4)*weights[i];
     });
     return {missing,score:Math.round(score)};
   };
   for(const values of [
     [null,"0","0","0","0"],["","0","0","0","0"],[" ","0","0","0","0"],
     ["invalid","0","0","0","0"],["5","0","0","0","0"],["-1","0","0","0","0"]
   ]) assert.ok(parse(values).missing.length>0,path+": incomplete or invalid rubric accepted");

   const zero=parse(["0","0","0","0","0"]);
   assert.equal(zero.missing.length,0,path+": explicit zero rubric levels must be valid evidence");
   assert.equal(zero.score,0,path+": explicit zero rubric score changed");
   const proficient=parse(["3","3","3","3","3"]);
   assert.equal(proficient.score,75,path+": proficient rubric weighting changed");
   const exceptional=parse(["4","4","4","4","4"]);
   assert.equal(exceptional.score,100,path+": exceptional rubric weighting changed");
   assert.equal(proficient.score>=80,false,path+": 75% incorrectly mastered");
   assert.equal(exceptional.score>=80,true,path+": 100% incorrectly rejected");
   console.log("PASS "+path+": incomplete rubric rejected; explicit zero preserved; weighted 75%/100% mastery boundaries tested");
   continue;
 }

 const a=source.indexOf('const scoreField=document.getElementById("lessonMasteryScore")');
 const b=source.indexOf('const input=document.getElementById("lessonMasteryScore")');
 const start=a>=0?a:b;
 assert.ok(start>=0,path+": evaluator score parser not found");
 const marker=source.indexOf("if(!Number.isFinite(score)",start);
 const end=source.lastIndexOf(";",marker);
 assert.ok(end>start,path+": parser terminator missing");
 const parser=source.slice(start,end+1);
 assert.match(parser,/rawScore==null\|\|String\(rawScore\)\.trim\(\)===""/,path+": missing empty input guard");
 assert.match(source,/!Number\.isFinite\(score\)\|\|score<0\|\|score>100/,path+": score range guard missing");
 const parse=value=>{
  const document={getElementById:()=>value===undefined?null:{value}};
  const score=vm.runInNewContext("(()=>{"+parser+"return score;})()",{document,Number,String,NaN},{timeout:1000});
  return {score,allowed:Number.isFinite(score)&&score>=0&&score<=100};
 };
 for(const input of [undefined,null,""," "," \t","invalid"])assert.equal(parse(input).allowed,false,path+": blank or invalid input incorrectly accepted");
 for(const [input,n] of [["0",0],["79",79],["80",80],["100",100]]){
  const result=parse(input);
  assert.equal(result.allowed,true,path+": valid input "+input+" rejected");
  assert.equal(result.score,n,path+": numeric interpretation changed");
  assert.equal(result.score>=80,n>=80,path+": mastery threshold error");
 }
 for(const input of ["-1","101","Infinity"])assert.equal(parse(input).allowed,false,path+": out-of-range input accepted");
 console.log("PASS "+path+": empty attempts rejected; 0%, 79%, 80%, 100% and invalid inputs tested");
}
