import fs from "node:fs";import path from "node:path";
const root=path.resolve(new URL("../",import.meta.url).pathname);
const repoRoot=path.resolve(root,"../../..");
let pages=0,links=0;const missing=[];
function visit(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,item.name);if(item.isDirectory())visit(full);else if(item.name.endsWith(".html"))scan(full);}}
function scan(file){pages++;const src=fs.readFileSync(file,"utf8");const regex=/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi;let match;while((match=regex.exec(src))){const link=match[1].trim();if(!link||/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\{|\$)/i.test(link))continue;const cleaned=link.split(/[?#]/)[0];if(!cleaned)continue;links++;let target=cleaned.startsWith("/")?path.resolve(repoRoot,"."+cleaned):path.resolve(path.dirname(file),cleaned);if(!fs.existsSync(target))missing.push({page:path.relative(repoRoot,file),link});}}
visit(root);
console.log(JSON.stringify({scannedHtmlPages:pages,localReferences:links,unresolvedCount:missing.length,firstUnresolved:missing.slice(0,30)},null,2));
if(missing.length)console.log("NOTICE: local link inventory contains unresolved references; investigate before enforcing this audit as a release gate.");
