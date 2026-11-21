import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const profile=read('grades/grade-09/student-profile/index.html');
const layout=read('grades/grade-09/student-profile/dashboard-layout.js');
const schedule=read('grades/grade-09/student-profile/schedule/index.html');
const scheduleEngine=read('grades/shared/high-school-schedule-page.js');
const portfolio=read('portfolio/index.html');
const report=read('portfolio/portfolio-academic-report.js');
const records=read('portfolio/portfolio-student-record-connections.js');
const upper=read('grades/shared/grade09-blueprint-upper-grade.js');

test('Grade 9 Schedule and Student Portfolio have exactly one canonical toolbar destination each',()=>{
 assert.match(layout,/\{label:"Schedule",href:"schedule\/"\}/);
 assert.match(layout,/\{label:"Student Portfolio",href:"\.\.\/\.\.\/\.\.\/portfolio\/index\.html\?grade=09"\}/);
 assert.doesNotMatch(layout,/grade09ScheduleDialog|upperGradeScheduleDialog/);
});
test('Grade 9 main page retains only the standalone schedule owner',()=>{
 assert.match(profile,/dashboard-layout\.js\?v=20261120-standalone-schedule-restored-v2/);
 assert.match(layout,/if\(schedule\)\{schedule\.hidden=true/);
 assert.match(schedule,/id="scheduleGrid"/);
 assert.match(schedule,/href="\.\.\/">Back to Profile/);
});
test('Schedule has the registered learner three-way identity gate, not account authority',()=>{
 assert.match(scheduleEngine,/gradeCtx\?\.active\?\.\(\)/);
 assert.match(scheduleEngine,/profile\?\.activeLearner\?\.\(\)\?\.learnerId/);
 assert.match(scheduleEngine,/contract\?\.readAcademyProfile\?\.\(\)\?\.learnerId/);
 assert.match(scheduleEngine,/if\(!ctx\|\|ctx.grade!==grade/);
});
test('Schedule presents separate progress and assessed grades, without assuming zeros',()=>{
 for(const label of ['Course completion','Quiz and test average','Not yet reported','No published quiz/test points'])assert.ok(scheduleEngine.includes(label),label);
 assert.match(scheduleEngine,/record\?\.stale/);
 assert.match(scheduleEngine,/\["quiz","test"\]/);
});
test('Schedule writes only via existing course pin owner',()=>{
 assert.match(scheduleEngine,/pins\.writePins\(next\)/);
 assert.match(scheduleEngine,/g9\.setPinned\(/);
 assert.doesNotMatch(scheduleEngine,/localStorage\.setItem|fetch\(.*(?:account-cloud|sync)/);
});
test('Student Portfolio links are correct across grades 9–12',()=>{
 for(const grade of ['09','10','11','12']){
  const s=read('grades/grade-'+grade+'/student-profile/index.html');
  assert.ok(s.includes('href="../../../portfolio/index.html?grade='+grade+'"'),grade);
 }
 assert.match(upper,/label:"Student Portfolio",url:highRoot\+"portfolio\/index\.html\?grade="\+grade/);
});
test('Portfolio refresh, student record audit and evidence exports have separate handlers',()=>{
 for(const marker of ['id="refreshReport"','id="checkStudentRecords"','id="exportReport"','id="export"','id="importButton"'])assert.ok(portfolio.includes(marker),marker);
 assert.match(report,/\$\("refreshReport"\)\?\.addEventListener\("click"/);
 assert.match(records,/\$\("checkStudentRecords"\)/);
 assert.match(portfolio,/khae-learning-portfolio-v1:learner:/);
});
test('Portfolio checks three matching learner references before reporting scores',()=>{
 assert.match(report,/ctx\.learnerId!==current\.learnerId\|\|pin!==current\.learnerId/);
 assert.match(report,/officialFinalGrade:null,creditAwarded:null/);
 assert.match(report,/reportType:"evidence-summary-not-certified-transcript"/);
});
test('Readiness score is not silently awarded as a formal grade or cloud record',()=>{
 assert.match(report,/officialCourseGrade:false,cloudVerified:false/);
 assert.match(report,/Review & Link My Saved Algebra I Result/);
 assert.match(report,/No cloud upload is performed/);
 assert.match(records,/cloudSynced:false/);
 assert.match(records,/syncsCloud:false/);
});
test('Schedule and Portfolio use the canonical learning services but do not commission T03',()=>{
 for(const name of ['high-school-course-pins.js','high-school-eight-class.js','high-school-profile-grade-context.js'])assert.ok(schedule.includes(name),name);
 assert.match(portfolio,/khaemenes-learning-continuation\.js/);
 assert.match(schedule,/high-school-schedule-page\.js/);
 assert.match(records,/T03 not commissioned/);
});
