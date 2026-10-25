#!/usr/bin/env node
"use strict";
import {spawnSync} from "node:child_process";

const args=process.argv.slice(2);
const run=spawnSync(process.execPath,["tools/forensic-assessment-audit.mjs",...args],{
  cwd:process.cwd(),
  stdio:"inherit"
});
process.exit(run.status??1);
