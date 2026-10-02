import fs from 'node:fs';

const PROSE_URL='/stos/proresources/';
const ARCADE_URL='/stos/arcade/';
const unit5Old='<p class="course-first"><strong>Curriculum first.</strong> Everything required is on this page. A teacher-approved full play or excerpt may enrich the week, but lack of internet access never blocks completion.</p><button class="btn" type="button" data-print>Print Complete Week</button>';
const unit5New=`<p class="course-first"><strong>Curriculum first.</strong> Everything required is on this page. A teacher-approved full play or excerpt may enrich the week, but lack of internet access never blocks completion.</p><p><strong>Optional sovereign companions:</strong> PROSE Editorial Suite supports drafting, revision, version preservation, and export. The Arcade offers optional learning practice. Both are Jennifer Kay Pearl / Verve N Veda resources inside STOS; neither is required for mastery.</p><div class="actions"><a class="btn" href="${PROSE_URL}">Open ProReSources / PROSE</a><a class="btn" href="${ARCADE_URL}">Open Learning Arcade</a><button class="btn" type="button" data-print>Print Complete Week</button></div>`;
const unit6Old='<p class="course-first"><strong>Everything required is local.</strong> No account, video, search engine, external archive or writing service is necessary.</p><button class="btn" type="button" data-print>Print Complete Week</button>';
const unit6New=`<p class="course-first"><strong>Everything required is local.</strong> No account, video, search engine, external archive or third-party writing service is necessary.</p><p><strong>Optional sovereign companions:</strong> PROSE Editorial Suite supports drafting, revision, version preservation, and export. The Arcade offers optional learning practice. Both are Jennifer Kay Pearl / Verve N Veda resources inside STOS; neither is required for mastery.</p><div class="actions"><a class="btn" href="${PROSE_URL}">Open ProReSources / PROSE</a><a class="btn" href="${ARCADE_URL}">Open Learning Arcade</a><button class="btn" type="button" data-print>Print Complete Week</button></div>`;

function replace(file,oldText,newText){
  const before=fs.readFileSync(file,'utf8');
  if(!before.includes(oldText)) throw new Error(`Expected policy text not found: ${file}`);
  const after=before.replace(oldText,newText);
  fs.writeFileSync(file,after);
  console.log(`classified PROSE in ${file}`);
}

for(let n=13;n<=15;n++) replace(`courses/language-arts/english-9/weeks/week-${n}/index.html`,unit5Old,unit5New);
for(let n=16;n<=18;n++) replace(`courses/language-arts/english-9/weeks/week-${n}/index.html`,unit6Old,unit6New);
replace('tools/rebuild-english9-unit05.mjs',unit5Old,unit5New.replaceAll('`','\\`').replaceAll('${','\\${'));
replace('tools/rebuild-english9-unit06.mjs',unit6Old,unit6New.replaceAll('`','\\`').replaceAll('${','\\${'));
