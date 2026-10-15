import fs from "node:fs";import vm from "node:vm";
const root=new URL("../units/",import.meta.url);
for(let u=1;u<=3;u++)for(const file of ["quiz-app.js","assessment-app.js"]){
 const n=String(u).padStart(2,"0"),p="unit-"+n+"/"+file,s=fs.readFileSync(new URL(p,root),"utf8");
 new vm.Script(s,{filename:p});
 const name=u===3?(file==="quiz-app.js"?"QUIZ":"ASSESS"):(file==="quiz-app.js"?"QUIZ_QUESTIONS":"ASSESSMENT_QUESTIONS");
 const start=s.indexOf("const "+name+"=[");
 if(start<0)throw Error(p+" bank missing");
 const from=start+("const "+name+"=").length,stop=s.indexOf("];",from);
 if(stop<0)throw Error(p+" bank terminator missing");
 const bank=vm.runInNewContext(s.slice(from,stop+1),{},{timeout:1000});
 const counts=[0,0,0,0],expected=u===1?(file==="quiz-app.js"?15:24):(file==="quiz-app.js"?20:30);
 if(bank.length!==expected)throw Error(p+" unexpected count "+bank.length);
 for(const item of bank){
  if(!Array.isArray(item.options)||item.options.length!==4||!Number.isInteger(item.answer)||item.answer<0||item.answer>3||!item.options[item.answer])throw Error(p+" malformed answer");
  counts[item.answer]++;
 }
 if(Math.max(...counts)-Math.min(...counts)>1)throw Error(p+" biased answer placement: "+counts.join(","));
 console.log("PASS "+p+": "+bank.length+" questions; answers "+counts.join("/"));
}
