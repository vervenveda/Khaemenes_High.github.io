import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const ctx=vm.createContext({localStorage:{getItem:()=>null}});
vm.runInContext(source.slice(source.indexOf('const APP ='),source.indexOf('function init()')),ctx);
const result=vm.runInContext(`courseStats({progress:{weeks:{1:{lessons:{Monday:true,Tuesday:true,Wednesday:true,Thursday:true,Friday:true},quiz:{best:100,attempts:[{score:100}]}},2:{quiz:{best:0,attempts:[{score:0}]}}},exams:{midterm:{best:0,attempts:[{score:0}]},final:{best:0,attempts:[{score:0}]}}}})`,ctx);
assert.equal(result.quizAverage,50,'Recorded zero quiz must contribute');
assert.equal(result.courseGrade,35,'Recorded zero exams retain their weights');
assert.ok(result.needsReview.includes(2));
const start=source.indexOf('function balancedChoiceOrders');
vm.runInContext(source.slice(start,source.indexOf('function renderQuiz',start)),ctx);
for(let run=0;run<40;run++){
 for(const key of ['midterm','final']){
  const result=vm.runInContext(`(()=>{const qs=APP.${key};const orders=balancedChoiceOrders(qs);return {qs,orders}})()`,ctx);
  const counts=[0,0,0,0];
  result.orders.forEach((order,i)=>{assert.equal(new Set(order).size,4);assert.deepEqual([...order].sort(),[0,1,2,3]);counts[order.indexOf(result.qs[i].answer)]++;});
  assert.ok(Math.max(...counts)-Math.min(...counts)<=1,'Correct positions balanced');
  assert.ok(counts[0]/result.qs.length<0.8,'First-position guessing cannot pass');
 }
}
assert.equal((source.match(/id="content"/g)||[]).length,1);
assert.ok(source.includes('choiceOrders[i].map(j=>'));
assert.ok(source.includes('standaloneEvidence:collectStandaloneEvidence()'));
console.log('PASS: zero-score grading, review flags, 40 randomized exam forms, single content region, complete evidence export');
