from pathlib import Path
import re

DASH = Path('grades/grade-09/student-profile/index.html')
DAILY = Path('grades/grade-09/student-profile/daily-lessons/index.html')
PRENAV = Path('courses/mathematics/pre-algebra/assets/prealgebra-student-navigation.js')


def replace_once(text, old, new, label):
    if old not in text:
        if new in text:
            return text
        raise SystemExit(f'{label}: expected source text not found; refusing to guess')
    return text.replace(old, new, 1)


def replace_function(text, name, new_block):
    pattern = re.compile(rf'  function {re.escape(name)}\([^\n]*\)\{{.*?\n  \}}', re.S)
    match = pattern.search(text)
    if not match:
        if new_block.strip() in text:
            return text
        raise SystemExit(f'function {name}: expected function block not found')
    return text[:match.start()] + new_block + text[match.end():]

# ---------------- Dashboard ----------------
text = DASH.read_text(encoding='utf-8')
text = replace_once(
    text,
    '<h2 id="manageClassesTitle">Manage Core Classes</h2>\n        <p>Use the star button to add or remove a class from My Pinned Classes. Opening a class does not change grades or mastery records.</p>',
    '<h2 id="manageClassesTitle">Manage Classes &amp; Mathematics Pathway</h2>\n        <p>Pin regular classes for one-click access. Mathematics is placement-based: only one mathematics course is treated as the active pinned pathway at a time. Changing the math pin changes the doorway, not grades or mastery evidence.</p>',
    'dashboard manager copy'
)

text = replace_function(text, 'renderPinned', '''  async function renderPinned(){
    const host=document.getElementById('pinnedCoursesGrid');
    const pinned=registry.pinnedCourses();
    if(!pinned.length){
      host.innerHTML='<div class="notice" style="grid-column:1/-1"><strong>No classes pinned yet.</strong> Use Manage Classes & Mathematics Pathway below and press ☆ Pin Class. Your pinned classes will stay at the top of this dashboard.</div>';
      return;
    }
    const cards=await Promise.all(pinned.map(async course=>{
      const current=await registry.resolveContinueFor(course.id);
      return `<article class="lesson-card ${course.className}">
        <div class="chip-row"><span class="chip">★ Pinned</span><span class="chip">${escapeHTML(course.subject)}</span>${registry.isMathCourse(course.id)?'<span class="chip">Current math path</span>':''}</div>
        <h3>${escapeHTML(course.title)}</h3>
        <p>${escapeHTML(current?.detail||`${course.subject} · pinned to your dashboard`)}</p>
        <div class="actions">
          <a class="btn" data-launch-course="${course.id}" href="${escapeHTML(current?.url||course.home)}">${escapeHTML(current?.actionLabel||`Open ${course.short}`)}</a>
          <a class="btn secondary" href="${escapeHTML(registry.mentorFor(course.id))}">Ask Mentor</a>
          <button class="btn secondary" type="button" data-unpin-course="${course.id}">Unpin</button>
        </div>
      </article>`;
    }));
    host.innerHTML=cards.join('');
    host.querySelectorAll('[data-unpin-course]').forEach(button=>button.addEventListener('click',()=>{
      registry.setPinned(button.dataset.unpinCourse,false);
      void renderAll();
    }));
    bindLaunches(host);
  }''')

text = replace_function(text, 'renderManager', '''  async function renderManager(){
    const host=document.getElementById('courseManagerGrid');
    const activeMath=registry.mathPathway();
    const cards=await Promise.all(registry.courses.map(async course=>{
      const pinned=registry.isPinned(course.id);
      const current=await registry.resolveContinueFor(course.id);
      const mathChip=registry.isMathCourse(course.id)?`<span class="chip">${activeMath===course.id?'Current math path':'Math option'}</span>`:'';
      const description=registry.isMathCourse(course.id)
        ? (activeMath===course.id?'This is the active mathematics pathway for this browser profile.':'Choose this only when readiness/mastery evidence or family/teacher placement makes it the learner’s current mathematics course.')
        : (pinned?'This class is already at the top of your dashboard.':'Pin this class to make it an everyday one-click door.');
      return `<article class="lesson-card ${course.className}">
        <div class="chip-row"><span class="chip">${escapeHTML(course.subject)}</span><span class="chip">${pinned?'Pinned':'Available'}</span>${mathChip}</div>
        <h3>${escapeHTML(course.title)}</h3>
        <p>${escapeHTML(description)}</p>
        <div class="actions">
          <button class="btn ${pinned?'secondary':''}" type="button" data-toggle-course="${course.id}" aria-pressed="${pinned}">${pinned?'★ Pinned':'☆ Pin Class'}</button>
          <a class="btn secondary" data-launch-course="${course.id}" href="${escapeHTML(current?.url||course.home)}">${escapeHTML(current?.actionLabel||'Course Home')}</a>
        </div>
      </article>`;
    }));
    host.innerHTML=cards.join('');
    host.querySelectorAll('[data-toggle-course]').forEach(button=>button.addEventListener('click',()=>{
      registry.togglePinned(button.dataset.toggleCourse);
      void renderAll();
    }));
    bindLaunches(host);
  }''')

