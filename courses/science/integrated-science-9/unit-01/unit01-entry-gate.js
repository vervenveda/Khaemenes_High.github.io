"use strict";
(() => {
  const DIAGNOSTIC_KEY="khaemenes_naib_readiness_science9_v1";
  const FOUNDATIONS_KEY="khaemenes_science_foundations_v1";
  const UNIT_KEY="khaemenes_science_u01_v1";
  const ROOT_KEY="khaemenes_science_integrated9_v1";
  const MARKER="/courses/science/integrated-science-9/";

  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
  const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
  const path=window.location.pathname;
  const markerAt=path.indexOf(MARKER);
  const courseBase=markerAt>=0?path.slice(0,markerAt+MARKER.length):new URL("../../",window.location.href).pathname;
  const url=(relative)=>`${courseBase}${relative.replace(/^\/+/,"")}`;

  function hasExistingUnitProgress(){
    const u=read(UNIT_KEY,{});
    if(Array.isArray(u.completedPages)&&u.completedPages.length)return true;
    if(u.helicopter?.complete||u.dataset?.complete||u.design?.submitted||u.reflection?.complete)return true;
    if((u.quiz?.attempts||0)>0||(u.assessment?.attempts||0)>0)return true;
    if(u.verification?.reviewedAt)return true;
    return false;
  }

  function latestDiagnostic(){
    const history=read(DIAGNOSTIC_KEY,[]);
    return Array.isArray(history)&&history.length?history[history.length-1]:null;
  }

  function foundationRecord(){
    const state=read(FOUNDATIONS_KEY,{});
    return state?.readiness||null;
  }

  function priorAdmission(){
    return read(ROOT_KEY,{})?.readinessAdmission||null;
  }

  function decision(){
    if(hasExistingUnitProgress()) return {allow:true,source:"existing_unit_progress",pathway:priorAdmission()?.pathway||"legacy_or_active",message:"Existing Unit 01 progress preserved."};

    const admission=priorAdmission();
    if(admission?.allowed&&["core_36_week","supported_42_week"].includes(admission.pathway)){
      return {allow:true,source:admission.source||"prior_admission",pathway:admission.pathway,message:"Previously verified Unit 01 admission preserved."};
    }

    const foundation=foundationRecord();
    if(foundation?.route==="advance"&&foundation?.status==="mastered"){
      return {allow:true,source:"science_foundations",pathway:"supported_42_week",message:`Science Foundations mastered${foundation.overall_percent!=null?` at ${foundation.overall_percent}%`:""}.`};
    }

    const diagnostic=latestDiagnostic();
    if(diagnostic&&(diagnostic.route==="advance"||diagnostic.route==="advance_with_targeted_refresh")){
      return {allow:true,source:"readiness_gateway",pathway:"core_36_week",message:`Readiness gateway cleared${diagnostic.overall_percent!=null?` at ${diagnostic.overall_percent}%`:""}.`};
    }

    if(diagnostic?.route==="unit_0_refresher"){
      return {allow:false,source:"readiness_gateway",pathway:"supported_42_week",destination:url("foundations/"),title:"Science Foundations comes first",message:"Your readiness profile recommends the six-week Science Foundations Refresher before Official Unit 1. Complete the bridge and its ≥80% mastery gateway, then Unit 1 opens directly."};
    }

    if(foundation&&foundation.route!=="advance"){
      return {allow:false,source:"science_foundations",pathway:"supported_42_week",destination:url("foundations/mastery-assessment.html"),title:"Finish the Foundations mastery gateway",message:"Your Science Foundations record is not yet cleared for Unit 1. Complete targeted corrections or reassessment until the ≥80% mastery rule and essential-strand requirement are met."};
    }

    return {allow:false,source:"none",pathway:"unassigned",destination:url("diagnostic/readiness-diagnostic.html"),title:"Begin with the Science 9 Readiness Gateway",message:"Before Official Unit 1, complete the readiness diagnostic. Students who are ready enter the 36-week core course; students needing reinforcement receive the six-week refresher and a 42-week supported pathway."};
  }

  function recordAdmission(d){
    const root=read(ROOT_KEY,{});
    const pathway=d.pathway==="supported_42_week"?"Supported 42-week":"Core 36-week";
    root.readinessAdmission={allowed:true,source:d.source,pathway:d.pathway,checkedAt:new Date().toISOString()};
    root.pathway=pathway;
    root.updatedAt=new Date().toISOString();
    write(ROOT_KEY,root);
  }

  function mountGate(d){
    if(document.querySelector(".readiness-gate"))return;
    document.documentElement.dataset.readinessGate="locked";
    const style=document.createElement("style");
    style.id="unit01EntryGateStyles";
    style.textContent=`body.readiness-locked{overflow:hidden}.readiness-gate{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:22px;background:rgba(4,12,18,.96);backdrop-filter:blur(12px)}.readiness-gate-card{width:min(720px,100%);padding:30px;border:1px solid rgba(255,255,255,.24);border-radius:11px;background:#07131d;color:#f4f7f8;box-shadow:0 24px 70px rgba(0,0,0,.45);text-align:center}.readiness-gate-card h1{color:#fff;font-size:clamp(32px,5vw,50px)}.readiness-gate-card p{max-width:620px;margin-inline:auto;line-height:1.75}.readiness-gate-actions{display:flex;justify-content:center;flex-wrap:wrap;gap:11px;margin-top:22px}.readiness-gate-actions a{min-height:46px;display:inline-flex;align-items:center;justify-content:center;padding:10px 16px;border:1px solid #8aa0ad;border-radius:7px;color:#fff;text-decoration:none}.readiness-gate-actions a.primary{background:#355f78;border-color:#6f99ae}.readiness-gate-note{font-size:.9rem;opacity:.8}`;
    document.head.append(style);
    document.body.classList.add("readiness-locked");
    const gate=document.createElement("div");
    gate.className="readiness-gate";
    gate.setAttribute("role","dialog");
    gate.setAttribute("aria-modal","true");
    gate.setAttribute("aria-labelledby","readinessGateTitle");
    gate.innerHTML=`<section class="readiness-gate-card"><p class="eyebrow">NAIB · Science 9 Entry Check</p><h1 id="readinessGateTitle">${d.title}</h1><p>${d.message}</p><p class="readiness-gate-note">This gateway supports placement and does not erase prior course-completion records or legitimate Unit 01 progress.</p><div class="readiness-gate-actions"><a class="primary" href="${d.destination}">Open Recommended Path</a><a href="${url("")}">Science 9 Home</a></div></section>`;
    document.body.append(gate);
    gate.querySelector("a")?.focus();
  }

  function run(){
    const d=decision();
    window.KhaemenesScience9EntryDecision=d;
    if(d.allow){recordAdmission(d);document.documentElement.dataset.readinessGate="open";return;}
    mountGate(d);
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run,{once:true});
  else run();
})();