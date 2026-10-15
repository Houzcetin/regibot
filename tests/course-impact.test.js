'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const P=require('../public/planning-core'),W=require('../public/what-if-core'),A=require('../public/course-analysis'),UI=require('../public/course-impact-ui'),MapUI=require('../public/course-map');
const ds=require('../data/curricula.json'),d=ds[0];
const context=(completed=[],override)=>A.validateContext({dataset:d.id,sharing:completed.length?'saved':'none',...(completed.length?{completed}:{}),...(override?{hypotheticalIncomplete:override}:{})},ds);
const analysis=(q='What happens if I fail SE 1105?',completed=[])=>A.build(context(completed),A.resolve(q,d));
test('English and Turkish pass/fail/postpone questions resolve exact canonical codes',()=>{
 for(const q of ['What happens if I fail SE1105?','SE 1105’ten kalırsam ne olur?','What does passing SE-1105 unlock?','SE 1105 dersini ertelersem ne olur?']){assert.equal(A.resolve(q,d).course,'SE 1105');assert.ok(A.isRequest(q,d));}
 assert.equal(A.resolve('SE 1105’ten kalırsam ne olur?',d).intent,'incomplete');assert.equal(A.resolve('What does passing SE 1105 unlock?',d).intent,'pass');
 assert.equal(A.resolve('SE 1105 önkoşulları nedir?',d).intent,'requirements');assert.equal(A.resolve('What are the prereqs for COMP 4910?',d).intent,'requirements');
 const target=A.resolve('Can I take COMP 4910 if I fail EEE 2110?',d);assert.equal(target.course,'EEE 2110');assert.equal(target.target,'COMP 4910');
 assert.equal(A.resolve('What if I fail FAKE 9999?',d).kind,'unknown');assert.equal(A.resolve('What if I fail FAKE 9999?',d,[],'SE 1105').course,'SE 1105');assert.equal(A.resolve('Which courses does SE 1105 unlock?',d,[],'FAKE 9999').kind,'unknown');
 for(const q of ['Why did my login fail?','My payment failed','My course registration failed','What happens if I fail math?','What are retake rules?'])assert.equal(A.isRequest(q,d),false);
});
test('course names require a unique match and missing or ambiguous context asks for clarification',()=>{
 assert.equal(A.resolve('What happens if I fail calculus?',d).kind,'ambiguous');assert.equal(A.resolve('What happens if I fail mathematical logic?',d).course,'MATH 1100');
 const ambiguous=A.resolve('What happens if I fail calculus?',d);assert.equal(ambiguous.candidates.length,2);assert.equal(A.resolve('What happens if I fail calculus?',d,[],'MATH 1132').course,'MATH 1132');assert.equal(A.resolve('What happens if I fail calculus?',d,[],'SE 1105').kind,'unknown');
 assert.equal(A.resolve('Which courses would passing this unlock?',d).kind,'missing');assert.equal(A.resolve('What happens if I fail a course?',d).kind,'missing');
 const history=[{role:'user',content:'What if I fail SE 1105?'},{role:'assistant',content:'COMP 2215 and COMP 2233 have published references.'}];assert.equal(A.resolve('Which courses would passing this unlock?',d,history).course,'SE 1105');
 assert.equal(A.resolve('Which courses would passing this unlock?',d,[{role:'user',content:'SE 1105 and COMP 2215'}]).kind,'missing');
});
test('planning consent schema limits exact codes and rejects extra or unconsented private data',()=>{
 for(const value of [{dataset:d.id,sharing:'none',completed:['SE 1105']},{dataset:d.id,sharing:'saved',completed:['BAD 9999']},{dataset:d.id,sharing:'saved',completed:Array(101).fill('SE 1105')},{dataset:d.id,sharing:'saved',completed:'SE 1105'},{dataset:'missing',sharing:'saved',completed:[]},{dataset:d.id,sharing:'saved',completed:[],name:'private'},{dataset:d.id,sharing:'none',hypotheticalIncomplete:'BAD 9999'}])assert.equal(A.validateContext(value,ds),null);
 const legacy=A.validateContext({dataset:d.id,sharing:'saved',completed:['MATH 131','MATH 131']},ds);assert.deepEqual(legacy.supplied,['MATH 131']);assert.equal(A.validateContext({dataset:d.id,sharing:'saved',completed:['MATH131']},ds),null);
 const actual=Object.freeze(['MATH 131','SE 1105']);assert.deepEqual(UI.planning(d,actual,false),{dataset:d.id,sharing:'none'});assert.deepEqual(UI.planning(d,actual,true).completed,actual);assert.equal(actual.length,2);
 for(const lang of ['en','tr']){const prompt=UI.prompt(d,lang);assert.ok(prompt.includes(UI.TEXT[lang].privacy));assert.ok(prompt.includes('data-impact-consent="saved"'));assert.ok(prompt.includes('data-impact-consent="none"'));assert.ok(!prompt.includes('checked'));}
});
test('server analysis matches the explorer engine and distinguishes direct effects from chains',()=>{
 const a=analysis(),expected=W.explorer(d,[],a.course);assert.ok(A.valid(a));assert.deepEqual(a.result.immediate,expected.changed);assert.equal(a.result.immediate.length,4);assert.ok(!a.result.immediate.includes('SE 1105'));assert.ok(!a.result.immediate.includes('COMP 3304'));assert.ok(a.result.indirect.includes('COMP 3304'));
 const selected=W.scenario(a.dataset,a.context.completed,[a.course]);assert.equal(selected.completed.has('COMP 2215'),false);assert.equal(selected.results['COMP 3304'].status,'missing');
 const before=JSON.stringify(d);analysis();assert.equal(JSON.stringify(d),before);
 const passed=analysis('What does passing SE 1105 unlock?');assert.deepEqual(a.result.immediate,passed.result.immediate);assert.equal(passed.intent,'pass');
});
test('exact legacy OR alternatives preserve options and AND requirements stay grouped',()=>{
 const a=analysis('What does passing MATH 1131 unlock?',['MATH 131']);assert.ok(!a.result.immediate.includes('MATH 1132'));assert.ok(a.result.alternatives.includes('MATH 1132'));
 const c=d.courses.find(c=>c.code==='COMP 4910');assert.equal(c.prerequisites.op,'and');assert.ok(A.rule(c.prerequisites).includes(' AND '));
 const target=analysis('Can I take COMP 4910 if I fail EEE 2110?');assert.equal(target.result.target.code,'COMP 4910');assert.equal(target.result.target.without.status,'missing');assert.equal(target.result.target.with.status,'missing');assert.ok(target.result.directBlocked.includes('COMP 4910'));
 const source=a.dataset.courses.find(c=>c.code==='MATH 1132');assert.ok(A.rule(source.prerequisites).includes(' OR '));assert.ok(A.rule(source.prerequisites).includes('MATH 131'));
});
test('already completed courses conflict unless separately and explicitly overridden',()=>{
 const baseline=Object.freeze(['SE 1105']),c=context(baseline),r=A.resolve('What if I fail SE 1105?',d);assert.equal(A.build(c,r),null);assert.ok(A.clarification('completed','en').includes('retake'));
 const override=A.build(context(baseline,'SE 1105'),r);assert.ok(A.valid(override));assert.deepEqual(override.context.supplied,['SE 1105']);assert.deepEqual(override.context.completed,[]);assert.equal(override.context.override,'SE 1105');assert.deepEqual(baseline,['SE 1105']);assert.ok(A.fallback(override).includes('actual progress is unchanged'));
 assert.equal(A.build(context(baseline,'COMP 2215'),r),null);
});
test('unknown and malformed rules are not invented; unmet assumptions are conditional',()=>{
 const conditional=analysis('What if I fail COMP 2215?');assert.equal(conditional.result.selected.status,'missing');assert.ok(A.fallback(conditional).includes('eventually passed'));
 const unknown=JSON.parse(JSON.stringify(d));unknown.courses.find(c=>c.code==='SE 1105').verification='unverified';const a=A.build({d:unknown,sharing:'none',supplied:[],override:null},A.resolve('What if I fail SE 1105?',unknown));assert.equal(a.result.selected.status,'unknown');assert.ok(a.result.unknown.includes('SE 1105'));assert.ok(A.valid(a));
});
test('course-specific requirements and completed targets are explained without registration claims',()=>{
 const a=analysis('What are the prerequisites for COMP 4910?');assert.equal(a.intent,'requirements');assert.ok(A.fallback(a).startsWith('COMP 4910: Its prerequisites are not yet met.'));assert.ok(A.fallback(a).includes(' AND '));
 const target=analysis('Can I take COMP 4910 if I fail EEE 2110?',['COMP 4910']);assert.ok(A.fallback(target).includes('COMP 4910: Already completed.'));
});
test('validated snapshots reject tampered effects, courses and arbitrary source URLs',()=>{
 const a=analysis(),clone=()=>JSON.parse(JSON.stringify(a));for(const mutate of [x=>x.result.immediate.push('FAKE 9999'),x=>x.dataset.courses[0].source='https://evil.example',x=>x.course='FAKE 9999',x=>x.context.completed.push('FAKE 9999'),x=>x.type='html',x=>x.context.sharing='none-and-saved']){const x=clone();mutate(x);assert.equal(A.valid(x),false);assert.equal(UI.card(x,'1'),'');}
 for(const value of [null,{},[],{dataset:{courses:null}}])assert.equal(A.valid(value),false);
});
test('multiple cards/maps have independent IDs, modes, snapshot metadata and localized disclosures',()=>{
 const a=analysis();for(const lang of ['en','tr']){
 const one=UI.card(a,'1',{lang}),two=UI.card(a,'2',{lang,open:true,mode:'incomplete',stale:true});assert.ok(!one.includes('<svg'));assert.ok(two.includes('<svg'));assert.ok(two.includes('id="impact-2-arrow"'));assert.ok(!two.includes('impact-1-arrow'));assert.ok(two.includes(UI.TEXT[lang].stale));assert.ok(one.includes(UI.TEXT[lang].generalLabel));assert.ok(one.includes(UI.TEXT[lang].map));assert.ok(two.includes('wf-graph-text'));assert.ok(two.includes(lang==='tr'?'VE':'AND'));
 const passed=UI.map(a,'1','passed',lang),notPassed=UI.map(a,'1','incomplete',lang);assert.ok(passed.includes('wf-node wf-assumed'));assert.ok(!notPassed.includes('wf-node wf-assumed'));assert.ok(passed.includes('marker-end="url(#impact-1-arrow)"'));assert.ok(!one.includes('data-result-filter'));
 }
 assert.throws(()=>MapUI.render({dataset:d,course:'SE 1105',plan:W.scenario(d,[],[]),id:'bad" onclick="evil'}));
 const changed=JSON.parse(JSON.stringify(a));changed.dataset.courses[0].title.en='<img src=x onerror=evil>';const html=UI.card(changed,'3');assert.ok(!html.includes('<img src=x')); // Labels cannot define HTML.
});
test('AI explanation failure yields deterministic fallback and refusal stays a refusal',async()=>{
 const a=analysis();const failed=await A.explain(a,'en',async()=>{throw Error('provider down');});assert.equal(failed.fallback,true);assert.ok(failed.answer.includes('4 additional course options'));assert.ok(failed.answer.includes('no completed courses'));assert.ok(A.valid(a));
 assert.equal((await A.explain(a,'tr',async()=>'' )).fallback,true);assert.ok((await A.explain(a,'tr',async()=>{throw Error();})).answer.includes('SE 1105'));
 assert.deepEqual(await A.explain(a,'en',async()=>({refused:true})),{refused:true});assert.deepEqual(await A.explain(a,'en',async()=>'Verified explanation'),{answer:'Verified explanation',fallback:false});
});
