import fs from "node:fs";
import vm from "node:vm";

const root=new URL("../units/",import.meta.url);
let total=0;
const findings=[];
for(let u=7;u<=9;u++){
  const n=String(u).padStart(2,"0");
  const relative="unit-"+n+"/question-bank.js";
  const source=fs.readFileSync(new URL(relative,root),"utf8");
  new vm.Script(source,{filename:relative});
  const match=source.match(/window\.KhaemenesScience9QuestionBanks\["unit-\d{2}"\]\s*=\s*(\[[\s\S]*\])\s*;?\s*$/);
  if(!match)throw Error(relative+" canonical shared bank missing");
  const rows=JSON.parse(match[1]);
  if(rows.length<50)throw Error(relative+" requires at least 50 bank items; found "+rows.length);
  total+=rows.length;
  const ids=new Set(),prompts=new Set();
  const sourceGroups={quiz:[],assessment:[]};
  for(const [index,q] of rows.entries()){
    const label=q?.id||("row "+(index+1));
    if(!q||typeof q!=="object"||Array.isArray(q))throw Error(relative+" malformed item "+label);
    if(typeof q.id!=="string"||!q.id.trim()||ids.has(q.id))throw Error(relative+" duplicate or missing ID "+label);
    ids.add(q.id);
    const prompt=String(q.prompt||"").trim().toLowerCase().replace(/\s+/g," ");
    if(!prompt||prompts.has(prompt))throw Error(relative+" duplicate or missing prompt "+label);
    prompts.add(prompt);
    if(!Array.isArray(q.options)||q.options.length!==4||q.options.some(option=>typeof option!=="string"||!option.trim()))throw Error(relative+" requires four non-empty options for "+label);
    if(!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length)throw Error(relative+" invalid answer index "+label);
    if(typeof q.explanation!=="string"||!q.explanation.trim())throw Error(relative+" missing explanation "+label);
    if(!sourceGroups[q.source])throw Error(relative+" unknown source class "+label);
    const optionKeys=q.options.map(option=>String(option).normalize("NFKC").replace(/\s+/g," ").trim());
    if(new Set(optionKeys).size!==optionKeys.length)throw Error(relative+" duplicate option text "+label);
    sourceGroups[q.source].push(q);
  }
  for(const sourceClass of ["quiz","assessment"]){
    const group=sourceGroups[sourceClass];
    const minimum=sourceClass==="quiz"?20:30;
    if(group.length<minimum)throw Error(relative+" "+sourceClass+" bank below minimum "+minimum);
    const positions=[0,0,0,0];
    group.forEach(q=>positions[q.answer]++);
    if(Math.max(...positions)-Math.min(...positions)>1){
      throw Error(relative+" "+sourceClass+" correct-answer positions are imbalanced: "+positions.join("/"));
    }
    console.log("PASS "+relative+" "+sourceClass+" "+group.length+" items; answer positions "+positions.join("/"));
  }
}
if(total<150)throw Error("Units 07–09 combined question-bank coverage below minimum");
console.log("PASS Units 07–09 canonical shared-bank quality: "+total+" questions, answer positions balanced by source class.");
