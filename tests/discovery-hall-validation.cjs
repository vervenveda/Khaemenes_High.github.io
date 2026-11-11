/* Discovery Hall contract checks — no student data, no external packages. */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"../courses/electives");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const js=fs.readFileSync(path.join(root,"discovery-hall.js"),"utf8");
new vm.Script(js,{filename:"discovery-hall.js"});
const match=js.match(/const domains=(\[[\s\S]*?\]);\s*const domainMap/);
assert.ok(match,"Question bank must be source-coupled");
const domains=JSON.parse(match[1]);
assert.equal(domains.length,6);
assert.equal(domains.reduce((sum,d)=>sum+d.questions.length,0),120);
const ids=new Set(),questionTexts=new Set();
for(const domain of domains){
 assert.equal(domain.questions.length,20,domain.id+" needs 20 questions");
 assert.ok(!ids.has(domain.id));ids.add(domain.id);
 for(const text of domain.questions){assert.ok(text.length>35);assert.ok(!questionTexts.has(text),"Duplicate question");questionTexts.add(text)}
}
assert.match(js,/\.slice\(0,2\)/,"Select two questions per domain");
assert.match(js,/shuffle\(domains\.flatMap/,"Randomize twelve-question session");
assert.match(js,/shuffle\(\[q\.domain/,"Randomize answer order");
assert.match(js,/learnerScope\(\)/,"Saved passport needs learner scope");
assert.doesNotMatch(js,/fetch\s*\(|XMLHttpRequest|sendBeacon/,"No network posting of interest responses");
const required=["discover","sparkQuiz","sparkQuestion","sparkOptions","sparkProgress","sparkBack","sparkNext","sparkResults","sparkSaveInterest","sparkResultStatus","sparkRecommendations","sparkAgain","career","challenges","discoveryChallenges","refreshChallenges","passport","passportStatus","passportInterests","passportNoteCount","passportNote","passportAdd","passportExport","passportClear","catalog","electiveSearch","electiveStatus","catalogCount"];
for(const id of required)assert.ok(html.includes('id="'+id+'"'),"Missing UI "+id);
assert.equal((html.match(/<article class="card"/g)||[]).length,9);
assert.ok(html.indexOf('id="catalog"')>html.indexOf('id="passport"'));
assert.ok(html.includes('<details id="catalog"'));
assert.ok(html.includes('src="discovery-hall.js" defer'));
assert.ok(html.includes('https://vervenveda.com/Khaemenes_Higher_Learning.github.io/Career/'));
console.log("PASS Discovery Hall: 120 unique questions / 6 areas / 12 per session; "+required.length+" controls; 9 catalogue doors; no quiz network calls.");
