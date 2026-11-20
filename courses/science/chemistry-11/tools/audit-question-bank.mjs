#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const bankPath=path.resolve(here,"..","question-bank.js");
const raw=fs.readFileSync(bankPath,"utf8");
const match=raw.match(/=\s*(\[[\s\S]*\]);?\s*$/);
if(!match) throw new Error("Could not parse Chemistry 11 question bank assignment.");
const bank=JSON.parse(match[1]);
const failures=[];
const warnings=[];
const ids=new Set();
const prompts=new Map();
const templates=new Map();

const norm=s=>String(s??"").toLowerCase().replace(/\s+/gu," ").trim();
const template=s=>String(s??"").toLowerCase()
  .replace(/\b\d+(?:\.\d+)?\b/g,"#")
  .replace(/[^\p{L}\p{N}#]+/gu," ").trim().split(" ").slice(0,8).join(" ");

for(const q of bank){
  if(!q.id||ids.has(q.id)) failures.push(`duplicate/missing id: ${q.id||"(missing)"}`);
  ids.add(q.id);
  const p=norm(q.prompt);
  if(!p) failures.push(`missing prompt: ${q.id}`);
  if(prompts.has(p)) failures.push(`duplicate prompt: ${prompts.get(p)} / ${q.id}`);
  prompts.set(p,q.id);
  if(!Array.isArray(q.options)||q.options.length<2) failures.push(`invalid options: ${q.id}`);
  else {
    const opts=q.options.map(norm);
    if(new Set(opts).size!==opts.length) failures.push(`duplicate option text: ${q.id}`);
    if(q.options.some(o=>/[₂₃₄₅₆₇₈₉]{2,}/.test(String(o)))) failures.push(`malformed consecutive subscripts: ${q.id}`);
  }
  if(!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length) failures.push(`invalid answer index: ${q.id}`);
  if(!String(q.explanation??"").trim()) failures.push(`missing explanation: ${q.id}`);
  if(!Number.isInteger(q.week)||q.week<1||q.week>36) failures.push(`invalid week tag: ${q.id}`);
  if(!String(q.source??"").trim()) failures.push(`missing source tag: ${q.id}`);
  if(!String(q.type??"").trim()) failures.push(`missing type tag: ${q.id}`);
  const t=template(q.prompt);
  if(t){if(!templates.has(t))templates.set(t,[]);templates.get(t).push(q.id);}
}
for(const [t,group] of templates) if(group.length>=7) warnings.push(`template family ${group.length}×: ${t} [${group.join(", ")}]`);

const mapPath=path.resolve(here,"..","assessment-misconceptions-v1.json");
let misconceptionSummary=null;
if(fs.existsSync(mapPath)){
  const map=JSON.parse(fs.readFileSync(mapPath,"utf8"));
  const byId=new Map(bank.map(q=>[String(q.id),q]));
  let rationaleCount=0;
  for(const rec of Object.values(map.items||{})){
    const q=byId.get(String(rec.itemId));
    if(!q){failures.push(`misconception map item missing from bank: ${rec.itemId}`);continue}
    if(rec.reviewStatus!=="reviewed-v1")failures.push(`misconception map reviewStatus invalid: ${rec.itemId}`);
    if(rec.prompt!==q.prompt)failures.push(`misconception map prompt drift: ${rec.itemId}`);
    if(Number(rec.answerIndex)!==Number(q.answer))failures.push(`misconception map answer drift: ${rec.itemId}`);
    if(rec.correctRationale!==q.explanation)failures.push(`misconception map explanation drift: ${rec.itemId}`);
    const ds=Array.isArray(rec.distractors)?rec.distractors:[];
    rationaleCount+=ds.length;
    const expected=q.options.map((_,i)=>i).filter(i=>i!==q.answer).sort((a,b)=>a-b);
    const actual=ds.map(d=>Number(d.optionIndex)).sort((a,b)=>a-b);
    if(JSON.stringify(expected)!==JSON.stringify(actual))failures.push(`misconception map distractor coverage invalid: ${rec.itemId}`);
    for(const d of ds){
      const i=Number(d.optionIndex);
      if(q.options[i]!==d.optionText)failures.push(`misconception map option drift: ${rec.itemId} option ${i}`);
      if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(d.misconceptionTag||"")))failures.push(`misconception tag invalid: ${rec.itemId} option ${i}`);
      if(String(d.rationale||"").trim().length<24)failures.push(`misconception rationale too thin: ${rec.itemId} option ${i}`);
    }
  }
  const reviewed=Object.keys(map.items||{}).length;
  if(map.distractorMappingRequired===true&&reviewed!==bank.length)failures.push(`required misconception mapping covers ${reviewed}/${bank.length} public items`);
  misconceptionSummary={reviewed,rationaleCount,coveragePct:Number((100*reviewed/bank.length).toFixed(1))};
}



