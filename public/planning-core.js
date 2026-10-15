/* Shared deterministic planning logic. No model calls or browser dependencies. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.Planning=factory();})(typeof globalThis!=='undefined'?globalThis:this,()=>{
  'use strict';
  const destinations={eligibility:'/uygunluk',checklist:'/kontrol-listesi',load:'/rehber/ders-yuku',calendar:'/takvim',contact:'/iletisim'};
  const steps=['curriculum','select','conflicts','load','submit','approval'];
  const date=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
  function validEvent(e){return !!e&&date(e.start)&&date(e.end)&&e.start<=e.end&&typeof e.event==='string'&&typeof e.event_en==='string'&&e.event.length<500&&e.event_en.length<500;}
  function eventId(e){return e.start+'_'+e.event_en.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');}
  function eventState(e,today){return !validEvent(e)||!date(today)?'unknown':today<e.start?'upcoming':today>e.end?'past':'ongoing';}
  function ruleValid(r,codes,depth=0){
    if(!r||depth>12)return false;
    if(r.op==='course')return typeof r.code==='string'&&codes.has(r.code);
    return ['and','or'].includes(r.op)&&Array.isArray(r.items)&&r.items.length>0&&r.items.length<100&&r.items.every(x=>ruleValid(x,codes,depth+1));
  }
  function evaluate(r,completed){
    if(r.op==='course')return {met:completed.has(r.code),missing:completed.has(r.code)?[]:[r.code]};
    const results=r.items.map(x=>evaluate(x,completed));
    const met=r.op==='and'?results.every(x=>x.met):results.some(x=>x.met);
    return {met,missing:met?[]:[...new Set(results.flatMap(x=>x.missing))]};
  }
  function check(course,completed,codes){
    if(completed.has(course.code))return {status:'completed',missing:[]};
    if(course.verification!=='verified'||!['prerequisites','corequisites'].every(k=>course[k]===null||ruleValid(course[k],codes)))return {status:'unknown',missing:[]};
    const pre=course.prerequisites?evaluate(course.prerequisites,completed):{met:true,missing:[]};
    // Concurrent selections are deliberately not collected: a corequisite is satisfied here only if completed.
    const co=course.corequisites?evaluate(course.corequisites,completed):{met:true,missing:[]};
    return {status:pre.met&&co.met?'met':'missing',missing:pre.missing,corequisites:co.missing};
  }
  function officialCourseUrl(value){
    try { const u=new URL(value);return u.protocol==='https:'&&!u.port&&!u.username&&!u.password&&(u.hostname==='ce.yasar.edu.tr'||u.hostname==='ects.yasar.edu.tr'||u.hostname==='obs.yasar.edu.tr'&&u.pathname.startsWith('/oibs/bologna/')); } catch { return false; }
  }
  function pendingFirst(items,completed,key){
    return items.filter(x=>!completed.has(key(x))).concat(items.filter(x=>completed.has(key(x))));
  }
  function courseCodes(d){return new Set([...(d?.courses||[]),...(d?.priorCourses||[])].map(c=>c?.code));}
  function validDataset(d){
    if(!d||typeof d.id!=='string'||!d.program||typeof d.program.tr!=='string'||typeof d.program.en!=='string'||typeof d.version!=='string'||!Array.isArray(d.courses)||!d.courses.length)return false;
    const currentCodes=new Set(d.courses.map(c=>c?.code));
    if(d.priorCourses!==undefined&&(!Array.isArray(d.priorCourses)||d.priorCourses.length>100||!d.priorCourses.every(c=>c&&typeof c.code==='string'&&/^[A-Z]+ \d{3,4}$/.test(c.code)&&!currentCodes.has(c.code)&&officialCourseUrl(c.source))))return false;
    const priorCodes=new Set((d.priorCourses||[]).map(c=>c.code));
    if(priorCodes.size!==(d.priorCourses||[]).length)return false;
    const codes=courseCodes(d);
    return currentCodes.size===d.courses.length&&d.courses.every(c=>c&&typeof c==='object'&&typeof c.code==='string'&&/^[A-Z]+ \d{4}$/.test(c.code)&&typeof c.source==='string'&&officialCourseUrl(c.source)&&(c.ects===null||Number.isFinite(c.ects)&&c.ects>0)&&(c.title===null||c.title&&typeof c.title.tr==='string'&&typeof c.title.en==='string')&&(c.semester===undefined||Number.isInteger(c.semester)&&c.semester>=1&&c.semester<=8)&&['requirementsText','requirementsTextTr'].every(k=>c[k]===undefined||c[k]===null||typeof c[k]==='string'&&c[k].length<=1200)&&['verified','unverified'].includes(c.verification)&&(c.verification!=='verified'||['prerequisites','corequisites'].every(k=>c[k]===null||ruleValid(c[k],codes))));
  }
  function cleanState(value,datasets){
    const d=datasets.find(d=>d.id===value?.dataset)||datasets[0];
    const codes=courseCodes(d);
    return {version:1,dataset:d?.id||'',completed:Array.isArray(value?.completed)?[...new Set(value.completed.filter(c=>codes.has(c)))]:[],steps:Array.isArray(value?.steps)?[...new Set(value.steps.filter(x=>steps.includes(x)))]:[]};
  }
  const storageKey='regibot-planning-v1';
  function read(storage,datasets){try{return cleanState(JSON.parse(storage.getItem(storageKey)),datasets);}catch{return cleanState(null,datasets);}}
  function save(storage,state,datasets){try{storage.setItem(storageKey,JSON.stringify(cleanState(state,datasets)));return true;}catch{return false;}}
  function reset(storage){try{storage.removeItem(storageKey);return true;}catch{return false;}}
  function actionValid(a,events=[]){
    if(!a||typeof a!=='object'||Array.isArray(a))return false;
    const keys=Object.keys(a).sort().join(',');
    if(a.type==='navigate')return keys==='destination,type'&&Object.hasOwn(destinations,a.destination);
    if(a.type==='calendar')return keys==='eventId,type'&&events.some(e=>validEvent(e)&&eventId(e)===a.eventId);
    return a.type==='email'&&keys==='topic,type'&&['quota','advisor'].includes(a.topic);
  }
  function ics(e,lang='en',stamp=new Date()){
    if(!validEvent(e))throw new Error('Invalid calendar event');
    const end=new Date(e.end+'T00:00:00Z');end.setUTCDate(end.getUTCDate()+1);
    const compact=s=>s.replace(/-/g,'');
    const escape=s=>s.replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
    const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//RegiBot//Planning//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:'+eventId(e)+'@regibot.local','DTSTAMP:'+stamp.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''),'DTSTART;VALUE=DATE:'+compact(e.start),'DTEND;VALUE=DATE:'+compact(end.toISOString().slice(0,10)),'SUMMARY:'+escape(lang==='tr'?e.event:e.event_en),'END:VEVENT','END:VCALENDAR'];
    // RFC 5545 line folding at 75 UTF-8 octets, including continuation spaces.
    return lines.map(line=>{let result='',part='',bytes=0;for(const ch of line){const n=new TextEncoder().encode(ch).length;if(bytes+n>75){result+=part+'\r\n';part=' ';bytes=1;}part+=ch;bytes+=n;}return result+part;}).join('\r\n')+'\r\n';
  }
  return {courseCodes,officialCourseUrl,pendingFirst,destinations,steps,date,validEvent,eventId,eventState,ruleValid,evaluate,check,validDataset,cleanState,read,save,reset,actionValid,ics};
});
