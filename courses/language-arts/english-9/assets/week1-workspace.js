(() => {
  "use strict";
  const records=window.KhaemenesEnglish9Records;
  if(!records || !document.querySelector('[data-week1-workspace]'))return;
  const $=id=>document.getElementById(id);
  const status=$('week1-save-status'),error=$('week1-save-error');
  const known=new Map();let blocked=false;
  const identityRaw=(()=>{try{return localStorage.getItem('khaemenes_active_learner_v1')}catch{return undefined}})();
  function fail(message){blocked=true;status.textContent='Work is not saved.';error.hidden=false;error.textContent=message+' Keep this page open and copy any unsaved writing before reloading.';}
  function read(key){try{const raw=localStorage.getItem(key);known.set(key,raw);return raw;}catch{fail('This browser cannot read saved work.');return null;}}
  function write(key,value){
    if(blocked)return false;
    try{
      if(localStorage.getItem('khaemenes_active_learner_v1')!==identityRaw){fail('The selected learner changed.');return false;}
      if(localStorage.getItem(key)!==known.get(key)){fail('This record changed in another tab. Saving paused to protect both copies.');return false;}
      localStorage.setItem(key,value);known.set(key,value);
      status.textContent='Saved on this device · '+new Date().toLocaleTimeString();return true;
    }catch{fail('The browser could not save this change. Storage may be full or unavailable.');return false;}
  }
  const fieldKey=name=>records.storageKey('khae-ela9-field:'+name);
  const fields=Array.from(document.querySelectorAll('[data-managed-save="week1"]'));
  fields.forEach(field=>{const key=fieldKey(field.dataset.saveField);field.value=read(key)||'';field.addEventListener('input',()=>write(key,field.value));});
  const baselineKey=fieldKey('week-01-baseline-snapshot');let baseline=read(baselineKey);
  const baselineButton=$('preserve-baseline');
  function showBaseline(){ $('baseline-copy').textContent=baseline||'';$('baseline-status').textContent=baseline?'Original baseline preserved. Later edits will not replace this copy.':'Write your Day 1 response, then preserve its original version.';baselineButton.disabled=Boolean(baseline)||blocked; }
  showBaseline();
  baselineButton.addEventListener('click',()=>{const field=fields.find(x=>x.dataset.saveField==='week-01-day1-baseline');if(!field.value.trim()){ $('baseline-status').textContent='Write a baseline response before preserving it.';return; }if(baseline)return;if(write(baselineKey,field.value)){baseline=field.value;showBaseline();}});
  const progressKey=records.storageKey('khae-ela9-progress-v1');const progressRaw=read(progressKey);let progress={};
  try{progress=JSON.parse(progressRaw||'{}');if(!progress || typeof progress!=='object' || Array.isArray(progress) || Object.values(progress).some(v=>typeof v!=='boolean'))throw Error();}catch{fail('Saved course progress is unreadable; it has been preserved without changes.');}
  const prepared=document.querySelector('[data-managed-progress="week1"]');
  function progressLabel(){prepared.textContent=progress['week-01']?'Evidence prepared ✓':'Mark Evidence Prepared';prepared.setAttribute('aria-pressed',String(Boolean(progress['week-01'])));}
  progressLabel();prepared.addEventListener('click',()=>{const next={...progress,'week-01':!progress['week-01']};if(write(progressKey,JSON.stringify(next))){progress=next;progressLabel();}});
  const phases=['read','practice','write','check'];let day=1,phase='read';
  const positionKey=fieldKey('week-01-workspace-position');const positionRaw=read(positionKey);
  try{const pos=JSON.parse(positionRaw||'null');if(pos&&Number.isInteger(pos.day)&&pos.day>=1&&pos.day<=5&&phases.includes(pos.phase)){day=pos.day;phase=pos.phase;}}catch{ /* Preserve malformed position until explicit navigation. Writing records are independent. */ }
  const hash=location.hash.match(/^#day([1-5])(?:-(read|practice|write|check))?$/);if(hash){day=Number(hash[1]);phase=hash[2]||'read';}
  function render(focus=false){
    document.querySelectorAll('.phase').forEach(section=>section.hidden=!(Number(section.dataset.day)===day && section.dataset.phase===phase));
    document.querySelectorAll('[data-select-day]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.selectDay)===day)));
    document.querySelectorAll('[data-select-phase]').forEach(b=>b.setAttribute('aria-current',b.dataset.selectPhase===phase?'step':'false'));
    $('workspace-heading').textContent=`Day ${day} of 5 · Step ${phases.indexOf(phase)+1} of 4 · ${phase[0].toUpperCase()+phase.slice(1)}`;
    $('previous-step').disabled=day===1&&phase==='read';
    $('next-step').disabled=day===5&&phase==='check';
    $('next-step').textContent=phase==='check'&&day<5?`Open Day ${day+1}`:'Next step';
    if(focus)$(`heading-${day}-${phase}`).focus();
  }
  function navigate(d,p){day=d;phase=p;write(positionKey,JSON.stringify({day,phase}));history.replaceState(null,'',`#day${day}-${phase}`);render(true);}
  document.querySelectorAll('[data-select-day]').forEach(b=>b.addEventListener('click',()=>navigate(Number(b.dataset.selectDay),'read')));
  document.querySelectorAll('[data-select-phase]').forEach(b=>b.addEventListener('click',()=>navigate(day,b.dataset.selectPhase)));
  $('next-step').addEventListener('click',()=>{const n=(day-1)*4+phases.indexOf(phase)+1;if(n<20)navigate(Math.floor(n/4)+1,phases[n%4]);});
  $('previous-step').addEventListener('click',()=>{const n=(day-1)*4+phases.indexOf(phase)-1;if(n>=0)navigate(Math.floor(n/4)+1,phases[n%4]);});
  render();if(!blocked)status.textContent='Workspace ready · Writing saves on this device.';
  $('export-week1').addEventListener('click',()=>{
    // Capture visible drafts too, so a storage failure need not lose unsaved writing.
    const writing=Object.fromEntries(fields.map(f=>[f.dataset.saveField,f.value]));
    const backup={schema:'khaemenes-english9-week1-backup-v1',exportedAt:new Date().toISOString(),learnerId:records.profile?.learnerId||null,writing,baseline,position:{day,phase},evidencePrepared:Boolean(progress['week-01']),containsUnsavedDrafts:blocked};
    const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='english9-week1-backup.json';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
})();
