import fs from 'node:fs';

const html=fs.readFileSync(new URL('../grades/grade-10/index.html',import.meta.url),'utf8');
const required=[
  'Mathematics Pathway',
  'Placement-based',
  'Mathematics Hall',
  'Algebra I Readiness Assessment',
  'readiness and mastery evidence',
  'It does not assign ownership of a mathematics course.'
];
for(const token of required){
  if(!html.includes(token))throw new Error(`Missing Grade 10 placement-language token: ${token}`);
}
const forbidden=[
  'Open Grade 10 Mathematics',
  'Pre-Algebra / Grade 10 mathematics pathway',
  'Grade 10 Algebra I',
  'tenth-grade mathematics course',
  'beginning with the complete 36-week Algebra I'
];
for(const token of forbidden){
  if(html.includes(token))throw new Error(`Grade-owned mathematics label returned: ${token}`);
}
for(const href of [
  '../../courses/mathematics/',
  '../../courses/mathematics/algebra-1/',
  '../../courses/mathematics/algebra-1/diagnostic/'
]){
  if(!html.includes(`href="${href}"`))throw new Error(`Missing mathematics route: ${href}`);
}
if(!html.includes('name="viewport"'))throw new Error('Responsive viewport metadata missing');
console.log('Grade 10 mathematics labeling: PASS');
