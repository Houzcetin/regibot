'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const P=require('../public/planning-core'),W=require('../public/what-if-core');
const ds=require('../data/curricula.json'),d=ds[0];
const leaf=code=>({op:'course',code}),and=(...items)=>({op:'and',items}),or=(...items)=>({op:'or',items});
const course=(code,pre=null,co=null)=>({code,verification:'verified',prerequisites:pre,corequisites:co,title:{en:code,tr:code},ects:5,source:'https://ce.yasar.edu.tr/en/'});
const fixture={id:'fixture',program:{en:'Fixture',tr:'Örnek'},version:'test',courses:[course('A 1000'),course('B 2000',leaf('A 1000')),course('C 3000',or(leaf('B 2000'),leaf('X 4000'))),course('D 5000',and(leaf('B 2000'),leaf('Y 6000'))),course('X 4000'),course('Y 6000')]};
test('scenario AND conditions require every branch and never automatically complete newly ready courses',()=>{
 const a=W.scenario(fixture,[],['A 1000']);assert.deepEqual(a.groups.newlyReady,['B 2000']);assert.equal(a.results['C 3000'].status,'missing');assert.equal(a.completed.has('B 2000'),false);
 const b=W.scenario(fixture,[],['B 2000','Y 6000']);assert.equal(b.results['D 5000'].status,'met');assert.ok(b.issues.some(x=>x.code==='B 2000'&&x.kind==='unmet'));
 assert.equal(W.scenario(fixture,[],['B 2000']).results['D 5000'].status,'missing');
});
test('official OR alternatives preserve exact legacy codes without copying aliases into baseline',()=>{
 const baseline=['MATH 131'],plan=W.scenario(d,baseline,[]);assert.equal(plan.results['MATH 1132'].status,'met');assert.equal(plan.results['MATH 2261'].status,'met');assert.equal(plan.completed.has('MATH 1131'),false);assert.deepEqual(baseline,['MATH 131']);
 const expression=W.explanation(d.courses.find(c=>c.code==='MATH 1132'),plan,W.graph(d));assert.equal(expression.prerequisites.op,'or');assert.equal(expression.prerequisites.items.length,3);
});
test('direct references, indirect chains, and actual scenario effects are distinct',()=>{
 const g=W.graph(fixture),r=W.relationships(g,'A 1000');assert.deepEqual(r.direct,['B 2000']);assert.deepEqual(r.indirect,['C 3000','D 5000']);
 const result=W.postpone(fixture,['X 4000'],['A 1000'],'A 1000');assert.deepEqual(result.lost,['B 2000']);assert.equal(result.after.results['C 3000'].status,'met');assert.ok(!result.lost.includes('C 3000'));
 const alt=W.postpone(fixture,['X 4000'],['B 2000'],'B 2000');assert.ok(alt.alternatives.includes('C 3000'));assert.equal(alt.after.results['C 3000'].status,'met');
});
test('proofs prefer a satisfied baseline OR alternative and do not invent hypothetical effects',()=>{
 const plan=W.scenario(fixture,['X 4000'],['B 2000']),c=fixture.courses.find(c=>c.code==='C 3000');
 assert.deepEqual(W.explanation(c,plan,W.graph(fixture)).support,[]);assert.equal(W.explanation(c,plan,W.graph(fixture)).kind,'unchanged');assert.ok(plan.groups.unchangedReady.includes('C 3000'));
});
test('hypothetical passes are separate, immutable inputs; A/B comparisons and protected postponement preserve baseline',()=>{
 const baseline=Object.freeze(['X 4000']),a=Object.freeze(['A 1000']),b=Object.freeze(['Y 6000']),before=JSON.stringify(fixture);
 const result=W.compare(fixture,baseline,a,b);assert.ok(result.onlyA.includes('B 2000'));assert.ok(result.a.assumed.includes('A 1000'));assert.ok(!result.a.groups.newlyReady.includes('A 1000'));assert.equal(result.b.completed.has('A 1000'),false);
 const post=W.postpone(fixture,baseline,a,'X 4000');assert.equal(post.protectedBaseline,true);assert.ok(post.after.baseline.has('X 4000'));assert.deepEqual(post.next,['A 1000']);assert.equal(JSON.stringify(fixture),before);assert.deepEqual(a,['A 1000']);
});
test('sequencing is independent of selection order and flags unmet assumptions',()=>{
 const seq=W.scenario(fixture,[],['B 2000','A 1000']);assert.ok(seq.feasible);const warning=seq.issues.find(x=>x.code==='B 2000');assert.equal(warning.kind,'sequence');assert.deepEqual(warning.support,['A 1000']);assert.equal(warning.level,1);
 const unmet=W.scenario(fixture,[],['D 5000']);assert.equal(unmet.feasible,false);assert.equal(unmet.issues[0].kind,'unmet');
 const optional=W.scenario(fixture,['X 4000'],['C 3000','B 2000']);assert.ok(!optional.issues.some(x=>x.code==='C 3000')); // no sequencing imposed by the unused OR branch
});
test('unknown and malformed requirements remain unknown, with bounded traversal',()=>{
 const bad={...fixture,courses:[course('A 1000',{op:'or',items:[]}),{...course('B 2000'),verification:'unverified'},course('C 3000',leaf('MISSING 9999'))]};
 const plan=W.scenario(bad,[],['A 1000']);assert.equal(plan.results['B 2000'].status,'unknown');assert.equal(plan.results['C 3000'].status,'unknown');assert.equal(plan.issues[0].kind,'unknown');assert.equal(W.graph(bad).unknown.length,3);assert.equal(W.graph(bad).edges.length,0);
});
test('cycles are detected without completing circular assumptions; OR alternatives may break them',()=>{
 const cycle={...fixture,courses:[course('A 1000',leaf('B 2000')),course('B 2000',leaf('A 1000'))]};
 const g=W.graph(cycle);assert.ok(g.cycles.length);assert.equal(W.subgraph(g,'A 1000').nodes.length,2);
 const plan=W.scenario(cycle,[],['A 1000','B 2000']);assert.equal(plan.feasible,false);assert.ok(plan.issues.every(x=>x.kind==='order'));
 const avoidable={...cycle,courses:[course('A 1000',or(leaf('B 2000'),leaf('X 4000'))),course('B 2000',leaf('A 1000')),course('X 4000')]};
 assert.ok(W.graph(avoidable).cycles.length);assert.ok(W.scenario(avoidable,['X 4000'],['A 1000','B 2000']).feasible);
 const long={...cycle,courses:Array.from({length:400},(_,i)=>course(`C ${1000+i}`,leaf(`C ${1000+(i+1)%400}`)))};assert.ok(W.graph(long).cycles.length);assert.equal(W.subgraph(W.graph(long),'C 1000','requirements',12).nodes.length,12);
});
test('corequisites are separate edges and require completion rather than concurrent enrollment',()=>{
 const co={...fixture,courses:[course('A 1000'),course('B 2000',null,leaf('A 1000'))]};
 const g=W.graph(co);assert.equal(g.edges[0].kind,'co');const before=W.scenario(co,[],[]);assert.deepEqual(before.results['B 2000'].corequisites,['A 1000']);
 const after=W.scenario(co,[],['A 1000','B 2000']);assert.ok(after.issues.some(x=>x.code==='B 2000'&&x.kind==='sequence'));assert.ok(after.feasible);
});
test('scenario storage validates version, dataset, target and selections and never edits real planning records',()=>{
 const map=new Map([['regibot-planning-v1','actual progress']]),storage={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 const raw={version:1,dataset:d.id,a:['SE 1105','SE 1105','MATH 131','BAD 9999'],b:'bad',target:'COMP 2215',email:'private'};
 assert.ok(W.save(storage,raw,d));const loaded=W.read(storage,d);assert.deepEqual(loaded.state.a,['SE 1105']);assert.deepEqual(loaded.state.b,[]);assert.ok(!JSON.stringify(loaded.state).includes('private'));
 assert.deepEqual(W.clean(raw,{...d,id:'other'}).a,[]);assert.equal(W.clean({...raw,target:'javascript:alert(1)'},d).target,'');assert.deepEqual(W.clean({...raw,version:99},d).a,[]);
 assert.ok(W.reset(storage));assert.equal(map.get('regibot-planning-v1'),'actual progress');assert.equal(W.read(storage,d).state.a.length,0);
 storage.setItem(W.storageKey,'{broken');assert.equal(W.read(storage,d).state.a.length,0);
 const unavailable={getItem(){throw Error();},setItem(){throw Error();},removeItem(){throw Error();}};assert.equal(W.read(unavailable,d).unavailable,true);assert.equal(W.save(unavailable,raw,d),false);assert.equal(W.reset(unavailable),false);
});
function mount({lang='en',theme='light',width=1100,actual=[],data=d,storedScenario=null,storageUnavailable=false}={}){
 const vm=require('node:vm'),fs=require('node:fs'),nodes=new Map(),listeners={},windowListeners={};
 const values=new Map([['regibot-language',lang],['regibot-planning-v1',JSON.stringify({version:1,dataset:d.id,completed:actual,steps:['curriculum']})]]);
 if(storedScenario)values.set(W.storageKey,JSON.stringify(storedScenario));
 const node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',dataset:{},style:{},scrollTop:0,focus(){},classList:{toggle(){},add(){},remove(){},contains(){return false;}},setAttribute(){},removeAttribute(){},addEventListener(){},querySelector(){return null;},querySelectorAll(){return [];}});return nodes.get(id);};
 const storage={getItem(k){if(storageUnavailable)throw Error('denied');return values.get(k)??null;},setItem(k,v){if(storageUnavailable)throw Error('denied');values.set(k,v);},removeItem(k){if(storageUnavailable)throw Error('denied');values.delete(k);}};
 const add=(map,k,fn)=>{if(!map[k])map[k]=[];map[k].push(fn);};
 const context={Planning:P,WhatIf:W,window:{Planning:P,WhatIf:W,innerWidth:width,addEventListener(k,fn){add(windowListeners,k,fn);},matchMedia(q){return {matches:q.includes('max-width')&&width<=620||q.includes('prefers-color-scheme: dark')&&theme==='dark'};}},document:{body:{classList:{toggle(){}}},documentElement:{dataset:theme==='dark'?{theme:'dark'}:{}},getElementById:node,querySelectorAll(){return [];},querySelector(){return null;},addEventListener(k,fn){add(listeners,k,fn);}},location:{hash:'#/what-if'},CSS:{escape:s=>s},URL,TextEncoder,requestAnimationFrame:fn=>fn(),localStorage:storage,fetch:async url=>({ok:true,json:async()=>url==='/api/curricula'?{datasets:data?[data]:[]}:url==='/api/calendar'?{events:[],today:'2026-10-15',realToday:'2026-10-15',isDemoDate:false}:url==='/api/sources'?{sources:[],totalChunks:0}:{ok:true}}),setTimeout,Intl,Date,console};
 vm.createContext(context);vm.runInContext(fs.readFileSync(require.resolve('../public/planning-core.js'),'utf8'),context);vm.runInContext(fs.readFileSync(require.resolve('../public/what-if-core.js'),'utf8'),context);context.window.Planning=context.Planning;context.window.WhatIf=context.WhatIf;vm.runInContext(fs.readFileSync(require.resolve('../public/what-if-ui.js'),'utf8'),context);context.window.WhatIfUI=context.WhatIfUI;vm.runInContext(fs.readFileSync(require.resolve('../public/app.js'),'utf8'),context);
 const element=(props={})=>({id:'',dataset:{},...props,closest(selector){const rules=[['[data-wf-postpone]','wfPostpone'],['[data-wf-focus]','wfFocus'],['[data-what-if-code]','whatIfCode'],['[data-wf-reset]','wfReset'],['[data-reset-planning]','resetPlanning']];return rules.some(([s,key])=>selector.includes(s)&&Object.hasOwn(this.dataset,key))?this:null;}});
 return {values,storage,context,html:()=>node('main-area').innerHTML,dispatch(k,props){const event={target:element(props),preventDefault(){}};for(const fn of listeners[k]||[])fn(event);},storageEvent(key){for(const fn of windowListeners.storage||[])fn({key});}};
}
test('what-if route renders both languages/themes and narrow/wide configurations with interactive scenario isolation',async()=>{
 const fs=require('node:fs'),css=fs.readFileSync(require.resolve('../public/style.css'),'utf8');
 assert.match(css,/@media\(max-width:620px\)\{\.wf-plans\{grid-template-columns:1fr/);assert.match(css,/:root\[data-theme="dark"\] \.wf-scope/);
 for(const lang of ['tr','en'])for(const theme of ['light','dark'])for(const width of [360,1100]){
   const app=mount({lang,theme,width,actual:['MATH 131']});await new Promise(resolve=>setImmediate(resolve));
   assert.ok(app.html().includes(lang==='tr'?'Ya şöyle olursa?':'What if? Planner'));assert.ok(!app.html().includes('undefined'));assert.equal(app.context.document.documentElement.dataset.theme,theme==='dark'?'dark':undefined);
   const before=app.values.get('regibot-planning-v1');
   app.dispatch('change',{dataset:{wfCourse:'SE 1105',wfPlan:'a'},checked:true});
   let saved=JSON.parse(app.values.get(W.storageKey));assert.deepEqual(saved.a,['SE 1105']);assert.deepEqual(saved.b,[]);assert.equal(app.values.get('regibot-planning-v1'),before);
   app.dispatch('change',{id:'wf-target',value:'COMP 4910'});assert.ok(app.html().includes('<svg'));assert.ok(app.html().includes(lang==='tr'?'VE':'AND'));assert.ok(app.html().includes('wf-graph-text'));assert.ok(!app.html().includes('undefined'));
   app.dispatch('change',{dataset:{wfCourse:'SE 1105',wfPlan:'b'},checked:true});
   app.dispatch('click',{dataset:{wfPostpone:'SE 1105',wfPlan:'a'}});saved=JSON.parse(app.values.get(W.storageKey));assert.deepEqual(saved.a,[]);assert.deepEqual(saved.b,['SE 1105']);assert.ok(app.html().includes('COMP 2233'));assert.equal(app.values.get('regibot-planning-v1'),before);
   app.dispatch('click',{dataset:{wfReset:''}});saved=app.values.get(W.storageKey);assert.equal(saved,undefined);assert.equal(app.values.get('regibot-planning-v1'),before);
   // A separate tab updates actual progress: the next comparison must use that new baseline.
   app.storage.setItem('regibot-planning-v1',JSON.stringify({version:1,dataset:d.id,completed:['SE 1105'],steps:[]}));app.storageEvent('regibot-planning-v1');
   app.dispatch('click',{dataset:{wfPostpone:'SE 1105',wfPlan:'a'}});assert.ok(app.html().includes(lang==='tr'?'başlangıç durumunuz değiştirilmedi':'baseline was left unchanged'));
   assert.deepEqual(JSON.parse(app.values.get('regibot-planning-v1')).completed,['SE 1105']);
 }
});
test('unavailable/malformed storage and missing curriculum render useful fallbacks without changing actual progress',async()=>{
 for(const settings of [{storageUnavailable:true},{data:null},{storedScenario:{version:1,dataset:'different',a:['SE 1105'],b:[],target:'COMP 4910'}}]){
   const app=mount(settings);await new Promise(resolve=>setImmediate(resolve));assert.ok(!app.html().includes('undefined'));
   if(settings.data===null)assert.ok(app.html().includes('validated curriculum is unavailable'));
   if(settings.storageUnavailable){assert.ok(/Browser storage is unavailable|Tarayıcı depolaması kullanılamıyor/.test(app.html()));app.dispatch('change',{dataset:{wfCourse:'SE 1105',wfPlan:'a'},checked:true});assert.ok(app.html().includes('SE 1105'));}
   if(settings.storedScenario)assert.ok(!app.html().includes('id="wf-graph-title"'));
 }
});
test('UI explains unknown/cyclic data, focuses a course-card action, and resets scopes independently',async()=>{
 const unknown={...fixture,courses:[{...course('A 1000'),verification:'unverified'}]};
 const missing=mount({data:unknown});await new Promise(resolve=>setImmediate(resolve));assert.ok(missing.html().includes('Some course rules are unknown or malformed: A 1000'));
 const cycle={...fixture,courses:[course('A 1000',leaf('B 2000')),course('B 2000',leaf('A 1000'))]};
 const circular=mount({data:cycle,storedScenario:{version:1,dataset:cycle.id,a:['A 1000','B 2000'],b:[],target:'A 1000'}});await new Promise(resolve=>setImmediate(resolve));assert.ok(circular.html().includes('Possible cycle in published dependencies'));assert.ok(circular.html().includes('No supported completion order'));assert.ok(circular.html().includes('<svg'));
 const app=mount({actual:['MATH 131']});await new Promise(resolve=>setImmediate(resolve));
 app.dispatch('click',{dataset:{whatIfCode:'COMP 3323'}});assert.equal(JSON.parse(app.values.get(W.storageKey)).target,'COMP 3323');assert.ok(app.html().includes('wf-graph-title'));
 app.dispatch('change',{dataset:{wfCourse:'COMP 2233',wfPlan:'a'},checked:true});app.dispatch('click',{dataset:{wfPostpone:'COMP 2233',wfPlan:'a'}});assert.ok(app.html().includes('Postponement comparison'));
 app.storage.setItem('regibot-planning-v1',JSON.stringify({version:1,dataset:d.id,completed:['MATH 131','COMP 2233'],steps:[]}));app.storageEvent('regibot-planning-v1');assert.ok(!app.html().includes('Postponement comparison'));
 app.dispatch('click',{dataset:{resetPlanning:''}});assert.equal(app.values.get(W.storageKey),undefined);assert.equal(app.values.get('regibot-planning-v1'),undefined);
});
