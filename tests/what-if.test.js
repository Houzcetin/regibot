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
function mount({lang='en',theme='light',width=1100,actual=[],data=d,storedScenario=null,storedExplorer=null,storageUnavailable=false,route='/what-if',chatFetch=null}={}){
 const vm=require('node:vm'),fs=require('node:fs'),nodes=new Map(),listeners={},windowListeners={};
 const chatRequests=[];
 const values=new Map([['regibot-language',lang],['regibot-planning-v1',JSON.stringify({version:1,dataset:data?.id||d.id,completed:actual,steps:['curriculum']})]]);
 if(storedScenario)values.set(W.storageKey,JSON.stringify(storedScenario));
 if(storedExplorer)values.set(W.explorerKey,JSON.stringify(storedExplorer));
 const node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',dataset:{},style:{},scrollTop:0,scrollHeight:500,value:'',children:new Proxy([],{get:(target,key)=>typeof key==='string'&&/^\d+$/.test(key)?{querySelector(){return {textContent:''};}}:target[key]}),appendChild(){},focus(){},classList:{toggle(){},add(){},remove(){},contains(){return false;}},attributes:{},setAttribute(k,v){this.attributes[k]=String(v);},removeAttribute(k){delete this.attributes[k];},listeners:{},addEventListener(k,fn){this.listeners[k]=fn;},querySelector(){return null;},querySelectorAll(){return [];}});return nodes.get(id);};
 const storage={getItem(k){if(storageUnavailable)throw Error('denied');return values.get(k)??null;},setItem(k,v){if(storageUnavailable)throw Error('denied');values.set(k,v);},removeItem(k){if(storageUnavailable)throw Error('denied');values.delete(k);}};
 const add=(map,k,fn)=>{if(!map[k])map[k]=[];map[k].push(fn);};
 const context={Planning:P,WhatIf:W,window:{Planning:P,WhatIf:W,innerWidth:width,addEventListener(k,fn){add(windowListeners,k,fn);},matchMedia(q){return {matches:q.includes('max-width')&&width<=620||q.includes('prefers-color-scheme: dark')&&theme==='dark'};}},document:{body:{classList:{toggle(){}}},documentElement:{dataset:theme==='dark'?{theme:'dark'}:{}},getElementById:node,createElement:()=>node('created'),querySelectorAll(){return [];},querySelector(){return null;},addEventListener(k,fn){add(listeners,k,fn);}},location:{hash:'#'+route},CSS:{escape:s=>s},URL,TextEncoder,requestAnimationFrame:fn=>fn(),localStorage:storage,fetch:async (url,init)=>{if(url==='/api/chat'){const body=JSON.parse(init.body);chatRequests.push(body);return {ok:true,json:async()=>chatFetch?chatFetch(body):{answer:'Test answer'}};}return {ok:true,json:async()=>url==='/api/curricula'?{datasets:data?[data]:[]}:url==='/api/calendar'?{events:[],today:'2026-10-15',realToday:'2026-10-15',isDemoDate:false}:url==='/api/sources'?{sources:[],totalChunks:0}:{ok:true}};},setTimeout,Intl,Date,console};
 vm.createContext(context);vm.runInContext(fs.readFileSync(require.resolve('../public/planning-core.js'),'utf8'),context);vm.runInContext(fs.readFileSync(require.resolve('../public/what-if-core.js'),'utf8'),context);context.window.Planning=context.Planning;context.window.WhatIf=context.WhatIf;for(const [file,name] of [['course-analysis','CourseAnalysis'],['course-map','CourseMap'],['course-impact-ui','CourseImpactUI']]){vm.runInContext(fs.readFileSync(require.resolve('../public/'+file+'.js'),'utf8'),context);context.window[name]=context[name];}vm.runInContext(fs.readFileSync(require.resolve('../public/what-if-ui.js'),'utf8'),context);context.window.WhatIfUI=context.WhatIfUI;vm.runInContext(fs.readFileSync(require.resolve('../public/app.js'),'utf8'),context);
 const element=(props={})=>({id:'',dataset:{},...props,closest(selector){
   const attrs=[...selector.matchAll(/\[data-([a-z-]+)\]/g)].map(m=>m[1].replace(/-([a-z])/g,(_,c)=>c.toUpperCase()));
   return attrs.some(key=>Object.hasOwn(this.dataset,key))?this:null;
 }});
 return {values,storage,context,node,chatRequests,html:()=>node('main-area').innerHTML,dispatch(k,props,extra={}){const event={target:element(props),preventDefault(){},...extra};for(const fn of listeners[k]||[])fn(event);},storageEvent(key){for(const fn of windowListeners.storage||[])fn({key});}};
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
const click=(app,dataset)=>app.dispatch('click',{dataset});
const choose=(app,code,plan='x')=>click(app,{wfChoose:code,wfPlan:plan});
const saved=app=>JSON.parse(app.values.get(W.storageKey));
test('single-course pass/postpone compare identical states, excluding assumed passes and indirect relationships',()=>{
 const pass=W.preview(fixture,[],['A 1000'],{selected:'A 1000'}),post=W.preview(fixture,[],['A 1000'],{selected:'A 1000',mode:'postpone'});
 assert.deepEqual(pass.changed,['B 2000']);assert.deepEqual(post.changed,pass.changed);assert.equal(pass.count,1);assert.equal(post.active.completed.has('A 1000'),false);assert.equal(pass.active.completed.has('A 1000'),true);
 assert.ok(!pass.changed.includes('A 1000'));assert.ok(!pass.changed.includes('C 3000'));assert.ok(pass.otherBlocked.includes('C 3000'));
 const conditional=W.preview(fixture,[],['B 2000'],{selected:'B 2000'});assert.equal(conditional.conditional,true);assert.equal(pass.conditional,false);
});
test('no change and satisfied OR alternatives never imply a lost baseline option',()=>{
 const view=W.preview(fixture,['X 4000'],['B 2000'],{selected:'B 2000',mode:'postpone'});
 assert.equal(view.count,0);assert.ok(view.alternatives.includes('C 3000'));assert.equal(view.active.results['C 3000'].status,'met');
 const protectedView=W.preview(fixture,['B 2000'],['B 2000'],{selected:'B 2000',mode:'postpone'});
 assert.equal(protectedView.protectedSelection,true);assert.equal(protectedView.count,0);assert.ok(protectedView.active.baseline.has('B 2000'));assert.deepEqual(protectedView.withPass.assumed,[]);
});
test('example is chosen from verified supported data and recalculates for actual completions',()=>{
 const code=W.chooseExample(fixture,[]);assert.ok(fixture.courses.some(c=>c.code===code));assert.ok(W.preview(fixture,[],[code]).count>0);
 assert.equal(W.chooseExample(fixture,fixture.courses.map(c=>c.code)),'');
 assert.equal(W.chooseExample({...fixture,courses:fixture.courses.map(c=>({...c,verification:'unverified'}))},[]),'');
});
test('saved presentation validates modes and opens advanced controls for old saved choices',()=>{
 const old={version:1,dataset:fixture.id,a:['A 1000','B 2000'],b:['Y 6000']};
 assert.deepEqual(W.clean(old,fixture).presentation,{a:'pass',b:'pass',multiA:true,multiB:false,compare:true});
 const bad={...old,presentation:{a:'bad',b:'postpone',multiA:'yes',multiB:1,compare:false}};
 assert.equal(W.clean(bad,fixture).presentation.b,'postpone');assert.equal(W.clean(bad,fixture).presentation.multiB,false);
 const changed=W.clean(bad,{...fixture,id:'other'});assert.deepEqual(changed.a,[]);assert.equal(changed.presentation.compare,false);
});
test('explorer separates immediate readiness, directly incomplete requirements, and indirect chains',()=>{
 const a=W.explorer(fixture,[],'A 1000');assert.deepEqual(a.changed,['B 2000']);assert.equal(a.count,1);assert.deepEqual(a.directBlocked,[]);assert.deepEqual(a.longer,['C 3000','D 5000']);assert.equal(a.withPass.completed.has('B 2000'),false);
 const b=W.explorer(fixture,[],'B 2000');assert.deepEqual(b.changed,['C 3000']);assert.deepEqual(b.directBlocked,['D 5000']);assert.equal(b.conditional,true);assert.deepEqual(b.longer,[]);
 const completed=W.explorer(fixture,['B 2000'],'B 2000');assert.equal(completed.count,0);assert.equal(completed.protectedSelection,true);assert.deepEqual(completed.withPass.assumed,[]);assert.ok(completed.connections.includes('C 3000'));
 const orView=W.explorer(fixture,['X 4000'],'B 2000');assert.equal(orView.count,0);assert.ok(orView.alternatives.includes('C 3000'));
 const legacy=W.explorer(d,['MATH 131'],'MATH 1131');assert.ok(!legacy.changed.includes('MATH 1132'));assert.ok(!legacy.changed.includes('MATH 2261'));
});
test('simple storage validates curriculum and selection independently from advanced plans',()=>{
 const record={version:1,dataset:fixture.id,course:'B 2000',a:['A 1000'],email:'private'};
 assert.deepEqual(W.cleanExplorer(record,fixture),{version:1,dataset:fixture.id,course:'B 2000'});
 assert.equal(W.cleanExplorer({...record,version:2},fixture).course,'');assert.equal(W.cleanExplorer({...record,course:'bad'},fixture).course,'');assert.equal(W.cleanExplorer(record,{...fixture,id:'other'}).course,'');
 const map=new Map([[W.storageKey,'saved plan'],['regibot-planning-v1','actual']]),storage={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};
 assert.equal(W.saveExplorer(storage,record,fixture),true);assert.equal(W.readExplorer(storage,fixture).state.course,'B 2000');assert.equal(map.get(W.storageKey),'saved plan');assert.equal(map.get('regibot-planning-v1'),'actual');
 map.set(W.explorerKey,'{broken');assert.equal(W.readExplorer(storage,fixture).state.course,'');assert.equal(W.saveExplorer({setItem(){throw Error();}},record,fixture),false);
});
test('Course Explorer renders one picker and immediate results in TR/EN and theme/width settings',async()=>{
 const fs=require('node:fs'),css=fs.readFileSync(require.resolve('../public/style.css'),'utf8');
 assert.ok(css.includes('@media(max-width:620px){.wf-simple'));assert.ok(css.includes(':root[data-theme="dark"] .wf-met'));assert.ok(css.includes('@media(prefers-reduced-motion:reduce){.wf-simple'));
 for(const lang of ['tr','en'])for(const theme of ['light','dark'])for(const width of [360,1100]){
   const app=mount({lang,theme,width,actual:['MATH 131']});await tick();
   assert.ok(app.html().includes(lang==='tr'?'Bu dersi geçersem hangi derslerin önü açılır?':'What does passing this course unlock?'));
   assert.equal(app.context.WhatIfUI.TEXT[lang].nav,lang==='tr'?'Ders Keşfi':'Course Explorer');assert.equal(app.context.WhatIfUI.TEXT[lang].explore,lang==='tr'?'Bu dersi keşfet':'Explore this course');
   assert.ok(!app.html().includes('undefined'));assert.ok(!app.html().includes('<svg'));assert.ok(!app.html().includes('id="wf-search-a"'));assert.ok(!app.html().includes('id="wf-search-b"'));assert.ok(!app.html().includes('data-wf-mode='));assert.ok(!app.html().includes('data-unlocked-count'));
   assert.ok(app.html().includes('role="combobox"'));assert.ok(app.html().includes('aria-controls="wf-options-x"'));assert.ok(app.html().includes('data-wf-example="x"'));
   assert.ok(app.html().includes(lang==='tr'?'Tamamladığın 0 ders':'Using your 0 completed courses'));assert.ok(app.html().includes(lang==='tr'?'Önceki müfredattan 1':'1 prior-curriculum'));
   const before=app.values.get('regibot-planning-v1');choose(app,'SE 1105');
   assert.equal(JSON.parse(app.values.get(W.explorerKey)).course,'SE 1105');assert.equal(app.values.get(W.storageKey),undefined);assert.equal(app.values.get('regibot-planning-v1'),before);
   const count=W.explorer(d,['MATH 131'],'SE 1105').count;assert.ok(app.html().includes(`data-unlocked-count="${count}"`));assert.ok(!app.html().includes('data-selected-course='));assert.ok(app.html().includes('value="SE 1105 · '));
   click(app,{wfPaths:''});assert.ok(app.html().includes('<svg'));assert.ok(app.html().includes('wf-graph-text'));assert.ok(!app.html().includes('id="wf-result-filter"'));assert.ok(!app.html().includes('wf-relations'));
   app.dispatch('change',{id:'wf-direction',value:'dependents'});assert.ok(app.html().includes(lang==='tr'?'VEYA':'OR'));
   click(app,{wfPaths:''});assert.ok(!app.html().includes('<svg'));click(app,{wfClear:'x'});assert.equal(app.values.get(W.explorerKey),undefined);assert.ok(!app.html().includes('data-unlocked-count'));assert.equal(app.values.get('regibot-planning-v1'),before);
 }
});
test('search and keyboard controls preserve the input, announce results and explain conditional choices',async()=>{
 const app=mount({data:fixture});await tick();assert.ok(app.html().includes('haven’t saved any completed courses'));assert.ok(app.html().includes('href="#/uygunluk"'));
 let pointerPrevented=false;app.dispatch('pointerdown',{dataset:{wfChoose:'B 2000',wfPlan:'x'}},{preventDefault(){pointerPrevented=true;}});assert.equal(pointerPrevented,true);
 const initial=app.html(),input={id:'wf-search-x',dataset:{wfSearch:'x'},value:'B 2000'};
 app.dispatch('input',input);assert.equal(app.html(),initial);assert.ok(app.node('wf-options-x').innerHTML.includes('B 2000'));assert.ok(!app.node('wf-options-x').innerHTML.includes('C 3000'));
 app.dispatch('keydown',input,{key:'ArrowDown'});assert.ok(app.node('wf-search-x').attributes['aria-activedescendant']);app.dispatch('keydown',input,{key:'Escape'});assert.equal(app.node('wf-search-x').attributes['aria-expanded'],'false');
 app.node('main-area').scrollTop=123;app.dispatch('keydown',input,{key:'ArrowDown'});app.dispatch('keydown',input,{key:'Enter'});assert.equal(app.node('main-area').scrollTop,123);assert.equal(JSON.parse(app.values.get(W.explorerKey)).course,'B 2000');
 assert.ok(app.html().includes('You would first need to satisfy'));assert.ok(app.html().includes('data-wf-details="direct"'));assert.ok(app.html().includes('This pass satisfies the B 2000 condition. Still needs'));assert.ok(app.html().includes('Y 6000'));
 assert.ok(app.html().includes('data-wf-details="selected-x"'));assert.ok(app.html().includes('rel="noopener noreferrer"'));assert.ok(app.html().includes('aria-live="polite"'));assert.ok(!app.html().includes('wfs-selected-heading'));
 click(app,{wfClear:'x'});click(app,{wfExample:'x'});assert.equal(JSON.parse(app.values.get(W.explorerKey)).course,W.chooseExample(fixture,[]));
 app.dispatch('focusin',input);assert.equal(app.node('wf-search-x').attributes['aria-expanded'],'true');app.dispatch('focusout',input);assert.equal(app.node('wf-search-x').attributes['aria-expanded'],'false');
});
test('direct remaining requirements and longer-term connections render in separate collapsed sections',async()=>{
 const app=mount({data:fixture});await tick();choose(app,'A 1000');assert.ok(app.html().includes('data-unlocked-count="1"'));assert.ok(!app.html().includes('data-wf-details="direct"'));assert.ok(app.html().includes('data-wf-details="longer"'));assert.ok(app.html().includes('Intermediate courses must also be passed'));assert.ok(!app.html().includes('data-wf-details="longer" open'));
 const other=mount({data:fixture,actual:['X 4000']});await tick();choose(other,'B 2000');assert.ok(other.html().includes('data-unlocked-count="0"'));assert.ok(other.html().includes('may still contribute'));assert.ok(other.html().includes('A published alternative you already completed keeps C 3000 ready'));assert.ok(other.html().includes('data-wf-details="direct"'));assert.ok(other.html().includes('Y 6000'));
});
test('saved plans remain closed and byte-for-byte untouched while exploring or clearing a course',async()=>{
 const record={version:1,dataset:d.id,a:['SE 1105','COMP 2215'],b:['COMP 2233'],target:'COMP 4910',presentation:{a:'pass',b:'postpone',multiA:true,multiB:false,compare:true}};
 const app=mount({storedScenario:record});await tick();const before=app.values.get(W.storageKey),actual=app.values.get('regibot-planning-v1');
 assert.ok(app.html().includes('Saved comparison available'));assert.ok(!app.html().includes('data-selected-course='));assert.ok(!app.html().includes('id="wf-search-b"'));assert.deepEqual(saved(app),record);
 click(app,{whatIfCode:'COMP 3323'});assert.equal(JSON.parse(app.values.get(W.explorerKey)).course,'COMP 3323');assert.equal(app.values.get(W.storageKey),before);assert.ok(app.html().includes('value="COMP 3323 · '));
 click(app,{wfClear:'x'});assert.equal(app.values.get(W.storageKey),before);assert.equal(app.values.get('regibot-planning-v1'),actual);
 click(app,{wfAdvanced:''});assert.ok(app.html().includes('data-selected-course="SE 1105"'));assert.ok(app.html().includes('data-selected-course="COMP 2215"'));assert.ok(app.html().includes('id="wf-search-b"'));assert.match(app.html(),/id="wf-mode-b-postpone"[^>]*aria-pressed="true"/);assert.equal(app.values.get(W.storageKey),before);
 choose(app,'SE 1105');const simple=app.values.get(W.explorerKey);click(app,{wfReset:''});assert.equal(app.values.get(W.storageKey),undefined);assert.equal(app.values.get(W.explorerKey),simple);assert.equal(app.values.get('regibot-planning-v1'),actual);
});
test('advanced choices retain sequencing, A/B comparison and individual postponement',async()=>{
 const app=mount();await tick();choose(app,'MATH 1131');const simple=app.values.get(W.explorerKey),actual=app.values.get('regibot-planning-v1');click(app,{wfAdvanced:''});
 choose(app,'SE 1105','a');click(app,{wfAdd:'a'});choose(app,'COMP 2215','a');assert.deepEqual(saved(app).a,['SE 1105','COMP 2215']);assert.ok(app.html().includes('Pass SE 1105 first'));
 click(app,{wfCompare:''});choose(app,'SE 1105','b');assert.deepEqual(saved(app).b,['SE 1105']);click(app,{wfPostpone:'COMP 2215',wfPlan:'a'});assert.deepEqual(saved(app).a,['SE 1105']);assert.deepEqual(saved(app).b,['SE 1105']);
 assert.equal(app.values.get(W.explorerKey),simple);assert.equal(app.values.get('regibot-planning-v1'),actual);click(app,{wfAdvanced:''});assert.ok(!app.html().includes('id="wf-search-a"'));assert.ok(app.html().includes('Saved comparison available'));
});
test('completed courses are protected, but eligibility links allow inspecting existing connections',async()=>{
 const app=mount({actual:['SE 1105']});await tick();const before=app.values.get('regibot-planning-v1');assert.match(app.html(),/data-wf-choose="SE 1105"[^>]*disabled/);choose(app,'SE 1105');assert.equal(app.values.get(W.explorerKey),undefined);
 click(app,{whatIfCode:'SE 1105'});assert.ok(app.html().includes('already completed'));assert.ok(app.html().includes('data-unlocked-count="0"'));assert.ok(app.html().includes('Published course connections'));assert.equal(app.values.get(W.storageKey),undefined);assert.equal(app.values.get('regibot-planning-v1'),before);
 choose(app,'COMP 2215');app.storage.setItem('regibot-planning-v1',JSON.stringify({version:1,dataset:d.id,completed:['SE 1105','COMP 2215'],steps:['curriculum']}));app.storageEvent('regibot-planning-v1');assert.ok(app.html().includes('already completed'));assert.ok(app.html().includes('data-unlocked-count="0"'));
 click(app,{wfPaths:''});assert.ok(app.html().includes('<svg'));const changed=app.values.get('regibot-planning-v1');click(app,{wfClear:'x'});assert.equal(app.values.get('regibot-planning-v1'),changed);
});
test('simple selection restores independently and rejects mismatched curricula and malformed storage',async()=>{
 const record={version:1,dataset:d.id,course:'SE 1105'},app=mount({storedExplorer:record});await tick();assert.ok(app.html().includes('value="SE 1105 · '));assert.ok(app.html().includes('data-unlocked-count='));assert.equal(app.values.get(W.storageKey),undefined);
 app.storage.setItem(W.explorerKey,'{broken');app.storageEvent(W.explorerKey);assert.ok(app.html().includes('data-wf-example="x"'));assert.ok(!app.html().includes('data-unlocked-count='));
 const mismatch=mount({storedExplorer:{...record,dataset:'other'},storedScenario:{version:1,dataset:'other',a:['SE 1105'],b:[]}});await tick();assert.ok(!mismatch.html().includes('data-unlocked-count='));assert.ok(!mismatch.html().includes('Saved comparison available'));
});
test('unavailable storage and missing data have useful fallbacks without modifying real records',async()=>{
 const empty=mount({data:null});await tick();assert.ok(empty.html().includes('validated curriculum is unavailable'));assert.ok(!empty.html().includes('undefined'));
 const denied=mount({storageUnavailable:true});await tick();assert.ok(/Browser storage is unavailable|Tarayıcı depolaması kullanılamıyor/.test(denied.html()));choose(denied,'SE 1105');assert.ok(denied.html().includes('value="SE 1105 · '));assert.ok(!denied.html().includes('undefined'));
});
test('unknown/cyclic rules stay explicit; global reset clears hypotheticals as well as actual planning',async()=>{
 const unknown={...fixture,courses:[{...course('A 1000'),verification:'unverified'}]},missing=mount({data:unknown});await tick();choose(missing,'A 1000');assert.ok(missing.html().includes('requirements can’t be verified'));assert.ok(missing.html().includes('data-unlocked-count="0"'));
 const cycle={...fixture,courses:[course('A 1000',leaf('B 2000')),course('B 2000',leaf('A 1000'))]},circular=mount({data:cycle,storedScenario:{version:1,dataset:cycle.id,a:['A 1000','B 2000'],b:[],target:'A 1000'}});await tick();assert.ok(circular.html().includes('Possible cycle in published dependencies'));assert.ok(!circular.html().includes('A valid order for these choices'));click(circular,{wfAdvanced:''});assert.ok(circular.html().includes('A valid order for these choices'));choose(circular,'A 1000');click(circular,{wfPaths:''});assert.ok(circular.html().includes('<svg'));
 const app=mount({actual:['MATH 131']});await tick();choose(app,'SE 1105');click(app,{wfAdvanced:''});choose(app,'COMP 2215','a');click(app,{resetPlanning:''});assert.equal(app.values.get(W.storageKey),undefined);assert.equal(app.values.get(W.explorerKey),undefined);assert.equal(app.values.get('regibot-planning-v1'),undefined);
});

test('assistant chip never submits an incomplete question, and course selections require explicit sharing choice',async()=>{
 const A=require('../public/course-analysis');
 const reply=body=>{const context=A.validateContext(body.planning,[d]),resolved=A.resolve(body.message,d,body.history,body.courseChoice),analysis=A.build(context,resolved);return {answer:A.fallback(analysis,'en'),analysis};};
 const app=mount({route:'/asistan',actual:['MATH 131'],chatFetch:reply});await tick();const actual=app.values.get('regibot-planning-v1');
 click(app,{impactStart:''});assert.equal(app.chatRequests.length,0);assert.ok(app.html().includes('Only the selected curriculum and course codes will be sent'));assert.ok(app.html().includes('data-impact-consent="saved"'));
 click(app,{impactConsent:'none'});await tick();assert.equal(app.chatRequests.length,0); // The chip requires a course before submitting.
 app.node('impact-course-choice').value='SE 1105';click(app,{impactConsent:'none'});await tick();assert.equal(app.chatRequests.length,1);assert.deepEqual(app.chatRequests[0].planning,{dataset:d.id,sharing:'none'});assert.equal(app.chatRequests[0].courseChoice,'SE 1105');assert.ok(app.node('chat-log').innerHTML.includes('General comparison: no completed courses supplied'));assert.equal(app.values.get('regibot-planning-v1'),actual);
 click(app,{askCourse:'MATH 1131'});assert.equal(app.chatRequests.length,1);app.node('impact-course-choice').value='MATH 1131';click(app,{impactConsent:'saved'});await tick();assert.equal(app.chatRequests.length,2);assert.deepEqual(app.chatRequests[1].planning.completed,['MATH 131']);assert.equal(app.values.get('regibot-planning-v1'),actual);assert.ok(app.node('chat-log').innerHTML.includes('data-impact-card="1"'));assert.ok(app.node('chat-log').innerHTML.includes('data-impact-card="2"'));
 app.dispatch('toggle',{dataset:{impactMap:'1'},open:true});assert.ok(app.node('impact-map-body-1').innerHTML.includes('impact-1-arrow'));assert.equal(app.node('impact-map-body-2').innerHTML,'');
 click(app,{impactView:'incomplete',impactId:'1'});assert.ok(!app.node('impact-map-body-1').innerHTML.includes('wf-node wf-assumed'));
 app.dispatch('toggle',{dataset:{impactMap:'2'},open:true});assert.ok(app.node('impact-map-body-2').innerHTML.includes('impact-2-arrow'));assert.ok(app.node('impact-map-body-1').innerHTML.includes('impact-1-arrow'));
 app.storage.setItem('regibot-planning-v1',JSON.stringify({version:1,dataset:d.id,completed:['MATH 131','SE 1105'],steps:['curriculum']}));app.storageEvent('regibot-planning-v1');assert.ok(app.node('chat-log').innerHTML.includes('Your planning selections have changed'));assert.equal(app.chatRequests.length,2);
 click(app,{impactRecalculate:'1'});assert.equal(app.chatRequests.length,2);assert.ok(app.html().includes('data-impact-consent="saved"'));click(app,{impactCancel:''});assert.equal(app.chatRequests.length,2);
});
test('typed prerequisite questions pause for consent; unrelated failures use normal chat without planning data',async()=>{
 const app=mount({route:'/asistan',actual:['SE 1105']});await tick();app.node('chat-input').value='What happens if I fail SE 1105?';app.node('chat-form').listeners.submit({preventDefault(){}});assert.equal(app.chatRequests.length,0);assert.ok(app.html().includes('data-impact-consent="saved"'));
 click(app,{impactCancel:''});app.node('chat-input').value='My payment failed';app.node('chat-form').listeners.submit({preventDefault(){}});await tick();assert.equal(app.chatRequests.length,1);assert.equal(app.chatRequests[0].planning,undefined);assert.equal(app.chatRequests[0].message,'My payment failed');
});

test('chat impact prompts and maps render in both languages, themes and narrow/wide settings',async()=>{
 const A=require('../public/course-analysis');
 for(const lang of ['en','tr'])for(const theme of ['light','dark'])for(const width of [360,1100]){
 const app=mount({route:'/asistan',lang,theme,width,chatFetch:body=>{const a=A.build(A.validateContext(body.planning,[d]),A.resolve(body.message,d,body.history,body.courseChoice));return {answer:A.fallback(a,body.lang),analysis:a};}});await tick();
 click(app,{impactStart:''});assert.ok(app.html().includes(app.context.CourseImpactUI.TEXT[lang].privacy));app.node('impact-course-choice').value='SE 1105';click(app,{impactConsent:'none'});await tick();assert.ok(app.node('chat-log').innerHTML.includes(app.context.CourseImpactUI.TEXT[lang].generalLabel));assert.ok(!app.node('chat-log').innerHTML.includes('undefined'));
 app.dispatch('toggle',{dataset:{impactMap:'1'},open:true});assert.ok(app.node('impact-map-body-1').innerHTML.includes(lang==='tr'?'Metin karşılığı':'Text equivalent'));assert.ok(app.node('impact-map-body-1').innerHTML.includes('impact-1-arrow'));
 }
});
test('completed conflict requires a separate explicit override and never rewrites actual progress',async()=>{
 const A=require('../public/course-analysis');
 const app=mount({route:'/asistan',actual:['SE 1105'],chatFetch:body=>{const c=A.validateContext(body.planning,[d]),r=A.resolve(body.message,d,body.history,body.courseChoice);if(c.supplied.includes(r.course)&&c.override!==r.course)return {answer:A.clarification('completed','en'),coursePrompt:{kind:'completed',course:r.course,candidates:[]}};const a=A.build(c,r);return {answer:A.fallback(a,'en'),analysis:a};}});await tick();const actual=app.values.get('regibot-planning-v1');
 click(app,{askCourse:'SE 1105'});app.node('impact-course-choice').value='SE 1105';click(app,{impactConsent:'saved'});await tick();assert.ok(app.node('chat-log').innerHTML.includes('data-impact-override="1"'));assert.ok(!app.node('chat-log').innerHTML.includes('data-impact-card="1"'));assert.equal(app.chatRequests[0].planning.hypotheticalIncomplete,undefined);
 click(app,{impactOverride:'1'});await tick();assert.equal(app.chatRequests[1].planning.hypotheticalIncomplete,'SE 1105');assert.ok(app.node('chat-log').innerHTML.includes('data-impact-card="2"'));assert.ok(app.node('chat-log').innerHTML.includes('Hypothetical override'));assert.equal(app.values.get('regibot-planning-v1'),actual);
});
