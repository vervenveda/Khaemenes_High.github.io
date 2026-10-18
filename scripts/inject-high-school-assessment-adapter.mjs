import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const MARKER="<!-- KHAEMENES_HIGH_ASSESSMENT_ADAPTER_V1 -->";
const SHARED=[
  "courses/shared/monte-carlo-assessment-v1.js",
  "courses/shared/high-school-learning-context-v1.js",
  "courses/shared/high-school-assessment-adapter-v1.js"
];
const posix=p=>p.split(path.sep).join("/");
const skip=new Set([".git","node_modules","archive","archives","backup","backups","vendor","private"]);

function walk(dir,out=[]){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if(skip.has(e.name.toLowerCase()))continue;
    const full=path.join(dir,e.name);
    if(e.isDirectory())walk(full,out);
    else if(e.isFile()&&/\.html$/i.test(e.name))out.push(full);
  }
  return out;
}
function relScript(file,target){
  let r=posix(path.relative(path.dirname(file),path.join(ROOT,target)));
  if(!r.startsWith("."))r="./"+r;
  return r;
}
function target(rel,html){
  const p=posix(rel);
  const upperEnglish=/^courses\/language-arts\/english-(10|11|12)\//.test(p) &&
    (/data-quiz-form/.test(html)||/data-assessment-form/.test(html));
  const social=/^courses\/social-studies\/grade-(10|11|12)\/index\.html$/.test(p);
  return upperEnglish||social;
}
function block(file){
  return MARKER+"\n"+SHARED.map(p=>'<script src="'+relScript(file,p)+'"></script>').join("\n");
}

const report={targets:0,changed:0,already:0,bankAdded:0,skipped:[],byFamily:{english:0,socialStudies:0},quizBankTargets:0};
for(const file of walk(ROOT)){
  const rel=path.relative(ROOT,file);
  let html=fs.readFileSync(file,"utf8");
  if(!target(rel,html))continue;
  report.targets++;
  if(/courses\/language-arts\/english-/.test(posix(rel)))report.byFamily.english++;
  else report.byFamily.socialStudies++;
  if(!/<\/head>/i.test(html)){report.skipped.push(posix(rel)+": no </head>");continue}
  let changed=false;
  if(!html.includes(MARKER)){
    html=html.replace(/<\/head>/i,block(file)+"\n</head>");
    changed=true;
  }else{
    report.already++;
  }
  const relPosix=posix(rel);
  const quizMatch=relPosix.match(/^courses\/language-arts\/english-(10|11|12)\//);
  if(quizMatch&&/data-quiz-form/.test(html)){
    report.quizBankTargets++;
    if(!html.includes("quiz-specific-bank.js")){
      const bankTarget="courses/language-arts/english-"+quizMatch[1]+"/assets/quiz-specific-bank.js";
      const bankTag='<script src="'+relScript(file,bankTarget)+'"></script>';
      html=html.replace(/<\/head>/i,bankTag+"\n</head>");
      report.bankAdded++;
      changed=true;
    }
  }
  if(changed){
    fs.writeFileSync(file,html,"utf8");
    report.changed++;
  }
}
console.log(JSON.stringify(report,null,2));
if(report.skipped.length)process.exitCode=2;
