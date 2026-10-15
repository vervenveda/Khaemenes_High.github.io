"use strict";
(()=>{
  const $ = selector => document.querySelector(selector);
  const KEY = window.KhaemenesScienceU08Scope.active() ? "kh_sci9_u08_learner_v1:" + window.KhaemenesScienceU08Scope.active() + ":khaemenes_science_u08_motion_data_v1" : "kh_sci9_u08_motion_unselected_v1";
  let lastSeen = localStorage.getItem(KEY);
  const rows = 5;

  function values(){
    const t = [];
    const x = [];
    for(let i = 0; i < rows; i++){
      t.push(Number($("#t" + i).value));
      x.push(Number($("#x" + i).value));
    }
    return {t, x};
  }

  function valid(data){
    return (
      data.t.every(Number.isFinite) &&
      data.x.every(Number.isFinite) &&
      data.t.every((value, index) => index === 0 || value > data.t[index - 1])
    );
  }

  function draw(data){
    const svg = $("#motionSvg");
    const W = 760;
    const H = 280;
    const padding = 45;

    const minT = Math.min(...data.t);
    const maxT = Math.max(...data.t);
    const timeSpan = maxT - minT;

    const minX = Math.min(...data.x);
    const maxX = Math.max(...data.x);
    const positionSpan = maxX - minX || 1;

    const px = time =>
      padding + ((time - minT) / timeSpan) * (W - 2 * padding);

    const py = position =>
      H - padding - ((position - minX) / positionSpan) * (H - 2 * padding);

    const points = data.t.map((time, index) =>
      `${px(time)},${py(data.x[index])}`
    ).join(" ");

    svg.innerHTML = `
      <line x1="${padding}" y1="${H-padding}" x2="${W-padding}" y2="${H-padding}" stroke="currentColor"/>
      <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${H-padding}" stroke="currentColor"/>
      <polyline points="${points}" fill="none" stroke="currentColor" stroke-width="3"/>
      ${data.t.map((time, index) =>
        `<circle cx="${px(time)}" cy="${py(data.x[index])}" r="5" fill="currentColor"/>`
      ).join("")}
      <text x="${W/2}" y="${H-8}" text-anchor="middle" fill="currentColor">time / s</text>
      <text x="15" y="${H/2}" transform="rotate(-90 15 ${H/2})" text-anchor="middle" fill="currentColor">position / m</text>
      <text x="${padding}" y="${H-25}" text-anchor="start" fill="currentColor">${minT.toFixed(2)} s</text>
      <text x="${W-padding}" y="${H-25}" text-anchor="end" fill="currentColor">${maxT.toFixed(2)} s</text>
    `;
  }

  function analyze(){
    const data = values();

    if(!valid(data)){
      $("#motionStatus").textContent =
        "Enter finite positions and strictly increasing times.";
      return;
    }

    const elapsedTime = data.t.at(-1) - data.t[0];
    if(elapsedTime <= 0){
      $("#motionStatus").textContent =
        "The final time must be greater than the initial time.";
      return;
    }

    const intervalVelocities = [];
    for(let i = 1; i < rows; i++){
      intervalVelocities.push(
        (data.x[i] - data.x[i - 1]) /
        (data.t[i] - data.t[i - 1])
      );
    }

    const totalDistance = data.x.slice(1).reduce(
      (sum, value, index) => sum + Math.abs(value - data.x[index]),
      0
    );
    const displacement = data.x.at(-1) - data.x[0];

    $("#motionStatus").textContent =
      "Data accepted. Calculations use your entered record.";
    $("#avgSpeed").textContent =
      (totalDistance / elapsedTime).toFixed(3) + " m/s";
    $("#avgVelocity").textContent =
      (displacement / elapsedTime).toFixed(3) + " m/s";
    $("#displacement").textContent =
      displacement.toFixed(3) + " m";
    $("#intervals").innerHTML = intervalVelocities.map((velocity, index) =>
      `<span class="vector-chip">${index + 1}: ${velocity.toFixed(3)} m/s</span>`
    ).join("");

    draw(data);
    if(localStorage.getItem(KEY)!==lastSeen){window.alert("Motion Lab data changed in another tab. Reload before saving.");return;}
    const serialized=JSON.stringify(data);
    localStorage.setItem(KEY, serialized);
    lastSeen=serialized;
  }

  function loadPractice(){
    const times = [0, 1, 2, 3, 4];
    const positions = [0, 0.5, 2, 4.5, 8];

    times.forEach((value, index) => {
      $("#t" + index).value = value;
      $("#x" + index).value = positions[index];
    });

    $("#dataLabel").textContent =
      "Practice scenario loaded — not experimental evidence.";
    analyze();
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("#analyzeMotion").addEventListener("click", analyze);
    $("#loadPractice").addEventListener("click", loadPractice);

    let saved;
    try{
      saved = JSON.parse(localStorage.getItem(KEY));
    }catch{
      saved = null;
    }

    if(saved && saved.t?.length === rows && saved.x?.length === rows){
      saved.t.forEach((value, index) => $("#t" + index).value = value);
      saved.x.forEach((value, index) => $("#x" + index).value = value);
      analyze();
    }
  });
})();
