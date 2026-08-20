import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const courseRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const units=[
  {id:"01",label:"Unit 01",project:"Number Structure Investigation",planner:"number-structure-investigation-planner.html"},
  {id:"02",label:"Unit 02",project:"Signed Data Investigation",planner:"signed-data-investigation-planner.html"}
];

const esc=value=>String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const letter=index=>String.fromCharCode(65+index);
const shellStyle=`<style>.sheet{max-width:8.1in;margin:auto;padding:24px;text-align:left}.student{display:grid;grid-template-columns:2fr 1fr 1fr;gap:14px;margin:16px 0}.line{border-bottom:1px solid #555;height:22px}.directions{padding:10px;border:1px solid #888;border-radius:7px}.problem{break-inside:avoid;margin:16px 0}.work{height:80px;border:1px solid #aaa;border-radius:4px;background:repeating-linear-gradient(0deg,transparent,transparent 22px,#ccc 23px)}.work.tall{height:150px}.actions{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}@page{size:letter;margin:.45in}@media print{header,.actions,footer{display:none!important}body{background:white!important;color:black!important}.sheet{max-width:none;padding:0}.work{background:repeating-linear-gradient(0deg,transparent,transparent 22px,#ccc 23px)!important}}</style>`;

function lessonData(file){
  const source=fs.readFileSync(file,"utf8");
  const match=source.match(/window\.LESSON_DATA=(\{[\s\S]*?\});(?:window\.|<\/script>)/);
  if(!match)throw new Error(`LESSON_DATA not found: ${file}`);
  return JSON.parse(match[1]);
}

function doc(title,body){return `<!doctype html><html lang="en"><head><title>${esc(title)}</title><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="../assets/unit.css">${shellStyle}</head><body>${body}</body></html>`}
function optionLine(q){return q.options.map((choice,index)=>`(${letter(index)}) ${esc(choice)}`).join(" &nbsp;&nbsp; ")}
function worksheet(unit,data,lessonFile,questions){
  const items=questions.map((q,index)=>`<article class="problem"><h3>${index+1}. ${esc(q.prompt)}</h3><p>${optionLine(q)}</p><p>Answer: __________</p><div class="work"></div></article>`).join("");
  return doc(`${unit.label} Lesson ${String(data.number).padStart(2,"0")} Worksheet`,`<main class="sheet"><p>KH Pre-Algebra · ${unit.label} · Student Worksheet</p><h1>Lesson ${String(data.number).padStart(2,"0")} · ${esc(data.title)}</h1><div class="student"><div>Name<div class="line"></div></div><div>Date<div class="line"></div></div><div>Class<div class="line"></div></div></div><div class="directions"><strong>Directions:</strong> Solve all 10 problems. Show calculations, models, number-line reasoning, or explanations where appropriate. Preserve signs and units in contextual problems.</div><div class="actions"><button type="button" onclick="print()">Print</button><a href="../lessons/${esc(lessonFile)}">Return to Lesson</a><a href="index.html">Print Center</a></div>${items}<h2>Reflection</h2><p>Choose one problem and explain how you verified that your answer is reasonable.</p><div class="work tall"></div></main>`);
}

function cumulative(unit,lessons,questions){
  const items=questions.map((item,index)=>`<article class="problem"><h3>${index+1}. ${esc(item.q.prompt)}</h3><p>${optionLine(item.q)}</p><p>Answer: __________</p><div class="work"></div></article>`).join("");
  return doc(`${unit.label} Cumulative Review`,`<main class="sheet"><p>KH Pre-Algebra · ${unit.label} · Cumulative Review</p><h1>${unit.label} Cumulative Review</h1><div class="student"><div>Name<div class="line"></div></div><div>Date<div class="line"></div></div><div>Class<div class="line"></div></div></div><div class="directions"><strong>Directions:</strong> Complete all 20 mixed problems without using the answer key. Show enough reasoning for a teacher or parent to follow your method.</div><div class="actions"><button type="button" onclick="print()">Print</button><a href="index.html">Print Center</a></div>${items}<h2>Readiness Reflection</h2><p>Which lesson is strongest? Which lesson should you review before the mastery check?</p><div class="work tall"></div></main>`);
}

