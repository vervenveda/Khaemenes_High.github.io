import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

/* Exercise the actual evaluator score parsers, without learner records. */
const paths=[
 "courses/mathematics/geometry/assets/lesson-tools.js",
 "courses/mathematics/algebra-2/assets/lesson-tools.js"
];
for(const path of paths){
 const source=fs.readFileSync(path,"utf8");
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
 for(const input of [undefined,null,""," "," \t","invalid"]){
  assert.equal(parse(input).allowed,false,path+": blank or invalid input incorrectly accepted");
 }
 for(const [input,n] of [["0",0],["79",79],["80",80],["100",100]]){
  const result=parse(input);
  assert.equal(result.allowed,true,path+": valid input "+input+" rejected");
  assert.equal(result.score,n,path+": numeric interpretation changed");
  assert.equal(result.score>=80,n>=80,path+": mastery threshold error");
 }
 for(const input of ["-1","101","Infinity"]){
  assert.equal(parse(input).allowed,false,path+": out-of-range input accepted");
 }
 console.log("PASS "+path+": empty attempts rejected; 0%, 79%, 80%, 100% and invalid inputs tested");
}
