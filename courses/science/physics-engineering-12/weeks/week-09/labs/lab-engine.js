(()=>{'use strict';
const $=id=>document.getElementById(id),mode=document.body.dataset.lab,orbit=mode==='orbit';
const BODIES={earth:{label:'Earth',Rkm:6371,mu:3.986004418e14},moon:{label:'Moon',Rkm:1737.4,mu:4.9048695e12}};
const CASES=orbit?[['earth',400],['earth',700],['earth',1000],['earth',1200],['earth',1800],['earth',2500],['earth',3000],['moon',100],['moon',200],['moon',400],['moon',700]]:[['earth',0],['earth',400],['earth',800],['earth',1400],['earth',2000],['earth',2800],['earth',3600],['moon',0],['moon',100],['moon',300],['moon',600]];
const KEY='khae:phys12:w09:'+mode+':v1',NS='http://www.w3.org/2000/svg';
let notebook={schema:'khae-phys12-w09-lab-v1',course:'KH-SCI-PHYS12',week:9,mode,notes:'',prediction:'',trials:[]};
let game=[],round=0,score=0,locked=true,answer=0;
const rounded=(v,n=3)=>Number(v.toFixed(n));
function calculate(body,alt,mass,phase=0){const b=BODIES[body];if(!b||![alt,mass,phase].every(Number.isFinite)||alt<0||alt>4000||mass<=0||mass>2000||phase<0||phase>360)throw Error('Invalid body, altitude or mass');
const r=(b.Rkm+alt)*1000,g=b.mu/(r*r),F=mass*g,v=Math.sqrt(b.mu/r),T=2*Math.PI*Math.sqrt(r*r*r/b.mu),rad=phase*Math.PI/180;
return{body,alt,mass,phase,r,g,F,v,T,theta:rad,fx:-F*Math.cos(rad),fy:-F*Math.sin(rad),vx:-v*Math.sin(rad),vy:v*Math.cos(rad)}}
function params(){return{body:$('body').value,alt:Number($('alt').value),mass:Number($('mass').value),phase:Number($('phase').value)}}
function current(){const p=params();return calculate(p.body,p.alt,p.mass,p.phase)}
function verifyTrial(t){try{if(!t||typeof t!=='object')return false;calculate(t.body,t.alt,t.mass,t.phase);return true}catch{return false}}
function save(){notebook.prediction=$('prediction').value;notebook.notes=$('analysis').value;try{localStorage.setItem(KEY,JSON.stringify(notebook))}catch{$('storageStatus').textContent='Browser saving unavailable. Export your evidence before leaving.'}}
try{const data=localStorage.getItem(KEY);if(data){const d=JSON.parse(data);if(d?.schema===notebook.schema&&d.course===notebook.course&&d.week===9&&d.mode===mode){notebook.trials=Array.isArray(d.trials)?d.trials.filter(verifyTrial).slice(-80):[];notebook.prediction=String(d.prediction||'').slice(0,20000);notebook.notes=String(d.notes||'').slice(0,20000)}}localStorage.setItem(KEY+':probe','1');localStorage.removeItem(KEY+':probe');$('storageStatus').textContent='Local storage enabled; export before switching devices.'}catch{$('storageStatus').textContent='Browser storage blocked. Export your work.'}
$('prediction').value=notebook.prediction;$('analysis').value=notebook.notes;
function node(tag,attrs={},caption){const el=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,String(v));if(caption!==undefined)el.textContent=String(caption);return el}
function arrow(root,x,y,dx,dy,color){const L=Math.hypot(dx,dy);if(L<1)return;const ux=dx/L,uy=dy/L,px=-uy,py=ux,x2=x+dx,y2=y+dy;
root.appendChild(node('line',{x1:x,y1:y,x2,y2,stroke:color,'stroke-width':3,'stroke-linecap':'round'}));
root.appendChild(node('polygon',{points:[[x2,y2],[x2-10*ux+5*px,y2-10*uy+5*py],[x2-10*ux-5*px,y2-10*uy-5*py]].map(p=>p.join(',')).join(' '),fill:color}))}
function drawDiagram(s){const root=$('diagram');root.replaceChildren();const cx=340,cy=170;
if(orbit){const rVis=117,planetR=86,x=cx+rVis*Math.cos(s.theta),y=cy-rVis*Math.sin(s.theta);
root.appendChild(node('circle',{cx,cy,r:planetR,fill:'#d9e8e4',stroke:'#52797c','stroke-width':2}));
root.appendChild(node('circle',{cx,cy,r:rVis,fill:'none',stroke:'#7292ad','stroke-width':2}));
root.appendChild(node('circle',{cx:x,cy:y,r:7,fill:'#a67c3d'}));
arrow(root,x,y,-Math.sin(s.theta)*80,-Math.cos(s.theta)*80,'#258b76');arrow(root,x,y,-Math.cos(s.theta)*70,Math.sin(s.theta)*70,'#b27f3f');
root.appendChild(node('text',{x:20,y:22,fill:'#30454a'},'Teal: tangent velocity • Gold: inward gravitational acceleration'));
root.appendChild(node('text',{x:340,y:341,'text-anchor':'middle',fill:'#30454a'},'Ideal circular orbit only; positions are schematic and not to distance scale'));
}else{
root.appendChild(node('circle',{cx,cy,r:93,fill:'#d9e8e4',stroke:'#52797c','stroke-width':2}));
root.appendChild(node('line',{x1:cx,y1:cy,x2:cx+170,y2:cy,stroke:'#8c9c9b','stroke-dasharray':'5 4'}));
root.appendChild(node('circle',{cx:cx+170,cy,r:9,fill:'#a67c3d'}));arrow(root,cx+170,cy,-95,0,'#b27f3f');
root.appendChild(node('text',{x:20,y:22,fill:'#30454a'},'Gravitational field / test-mass force points toward the center'));
root.appendChild(node('text',{x:340,y:341,'text-anchor':'middle',fill:'#30454a'},'Altitude is above the surface, but gravitational radius is from the center'));
}}
function plot(s){const root=$('plot');root.replaceChildren();const b=BODIES[s.body],L=64,U=24,W=570,H=207;
const maxAlt=4000,domain=orbit?100:0;
const f=h=>{const z=calculate(s.body,h,s.mass,0);return orbit?z.T/60:z.g};
const top=f(domain)*1.08,tx=a=>L+W*(a-domain)/(maxAlt-domain),ty=y=>U+H*(1-y/top);
for(let i=0;i<=5;i++){const a=domain+(maxAlt-domain)*i/5,x=tx(a),y=U+H*i/5;root.appendChild(node('line',{x1:x,y1:U,x2:x,y2:U+H,stroke:'#dce2dd'}));root.appendChild(node('line',{x1:L,y1:y,x2:L+W,y2:y,stroke:'#dce2dd'}));root.appendChild(node('text',{x,y:U+H+19,'text-anchor':'middle','font-size':12},rounded(a,0)));root.appendChild(node('text',{x:L-8,y:y+4,'text-anchor':'end','font-size':12},rounded(top*(1-i/5),1)))}
root.appendChild(node('polyline',{points:Array.from({length:81},(_,i)=>{const alt=domain+(maxAlt-domain)*i/80;return tx(alt).toFixed(2)+','+ty(f(alt)).toFixed(2)}).join(' '),fill:'none',stroke:'#218274','stroke-width':3}));
root.appendChild(node('text',{x:350,y:282,'text-anchor':'middle'},'Altitude above reference surface (km)'));
root.appendChild(node('text',{x:L,y:15},orbit?'Orbital period (min)':'Gravitational field (m/s²)'));
const rows=$('tableRows');rows.replaceChildren();const candidates=orbit?[100,200,400,800,1600,3000,4000]:[0,400,800,1600,2400,3200,4000];
for(const alt of candidates){const p=calculate(s.body,alt,s.mass,0),tr=document.createElement('tr');const values=orbit?[alt,rounded(p.r/1000,1),rounded(p.g,3),rounded(p.v/1000,3),rounded(p.T/60,2)]:[alt,rounded(p.r/1000,1),rounded(p.g,4),rounded(p.F,3),rounded(p.g/calculate(s.body,0,s.mass,0).g,4)];
for(const value of values){const td=document.createElement('td');td.textContent=String(value);tr.appendChild(td)}rows.appendChild(tr)}}
function render(){const s=current(),b=BODIES[s.body];$('massOut').textContent=s.mass+' kg';$('altOut').textContent=s.alt+' km';$('phaseOut').textContent=s.phase+'°';
$('readout').textContent=(orbit?'Ideal circular orbit':'Inverse-square gravity')+' around '+b.label+'.\nAltitude: '+s.alt+' km; orbital radius from center r: '+rounded(s.r/1000,2)+' km.\nGravity field g=μ/r²: '+rounded(s.g,4)+' m/s². Force on chosen mass: '+rounded(s.F,2)+' N.\n'+(orbit?'Circular orbital speed √(μ/r): '+rounded(s.v/1000,4)+' km/s. Period 2π√(r³/μ): '+rounded(s.T/60,3)+' minutes.':'Field ratio to surface: '+rounded(s.g/calculate(s.body,0,s.mass,0).g,4)+'; at twice radial distance, gravitational field is one quarter.')+'\nAll values come from an ideal isolated spherical two-body model, not real-time tracking.';
drawDiagram(s);plot(s)}
function history(){const body=$('history');body.replaceChildren();notebook.trials.forEach((p,i)=>{const r=calculate(p.body,p.alt,p.mass,p.phase),tr=document.createElement('tr');for(const val of [i+1,BODIES[p.body].label,p.alt,p.mass,rounded(r.g,3),orbit?rounded(r.T/60,2):rounded(r.F,2)]){const td=document.createElement('td');td.textContent=String(val);tr.appendChild(td)}body.appendChild(tr)})}
['body','alt','mass','phase'].forEach(id=>$(id).addEventListener(id==='body'?'change':'input',render));['prediction','analysis'].forEach(id=>$(id).addEventListener('input',save));
$('record').addEventListener('click',()=>{notebook.trials.push(params());notebook.trials=notebook.trials.slice(-80);save();history()});
$('reset').addEventListener('click',()=>{$('body').value='earth';$('alt').value=orbit?'400':'0';$('mass').value=orbit?'500':'10';$('phase').value='0';render()});
$('clear').addEventListener('click',()=>{if(!confirm('Clear recorded synthetic trials? Export a backup first.'))return;notebook.trials=[];save();history()});
function download(){save();const blob=new Blob([JSON.stringify({...notebook,exportedAt:new Date().toISOString(),provenance:'Synthetic model using reference gravitational parameters'},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='physics12-week09-'+mode+'-evidence.json';document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(url)},1000)}
$('export').addEventListener('click',download);
$('import').addEventListener('change',async ev=>{const file=ev.target.files?.[0];if(!file)return;try{if(file.size>400000)throw Error('File larger than 400 KB');const data=JSON.parse(await file.text());if(data?.schema!==notebook.schema||data.course!==notebook.course||data.week!==9||data.mode!==mode||!Array.isArray(data.trials))throw Error('Not this Week 09 lab notebook');const trials=data.trials.slice(-80);if(!trials.every(verifyTrial))throw Error('Invalid trial input');if(!confirm('Replace this lab notebook? Export existing work first.'))return;notebook={schema:notebook.schema,course:notebook.course,week:9,mode,trials,prediction:String(data.prediction||'').slice(0,20000),notes:String(data.notes||'').slice(0,20000)};$('prediction').value=notebook.prediction;$('analysis').value=notebook.notes;save();history();$('storageStatus').textContent='Matching model evidence imported.'}catch(e){$('storageStatus').textContent='Import error: '+e.message}finally{ev.target.value=''}});
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function showRound(){if(round>=game.length){locked=true;$('roundTitle').textContent='Seven-round challenge complete';$('gamePrompt').textContent='Final score '+score+' / '+game.length+'.';$('choices').replaceChildren();$('next').disabled=true;return}
const [body,alt]=game[round],r=calculate(body,alt,orbit?500:10,0),b=BODIES[body];answer=rounded(orbit?r.T/60:r.g,2);locked=false;$('roundTitle').textContent='Round '+(round+1)+' of 7';
$('gamePrompt').textContent=orbit?'Around '+b.label+' at '+alt+' km altitude, what is the ideal circular orbital period (minutes)?':'Around '+b.label+' at altitude '+alt+' km, what is gravitational field magnitude g (m/s²)?';
$('choices').replaceChildren();$('feedback').textContent='';$('next').disabled=true;
const options=[answer];for(const factor of [.6,.75,1.2,1.5,2,2.4]){const val=rounded(answer*factor,2);if(!options.some(x=>Math.abs(x-val)<.01))options.push(val);if(options.length>=4)break}for(const delta of [1,2,3,4]){if(options.length>=4)break;const val=rounded(answer+delta,2);if(!options.includes(val))options.push(val)}
shuffle(options.slice(0,4)).forEach(val=>{const button=document.createElement('button');button.type='button';button.className='btn';button.textContent=val.toFixed(2)+(orbit?' min':' m/s²');button.addEventListener('click',()=>{if(locked)return;locked=true;const ok=Math.abs(val-answer)<.00001;if(ok)score++;$('feedback').textContent=(ok?'Correct. ':'Review: ')+(orbit?'T=2π√(r³/μ)':'g=μ/(R+h)²')+' = '+answer.toFixed(2)+(orbit?' minutes.':' m/s².')+' Use radius measured from the center.';$('score').textContent='Score: '+score+' of 7';Array.from($('choices').children).forEach(x=>x.disabled=true);$('next').disabled=false});$('choices').appendChild(button)})}
$('newGame').addEventListener('click',()=>{game=shuffle(CASES.slice()).slice(0,7);round=0;score=0;$('score').textContent='Score: 0 of 7';showRound()});
$('next').addEventListener('click',()=>{if(!locked)return;round++;showRound()});
$('print').addEventListener('click',()=>window.print());
render();history();
})();
