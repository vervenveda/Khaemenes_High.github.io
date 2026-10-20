/* Khaemenes Academy unified evidence print header v1. No external dependencies. */
(function(){
'use strict';
function clean(s){return String(s||'').replace(/\s+/g,' ').trim();}
function metadata(){
 const path=decodeURI(location.pathname);const h=clean(document.querySelector('main h1,article h1,h1')?.textContent);
 const gradeMatch=path.match(/(?:english-|grade[-_/]?|grade)(0?[9]|10|11|12)(?:\/|\b)/i)||path.match(/(?:english-|grade-)(0?[9]|10|11|12)/i);
 const subjectGrade=(path.match(/\/(?:integrated-science|biology|chemistry|physics-engineering)[-_](9|10|11|12)(?:\/|\b)/i)||[])[1];
 const grade=gradeMatch?Number(gradeMatch[1]):subjectGrade?Number(subjectGrade):(path.includes('/pre-algebra/')?9:null);
 const unit=(path.match(/unit[-_/]?(\d{1,2})/i)||[])[1];
 const lesson=(path.match(/lesson[-_/]?(\d{1,2})/i)||[])[1];
 const week=(path.match(/week[-_/]?(\d{1,2})/i)||[])[1];
 const subject=path.includes('language-arts')?'Language Arts':path.includes('mathematics')?'Mathematics':path.includes('physical-education')?'Physical Education':path.includes('social-studies')?'Social Studies':path.includes('science')?'Science':path.includes('/pe/')?'Physical Education':'High School Course';
 return {grade:grade?'Grade '+grade:'Grade: __________',subject,unit:unit?'Unit '+unit:'Unit: __________',lesson:lesson?'Lesson '+lesson:week?'Week '+week:'Lesson: __________',heading:h};
}
function attach(){
 if(document.querySelector('.pe-print-heading, .academy-unified-print-heading'))return;
 if(document.documentElement.dataset.academyPrintOptOut==='true')return;
 const d=metadata(),el=document.createElement('section');el.className='academy-unified-print-heading';el.setAttribute('aria-hidden','true');
 // textContent only: course titles are displayed safely, never inserted as HTML
 const title=document.createElement('div');title.className='academy-print-title';title.textContent='Khaemenes Academy';el.appendChild(title);
 const meta=document.createElement('div');meta.className='academy-print-meta';meta.textContent=[d.subject,d.grade,d.unit,d.lesson].join('  ·  ');el.appendChild(meta);
 if(d.heading){const subtitle=document.createElement('div');subtitle.className='academy-print-lesson';subtitle.textContent=d.heading;el.appendChild(subtitle);}
 const fields=document.createElement('div');fields.className='academy-print-fields';for(const label of ['Student Name','Date']){let span=document.createElement('span');span.textContent=label+': ';span.appendChild(document.createElement('i'));fields.appendChild(span);}el.appendChild(fields);
 document.body.prepend(el);
 const style=document.createElement('style');style.textContent=`
.academy-unified-print-heading{display:none}
@media print{
 @page{margin:1.15in .6in .65in}
 .academy-unified-print-heading{display:block!important;position:fixed;top:-.96in;left:0;right:0;color:#151515!important;background:#fff!important;text-align:center;font:10pt/1.25 Arial,sans-serif;border-bottom:1px solid #888;padding:0 0 .08in;z-index:2147483646}
 .academy-print-title{font:normal 16pt/1.2 Cinzel,Georgia,serif!important;letter-spacing:.02em}
 .academy-print-meta{font:9pt/1.2 Arial,sans-serif!important;margin-top:3px}
 .academy-print-lesson{font:9pt/1.2 Arial,sans-serif!important;margin-top:2px;max-height:2.4em;overflow:hidden}
 .academy-print-fields{display:flex;justify-content:space-between;gap:.32in;text-align:left;margin-top:7px}
 .academy-print-fields span{display:flex;align-items:end;gap:7px;width:50%;white-space:nowrap}
 .academy-print-fields i{border-bottom:1px solid #555;height:13px;flex:1}
 .academy-unified-print-heading *{color:#151515!important}
}`;document.head.appendChild(style);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach,{once:true});else attach();
})();