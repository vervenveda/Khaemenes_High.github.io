import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../assets/course.js',import.meta.url),'utf8');
const buttons=[];const main={prepend(x){buttons.push(x)}};
const completion={dataset:{progressKey:'week-13'},setAttribute(){},addEventListener(t,fn){this.click=fn}};
const records=new Map();
const doc={currentScript:{src:'https://vervenveda.com/Khaemenes_High.github.io/courses/language-arts/english-9/assets/course.js'},documentElement:{dataset:{}},createElement:()=>({setAttribute(){},appendChild(x){this.child=x}}),querySelector:q=>q==='main'?main:q.includes('-day-')?{}:null,querySelectorAll:q=>q==='[data-progress-key]'?[completion]:[]};
vm.runInNewContext(source,{document:doc,window:{addEventListener(){}},location:{pathname:'/Khaemenes_High.github.io/courses/language-arts/english-9/weeks/week-13/'},URL,localStorage:{getItem:k=>records.get(k)||null,setItem:(k,v)=>records.set(k,v)}});
assert.equal(buttons[1].child.href,'https://vervenveda.com/Khaemenes_High.github.io/courses/language-arts/english-9/learning-tools.html#week-13');
assert.equal(completion.textContent,'Mark Evidence Prepared');completion.click();assert.equal(completion.textContent,'Evidence prepared ✓');
const hub=fs.readFileSync(new URL('../learning-tools.html',import.meta.url),'utf8');
for(let n=1;n<=36;n++){assert.ok(hub.includes(`id="week-${n}"`));assert.ok(hub.includes(`weeks/week-${String(n).padStart(2,'0')}/index.html`));}
assert.equal((hub.match(/target="_blank" rel="noopener noreferrer"/g)||[]).length,4);
assert.ok(hub.includes('do not automatically share learner records'));
for(let n=13;n<=36;n++){
 const html=fs.readFileSync(new URL(`../weeks/week-${n}/index.html`,import.meta.url),'utf8');
 assert.equal((html.match(new RegExp(`data-save-field="week-${n}-day-`,'g'))||[]).length,5);
 for(const field of ['claim','evidence','reflection'])assert.ok(html.includes(`data-save-field="week-${n}-${field}"`));
 assert.ok(html.includes(`learning-tools.html#week-${n}`));assert.ok(!html.includes('/stos/'));assert.ok(html.includes('8/10'));
}
console.log('PASS: 36 week return routes, four isolated companion links, 120 daily tasks, preserved notebook keys and evidence-only completion');
