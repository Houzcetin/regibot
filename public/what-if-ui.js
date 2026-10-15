/* Course Explorer and optional comparisons; all calculations use the deterministic engine. */
(function(root){
  'use strict';
  const TEXT={
  "en": {
    "nav": "Course Explorer",
    "explore": "Explore this course",
    "actual": "Actually completed",
    "ready": "Requirements met",
    "blocked": "Still blocked",
    "unknown": "Cannot verify",
    "assumed": "Assumed passed",
    "planA": "Plan A",
    "planB": "Plan B",
    "none": "None",
    "prerequisites": "Prerequisites",
    "corequisites": "Corequisites",
    "noPre": "No prerequisite listed",
    "noCo": "No separate corequisite specified",
    "and": "AND",
    "or": "OR",
    "unknownReason": "A verified, supported rule is unavailable. No dependency or readiness is invented.",
    "paths": "Dependency explorer",
    "graphPlan": "Color using",
    "baseline": "Your completed courses",
    "graphDirection": "Dependency direction",
    "requirementsView": "Requirements leading to target",
    "dependentsView": "Courses referencing target",
    "graphLegend": "Arrow: required course → dependent course. Solid: prerequisite; dashed: corequisite. A link alone does not mean every alternative is mandatory. Read the full AND/OR expression alongside it.",
    "graphText": "Text equivalent and full requirement expressions",
    "graphTrim": "Compact view shows {shown} of {total} related courses. The full list is below.",
    "prior": "Referenced prior-curriculum code; its own requirements are not included.",
    "currentSource": "Requirements source",
    "relationHint": "Direct and indirect links describe published relationships. Only reevaluated statuses describe an actual scenario effect.",
    "direct": "Direct published references",
    "indirect": "Indirect published chains",
    "effect": "Whole-plan readiness changes",
    "unknownGraph": "Unknown",
    "official": "Official course record",
    "credits": "ECTS",
    "cycles": "Possible cycle in published dependencies: {codes}. OR alternatives may make a structural cycle avoidable. No automatic traversal completes courses.",
    "unknownData": "Some course rules are unknown or malformed: {codes}. Those rules are omitted from the graph and return Cannot verify.",
    "coreqLimit": "Corequisites are evaluated separately using the existing checker: they count here only after completion. Concurrent enrollment is not modeled; consult your advisor.",
    "coverage": "This dataset covers the supported 2025 curriculum course list, not every elective or curriculum version. Curriculum semester and ECTS are not used to predict offerings, valid loads, or graduation dates.",
    "storage": "Browser storage is unavailable. This session still works, but scenarios may not persist and inaccessible saved data cannot be reset.",
    "loading": "Loading the selected curriculum…",
    "unavailable": "A validated curriculum is unavailable. Open course eligibility to check your selection, or try again later.",
    "resetDone": "Hypothetical scenarios reset. Actual completions are unchanged.",
    "updated": "Results updated.",
    "question": "What does passing this course unlock?",
    "intro": "Choose a course to see which published prerequisite requirements it would satisfy.",
    "using": "Using your {count} completed courses",
    "edit": "Edit",
    "legacy": "{count} prior-curriculum selection(s) are included separately.",
    "noCompleted": "You haven’t saved any completed courses, so these results currently assume none completed.",
    "setCompleted": "Set your completed courses",
    "choose": "Choose a course",
    "search": "Search by course code or full title",
    "change": "Change or add a course",
    "clear": "Clear course choice",
    "passIt": "If I pass it",
    "postponeIt": "If I postpone it",
    "empty": "Pick a course to see what passing it could unlock. This won’t change your actual completed courses.",
    "example": "Try an example",
    "noExample": "No uncompleted course with a verified rule is available to try.",
    "noMatches": "No matching courses.",
    "protected": "{code} is already completed. No additional pass is assumed; you can still explore its published connections.",
    "conditional": "You would first need to satisfy this course’s prerequisites. These results assume you eventually pass it.",
    "unknownSelected": "This course’s requirements can’t be verified. You can explore the assumption, but passing it is conditional.",
    "sequence": "Pass {codes} first. These choices need to happen in that order, not necessarily in one semester.",
    "order": "A valid order for these choices couldn’t be confirmed. Check the missing conditions and prerequisite paths.",
    "stillNeeds": "Still needs",
    "passHeadline": "Passing {course} satisfies prerequisites for {count} additional courses.",
    "postponeHeadline": "Postponing {course} leaves {count} additional course options blocked compared with passing it.",
    "noPassChange": "Passing this course alone doesn’t make another course ready. It may still contribute toward requirements or your degree.",
    "noPostponeChange": "Postponing {course} makes no difference to other courses’ prerequisite readiness compared with passing it.",
    "multiHeadline": "Passing all selected courses would satisfy the prerequisites for {count} additional courses.",
    "multiNoChange": "These assumed passes do not make any additional course ready.",
    "multiHint": "Compare passing all selected courses with your completed courses. Postpone removes one assumption from this choice; it never removes an actual completion.",
    "postponeHint": "This compares passing the course with leaving it unpassed. It does not remove any of your actual completions.",
    "passReason": "Its published requirements would be satisfied by passing {codes}.",
    "postponeReason": "Without this pass, it still needs",
    "indirectReason": "Related through a prerequisite chain; it does not become ready just from these choices.",
    "other": "Other courses this helps with",
    "relatedDirect": "Even with these passes, it still needs",
    "alternatives": "A published alternative you already completed keeps {codes} ready.",
    "why": "Why?",
    "before": "Your completed courses",
    "withPass": "With the assumed pass(es)",
    "withoutPass": "Without the assumed pass(es)",
    "addAnother": "Add another course",
    "addMore": "Add a course",
    "compareAnother": "Compare another scenario",
    "compareTitle": "How the two choices differ",
    "onlyA": "Ready in Plan A only",
    "onlyB": "Ready in Plan B only",
    "samePlans": "The two choices give the same prerequisite-ready options.",
    "postpone": "Postpone",
    "postponed": "Removed {code} from {plan}.",
    "removedLoss": "Compared with the previous choice, {count} course options no longer have their requirements satisfied.",
    "removedNoLoss": "No other course loses prerequisite readiness after removing it.",
    "pathsButton": "View prerequisite map",
    "pathsCourse": "Course to inspect",
    "filter": "Detailed course view",
    "relatedFilter": "Related courses",
    "allFilter": "All supported courses",
    "blockedFilter": "Still missing requirements",
    "unknownFilter": "Unknown requirements",
    "how": "How this works",
    "howBody": "Only courses you marked completed or explicitly assume passed count as completed. A newly ready course is not automatically passed. AND means every condition; OR means one published alternative is enough.",
    "multipleLimit": "Several assumed passes do not prove that those courses can be taken together or within one semester.",
    "scope": "Checks prerequisites only; course offerings, quotas, timetable, and advisor approval are separate.",
    "reset": "Reset hypothetical choices",
    "resetHint": "Actual completions and registration checklist progress stay unchanged.",
    "saved": "Hypothetical choices are saved separately on this browser.",
    "announcement": "{count} additional courses have their prerequisite requirements satisfied.",
    "unknownEffects": "Only verified changes are counted; some requirements are unavailable.",
    "curriculum": "Curriculum",
    "usingOne": "Using your 1 completed course",
    "legacyOne": "1 prior-curriculum course is included separately.",
    "passHeadlineOne": "Passing {course} satisfies prerequisites for 1 additional course.",
    "postponeHeadlineOne": "Postponing {course} leaves 1 additional course option blocked compared with passing it.",
    "multiHeadlineOne": "Passing all selected courses would satisfy the prerequisites for 1 additional course.",
    "longer": "Longer-term connections",
    "longerHint": "These are published prerequisite chains. Intermediate courses must also be passed; these connections are not additional unlocked courses.",
    "contribution": "This pass satisfies the {code} condition. Still needs",
    "completedConnections": "Published course connections",
    "advanced": "Compare multiple courses — advanced",
    "savedComparison": "Saved comparison available",
    "advancedIntro": "These separate hypothetical choices never change your completed courses. Pass/postpone modes and sequencing apply within each plan.",
    "simpleColor": "With this course passed",
    "simpleSaved": "Your explorer choice is saved separately from advanced comparisons.",
    "clearShort": "Clear",
    "noChangeAnnouncement": "No additional courses become ready.",
    "completedAnnouncement": "This course is already completed."
  },
  "tr": {
    "nav": "Ders Keşfi",
    "explore": "Bu dersi keşfet",
    "actual": "Gerçekte tamamlandı",
    "ready": "Koşullar sağlandı",
    "blocked": "Eksik koşullar",
    "unknown": "Doğrulanamıyor",
    "assumed": "Geçildiği varsayılıyor",
    "planA": "Plan A",
    "planB": "Plan B",
    "none": "Yok",
    "prerequisites": "Ön koşullar",
    "corequisites": "Eş koşullar",
    "noPre": "Ön koşul listelenmemiş",
    "noCo": "Ayrı eş koşul belirtilmemiş",
    "and": "VE",
    "or": "VEYA",
    "unknownReason": "Doğrulanmış, desteklenen kural bulunmuyor. Bağımlılık veya uygunluk tahmin edilmez.",
    "paths": "Bağımlılık gezgini",
    "graphPlan": "Renklerin durumu",
    "baseline": "Tamamladığın derslerle",
    "graphDirection": "Bağımlılık yönü",
    "requirementsView": "Hedefe giden koşullar",
    "dependentsView": "Hedefi referans veren dersler",
    "graphLegend": "Ok: gereken ders → bağımlı ders. Düz çizgi: ön koşul; kesikli çizgi: eş koşul. Bağlantı, tüm alternatiflerin zorunlu olduğu anlamına gelmez. Yanındaki tam VE/VEYA ifadesini okuyun.",
    "graphText": "Metin karşılığı ve tam koşul ifadeleri",
    "graphTrim": "Kısa görünüm {total} ilişkili dersin {shown} tanesini gösteriyor. Tam liste aşağıdadır.",
    "prior": "Önceki müfredattan referans kodu; bu dersin kendi koşulları veri setinde yok.",
    "currentSource": "Koşul kaynağı",
    "relationHint": "Doğrudan ve dolaylı bağlantılar yayımlanan ilişkileri gösterir. Gerçek senaryo etkisini yalnızca yeniden değerlendirilen durumlar gösterir.",
    "direct": "Doğrudan yayımlanan referanslar",
    "indirect": "Dolaylı yayımlanan zincirler",
    "effect": "Tüm planın uygunluk değişimleri",
    "unknownGraph": "Bilinmiyor",
    "official": "Resmi ders kaydı",
    "credits": "AKTS",
    "cycles": "Yayımlanan bağımlılıklarda olası döngü: {codes}. VEYA alternatifleri yapısal döngüyü önleyebilir. Otomatik tarama dersleri tamamlamaz.",
    "unknownData": "Bazı ders kuralları bilinmiyor veya bozuk: {codes}. Bu kurallar grafiğe eklenmez ve Doğrulanamıyor sonucu verir.",
    "coreqLimit": "Eş koşullar mevcut kontrol motoruyla ayrı değerlendirilir: burada yalnızca tamamlandıktan sonra sayılır. Eş zamanlı kayıt modellenmez; danışmanınıza başvurun.",
    "coverage": "Bu veri seti, desteklenen 2025 ders listesini kapsar; her seçmeli dersi veya müfredat sürümünü kapsamaz. Müfredat dönemi ve AKTS, ders açılmasını, geçerli yükü veya mezuniyet tarihini tahmin etmek için kullanılmaz.",
    "storage": "Tarayıcı depolaması kullanılamıyor. Bu oturum çalışır ancak senaryolar saklanmayabilir ve erişilemeyen kayıtlar sıfırlanamaz.",
    "loading": "Seçili müfredat yükleniyor…",
    "unavailable": "Doğrulanmış müfredat kullanılamıyor. Ders uygunluğunda seçiminizi kontrol edin veya sonra deneyin.",
    "resetDone": "Varsayımsal senaryolar sıfırlandı. Gerçek tamamlamalar değişmedi.",
    "updated": "Sonuçlar güncellendi.",
    "question": "Bu dersi geçersem hangi derslerin önü açılır?",
    "intro": "Bir ders seç; geçtiğinde hangi derslerin yayımlanmış ön koşullarını sağlayacağını gör.",
    "using": "Tamamladığın {count} ders esas alınıyor",
    "edit": "Düzenle",
    "legacy": "Önceki müfredattan {count} ders seçimi ayrıca hesaba katılıyor.",
    "noCompleted": "Henüz tamamladığın dersleri kaydetmedin. Şu anki sonuçlar hiçbir dersi tamamlamadığını varsayıyor.",
    "setCompleted": "Tamamladığın dersleri belirt",
    "choose": "Bir ders seç",
    "search": "Ders kodu veya tam adıyla ara",
    "change": "Dersi değiştir veya başka ders ekle",
    "clear": "Ders seçimini temizle",
    "passIt": "Geçersem",
    "postponeIt": "Ertelersem",
    "empty": "Bir ders seçerek onu geçmenin hangi derslerin önünü açabileceğini gör. Tamamladığın gerçek dersler değişmez.",
    "example": "Bir örnek dene",
    "noExample": "Deneyebileceğin, kuralı doğrulanmış ve henüz tamamlanmamış bir ders yok.",
    "noMatches": "Eşleşen ders bulunamadı.",
    "protected": "{code} zaten tamamlanmış. Yeniden geçildiği varsayılmıyor; yayımlanmış ders bağlantılarını inceleyebilirsin.",
    "conditional": "Önce bu dersin ön koşullarını sağlaman gerekir. Bu sonuçlar, dersi ileride geçtiğini varsayıyor.",
    "unknownSelected": "Bu dersin koşulları doğrulanamıyor. Varsayımı inceleyebilirsin ancak dersi geçebileceğin doğrulanmış değil.",
    "sequence": "Önce {codes} derslerini geçmelisin. Bu seçimler sırayla tamamlanmalı; aynı dönemde alınabilecekleri anlamına gelmez.",
    "order": "Bu seçimler için geçerli bir tamamlama sırası doğrulanamadı. Eksik koşulları ve ön koşul yollarını incele.",
    "stillNeeds": "Hâlâ gerekenler",
    "passHeadline": "{course} dersini geçmek, {count} ek dersin ön koşullarını sağlar.",
    "postponeHeadline": "{course} dersini ertelersen, geçmene kıyasla {count} ek dersin ön koşulları eksik kalır.",
    "noPassChange": "Yalnızca bu dersi geçmek başka bir dersi uygun hâle getirmiyor. Yine de diğer koşulları tamamlamana veya mezuniyetine katkı sağlayabilir.",
    "noPostponeChange": "{course} dersini ertelemek, geçmene kıyasla diğer derslerin ön koşul durumunda fark yaratmıyor.",
    "multiHeadline": "Seçtiğin derslerin hepsini geçersen {count} ek dersin ön koşulları sağlanır.",
    "multiNoChange": "Bu geçme varsayımları başka bir dersin ön koşullarını tamamlamıyor.",
    "multiHint": "Seçili derslerin hepsini geçtiğin durum, tamamladığın derslerle karşılaştırılır. Ertele, bu seçimden yalnızca bir varsayımı kaldırır; gerçekte tamamlanmış bir dersi kaldırmaz.",
    "postponeHint": "Dersi geçtiğin durum ile henüz geçmediğin durum karşılaştırılır. Gerçekte tamamladığın derslerden hiçbiri kaldırılmaz.",
    "passReason": "{codes} derslerini geçmen, yayımlanan koşulları sağlar.",
    "postponeReason": "Bu dersi geçmeden hâlâ gerekenler",
    "indirectReason": "Bir ön koşul zinciriyle ilişkili; yalnızca bu seçimlerle koşulları sağlanmıyor.",
    "other": "Bu dersin katkı sağladığı diğer dersler",
    "relatedDirect": "Bu dersleri geçsen bile hâlâ gerekenler",
    "alternatives": "Zaten tamamladığın, yayımlanmış bir alternatif sayesinde {codes} derslerinin koşulları sağlanmaya devam ediyor.",
    "why": "Neden?",
    "before": "Tamamladığın derslerle",
    "withPass": "Geçildiği varsayıldığında",
    "withoutPass": "Geçildiği varsayılmadan",
    "addAnother": "Bir ders daha ekle",
    "addMore": "Ders ekle",
    "compareAnother": "Başka bir senaryoyla karşılaştır",
    "compareTitle": "İki seçim arasındaki fark",
    "onlyA": "Yalnızca Plan A’da koşulları sağlananlar",
    "onlyB": "Yalnızca Plan B’de koşulları sağlananlar",
    "samePlans": "İki seçimde de aynı derslerin ön koşulları sağlanıyor.",
    "postpone": "Ertele",
    "postponed": "{code}, {plan} seçiminden çıkarıldı.",
    "removedLoss": "Önceki seçime kıyasla {count} dersin koşulları artık sağlanmıyor.",
    "removedNoLoss": "Bu varsayımın kaldırılması başka bir dersin ön koşul uygunluğunu etkilemiyor.",
    "pathsButton": "Ön koşul haritasını görüntüle",
    "pathsCourse": "İncelenecek ders",
    "filter": "Ayrıntılı ders görünümü",
    "relatedFilter": "İlişkili dersler",
    "allFilter": "Desteklenen tüm dersler",
    "blockedFilter": "Koşulları hâlâ eksik olanlar",
    "unknownFilter": "Koşulları bilinmeyenler",
    "how": "Nasıl çalışır?",
    "howBody": "Yalnızca tamamlandı olarak işaretlediğin veya geçtiğini açıkça varsaydığın dersler tamamlanmış sayılır. Koşulları yeni sağlanan bir ders otomatik olarak geçilmiş sayılmaz. VE, tüm koşulları; VEYA, yayımlanan seçeneklerden birini ifade eder.",
    "multipleLimit": "Birden fazla dersi geçtiğini varsaymak, bu dersleri birlikte veya tek dönemde alabileceğini kanıtlamaz.",
    "scope": "Yalnızca ön koşullar kontrol edilir; dersin açılması, kontenjan, ders programı ve danışman onayı ayrıdır.",
    "reset": "Varsayımsal seçimleri sıfırla",
    "resetHint": "Gerçek tamamlamaların ve ders kayıt kontrol listesi ilerlemen değişmez.",
    "saved": "Varsayımsal seçimler bu tarayıcıda ayrı saklanır.",
    "announcement": "{count} ek dersin ön koşulları sağlanıyor.",
    "unknownEffects": "Yalnızca doğrulanmış değişimler sayılıyor; bazı koşullar kullanılamıyor.",
    "curriculum": "Müfredat",
    "usingOne": "Tamamladığın 1 ders esas alınıyor",
    "legacyOne": "Önceki müfredattan 1 ders seçimi ayrıca hesaba katılıyor.",
    "passHeadlineOne": "{course} dersini geçmek, 1 ek dersin ön koşullarını sağlar.",
    "postponeHeadlineOne": "{course} dersini ertelersen, geçmene kıyasla 1 ek dersin ön koşulları eksik kalır.",
    "multiHeadlineOne": "Seçtiğin derslerin hepsini geçersen 1 ek dersin ön koşulları sağlanır.",
    "longer": "Sonraki derslerle bağlantılar",
    "longerHint": "Bunlar yayımlanmış ön koşul zincirleridir. Aradaki dersleri de geçmen gerekir; bu bağlantılar, ön koşulları yeni sağlanan ders sayısına dahil değildir.",
    "contribution": "Bu dersi geçmek {code} koşulunu sağlar. Hâlâ gerekenler",
    "completedConnections": "Yayımlanmış ders bağlantıları",
    "advanced": "Birden fazla dersi karşılaştır — gelişmiş",
    "savedComparison": "Kayıtlı karşılaştırma var",
    "advancedIntro": "Bu ayrı varsayımsal seçimler, tamamladığın dersleri değiştirmez. Geçme/erteleme seçenekleri ve ders sıralaması her plan içinde değerlendirilir.",
    "simpleColor": "Bu ders geçildiğinde",
    "simpleSaved": "Ders keşfi seçimin, gelişmiş karşılaştırmalardan ayrı kaydedilir.",
    "clearShort": "Temizle",
    "noChangeAnnouncement": "Ön koşulları yeni sağlanan ek ders yok.",
    "completedAnnouncement": "Bu ders zaten tamamlanmış."
  }
};
  function create(opts){
    const P=root.Planning,W=root.WhatIf,esc=opts.escape,url=opts.url;
    let explorerState=null,advancedOpen=false;
    let state=null,loadedDataset='',storageFailed=false,choices={a:'',b:'',x:''},queries={a:'',b:'',x:''},popup={a:false,b:false,x:false},active={a:-1,b:-1,x:-1};
    let pathsOpen=false,graphPlan='a',direction='requirements',lastPostpone=null,message=null,lastBaselineKey='',restoringFocus=false;
    const lang=()=>opts.getLang();
    const t=(key,args={})=>String(TEXT[lang()][key]??key).replace(/\{(\w+)\}/g,(_,k)=>String(args[k]??''));
    const normalize=s=>String(s).toLocaleLowerCase('tr').normalize('NFD').replace(/\p{M}/gu,'').replace(/ı/g,'i');
    const planName=k=>t(k==='a'?'planA':'planB');
    const multi=k=>k!=='x'&&Boolean(state?.presentation[k==='a'?'multiA':'multiB']);
    function sync(){
      const d=opts.getDataset();if(!d)return null;
      if(loadedDataset!==d.id){
        try{const loaded=W.read(localStorage,d);state=loaded.state;storageFailed=loaded.unavailable;}catch{state=W.clean(null,d);storageFailed=true;}
        try{const simple=W.readExplorer(localStorage,d);explorerState=simple.state;storageFailed=storageFailed||simple.unavailable;}catch{explorerState=W.cleanExplorer(null,d);storageFailed=true;}
        loadedDataset=d.id;choices={a:state.a[0]||state.target||'',b:state.b[0]||'',x:explorerState.course};queries={a:'',b:'',x:''};popup={a:false,b:false,x:false};active={a:-1,b:-1,x:-1};pathsOpen=false;lastPostpone=null;
      }
      return d;
    }
    function save(){const d=sync();if(d)try{storageFailed=!W.save(localStorage,state,d);}catch{storageFailed=true;}}
    function reset(doRefresh=true){
      const d=sync();try{storageFailed=!W.reset(localStorage);}catch{storageFailed=true;}
      state=W.clean(null,d);choices.a='';choices.b='';queries.a='';queries.b='';popup.a=false;popup.b=false;lastPostpone=null;message={key:'resetDone'};
      if(!doRefresh){try{localStorage.removeItem(W.explorerKey);}catch{storageFailed=true;}explorerState=W.cleanExplorer(null,d);choices.x='';queries.x='';popup.x=false;pathsOpen=false;}
      if(doRefresh)refresh('wf-reset');
    }
    function selected(key){return multi(key)?state[key]:choices[key]?[choices[key]]:[];}
    function view(d,key){return W.preview(d,opts.getBaseline(),selected(key),{mode:state.presentation[key],multi:multi(key),selected:choices[key]});}
    function courseLabel(d,code){const c=d.courses.find(c=>c.code===code);return c?[code,c.title?.[lang()]].filter(Boolean).join(' · '):code;}
    function setChoice(d,key,code){
      if(!d.courses.some(c=>c.code===code))return;
      choices[key]=code;state[key]=multi(key)?[...new Set([...state[key],code])]:opts.getBaseline().includes(code)?[]:[code];state.target=code;
      popup[key]=false;queries[key]='';active[key]=-1;lastPostpone=null;save();message={key:'updated'};
    }
    function focus(code){const d=sync();if(!d?.courses.some(c=>c.code===code))return;setExplorer(d,code);opts.open();}
    function setExplorer(d,code){
      choices.x=code;explorerState=W.cleanExplorer({version:1,dataset:d.id,course:code},d);
      storageFailed=!W.saveExplorer(localStorage,explorerState,d)||storageFailed;queries.x='';popup.x=false;active.x=-1;pathsOpen=false;
      const v=W.explorer(d,opts.getBaseline(),code);message={key:v.protectedSelection?'completedAnnouncement':v.count?'announcement':'noChangeAnnouncement',args:{count:v.count}};
    }
    function status(plan,code){return plan.baseline.has(code)?'completed':plan.assumed.includes(code)?'assumed':plan.results[code]?.status||'unknown';}
    const badge=s=>`<span class="wf-badge wf-${s}">${esc(t({completed:'actual',assumed:'assumed',met:'ready',missing:'blocked',unknown:'unknown'}[s]||'unknown'))}</span>`;
    function conditions(tree,missingOnly=false){
      if(!tree)return esc(t('unknown'));
      if(tree.op==='course')return `<span class="wf-condition ${tree.met?'is-met':'is-missing'}">${esc(tree.code)} <span aria-hidden="true">${tree.met?'✓':'○'}</span></span>`;
      const items=missingOnly?tree.items.filter(x=>!x.met):tree.items;
      if(!items.length)return esc(t('none'));
      return `<span class="wf-expression">( ${items.map(x=>conditions(x,missingOnly)).join(` <strong class="wf-operator">${esc(t(tree.op))}</strong> `)} )</span>`;
    }
    function expression(c,done,g,missingOnly=false){
      if(g.unknown.includes(c.code))return `<p>${esc(t('unknownReason'))}</p>`;
      return [['prerequisites','noPre'],['corequisites','noCo']].map(([field,empty])=>{
        const tree=c[field]?W.tree(c[field],done):null;if(missingOnly&&(!tree||tree.met))return '';
        return `<div class="wf-rule"><strong>${esc(t(field))}</strong><div>${tree?conditions(tree,missingOnly):esc(t(empty))}</div></div>`;
      }).join('');
    }
    function missing(c,done,g){
      if(g.unknown.includes(c.code))return esc(t('unknown'));
      const parts=[];for(const field of ['prerequisites','corequisites'])if(c[field]){const tree=W.tree(c[field],done);if(!tree.met)parts.push(`${field==='corequisites'?esc(t(field))+': ':''}${conditions(tree,true)}`);}
      return parts.join(' · ');
    }
    function courseLinks(d,codes){return codes.length?`<ul class="wf-code-list">${codes.map(code=>`<li><button type="button" data-wf-focus="${esc(code)}">${esc(courseLabel(d,code))}</button></li>`).join('')}</ul>`:`<p class="wf-muted">${esc(t('none'))}</p>`;}
    function matches(d,key){return d.courses.filter(c=>normalize(c.code+' '+Object.values(c.title||{}).join(' ')).includes(normalize(queries[key])));}
    function pickerOptions(d,key){
      const actual=new Set(opts.getBaseline()),rows=matches(d,key);let enabled=-1;
      return rows.map((c,index)=>{const done=actual.has(c.code);if(!done)enabled++;return `<li role="presentation"><button id="wf-option-${key}-${index}" role="option" tabindex="-1" aria-selected="${!done&&enabled===active[key]}" type="button" data-wf-choose="${esc(c.code)}" data-wf-plan="${key}" ${done?'disabled aria-disabled="true"':''}><strong>${esc(c.code)}</strong><span>${esc(c.title?.[lang()]||'')}</span>${done?`<small>${esc(t('actual'))}</small>`:''}</button></li>`;}).join('')||`<li role="presentation" class="wfs-no-match">${esc(t('noMatches'))}</li>`;
    }
    function picker(d,key){return `<div class="wfs-picker"><label for="wf-search-${key}">${esc(t(multi(key)?'addMore':'choose'))}${key==='b'?` · ${esc(planName(key))}`:''}</label><input id="wf-search-${key}" type="search" role="combobox" aria-autocomplete="list" aria-haspopup="listbox" aria-controls="wf-options-${key}" aria-expanded="${popup[key]}" autocomplete="off" data-wf-search="${key}" placeholder="${esc(t('search'))}" value="${esc(key==='x'&&!popup.x&&choices.x?courseLabel(d,choices.x):queries[key])}"><ul class="wfs-picker-options" id="wf-options-${key}" role="listbox" aria-label="${esc(t('choose'))}" ${popup[key]?'':'hidden'}>${pickerOptions(d,key)}</ul></div>`;}
    function updatePicker(key){
      const d=sync();if(!d)return;const input=document.getElementById(`wf-search-${key}`),list=document.getElementById(`wf-options-${key}`);
      if(input&&key==='x'&&!popup.x)input.value=choices.x?courseLabel(d,choices.x):'';
      if(list){list.innerHTML=pickerOptions(d,key);list.hidden=!popup[key];}input?.setAttribute('aria-expanded',String(popup[key]));
      const enabled=matches(d,key).filter(c=>!opts.getBaseline().includes(c.code)),code=enabled[active[key]]?.code,index=matches(d,key).findIndex(c=>c.code===code);
      if(index>=0&&popup[key]){const id=`wf-option-${key}-${index}`;input?.setAttribute('aria-activedescendant',id);document.getElementById(id)?.scrollIntoView?.({block:'nearest'});}else input?.removeAttribute('aria-activedescendant');
    }
    function selectedCourse(d,key,code,v){
      const c=v.graph.byCode.get(code);if(!c)return '';const actual=v.withPass.baseline.has(code),issue=v.withPass.issues.find(x=>x.code===code),others=new Set(v.withPass.completed);others.delete(code);
      let warning='';
      if(actual)warning=`<p class="wfs-course-note">${esc(t('actual'))}</p>`;
      else if(issue){
        const keyText=issue.kind==='unknown'?'unknownSelected':issue.kind==='sequence'?'sequence':issue.kind==='order'?'order':'conditional';
        warning=`<div class="wfs-course-warning"><p>${esc(t(keyText,{codes:issue.support.join(', ')}))}</p>${issue.kind==='unmet'?`<p>${esc(t('stillNeeds'))}: ${missing(c,others,v.graph)}</p>`:''}</div>`;
      }
      return `<article class="wfs-selected" data-selected-course="${esc(code)}"><div class="wfs-selected-heading"><div><strong>${esc(code)}</strong><h3>${esc(c.title?.[lang()]||code)}</h3></div><button id="wf-clear-${key}-${esc(code.replace(/ /g,'-'))}" type="button" class="wfs-text-button" ${multi(key)?`data-wf-postpone="${esc(code)}"`:`data-wf-clear="${key}"`} data-wf-plan="${key}" aria-label="${esc(t(multi(key)?'postpone':'clear')+': '+code)}" ${multi(key)&&actual?'disabled':''}>${esc(t(multi(key)?'postpone':'clear'))}</button></div>${warning}<details data-wf-details="selected-${key}-${esc(code)}"><summary>${esc(t('why'))}</summary>${expression(c,others,v.graph)}<a href="${url(c.source)}" target="_blank" rel="noopener noreferrer">${esc(t('official'))} ↗</a></details></article>`;
    }
    function headline(d,key,v){
      if(v.protectedSelection&&!multi(key))return t('protected',{code:choices[key]});
      const label=courseLabel(d,choices[key]);
      const id=multi(key)?v.count?'multiHeadline':'multiNoChange':state.presentation[key]==='postpone'?v.count?'postponeHeadline':'noPostponeChange':v.count?'passHeadline':'noPassChange';
      return t(v.count===1?id+'One':id,{course:label,count:v.count});
    }
    function card(d,code,v,key,{other=false,detailed=false}={}){
      const c=v.graph.byCode.get(code),postponed=state.presentation[key]==='postpone'&&!multi(key),support=W.explanation(c,v.withPass,v.graph).support;
      let reason=other?`${esc(t('relatedDirect'))}: ${missing(c,v.withPass.completed,v.graph)}`:postponed?`${esc(t('postponeReason'))}: ${missing(c,v.withoutPass.completed,v.graph)}`:esc(t('passReason',{codes:support.join(', ')}));
      const direct=new Set(v.withPass.assumed.flatMap(code=>W.relationships(v.graph,code).direct));if(other&&!direct.has(code))reason=`${esc(t('indirectReason'))} ${reason}`;
      return `<article class="wfs-result-card" data-result-course="${esc(code)}"><div><strong class="course-code">${esc(code)}${c.ects!=null?` · ${esc(c.ects)} ${esc(t('credits'))}`:''}</strong><h3>${esc(c.title?.[lang()]||code)}</h3></div>${detailed?badge(status(v.active,code)):`<div class="wfs-result-reason">${reason}</div>`}<details data-wf-details="result-${key}-${esc(code)}"><summary>${esc(t('why'))}</summary><p>${esc(t('before'))}: ${badge(v.withoutPass.results[code].status)}</p><p>${esc(t('withPass'))}: ${badge(status(v.withPass,code))}</p>${expression(c,v.withPass.completed,v.graph)}${v.withPass.results[code].status==='missing'?`<p>${esc(t('stillNeeds'))}: ${missing(c,v.withPass.completed,v.graph)}</p>`:''}<a href="${url(c.source)}" target="_blank" rel="noopener noreferrer">${esc(t('official'))} ↗</a></details></article>`;
    }
    function results(d,key,v){
      if(!selected(key).length)return '';
      const extra=v.alternatives.length&&v.count===0?`<p class="wfs-result-context">${esc(t('alternatives',{codes:v.alternatives.join(', ')}))}</p>`:'';
      const removed=lastPostpone?.plan===key?`<p class="wfs-removed" role="status">${esc(t('postponed',{code:lastPostpone.code,plan:planName(key)}))} ${esc(t(lastPostpone.result.lost.length?'removedLoss':'removedNoLoss',{count:lastPostpone.result.lost.length}))}</p>`:'';
      return `<section class="wfs-results" aria-labelledby="wf-headline-${key}"><h2 id="wf-headline-${key}" data-unlocked-count="${v.protectedSelection&&!multi(key)?0:v.count}">${esc(headline(d,key,v))}</h2>${state.presentation[key]==='postpone'&&!multi(key)?`<p class="wfs-postpone-note">${esc(t('postponeHint'))}</p>`:''}${extra}${removed}<div class="wfs-result-list">${v.changed.map(code=>card(d,code,v,key)).join('')}</div>${v.otherBlocked.length?`<details data-wf-details="other-${key}" class="wfs-other"><summary>${esc(t('other'))}</summary>${v.otherBlocked.map(code=>card(d,code,v,key,{other:true})).join('')}</details>`:''}</section>`;
    }
    function plan(d,key){
      const v=view(d,key),codes=selected(key),actual=v.protectedSelection&&!multi(key);
      return `<section class="wfs-choice" id="wf-choice-${key}" aria-label="${esc(state.presentation.compare?planName(key):t('choose'))}">${state.presentation.compare?`<h2 class="wfs-plan-title">${esc(planName(key))}</h2>`:''}${picker(d,key)}${multi(key)?`<p class="wfs-multi-hint">${esc(t('multiHint'))}</p>`:`<div class="wfs-modes" role="group" aria-label="${esc(t('question'))}">${[['pass','passIt'],['postpone','postponeIt']].map(([mode,label])=>`<button type="button" id="wf-mode-${key}-${mode}" data-wf-mode="${mode}" data-wf-plan="${key}" aria-pressed="${state.presentation[key]===mode}" ${actual?'disabled':''}>${esc(t(label))}</button>`).join('')}</div>`}<div class="wfs-selected-list">${codes.map(code=>selectedCourse(d,key,code,v)).join('')}</div>${results(d,key,v)}${!codes.length?`<div class="wfs-empty"><p>${esc(t('empty'))}</p>${W.chooseExample(d,opts.getBaseline())?`<button type="button" class="wfs-example" id="wf-example-${key}" data-wf-example="${key}">${esc(t('example'))} →</button>`:`<p>${esc(t('noExample'))}</p>`}</div>`:''}${codes.length||multi(key)?`<button type="button" class="wfs-text-button wfs-add" id="wf-add-${key}" data-wf-add="${key}">+ ${esc(t(multi(key)?'addMore':'addAnother'))}</button>`:''}</section>`;
    }
    function graphView(d,comparison,code){
      const g=comparison.graph;if(!code)return '';
      const plan=graphPlan==='baseline'?W.scenario(d,opts.getBaseline(),[],g):comparison.a;
      return `<section class="planning-panel wf-explorer"><h2>${esc(t('paths'))} · ${esc(code)}</h2><div class="wf-graph-controls"><label>${esc(t('graphPlan'))}<select id="wf-graph-plan">${[['baseline','baseline'],['a','simpleColor']].map(([v,k])=>`<option value="${v}" ${graphPlan===v?'selected':''}>${esc(t(k))}</option>`).join('')}</select></label><label>${esc(t('graphDirection'))}<select id="wf-direction">${[['requirements','requirementsView'],['dependents','dependentsView']].map(([v,k])=>`<option value="${v}" ${direction===v?'selected':''}>${esc(t(k))}</option>`).join('')}</select></label></div>${root.CourseMap.render({dataset:d,course:code,plan,id:'wf-explorer-map',direction,lang:lang()})}</section>`;
    }
    function explorerCard(d,code,v,{blocked=false,connection=false}={}){
      const c=v.graph.byCode.get(code);if(!c)return '';
      const why=blocked?`${esc(t('contribution',{code:choices.x}))}: ${missing(c,v.withPass.completed,v.graph)}`:connection?'':esc(t('passReason',{codes:choices.x}));
      return `<article class="wfs-result-card" data-result-course="${esc(code)}"><strong class="course-code">${esc(code)}${c.ects!=null?` · ${esc(c.ects)} ${esc(t('credits'))}`:''}</strong><h3>${esc(c.title?.[lang()]||code)}</h3>${why?`<p class="wfs-result-reason">${why}</p>`:''}<details data-wf-details="explorer-${esc(code)}"><summary>${esc(t('why'))}</summary>${expression(c,v.withPass.completed,v.graph)}<a href="${url(c.source)}" target="_blank" rel="noopener noreferrer">${esc(t('official'))} ↗</a></details></article>`;
    }
    function explorerResults(d,v){
      if(!choices.x)return '';
      const headline=v.protectedSelection?t('protected',{code:choices.x}):v.count?t(v.count===1?'passHeadlineOne':'passHeadline',{course:courseLabel(d,choices.x),count:v.count}):t('noPassChange');
      return `<section class="wfs-results" aria-labelledby="wf-explorer-headline"><h2 id="wf-explorer-headline" data-unlocked-count="${v.count}">${esc(headline)}</h2>${!v.protectedSelection&&v.alternatives.length&&!v.count?`<p class="wfs-result-context">${esc(t('alternatives',{codes:v.alternatives.join(', ')}))}</p>`:''}<div class="wfs-result-list">${v.changed.map(code=>explorerCard(d,code,v)).join('')}</div>${!v.protectedSelection&&v.directBlocked.length?`<details class="wfs-other" data-wf-details="direct"><summary>${esc(t('other'))}</summary>${v.directBlocked.map(code=>explorerCard(d,code,v,{blocked:true})).join('')}</details>`:''}${v.protectedSelection&&v.connections.length?`<details class="wfs-other" data-wf-details="completed-connections"><summary>${esc(t('completedConnections'))}</summary>${v.connections.map(code=>explorerCard(d,code,v,{connection:true})).join('')}</details>`:''}${v.longer.length?`<details class="wfs-other" data-wf-details="longer"><summary>${esc(t('longer'))}</summary><p class="wf-muted">${esc(t('longerHint'))}</p>${v.longer.map(code=>explorerCard(d,code,v,{connection:true})).join('')}</details>`:''}</section>`;
    }
    function advanced(d){
      // No A/B evaluation or full interface until the disclosure is requested.
      if(!advancedOpen)return '';
      const A=view(d,'a'),B=view(d,'b'),comparison=W.compare(d,opts.getBaseline(),A.active.assumed,B.active.assumed);
      const difference=state.presentation.compare&&selected('b').length?`<section class="wfs-difference"><h2>${esc(t('compareTitle'))}</h2>${comparison.onlyA.length||comparison.onlyB.length?`<details data-wf-details="only-a"><summary>${esc(t('onlyA'))}</summary>${courseLinks(d,comparison.onlyA)}</details><details data-wf-details="only-b"><summary>${esc(t('onlyB'))}</summary>${courseLinks(d,comparison.onlyB)}</details>`:`<p>${esc(t('samePlans'))}</p>`}</section>`:'';
      return `<p class="wf-muted">${esc(t('advancedIntro'))}</p>${plan(d,'a')}${state.presentation.compare?plan(d,'b'):`<button type="button" id="wf-compare" class="wfs-text-button" data-wf-compare>+ ${esc(t('compareAnother'))}</button>`}${difference}<button id="wf-reset" type="button" class="planning-reset" data-wf-reset>${esc(t('reset'))}</button>`;
    }
    function render(){
      const d=sync();
      if(!d)return `<div class="planning-page wf-page wf-simple">${opts.header(t('question'),t('intro'))}<p>${esc(t(opts.isLoaded()?'unavailable':'loading'))}</p><a href="#/uygunluk">${esc(t('edit'))}</a>${storageFailed?`<p role="status">${esc(t('storage'))}</p>`:''}</div>`;
      const actual=opts.getBaseline(),fingerprint=JSON.stringify([...actual].sort());if(lastBaselineKey&&lastBaselineKey!==fingerprint){lastPostpone=null;message={key:'updated'};}lastBaselineKey=fingerprint;
      const v=W.explorer(d,actual,choices.x),current=actual.filter(code=>d.courses.some(c=>c.code===code)).length,legacy=actual.filter(code=>(d.priorCourses||[]).some(c=>c.code===code)).length;
      const issue=v.withPass.issues.find(x=>x.code===choices.x),c=v.graph.byCode.get(choices.x),savedComparison=state.a.length||state.b.length;
      return `<div class="planning-page wf-page wf-simple">${opts.header(t('question'),t('intro'))}<p class="wfs-completed">${esc(t(current===1?'usingOne':'using',{count:current}))} · <a href="#/uygunluk">${esc(t('edit'))}</a></p>${legacy?`<p class="wfs-legacy">${esc(t(legacy===1?'legacyOne':'legacy',{count:legacy}))}</p>`:''}<p class="wfs-curriculum">${esc(d.program[lang()])} · ${esc(d.version)}</p>${actual.length===0?`<p class="wfs-none-completed">${esc(t('noCompleted'))} <a href="#/uygunluk">${esc(t('setCompleted'))} →</a></p>`:''}<section class="wfs-choice" aria-label="${esc(t('choose'))}">${picker(d,'x')}${choices.x?`<button id="wf-clear-x" class="wfs-text-button wfs-clear" type="button" data-wf-clear="x">${esc(t('clearShort'))}</button>${issue?`<p class="wfs-course-warning">${esc(t(issue.kind==='unknown'?'unknownSelected':'conditional'))}</p>`:''}<details class="wfs-selected-why" data-wf-details="selected-x"><summary>${esc(t('why'))}</summary>${expression(c,v.withoutPass.completed,v.graph)}<a href="${url(c.source)}" target="_blank" rel="noopener noreferrer">${esc(t('official'))} ↗</a></details>`:`<div class="wfs-empty"><p>${esc(t('empty'))}</p>${W.chooseExample(d,actual)?`<button type="button" class="wfs-example" id="wf-example-x" data-wf-example="x">${esc(t('example'))} →</button>`:`<p>${esc(t('noExample'))}</p>`}</div>`}${explorerResults(d,v)}</section>${choices.x?`<section class="wfs-paths"><button type="button" id="wf-path-toggle" class="wfs-disclosure" data-wf-paths aria-expanded="${pathsOpen}" aria-controls="wf-path-content">${esc(t('pathsButton'))}<span aria-hidden="true">${pathsOpen?'−':'+'}</span></button><div id="wf-path-content" ${pathsOpen?'':'hidden'}>${pathsOpen?graphView(d,{graph:v.graph,a:v.withPass},choices.x):''}</div></section>`:''}<section class="wfs-advanced"><button type="button" id="wf-advanced-toggle" class="wfs-disclosure" data-wf-advanced aria-expanded="${advancedOpen}" aria-controls="wf-advanced-content">${esc(t('advanced'))}<span aria-hidden="true">${advancedOpen?'−':'+'}</span></button>${savedComparison&&!advancedOpen?`<p class="wfs-saved-comparison">${esc(t('savedComparison'))}</p>`:''}<div id="wf-advanced-content" ${advancedOpen?'':'hidden'}>${advanced(d)}</div></section><p class="wfs-scope">${esc(t('scope'))}</p><details data-wf-details="how" class="wfs-how"><summary>${esc(t('how'))}</summary><p>${esc(t('howBody'))}</p><p>${esc(t('multipleLimit'))}</p><p>${esc(t('coreqLimit'))}</p><p>${esc(t('coverage'))}</p>${v.graph.cycles.length?`<p>${esc(t('cycles',{codes:v.graph.cycles.map(c=>c.join(' → ')).join('; ')}))}</p>`:''}${v.graph.unknown.length?`<p>${esc(t('unknownData',{codes:v.graph.unknown.join(', ')}))}</p>`:''}<p>${esc(t('simpleSaved'))} ${esc(t('resetHint'))}</p></details>${storageFailed?`<p role="status" class="planning-storage-error">${esc(t('storage'))}</p>`:''}<p id="wf-feedback" class="sr-only" role="status" aria-live="polite">${esc(message?t(message.key,message.args):'')}</p></div>`;
    }
    function refresh(focusId){
      const main=document.getElementById('main-area'),scroll=main.scrollTop,open=new Map([...main.querySelectorAll('details[data-wf-details]')].map(el=>[el.dataset.wfDetails,el.open]));
      opts.refresh();main.scrollTop=scroll;
      for(const el of main.querySelectorAll('details[data-wf-details]'))if(open.has(el.dataset.wfDetails))el.open=open.get(el.dataset.wfDetails);
      if(focusId){restoringFocus=true;try{document.getElementById(focusId)?.focus({preventScroll:true});}finally{restoringFocus=false;}}
    }
    function announce(d,key){const v=view(d,key);message={key:state.presentation[key]==='postpone'&&!multi(key)?'updated':v.count?'announcement':'updated',args:{count:v.count}};}
    function remove(d,key,code){
      if(opts.getBaseline().includes(code)){message={key:'protected',args:{code}};refresh();return;}
      const result=W.postpone(d,opts.getBaseline(),state[key],code);state[key]=result.next;lastPostpone={plan:key,code,result};choices[key]=state[key][0]||'';
      if(state.target===code)state.target=choices[key]||choices.a||choices.b||'';save();announce(d,key);refresh(`wf-search-${key}`);
    }
    function select(d,key,code){
      if(!d.courses.some(c=>c.code===code)||opts.getBaseline().includes(code))return;
      if(key==='x'){setExplorer(d,code);refresh('wf-search-x');return;}
      if(!advancedOpen)return;
      setChoice(d,key,code);announce(d,key);refresh(`wf-search-${key}`);
    }
    // Keep the combobox focused while choosing an option (including browsers that blur on click).
    document.addEventListener('pointerdown',event=>{if(opts.isOpen()&&event.target.closest('[data-wf-choose]'))event.preventDefault();});
    document.addEventListener('focusin',event=>{const key=event.target.dataset?.wfSearch;if(['a','b','x'].includes(key)&&opts.isOpen()&&!restoringFocus){for(const other of ['a','b','x'])if(other!==key&&popup[other]){popup[other]=false;updatePicker(other);}popup[key]=true;if(key==='x'){queries.x='';event.target.select?.();}updatePicker(key);}});
    document.addEventListener('focusout',event=>{
      const key=event.target.dataset?.wfSearch;if(!['a','b','x'].includes(key)||!opts.isOpen())return;
      const picker=event.target.closest('.wfs-picker');if(picker?.contains(event.relatedTarget))return;
      popup[key]=false;active[key]=-1;updatePicker(key);
    });
    document.addEventListener('input',event=>{const key=event.target.dataset?.wfSearch;if(['a','b','x'].includes(key)&&opts.isOpen()){queries[key]=event.target.value;popup[key]=true;active[key]=-1;updatePicker(key);}});
    document.addEventListener('keydown',event=>{
      const key=event.target.dataset?.wfSearch;if(!['a','b','x'].includes(key)||!opts.isOpen())return;
      const d=sync();if(!d)return;const candidates=matches(d,key).filter(c=>!opts.getBaseline().includes(c.code));
      if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();popup[key]=true;active[key]=candidates.length?(event.key==='ArrowDown'?(active[key]+1)%candidates.length:active[key]<0?candidates.length-1:(active[key]-1+candidates.length)%candidates.length):-1;updatePicker(key);}
      if(event.key==='Escape'){event.preventDefault();popup[key]=false;active[key]=-1;updatePicker(key);}
      if(event.key==='Enter'&&popup[key]){event.preventDefault();const code=candidates[active[key]<0?0:active[key]]?.code;if(code)select(d,key,code);}
    });
    document.addEventListener('change',event=>{
      const d=sync(),el=event.target;if(!d||!opts.isOpen())return;
      if(el.id==='wf-graph-plan'&&['baseline','a'].includes(el.value)){graphPlan=el.value;refresh(el.id);}
      if(el.id==='wf-direction'&&['requirements','dependents'].includes(el.value)){direction=el.value;refresh(el.id);}
    });
    document.addEventListener('click',event=>{
      const target=event.target,focusEl=target.closest('[data-wf-focus],[data-what-if-code]');
      if(focusEl){event.preventDefault();focus(focusEl.dataset.wfFocus||focusEl.dataset.whatIfCode);return;}
      if(target.closest('[data-wf-advanced]')&&opts.isOpen()){advancedOpen=!advancedOpen;popup.x=false;refresh('wf-advanced-toggle');return;}
      if(target.closest('[data-wf-clear]')?.dataset.wfClear==='x'){
        const d=sync();if(!d)return;choices.x='';queries.x='';popup.x=false;pathsOpen=false;explorerState=W.cleanExplorer(null,d);
        try{localStorage.removeItem(W.explorerKey);}catch{storageFailed=true;}message={key:'updated'};refresh('wf-search-x');return;
      }
      if(target.closest('[data-wf-reset]')){reset();return;}
      if(!opts.isOpen())return;const d=sync();if(!d)return;
      const choose=target.closest('[data-wf-choose]');if(choose&&['a','b','x'].includes(choose.dataset.wfPlan)){select(d,choose.dataset.wfPlan,choose.dataset.wfChoose);return;}
      const mode=target.closest('[data-wf-mode]');if(mode&&['a','b'].includes(mode.dataset.wfPlan)&&['pass','postpone'].includes(mode.dataset.wfMode)){
        const key=mode.dataset.wfPlan;if(opts.getBaseline().includes(choices[key])){message={key:'protected',args:{code:choices[key]}};refresh();return;}
        state.presentation[key]=mode.dataset.wfMode;save();announce(d,key);refresh(`wf-mode-${key}-${mode.dataset.wfMode}`);return;
      }
      const clear=target.closest('[data-wf-clear]');if(clear&&['a','b'].includes(clear.dataset.wfClear)){const key=clear.dataset.wfClear,previous=choices[key];state[key]=[];choices[key]='';queries[key]='';popup[key]=false;lastPostpone=null;if(state.target===previous)state.target=choices.a||choices.b||state.a[0]||state.b[0]||'';save();message={key:'updated'};refresh(`wf-search-${key}`);return;}
      const add=target.closest('[data-wf-add]');if(add&&['a','b'].includes(add.dataset.wfAdd)){const key=add.dataset.wfAdd;state[key]=selected(key);state.presentation[key==='a'?'multiA':'multiB']=true;state.presentation[key]='pass';queries[key]='';popup[key]=true;save();refresh(`wf-search-${key}`);return;}
      const compare=target.closest('[data-wf-compare]');if(compare){state.presentation.compare=true;save();refresh('wf-search-b');return;}
      const example=target.closest('[data-wf-example]');if(example&&['a','b','x'].includes(example.dataset.wfExample)){const code=W.chooseExample(d,opts.getBaseline());if(code)select(d,example.dataset.wfExample,code);return;}
      const postponed=target.closest('[data-wf-postpone]');if(postponed&&['a','b'].includes(postponed.dataset.wfPlan)&&d.courses.some(c=>c.code===postponed.dataset.wfPostpone)){remove(d,postponed.dataset.wfPlan,postponed.dataset.wfPostpone);return;}
      if(target.closest('[data-wf-paths]')){pathsOpen=!pathsOpen;popup.x=false;refresh('wf-path-toggle');return;}
      if(!target.closest('.wfs-picker'))for(const key of ['a','b','x'])if(popup[key]){popup[key]=false;updatePicker(key);}
    });
    function reload(){loadedDataset='';lastPostpone=null;if(opts.isOpen())opts.refresh();}
    return {render,focus,reset,reload};
  }
  root.WhatIfUI={create,TEXT};
})(typeof globalThis!=='undefined'?globalThis:this);
