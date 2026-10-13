import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const prefix='courses/mathematics/',assets=prefix+'assets/';
const registry=JSON.parse(fs.readFileSync(assets+'learning-games/game-registry.json','utf8'));
const known={
 10:['unit-circle-navigator','unit-circle-navigator','unit-circle-navigator','unit-circle-navigator','trigonometric-wave-studio','trigonometric-wave-studio','trigonometric-wave-studio','trigonometric-wave-studio','trigonometric-wave-studio','integer-compass'],
 11:['trigonometric-identity-forge','trigonometric-identity-forge','trigonometric-identity-forge','trigonometric-identity-forge','trigonometric-identity-forge','triangle-law-expedition','triangle-law-expedition','coordinated-mission-control']
};
let pages=0,links=0,launches=0;const gameNames=new Set();
for(const unit of [10,11]){
 const root=prefix+'algebra-2/units/unit-'+unit+'/';
 const landing=fs.readFileSync(root+'index.html','utf8');
 assert.ok(landing.includes('href="#main"'),'unit skip navigation');
 for(let i=1;i<=known[unit].length;i++){
  const lesson='u'+unit+'-l'+String(i).padStart(2,'0');
  const file=root+'lessons/'+lesson+'.html',html=fs.readFileSync(file,'utf8');
  assert.ok(landing.includes('href="lessons/'+lesson+'.html"'),'missing unit lesson link '+lesson);
  for(const needle of ['id="main"','href="#main"','width=device-width','class="lesson-main"','Guided and independent practice','id="lessonComplete"','id="lessonNote"']){
   assert.ok(html.includes(needle),'missing student landmark '+needle+' in '+lesson);
  }
  const scripts=[...html.matchAll(/<script[^>]*src="\.\.\/\.\.\/\.\.\/\.\.\/assets\/shared-game-launcher\.js"[^>]*>/g)].map(m=>m[0]);
  assert.ok(scripts.length,'missing game launcher '+lesson);
  const slugs=[];
  for(const script of scripts){
   const attr=k=>script.match(new RegExp('data-'+k+'="([^"]+)"'))?.[1];
   const slug=attr('game');slugs.push(slug);gameNames.add(slug);
   assert.equal(attr('course'),'algebra2');assert.equal(attr('unit'),String(unit));assert.equal(attr('lesson'),lesson);
   assert.ok(registry.games[slug],'unregistered game '+slug);
   assert.ok(fs.existsSync(registry.games[slug].canonical_path),'missing canonical game '+slug);
   const p=registry.games[slug].placements.find(x=>x.course==='algebra-2'&&Number(x.unit)===unit&&
     Number(String(x.lesson).match(/\d+$/)?.[0])===i);
   assert.ok(p,'missing registry placement '+lesson+' '+slug);
   assert.equal(attr('mode'),p.mode,'mode mismatch '+lesson);
   launches++;
  }
  assert.ok(slugs.includes(known[unit][i-1]),'wrong primary practice '+lesson);
  if(unit===11&&i===8)assert.ok(slugs.includes('triangle-law-expedition'),'secondary navigation game missing');
  for(const m of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)){
   const href=m[1];if(/^(?:https?:|mailto:|tel:|data:|javascript:|#)/i.test(href))continue;
   const dest=path.posix.normalize(path.posix.join(path.posix.dirname(file),href.split(/[?#]/)[0]));
   assert.ok(fs.existsSync(dest)||fs.existsSync(dest+'/index.html'),'broken local route '+lesson+' -> '+href);
   links++;
  }
  pages++;
 }
 for(const m of landing.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)){
  const href=m[1];if(/^(?:https?:|mailto:|tel:|data:|javascript:|#)/i.test(href))continue;
  const dest=path.posix.normalize(path.posix.join(root,href.split(/[?#]/)[0]));
  assert.ok(fs.existsSync(dest)||fs.existsSync(dest+'/index.html'),'broken unit route '+unit+' -> '+href);
  links++;
 }
}
assert.equal(pages,18);assert.equal(gameNames.size,6);
for(const slug of gameNames){
 const s=fs.readFileSync(registry.games[slug].canonical_path,'utf8');
 assert.ok(s.includes('game-return-route.js'),'game missing shared return: '+slug);
 assert.ok(/<meta name="viewport"[^>]*width=device-width/.test(s),'game missing viewport: '+slug);
 assert.ok(/@media\s*\(/.test(s),'game missing responsive layout: '+slug);
 assert.ok(s.includes('aria-live'),'game feedback not announced: '+slug);
}
const launcher=fs.readFileSync(assets+'shared-game-launcher.js','utf8');
const route=fs.readFileSync(assets+'game-return-route.js','utf8');
new vm.Script(launcher);new vm.Script(route);

class Node {
 constructor(tag){this.tag=tag;this.id='';this.className='';this.textContent='';this.href='';this.style={cssText:''};
 this.attrs={};this.children=[];this.parentNode=null;}
 appendChild(child){child.parentNode=this;this.children.push(child);return child;}
 insertBefore(child,next){child.parentNode=this;const pos=this.children.indexOf(next);this.children.splice(pos<0?this.children.length:pos,0,child);return child;}
 insertAdjacentElement(where,child){assert.equal(where,'afterend');const siblings=this.parentNode.children;this.parentNode.insertBefore(child,siblings[siblings.indexOf(this)+1]||null);}
 setAttribute(k,v){this.attrs[k]=v;}
 get firstElementChild(){return this.children[0]||null;}
 get firstChild(){return this.children[0]||null;}
 all(){return this.children.flatMap(n=>[n,...n.all()]);}
 matches(s){if(s==='main'||s==='h2')return this.tag===s;if(s==='section.block')return this.tag==='section'&&this.className.split(/\s+/).includes('block');
 return s.startsWith('.')&&this.className.split(/\s+/).includes(s.slice(1));}
 querySelector(s){return this.all().find(n=>n.matches(s))||null;}
 querySelectorAll(s){return this.all().filter(n=>n.matches(s));}
}
function freshDocument(){
 const body=new Node('body'),main=new Node('main'),column=new Node('div'),guided=new Node('section'),heading=new Node('h2');
 column.className='lesson-main';guided.className='lesson-section';heading.textContent='Guided and independent practice';
 body.appendChild(main);main.appendChild(column);column.appendChild(guided);guided.appendChild(heading);
 const document={body,readyState:'complete',currentScript:null,createElement:tag=>new Node(tag),
 getElementById:id=>[body,...body.all()].find(n=>n.id===id)||null,
 querySelector:s=>s==='main'?main:body.querySelector(s),querySelectorAll:s=>body.querySelectorAll(s)};
 return {document,body,main,column,guided};
}
const site=freshDocument(),cx=vm.createContext({document:site.document,URL,console});
function launch(slug,mode,title){
 site.document.currentScript={src:'https://academy.example/courses/mathematics/assets/shared-game-launcher.js',
 dataset:{game:slug,course:'algebra2',unit:'11',lesson:'u11-l08',mode,title}};
 vm.runInContext(launcher,cx,{timeout:2000});
}
launch('coordinated-mission-control','advanced-vector-navigation','Coordinated Mission Control');
launch('triangle-law-expedition','navigation','Triangle Law Expedition');
const companions=site.column.querySelectorAll('.math-shared-game-companion');
assert.equal(companions.length,2,'both companion cards visible');
assert.equal(site.column.children[0],companions[0],'first game placed at top of lesson learning column');
assert.equal(site.column.children[1],companions[1],'second game follows first at top');
assert.equal(site.column.children[2],site.guided,'guided practice remains after prominent game entries');
for(const [i,slug] of ['coordinated-mission-control','triangle-law-expedition'].entries()){
 const item=companions[i],anchor=item.all().find(n=>n.tag==='a');
 assert.ok(item.className.includes('lesson-section'),'lesson grid integration');
 assert.ok(anchor.href.includes('learning-games/'+slug+'/index.html'),'game canonical URL');
 assert.ok(anchor.href.includes('lesson=u11-l08')&&anchor.href.includes('course=algebra2'),'return parameters');
 assert.ok(anchor.attrs['aria-label'],'accessible link label');
}
launch('triangle-law-expedition','navigation','Triangle Law Expedition');
assert.equal(site.column.querySelectorAll('.math-shared-game-companion').length,2,'no duplicate game card');
const payload=freshDocument();
payload.document.currentScript={src:'https://academy.example/courses/mathematics/assets/shared-game-launcher.js',
 dataset:{game:'triangle-law-expedition',course:'algebra2',unit:'11',lesson:'u11-l07',mode:'cosine-sas',title:'Forge <img src=x onerror=alert(1)>'}};
vm.runInNewContext(launcher,{document:payload.document,URL,console},{timeout:2000});
assert.ok(payload.column.all().some(n=>n.tag==='h2'&&n.textContent.includes('<img')),'title handled as literal text');

function checkReturn(unit,lesson){
 const doc=freshDocument(),existing={href:'../../old'};
 doc.document.currentScript={src:'https://academy.example/courses/mathematics/assets/game-return-route.js'};
 doc.document.querySelectorAll=s=>s==='[data-return-lesson]'?[existing]:[];
 const context=vm.createContext({document:doc.document,window:{},URL,URLSearchParams,
 location:{search:'?course=algebra2&unit='+unit+'&lesson='+lesson},console});
 vm.runInContext(route,context,{timeout:2000});
 const nav=doc.body.children.find(n=>n.id==='mathGameReturnNavigation');
 assert.ok(nav,'game return navigation missing');
 assert.ok(doc.body.children.indexOf(nav)<doc.body.children.indexOf(doc.main),'return navigation must precede main content');
 assert.equal(nav.attrs['aria-label'],'Game navigation and return to lesson');
 const link=doc.document.getElementById('canonicalGameReturn');
 assert.ok(link?.href.endsWith('/algebra-2/units/unit-'+unit+'/lessons/'+lesson+'.html'),'canonical lesson return');
 assert.equal(existing.href,link.href,'existing lesson return synchronized');
 assert.ok(nav.all().some(n=>n.tag==='a'&&n.href.endsWith('/algebra-2/units/unit-'+unit+'/')),'unit overview provided');
 assert.ok(nav.all().some(n=>n.tag==='a'&&n.href.endsWith('/mathematics/index.html')),'mathematics home provided');
 assert.ok(nav.all().some(n=>n.tag==='a'&&n.style.cssText.includes('min-height:44px')),'mobile-friendly controls');
 const resolver=context.window.KhaemenesGameReturn.resolveLesson;
 assert.equal(resolver('algebra2',String(unit),lesson),'../algebra-2/units/unit-'+unit+'/lessons/'+lesson+'.html');
}
checkReturn(10,'u10-l03');checkReturn(11,'u11-l08');

const identity=fs.readFileSync(assets+'learning-games/trigonometric-identity-forge/index.html','utf8');
assert.ok(identity.includes('if(opening&&!record.checked){record.helped=true;save();}'),
 'opening a worked proof must count as assisted practice');

console.log('PASS: Algebra II Unit 10–11 student journey: '+pages+' lessons, 2 unit entrances, '+links+
 ' local routes, '+launches+' game launchers, six responsive accessible games, in-column cards, dual-game placement, '+
 'visible keyboard-friendly return navigation, and proof-assistance integrity.');
