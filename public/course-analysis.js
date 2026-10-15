/* Shared request resolution and immutable, deterministic chat analysis. No model extraction. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./planning-core'),require('./what-if-core'));else root.CourseAnalysis=factory(root.Planning,root.WhatIf);})(typeof globalThis!=='undefined'?globalThis:this,(P,W)=>{
  'use strict';
  const fold=s=>String(s||'').toLocaleLowerCase('tr').normalize('NFD').replace(/\p{M}/gu,'').replace(/ı/g,'i');
  const codes=s=>[...new Set([...String(s||'').toUpperCase().matchAll(/\b([A-Z]{2,6})\s*[- ]?\s*(\d{3,4})\b/g)].map(m=>m[1]+' '+m[2]))];
  function isRequest(text,d){
    const s=fold(text);
    if(!codes(text).length&&!/prereq|on\s*(?:kosul|sart)|unlock/.test(s)&&/login|payment|registration|upload|password|odeme|kayit|sifre|oturum/.test(s)&&!(d&&nameMatches(text,d).length))return false;
    const course=/\b(course|courses|ders|dersi|dersten|dersin)\b/.test(s)||codes(text).length>0||/this|bunu|bu ders/.test(s)||!!d&&nameMatches(text,d).length>0;
    return /prereq|on\s*(?:kosul|sart)|unlock|hangi ders|which courses/.test(s)||course&&/\b(pass|passing|passed|fail|failing|failed|postpone|postponing|take)\b|gecer|gecme|geceme|gecsem|gecebilir|basarisiz|kalir|kalma|kalsam|erteler|erteleme|alabilir|almak/.test(s);
  }
  function validateContext(value,datasets){
    const v=value===undefined?{dataset:datasets[0]?.id,sharing:'none'}:value;
    if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).some(k=>!['dataset','sharing','completed','hypotheticalIncomplete'].includes(k)))return null;
    const d=datasets.find(d=>d.id===v.dataset);if(!d||!['saved','none'].includes(v.sharing))return null;
    const list=v.completed??[];
    if(!Array.isArray(list)||list.length>100||list.some(c=>typeof c!=='string'||!P.courseCodes(d).has(c))||v.sharing==='none'&&list.length)return null;
    if(v.hypotheticalIncomplete!==undefined&&(!d.courses.some(c=>c.code===v.hypotheticalIncomplete)||!list.includes(v.hypotheticalIncomplete)))return null;
    return {d,sharing:v.sharing,supplied:[...new Set(list)],override:v.hypotheticalIncomplete||null};
  }
  function nameMatches(text,d){
    const s=' '+fold(text).replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()+' ';
    const exact=d.courses.filter(c=>Object.values(c.title||{}).some(title=>title&&s.includes(' '+fold(title).replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()+' ')));
    if(exact.length)return exact;
    const stop=new Set('what happens if i fail pass passing failing postpone course courses the this which would unlock can take prerequisite prerequisites does of for a an ne olur eger ben bu ders dersi dersten kalirsam gecersem ertelemek on kosul kosullari hangi alabilir miyim'.split(' '));
    const words=s.trim().split(' ').filter(w=>w.length>2&&!stop.has(w));
    return words.length?d.courses.filter(c=>Object.values(c.title||{}).some(title=>words.every(w=>(' '+fold(title).replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ')+' ').includes(' '+w+' ')))):[];
  }
  function resolve(text,d,history=[],choice){
    if(!isRequest(text,d))return {kind:'none'};
    const explicit=codes(text);let supported=explicit.filter(code=>d.courses.some(c=>c.code===code));
    if(supported.length!==explicit.length){
      if(explicit.length===1&&typeof choice==='string'&&d.courses.some(c=>c.code===choice)){explicit[0]=choice;supported=[choice];}
      else return {kind:'unknown',candidates:[]};
    }
    let candidates=supported.map(code=>d.courses.find(c=>c.code===code)),target=null;
    // In a two-course conditional, the course after fail/postpone/pass is the assumption.
    if(explicit.length>1){
      const s=fold(text);
      const tail=s.match(/\b(?:fail(?:ed|ing)?|pass(?:ed|ing)?|postpone|postponing)\s+([a-z]{2,6}\s*[- ]?\s*\d{3,4})|([a-z]{2,6}\s*[- ]?\s*\d{3,4})['’]?(?:ten|tan|den|dan|i|yi|u|yu)?\s+(?:kalir|gecer|geceme|gecmez|erteler)/);
      const cause=tail?codes(tail[1]||tail[2])[0]:null;
      if(cause&&explicit.length===2){candidates=[d.courses.find(c=>c.code===cause)];target=explicit.find(c=>c!==cause);}
    }
    if(!explicit.length){
      candidates=nameMatches(text,d);
      if(!candidates.length&&/\bthis\b|bu ders|bunu/.test(fold(text))){
        for(const entry of history.slice(-6).reverse().filter(e=>e.role==='user')){
          const found=codes(entry.content).filter(code=>d.courses.some(c=>c.code===code));
          if(found.length){const prior=found.length===1?{course:found[0]}:resolve(entry.content,d,[]);if(prior.course)candidates=[d.courses.find(c=>c.code===prior.course)];break;}
        }
        if(!candidates.length&&!history.slice(-6).some(e=>e.role==='user'&&codes(e.content).length)){const recent=[...history].reverse().find(e=>e.role==='assistant');const found=codes(recent?.content).filter(code=>d.courses.some(c=>c.code===code));if(found.length===1)candidates=[d.courses.find(c=>c.code===found[0])];}
      }
    }
    if(choice!==undefined){if(typeof choice!=='string'||!d.courses.some(c=>c.code===choice)||candidates.length&&!candidates.some(c=>c.code===choice)&&!(explicit.length===0&&/\bthis\b|bu ders|bunu/.test(fold(text))))return {kind:'unknown',candidates:[]};candidates=[d.courses.find(c=>c.code===choice)];}
    if(candidates.length!==1)return {kind:candidates.length?'ambiguous':'missing',candidates:candidates.map(c=>({code:c.code,title:c.title}))};
    const s=fold(text),intent=/\bfail|\bpostpon|(?:don't|do not|not)\s+pass|geceme|gecmez|basarisiz|kalir|kalma|kalsam|ertele/.test(s)?'incomplete':/prereq|on\s*(?:kosul|sart)|can i take|alabilir/.test(s)?'requirements':'pass';
    return {kind:'resolved',course:candidates[0].code,target,intent};
  }
  function snapshot(d){return {id:d.id,program:{...d.program},version:d.version,courses:d.courses.map(c=>({code:c.code,title:c.title&&{...c.title},ects:c.ects,verification:c.verification,prerequisites:c.prerequisites,corequisites:c.corequisites,source:c.source})),priorCourses:(d.priorCourses||[]).map(c=>({code:c.code,source:c.source}))};}
  function calculate(d,completed,course,target){
    const v=W.explorer(d,completed,course),own=v.withoutPass.results[course];
    return {immediate:v.changed,direct:W.relationships(v.graph,course).direct,indirect:W.relationships(v.graph,course).indirect,directBlocked:v.directBlocked,alternatives:v.alternatives,unknown:v.graph.unknown,selected:own,target:target?{code:target,without:v.withoutPass.results[target],with:v.withPass.results[target]}:null,cycles:v.graph.cycles};
  }
  function build(context,resolved){
    if(!context||resolved.kind!=='resolved')return null;
    if(context.override&&context.override!==resolved.course)return null;
    const completed=context.supplied.filter(c=>c!==context.override);
    if(completed.includes(resolved.course))return null;
    const dataset=snapshot(context.d);
    return {version:1,type:'course-impact',dataset,course:resolved.course,intent:resolved.intent,target:resolved.target||null,context:{sharing:context.sharing,supplied:[...context.supplied],completed,override:context.override},result:calculate(dataset,completed,resolved.course,resolved.target),createdAt:new Date().toISOString()};
  }
  function validUnchecked(a){
    if(!a||a.version!==1||a.type!=='course-impact'||!a.dataset||a.dataset.courses?.length>200||!P.validDataset(a.dataset)||!a.dataset.courses.some(c=>c.code===a.course)||!['pass','incomplete','requirements'].includes(a.intent)||a.target!==null&&!a.dataset.courses.some(c=>c.code===a.target)||typeof a.createdAt!=='string'||!Number.isFinite(Date.parse(a.createdAt)))return false;
    const context=validateContext({dataset:a.dataset.id,sharing:a.context?.sharing,completed:a.context?.supplied,hypotheticalIncomplete:a.context?.override||undefined},[a.dataset]);
    if(!context)return false;const rebuilt=build(context,{kind:'resolved',course:a.course,target:a.target,intent:a.intent});
    return !!rebuilt&&JSON.stringify(rebuilt.result)===JSON.stringify(a.result)&&JSON.stringify(rebuilt.context)===JSON.stringify(a.context);
  }
  function valid(a){try{return validUnchecked(a);}catch{return false;}}
  function rule(r,lang='en',depth=0){
    if(depth>12)return lang==='tr'?'Doğrulanamıyor':'Cannot verify';
    if(!r)return lang==='tr'?'Listelenmiş koşul yok':'No listed requirement';
    if(r.op==='course')return r.code;
    if(!['and','or'].includes(r.op)||!Array.isArray(r.items)||!r.items.length)return lang==='tr'?'Doğrulanamıyor':'Cannot verify';
    return '('+r.items.map(x=>rule(x,lang,depth+1)).join(r.op==='and'?(lang==='tr'?' VE ':' AND '):(lang==='tr'?' VEYA ':' OR '))+')';
  }
  function remaining(r,completed,lang){
    if(!r||P.evaluate(r,completed).met)return '';
    if(r.op==='course')return r.code;
    const children=r.items.map(x=>remaining(x,completed,lang)).filter(Boolean);
    return '('+children.join(r.op==='and'?(lang==='tr'?' VE ':' AND '):(lang==='tr'?' VEYA ':' OR '))+')';
  }
  function fallback(a,lang='en'){
    const tr=lang==='tr',r=a.result,c=a.dataset.courses.find(c=>c.code===a.course),n=r.immediate.length;
    const lines=[a.intent==='incomplete'?(tr?`${a.course} dersini geçmezsen, geçmene kıyasla ${n} ek dersin ön koşulları eksik kalır.`:`If you do not pass ${a.course}, ${n} additional course options remain unmet compared with passing it.`):(tr?`${a.course} dersini geçmek ${n} ek dersin ön koşullarını sağlar.`:`Passing ${a.course} satisfies requirements for ${n} additional course${n===1?'':'s'}.`)];
    if(n)lines.push((tr?'Doğrudan etkilenenler: ':'Immediately affected: ')+r.immediate.join(', ')+'.');
    else lines.push(tr?'Bu, dersin gereksiz olduğu anlamına gelmez.':'This does not mean the course is unnecessary.');
    for(const code of r.directBlocked.slice(0,3)){const c=a.dataset.courses.find(c=>c.code===code),done=new Set(a.context.completed.concat(a.course));lines.push(code+(tr?' için hâlâ gerekenler: ':' still needs: ')+[remaining(c.prerequisites,done,lang),c.corequisites?(tr?'Eş koşullar: ':'Corequisites: ')+remaining(c.corequisites,done,lang):''].filter(Boolean).join('; ')+'.');}
    if(r.selected.status==='missing'||r.selected.status==='unknown')lines.push(tr?'Bu dersin kendi koşulları önce sağlanmalı; sonuçlar ileride geçildiğini varsayar.':'Its own requirements must first be satisfied; these results assume it is eventually passed.');
    if(a.intent==='requirements')lines.push((tr?'Seçilen dersin koşulları: ':'Selected course requirements: ')+(r.selected.status==='unknown'?(tr?'Doğrulanamıyor':'Cannot verify'):rule(c.prerequisites,lang))+(c.corequisites?' / '+(tr?'Eş koşullar: ':'Corequisites: ')+rule(c.corequisites,lang):'')+'.');
    if(r.alternatives.length)lines.push((tr?'Yayımlanmış alternatiflerle uygun kalanlar: ':'Ready through published alternatives: ')+r.alternatives.join(', ')+'.');
    if(r.target){
      const t=a.dataset.courses.find(c=>c.code===r.target.code),status=r.target.without.status;
      const description=status==='completed'?(tr?'Zaten tamamlanmış.':'Already completed.'):status==='met'?(tr?'Bu ders geçilmese de ön koşulları sağlanır.':'Its requirements are met even without this pass.'):status==='unknown'?(tr?'Koşulları doğrulanamıyor.':'Its requirements cannot be verified.'):(tr?'Bu ders geçilmediğinde ön koşulları eksik kalır.':'Its requirements remain unmet without this pass.');
      lines.push(t.code+': '+description+(status!=='unknown'?' '+(tr?'Koşullar: ':'Requirements: ')+rule(t.prerequisites,lang)+(t.corequisites?' / '+(tr?'Eş koşullar: ':'Corequisites: ')+rule(t.corequisites,lang):'')+'.':''));
    }
    if(a.intent==='requirements')lines.unshift(c.code+': '+(r.selected.status==='met'?(tr?'Gönderilen seçimlerle ön koşulları sağlanır.':'Its prerequisites are met with the supplied selections.'):r.selected.status==='unknown'?(tr?'Ön koşulları doğrulanamıyor.':'Its prerequisites cannot be verified.'):(tr?'Ön koşulları henüz sağlanmıyor.':'Its prerequisites are not yet met.')));
    lines.push(tr?'Yalnızca ön koşullar kontrol edilir; dersin açılması, kontenjan, program ve danışman onayı ayrıdır. [Resmi ders kayıtları]':'This checks prerequisites only; offerings, quotas, timetable and advisor approval are separate. [Official course records]');
    lines.push(a.context.sharing==='saved'?(tr?`Gönderdiğin ${a.context.supplied.length} tamamlanmış ders seçimi kullanıldı.`:`Using your ${a.context.supplied.length} supplied completed-course selections.`):(tr?'Genel karşılaştırma: tamamlanmış ders seçimi gönderilmedi.':'General comparison: no completed courses were supplied.'));
    if(a.context.override)lines.push(tr?'Ders yalnızca bu ayrı varsayımda tamamlanmamış sayılır; gerçek ilerlemen değişmedi.':'Only this separate hypothetical comparison treats the course as incomplete; actual progress is unchanged.');
    return lines.join('\n');
  }
  function clarification(kind,lang){const tr=lang==='tr';return kind==='completed'?(tr?'Bu ders tamamlanmış olarak işaretli. Ders tekrarını mı, yoksa tamamlanmamış olduğu ayrı bir varsayımı mı kastediyorsun? Gerçek ilerlemen değişmedi.':'This course is marked completed. Do you mean a retake, or a separate hypothetical comparison treating it as incomplete? Your actual progress is unchanged.'):kind==='unknown'?(tr?'Bu ders kodunu seçili müfredatta doğrulayamıyorum. Lütfen desteklenen bir ders seç.':'I can’t verify that course code in the selected curriculum. Please choose a supported course.'):kind==='unavailable'?(tr?'Doğrulanmış müfredat şu anda kullanılamıyor.':'The verified curriculum is unavailable.'):kind==='ambiguous'?(tr?'Birden fazla ders eşleşiyor. Hangisini kastediyorsun?':'Several courses match. Which one do you mean?'):(tr?'Hangi dersi kastediyorsun? Bir ders kodu yaz veya aşağıdan seç.':'Which course do you mean? Enter its code or choose below.');}
  async function explain(a,lang,generate){try{const text=await generate(a);if(text?.refused===true)return {refused:true};if(typeof text==='string'&&text.trim())return {answer:text.trim(),fallback:false};}catch{}return {answer:fallback(a,lang),fallback:true};}
  return {isRequest,codes,resolve,validateContext,build,valid,calculate,rule,fallback,clarification,explain};
});
