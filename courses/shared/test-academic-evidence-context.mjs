import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
const root=process.cwd();
const html=fs.readFileSync(path.join(root,"courses/science/integrated-science-9/academic-evidence-companion.html"),"utf8");
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert(script,"companion script required");
const cases=[
 ["science-9","9","Integrated Science","courses/science/integrated-science-9/index.html"],
 ["algebra-1","9","Algebra I","courses/mathematics/algebra-1/index.html"],
 ["geometry","10","Geometry","courses/mathematics/geometry/index.html"],
 ["algebra-2","11","Algebra II","courses/mathematics/algebra-2/index.html"],
 ["english-9","9","English 9","courses/language-arts/english-9/index.html"],
 ["english-10","10","English 10","courses/language-arts/english-10/index.html"],
 ["english-11","11","English 11","courses/language-arts/english-11/index.html"],
 ["english-12","12","English 12","courses/language-arts/english-12/index.html"]
];
for(const [course,grade,subject,page] of cases){
 const source=fs.readFileSync(path.join(root,page),"utf8");
 if(course!=="science-9")assert(source.includes("academic-evidence-companion.html?course="+course),"Missing course link: "+course);
 const listeners={};const make=()=>({value:"",nextElementSibling:null,after(node){this.nextElementSibling=node},closest(){return {firstChild:{textContent:"Subject"}}}});
 const elements={grade:make(),subject:make()},inputs=[elements.grade,elements.subject];
 const form={elements,querySelectorAll:()=>inputs,reset(){for(const el of inputs)el.value=""}};
 const nodes={record:form,message:{textContent:""},courseContext:{textContent:""},printRecord:{addEventListener(event,cb){listeners.print=cb}},exportRecord:{addEventListener(){}},clearRecord:{addEventListener(event,cb){listeners.clear=cb}}};
 const document={title:"",getElementById:id=>nodes[id],createElement:()=>({className:"",textContent:""})};
 const context={document,location:{search:"?course="+course},URLSearchParams,window:{confirm:()=>true,addEventListener(){},print(){}},URL,Blob,setTimeout:()=>{},console};
 vm.runInNewContext(script,context);
 assert.equal(elements.grade.value,grade,"opening grade "+course);
 assert.equal(elements.subject.value,subject,"opening subject "+course);
 assert.equal(nodes.courseContext.textContent,"Grade "+grade+" · "+subject);
 listeners.print();
 assert.equal(elements.grade.nextElementSibling.textContent,grade,"print grade "+course);
 assert.equal(elements.subject.nextElementSibling.textContent,subject,"print subject "+course);
 listeners.clear();
 assert.equal(elements.grade.value,grade,"reset grade "+course);
 assert.equal(elements.subject.value,subject,"reset subject "+course);
}
console.log("PASS academic evidence opening, print and reset context for all eight verified courses");
