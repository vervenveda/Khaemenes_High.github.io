import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"..");
const map=JSON.parse(fs.readFileSync(path.join(root,"course-map.json"),"utf8"));
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
let checks=0;

for(const w of map.weeks){
  const ws=String(w.week).padStart(2,"0");
  const file=path.join(root,"weeks",`week-${ws}`,"index.html");
  const html=fs.readFileSync(file,"utf8");
  assert.ok(html.includes('data-weekly-shell-fallback="canonical"'),`Week ${ws}: canonical fallback marker missing`);checks++;
  assert.equal((html.match(/weekly-shell-v1\.js/g)||[]).length,1,`Week ${ws}: weekly shell controller must load exactly once`);checks++;
  const titleRaw=`<h1>${esc(w.title)}</h1>`, titleEntity=titleRaw.replaceAll("\x27","&#x27;");
  assert.ok(html.includes(titleRaw)||html.includes(titleEntity),`Week ${ws}: title stale`);checks++;
  assert.ok(html.includes(`<strong>Essential question:</strong> ${esc(w.essentialQuestion)}`),`Week ${ws}: essential question stale`);checks++;
  for(const value of [w.quantitative,w.evidence_contract,w.inquiry_contract,w.retrieval_contract]){
    assert.ok(html.includes(esc(value)),`Week ${ws}: canonical contract value missing: ${value}`);checks++;
  }
  assert.ok(html.includes(`<h3>Data &amp; Quantitative Reasoning</h3><p>${esc(w.quantitative)}</p>`),`Week ${ws}: Wednesday quantitative fallback stale`);checks++;
  assert.ok(html.includes(`<h3>Investigation / Engineering</h3><p>${esc(w.inquiry_contract)} Source pathway: ${esc(w.lab)}</p>`),`Week ${ws}: Thursday inquiry fallback stale`);checks++;
  assert.ok(html.includes(`Transfer focus: ${esc(w.retrieval_contract)}`),`Week ${ws}: Friday retrieval fallback stale`);checks++;
}
const controller=fs.readFileSync(path.join(root,"weekly-shell-v1.js"),"utf8");
assert.ok(controller.includes('../../course-map.json'),"weekly shell controller must load canonical course-map.json");checks++;
assert.ok(controller.includes('fallback-canonical'),"weekly shell controller must preserve canonical static fallback");checks++;
assert.ok(controller.includes('Data & Quantitative Reasoning'),"weekly shell controller must own Wednesday quantitative target");checks++;
assert.ok(controller.includes('Investigation / Engineering'),"weekly shell controller must own Thursday inquiry target");checks++;
assert.ok(controller.includes('CER / Synthesis'),"weekly shell controller must own Friday transfer target");checks++;
console.log(`PASS: Chemistry 11 canonical weekly shell sync (${checks} checks across 36 weeks).`);
