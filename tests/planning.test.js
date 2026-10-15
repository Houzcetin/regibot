'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const P=require('../public/planning-core');
const {actionsFor}=require('../lib/actions');
const datasets=require('../data/curricula.json');
const calendar=require('../data/calendar.json');
const codes=new Set(['COMP 1202','SE 1105','MATH 1100','COMP 2233']);
const course=code=>({op:'course',code});
const rule={op:'and',items:[course('COMP 1202'),{op:'or',items:[course('SE 1105'),course('MATH 1100')]}]};
const c={code:'COMP 2233',verification:'verified',prerequisites:rule,corequisites:null};
test('AND/OR prerequisites report missing alternatives and accept either alternative',()=>{
  assert.equal(P.check(c,new Set(['COMP 1202','MATH 1100']),codes).status,'met');
  const r=P.check(c,new Set(['COMP 1202']),codes);assert.equal(r.status,'missing');assert.deepEqual(r.missing,['SE 1105','MATH 1100']);
  assert.equal(P.check(c,new Set(),codes).status,'missing');
  assert.equal(P.check(c,new Set(['COMP 2233']),codes).status,'completed');
});
test('verified absence is distinct from unknown, malformed or unsupported rules',()=>{
  assert.equal(P.check({...c,verification:'unverified'},new Set([...codes]),codes).status,'completed');
  assert.equal(P.check({...c,verification:'unverified'},new Set(['COMP 1202']),codes).status,'unknown');
  assert.equal(P.check({...c,prerequisites:null},new Set(),codes).status,'met');
  for(const r of [{op:'or',items:[]},course('BAD 1000'),{op:'guess'},undefined])assert.equal(P.check({...c,prerequisites:r},new Set(),codes).status,'unknown');
});
test('corequisites remain separate and do not count as completed prerequisites',()=>{
  const r=P.check({...c,prerequisites:null,corequisites:course('SE 1105')},new Set(),codes);
  assert.equal(r.status,'missing');assert.deepEqual(r.missing,[]);assert.deepEqual(r.corequisites,['SE 1105']);
});
test('production dataset is valid and has no guessed eligibility rules',()=>{
  assert.ok(datasets.every(P.validDataset));assert.ok(datasets[0].courses.length>35);
  for(const c of datasets[0].courses)assert.equal(P.check(c,new Set(),new Set(datasets[0].courses.map(c=>c.code))).status,'unknown');
  assert.equal(P.validDataset({...datasets[0],courses:[{...datasets[0].courses[0],source:'javascript:alert(1)'}]}),false);
});
test('checklist and course state survives reload, drops invalid values and resets',()=>{
  const values=new Map(),storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
  assert.ok(P.save(storage,{dataset:datasets[0].id,completed:['SE 1105','BAD 9999','SE 1105'],steps:['submit','approval','x'],email:'private'},datasets));
  const state=P.read(storage,datasets);assert.deepEqual(state.completed,['SE 1105']);assert.deepEqual(state.steps,['submit','approval']);assert.equal(JSON.stringify(state).includes('private'),false);
  P.reset(storage);assert.deepEqual(P.read(storage,datasets).steps,[]);
  storage.setItem('regibot-planning-v1','{broken');assert.deepEqual(P.read(storage,datasets).completed,[]);
  assert.deepEqual(P.cleanState({completed:'bad',steps:{}},datasets).steps,[]);
  const bad={getItem(){throw Error();},setItem(){throw Error();},removeItem(){throw Error();}};
  assert.deepEqual(P.read(bad,datasets).steps,[]);assert.equal(P.save(bad,state,datasets),false);assert.equal(P.reset(bad),false);
});
test('actions reject arbitrary paths, HTML, URLs, unknown events and extra properties',()=>{
  for(const a of [{type:'navigate',destination:'https://evil.test'},{type:'navigate',destination:'eligibility',url:'https://evil.test'},{type:'html',html:'<img>'},{type:'calendar',eventId:'missing'},{type:'email',topic:'other'},null])assert.equal(P.actionValid(a,calendar),false);
  assert.ok(P.actionValid({type:'navigate',destination:'eligibility'}));assert.ok(P.actionValid({type:'email',topic:'advisor'}));
});
test('actions require answer support and sources and preserve refusal behavior',()=>{
  assert.deepEqual(actionsFor('prerequisites','I do not know',[],null,calendar),[]);
  assert.deepEqual(actionsFor('prerequisites','Contact the office',[{}],null,calendar),[]);
  assert.deepEqual(actionsFor('prerequisites','Prerequisites need review',[{}],null,calendar),[{type:'navigate',destination:'eligibility'}]);
  assert.deepEqual(actionsFor('quota','I can’t help with quota',[{}],null,calendar),[]);
  const ev=calendar[1],answer=`Calendar date: ${ev.event_en}: ${ev.start}–${ev.end}`;
  assert.ok(actionsFor('calendar date',answer,[{url:'https://oim.yasar.edu.tr/wp-content/uploads/2026/04/2026-2027-Akademik-Takvim.pdf'}],[{event:ev}],calendar).some(a=>a.type==='calendar'));
  assert.ok(!actionsFor('calendar date','Calendar dates need checking',[{}],[{event:ev}],calendar).some(a=>a.type==='calendar'));
});
test('all-day ICS uses exclusive end at month/year/leap boundaries and CRLF folding',()=>{
  for(const [start,end,next] of [['2026-12-31','2026-12-31','20270101'],['2028-02-28','2028-02-29','20280301'],['2026-09-14','2026-09-18','20260919']]){
    const ics=P.ics({start,end,event:'Ders, kayıt;\ntest',event_en:'Course registration'},'tr',new Date('2026-10-15T00:00:00Z'));
    assert.ok(ics.includes('DTEND;VALUE=DATE:'+next));assert.ok(ics.includes('DTSTART;VALUE=DATE:'+start.replace(/-/g,'')));assert.ok(ics.includes('Ders\\, kayıt\\;\\ntest'));assert.equal(/(?<!\r)\n/.test(ics),false);
  }
  const folded=P.ics({start:'2026-01-01',end:'2026-01-01',event:'Ş'.repeat(200),event_en:'test'},'tr');
  assert.ok(folded.split('\r\n').every(line=>Buffer.byteLength(line)<=75));
  assert.throws(()=>P.ics({start:'2027-02-29',end:'2027-03-01',event:'x',event_en:'x'}));
  assert.equal(P.eventState(calendar[1],calendar[1].end),'ongoing');assert.equal(P.eventState(calendar[1],'2026-09-19'),'past');assert.equal(P.eventState(calendar[1],'2026-09-13'),'upcoming');
});
test('calendar action recognizes verified Turkish and English inclusive date ranges',()=>{
 const e=calendar[1],sources=[{url:'https://oim.yasar.edu.tr/wp-content/uploads/2026/04/2026-2027-Akademik-Takvim.pdf'}];
 for(const answer of ['Güz Dönemi Ders Kayıtları tarihleri: 14–18 Eylül 2026.','Fall course registration dates: 14–18 September 2026.'])assert.ok(actionsFor('calendar tarih',answer,sources,[{event:e}],calendar).some(a=>a.type==='calendar'));
 assert.ok(!actionsFor('calendar date','Fall course registration dates: 14–19 September 2026.',sources,[{event:e}],calendar).some(a=>a.type==='calendar'));
});
test('frontend boots planning routes with validated data in both languages',async()=>{
 const vm=require('node:vm'),fs=require('node:fs');
 for(const lang of ['en','tr'])for(const route of ['/uygunluk','/kontrol-listesi','/','/asistan']){
   const nodes=new Map(),listeners={};
   const node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',dataset:{},style:{},focus(){},classList:{toggle(){},add(){},remove(){},contains(){return false;}},setAttribute(){},removeAttribute(){},addEventListener(){},querySelector(){return null;},querySelectorAll(){return [];}});return nodes.get(id);};
   const context={window:{Planning:P,addEventListener(){},matchMedia(){return {matches:false};}},document:{body:{classList:{toggle(){}}},documentElement:{dataset:{}},getElementById:node,querySelectorAll(){return [];},querySelector(){return null;},addEventListener(k,fn){listeners[k]=fn;}},location:{hash:'#'+route},CSS:{escape:s=>s},localStorage:{getItem:k=>k==='regibot-language'?lang:null},fetch:async url=>({ok:true,json:async()=>url==='/api/curricula'?{datasets}:url==='/api/calendar'?{events:calendar,today:'2026-09-15',realToday:'2026-10-15',isDemoDate:true}:url==='/api/sources'?{sources:[],totalChunks:0}:{ok:true}}),setTimeout,Intl,Date,console};
   vm.runInNewContext(fs.readFileSync(require.resolve('../public/app.js'),'utf8'),context);
   await new Promise(resolve=>setImmediate(resolve));
   const html=node('main-area').innerHTML;assert.ok(!html.includes('undefined'));
   assert.ok(html.includes(route==='/uygunluk'?'data-course="SE 1105"':route==='/kontrol-listesi'?'data-step="approval"':'assistant-landing'));
   if(route==='/'||route==='/asistan'){assert.ok(html.includes('suggestion-chips'));assert.ok(html.includes('/assets/logo.svg'));assert.ok(!html.includes('data-course='));}
   if(route==='/kontrol-listesi'){assert.ok(html.includes('2026-09-15'));assert.ok(html.includes('2026-10-15'));}
 }
});
