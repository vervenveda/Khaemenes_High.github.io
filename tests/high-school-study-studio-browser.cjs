'use strict';
/* Real Chromium smoke/regression exercise of the checked-in Study Studio scripts.
 * Synthetic learners, in-memory test origin, no network access or student data.
 * Run from repo root: npm install --no-save playwright && npx playwright install chromium
 *                      node tests/high-school-study-studio-browser.cjs
 */
const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const sources={
  9:'grades/grade-09/student-profile/study-studio.js',
  10:'grades/shared/upper-grade-klasaipeer-studio.js',
  11:'grades/shared/upper-grade-klasaipeer-studio.js',
  12:'grades/shared/upper-grade-klasaipeer-studio.js'
};
const log=[];
async function gradeRun(browser,grade,viewport){
 const context=await browser.newContext({viewport,acceptDownloads:false});
 const page=await context.newPage();
 const pageErrors=[];
 page.on('pageerror',error=>pageErrors.push(String(error)));
 const scenario='Grade '+grade+' ('+viewport.width+'px)';
 const host='https://academy-studio-test.invalid/';
 await page.route('**/*',route=>{
  if(route.request().url().startsWith(host))return route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html><head><meta charset="utf-8"><title>Synthetic Studio Regression</title></head><body data-grade="'+grade+'"></body></html>'});
  return route.abort();
 });
 await page.goto(host+'grade-'+grade+'/profile/');
 const initSynthetic=grade=>{
  window.__synthetic={learner:'learner-'+grade,grade,contract:'learner-'+grade};
  window.KhaemenesCourseEntryContract={readAcademyProfile:()=>({learnerId:window.__synthetic.contract})};
  window.KhaemenesStudentProfileV2={activeLearner:()=>({learnerId:window.__synthetic.learner,stage:'high',grade:window.__synthetic.grade})};
  window.KhaemenesHighProfileGradeContext={active:()=>({learnerId:window.__synthetic.learner,gradeNumber:window.__synthetic.grade})};
  const classes=[{id:'math',title:'Mathematics',home:'/math'},{id:'art',title:'Art',home:'/art'}];
  window.KhaemenesGrade09Courses={courses:classes,getCourse:id=>classes.find(c=>c.id===id)||null,resumePriorityCourse:()=>classes[0],mentorFor:()=>'/mentor/'};
  window.KhaemenesHighEightClass={slots:()=>classes.map(c=>({id:c.id,title:c.title,href:c.home}))};
 };
 await page.evaluate(initSynthetic,grade);
 await page.addInitScript(initSynthetic,grade);
 await page.addScriptTag({path:path.join(root,sources[grade])});
 await page.evaluate(g=>(g===9?window.KhaemenesGrade09StudyStudio:window.KhaemenesUpperGradeStudyStudio).open(document.body),grade);
 const d=page.locator('#grade09StudyStudioDialog');
 assert.equal(await d.evaluate(el=>el.open),true);
 log.push(scenario+': opens');
 await d.locator('[data-room="notes"]').click();
 await d.locator('#g09sNotes').fill('Atom: smallest unit');
 assert.equal(await page.evaluate(()=>Array.from({length:localStorage.length},(_,i)=>localStorage.key(i)).some(k=>k.includes('recovery-draft-v1'))),true);
 await d.locator('#g09sSave').click();
 assert.match(await d.locator('#g09sStatus').innerText(),/saved and checked/);
 log.push(scenario+': note draft and verified save');
 await d.locator('[data-room="cards"]').click();
 await d.locator('#g09sBuild').click();
 await d.locator('#g09sSaveDeck').click();
 assert.match(await d.locator('#g09sDeckStatus').innerText(),/saved and checked/);
 log.push(scenario+': saved flashcard deck');
 await d.locator('[data-room="lab"]').click();
 const board=d.locator('#g09sCanvas');
 const bounds=await board.boundingBox();
 assert.ok(bounds?.width>10&&bounds?.height>10);
 await page.mouse.move(bounds.x+40,bounds.y+40);
 await page.mouse.down();
 await page.mouse.move(bounds.x+130,bounds.y+100,{steps:7});
 await page.mouse.up();
 await d.locator('#g09sSaveBoard').click();
 assert.match(await d.locator('#g09sBoardStatus').innerText(),/saved and checked/);
 log.push(scenario+': pointer drawing and saved whiteboard');
 await d.locator('#g09sCourse').selectOption('art');
 assert.equal(await d.locator('#g09sNotes').inputValue(),'');
 assert.equal(await d.locator('#g09sCard').innerText(),'No practice cards yet.');
 await d.locator('#g09sCourse').selectOption('math');
 assert.equal(await d.locator('#g09sNotes').inputValue(),'Atom: smallest unit');
 assert.match(await d.locator('#g09sDeckStatus').innerText(),/Loaded 1 saved flashcards/);
 await page.waitForFunction(()=>document.getElementById('g09sBoardStatus')?.textContent?.includes('restored'));
 log.push(scenario+': class isolation and whiteboard restore');
 // A canceled class switch must not discard unsaved writing or change selection.
 await d.locator('[data-room="notes"]').click();
 await d.locator('#g09sNotes').fill('Pending: unsaved text');
 page.once('dialog',async prompt=>{assert.equal(prompt.type(),'confirm');await prompt.dismiss()});
 await d.locator('#g09sCourse').selectOption('art');
 assert.equal(await d.locator('#g09sCourse').inputValue(),'math');
 assert.equal(await d.locator('#g09sNotes').inputValue(),'Pending: unsaved text');
 log.push(scenario+': canceled class switch preserves notes');
 // Restore previously verified saved text, clearing the unsaved draft without writing it.
 await d.locator('#g09sNotes').fill('Atom: smallest unit');
 await page.reload();
 await page.addScriptTag({path:path.join(root,sources[grade])});
 await page.evaluate(g=>(g===9?window.KhaemenesGrade09StudyStudio:window.KhaemenesUpperGradeStudyStudio).open(document.body),grade);
 assert.equal(await d.evaluate(el=>el.open),true);
 assert.equal(await d.locator('#g09sNotes').inputValue(),'Atom: smallest unit');
 assert.match(await d.locator('#g09sDeckStatus').innerText(),/Loaded 1 saved flashcards/);
 await page.waitForFunction(()=>document.getElementById('g09sBoardStatus')?.textContent?.includes('restored'));
 log.push(scenario+': browser reload restores all three saved tools');
 assert.deepEqual(pageErrors,[],'Page JavaScript errors: '+pageErrors.join('; '));
 await page.evaluate(()=>window.__synthetic.learner='different-learner');
 await d.locator('[data-room="notes"]').click();
 await d.locator('#g09sNotes').fill('Unauthorized: test');
 await d.locator('#g09sSave').click();
 assert.match(await d.locator('#g09sStatus').innerText(),/Save blocked/);
 log.push(scenario+': wrong-learner save blocked');
 assert.deepEqual(pageErrors,[],'Page JavaScript errors: '+pageErrors.join('; '));
 await context.close();
}
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const grade of [9,10,11,12]){
   await gradeRun(browser,grade,{width:1024,height:768});
   await gradeRun(browser,grade,{width:768,height:1024});
  }
  process.stdout.write('PASS '+log.length+' browser assertions across four grades\n'+log.join('\n')+'\n');
 }finally{await browser.close()}
})().catch(err=>{process.stderr.write('BROWSER REGRESSION FAILED: '+String(err.stack||err)+'\n');process.exitCode=1});