text = replace_function(text, 'renderToday', '''  async function renderToday(){
    const focus=document.getElementById('todayFocus');
    if(note&&note.trim()){focus.textContent=note.trim();return}
    const pinned=registry.pinnedCourses();
    const mathId=registry.mathPathway();
    if(mathId){
      const math=registry.getCourse(mathId),next=await registry.resolveContinueFor(mathId);
      focus.textContent=`Mathematics: ${math?.title||'current pathway'}. ${next?.detail||'Open Daily Lessons to continue.'}`;
      return;
    }
    focus.textContent=pinned.length
      ? `${pinned.length} pinned ${pinned.length===1?'class is':'classes are'} ready. Open Daily Lessons and choose today’s first class.`
      : 'Open Daily Lessons and choose the first assigned class. You can pin regular classes and choose the current mathematics pathway below.';
  }''')

text = replace_once(
    text,
    '  function renderAll(){renderPinned();renderManager();renderToday()}\n  window.addEventListener(\'storage\',event=>{\n    if(event.key===registry.PIN_KEY||event.key===registry.PREALGEBRA_CONTINUE_KEY||event.key===registry.LAST_LAUNCH_KEY)renderAll();\n  });\n  renderAll();',
    '  async function renderAll(){await Promise.all([renderPinned(),renderManager(),renderToday()])}\n  window.addEventListener(\'storage\',event=>{\n    if(registry.shouldRefreshForStorageKey(event.key))void renderAll();\n  });\n  void renderAll();',
    'dashboard render all'
)
DASH.write_text(text, encoding='utf-8')

# ---------------- Daily Lessons ----------------
text = DAILY.read_text(encoding='utf-8')
text = replace_once(
    text,
    'placeholder="Example: Finish Pre-Algebra, then complete English reading."',
    'placeholder="Example: Complete today’s mathematics step, then finish English reading."',
    'daily note placeholder'
)

text = replace_function(text, 'renderPinned', '''  async function renderPinned(){
    const host=document.getElementById('pinnedDailyGrid');
    const pinned=registry.pinnedCourses();
    const primary=document.getElementById('dailyPrimaryStart');
    if(!pinned.length){
      host.innerHTML='<div class="notice" style="grid-column:1/-1"><strong>No classes pinned yet.</strong> Use Class Doors below and press ☆ Pin Class. Once pinned, your regular classes will appear here every day.</div>';
      primary.href='#classDoorsTitle';
      primary.textContent='Choose First Class';
      delete primary.dataset.launchCourse;
      return;
    }
    const resolved=await Promise.all(pinned.map(async course=>({course,current:await registry.resolveContinueFor(course.id)})));
    host.innerHTML=resolved.map(({course,current})=>`<article class="lesson-card ${course.className}">
        <div class="chip-row"><span class="chip">★ Pinned</span><span class="chip">${escapeHTML(course.subject)}</span>${registry.isMathCourse(course.id)?'<span class="chip">Current math path</span>':''}</div>
        <h3>${escapeHTML(course.title)}</h3>
        <p>${escapeHTML(current?.detail||`${course.subject} · ready for today`)}</p>
        <div class="actions">
          <a class="btn" data-launch-course="${course.id}" href="${escapeHTML(current?.url||course.home)}">${escapeHTML(current?.actionLabel||`Open ${course.short}`)}</a>
          <a class="btn secondary" href="${escapeHTML(registry.mentorFor(course.id))}">Ask Mentor</a>
        </div>
      </article>`).join('');
    const first=resolved[0];
    primary.href=first.current?.url||first.course.home;
    primary.dataset.launchCourse=first.course.id;
    primary.textContent=first.current?.actionLabel||`Open ${first.course.short}`;
    bindLaunches(host);
    bindLaunches(document.querySelector('.hero'));
  }''')

