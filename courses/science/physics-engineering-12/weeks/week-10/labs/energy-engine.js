(()=>{'use strict';
const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg',kind=document.body.dataset.lab;
const isWork=kind==='work',KEY='khae:phys12:w10:'+kind+':v1',CASES={"work":[{"F":12,"d":5,"angle":0,"t":3},{"F":12,"d":5,"angle":90,"t":4},{"F":12,"d":5,"angle":180,"t":5},{"F":20,"d":3,"angle":60,"t":2},{"F":20,"d":3,"angle":120,"t":3},{"F":10,"d":6,"angle":0,"t":4},{"F":16,"d":4,"angle":60,"t":2},{"F":18,"d":2,"angle":180,"t":3},{"F":30,"d":4,"angle":0,"t":4},{"F":40,"d":2,"angle":90,"t":5},{"F":24,"d":5,"angle":120,"t":3}],"energy":[{"m":4,"v":3,"W":32},{"m":4,"v":3,"W":-18},{"m":2,"v":4,"W":0},{"m":2,"v":4,"W":9},{"m":5,"v":2,"W":15},{"m":3,"v":4,"W":-6},{"m":4,"v":5,"W":0},{"m":6,"v":2,"W":18},{"m":8,"v":3,"W":28},{"m":5,"v":4,"W":-10},{"m":2,"v":6,"W":14}]}[kind];
let notebook={schema:'khae-phys12-w10-lab-v1',course:'KH-SCI-PHYS12',week:10,kind,prediction:'',analysis:'',trials:[]};
let deck=[],round=0,score=0,locked=true;
const roundN=(x,n=3)=>Number(x.toFixed(n));
function valid(p){return !!p&&typeof p==='object'&&(isWork?[p.F,p.d,p.angle,p.t].every(Number.isFinite)&&p.F>=0&&p.F<=50&&p.d>=0&&p.d<=20&&p.angle>=0&&p.angle<=180&&p.t>=1&&p.t<=20:[p.m,p.v,p.W].every(Number.isFinite)&&p.m>=1&&p.m<=20&&p.v>=0&&p.v<=20&&p.W>=-300&&p.W<=300)}
function compute(p){if(!valid(p))throw Error('Input outside the classroom range');
if(isWork){const projection=p.F*Math.cos(p.angle*Math.PI/180);const W=Math.abs(projection)<1e-10?0:projection*p.d;return{projection,W,P:W/p.t,sign:W>1e-10?'positive':W< -1e-10?'negative':'zero'}}
const initial=.5*p.m*p.v*p.v,final=initial+p.W,feasible=final>=-1e-9;
return{initial,final:feasible?Math.max(0,final):final,feasible,finalSpeed:feasible?Math.sqrt(2*Math.max(0,final)/p.m):null}}
function params(){return isWork?{F:Number($('F').value),d:Number($('d').value),angle:Number($('angle').value),t:Number($('t').value)}:{m:Number($('m').value),v:Number($('v').value),W:Number($('W').value)}}
function trialValid(v){try{if(!v||typeof v!=='object')return false;compute(v);return true}catch{return false}}
function save(){notebook.prediction=$('prediction').value;notebook.analysis=$('analysis').value;try{localStorage.setItem(KEY,JSON.stringify(notebook))}catch{$('status').textContent='Local storage unavailable or full: export your notebook.'}}
try{const data=localStorage.getItem(KEY);if(data){const o=JSON.parse(data);if(o?.schema===notebook.schema&&o.course===notebook.course&&o.week===10&&o.kind===kind){notebook.trials=Array.isArray(o.trials)?o.trials.filter(trialValid).slice(-80):[];notebook.prediction=String(o.prediction||'').slice(0,15000);notebook.analysis=String(o.analysis||'').slice(0,15000)}}localStorage.setItem(KEY+':probe','1');localStorage.removeItem(KEY+':probe');$('status').textContent='Browser-local storage available; export a copy to transfer work.'}catch{$('status').textContent='Browser saving blocked; export your evidence.'}
$('prediction').value=notebook.prediction;$('analysis').value=notebook.analysis;
function svg(tag,attrs={},text){const el=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,String(v));if(text!==undefined)el.textContent=String(text);return el}
function arrow(root,x,y,dx,dy,color){const len=Math.hypot(dx,dy);if(len<1)return;const ux=dx/len,uy=dy/len,px=-uy,py=ux,x2=x+dx,y2=y+dy;root.appendChild(svg('line',{x1:x,y1:y,x2,y2,stroke:color,'stroke-width':3}));
root.appendChild(svg('polygon',{points:[[x2,y2],[x2-10*ux+5*px,y2-10*uy+5*py],[x2-10*ux-5*px,y2-10*uy-5*py]].map(t=>t.join(',')).join(' '),fill:color}))}
function draw(p,r){const root=$('diagram');root.replaceChildren();if(isWork){const angle=p.angle*Math.PI/180;
root.appendChild(svg('line',{x1:80,y1:208,x2:610,y2:208,stroke:'#b9b2a4','stroke-width':2}));root.appendChild(svg('rect',{x:250,y:168,width:75,height:40,rx:7,fill:'#e9dec8',stroke:'#4b6870'}));
root.appendChild(svg('text',{x:287,y:193,'text-anchor':'middle'},'Body'));
if(p.d>0)arrow(root,340,196,130,0,'#23776b');
if(p.F>0)arrow(root,287,168,Math.cos(angle)*110,-Math.sin(angle)*110,'#a06b3e');
root.appendChild(svg('text',{x:25,y:25},'Teal: displacement toward +x · Gold: applied force'));root.appendChild(svg('text',{x:25,y:315},'Arrows schematic; positive work if force projects along displacement.'));
}else{const max=Math.max(1,r.initial,r.feasible?r.final:0),h=v=>170*v/max,parts=[['Initial kinetic energy',r.initial,173,'#227a6a'],['After net work',r.feasible?r.final:0,417,'#af8444']];
root.appendChild(svg('line',{x1:60,y1:257,x2:620,y2:257,stroke:'#67777a','stroke-width':2}));
for(const [title,val,x,color]of parts){const ht=h(val);root.appendChild(svg('rect',{x,y:257-ht,width:96,height:ht,fill:color,rx:4}));root.appendChild(svg('text',{x:x+48,y:282,'text-anchor':'middle'},title));root.appendChild(svg('text',{x:x+48,y:248-ht,'text-anchor':'middle'},roundN(val,2)+' J'))}
root.appendChild(svg('text',{x:25,y:23},'Kinetic energy is nonnegative; net work produces ΔK.'));
if(!r.feasible)root.appendChild(svg('text',{x:340,y:326,'text-anchor':'middle',fill:'#982f2c'},'Impossible final K: specified continuation requires revision.'))}}
function graph(p,r){const root=$('plot');root.replaceChildren();const L=60,U=28,W=565,H=209;
if(isWork){const pts=Array.from({length:73},(_,i)=>{const a=i*2.5;return[a,p.F*p.d*Math.cos(a*Math.PI/180)]});const ymax=Math.max(1,p.F*p.d)*1.18,tx=a=>L+W*a/180,ty=v=>U+H*(ymax-v)/(2*ymax);
for(let i=0;i<=6;i++){const a=i*30,x=tx(a);root.appendChild(svg('line',{x1:x,y1:U,x2:x,y2:U+H,stroke:'#e0e4df'}));root.appendChild(svg('text',{x,y:U+H+19,'text-anchor':'middle'},a))}
root.appendChild(svg('line',{x1:L,y1:ty(0),x2:L+W,y2:ty(0),stroke:'#687f81','stroke-width':2}));
root.appendChild(svg('polyline',{points:pts.map(([a,w])=>tx(a).toFixed(2)+','+ty(w).toFixed(2)).join(' '),fill:'none',stroke:'#267b70','stroke-width':3}));
root.appendChild(svg('circle',{cx:tx(p.angle),cy:ty(r.W),r:5,fill:'#a97936'}));
root.appendChild(svg('text',{x:L,y:18},'Work by one force (J), positive / negative'));root.appendChild(svg('text',{x:350,y:278,'text-anchor':'middle'},'Angle between force and displacement (degrees)'));
}else{const top=Math.max(1,.5*p.m*20*20)*1.05,tx=v=>L+W*v/20,ty=k=>U+H*(1-k/top);
for(let i=0;i<=5;i++){const v=i*4,x=tx(v);root.appendChild(svg('line',{x1:x,y1:U,x2:x,y2:U+H,stroke:'#e0e4df'}));root.appendChild(svg('text',{x,y:U+H+18,'text-anchor':'middle'},v))}
root.appendChild(svg('polyline',{points:Array.from({length:41},(_,i)=>{const v=.5*i;return tx(v).toFixed(2)+','+ty(.5*p.m*v*v).toFixed(2)}).join(' '),stroke:'#267b70','stroke-width':3,fill:'none'}));
root.appendChild(svg('circle',{cx:tx(p.v),cy:ty(r.initial),r:5,fill:'#ab7e3b'}));
root.appendChild(svg('text',{x:L,y:18},'Kinetic energy (J) at fixed mass'));root.appendChild(svg('text',{x:350,y:278,'text-anchor':'middle'},'Speed magnitude (m/s)'));
}}
function comparisons(p){const tbody=$('tableRows');tbody.replaceChildren();
if(isWork){for(const a of [0,30,60,90,120,150,180]){const W=p.F*p.d*Math.cos(a*Math.PI/180),tr=document.createElement('tr');for(const v of [a,roundN(W,3),roundN(W/p.t,3)]){const cell=document.createElement('td');cell.textContent=String(Math.abs(v)<1e-9?0:v);tr.appendChild(cell)}tbody.appendChild(tr)}}
else{for(const delta of [-100,-50,-20,0,20,50,100]){const result=compute({...p,W:delta}),tr=document.createElement('tr');for(const v of [delta,roundN(result.initial,3),result.feasible?roundN(result.final,3):'infeasible',result.feasible?roundN(result.finalSpeed,3):'—']){const cell=document.createElement('td');cell.textContent=String(v);tr.appendChild(cell)}tbody.appendChild(tr)}}}
function render(){const p=params(),r=compute(p);for(const[k,v,u]of isWork?[['F',p.F,'N'],['d',p.d,'m'],['angle',p.angle,'°'],['t',p.t,'s']]:[['m',p.m,'kg'],['v',p.v,'m/s'],['W',p.W,'J']])$(k+'Out').textContent=v+' '+u;
$('readout').textContent=isWork?'Force parallel component Fcosθ = '+roundN(r.projection,3)+' N.\nWork by this particular force W=Fd cosθ = '+roundN(r.W,3)+' J ('+r.sign+').\nAverage signed power by this force P=W/Δt = '+roundN(r.P,3)+' W.\nOther forces may do work, so this is not automatically net work.':
'Initial kinetic energy K_i = ½mv₀² = '+roundN(r.initial,3)+' J.\nNET work W_net = '+p.W+' J.\n'+(r.feasible?'Final kinetic energy K_f = K_i + W_net = '+roundN(r.final,3)+' J.\nFinal SPEED MAGNITUDE √(2K_f/m) = '+roundN(r.finalSpeed,3)+' m/s.\nThis theorem alone does not specify final direction.':
'Final kinetic energy would be '+roundN(r.final,3)+' J, below zero.\nIncompatible scenario: stop/reversal would occur before assumed continued positive displacement. Revise model conditions.');draw(p,r);graph(p,r);comparisons(p)}
function history(){const tbody=$('history');tbody.replaceChildren();notebook.trials.forEach((p,i)=>{const r=compute(p),tr=document.createElement('tr');const row=isWork?[i+1,p.F,p.d,p.angle,p.t,roundN(r.W,3),roundN(r.P,3)]:[i+1,p.m,p.v,p.W,roundN(r.initial,3),r.feasible?roundN(r.final,3):'infeasible',r.feasible?roundN(r.finalSpeed,3):'—'];for(const v of row){const td=document.createElement('td');td.textContent=String(v);tr.appendChild(td)}tbody.appendChild(tr)})}
(isWork?['F','d','angle','t']:['m','v','W']).forEach(k=>$(k).addEventListener('input',render));
['prediction','analysis'].forEach(k=>$(k).addEventListener('input',save));
$('record').addEventListener('click',()=>{notebook.trials.push(params());notebook.trials=notebook.trials.slice(-80);save();history()});
$('reset').addEventListener('click',()=>{const defaults=isWork?{F:20,d:3,angle:60,t:4}:{m:4,v:3,W:32};for(const[k,v]of Object.entries(defaults))$(k).value=String(v);render()});
$('clear').addEventListener('click',()=>{if(!confirm('Clear recorded synthetic trials? Export a backup first.'))return;notebook.trials=[];save();history()});
function download(){save();const o={...notebook,exportedAt:new Date().toISOString(),provenance:'Calculated educational work/energy model only, not physical measurements'},b=new Blob([JSON.stringify(o,null,2)],{type:'application/json'}),url=URL.createObjectURL(b),a=document.createElement('a');a.href=url;a.download='physics12-w10-'+kind+'-notebook.json';document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(url)},1000)}
$('export').addEventListener('click',download);
$('import').addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{if(f.size>400000)throw Error('JSON file exceeds 400 KB');const d=JSON.parse(await f.text());if(d?.schema!==notebook.schema||d.course!==notebook.course||d.week!==10||d.kind!==kind||!Array.isArray(d.trials))throw Error('Not this Week 10 lab notebook');const trials=d.trials.slice(-80);if(!trials.every(trialValid))throw Error('Invalid trial data');if(!confirm('Replace existing notebook? Export it first.'))return;notebook={schema:notebook.schema,course:notebook.course,week:10,kind,trials,prediction:String(d.prediction||'').slice(0,15000),analysis:String(d.analysis||'').slice(0,15000)};$('prediction').value=notebook.prediction;$('analysis').value=notebook.analysis;save();history();$('status').textContent='Matching notebook imported.'}catch(err){$('status').textContent='Import error: '+err.message}finally{e.target.value=''}});
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function showRound(){if(round>=deck.length){locked=true;$('roundTitle').textContent='Seven-round challenge complete';$('challenge').textContent='Final score '+score+' / 7. Review the calculations and retry.';$('choices').replaceChildren();$('next').disabled=true;return}
const p=deck[round],r=compute(p),right=roundN(isWork?r.W:r.final,2);locked=false;
$('roundTitle').textContent='Round '+(round+1)+' of 7';$('challenge').textContent=isWork?'Force '+p.F+' N, displacement '+p.d+' m, angle '+p.angle+'°. What is work by this force (J)?':'Mass '+p.m+' kg, initial speed '+p.v+' m/s and net work '+p.W+' J. What is FINAL kinetic energy (J)?';
$('feedback').textContent='';$('choices').replaceChildren();$('next').disabled=true;
const choices=[right],offsets=[1,-1,2,-2,5,-5,10,-10];for(const add of offsets){const n=roundN(right+add,2);if((isWork||n>=0)&&!choices.includes(n))choices.push(n);if(choices.length===4)break}for(let j=1;choices.length<4;j++){const v=roundN(right+j*15,2);if(!choices.includes(v))choices.push(v)}
shuffle(choices.slice(0,4)).forEach(v=>{const b=document.createElement('button');b.type='button';b.className='btn';b.textContent=v.toFixed(2)+' J';b.addEventListener('click',()=>{if(locked)return;locked=true;const correct=Math.abs(v-right)<.00001;if(correct)score++;$('gameScore').textContent='Score: '+score+' of 7';$('feedback').textContent=(correct?'Correct. ':'Review: ')+(isWork?'W=F d cosθ = '+right+' J by the specified force.':'K_f=½mv₀²+W_net = '+right+' J.')+' Check units and whether work is from one force or net.';Array.from($('choices').children).forEach(x=>x.disabled=true);$('next').disabled=false});$('choices').appendChild(b)})}
$('newGame').addEventListener('click',()=>{deck=shuffle(CASES.slice()).slice(0,7);round=0;score=0;$('gameScore').textContent='Score: 0 of 7';showRound()});
$('next').addEventListener('click',()=>{if(!locked)return;round++;showRound()});
$('print').addEventListener('click',()=>window.print());
render();history();
})();