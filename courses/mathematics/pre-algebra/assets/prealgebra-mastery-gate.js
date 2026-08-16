(() => {
  "use strict";
  const frame=document.getElementById("courseFrame");
  if(!frame)return;
  frame.addEventListener("load",()=>{
    const doc=frame.contentDocument;if(!doc)return;
    window.setTimeout(()=>{
      const script=doc.createElement("script");
      script.textContent=`(()=>{
"use strict";
const gateCfg=window.__KHAEMENES_PREALGEBRA__||{mode:"preview"};
const FORMAL=gateCfg.mode==="formal";
const TARGET=80;
const DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday"];
function friendly(msg){alert("You’re almost there. "+msg+" Finish the current learning step and come back — your progress is saved.");}
function currentStudent(){const s=student();ensure(s);return s;}
function masteredWeek(n){const s=currentStudent();return lessonPct(s,n)===100&&assignPct(s,n)===100&&quizBest(s,n)>=TARGET;}
function weeksMastered(a,b){for(let n=a;n<=b;n++)if(!masteredWeek(n))return false;return true;}
function midtermBest(){const s=currentStudent();return Number(s.progress.exams.midterm?.best||0);}
function weekAllowed(n){if(!FORMAL)return true;if(n===1)return true;if(n===19)return weeksMastered(1,18)&&midtermBest()>=TARGET;return masteredWeek(n-1);}
function firstMissingBefore(n){if(n<=1)return null;for(let i=1;i<n;i++)if(!masteredWeek(i))return i;return null;}
function applyWeekLocks(){
  if(!FORMAL)return;
  document.querySelectorAll("[data-week]").forEach(btn=>{
    const n=Number(btn.dataset.week),ok=weekAllowed(n);btn.setAttribute("aria-disabled",String(!ok));btn.style.opacity=ok?"1":".5";
    btn.onclick=()=>{
      if(!ok){const miss=firstMissingBefore(n);if(n>=19&&weeksMastered(1,18)&&midtermBest()<TARGET)return friendly("Semester II opens after the midterm reaches 80% mastery.");return friendly(`Week ${n} opens after ${miss?`Week ${miss}`:`the prior week`} reaches full lesson/assignment completion and 80% mastery.`)}
      activeWeek=n;view="week";render();
    };
  });
}
function applyDayLocks(){
  if(!FORMAL||view!=="week")return;
  const s=currentStudent(),r=weekRec(s,activeWeek);
  DAYS.forEach((d,i)=>{
    const box=document.getElementById("l_"+d);if(!box)return;
    const allowed=i===0||Boolean(r.lessons[DAYS[i-1]]);
    box.disabled=!allowed;box.title=allowed?"":"Complete the previous learning day first.";
  });
}
const oldRender=render;
render=function(){
  if(FORMAL&&view==="week"&&!weekAllowed(activeWeek)){
    const requested=activeWeek;activeWeek=Math.max(1,requested-1);while(activeWeek>1&&!weekAllowed(activeWeek))activeWeek--;friendly(`Week ${requested} is still locked by the prior mastery requirement.`);
  }
  oldRender();applyWeekLocks();applyDayLocks();
};
const oldSubmitQuiz=submitQuiz;
submitQuiz=function(){
  if(FORMAL){const s=currentStudent();if(lessonPct(s,activeWeek)<100)return friendly("The weekly mastery check opens after all five learning days are complete.");if(assignPct(s,activeWeek)<100)return friendly("Complete all three required weekly evidence assignments before submitting the mastery check.");}
  oldSubmitQuiz();
};
const oldSubmitExam=submitExam;
submitExam=function(name){
  if(FORMAL&&name==="midterm"&&!weeksMastered(1,18))return friendly("The midterm opens after Weeks 1–18 have each reached the required mastery evidence.");
  if(FORMAL&&name==="final"&&(!weeksMastered(1,36)||midtermBest()<TARGET))return friendly("The final opens after all 36 weeks and the midterm have reached the required mastery evidence.");
  oldSubmitExam(name);
};
const oldExams=exams;
exams=function(){oldExams();if(!FORMAL)return;const cards=document.querySelectorAll("#content .card");if(cards[0]&&!weeksMastered(1,18)){const n=document.createElement("p");n.className="notice";n.textContent="Midterm locked until Weeks 1–18 are mastered.";cards[0].appendChild(n)}if(cards[1]&&(!weeksMastered(1,36)||midtermBest()<TARGET)){const n=document.createElement("p");n.className="notice";n.textContent="Final locked until all 36 weeks and the midterm are mastered.";cards[1].appendChild(n)}};
render();
})();`;
      doc.body.appendChild(script);
    },180);
  });
})();