// Assessment-quality and retention regressions.
const answerCounts=[0,0,0,0];
const typeCounts={concept:0,quantitative:0,evidence:0,model:0};
const ordinaryWeeks=[...Array(17)].map((_,i)=>i+1).concat([...Array(17)].map((_,i)=>i+19));
for(const q of bank){
  if(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4)answerCounts[q.answer]++;
  if(Object.prototype.hasOwnProperty.call(typeCounts,q.type))typeCounts[q.type]++;
}
const answerSpread=Math.max(...answerCounts)-Math.min(...answerCounts);
if(answerCounts.some(n=>n===0))failures.push(`answer positions are not represented across all four choices: ${answerCounts.join("/")}`);
if(answerSpread>4)failures.push(`answer-position distribution is too uneven: ${answerCounts.join("/")}`);
for(const week of ordinaryWeeks){
  const rows=bank.filter(q=>q.week===week);
  if(rows.length<8)failures.push(`Week ${week} has only ${rows.length} public practice items; expected at least 8`);
  if(!rows.some(q=>["quantitative","evidence","model"].includes(q.type)))failures.push(`Week ${week} lacks quantitative/evidence/model reasoning`);
}
const quantitativeShare=typeCounts.quantitative/bank.length;
const reasoningShare=(typeCounts.evidence+typeCounts.model)/bank.length;
if(quantitativeShare<0.35||quantitativeShare>0.65)failures.push(`quantitative item share outside 35–65%: ${(100*quantitativeShare).toFixed(1)}%`);
if(reasoningShare<0.25)failures.push(`evidence+model share below 25%: ${(100*reasoningShare).toFixed(1)}%`);

const preferred=bank.filter(q=>!String(q.id).startsWith("legacy-"));
const requirements={
 "U0":{quantitative:2,evidence:1,model:1},
 "U1":{concept:2,quantitative:5,evidence:1,model:1},
 "U2":{concept:2,quantitative:5,evidence:1,model:1},
 "U3":{concept:2,quantitative:5,evidence:1,model:1},
 "U4":{concept:2,quantitative:5,evidence:1,model:1},
 "U5":{concept:1,quantitative:2,evidence:1,model:1},
 "U6":{concept:1,quantitative:2,evidence:1,model:1},
 "U7":{concept:1,quantitative:2,evidence:1,model:1},
 "U8":{concept:1,quantitative:1,evidence:1,model:1},
 "U9":{concept:1,quantitative:2,evidence:1,model:1},
 "CAP":{concept:1,evidence:1,model:1}
};
for(const [unit,req] of Object.entries(requirements)){
  for(const [type,min] of Object.entries(req)){
    const have=preferred.filter(q=>q.unit===unit&&q.type===type).length;
    if(have<min)failures.push(`modern assessment pool lacks ${unit} ${type}: ${have}/${min}`);
  }
}

const indexPath=path.resolve(here,"..","index.html");
const indexHtml=fs.readFileSync(indexPath,"utf8");
if(!/const distances=\[1,3,6,10\]/.test(indexHtml))failures.push("spaced-retention intervals 1/3/6/10 missing from Chemistry dashboard");
if(!/retentionHistory/.test(indexHtml)||!/scoreRetention/.test(indexHtml))failures.push("scored retention-history engine missing from Chemistry dashboard");
if(!/does not set or change the reviewed weekly mastery score/.test(indexHtml)||!/does not set weekly mastery/.test(indexHtml))failures.push("retention/mastery separation language missing");
if(!/filter\(q=>!String\(q\.id\|\|""\)\.startsWith\("legacy-"\)\)/.test(indexHtml))failures.push("practice assessment must exclude retired legacy concept pool");

console.log(`Chemistry 11 question-bank audit: ${bank.length} items`);
if(misconceptionSummary)console.log(`Misconception map: ${misconceptionSummary.reviewed}/${bank.length} reviewed items (${misconceptionSummary.coveragePct}%) · ${misconceptionSummary.rationaleCount} distractor rationales`);
if(warnings.length){console.log("\nWarnings:");warnings.forEach(x=>console.log(" - "+x));}
if(failures.length){
  console.error("\nFAIL:");
  failures.forEach(x=>console.error(" - "+x));
  process.exit(1);
}
console.log("\nPASS: IDs, prompts, options, answer keys, explanations, week/source/type tags, and chemical-subscript formatting are valid.");
