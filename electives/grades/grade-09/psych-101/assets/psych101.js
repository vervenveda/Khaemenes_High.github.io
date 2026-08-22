(function(){
  'use strict';

  const KEYS={
    progress:'psych101_grade9_progress_v1',
    assessments:'psych101_grade9_assessments_v1',
    notebook:'psych101_grade9_notebook_v1',
    journal:'psych101_grade9_journal_v1',
    words:'psych101_grade9_words_v1',
    preferences:'psych101_grade9_preferences_v1'
  };
  const MASTERY=80;

  function read(key,fallback){
    try{
      const raw=localStorage.getItem(key);
      if(!raw)return structuredCloneSafe(fallback);
      const parsed=JSON.parse(raw);
      return parsed ?? structuredCloneSafe(fallback);
    }catch(_){return structuredCloneSafe(fallback);}
  }
  function write(key,value){
    try{localStorage.setItem(key,JSON.stringify(value));return true;}catch(_){return false;}
  }
  function structuredCloneSafe(v){
    try{return JSON.parse(JSON.stringify(v));}catch(_){return v;}
  }
  function now(){return new Date().toISOString();}
  function lessonId(week,day){return String(week).padStart(2,'0')+'-'+String(day).padStart(2,'0');}

  function getProgress(){
    const p=read(KEYS.progress,{version:1,lessons:{},updatedAt:null});
    if(!p.lessons||typeof p.lessons!=='object')p.lessons={};
    return p;
  }
  function saveProgress(p){p.updatedAt=now();return write(KEYS.progress,p);}
  function markLessonReviewed(id,reviewed=true){
    const p=getProgress();
    const old=p.lessons[id]||{};
    p.lessons[id]={...old,reviewed:!!reviewed,reviewedAt:reviewed?now():null};
    saveProgress(p);return p.lessons[id];
  }
  function setLessonDraft(id,field,value){
    const p=getProgress();
    const old=p.lessons[id]||{};
    const drafts={...(old.drafts||{}),[field]:String(value??'')};
    p.lessons[id]={...old,drafts,lastEditedAt:now()};
    saveProgress(p);return drafts[field];
  }
  function getLesson(id){return getProgress().lessons[id]||{};}

  function getAssessments(){
    const a=read(KEYS.assessments,{version:1,weeks:{},cumulative:{},updatedAt:null});
    if(!a.weeks||typeof a.weeks!=='object')a.weeks={};
    return a;
  }
  function saveAssessments(a){a.updatedAt=now();return write(KEYS.assessments,a);}
  function recordWeeklyScore(week,score,form='A'){
    const n=Math.max(0,Math.min(100,Number(score)||0));
    const a=getAssessments();
    const key=String(week).padStart(2,'0');
    const old=a.weeks[key]||{attempts:[]};
    const attempts=Array.isArray(old.attempts)?old.attempts:[];
    attempts.push({score:n,form:String(form),at:now()});
    a.weeks[key]={attempts,bestScore:Math.max(n,...attempts.map(x=>Number(x.score)||0)),mastered:Math.max(n,...attempts.map(x=>Number(x.score)||0))>=MASTERY};
    saveAssessments(a);return a.weeks[key];
  }
  function weeklyBest(week){
    const key=String(week).padStart(2,'0');
    const w=getAssessments().weeks[key];
    if(!w)return null;
    const scores=(w.attempts||[]).map(x=>Number(x.score)).filter(Number.isFinite);
    return scores.length?Math.max(...scores):null;
  }
  function isWeekMastered(week){
    const best=weeklyBest(week);
    return best!==null&&best>=MASTERY;
  }

  function getNotebook(){return read(KEYS.notebook,{version:1,entries:{},updatedAt:null});}
  function setNotebook(id,value){const n=getNotebook();n.entries=n.entries||{};n.entries[id]=String(value??'');n.updatedAt=now();write(KEYS.notebook,n);}
  function getJournal(){return read(KEYS.journal,{version:1,entries:{},updatedAt:null});}
  function setJournal(id,value){const j=getJournal();j.entries=j.entries||{};j.entries[id]=String(value??'');j.updatedAt=now();write(KEYS.journal,j);}

  function exportAll(){
    const bundle={
      schema:'psych101-grade9-export-v1',
      exportedAt:now(),
      data:{
        progress:read(KEYS.progress,null),
        assessments:read(KEYS.assessments,null),
        notebook:read(KEYS.notebook,null),
        journal:read(KEYS.journal,null),
        words:read(KEYS.words,null),
        preferences:read(KEYS.preferences,null)
      }
    };
    const blob=new Blob([JSON.stringify(bundle,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download='psychology-101-progress.json';
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  function importAll(text){
    const bundle=JSON.parse(text);
    if(!bundle||bundle.schema!=='psych101-grade9-export-v1'||!bundle.data)throw new Error('This is not a recognized Psychology 101 export.');
    const map={progress:KEYS.progress,assessments:KEYS.assessments,notebook:KEYS.notebook,journal:KEYS.journal,words:KEYS.words,preferences:KEYS.preferences};
    Object.entries(map).forEach(([name,key])=>{
      const value=bundle.data[name];
      if(value!==undefined&&value!==null)write(key,value);
    });
    return true;
  }

  function resetAll(){Object.values(KEYS).forEach(k=>localStorage.removeItem(k));}

  function bindDrafts(root=document){
    root.querySelectorAll('[data-psych-draft]').forEach(el=>{
      const id=el.getAttribute('data-lesson-id')||document.body.getAttribute('data-lesson-id');
      const field=el.getAttribute('data-psych-draft');
      if(!id||!field)return;
      const saved=getLesson(id).drafts?.[field];
      if(saved!==undefined&&saved!==null&&!el.value)el.value=saved;
      el.addEventListener('input',()=>setLessonDraft(id,field,el.value));
    });
  }

  function bindLessonCompletion(root=document){
    const id=document.body.getAttribute('data-lesson-id');
    if(!id)return;
    const btn=root.querySelector('[data-mark-reviewed]');
    const status=root.querySelector('[data-review-status]');
    const render=()=>{
      const reviewed=!!getLesson(id).reviewed;
      if(status)status.textContent=reviewed?'Reviewed locally':'Not yet marked reviewed';
      if(btn)btn.textContent=reviewed?'Reviewed ✓':'Mark lesson reviewed';
      if(btn)btn.classList.toggle('success',reviewed);
    };
    if(btn)btn.addEventListener('click',()=>{markLessonReviewed(id,!getLesson(id).reviewed);render();});
    render();
  }

  function announce(message){
    let el=document.getElementById('psych-live');
    if(!el){el=document.createElement('div');el.id='psych-live';el.setAttribute('aria-live','polite');el.style.position='absolute';el.style.left='-9999px';document.body.appendChild(el);}
    el.textContent='';setTimeout(()=>{el.textContent=message;},20);
  }

  window.Psych101={
    KEYS,MASTERY,lessonId,getProgress,getLesson,markLessonReviewed,setLessonDraft,
    getAssessments,recordWeeklyScore,weeklyBest,isWeekMastered,
    getNotebook,setNotebook,getJournal,setJournal,
    exportAll,importAll,resetAll,bindDrafts,bindLessonCompletion,announce
  };

  document.addEventListener('DOMContentLoaded',()=>{
    bindDrafts();
    bindLessonCompletion();
    document.querySelectorAll('[data-print]').forEach(b=>b.addEventListener('click',()=>window.print()));
    document.querySelectorAll('[data-export]').forEach(b=>b.addEventListener('click',exportAll));
  });
})();
