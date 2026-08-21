import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const courseRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const failures=[];
const fail=message=>failures.push(message);

function embeddedConfig(relative,name){
  const source=fs.readFileSync(path.join(courseRoot,relative),"utf8"),marker=new RegExp(`window\\.${name}\\s*=`).exec(source);
  if(!marker)throw new Error(`${relative}: ${name} missing`);
  const start=source.indexOf("{",marker.index+marker[0].length);
  let depth=0,inString=false,escaped=false;
  for(let index=start;index<source.length;index++){
    const character=source[index];
    if(inString){if(escaped)escaped=false;else if(character==="\\")escaped=true;else if(character==='"')inString=false;continue;}
    if(character==='"'){inString=true;continue;}
    if(character==="{")depth++;
    if(character==="}"&&--depth===0)return JSON.parse(source.slice(start,index+1));
  }
  throw new Error(`${relative}: ${name} incomplete`);
}

const map=JSON.parse(fs.readFileSync(path.join(courseRoot,"assessments/assessment-map.json"),"utf8"));
const certificate=fs.readFileSync(path.join(courseRoot,"records/course-completion-certificate.html"),"utf8");
const readme=fs.readFileSync(path.join(courseRoot,"records/README.md"),"utf8");
const reportCenter=fs.readFileSync(path.join(courseRoot,"records/index.html"),"utf8");
const courseHome=fs.readFileSync(path.join(courseRoot,"index.html"),"utf8");
const expectedMatch=certificate.match(/expected=(\{midterm:[\s\S]*?\}\});let assessmentSources=/);
if(!expectedMatch)fail("Certificate expected-assessment configuration could not be read");
else{
  const expected=Function(`"use strict";return (${expectedMatch[1]})`)();
  for(const kind of ["midterm","final"]){
    const record=map.assessments.find(item=>item.id===expected[kind].id);
    if(!record)fail(`Certificate ${kind} ID ${expected[kind].id} is absent from assessment map`);
    else{
      if(record.result_key!==expected[kind].key)fail(`Certificate ${kind} result key differs from assessment map`);
      const config=embeddedConfig(`assessments/${record.path}`,"EXAM_CONFIG");
      if(config.id!==record.id)fail(`${kind} embedded assessment ID differs from map`);
      if(config.result_key!==record.result_key)fail(`${kind} embedded result key differs from map`);
    }
  }
}

const safeguards=[
  ["ackUnverified","local-score acknowledgment"],
  ["digitally_signed:false","unsigned record flag"],
  ["cryptographically_verified:false","unverified record flag"],
  ["authoritative:false","non-authoritative assessment provenance"],
  ["editable_storage:true","editable-storage provenance"],
  ["parent_review_required:true","parent-review provenance"],
  ["authenticity:false","integrity/authenticity distinction"],
  ["not proof of authorship","authorship disclaimer"],
  ["does not claim state accreditation","accreditation disclaimer"],
  ["Parent / administrator attestation required","attestation requirement"]
];
for(const [text,label] of safeguards)if(!certificate.includes(text))fail(`Certificate missing ${label}`);
if(!certificate.includes('if(!$("ackUnverified").checked)'))fail("Local score import is not gated by acknowledgment");
if(!certificate.includes('Number(val("coursework"))*.4+Number(val("midterm"))*.2+Number(val("finalExam"))*.3+Number(val("capstone"))*.1'))fail("Suggested grade weights differ from 40/20/30/10 policy");
if(!/does not claim government issuance or accreditation/i.test(readme))fail("Records README lacks issuance/accreditation disclaimer");
if(!/Data stays in the browser unless exported/i.test(readme))fail("Records README lacks local-data statement");

const reportTypes=["Family Progress Summary","Detailed Mastery Record","Portfolio Evidence Packet","Activity & Reading Log","Full Administrative Packet"];
for(const type of reportTypes)if(!reportCenter.includes(type))fail(`Records Office is missing ${type}`);
const reportSafeguards=[
  ["Family Learning Center","Academy parent-page route"],
  ["khaemenes-family-registry.js","canonical Family Registry connection"],
  ["KHAE_OPEN_PREALGEBRA_FORGE_V2","course evidence source"],
  ["recorded_at:new Date().toISOString()","activity-log recording timestamp"],
  ["Reading/material title","reading-material title field"],
  ["made at the time of instruction","contemporaneous-log guidance"],
  ["does not replace any separately required evaluation","annual-evaluation boundary"],
  ["does not claim accreditation","accreditation boundary"],
  ["not digitally signed","signature boundary"],
  ["@media print","print stylesheet"],
  ["Export CSV Evidence","machine-readable evidence export"],
  ["Download HTML","portable report export"]
];
for(const [text,label] of reportSafeguards)if(!reportCenter.includes(text))fail(`Records Office missing ${label}`);
for(const field of ["legalName","programName","academicYear","courseDates","parentName","district","hours","recordId","strengths","nextSteps","accommodations"])if(!reportCenter.includes(`id="${field}"`))fail(`Records Office missing ${field} field`);
if(!courseHome.includes('href="records/"'))fail("Course report page does not link to the Records Office");
if(!courseHome.includes("Open Family Learning Center"))fail("Course report page does not link to the Academy family page");

if(failures.length){
  console.error(`Record integrity audit failed (${failures.length}):`);
  failures.forEach(failure=>console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Record integrity audit passed: assessment keys, grade policy, provenance, acknowledgment, export integrity, and parent-attestation safeguards align.");
