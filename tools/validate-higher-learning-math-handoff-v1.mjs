#!/usr/bin/env node
import fs from "node:fs";
import assert from "node:assert/strict";

const handoffs=[
  {
    id:"precalculus-trigonometry",
    file:"courses/mathematics/precalculus-trigonometry/index.html",
    url:"https://vervenveda.com/Khaemenes_Higher_Learning.github.io/courses/mathematics/precalculus-trigonometry/"
  },
  {
    id:"calculus-1",
    file:"courses/mathematics/calculus-1/index.html",
    url:"https://vervenveda.com/Khaemenes_Higher_Learning.github.io/courses/mathematics/calculus-1/"
  }
];
for(const row of handoffs){
  const html=fs.readFileSync(row.file,"utf8");
  assert(html.includes(row.url),row.id+" Higher Learning destination drifted");
  assert(html.includes("Continue to Higher Learning"),row.id+" lost explicit handoff action");
  assert(html.includes("Return to High School Mathematics"),row.id+" lost return action");
  assert(!/http-equiv=["']refresh/i.test(html),row.id+" must not auto-redirect");
  assert(!/\blocation\.(replace|assign)\s*\(/.test(html),row.id+" must not script-redirect");
  assert(!/localStorage\.setItem/.test(html),row.id+" handoff must not mutate learner state");
}
const contract=JSON.parse(fs.readFileSync("courses/shared/high-school-federated-return-record-v1.json","utf8"));
assert.equal(contract.schema,"khaemenes-high-school-federated-return-record-v1");
for(const id of ["precalculus-trigonometry","calculus-1"]){
  const row=contract.consumers.find(x=>x.id===id);
  assert(row,id+" missing federated return-record consumer");
  assert.equal(row.issuer,"higher-learning-mathematics",id+" issuer authority drifted");
  assert.equal(row.status,"return-bridge-pending-commissioning",id+" must stay fail-closed until return bridge is commissioned");
}
assert.equal(contract.safeguards.noAutomaticTranscriptCreditUntilValidated,true);
assert.equal(contract.safeguards.learnerMismatchFailClosed,true);
console.log("PASS: High School advanced-math handoffs point to Higher Learning and preserve fail-closed return-record authority.");
