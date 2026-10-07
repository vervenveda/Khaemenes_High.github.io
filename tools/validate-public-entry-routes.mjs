import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const ENTRYPOINTS=[
  "index.html",
  "courses/index.html",
  "grades/grade-09/index.html",
  "grades/grade-10/index.html",
  "grades/grade-11/index.html",
  "grades/grade-12/index.html",
  "courses/mathematics/index.html",
  "courses/mathematics/pre-algebra/index.html",
  "courses/mathematics/algebra-1/index.html",
  "courses/mathematics/geometry/index.html",
  "courses/language-arts/index.html",
  "courses/language-arts/english-9/index.html",
  "courses/language-arts/english-9/foundations/index.html",
  "courses/science/index.html",
  "courses/science/integrated-science-9/index.html",
  "courses/social-studies/index.html",
  "courses/social-studies/grade-09/index.html",
  "courses/electives/index.html",
  "electives/grades/grade-09/psych-101/index.html",
  "mentor/index.html",
  "stos/mentor/index.html",
  "stos/khaemenes/student/index.html",
  "stos/khaemenes/family/index.html"
];

function walk(dir,relative=""){
  const output=[];
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.name===".git"||entry.name==="node_modules")continue;
    const rel=relative?path.posix.join(relative,entry.name):entry.name;
    const absolute=path.join(dir,entry.name);
    if(entry.isDirectory())output.push(...walk(absolute,rel));
    else output.push(rel);
  }
  return output;
}

const files=new Set(walk(ROOT));
const failures=[];
let references=0;

function isExternal(raw){
  return !raw||raw.startsWith("#")||raw.startsWith("//")||raw.includes("${")||/^(?:[a-z][a-z0-9+.-]*:)/i.test(raw);
}
function resolveTarget(source,raw){
  const stripped=raw.split("#",1)[0].split("?",1)[0];
  if(!stripped)return "index.html";
  const decoded=decodeURIComponent(stripped);
  const base=decoded.startsWith("/")?"":path.posix.dirname(source);
  return path.posix.normalize(path.posix.join(base,decoded.replace(/^\/+/, "")));
}
function targetExists(target){
  return files.has(target)||files.has(path.posix.join(target,"index.html"))||(!path.posix.extname(target)&&files.has(`${target}.html`));
}

for(const source of ENTRYPOINTS){
  if(!files.has(source)){failures.push(`${source}: entrypoint missing`);continue;}
  const content=fs.readFileSync(path.join(ROOT,source),"utf8");
  const attributes=/\b(?:href|src)\s*=\s*(["'])(.*?)\1/gi;
  for(const match of content.matchAll(attributes)){
    const raw=match[2].trim();
    if(isExternal(raw))continue;
    references++;
    try{
      const target=resolveTarget(source,raw);
      if(!targetExists(target))failures.push(`${source}: ${raw} -> ${target}`);
    }catch(error){
      failures.push(`${source}: invalid route ${raw} (${error.message})`);
    }
  }
}

if(failures.length){
  console.error(`Public entry-route validation FAILED (${failures.length} issue${failures.length===1?"":"s"}):`);
  for(const failure of failures)console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`Public entry-route validation: PASS (${ENTRYPOINTS.length} entrypoints, ${references} local references).`);
