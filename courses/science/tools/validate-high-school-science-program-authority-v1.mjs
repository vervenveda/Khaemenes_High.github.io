#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"../../..");
const science=path.join(root,"courses/science");
const fail=[];
const must=(cond,msg)=>{if(!cond)fail.push(msg)};
const read=p=>fs.readFileSync(path.join(root,p),"utf8");

const coherence=read("courses/science/HIGH_SCHOOL_SCIENCE_COHERENCE_MAP.md");
for(const token of ["Science 9 → Biology 10","Science 9 → Chemistry 11","Science 9 → Physics 12","Biology 10 → Chemistry 11","Chemistry 11 → Physics 12"]) must(coherence.includes(token),"coherence handoff missing: "+token);

const inquiry=read("courses/science/HIGH_SCHOOL_SCIENCE_INQUIRY_COMPLETION_STANDARD.md");
for(const state of ["planned","started","submitted","reviewed","mastered","archived"]) must(inquiry.includes("**"+state+"**"),"inquiry state missing: "+state);
for(const field of ["driving question","observations/data","uncertainty","CER/design defense","Authority boundary"]) must(inquiry.toLowerCase().includes(field.toLowerCase()),"inquiry evidence requirement missing: "+field);

const portfolio=JSON.parse(read("courses/science/science-longitudinal-portfolio-v1.json"));
must(portfolio.schema==="khaemenes.high-school-science.longitudinal-portfolio.v1","portfolio schema mismatch");
must(Array.isArray(portfolio.courses)&&portfolio.courses.length===4,"portfolio must cover four grades");
for(const grade of [9,10,11,12]){
 const c=portfolio.courses.find(x=>x.grade===grade);
 must(c,"portfolio missing grade "+grade);
 must(c&&Array.isArray(c.required_artifacts)&&c.required_artifacts.length>=4,"portfolio grade "+grade+" needs >=4 required artifacts");
}
must(Array.isArray(portfolio.graduation_evidence)&&portfolio.graduation_evidence.length>=6,"graduation evidence progression incomplete");

const matrix=JSON.parse(read("courses/science/science-browser-device-matrix-v1.json"));
must(matrix.schema==="khaemenes.high-school-science.browser-device-matrix.v1","browser matrix schema mismatch");
for(const width of [1440,1024,768,255]) must(matrix.viewports.some(v=>v.width===width),"browser matrix missing width "+width);
for(const grade of [9,10,11,12]){
 const route=matrix.routes.find(r=>r.grade===grade);
 must(route,"browser matrix missing grade "+grade);
 if(route){
  const p=path.join(root,route.path);
  must(fs.existsSync(p),"browser matrix route missing: "+route.path);
  if(fs.existsSync(p)){
   const html=fs.readFileSync(p,"utf8");
   must(/<meta[^>]+name=["']viewport["']/i.test(html),"viewport meta missing: "+route.path);
   if(grade===9) must(/data-science-engine=["']science9-v1["']|science9-instruction-engine-v1\.js/i.test(html),"Science 9 engine marker missing: "+route.path);
   else must(!/data-science-engine=["']upper-science-v1["']|upper-science-instruction-engine-v1\.js/i.test(html),"Retired Upper Science engine hook remains: "+route.path);
  }
 }
}
if(fail.length){console.error("High School Science program authority: HOLD");fail.forEach(x=>console.error("- "+x));process.exit(1)}
console.log("High School Science program authority: PASS");
console.log("Coherence handoffs, inquiry completion states, longitudinal portfolio spine, and browser/device route matrix are canonical and internally consistent.");
