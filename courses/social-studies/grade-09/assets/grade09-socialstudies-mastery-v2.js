(() => {
'use strict';

/*
  Grade 9 Global Studies Honors — Mastery Policy v2
  Public/student-facing progression policy only.

  Weekly progression requires:
  - all five daily lessons completed;
  - all three principal assignments submitted;
  - weekly objective quiz best score >= 80%.

  Semester progression:
  - Week 19 also requires the midterm objective best score >= 80%.

  This layer does not grade teacher-reviewed constructed responses or essays.
  Human evaluation remains authoritative for those components.
*/

const COURSE = window.KHAEMENES_SOCIAL_STUDIES_DATA;
if (!COURSE || !COURSE.metadata) return;

const MASTER = 80;
const HONORS = 90;
const KEY = COURSE.metadata.storageKey;

// Canonical policy override until the source data file is regenerated.
COURSE.metadata.passingTarget = MASTER;
COURSE.metadata.honorsTarget = HONORS;

function loadDB(){
  try {
    const db = JSON.parse(localStorage.getItem(KEY));
    return db && Array.isArray(db.students) ? db : null;
  } catch (_) {
    return null;
  }
}

function activeStudent(db){
  return db?.students?.find(s => s.id === db.activeId) || null;
}

function lessonCount(student, week){
  return (student?.completedLessons?.[week] || []).filter(Boolean).length;
}

function assignmentCount(student, week){
  let count = 0;
  for (let n = 1; n <= 3; n++) {
    if (student?.assignments?.[`${week}-${n}`]?.submitted) count++;
  }
  return count;
}

function quizBest(student, week){
  const q = student?.quizzes?.[week];
  return Number(q?.bestPercent ?? q?.percent ?? 0) || 0;
}

function examBest(student, type){
  const e = student?.exams?.[type];
  return Number(e?.bestPercent ?? e?.percent ?? 0) || 0;
}

function weekMastered(student, week){
  return lessonCount(student, week) === 5 &&
         assignmentCount(student, week) === 3 &&
         quizBest(student, week) >= MASTER;
}

function highestUnlocked(student){
  if (!student) return 1;
  let unlocked = 1;
  for (let week = 1; week < 36; week++) {
    if (!weekMastered(student, week)) break;
    if (week === 18 && examBest(student, 'midterm') < MASTER) break;
    unlocked = week + 1;
  }
  return unlocked;
}

function statusText(student, week){
  if (!student) return 'Add a student to begin.';
  const l = lessonCount(student, week);
  const a = assignmentCount(student, week);
  const q = quizBest(student, week);
  const parts = [`${l}/5 lessons`, `${a}/3 assignments`, `${q || 0}% quiz`];
  if (week === 18) parts.push(`${examBest(student, 'midterm') || 0}% midterm`);
  return parts.join(' · ');
}

function addPolicyBanner(){
  if (document.getElementById('ss9MasteryPolicy')) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const p = document.createElement('div');
  p.id = 'ss9MasteryPolicy';
  p.className = 'notice';
  p.style.maxWidth = '900px';
  p.style.margin = '20px auto 0';
  p.innerHTML = `<strong>80% Mastery Path.</strong> Complete all five daily lessons, submit all three weekly assignments, and earn at least 80% on the weekly quiz to unlock the next week. Week 19 also requires 80% or higher on the midterm objective section. Teacher-reviewed writing remains part of the academic record.`;
  hero.appendChild(p);
}

function decorateWeeks(){
  const db = loadDB();
  const student = activeStudent(db);
  const unlocked = highestUnlocked(student);

  document.querySelectorAll('#weekList .weekBtn').forEach(btn => {
    const week = Number(btn.dataset.week);
    if (!week) return;
    const locked = week > unlocked;
    btn.disabled = locked;
    btn.setAttribute('aria-disabled', String(locked));
    btn.dataset.masteryLocked = locked ? 'true' : 'false';
    btn.title = locked
      ? `Locked. Master Week ${week - 1} first.`
      : statusText(student, week);

    let badge = btn.querySelector('.ss9-mastery-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'ss9-mastery-badge';
      badge.style.display = 'block';
      badge.style.fontSize = '.68rem';
      badge.style.marginTop = '.18rem';
      btn.firstElementChild?.appendChild(badge);
    }

    if (locked) {
      badge.textContent = 'Locked · 80% mastery required';
    } else if (weekMastered(student, week)) {
      badge.textContent = `Mastered · ${quizBest(student, week)}%`;
    } else {
      badge.textContent = statusText(student, week);
    }
  });
}

function enforceDirectWeek(){
  const requested = Number(new URLSearchParams(location.search).get('week')) || 1;
  const student = activeStudent(loadDB());
  const unlocked = highestUnlocked(student);
  if (requested <= unlocked) return;
  const safe = document.querySelector(`#weekList .weekBtn[data-week="${unlocked}"]`);
  if (safe && !safe.disabled) safe.click();
}

function wireHeroNavigation(){
  document.querySelectorAll('.hero [data-go]').forEach(btn => {
    if (btn.dataset.masteryWire === 'true') return;
    btn.dataset.masteryWire = 'true';
    btn.addEventListener('click', () => {
      const view = btn.dataset.go;
      const target = document.querySelector(`.tab[data-view="${view}"],.navBtn[data-view="${view}"]`);
      target?.click();
    });
  });
}

function refresh(){
  addPolicyBanner();
  wireHeroNavigation();
  decorateWeeks();
  enforceDirectWeek();
}

const style = document.createElement('style');
style.id = 'ss9-mastery-style-v2';
style.textContent = `
  #weekList .weekBtn[data-mastery-locked="true"]{opacity:.48;cursor:not-allowed;filter:grayscale(.35)}
  #weekList .weekBtn[data-mastery-locked="false"] .ss9-mastery-badge{opacity:.78}
  #weekList .weekBtn:disabled:hover{transform:none;filter:grayscale(.35)}
`;
document.head.appendChild(style);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', refresh, {once:true});
} else {
  refresh();
}

const weekList = document.getElementById('weekList');
if (weekList) new MutationObserver(decorateWeeks).observe(weekList,{childList:true,subtree:true});

window.addEventListener('storage', refresh);
document.addEventListener('change', () => setTimeout(refresh, 0));
document.addEventListener('click', () => setTimeout(refresh, 0));
})();
