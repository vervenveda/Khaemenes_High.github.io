import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const MARKER="<!-- KHAEMENES_HIGH_FORMATIVE_EVIDENCE_V1 -->";
const CONTEXT="courses/shared/high-school-learning-context-v1.js";
const BRIDGE="courses/shared/high-school-formative-evidence-v1.js";
const SKIP=new Set([".git","node_modules","archive","archives","backup","backups","vendor","private"]);
const posix=p=>p.split(path.sep).join("/");

function walk(dir,out=[]){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if(SKIP.has(e.name.toLowerCase()))continue;
    const full=path.join(dir,e.name);
    if(e.isDirectory())walk(full,out);
    else if(e.isFile()&&/\.html$/i.test(e.name))out.push(full);
  }
  return out;
}
function target(rel){
  const p=posix(rel);
  if(/\/(?:assessments?|records?|teacher|teachers|resources?|tools?|games?|assets?|tests?|evidence|portfolio|certificates?)\//i.test(p))return false;
  if(/(?:^|\/)(?:404|offline|gradebook|certificate|answer-key|answer_key)[^/]*\.html$/i.test(p))return false;

  if(/^courses\/language-arts\/english-(9|10|11|12)\/weeks\/week-\d{2}\/index\.html$/i.test(p))return true;
  if(/^courses\/language-arts\/english-(9|10|11|12)\/weeks\/week-\d{2}\/(?:lessons\/)?day-\d{2}\.html$/i.test(p))return true;
  if(/^courses\/language-arts\/english-9\/weeks\/week-\d{2}\/day-\d{2}\/index\.html$/i.test(p))return true;
  if(/^courses\/language-arts\/english-10\/weeks\/week-\d{2}\/(?:monday|tuesday|wednesday|thursday|friday)\/index\.html$/i.test(p))return true;

  if(/^courses\/mathematics\/(?:pre-algebra|algebra-1|geometry|algebra-2)\/units\/unit-\d{2}\/lessons\/.+\.html$/i.test(p))return true;

  if(/^courses\/science\/integrated-science-9\/(?:diagnostic|units\/unit-\d{2})\/lessons\/day-\d{2}\.html$/i.test(p))return true;
  if(/^courses\/science\/(?:biology-10|chemistry-11|physics-engineering-12)\/weeks\/week-\d{2}\/lessons\/day-\d{2}\.html$/i.test(p))return true;

  if(/^courses\/social-studies\/grade-(?:09|10|11|12)\/weeks\/week-\d{2}\/student-packet(?:-v2)?\.html$/i.test(p))return true;
  if(/^courses\/social-studies\/grade-11\/personal-finance\/weeks\/week-\d{2}\/student-packet(?:-v2)?\.html$/i.test(p))return true;

  return false;
}
function relScript(file,target){
  let r=posix(path.relative(path.dirname(file),path.join(ROOT,target)));
  if(!r.startsWith("."))r="./"+r;
  return r;
}
function inject(file){
  let html=fs.readFileSync(file,"utf8");
  if(html.includes(MARKER))return{changed:false,reason:"already"};
  if(!/<\/body>/i.test(html))return{changed:false,reason:"no-body"};
  const tags=[];
  if(!html.includes("high-school-learning-context-v1.js"))tags.push('<script src="'+relScript(file,CONTEXT)+'"></script>');
  tags.push('<script src="'+relScript(file,BRIDGE)+'"></script>');
  html=html.replace(/<\/body>/i,MARKER+"\n"+tags.join("\n")+"\n</body>");
  fs.writeFileSync(file,html,"utf8");
  return{changed:true,reason:"injected"};
}

const report={targets:0,changed:0,already:0,skipped:[],byFamily:{english:0,mathematics:0,science:0,socialStudies:0}};
for(const file of walk(ROOT)){
  const rel=path.relative(ROOT,file);
  if(!target(rel))continue;
  report.targets++;
  const p=posix(rel);
  if(p.includes("/language-arts/"))report.byFamily.english++;
  else if(p.includes("/mathematics/"))report.byFamily.mathematics++;
  else if(p.includes("/science/"))report.byFamily.science++;
  else if(p.includes("/social-studies/"))report.byFamily.socialStudies++;
  const r=inject(file);
  if(r.changed)report.changed++;
  else if(r.reason==="already")report.already++;
  else report.skipped.push(p+": "+r.reason);
}
console.log(JSON.stringify(report,null,2));
if(report.skipped.length)process.exitCode=2;
