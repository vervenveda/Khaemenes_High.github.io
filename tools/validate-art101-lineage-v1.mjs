#!/usr/bin/env node
import fs from "node:fs";
import assert from "node:assert/strict";
const p="courses/electives/art-101/source-lineage-v1.json";
const c=JSON.parse(fs.readFileSync(p,"utf8"));
assert.equal(c.schema,"khaemenes-high-art-lineage-v1");
assert.equal(c.course,"art-101");
assert.equal(c.canonicalDoorway,"courses/electives/art-101/index.html");
assert.equal(c.source.repository,"vervenveda/bazaarart.github.io");
assert.equal(c.source.curriculumId,"ART-101");
assert.equal(c.successor.course,"art-201");
assert(fs.existsSync(c.canonicalDoorway),"Art 101 canonical doorway missing");
assert(fs.existsSync(c.successor.map),"Art 201 successor map missing");
const html=fs.readFileSync(c.canonicalDoorway,"utf8");
assert(html.includes(c.source.publicUrl),"Art 101 doorway must retain the declared Bazaar source entry");
assert(html.includes("../art-201/"),"Art 101 doorway must preserve Art 201 progression");
console.log("PASS: Art 101 source lineage and Art 201 succession are explicit and non-competing.");
