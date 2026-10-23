import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const code=fs.readFileSync('courses/mathematics/assets/video-companion-v1.js','utf8');
new vm.Script(code);
const start=code.indexOf('function approvedPlacement(record)');
const end=code.indexOf('function makeCard(record,asset,index)',start);
assert.ok(start>0&&end>start,'video release checks isolated');
const gates=vm.runInNewContext(code.slice(start,end)+';({approvedPlacement,blockedCurriculumPlatform,approvedAsset})',{URL},{timeout:2000});
const verified={provider:'youtube',video_id:'Qt6X5KNbZ5c',embed_url:'https://www.youtube-nocookie.com/embed/Qt6X5KNbZ5c',instructor:'The Organic Chemistry Tutor',enabled:true,playback_verified:true,captions_verified:true,certification:{student_release_approved:true,whole_video_reviewed:true,privacy_embed_verified:true,captions_verified:true,responsive_lesson_rendering_verified:true,transcript_or_text_fallback_verified:true,topic_alignment_verified:true}};
assert.equal(gates.approvedPlacement({enabled:true,release_approved:true}),true);
assert.equal(gates.approvedAsset(verified),true,'fully evidenced supplemental video eligible');
for(const field of ['student_release_approved','whole_video_reviewed','privacy_embed_verified','captions_verified','responsive_lesson_rendering_verified','transcript_or_text_fallback_verified','topic_alignment_verified']){
 const item=structuredClone(verified);item.certification[field]=false;
 assert.equal(gates.approvedAsset(item),false,'certification required: '+field);
}
for(const field of ['playback_verified','captions_verified','enabled']){
 const item=structuredClone(verified);item[field]=false;
 assert.equal(gates.approvedAsset(item),false,'asset QA required: '+field);
}
for(const url of ['http://www.youtube-nocookie.com/embed/Qt6X5KNbZ5c','https://youtube.com/embed/Qt6X5KNbZ5c','https://www.youtube-nocookie.com/watch?v=Qt6X5KNbZ5c','https://www.youtube-nocookie.com/embed/Qt6X5KNbZ5c?autoplay=1','javascript:alert(1)']){
 assert.equal(gates.approvedAsset({...verified,embed_url:url}),false,'invalid embed denied: '+url);
}
assert.equal(gates.approvedAsset({...verified,instructor:'Khan Academy'}),false,'sovereign platform restriction remains');
let count=0;const assets=new Set();
for(const course of ['algebra-1','geometry','algebra-2']){
 const root='courses/mathematics/'+course+'/';
 const map=JSON.parse(fs.readFileSync(root+'video-map.json','utf8'));
 for(const p of map.placements){
  count++;
  assert.equal(p.enabled,false,'placement is pending: '+p.lesson_id);
  assert.equal(p.release_approved,false,'placement has not been approved: '+p.lesson_id);
  assert.ok(fs.existsSync(path.join(root,p.lesson_file)),'lesson exists: '+p.lesson_file);
  const f=path.resolve(root,p.shared_file);
  assert.ok(fs.existsSync(f),'asset exists: '+p.shared_file);
  const asset=JSON.parse(fs.readFileSync(f,'utf8'));
  assert.equal(asset.asset_id,p.asset_id,'asset and placement IDs match');
  assert.equal(gates.approvedPlacement(p),false,'unverified placement stays hidden');
  assert.equal(gates.approvedAsset(asset),false,'unverified asset stays hidden');
  assert.equal(gates.blockedCurriculumPlatform(asset),false,'no prohibited source in student map');
  assets.add(asset.asset_id);
 }
}
assert.equal(count,64,'advanced-video staged inventory');
assert.ok(assets.size>10,'distinct staged assets');
console.log('PASS: 64 advanced-math placements remain unreleased. Renderer requires complete playback, captions, text alternative, privacy, alignment and responsive certification; Khan block and exact HTTPS no-cookie embed policy preserved.');