text = replace_function(text, 'renderClassDoors', '''  async function renderClassDoors(){
    const host=document.getElementById('dailyClassGrid');
    const activeMath=registry.mathPathway();
    const resolved=await Promise.all(registry.courses.map(async course=>({course,current:await registry.resolveContinueFor(course.id)})));
    host.innerHTML=resolved.map(({course,current})=>{
      const pinned=registry.isPinned(course.id);
      const mathChip=registry.isMathCourse(course.id)?`<span class="chip">${activeMath===course.id?'Current math path':'Math option'}</span>`:'';
      const description=registry.isMathCourse(course.id)
        ? (activeMath===course.id?(current?.detail||'Current mathematics pathway.'):'Choose this pathway only when placement/readiness evidence makes it the learner’s current mathematics course.')
        : (pinned?'Pinned to Student Home and Daily Lessons.':'Pin this class if it is part of the regular daily schedule.');
      return `<article class="lesson-card ${course.className}">
        <div class="chip-row"><span class="chip">${escapeHTML(course.subject)}</span><span class="chip">${pinned?'Pinned':'Available'}</span>${mathChip}</div>
        <h3>${escapeHTML(course.title)}</h3>
        <p>${escapeHTML(description)}</p>
        <div class="actions">
          <a class="btn" data-launch-course="${course.id}" href="${escapeHTML(current?.url||course.home)}">${escapeHTML(current?.actionLabel||`Open ${course.short}`)}</a>
          <button class="btn secondary" type="button" data-toggle-course="${course.id}" aria-pressed="${pinned}">${pinned?'★ Pinned':'☆ Pin Class'}</button>
        </div>
      </article>`;
    }).join('');
    host.querySelectorAll('[data-toggle-course]').forEach(button=>button.addEventListener('click',()=>{
      registry.togglePinned(button.dataset.toggleCourse);
      void renderCourses();
    }));
    bindLaunches(host);
  }''')

text = replace_once(
    text,
    '  function renderCourses(){\n    const primary=document.getElementById(\'dailyPrimaryStart\');\n    delete primary.dataset.launchCourse;\n    renderPinned();\n    renderClassDoors();\n  }',
    '  async function renderCourses(){\n    const primary=document.getElementById(\'dailyPrimaryStart\');\n    delete primary.dataset.launchCourse;\n    await Promise.all([renderPinned(),renderClassDoors()]);\n  }',
    'daily render courses'
)
text = replace_once(
    text,
    '  window.addEventListener(\'storage\',event=>{\n    if(event.key===registry.PIN_KEY||event.key===registry.PREALGEBRA_CONTINUE_KEY||event.key===registry.LAST_LAUNCH_KEY)renderCourses();\n  });\n  renderCourses();',
    '  window.addEventListener(\'storage\',event=>{\n    if(registry.shouldRefreshForStorageKey(event.key))void renderCourses();\n  });\n  void renderCourses();',
    'daily storage listener'
)
DAILY.write_text(text, encoding='utf-8')

# ---------------- Pre-Algebra own Pin Class control ----------------
text = PRENAV.read_text(encoding='utf-8')
text = replace_once(
    text,
    'const PIN_KEY="khaemenes-high-pinned-courses-v2";\nconst COURSE_ID="pre-algebra";',
    'const PIN_KEY="khaemenes-high-pinned-courses-v2";\nconst MATH_PATHWAY_KEY="khaemenes-high-math-pathway-v1";\nconst COURSE_ID="pre-algebra";\nconst OTHER_MATH_ID="algebra-1";',
    'prealgebra pin constants'
)
text = replace_once(
    text,
    '  const next=wasPinned?pins.filter(id=>id!==COURSE_ID):[COURSE_ID,...pins.filter(id=>id!==COURSE_ID)];\n  if(!writeJSON(PIN_KEY,next)){',
    '  const next=wasPinned?pins.filter(id=>id!==COURSE_ID):[COURSE_ID,...pins.filter(id=>id!==COURSE_ID&&id!==OTHER_MATH_ID)];\n  if(!writeJSON(PIN_KEY,next)){',
    'prealgebra exclusive pin'
)
text = replace_once(
    text,
    '  updatePinButton();\n  const status=document.getElementById("preAlgebraNavStatus");',
    '  if(!wasPinned)writeJSON(MATH_PATHWAY_KEY,COURSE_ID);\n  updatePinButton();\n  const status=document.getElementById("preAlgebraNavStatus");',
    'prealgebra pathway record'
)
PRENAV.write_text(text, encoding='utf-8')

print('Applied Grade 09 placement-aware mathematics dashboard repair.')