function answerKey(unit,lessonSets,review){
  const lessonSections=lessonSets.map(({data,questions})=>`<section><h2>Lesson ${String(data.number).padStart(2,"0")} · ${esc(data.title)}</h2>${questions.map((q,index)=>`<p><strong>${index+1}.</strong> ${letter(q.answer)} — ${esc(q.options[q.answer])}<br><small>${esc(q.explanation||"The keyed option satisfies the prompt.")}</small></p>`).join("")}</section>`).join("");
  const reviewSection=`<section><h2>Cumulative Review</h2>${review.map((item,index)=>`<p><strong>${index+1}.</strong> ${letter(item.q.answer)} — ${esc(item.q.options[item.q.answer])} <small>(${esc(item.data.title)})</small></p>`).join("")}</section>`;
  return doc(`${unit.label} Printable Answer Key`,`<main class="sheet"><h1>${unit.label} · Printable Answer Key</h1><p>This key is synchronized directly from the lesson question banks. Use explanations to support corrections rather than answer copying.</p><div class="actions"><button type="button" onclick="print()">Print Key</button><a href="../teacher-guide.html">Teacher Guide</a><a href="index.html">Print Center</a></div>${lessonSections}${reviewSection}</main>`);
}

function planner(unit){
  const signed=unit.id==="02";
  const stages=signed?[
    ["1. Question & signed data","Choose a weather, finance, elevation, sports, scientific, or movement question. Define what positive, negative, and zero mean."],
    ["2. Evidence table","Record at least eight signed values with labels, units, and a source or measurement note."],
    ["3. Integer analysis","Order values; find relevant distances, changes, sums, products, or quotients; show calculations."],
    ["4. Coordinate representation","Create or describe an accurate number-line or coordinate-plane representation."],
    ["5. Conclusion & limitations","Answer the question, verify signs and magnitude, and describe assumptions or limits."]
  ]:[
    ["1. Investigation question","Choose a question involving number sets, factors, divisibility, prime structure, GCF/LCM, expressions, or estimation."],
    ["2. Examples & evidence","Collect at least eight carefully chosen numbers or expressions. Explain why each belongs in the investigation."],
    ["3. Structural analysis","Classify, factor, compare, evaluate, or estimate as appropriate. Show a repeatable method."],
    ["4. Verification","Check results using a second strategy, counterexample, exact calculation, or reasonableness estimate."],
    ["5. Conclusion & limitations","State what the evidence supports and what the investigation does not prove."]
  ];
  return doc(`${unit.project} Planner`,`<main class="sheet"><p>KH Pre-Algebra · ${unit.label} · Project Planner</p><h1>${esc(unit.project)}</h1><div class="student"><div>Name<div class="line"></div></div><div>Date<div class="line"></div></div><div>Class<div class="line"></div></div></div><div class="directions"><strong>Purpose:</strong> Plan a defensible mathematical investigation. Preserve units, definitions, calculations, assumptions, and evidence.</div><div class="actions"><button type="button" onclick="print()">Print</button><a href="../projects/${unit.id==="01"?"number-systems-investigation":"signed-data-investigation"}.html">Open Project</a><a href="index.html">Print Center</a></div>${stages.map(([heading,prompt])=>`<section class="problem"><h2>${esc(heading)}</h2><p>${esc(prompt)}</p><div class="work tall"></div></section>`).join("")}</main>`);
}

