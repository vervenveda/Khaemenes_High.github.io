import {execFileSync} from "node:child_process";

const run=(...args)=>execFileSync("git",args,{encoding:"utf8"}).trim();
const head=process.env.GITHUB_SHA||"HEAD";
const parent=run("rev-parse",`${head}^1`);
const headTree=run("rev-parse",`${head}^{tree}`);
const parentTree=run("rev-parse",`${parent}^{tree}`);

if(headTree===parentTree){
  throw new Error(`Release head ${head} has the same tree as its first parent; empty commits are not releasable.`);
}

console.log(`Release head integrity: PASS (${head} changes the repository tree).`);
