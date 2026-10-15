/* Hypothetical planning: shared with Node tests, never calls a model or writes actual progress. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./planning-core'));else root.WhatIf=factory(root.Planning);})(typeof globalThis!=='undefined'?globalThis:this,P=>{
  'use strict';
  const storageKey='regibot-what-if-v1';
  const unique=a=>[...new Set(a)];
  function clean(value,d){
    const codes=new Set((d?.courses||[]).map(c=>c.code));
    const same=value?.version===1&&value.dataset===d?.id;
    const list=k=>same&&Array.isArray(value[k])?unique(value[k].filter(code=>codes.has(code))):[];
    const a=list('a'),b=list('b'),ui=same?value.presentation:null;
    return {version:1,dataset:d?.id||'',a,b,target:same&&codes.has(value.target)?value.target:'',presentation:{
      a:ui?.a==='postpone'?'postpone':'pass',b:ui?.b==='postpone'?'postpone':'pass',
      multiA:a.length>1||ui?.multiA===true,multiB:b.length>1||ui?.multiB===true,compare:b.length>0||ui?.compare===true
    }};
  }
  function read(storage,d){try{return {state:clean(JSON.parse(storage.getItem(storageKey)),d),unavailable:false};}catch{return {state:clean(null,d),unavailable:true};}}
  function save(storage,state,d){try{storage.setItem(storageKey,JSON.stringify(clean(state,d)));return true;}catch{return false;}}
  function reset(storage){try{storage.removeItem(storageKey);return true;}catch{return false;}}
  function ruleRefs(r){if(!r)return [];if(r.op==='course')return [r.code];return unique(r.items.flatMap(ruleRefs));}
  function graph(d){
    const codes=P.courseCodes(d),byCode=new Map((d?.courses||[]).map(c=>[c.code,c])),edges=[],unknown=[];
    for(const c of byCode.values()){
      if(c.verification!=='verified'||!['prerequisites','corequisites'].every(k=>c[k]===null||P.ruleValid(c[k],codes))){unknown.push(c.code);continue;}
      for(const [field,kind] of [['prerequisites','pre'],['corequisites','co']])for(const from of ruleRefs(c[field]))edges.push({from,to:c.code,kind});
    }
    const outgoing=new Map([...codes].map(c=>[c,[]]));for(const edge of edges)outgoing.get(edge.from)?.push(edge);
    // Iterative path traversal: detects structural cycles, including optional OR paths, without recursion.
    const visited=new Set(),cycles=[];
    for(const code of codes){
      if(visited.has(code))continue;
      const stack=[{code,index:0}],path=new Map([[code,0]]);visited.add(code);
      while(stack.length){
        const frame=stack.at(-1),next=outgoing.get(frame.code)||[];
        if(frame.index>=next.length){path.delete(frame.code);stack.pop();continue;}
        const to=next[frame.index++].to;
        if(path.has(to)){cycles.push([...stack.slice(path.get(to)).map(x=>x.code),to]);continue;}
        if(!visited.has(to)){visited.add(to);path.set(to,stack.length);stack.push({code:to,index:0});}
      }
    }
    return {codes,byCode,edges,outgoing,unknown,cycles};
  }
  function relationships(g,code){
    const direct=unique((g.outgoing.get(code)||[]).map(e=>e.to)),seen=new Set([code]),queue=[code];
    for(let i=0;i<queue.length;i++)for(const edge of g.outgoing.get(queue[i])||[])if(!seen.has(edge.to)){seen.add(edge.to);queue.push(edge.to);}
    return {direct,indirect:queue.slice(1).filter(c=>!direct.includes(c))};
  }
  function subgraph(g,code,direction='requirements',limit=12){
    if(!g.codes.has(code))return {nodes:[],edges:[],truncated:false};
    const seen=new Set([code]),queue=[code];
    for(let i=0;i<queue.length;i++){
      const adjacent=direction==='dependents'?(g.outgoing.get(queue[i])||[]):g.edges.filter(e=>e.to===queue[i]);
      for(const e of adjacent){const other=direction==='dependents'?e.to:e.from;if(!seen.has(other)){seen.add(other);queue.push(other);}}
    }
    const nodes=queue.slice(0,limit),allowed=new Set(nodes);
    return {nodes,edges:g.edges.filter(e=>allowed.has(e.from)&&allowed.has(e.to)),truncated:queue.length>limit,total:queue.length};
  }
  function tree(r,done){
    if(!r)return {op:'and',items:[],met:true};
    if(r.op==='course')return {op:r.op,code:r.code,met:done.has(r.code)};
    const items=r.items.map(x=>tree(x,done));return {op:r.op,items,met:r.op==='and'?items.every(x=>x.met):items.some(x=>x.met)};
  }
  // A minimal satisfied proof prefers a baseline OR branch over a hypothetical branch.
  function proof(r,done,baseline){
    if(!r)return [];
    if(r.op==='course')return done.has(r.code)?[r.code]:null;
    const parts=r.items.map(x=>proof(x,done,baseline));
    if(r.op==='and')return parts.some(x=>x===null)?null:unique(parts.flat());
    return parts.filter(x=>x!==null).sort((a,b)=>a.filter(c=>!baseline.has(c)).length-b.filter(c=>!baseline.has(c)).length)[0]??null;
  }
  function evaluateCourse(c,done,g){return P.check(c,done,g.codes);}
  function scenario(d,baselineValues=[],passes=[],g=graph(d)){
    const baseline=new Set((Array.isArray(baselineValues)?baselineValues:[...baselineValues]).filter(c=>g.codes.has(c)));
    const assumed=unique((Array.isArray(passes)?passes:[]).filter(c=>g.byCode.has(c)&&!baseline.has(c)));
    const completed=new Set([...baseline,...assumed]),baselineResults={},results={},groups={newlyReady:[],unchangedReady:[],blocked:[],unknown:[],assumed:[...assumed],completed:[]};
    for(const c of g.byCode.values()){
      const base=evaluateCourse(c,baseline,g),result=evaluateCourse(c,completed,g);
      baselineResults[c.code]=base;results[c.code]=result;
      if(baseline.has(c.code))groups.completed.push(c.code);
      else if(assumed.includes(c.code))continue;
      else if(result.status==='met')groups[base.status==='met'?'unchangedReady':'newlyReady'].push(c.code);
      else if(result.status==='missing')groups.blocked.push(c.code);
      else groups.unknown.push(c.code);
    }
    // Only explicit assumptions may be added here. Newly ready, unselected courses never propagate.
    const available=new Set(baseline),pending=new Set(assumed),levels=new Map(),issues=[];let round=0;
    while(pending.size){
      const ready=[...pending].filter(code=>evaluateCourse(g.byCode.get(code),available,g).status==='met');
      if(!ready.length)break;
      for(const code of ready){pending.delete(code);levels.set(code,round);available.add(code);}round++;
    }
    for(const code of assumed){
      const c=g.byCode.get(code),others=new Set(completed);others.delete(code);
      const check=evaluateCourse(c,others,g),base=baselineResults[code];
      const valid=c.verification==='verified'&&['prerequisites','corequisites'].every(k=>c[k]===null||P.ruleValid(c[k],g.codes));
      const support=valid?unique([...(proof(c.prerequisites,others,baseline)||[]),...(proof(c.corequisites,others,baseline)||[])]).filter(x=>!baseline.has(x)):[];
      if(pending.has(code))issues.push({code,kind:check.status==='unknown'?'unknown':check.status==='missing'?'unmet':'order',check,support});
      else if(base.status!=='met')issues.push({code,kind:'sequence',check,support,level:levels.get(code)});
    }
    return {baseline,assumed,completed,baselineResults,results,groups,issues,feasible:pending.size===0};
  }
  function compare(d,baseline,a,b){const g=graph(d),A=scenario(d,baseline,a,g),B=scenario(d,baseline,b,g);return {graph:g,a:A,b:B,onlyA:[...g.byCode.keys()].filter(c=>A.results[c].status==='met'&&B.results[c].status!=='met'&&!B.assumed.includes(c)),onlyB:[...g.byCode.keys()].filter(c=>B.results[c].status==='met'&&A.results[c].status!=='met'&&!A.assumed.includes(c))};}
  function alternativeSatisfied(r,removed,done){
    if(!r||r.op==='course')return false;
    return r.op==='or'&&ruleRefs(r).includes(removed)&&P.evaluate(r,done).met||r.items.some(x=>alternativeSatisfied(x,removed,done));
  }
  function postpone(d,baseline,passes,code){
    const before=scenario(d,baseline,passes),protectedBaseline=before.baseline.has(code);
    const next=protectedBaseline?[...before.assumed]:before.assumed.filter(c=>c!==code),after=scenario(d,baseline,next);
    const lost=Object.keys(before.results).filter(c=>before.results[c].status==='met'&&after.results[c].status!=='met');
    const alternatives=Object.keys(after.results).filter(key=>{
      const c=after.results[key],course=graphCourse(d,key);
      return c.status==='met'&&course?.verification==='verified'&&[course.prerequisites,course.corequisites].some(r=>r&&P.ruleValid(r,P.courseCodes(d))&&alternativeSatisfied(r,code,after.completed));
    });
    return {code,protectedBaseline,next,lost,alternatives,before,after};
  }
  function graphCourse(d,code){return d.courses.find(c=>c.code===code);}
  function explanation(c,plan,g){
    const base=plan.baselineResults[c.code],result=plan.results[c.code];
    const valid=c.verification==='verified'&&['prerequisites','corequisites'].every(k=>c[k]===null||P.ruleValid(c[k],g.codes));
    const witnesses=valid?unique([...(proof(c.prerequisites,plan.completed,plan.baseline)||[]),...(proof(c.corequisites,plan.completed,plan.baseline)||[]) ]):[];
    return {kind:plan.baseline.has(c.code)?'completed':plan.assumed.includes(c.code)?'assumed':result.status==='unknown'?'unknown':result.status==='missing'?'blocked':base.status==='met'?'unchanged':'new',support:witnesses.filter(x=>!plan.baseline.has(x)),prerequisites:valid?tree(c.prerequisites,plan.completed):null,corequisites:valid?tree(c.corequisites,plan.completed):null};
  }
  // Presentation only: pass and postpone compare identical states; no actual completion is removed.
  function preview(d,baseline,passes,{mode='pass',multi=false,selected=''}={}){
    const g=graph(d),withPass=scenario(d,baseline,passes,g),withoutPass=scenario(d,baseline,[],g);
    const excluded=new Set(withPass.assumed),protectedSelection=withPass.baseline.has(selected);
    const changed=d.courses.filter(c=>!excluded.has(c.code)&&withPass.results[c.code].status==='met'&&withoutPass.results[c.code].status!=='met').map(c=>c.code);
    const related=new Set();for(const code of withPass.assumed){const r=relationships(g,code);for(const c of [...r.direct,...r.indirect])related.add(c);}
    const otherBlocked=d.courses.filter(c=>related.has(c.code)&&!excluded.has(c.code)&&!withPass.baseline.has(c.code)&&withPass.results[c.code].status==='missing').map(c=>c.code);
    const alternatives=d.courses.filter(c=>related.has(c.code)&&withoutPass.results[c.code].status==='met'&&['prerequisites','corequisites'].some(k=>c[k]&&P.ruleValid(c[k],g.codes)&&withPass.assumed.some(code=>alternativeSatisfied(c[k],code,withoutPass.completed)))).map(c=>c.code);
    return {graph:g,withPass,withoutPass,active:mode==='postpone'&&!multi?withoutPass:withPass,changed,count:changed.length,otherBlocked,alternatives,protectedSelection,conditional:!protectedSelection&&withPass.issues.some(x=>x.code===selected),multi,mode};
  }
  function chooseExample(d,baseline){
    const g=graph(d),done=new Set(baseline);
    return d.courses.filter(c=>!done.has(c.code)&&!g.unknown.includes(c.code)).map((c,index)=>{
      const view=preview(d,baseline,[c.code],{selected:c.code}),r=relationships(g,c.code);
      return {code:c.code,count:view.count,ready:view.withoutPass.results[c.code].status==='met',related:r.direct.length,index};
    }).sort((a,b)=>Number(b.count>0)-Number(a.count>0)||Number(b.ready)-Number(a.ready)||b.count-a.count||b.related-a.related||a.index-b.index)[0]?.code||'';
  }
  const explorerKey='regibot-course-explorer-v1';
  function cleanExplorer(value,d){return {version:1,dataset:d?.id||'',course:value?.version===1&&value.dataset===d?.id&&d?.courses.some(c=>c.code===value.course)?value.course:''};}
  function readExplorer(storage,d){try{return {state:cleanExplorer(JSON.parse(storage.getItem(explorerKey)),d),unavailable:false};}catch{return {state:cleanExplorer(null,d),unavailable:true};}}
  function saveExplorer(storage,state,d){try{storage.setItem(explorerKey,JSON.stringify(cleanExplorer(state,d)));return true;}catch{return false;}}
  function explorer(d,baseline,code){
    const v=preview(d,baseline,[code],{selected:code}),r=relationships(v.graph,code);
    // Only actual missing → met transitions count, never structural descendants.
    const changed=v.changed.filter(c=>v.withoutPass.results[c].status==='missing');
    const directBlocked=r.direct.filter(c=>!v.withPass.baseline.has(c)&&c!==code&&v.withPass.results[c]?.status==='missing');
    const longer=r.indirect.filter(c=>!v.withPass.baseline.has(c)&&c!==code&&!changed.includes(c)&&v.withPass.results[c]?.status!=='met');
    return {...v,changed,count:changed.length,directBlocked,longer,connections:r.direct.filter(c=>c!==code)};
  }
  return {explorer,explorerKey,cleanExplorer,readExplorer,saveExplorer,preview,chooseExample,storageKey,clean,read,save,reset,ruleRefs,graph,relationships,subgraph,tree,proof,scenario,compare,postpone,explanation};
});
