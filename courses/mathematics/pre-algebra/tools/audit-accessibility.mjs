import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const courseRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const failures=[];
const stats={pages:0,images:0,forms:0,worksheets:0};

function walk(directory){
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(directory,entry.name)):[path.join(directory,entry.name)]);
}
function label(file){return path.relative(courseRoot,file).split(path.sep).join("/");}
function fail(file,message){failures.push(`${label(file)}: ${message}`);}

for(const file of walk(courseRoot).filter(item=>item.endsWith(".html"))){
  const source=fs.readFileSync(file,"utf8");
  const staticSource=source.replace(/<!--[\s\S]*?-->/g,"");
  stats.pages++;
  if(!/<html\b[^>]*\blang=["'][^"']+["']/i.test(staticSource))fail(file,"missing document language");
  if(!/<title>\s*[^<]+\s*<\/title>/i.test(staticSource))fail(file,"missing page title");
  if(!/<meta\b[^>]*name=["']viewport["']/i.test(staticSource))fail(file,"missing responsive viewport");
  if(!/<main\b/i.test(staticSource))fail(file,"missing main landmark");
  const ids=[...staticSource.matchAll(/\bid=["']([^"'${}]+)["']/gi)].map(match=>match[1]);
  const duplicates=[...new Set(ids.filter((id,index)=>ids.indexOf(id)!==index))];
  if(duplicates.length)fail(file,`duplicate static IDs: ${duplicates.join(", ")}`);
  for(const image of staticSource.matchAll(/<img\b[^>]*>/gi)){
    stats.images++;
    if(!/\balt\s*=/i.test(image[0]))fail(file,"image missing alt attribute");
  }
  for(const form of staticSource.matchAll(/<form\b[\s\S]*?<\/form>/gi)){
    stats.forms++;
    for(const button of form[0].matchAll(/<button\b[^>]*>/gi))if(!/\btype\s*=/i.test(button[0])&&!button[0].includes("${"))fail(file,"button inside form missing explicit type");
  }
  if(file.includes(`${path.sep}worksheets${path.sep}`)&&path.basename(file)!=="index.html"){
    stats.worksheets++;
    if(!/@media\s+print/i.test(staticSource))fail(file,"printable resource missing print stylesheet");
  }
}

if(failures.length){
  console.error(`Accessibility and print audit failed (${failures.length}):`);
  failures.forEach(failure=>console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Accessibility and print audit passed: ${stats.pages} pages, ${stats.images} images, ${stats.forms} forms, ${stats.worksheets} printable resources.`);
