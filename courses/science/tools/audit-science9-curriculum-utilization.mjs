import fs from "node:fs";
import path from "node:path";

const root="courses/science/integrated-science-9";
const lessonFiles=[];
for(let d=1;d<=5;d++)lessonFiles.push(path.join(root,"diagnostic","lessons","day-"+String(d).padStart(2,"0")+".html"));
for(let u=1;u<=12;u++){
 const max=u===1?10:15;
 for(let d=1;d<=max;d++)lessonFiles.push(path.join(root,"units","unit-"+String(u).padStart(2,"0"),"lessons","day-"+String(d).padStart(2,"0")+".html"));
}
const read=p=>fs.readFileSync(p,"utf8");
const strip=s=>s
 .replace(/<!--[\s\S]*?-->/g," ")
 .replace(/<script[\s\S]*?<\/script>/gi," ")
 .replace(/<style[\s\S]*?<\/style>/gi," ")
 .replace(/<template[\s\S]*?<\/template>/gi," ")
 .replace(/<noscript[\s\S]*?<\/noscript>/gi," ")
 .replace(/<[^>]+>/g," ")
 .replace(/&(?:[a-z]+|#\d+);/gi," ")
 .replace(/\s+/g," ").trim();
const flags=(h)=>({
 engine:/science-lesson-engine-v0\.1\.js|data-science-engine=/.test(h),
 essential:/Essential question/i.test(h),
 objectives:/Learning objectives|Daily objective|Objective:/i.test(h),
 phenomenon:/Phenomenon|Notice\/Wonder|Observe|observation/i.test(h),
 vocab:/Vocabulary/i.test(h),
 worked:/Worked (?:reasoning )?example|Worked example/i.test(h),
 quantitative:/graph|table|mean|range|percent|unit\b|calculation|quantitative|equation/i.test(h),
 investigation:/investigation|lab(?:oratory)?|variables?|controls?|method|dataset|simulation/i.test(h),
 misconception:/Misconception/i.test(h),
 formative:/Exit check|Formative|self-check|practice check|understanding check/i.test(h),
 retrieval:/Retrieval|spiral review|from memory/i.test(h),
 cer:/\bCER\b|Claim.{0,40}Evidence.{0,40}Reasoning|constructed explanation|scientific explanation/i.test(h),
 evidence:/Portfolio evidence|evidence workspace|preserve learning evidence|student evidence/i.test(h),
 safety:/Safety|hazard|home-safe|supervision/i.test(h),
 standards:/NGSS|\bSEP\b|crosscutting|framework_tags|standard/i.test(h),
 mentor:/Mentor|Archaemenes/i.test(h),
 differentiation:/Foundation|Core|Extended|Choose your pathway/i.test(h),
 source:/source attribution|citation|source dossier|references?|credible source/i.test(h),
 teacher:/Teacher guidance|teacher note|parent note|educator/i.test(h)
});
const records=[];
for(const file of lessonFiles){
 if(!fs.existsSync(file)){records.push({file,missing:true});continue}
 const h=read(file),plain=strip(h),f=flags(h);
 const unit=file.includes("/diagnostic/")?"00":file.match(/unit-(\d\d)/)?.[1]||"??";
 records.push({file,unit,words:plain?plain.split(/\s+/).length:0,...f});
}
const featureNames=["engine","essential","objectives","phenomenon","vocab","worked","quantitative","investigation","misconception","formative","retrieval","cer","evidence","safety","standards","mentor","differentiation","source","teacher"];
const grouped={};
for(const r of records.filter(x=>!x.missing)){
 const g=grouped[r.unit]??={count:0,words:0,minWords:Infinity,maxWords:0,under500:0};
 g.count++;g.words+=r.words;g.minWords=Math.min(g.minWords,r.words);g.maxWords=Math.max(g.maxWords,r.words);g.under500+=r.words<500;
 for(const k of featureNames)g[k]=(g[k]||0)+(r[k]?1:0);
}
for(const g of Object.values(grouped))g.avgWords=Math.round(g.words/g.count);
const courseMap=JSON.parse(read(path.join(root,"course-map.json")));
const emptyObjectiveUnits=courseMap.units.filter(u=>!Array.isArray(u.objectives)||u.objectives.length===0).map(u=>u.id);
const emptyFrameworkUnits=courseMap.units.filter(u=>!Array.isArray(u.framework_tags)||u.framework_tags.length===0).map(u=>u.id);
const thin=records.filter(r=>!r.missing&&r.words<500).sort((a,b)=>a.words-b.words).slice(0,40).map(r=>({file:r.file,words:r.words}));
const engineMounted=records.filter(r=>r.engine).map(r=>r.file);
const totals={count:records.filter(r=>!r.missing).length};
for(const k of featureNames)totals[k]=records.filter(r=>!r.missing&&r[k]).length;
totals.avgWords=Math.round(records.filter(r=>!r.missing).reduce((n,r)=>n+r.words,0)/totals.count);
const utilization={
 engineMounted:engineMounted.length,
 engineCoveragePercent:Number((engineMounted.length/totals.count*100).toFixed(1)),
 fullEngineUtilization:engineMounted.length===totals.count,
 curriculumRichButNotEngineMounted:records.filter(r=>!r.missing&&!r.engine&&r.objectives&&r.quantitative&&r.investigation&&r.evidence).length
};
const missing=records.filter(r=>r.missing).map(r=>r.file);
console.log(JSON.stringify({
 expectedDailyDestinations:180,
 actualDailyDestinations:records.length-missing.length,
 missing,
 engineMountedCount:engineMounted.length,
 engineMounted,
 emptyObjectiveUnits,
 emptyFrameworkUnits,
 totals,
 utilization,
 grouped,
 thinnestLessons:thin
},null,2));
if(missing.length)process.exitCode=1;
if(records.length-missing.length!==180)process.exitCode=1;