function printCenter(unit,lessonSets){
  const cards=lessonSets.map(({data})=>`<article class="card"><h3>Lesson ${String(data.number).padStart(2,"0")}</h3><p>${esc(data.title)}</p><a class="btn" href="lesson-${String(data.number).padStart(2,"0")}-worksheet.html">Open Worksheet</a></article>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${unit.label} Print Center</title><link rel="stylesheet" href="../assets/unit.css"></head><body><a class="skip" href="#main">Skip to resources</a><header class="site-header"><div class="wrap header-inner"><a class="brand" href="../"><span class="brand-mark">K</span><span class="brand-copy"><strong>${unit.label.toUpperCase()}</strong><small>Print Center</small></span></a></div></header><main id="main"><section class="hero"><div class="wrap"><p class="eyebrow">Handwriting-Friendly Resources</p><h1>${unit.label} Print Center</h1><p class="lead">${lessonSets.length} lesson worksheets, a 20-question cumulative review, project planner, and synchronized teacher key.</p></div></section><section><div class="wrap grid">${cards}<article class="card"><h3>Cumulative Review</h3><p>Twenty mixed questions across the complete unit.</p><a class="btn" href="unit-${unit.id}-cumulative-review.html">Open Review</a></article><article class="card"><h3>Project Planner</h3><p>${esc(unit.project)}</p><a class="btn" href="${unit.planner}">Open Planner</a></article><article class="card"><h3>Teacher Key</h3><p>Worksheet and cumulative-review answers with explanations.</p><a class="btn" href="teacher-answer-key.html">Open Key</a></article></div></section></main></body></html>`;
}

for(const unit of units){
  const unitRoot=path.join(courseRoot,"units",`unit-${unit.id}`);
  const output=path.join(unitRoot,"worksheets");
  fs.mkdirSync(output,{recursive:true});
  const files=fs.readdirSync(path.join(unitRoot,"lessons")).filter(name=>name.endsWith(".html")).sort();
  const lessonSets=files.map(file=>{
    const data=lessonData(path.join(unitRoot,"lessons",file));
    if(!Array.isArray(data.questions)||data.questions.length<10)throw new Error(`${unit.label} lesson ${data.number} has fewer than 10 questions`);
    const questions=data.questions.slice(0,10);
    fs.writeFileSync(path.join(output,`lesson-${String(data.number).padStart(2,"0")}-worksheet.html`),worksheet(unit,data,file,questions));
    return{data,file,questions};
  });
  const review=[];
  for(let round=0;review.length<20;round++)for(const item of lessonSets){if(review.length>=20)break;const q=item.data.questions[10+round];if(q)review.push({data:item.data,q})}
  fs.writeFileSync(path.join(output,`unit-${unit.id}-cumulative-review.html`),cumulative(unit,lessonSets,review));
  fs.writeFileSync(path.join(output,"teacher-answer-key.html"),answerKey(unit,lessonSets,review));
  fs.writeFileSync(path.join(output,unit.planner),planner(unit));
  fs.writeFileSync(path.join(output,"index.html"),printCenter(unit,lessonSets));
  const indexPath=path.join(unitRoot,"index.html");
  let indexSource=fs.readFileSync(indexPath,"utf8");
  if(!indexSource.includes(`${unit.label} Print Center`)){
    const printSection=`<section><div class="wrap"><article class="card"><p class="eyebrow">Paper Learning</p><h2>${unit.label} Print Center</h2><p>${lessonSets.length} handwriting-friendly lesson worksheets, a cumulative review, project planner, and synchronized teacher answer key.</p><a class="btn primary" href="worksheets/index.html">Open Print Center</a></article></div></section>`;
    indexSource=indexSource.replace(/\s*<\/main>/,`${printSection}</main>`);
  }
  if(unit.id==="02")indexSource=indexSource.replace(/"mastery_threshold":\s*75/g,'"mastery_threshold": 80').replace(/"threshold":\s*75/g,'"threshold": 80');
  fs.writeFileSync(indexPath,indexSource);
  console.log(`${unit.label}: generated ${lessonSets.length+4} print-center files`);
}
