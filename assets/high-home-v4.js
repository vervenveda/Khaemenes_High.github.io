(() => {
  "use strict";

  const $=id=>document.getElementById(id);
  const clean=(value,max=120)=>String(value??"").replace(/[\u0000-\u001F\u007F]/g,"").trim().slice(0,max);
  const params=new URLSearchParams(location.search);
  const entry=clean(params.get("entry"),60);
  const FAVORITES_KEY="khaemenes-high-resource-favorites-v3";
  const REGISTRY_URL="https://vervenveda.com/assessment-engine/mentor/registry/ecosystem-resources.json";

  const grades={
    "grade-09":{label:"9",title:"Ninth Grade",anchor:"#grade-nine",portal:"grades/grade-09/index.html"},
    "grade-10":{label:"10",title:"Tenth Grade",anchor:"#grade-ten",portal:"grades/grade-10/index.html"},
    "grade-11":{label:"11",title:"Eleventh Grade",anchor:"#grade-eleven",portal:"grades/grade-11/index.html"},
    "grade-12":{label:"12",title:"Twelfth Grade",anchor:"#grade-twelve",portal:"grades/grade-12/index.html"}
  };

  const resources=[
    {title:"Khaemenes Academy",kind:"Academy",description:"Family profiles, school-stage continuity, and Academy-wide pathways.",url:"https://vervenveda.com/Khaemenes_Academy.github.io/"},
    {title:"ARSHIF",kind:"Research",description:"Archives, literature, history, philosophy, and scholarly research halls.",url:"https://vervenveda.com/Arshif.github.io/"},
    {title:"The Refrain",kind:"Music",description:"Music study, composition, production, listening, and performance.",url:"https://vervenveda.com/the_refrain.github.io/"},
    {title:"Bazaar Art",kind:"Art",description:"Visual art, creative studios, portfolios, and design work.",url:"https://vervenveda.com/bazaarart.github.io/"},
    {title:"ProReSources",kind:"Tools",description:"Writing, coding, CAD, calculators, media, and project tools.",url:"https://vervenveda.com/proresource_hub.github.io/"},
    {title:"The Verifier",kind:"Media Literacy",description:"Current events, source comparison, verification, and information literacy.",url:"https://vervenveda.com/theverifier.github.io/"},
    {title:"PLERA Search",kind:"Research",description:"Research and discovery gateway for public information and learning resources.",url:"https://vervenveda.com/PLERASearch.github.io/"},
    {title:"Career Portal",kind:"Career",description:"Career assessment, professional skills, exploration, and future planning.",url:"https://vervenveda.com/Khaemenes_Higher_Learning.github.io/Career/"},
    {title:"Higher Learning",kind:"Next Stage",description:"Advanced mathematics, research, university-level study, and professional learning.",url:"https://vervenveda.com/Khaemenes_Higher_Learning.github.io/"}
  ];

  function summary(){
    try{return window.KhaemenesHighContinuity?.getSummary?.()||{eligible:false,learner:null,mentor:null,reason:"unavailable"}}
    catch{return {eligible:false,learner:null,mentor:null,reason:"unavailable"}}
  }

  function rawLearner(){
    try{return window.KhaemenesFamilyRegistry?.getLearner?.()||null}catch{return null}
  }

  function renderEntry(){
    const s=summary();
    const raw=rawLearner();
    const card=$("entryStatus");
    const title=$("entryTitle");
    const text=$("entryText");
    const primary=$("entryPrimary");
    const secondary=$("entrySecondary");
    const mentor=$("mentorStatus");
    if(!card||!title||!text||!primary||!secondary)return;

    card.dataset.mode="neutral";
    primary.hidden=false;secondary.hidden=false;

    const stage=clean(raw?.stage,40).toLowerCase();
    const grade=clean(raw?.grade||raw?.gradeLevel,40).toLowerCase().replace(/[_\s]+/g,"-");
    const grade08=stage==="middle"&&/(?:grade-?)?0?8\b/.test(grade);
    const nickname=clean(raw?.nickname||raw?.displayName||"Scholar",80);
    const preview=entry==="grade08-advanced-preview";
    const transition=entry==="grade08-transition";

    if(preview){
      card.dataset.mode="preview";
      title.textContent=grade08?`Welcome to the Grade 09 preview, ${nickname}.`:"Advanced Grade 09 Preview";
      text.textContent="This doorway is for enrichment and readiness exploration only. Formal placement remains unchanged, High School grade records stay locked unless the Academy Family Registry later reports a formal High School grade, and this page never promotes a learner.";
      primary.href="grades/grade-09/index.html";primary.textContent="Preview Grade 09 Learning Portal";
      secondary.href="https://vervenveda.com/Khaemenes_Middle.github.io/?entry=grade08-transition#transition";secondary.textContent="Return to Middle School Transition";
    }else if(transition){
      card.dataset.mode="preview";
      title.textContent=grade08?`High School transition center for ${nickname}`:"Grade 08 → High School Transition";
      text.textContent="Use this campus to understand Grade 09 expectations, pathways, and resources. Formal promotion remains an explicit Academy/family placement action.";
      primary.href="grades/grade-09/index.html";primary.textContent="Explore Grade 09";
      secondary.href="https://vervenveda.com/Khaemenes_Academy.github.io/family/";secondary.textContent="Review Family Profile";
    }else if(s.eligible&&s.learner){
      card.dataset.mode="formal";
      const g=grades[s.learner.grade];
      title.textContent=`Welcome back, ${s.learner.nickname}. ${g?.title||"High School"} is ready.`;
      text.textContent=`Your Academy Family Profile places you in ${s.learner.grade}. Archaemenes continues here as Academy Scholar. Formal course evidence remains inside the individual course portals.`;
      primary.href=g?.portal||g?.anchor||"#grades";primary.textContent=`Open Grade ${g?.label||"Path"} Portal`;
      secondary.href="https://vervenveda.com/Khaemenes_Academy.github.io/family/";secondary.textContent="Open Family Profile";
    }else if(grade08){
      card.dataset.mode="preview";
      title.textContent=`Welcome, ${nickname}. You are still formally in Grade 08.`;
      text.textContent="High School may be explored for planning and challenge, but Grade 09 formal records remain unavailable until placement is deliberately changed in the Academy Family Profile.";
      primary.href="?entry=grade08-advanced-preview#entry";primary.textContent="Open Grade 09 Preview";
      secondary.href="https://vervenveda.com/Khaemenes_Middle.github.io/";secondary.textContent="Return to Middle School";
    }else{
      title.textContent="Choose the correct High School doorway.";
      text.textContent="Select an Academy learner in the Family Profile, or browse Grades 09–12. This landing page never creates a second learner identity and never writes formal grade placement.";
      primary.href="#grades";primary.textContent="Browse Grades 09–12";
      secondary.href="https://vervenveda.com/Khaemenes_Academy.github.io/family/";secondary.textContent="Open Family Profile";
    }

    if(mentor){
      const m=s.mentor||{name:"Archaemenes"};
      mentor.textContent=`${m.name||"Archaemenes"} · Academy Scholar${m.delegatedBy==="NAIB"?" · delegated through NAIB":""}`;
    }
  }

  function renderResources(){
    const grid=$("resourceGrid"),search=$("resourceSearch"),kind=$("resourceKind");
    if(!grid||!search||!kind)return;
    const kinds=[...new Set(resources.map(r=>r.kind))].sort();
    for(const k of kinds){const o=document.createElement("option");o.value=k;o.textContent=k;kind.append(o)}
    const draw=()=>{
      const q=clean(search.value,100).toLowerCase();
      const k=kind.value;
      const list=resources.filter(r=>(!k||r.kind===k)&&(!q||`${r.title} ${r.kind} ${r.description}`.toLowerCase().includes(q)));
      grid.replaceChildren();
      for(const r of list){
        const article=document.createElement("article");article.className="card resource-card";
        const emblem=document.createElement("div");emblem.className="emblem";emblem.textContent=r.kind.slice(0,2).toUpperCase();
        const h=document.createElement("h3");h.textContent=r.title;
        const p=document.createElement("p");p.textContent=r.description;
        const a=document.createElement("a");a.className="button";a.href=r.url;a.textContent="Open Resource";a.referrerPolicy="no-referrer";
        article.append(emblem,h,p,a);grid.append(article);
      }
      const count=$("resourceCount");if(count)count.textContent=`${list.length} resource${list.length===1?"":"s"} shown`;
    };
    search.addEventListener("input",draw);kind.addEventListener("change",draw);draw();
  }

  async function enrichResources(){
    try{
      const response=await fetch(REGISTRY_URL,{cache:"no-store"});
      if(!response.ok)return;
      const payload=await response.json();
      const dynamic=Array.isArray(payload.resources)?payload.resources:[];
      const known=new Set(resources.map(r=>r.url));
      for(const r of dynamic){
        if(!r||r.recommendable===false||r.mentorEligible===false||!r.url)continue;
        const audiences=(Array.isArray(r.audiences)?r.audiences:[]).map(v=>String(v).toLowerCase());
        if(audiences.length&&!audiences.some(a=>["high","high school","student","educator","parent","adult","higher learning"].includes(a)))continue;
        let u;try{u=new URL(r.url,location.href)}catch{continue}if(u.protocol!=="https:"||known.has(r.url))continue;
        resources.push({title:clean(r.title||"Connected Resource",80),kind:clean(r.resourceType||r.classification||"Resource",40),description:clean(r.description||"Connected High School learning resource.",180),url:r.url});known.add(r.url);
      }
      const select=$("resourceKind");if(select){while(select.options.length>1)select.remove(1);renderResources()}
    }catch{}
  }

  function installPWA(){
    let promptEvent=null;
    const button=$("installButton");
    window.addEventListener("beforeinstallprompt",event=>{event.preventDefault();promptEvent=event;if(button)button.hidden=false});
    button?.addEventListener("click",async()=>{if(!promptEvent)return;promptEvent.prompt();await promptEvent.userChoice;promptEvent=null;button.hidden=true});
    if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
  }

  function bind(){
    const year=$("year");if(year)year.textContent=String(new Date().getFullYear());
    renderEntry();renderResources();enrichResources();installPWA();
    window.addEventListener("khaemenes-family-changed",renderEntry);
    window.addEventListener("khaemenes-naib-ready",renderEntry);
    window.addEventListener("storage",renderEntry);
  }
  document.addEventListener("DOMContentLoaded",bind);
})();