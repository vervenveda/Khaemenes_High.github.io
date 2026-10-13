import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root=process.cwd();
const template=fs.readFileSync("assets/typography-standard.css","utf8");
const checks=[
 ["eyebrow 55px",/font-size:\s*55px\s*!important/i],
 ["H1 33px",/body h1\s*\{[\s\S]*?font-size:\s*33px\s*!important/i],
 ["descriptor H2 24px",/body h2,[\s\S]*?font-size:\s*24px\s*!important/i],
 ["body 14px",/body\s*\{[\s\S]*?font-size:\s*14px\s*!important/i],
 ["Cinzel headings",/font-family:\s*Cinzel,/],
 ["Brandon Grotesque body",/font-family:\s*"Brandon Grotesque"/],
 ["font fallbacks",/Avenir Next/]
];
for(const [name,matcher] of checks)assert.match(template,matcher,"missing "+name);
assert.ok(!/(@import|url\(|https?:\/\/)/i.test(template),"no third-party fonts or network imports");

const marker='<style id="khaemenes-typography-standard">';
let checked=0,exempt=0,grade9=0;const missing=[];
function inspect(dir,rel=""){
 for(const item of fs.readdirSync(dir,{withFileTypes:true})){
  if(item.name===".git"||item.name==="node_modules")continue;
  const r=rel?rel+"/"+item.name:item.name,abs=path.join(dir,item.name);
  if(item.isDirectory()){
   if(r.split("/").some(p=>p.toLowerCase()==="stos")){exempt++;continue;}
   inspect(abs,r);
  }else if(item.isFile()&&r.endsWith(".html")){
   const html=fs.readFileSync(abs,"utf8");
   if(!/<\/head\s*>/i.test(html)){exempt++;continue;}
   checked++;
   const start=html.indexOf(marker),end=start<0?-1:html.indexOf("</style>",start);
   if(start<0||end<0){missing.push(r);continue;}
   const embedded=html.slice(start+marker.length,end).trim();
   if(embedded!==template.trim())missing.push(r+" (outdated typography)");
   if(r.startsWith("courses/language-arts/english-9/")||
      r.startsWith("courses/science/integrated-science-9/")||
      r.startsWith("grades/grade-09/"))grade9++;
  }
 }
}
inspect(root);
assert.ok(checked>=2700,"unexpectedly low high school public page coverage: "+checked);
assert.ok(grade9>400,"all Grade 9 public learning pages must be covered");
assert.deepEqual(missing.slice(0,25),[],missing.length+" public HTML pages missing typography: "+missing.slice(0,25).join(", "));
for(const file of ["courses/language-arts/english-9/index.html","courses/science/integrated-science-9/index.html"]){
 const html=fs.readFileSync(file,"utf8");
 assert.ok(html.includes("grade09-subject-parchment.css"),"grade 9 parchment still linked: "+file);
 assert.ok(html.includes("data-grade09-consistency"),"grade 9 parchment contract intact: "+file);
}
console.log("PASS: "+checked+" HTML documents have identical embedded 55/33/24/14 typography with Cinzel/Brandon fallbacks, "+grade9+" Grade 9 pages included, STOS excluded; no external fonts.");
