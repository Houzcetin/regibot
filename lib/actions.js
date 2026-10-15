'use strict';
const P=require('../public/planning-core');
const {fold}=require('./retrieval');
// Actions come from code, never model-authored URLs, labels or HTML.
function mentionsDates(answer,event){
  const a=fold(answer).replace(/[–—]/g,'-').replace(/\s+/g,' ');
  if(a.includes(event.start)&&a.includes(event.end))return true;
  for(const locale of ['tr-TR','en-GB']){
    const fmt=s=>new Intl.DateTimeFormat(locale,{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(s+'T00:00:00Z'));
    const start=fmt(event.start),end=fmt(event.end);
    if(a.includes(fold(start))&&a.includes(fold(end)))return true;
    if(event.start.slice(0,7)===event.end.slice(0,7)){
      const range=Number(event.start.slice(-2))+'-'+end;
      if(a.replace(/\s*-\s*/g,'-').includes(fold(range)))return true;
    }
  }
  return false;
}
function actionsFor(question,answer,sources,dateHits,events){
  if(!sources.length||/\b(don.t know|do not know|cannot help|can.t help|cannot answer)\b|bilmiyorum|yardımcı olamıyorum|bilgi bulunmuyor/i.test(answer))return [];
  const q=fold(question),a=fold(answer),out=[];
  const both=re=>re.test(q)&&re.test(a);
  const nav=destination=>out.push({type:'navigate',destination});
  if(both(/prerequis|on kosul|onko[sş]ul/))nav('eligibility');
  if(both(/registration|register|kayit/))nav('checklist');
  if(both(/ects|akts|course load|ders yuku/))nav('load');
  if(both(/deadline|calendar|date|tarih|takvim|ne zaman/)){
    nav('calendar');
    // Exact title and matching ISO or localized dates must be visible in the cited answer.
    for(const {event} of dateHits||[]){
      if(sources.some(s=>/2026-2027-Akademik-Takvim\.pdf/.test(s.url||''))&&P.validEvent(event)&&(a.includes(fold(event.event))||a.includes(fold(event.event_en)))&&mentionsDates(answer,event))out.push({type:'calendar',eventId:P.eventId(event)});
    }
  }
  const topic=both(/quota|kota|kontenjan/)?'quota':both(/advisor|danisman/)?'advisor':null;
  if(topic){nav('contact');out.push({type:'email',topic});}
  return out.filter(x=>P.actionValid(x,events)).slice(0,6);
}
module.exports={actionsFor};
