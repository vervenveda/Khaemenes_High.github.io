#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const names={9:"The Library Notice",10:"An Announcement and Its Evidence",11:"Three Records of a Community Decision",12:"The Limits of a Reported Consensus"};
for(const [grade,title] of Object.entries(names)){
 const p=path.join(root,"courses/language-arts/english-"+grade+"/weeks/week-01/index.html");
 const html=fs.readFileSync(p,"utf8");
 assert.equal((html.match(/id="academy-week01-source-studio"/g)||[]).length,1, "Missing source studio grade "+grade);
 assert(html.includes(title),"Missing original passage grade "+grade);
 assert(html.includes("Original fictional instructional text"),"Source provenance not clear grade "+grade);
 assert(html.includes("Independent evidence response"),"Missing evidence prompt grade "+grade);
 assert(html.includes("rubric lenses"),"Missing vertical rubric grade "+grade);
 assert(html.includes("80% mastery"),"Missing mastery boundary grade "+grade);
 assert(html.indexOf("academy-week01-source-studio")<html.indexOf("</main>"),"Student studio outside main grade "+grade);
}
console.log("PASS: English 9–12 Week 01 original offline diagnostic source studios and grade-progressive writing prompts");
