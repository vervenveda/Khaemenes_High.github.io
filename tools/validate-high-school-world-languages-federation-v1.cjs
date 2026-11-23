#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const cfg=JSON.parse(read("courses/shared/high-school-world-languages-federation-v1.json"));
assert.equal(cfg.schema,"khaemenes-high-world-languages-federation-v1");
assert.equal(cfg.requirement.yearsRequired,2);
assert.equal(cfg.requirement.linguisticsOwnsInstruction,true);
assert.equal(cfg.recordBoundary.outboundRoute,"verified");
assert.equal(cfg.recordBoundary.highSchoolTranscriptReturn,"pending-audited-record-bridge");
const runtime=read("grades/shared/grade09-blueprint-upper-grade.js");
assert(runtime.includes("Khaemenes_Linguistics.github.io/Halls/index.html"),"Upper-grade profile runtime lost canonical Linguistics route");
for(const language of cfg.destination.supportedSelections)assert(runtime.includes('"'+language+'"'),"Upper-grade profile runtime missing language selection "+language);
console.log("PASS World Languages federation: High School requirement -> Linguistics instruction; cross-repository transcript return remains explicit HOLD.");
