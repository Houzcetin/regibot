(() => {
  const TEXT = {
    tr: {
      brandTitle: 'Yaşar Asistan', sidebar: 'Ana menü', themeToDark: 'Koyu temaya geç', themeToLight: 'Açık temaya geç', hamburger: 'Menüyü aç', menuSearch: 'Menüde Ara...', general: 'Genel', assistantNav: 'Asistan', calendarNav: 'Akademik Takvim', guideNav: 'Ders Kayıt Rehberi', registrationNav: 'Ders Kayıt', addDropNav: 'Ekle/Bırak', withdrawalNav: 'Dersten Çekilme', loadNav: 'Ders Yükü / AKTS', regulationNav: 'Yönetmelik', handbookNav: 'Öğrenci El Kitabı', sourcesNav: 'Kaynaklar', contactNav: 'İletişim', demoMode: 'Demo Modu', footer: "Bu Yaşar Üniversitesi'nin resmi sistemi değildir; resmi kaynaklara dayanan bir öğrenci projesidir.",
      home: 'Ana sayfa', announcement: 'Akademik takvim', localDemo: 'Yerel demo', loading: 'Yükleniyor…', heroBadge: 'AI destekli', heroTitle: 'Yaşar Öğrenci Asistanı', heroDescription: 'Ders kaydı, ekle/bırak, yönetmelik ve akademik takvim hakkında sorularını sor.', heroPlaceholder: 'Bir soru sor… örn. Ekle/bırak ne zaman bitiyor?', heroNote: 'Yanıtlar resmi kaynaklara dayanır; kararlarını danışmanınla doğrula.', askRegistration: 'Ders kaydı nasıl yapılır?', askLoad: 'Bir dönemde kaç AKTS alabilirim?', askAddDrop: 'Ekle/bırak ne zaman bitiyor?', askWithdrawal: 'Dersten nasıl çekilirim?', askCalendar: 'Akademik takvimde önemli tarihler neler?', askRepeat: 'Ders tekrarı kuralları nelerdir?', askAdvisor: 'Danışman onayı nasıl alınır?', askLate: 'Ders kaydımı geç yapabilir miyim?', askProbation: 'Sınamalı öğrenci kaç AKTS alabilir?', askUpperYear: 'Üst sınıftan ders alabilir miyim?', askFinals: 'Final sınavları ne zaman?', askTranscript: 'Dersten çekilme not dökümümü nasıl etkiler?', askInternship: 'Staj dersi AKTS limitine dahil mi?', askContact: 'Öğrenci İşleri ile nasıl iletişime geçerim?', moreQuestions: 'Diğer sorular', fewerQuestions: 'Daha az göster', newChat: 'Yeni sohbet', deadlinePrefix: 'Sıradaki tarih', typing: 'yazıyor…', questionLabel: 'Mesajınız', send: 'Gönder', charCount: n => `${n} / 500`,
      information: 'Bilgilendirme', close: 'Bildirimi kapat', upcoming: 'Yaklaşan tarih', datesTitle: 'Akademik takvimden önemli tarihler', knowledge: 'Bilgi tabanı', courseRegistration: 'Ders Kayıt', addDrop: 'Ekle-Bırak', withdrawal: 'Dersten Çekilme', lastClass: 'Son Ders Günü', finals: 'Final Sınavları', sourcesCount: 'belge', chunksCount: 'parça', apiReady: 'hazır', apiMissing: 'eksik', noUpcoming: 'Yaklaşan tarih bulunamadı.',
      calendarTitle: 'Akademik Takvim', calendarDescription: '2026–2027 ön lisans ve lisans akademik takvimindeki tarihler.', fall: 'Güz', spring: 'Bahar', summer: 'Yaz', holidays: 'Resmi tatiller', past: 'Tamamlandı', ongoing: 'Devam ediyor', next: 'Sıradaki', calendarPdf: 'Resmi akademik takvim PDF dosyasını aç', date: 'Tarih', event: 'Etkinlik', status: 'Durum',
      chatTitle: 'Ders kayıt asistanı', chatDescription: 'Sorularınızı resmi üniversite kaynaklarına dayanarak yanıtlarım.', welcome: 'Merhaba! Ders kayıt kuralları, AKTS yükü, danışman onayı ve akademik takvim hakkında resmi kaynaklardan yanıt arayabilirim. Kişisel durumunuza bağlı konuları danışmanınızla doğrulayın.', questionLabel: 'Mesajınız', placeholder: 'Ders kaydıyla ilgili sorunuzu yazın…', send: 'Gönder', typing: 'yazıyor…', quickQuestions: 'Örnek sorular', charCount: n => `${n} / 500`, lowConfidence: 'Bu yanıt için kaynak eşleşmesi sınırlı olabilir. Resmi kaynakları ve danışmanınızı kontrol edin.', errorFallback: 'Bir sorun oluştu. Lütfen tekrar deneyin.',
      guidesTitle: 'Ders Kayıt Rehberi', guides: {
        '/rehber/ders-kayit': { title: 'Ders Kayıt', intro: 'Ders seçimi, kayıt yenileme ve kayıt sırasında karşılaşabileceğiniz konular için üniversitenin yayımladığı kaynaklara göz atın.', questions: ['Ders kaydımı nasıl tamamlarım?', 'Ders kaydımı geç yapabilir miyim?', 'Seçmek istediğim dersi bulamıyorum, ne yapmalıyım?', 'Ders kaydında danışmanımın rolü nedir?'] },
        '/rehber/ekle-birak': { title: 'Ekle/Bırak', intro: 'Ekleme-bırakma dönemi ve ders değişiklikleriyle ilgili sorularınızı resmi kaynaklar üzerinden inceleyin.', questions: ['Ekle-bırak ne zaman?', 'Ekle-bırak döneminde dersimi değiştirebilir miyim?', 'Ekle-bırak işlemi için danışman onayı gerekir mi?', 'Ders kaydımı ekle-bırak döneminde tamamlayabilir miyim?'] },
        '/rehber/cekilme': { title: 'Dersten Çekilme', intro: 'Dersten çekilme tarihleri ve işlemleri akademik takvimde ve Öğrenci İşleri kaynaklarında açıklanır.', questions: ['Dersten nasıl çekilirim?', 'Dersten çekilme için son tarih nedir?', 'Dersten çekilme not dökümümü nasıl etkiler?'] },
        '/rehber/ders-yuku': { title: 'Ders Yükü / AKTS', intro: 'Dönemlik ders yükü; öğrencinin başarı durumu, sınıfı ve bazı durumlarda danışman değerlendirmesine göre değişebilir. Ayrıntıları yönetmelik ve Öğrenci İşleri kaynaklarından kontrol edin.', questions: ['Bir dönemde kaç AKTS alabilirim?', 'Sınamalı öğrenci kaç AKTS alabilir?', 'Üst sınıftan ders alabilir miyim?', 'Staj dersi AKTS limitine dahil mi?'] }
      },
      regulationTitle: 'Yönetmelik', handbookTitle: 'Öğrenci El Kitabı', sourcesTitle: 'Kaynaklar', sourcesDescription: 'Yanıtlar, aşağıdaki resmi ve kurumsal kaynaklardan seçilen metin parçalarına dayanır.', conflictNote: 'Kaynaklar arasında farklılık varsa yönetmelik en yüksek önceliğe sahiptir; ardından resmi üniversite sayfaları ve öğrenci el kitabı gelir.', openOfficial: 'Resmi kaynağı aç', chunks: 'parça', language: 'Dil', authority: 'Öncelik', regulationAuthority: 'Yönetmelik (en yüksek öncelik)', officialAuthority: 'Resmi sayfa', handbookAuthority: 'El kitabı (en düşük öncelik)', turkish: 'Türkçe', english: 'İngilizce',
      contactTitle: 'İletişim', contactDescription: 'Sorunuzun resmi kaynaklarda yanıtı yoksa ilgili birimle iletişime geçebilirsiniz.', studentAffairs: 'Öğrenci İşleri Müdürlüğü', computerEngineering: 'Bilgisayar Mühendisliği Bölümü', phone: 'Telefon', email: 'E-posta', website: 'Web sitesi', supportPortal: 'Destek portalı',
      startsIn: n => `${n} gün sonra başlıyor`, tomorrow: 'Yarın başlıyor', startsToday: 'Bugün başlıyor', ongoingDays: n => `Devam ediyor – ${n} gün kaldı`, endsToday: 'Bugün bitiyor', dateRange: 'Tarih aralığı', semester: 'Dönem', noSource: 'Kaynak bilgisi yüklenemedi.'
    },
    en: {
      brandTitle: 'Yaşar Assistant', sidebar: 'Main menu', themeToDark: 'Switch to dark theme', themeToLight: 'Switch to light theme', hamburger: 'Open menu', menuSearch: 'Search menu…', general: 'General', assistantNav: 'Assistant', calendarNav: 'Academic Calendar', guideNav: 'Course Registration Guide', registrationNav: 'Course Registration', addDropNav: 'Add/Drop', withdrawalNav: 'Course Withdrawal', loadNav: 'Course Load / ECTS', regulationNav: 'Regulation', handbookNav: 'Student Handbook', sourcesNav: 'Sources', contactNav: 'Contact', demoMode: 'Demo Mode', footer: 'This is not an official Yaşar University system; it is a student project based on official sources.',
      home: 'Home', announcement: 'Academic calendar', localDemo: 'Local demo', loading: 'Loading…', heroBadge: 'AI-powered', heroTitle: 'Yaşar Student Assistant', heroDescription: 'Ask about course registration, add/drop, regulations and the academic calendar.', heroPlaceholder: 'Ask a question… e.g. When does add/drop end?', heroNote: 'Answers are based on official sources; confirm decisions with your advisor.', askRegistration: 'How do I register for courses?', askLoad: 'How many ECTS can I take in a semester?', askAddDrop: 'When does add/drop end?', askWithdrawal: 'How do I withdraw from a course?', askCalendar: 'What are the key dates in the academic calendar?', askRepeat: 'What are the course repeat rules?', askAdvisor: 'How do I get advisor approval?', askLate: 'Can I register late?', askProbation: 'How many ECTS can a probation student take?', askUpperYear: 'Can I take courses from a higher year?', askFinals: 'When are the final exams?', askTranscript: 'How does course withdrawal affect my transcript?', askInternship: 'Does an internship count toward the ECTS limit?', askContact: 'How can I contact Student Affairs?', moreQuestions: 'More questions', fewerQuestions: 'Show fewer', newChat: 'New chat', deadlinePrefix: 'Next deadline', typing: 'typing…', questionLabel: 'Your message', send: 'Send', charCount: n => `${n} / 500`,
      information: 'Notice', close: 'Dismiss notice', upcoming: 'Upcoming date', datesTitle: 'Key dates from the academic calendar', knowledge: 'Knowledge base', courseRegistration: 'Course Registration', addDrop: 'Add/Drop', withdrawal: 'Course Withdrawal', lastClass: 'Last Day of Classes', finals: 'Final Exams', sourcesCount: 'sources', chunksCount: 'chunks', apiReady: 'ready', apiMissing: 'not set', noUpcoming: 'No upcoming date found.',
      calendarTitle: 'Academic Calendar', calendarDescription: 'Dates from the 2026–2027 associate and undergraduate academic calendar.', fall: 'Fall', spring: 'Spring', summer: 'Summer', holidays: 'Public holidays', past: 'Past', ongoing: 'Ongoing', next: 'Next', calendarPdf: 'Open the official academic calendar PDF', date: 'Date', event: 'Event', status: 'Status',
      chatTitle: 'Course registration assistant', chatDescription: 'Answers are based on official university sources.', welcome: 'Hello! I can look up official sources for course registration rules, ECTS load, advisor approval, and the academic calendar. Please confirm questions that depend on your circumstances with your advisor.', questionLabel: 'Your message', placeholder: 'Ask a course registration question…', send: 'Send', typing: 'typing…', quickQuestions: 'Example questions', charCount: n => `${n} / 500`, lowConfidence: 'The source match for this answer may be limited. Check official sources and your advisor.', errorFallback: 'Something went wrong. Please try again.',
      guidesTitle: 'Course Registration Guide', guides: {
        '/rehber/ders-kayit': { title: 'Course Registration', intro: 'Review university sources for course selection, registration renewal, and common registration questions.', questions: ['How do I complete course registration?', 'Can I register late?', 'I cannot find the course I want to select. What should I do?', 'What is my advisor’s role in course registration?'] },
        '/rehber/ekle-birak': { title: 'Add/Drop', intro: 'Use official sources to check add/drop dates and information about changing course selections.', questions: ['When is add/drop?', 'Can I change a course during add/drop?', 'Do I need advisor approval during add/drop?', 'Can I complete registration during add/drop?'] },
        '/rehber/cekilme': { title: 'Course Withdrawal', intro: 'Withdrawal dates and procedures are described in the academic calendar and Student Affairs sources.', questions: ['How do I withdraw from a course?', 'What is the withdrawal deadline?', 'How does course withdrawal affect my transcript?'] },
        '/rehber/ders-yuku': { title: 'Course Load / ECTS', intro: 'Semester course load may depend on academic standing, year, and sometimes advisor review. Check the regulation and Student Affairs sources for details.', questions: ['How many ECTS can I take in a semester?', 'How many ECTS can a probation student take?', 'Can I take courses from a higher semester?', 'Does an internship count toward the ECTS limit?'] }
      },
      regulationTitle: 'Regulation', handbookTitle: 'Student Handbook', sourcesTitle: 'Sources', sourcesDescription: 'Answers draw on passages from the official and institutional sources listed here.', conflictNote: 'When sources differ, the regulation has the highest priority, followed by official university pages and then the student handbook.', openOfficial: 'Open official source', chunks: 'chunks', language: 'Language', authority: 'Authority', regulationAuthority: 'Regulation (highest priority)', officialAuthority: 'Official page', handbookAuthority: 'Handbook (lowest priority)', turkish: 'Turkish', english: 'English',
      contactTitle: 'Contact', contactDescription: 'If official sources do not answer your question, contact the relevant office.', studentAffairs: 'Student Affairs Office', computerEngineering: 'Computer Engineering Department', phone: 'Phone', email: 'Email', website: 'Website', supportPortal: 'Support portal',
      startsIn: n => `Starts in ${n} days`, tomorrow: 'Starts tomorrow', startsToday: 'Starts today', ongoingDays: n => `Ongoing – ${n} days left`, endsToday: 'Ends today', dateRange: 'Date range', semester: 'Semester', noSource: 'Source information could not be loaded.'
    }
  };

  const P=window.Planning;
  const PL={
    en:{selectionHint:'Mark the courses you have already completed. The checker uses only these selections.',eligibilityNav:'Course Eligibility',checklistNav:'Registration Checklist',resetPlanning:'Reset my planning data',program:'Program',curriculum:'Curriculum version',completed:'Already completed',met:'Prerequisites met',missing:'Missing prerequisites',unknown:'Cannot verify',unknownField:'Unverified',requirements:'Prerequisites',corequisites:'Corequisites',none:'None (verified)',and:' AND ',or:' OR ',missingLabel:'Unsatisfied prerequisite requirements (OR alternatives shown above): ',coLabel:'Corequisites still needed (completion or concurrent enrolment must be confirmed): ',metExplanation:'All verified prerequisite and corequisite requirements are satisfied by your completed courses.',completedExplanation:'You marked this course as completed.',unknownExplanation:'Official prerequisite/corequisite rules, title and ECTS have not been verified. No eligibility decision can be made from semester order or course names.',disclaimer:'Meeting prerequisites does not confirm course availability, quota, timetable compatibility, or advisor approval.',localNote:'Only your course selections and checklist progress are saved on this browser. No login or transcript upload is needed. These are your own planning notes, not confirmation of registration or advisor approval.',saveFailed:'Browser storage is unavailable. Changes may not persist; reset could not remove any inaccessible saved data.',dataUnavailable:'Curriculum data could not be loaded or validated. Try again later or consult the official chart.',actual:'Actual date (Europe/Istanbul)',demo:'Configured demo date — used for event status',upcomingState:'Upcoming',ongoingState:'Ongoing',pastState:'Past',calendarAction:'Add to calendar',eligibilityAction:'Check course prerequisites',checklistAction:'Open registration checklist',loadAction:'Open course-load guide',calendarLink:'View academic calendar',contactAction:'Official contact information',emailAction:'Draft an email',draftTitle:'Editable email draft',recipient:'Recipient — enter your advisor or department address',subject:'Subject',body:'Message',openEmail:'Open in email app',closeDraft:'Close draft',draftNotice:'For quota requests, contact your department; for approval, contact your assigned advisor via OBS. Verify the recipient using official contact information. Nothing is sent automatically. Drafts are not saved.',progress:'Steps marked complete',checklistIntro:'Review each step and mark it yourself after you have checked it. Check current announcements for class-specific registration windows.',deadlines:'Registration-related deadlines',source:'Official source',emptyCalendar:'Calendar data unavailable. Check the official academic calendar.',ects:'ECTS'},
    tr:{selectionHint:'Önceden tamamladığınız dersleri işaretleyin. Kontrol yalnızca bu seçimleri kullanır.',eligibilityNav:'Ders Uygunluğu',checklistNav:'Ders Kayıt Kontrol Listesi',resetPlanning:'Planlama verilerimi sıfırla',program:'Program',curriculum:'Müfredat sürümü',completed:'Zaten tamamlandı',met:'Ön koşullar sağlandı',missing:'Eksik ön koşullar',unknown:'Doğrulanamıyor',unknownField:'Doğrulanmamış',requirements:'Ön koşullar',corequisites:'Eş koşullar',none:'Yok (doğrulanmış)',and:' VE ',or:' VEYA ',missingLabel:'Sağlanmayan ön koşullar (VEYA seçenekleri yukarıda gösterilir): ',coLabel:'Gereken eş koşullar (tamamlama veya eş zamanlı kayıt doğrulanmalı): ',metExplanation:'Doğrulanmış ön koşullar ve eş koşullar tamamladığınız derslerle sağlanıyor.',completedExplanation:'Bu dersi tamamlandı olarak işaretlediniz.',unknownExplanation:'Resmi ön koşul/eş koşul kuralları, ders adı ve AKTS doğrulanmadı. Dönem sırası veya ders adından uygunluk kararı verilemez.',disclaimer:'Ön koşulların sağlanması dersin açılacağını, kontenjanı, program uyumunu veya danışman onayını doğrulamaz.',localNote:'Yalnızca ders seçimleriniz ve kontrol listesi ilerlemeniz bu tarayıcıda saklanır. Giriş veya transkript yükleme gerekmez. Bunlar kişisel planlama notlarıdır; kayıt veya danışman onayını doğrulamaz.',saveFailed:'Tarayıcı depolaması kullanılamıyor. Değişiklikler saklanmayabilir; sıfırlama erişilemeyen kayıtları silemedi.',dataUnavailable:'Müfredat verileri yüklenemedi veya doğrulanamadı. Daha sonra deneyin ya da resmi şemaya bakın.',actual:'Gerçek tarih (Europe/Istanbul)',demo:'Yapılandırılmış demo tarihi — etkinlik durumları için kullanılır',upcomingState:'Yaklaşan',ongoingState:'Devam ediyor',pastState:'Geçmiş',calendarAction:'Takvime ekle',eligibilityAction:'Ders ön koşullarını kontrol et',checklistAction:'Kayıt kontrol listesini aç',loadAction:'Ders yükü rehberini aç',calendarLink:'Akademik takvimi görüntüle',contactAction:'Resmi iletişim bilgileri',emailAction:'E-posta taslağı hazırla',draftTitle:'Düzenlenebilir e-posta taslağı',recipient:'Alıcı — danışmanınızın veya bölümün adresini girin',subject:'Konu',body:'Mesaj',openEmail:'E-posta uygulamasında aç',closeDraft:'Taslağı kapat',draftNotice:'Kontenjan için bölümünüzle; onay için OBS üzerinden atanmış danışmanınızla iletişime geçin. Alıcıyı resmi iletişim bilgilerinden doğrulayın. Otomatik gönderim yapılmaz. Taslaklar saklanmaz.',progress:'Tamamlandı işaretlenen adımlar',checklistIntro:'Her adımı kontrol ettikten sonra kendiniz işaretleyin. Sınıfınıza özel kayıt aralıkları için güncel duyuruları inceleyin.',deadlines:'Ders kaydıyla ilgili tarihler',source:'Resmi kaynak',emptyCalendar:'Takvim verileri kullanılamıyor. Resmi akademik takvimi kontrol edin.',ects:'AKTS'}
  };
  for(const l of ['tr','en'])Object.assign(TEXT[l],PL[l]);
  let datasets=[],planningState=P.cleanState(null,[]),planningLoaded=false,storageFailed=false;
  const stepDetails={
    curriculum:{link:'/uygunluk',en:['Review curriculum and prerequisites','Confirm your assigned curriculum version in OBS. Review the official chart and check prerequisite and corequisite requirements. Unverified rules need confirmation from your department.'],tr:['Müfredatı ve ön koşulları inceleyin','OBS üzerinden size atanmış müfredat sürümünü doğrulayın. Resmi şemayı ve ön koşul/eş koşulları inceleyin. Doğrulanmamış kuralları bölümünüzle teyit edin.']},
    select:{link:'/rehber/ders-kayit',en:['Select courses','Review required and elective courses in OBS, including courses you must repeat. Check availability, quota and any financial obligations before finalizing.'],tr:['Dersleri seçin','OBS üzerinde zorunlu, seçmeli ve tekrar almanız gereken dersleri inceleyin. Kesinleştirmeden önce dersin açılmasını, kontenjanı ve mali yükümlülükleri kontrol edin.']},
    conflicts:{link:'/rehber/ders-kayit',en:['Check timetable conflicts manually','Compare the day, start/end time and section of every lecture, lab and tutorial in OBS. Flag overlapping times and ask your advisor about applicable repeat-course exceptions.'],tr:['Program çakışmalarını elle kontrol edin','OBS üzerinde her dersin, laboratuvarın ve uygulamanın gününü, başlangıç/bitiş saatini ve şubesini karşılaştırın. Çakışmaları belirleyip tekrar derslerine ilişkin istisnaları danışmanınıza sorun.']},
    load:{link:'/rehber/ders-yuku',en:['Review ECTS rules','Add up the selected ECTS and review the regulation for your academic standing, year and transfer status. Ask your advisor about your applicable limit and exceptions.'],tr:['AKTS kurallarını inceleyin','Seçilen AKTS toplamını hesaplayın; başarı durumunuz, sınıfınız ve geçiş durumunuza göre yönetmeliği inceleyin. Size uygulanan sınırı ve istisnaları danışmanınıza sorun.']},
    submit:{link:'/rehber/ders-kayit',en:['Submit registration in OBS','Review OBS warnings, then finalize your selection within the official registration window. Selected courses are not sent for advisor approval until you finalize them.'],tr:['OBS üzerinde kaydı kesinleştirin','OBS uyarılarını inceleyip resmi kayıt süresi içinde seçiminizi kesinleştirin. Kesinleştirmediğiniz dersler danışman onayına gönderilmez.']},
    approval:{link:'/iletisim',en:['Confirm advisor approval','Check the approval status in OBS and contact your assigned advisor if needed. After advisor approval, course changes must be handled by your advisor.'],tr:['Danışman onayını doğrulayın','OBS üzerinden onay durumunu kontrol edin; gerekirse atanmış danışmanınızla iletişime geçin. Danışman onayından sonra ders değişikliklerini danışmanınız yapar.']}
  };
  function planningSave(){if(!datasets.length){storageFailed=true;return;}try{storageFailed=!P.save(localStorage,planningState,datasets);}catch{storageFailed=true;}}
  function planningFooter(){return `<p>${esc(t('localNote'))}</p><button type="button" class="guide-question" data-reset-planning>${esc(t('resetPlanning'))}</button>${storageFailed?`<p role="status">${esc(t('saveFailed'))}</p>`:''}`;}
  function ruleText(r){if(!r)return t('none');return r.op==='course'?r.code:'('+r.items.map(ruleText).join(t(r.op))+')';}
  function renderEligibility(){
    const d=datasets.find(d=>d.id===planningState.dataset);
    const codes=new Set(d?.courses.map(c=>c.code)||[]),done=new Set(planningState.completed);
    return `<div class="main-content"><h1 class="page-title">${esc(t('eligibilityNav'))}</h1><section class="surface-card"><p>${esc(t('disclaimer'))}</p>${d?`<div class="planning-selects"><label>${esc(t('program'))}<select id="planning-program">${[...new Set(datasets.map(x=>x.program[lang]))].map(p=>`<option ${p===d.program[lang]?'selected':''}>${esc(p)}</option>`).join('')}</select></label><label>${esc(t('curriculum'))}<select id="planning-dataset">${datasets.filter(x=>x.program[lang]===d.program[lang]).map(x=>`<option value="${esc(x.id)}" ${x.id===d.id?'selected':''}>${esc(x.version)}</option>`).join('')}</select></label></div>${d.courses.some(c=>c.verification!=='verified')?`<p>${esc(t('unknownExplanation'))}</p>`:''}<p>${esc(t('selectionHint'))}</p><div class="planning-courses">${d.courses.map(c=>{
      const result=P.check(c,done,codes),verified=c.verification==='verified';
      const explanation=result.status==='unknown'?t('unknownExplanation'):result.status==='completed'?t('completedExplanation'):result.status==='met'?t('metExplanation'):(result.missing.length?t('missingLabel')+result.missing.join(', ')+'. ':'')+(result.corequisites.length?t('coLabel')+result.corequisites.join(', '):'');
      return `<article class="source-card"><label><input type="checkbox" aria-label="${esc(t('completed')+': '+c.code)}" data-course="${esc(c.code)}" ${done.has(c.code)?'checked':''}> ${esc(c.code)} — ${esc(c.title?.[lang]||t('unknownField'))}</label><p>${esc(t('ects'))}: ${esc(c.ects??t('unknownField'))}</p><p>${esc(t('requirements'))}: ${esc(verified?ruleText(c.prerequisites):t('unknownField'))}</p><p>${esc(t('corequisites'))}: ${esc(verified?ruleText(c.corequisites):t('unknownField'))}</p><strong>${esc(t(result.status))}</strong><p>${esc(explanation)}</p><a href="${safeUrl(c.source)}" target="_blank" rel="noopener noreferrer">${esc(t('source'))}</a></article>`;
    }).join('')}</div>`:`<p role="status">${esc(planningLoaded?t('dataUnavailable'):t('loading'))}</p>`}${planningFooter()}</section></div>`;
  }
  function datesNotice(){return `<p>${esc(t('actual'))}: ${esc(calendarData.realToday||new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()))}${calendarData.isDemoDate?`<br>${esc(t('demo'))}: ${esc(calendarData.today)}`:''}</p>`;}
  function renderChecklist(){
    const official=sourcesData.sources.find(s=>s.id==='oim-registration');
    const regulation=sourcesData.sources.find(s=>s.id===(lang==='tr'?'regulation-tr':'regulation-en'));
    const calendarSource=sourcesData.sources.find(s=>s.id==='academic-calendar');
    const evs=calendarData.events.filter(e=>/registration|add\/drop|tuition|withdrawal/i.test(e.event_en));
    return `<div class="main-content"><h1 class="page-title">${esc(t('checklistNav'))}</h1><section class="surface-card"><p>${esc(t('checklistIntro'))}</p><p aria-live="polite">${esc(t('progress'))}: ${planningState.steps.length} / ${P.steps.length}</p>${P.steps.map(id=>{const step=stepDetails[id],source=id==='load'?regulation:official;return `<article class="checklist-step"><label><input type="checkbox" ${planningLoaded?'':'disabled'} data-step="${id}" ${planningState.steps.includes(id)?'checked':''}> <strong>${esc(step[lang][0])}</strong></label><p>${esc(step[lang][1])}</p><a href="#${step.link}">${esc(id==='curriculum'?t('eligibilityAction'):id==='load'?t('loadAction'):id==='approval'?t('contactAction'):t('registrationNav'))}</a>${source?` · <a href="${safeUrl(source.url)}" target="_blank" rel="noopener noreferrer">${esc(t('source'))}</a>`:''}</article>`;}).join('')}${planningFooter()}</section><section class="surface-card"><h2>${esc(t('deadlines'))}</h2>${datesNotice()}${evs.map(e=>`<article class="event-row"><span>${esc(lang==='tr'?e.event:e.event_en)}</span><span>${esc(rangeLong(e))}</span><span>${esc(t(P.eventState(e,calendarData.today)+'State'))}</span><a href="/api/calendar/${encodeURIComponent(P.eventId(e))}.ics?lang=${lang}">${esc(t('calendarAction'))}</a></article>`).join('')||`<p>${esc(t('emptyCalendar'))}</p>`}<a href="#/takvim">${esc(t('calendarLink'))}</a>${calendarSource?` · <a href="${safeUrl(calendarSource.url)}" target="_blank" rel="noopener noreferrer">${esc(t('source'))}</a>`:''}</section></div>`;
  }
  function renderActions(actions){return `<div class="response-actions">${(Array.isArray(actions)?actions:[]).filter(a=>P.actionValid(a,calendarData.events)).map(a=>a.type==='navigate'?`<a class="guide-question" href="#${P.destinations[a.destination]}">${esc(t({eligibility:'eligibilityAction',checklist:'checklistAction',load:'loadAction',calendar:'calendarLink',contact:'contactAction'}[a.destination]))}</a>`:a.type==='calendar'?`<a class="guide-question" href="/api/calendar/${encodeURIComponent(a.eventId)}.ics?lang=${lang}">${esc(t('calendarAction'))}</a>`:`<button class="guide-question" type="button" data-email-topic="${a.topic}">${esc(t('emailAction'))}</button>`).join('')}</div>`;}
  function openDraft(topic){
    const tr=lang==='tr',quota=topic==='quota';
    const subject=tr?(quota?'Ders kontenjanı hakkında':'Ders kaydı ve danışman onayı hakkında'):(quota?'Course quota enquiry':'Course registration and advisor approval enquiry');
    const body=tr?`Sayın [Alıcı adı],\n\n[Program / müfredat] öğrencisiyim. [Dönem] için [Ders kodu / şube] hakkında ${quota?'kontenjan durumunu':'kayıt ve danışman onayı durumunu'} öğrenmek istiyorum.\n[Sorunuz / durumunuz]\n\nSaygılarımla,\n[Ad soyad]\n[Öğrenci numarası]`:`Dear [Recipient name],\n\nI am a student in [Program / curriculum]. I would like to ask about ${quota?'the quota':'registration and advisor approval'} for [Course code / section] in [Semester].\n[Your question / circumstances]\n\nKind regards,\n[Full name]\n[Student number]`;
    const dialog=document.createElement('dialog');dialog.className='planning-dialog';dialog.setAttribute('aria-label',t('draftTitle'));
    dialog.innerHTML=`<h2>${esc(t('draftTitle'))}</h2><p>${esc(t('draftNotice'))}</p><p><a href="#/iletisim" data-close-contact>${esc(t('contactAction'))}</a></p><form><label>${esc(t('recipient'))}<input name="recipient" type="email" required placeholder="${tr?'[Alıcı e-posta adresi]':'[Recipient email address]'}"></label><label>${esc(t('subject'))}<input name="subject" value="${esc(subject)}" maxlength="200"></label><label>${esc(t('body'))}<textarea name="body" rows="12" maxlength="5000">${esc(body)}</textarea></label><button type="submit" class="guide-question">${esc(t('openEmail'))}</button><button type="button" data-close class="guide-question">${esc(t('closeDraft'))}</button></form>`;
    document.body.append(dialog);const close=()=>{dialog.close();dialog.remove();};dialog.querySelector('[data-close]').onclick=close;dialog.querySelector('[data-close-contact]').onclick=close;dialog.addEventListener('cancel',()=>dialog.remove());
    dialog.querySelector('form').onsubmit=e=>{e.preventDefault();const f=e.target.elements;location.href='mailto:'+encodeURIComponent(f.recipient.value)+'?subject='+encodeURIComponent(f.subject.value)+'&body='+encodeURIComponent(f.body.value);};dialog.showModal();
  }
  document.addEventListener('click',e=>{
    const email=e.target.closest('[data-email-topic]');if(email&&['quota','advisor'].includes(email.dataset.emailTopic))openDraft(email.dataset.emailTopic);
    if(e.target.closest('[data-reset-planning]')){try{storageFailed=!P.reset(localStorage);}catch{storageFailed=true;}planningState=P.cleanState(null,datasets);renderRoute();}
  });
  document.addEventListener('change',e=>{
    if(e.target.id==='planning-program'){const d=datasets.find(d=>d.program[lang]===e.target.value);if(d){planningState.dataset=d.id;planningState.completed=[];planningSave();renderRoute();}}
    if(e.target.id==='planning-dataset'&&datasets.some(d=>d.id===e.target.value)){planningState.dataset=e.target.value;planningState.completed=[];planningSave();renderRoute();}
    const course=e.target.dataset.course,step=e.target.dataset.step;
    if((course||step)&&planningLoaded){const key=course?'completed':'steps',value=course||step;planningState[key]=planningState[key].filter(x=>x!==value);if(e.target.checked)planningState[key].push(value);planningState=P.cleanState(planningState,datasets);planningSave();renderRoute();const el=[...document.querySelectorAll(course?'[data-course]':'[data-step]')].find(x=>(course?x.dataset.course:x.dataset.step)===value);el?.focus();}
  });
  async function loadPlanning(){try{const r=await fetch('/api/curricula');if(!r.ok)throw Error();const data=await r.json();datasets=Array.isArray(data.datasets)?data.datasets.filter(P.validDataset):[];try{planningState=P.read(localStorage,datasets);}catch{planningState=P.cleanState(null,datasets);storageFailed=true;}}catch{datasets=[];}planningLoaded=true;if(['/uygunluk','/kontrol-listesi'].includes(currentRoute()))renderRoute();}

  const ICONS = {
    menu: '<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-5.2A7.5 7.5 0 1 1 20 11.5Z"/><path d="M8 11h8M8 14h5"/></svg>',
    calendar: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h2M13 14h3M8 17h2"/></svg>',
    book: '<svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5ZM4 6h16M8 10h8M8 14h6"/></svg>',
    file: '<svg viewBox="0 0 24 24"><path d="M6 3h8l5 5v13H6zM14 3v6h5M9 13h7M9 17h7"/></svg>',
    stack: '<svg viewBox="0 0 24 24"><path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM10 18h4"/></svg>',
    cap: '<svg viewBox="0 0 48 48"><path d="m4 17 20-10 20 10-20 10L4 17Zm8 5v9c7 6 17 6 24 0v-9M44 18v14"/><circle cx="44" cy="35" r="2"/></svg>',
    warning: '<svg viewBox="0 0 24 24"><path d="M10.3 4.2 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z"/><path d="M12 9v5M12 17.5h.01"/></svg>',
    register: '<svg viewBox="0 0 24 24"><path d="M5 4h14v16H5zM8 8h8M8 12h4M8 16h3M16 14v5M13.5 16.5H18.5"/></svg>',
    drop: '<svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M5 20h14"/></svg>',
    finals: '<svg viewBox="0 0 24 24"><path d="M7 3h10v4H7zM5 7h14v14H5zM8 12h8M8 16h5"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    source: '<svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 0 1 2-2h13v17H6a2 2 0 0 1-2-2V5ZM4 17a2 2 0 0 1 2-2h13M8 7h7M8 10h6"/></svg>',
    advisor: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 8h5M18.5 5.5v5"/></svg>',
    repeat: '<svg viewBox="0 0 24 24"><path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };
  const GUIDES = {
    '/rehber/ders-kayit': ['register','Howto'],
    '/rehber/ekle-birak': ['drop','Swap'],
    '/rehber/cekilme': ['arrow','Withdraw'],
    '/rehber/ders-yuku': ['stack','Load']
  };
  const NAV_ROUTES = ['/asistan','/takvim','/rehber/ders-kayit','/rehber/ekle-birak','/rehber/cekilme','/rehber/ders-yuku','/yonetmelik','/el-kitabi','/kaynaklar','/iletisim'];
  const $ = id => document.getElementById(id);
  const readStore = (key, fallback) => { try { const value = localStorage.getItem(key); return value ?? fallback; } catch { return fallback; } };
  let lang = readStore('regibot-language','tr') === 'en' ? 'en' : 'tr';
  let calendarData = { today: new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()), isDemoDate: false, events: [] };
  let sourcesData = { sources: [], totalChunks: 0 };
  let healthData = { ok:false, model:'—', hasKey:false, chunks:0 };
  let chatEntries = [];
  let conversationHistory = [];
  let pendingQuestion = '';
  let waiting = false;
  let chatSession = 0; // bumped by "New chat" so a reply still in flight is dropped
  let guideExpanded = true;
  let route = '/';
  const t = key => TEXT[lang][key];
  const esc = value => String(value ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  const safeUrl = value => /^(https?:\/\/|mailto:)/i.test(String(value || '')) ? esc(value) : '#';
  const icon = name => ICONS[name] || ICONS.file;
  const dateObj = iso => new Date(`${iso}T00:00:00Z`);
  const dayDiff = (a,b) => Math.round((Date.parse(`${a}T00:00:00Z`)-Date.parse(`${b}T00:00:00Z`))/86400000);
  const norm = text => String(text || '').toLocaleLowerCase('tr').replace(/[ı]/g,'i').replace(/[ğ]/g,'g').replace(/[ü]/g,'u').replace(/[ş]/g,'s').replace(/[ö]/g,'o').replace(/[ç]/g,'c');
  const dateLong = iso => new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(dateObj(iso));
  const dateShort = iso => new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(dateObj(iso));
  function rangeLong(event) {
    if (event.start === event.end) return dateLong(event.start);
    const start = dateObj(event.start), end = dateObj(event.end);
    if (event.start.slice(0,7) === event.end.slice(0,7)) {
      const monthYear = new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-GB',{month:'long',year:'numeric',timeZone:'UTC'}).format(start);
      return `${start.getUTCDate()}–${end.getUTCDate()} ${monthYear}`;
    }
    return `${dateLong(event.start)} – ${dateLong(event.end)}`;
  }
  function countdown(event) {
    const start = dayDiff(event.start,calendarData.today), end = dayDiff(event.end,calendarData.today);
    if (start > 1) return t('startsIn')(start);
    if (start === 1) return t('tomorrow');
    if (start === 0 && end === 0) return t('startsToday');
    if (start <= 0 && end > 0) return t('ongoingDays')(end);
    if (end === 0) return t('endsToday');
    return lang === 'tr' ? 'Tamamlandı' : 'Past';
  }
  function upcoming(events) {
    const active = events.filter(e => e.start <= calendarData.today && e.end >= calendarData.today).sort((a,b)=>a.end.localeCompare(b.end));
    if (active.length) return active[0];
    return events.filter(e=>e.start>calendarData.today).sort((a,b)=>a.start.localeCompare(b.start))[0] || null;
  }
  function nearestAlertEvent() {
    const important = calendarData.events.filter(e=>/Ders Kayıtları|Ders Ekleme-Çıkarma|Dersten Çekilme Son Tarih/i.test(e.event));
    return upcoming(important) || upcoming(calendarData.events);
  }
  function semesterLabel() {
    const [year,month,day] = calendarData.today.split('-').map(Number);
    if (month >= 9) return `${year}-${year+1} ${t('fall')}`;
    if (month === 1 && day <= 31) return `${year-1}-${year} ${t('fall')}`;
    if (month >= 2 && (month < 6 || (month === 6 && day <= 13))) return `${year-1}-${year} ${t('spring')}`;
    return `${year-1}-${year} ${t('summer')}`;
  }
  function announcementCount() {
    const max = new Date(Date.parse(`${calendarData.today}T00:00:00Z`)+14*86400000).toISOString().slice(0,10);
    return calendarData.events.filter(e=>e.start>=calendarData.today && e.start<=max).length;
  }
  function updateHeader() {
    $('semester-badge').textContent = semesterLabel();
    const announcements=String(announcementCount());
    $('announcement-count').textContent = announcements;
    $('announcement-count').setAttribute('aria-label',`${t('announcement')}: ${announcements}`);
    $('session-pill').textContent = `${calendarData.isDemoDate ? (lang==='tr'?'Demo tarihi: ':'Demo date: ') : (lang==='tr'?'Tarih: ':'Date: ')}${new Intl.DateTimeFormat(lang==='tr'?'tr-TR':'en-GB',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}).format(dateObj(calendarData.today))}`;
  }
  function updateLocalizedChrome() {
    document.documentElement.lang = lang;
    document.title=t('brandTitle');
    document.querySelectorAll('[data-i18n]').forEach(node=>{ const key=node.dataset.i18n; if(TEXT[lang][key]) node.textContent=TEXT[lang][key]; });
    $('menu-search').placeholder=t('menuSearch');
    $('sidebar').setAttribute('aria-label',t('sidebar'));
    $('sidebar-toggle').setAttribute('aria-label',t('hamburger'));
    $('top-brand-title').textContent=t('brandTitle');
    document.querySelector('.top-brand')?.setAttribute('aria-label',t('home'));
    $('home-button').setAttribute('aria-label',t('home'));
    $('home-button').title=t('home');
    $('announcements-button').setAttribute('aria-label',t('announcement'));
    $('announcements-button').title=t('announcement');
    $('footer-text').textContent=t('footer');$('footer-close').setAttribute('aria-label',t('close'));$('footer-close').title=t('close');
    $('demo-mode-label').textContent=t('demoMode');
    $('menu-caption').textContent=t('general');
    $('sidebar-status').textContent=t('localDemo');
    document.querySelectorAll('.language-switch button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===lang)));
    updateThemeButton();
    updateHeader();
  }
  function isDark() { return document.documentElement.dataset.theme==='dark'; }
  function updateThemeButton() {
    const button=$('theme-button'),label=isDark()?t('themeToLight'):t('themeToDark');
    button.setAttribute('aria-pressed',String(isDark()));button.setAttribute('aria-label',label);button.title=label;
  }
  const HERO_QUESTIONS=['askRegistration','askLoad','askAddDrop','askWithdrawal','askCalendar','askRepeat'];
  const MORE_QUESTIONS=['askAdvisor','askLate','askProbation','askUpperYear','askFinals','askTranscript','askInternship','askContact'];
  let showMoreQuestions=false;
  function renderSuggestionChips() {
    const keys=showMoreQuestions?[...HERO_QUESTIONS,...MORE_QUESTIONS]:HERO_QUESTIONS;
    return `${keys.map(key=>`<button class="suggestion-chip" type="button" data-ask="${esc(t(key))}">${esc(t(key))}</button>`).join('')}<button class="suggestion-chip more-chip" type="button" id="more-questions" aria-expanded="${showMoreQuestions}">${esc(t(showMoreQuestions?'fewerQuestions':'moreQuestions'))}<span class="more-chip-arrow" aria-hidden="true">${showMoreQuestions?'−':'+'}</span></button>`;
  }
  function bindSuggestionChips(container) {
    container.querySelectorAll('[data-ask]').forEach(node=>node.addEventListener('click',event=>{event.preventDefault();askFromAnywhere(node.dataset.ask);}));
    container.querySelector('#more-questions')?.addEventListener('click',()=>{showMoreQuestions=!showMoreQuestions;container.innerHTML=renderSuggestionChips();bindSuggestionChips(container);container.querySelector('#more-questions')?.focus();});
  }
  function renderDeadlineLine() {
    const event=nearestAlertEvent();
    return event?`<a class="assistant-deadline" href="#/takvim"><span>${esc(t('deadlinePrefix'))}</span><strong>${esc(lang==='tr'?event.event:event.event_en)}</strong><span>${esc(dateShort(event.start))} · ${esc(countdown(event))}</span></a>`:'';
  }
  function renderAssistant() {
    if(chatEntries.length)return `<section class="assistant-conversation"><header class="conversation-header"><button class="new-chat-button" type="button" id="new-chat">${icon('chat')}<span>${esc(t('newChat'))}</span></button></header><div class="chat-log" id="chat-log" aria-live="polite" aria-relevant="additions text"></div><div class="composer-dock"><div class="composer-shell"><form id="chat-form"><label class="sr-only" for="chat-input">${esc(t('questionLabel'))}</label><textarea id="chat-input" maxlength="500" rows="1" placeholder="${esc(t('heroPlaceholder'))}"></textarea><button class="send-button" id="chat-send" type="submit" aria-label="${esc(t('send'))}" ${waiting?'disabled':''}><span class="sr-only">${esc(t('send'))}</span>${icon('arrow')}</button><span class="char-counter" id="char-counter"></span></form></div></div></section>`;
    return `<div class="assistant-landing"><section class="assistant-hero"><img class="hero-logo" src="/assets/logo.svg" alt=""><span class="ai-badge"><span aria-hidden="true">✦</span> ${esc(t('heroBadge'))}</span><h1 class="assistant-title">${esc(t('heroTitle'))}</h1><p class="assistant-description">${esc(t('heroDescription'))}</p><div class="composer-shell"><form id="chat-form"><label class="sr-only" for="chat-input">${esc(t('questionLabel'))}</label><textarea id="chat-input" maxlength="500" rows="1" placeholder="${esc(t('heroPlaceholder'))}"></textarea><button class="send-button" id="chat-send" type="submit" aria-label="${esc(t('send'))}"><span class="sr-only">${esc(t('send'))}</span>${icon('arrow')}</button><span class="char-counter" id="char-counter"></span></form></div><div class="suggestion-chips" id="suggestion-chips">${renderSuggestionChips()}</div><p class="assistant-note">${esc(t('heroNote'))}</p><div id="assistant-deadline">${renderDeadlineLine()}</div></section></div>`;
  }
  function growInput(input) { input.style.height='auto';input.style.height=`${Math.min(input.scrollHeight,144)}px`; }
  function safeMarkdown(value) {
    const safe=esc(value);
    const inline=line=>line.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\[([^\]]+)\]/g,'<span class="citation">[$1]</span>');
    const output=[];let listType='';let items=[];
    const flush=()=>{if(!listType)return;output.push(`<${listType}>${items.map(x=>`<li>${inline(x)}</li>`).join('')}</${listType}>`);listType='';items=[];};
    for(const line of safe.split(/\r?\n/)){
      const bullet=line.match(/^\s*[-*]\s+(.*)$/),numbered=line.match(/^\s*\d+\.\s+(.*)$/);
      if(bullet||numbered){const next=bullet?'ul':'ol';if(listType&&listType!==next)flush();listType=next;items.push((bullet||numbered)[1]);}
      else{flush();if(line.trim())output.push(`<p>${inline(line)}</p>`);}
    }
    flush();return output.join('');
  }
  function sourceCards(cards) {
    if(!cards?.length)return '';
    const grouped=new Map();
    for(const source of cards){
      const rawTitle=String(source.title||'').replace(/\s*\(\d+\/\d+\)\s*$/,'').trim();
      const key=rawTitle.toLocaleLowerCase('tr');
      if(!grouped.has(key))grouped.set(key,{...source,title:rawTitle,articles:[]});
      const group=grouped.get(key),article=String(source.article||'').replace(/\s*\(\d+\/\d+\)\s*$/,'').trim();
      if(article&&!group.articles.includes(article))group.articles.push(article);
    }
    return `<div class="source-cards">${[...grouped.values()].map(source=>{const title=sourceLabel(source.title,source),tag=/Yönetmelik|Regulation/i.test(source.title)?(lang==='tr'?'Yönetmelik':'Regulation'):/El Kitab|Handbook/i.test(source.title)?(lang==='tr'?'El Kitabı':'Handbook'):/Takvim|Calendar/i.test(source.title)?(lang==='tr'?'Takvim':'Calendar'):(lang==='tr'?'Kaynak':'Source');const articles=source.articles.map(article=>sourceArticleLabel(article)).join(' · ');return `<a class="chat-source-card" href="${safeUrl(source.url)}" target="_blank" rel="noopener noreferrer"><span class="source-card-icon">${icon('file')}</span><span class="source-card-copy"><small>${esc(tag)}</small><strong>${esc(title)}</strong>${articles?`<span>${esc(articles)}</span>`:''}</span></a>`;}).join('')}</div>`;
  }
  const SOURCE_TITLES={
    'Yönetmelik':'Regulation','Öğrenci İşleri – Ders Kayıtları':'Student Affairs – Course Registration','OBS Ders Kaydı Kılavuzu':'OBS Course Registration Guide','Akademik Takvim 2026-2027':'Academic Calendar 2026-2027','Öğrenci El Kitabı 2025':'Student Handbook 2025','Öğrenci İşleri – İletişim':'Student Affairs – Contact','Bilgisayar Müh. – İletişim':'Computer Engineering – Contact','Bilgisayar Müh. – Müfredat':'Computer Engineering – Curriculum'
  };
  const ARTICLE_TITLES={'Eğitim Ücreti':'Tuition Fees','Ders Kayıt Takvimi':'Registration Calendar','Ders Kayıt Kuralları':'Registration Rules','Ders Kaydı Nasıl Yapılır?':'How to Register','Ders İşlemleri Nelerdir ?':'Course Procedures','Çap ve Yandal Ders Kaydı':'Double Major & Minor Registration','Dersten Çekilme':'Course Withdrawal','Müfredat Bilgisi':'Curriculum','Muafiyet ve İntibak İşlemleri':'Exemptions & Course Transfer','Sıkça Sorulan Sorular':'FAQ'};
  const FULL_SOURCE_TITLES={'regulation-tr':'Yaşar University Associate and Undergraduate Education and Examination Regulation (Turkish)','oim-registration':'Student Affairs Office — Course Registration','obs-guide':'OBS Course Registration Guide','academic-calendar':'Yaşar University 2026-2027 Academic Calendar','student-handbook':'Yaşar University Student Handbook (2025, Rev. 12)','contacts-oim':'Student Affairs Office — Contact','contacts-ce':'Computer Engineering Department — Contact','ce-curriculum':'Computer Engineering — Curriculum and Prerequisites'};
  function sourceLabel(title,source={}) {
    if(lang!=='en')return title;
    return SOURCE_TITLES[source.short_title]||SOURCE_TITLES[title]||title;
  }
  function sourceArticleLabel(article) {
    if(lang!=='en')return article;
    if(/^Madde (\d+)/.test(article))return article.replace(/^Madde (\d+)/,'Article $1');
    return ARTICLE_TITLES[article]||article;
  }
  function renderChatEntries() {
    const log=$('chat-log');if(!log)return;
    const entries=chatEntries.length?chatEntries:[{role:'assistant',content:t('welcome'),welcome:true}];
    log.innerHTML=entries.map(entry=>{
      const role=entry.role==='user'?'user':'assistant';
      const text=entry.welcome?t('welcome'):entry.content;
      const body=role==='user'?`<div class="bubble"></div>`:`<div class="bubble">${safeMarkdown(text)}</div>${sourceCards(entry.sources)}${renderActions(entry.actions)}`;
      const warning=entry.lowConfidence?`<p class="chat-warning">${esc(t('lowConfidence'))}</p>`:'';
      return `<div class="message-row ${role}">${role==='assistant'?'<div class="chat-avatar" aria-hidden="true"><img src="/assets/logo.svg" alt=""></div>':''}<div class="message-body">${body}${warning}</div></div>`;
    }).join('');
    for(const [i,entry] of entries.entries())if(entry.role==='user')log.children[i].querySelector('.bubble').textContent=entry.content;
    if(waiting){const row=document.createElement('div');row.className='message-row assistant typing-row';row.id='typing-row';row.innerHTML=`<div class="chat-avatar" aria-hidden="true"><img src="/assets/logo.svg" alt=""></div><div class="typing-content"><span class="typing-label">${esc(t('typing'))}</span><div class="bubble typing-bubble" aria-label="${esc(t('typing'))}"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div></div>`;log.appendChild(row);}
    const scrollToBottom=()=>{log.scrollTop=log.scrollHeight;};
    scrollToBottom();
    requestAnimationFrame(scrollToBottom);
    log.querySelectorAll('.chat-avatar img').forEach(image=>image.addEventListener('load',scrollToBottom,{once:true}));
  }
  async function sendMessage(value) {
    const message=String(value||'').trim();if(!message||waiting)return;
    chatEntries.push({role:'user',content:message});waiting=true;
    if(!$('chat-log')){renderRoute();$('chat-input')?.focus();}
    renderChatEntries();
    const input=$('chat-input');if(input)input.value='';const counter=$('char-counter');if(counter){counter.textContent='';counter.classList.remove('over');}
    const send=$('chat-send');if(send)send.disabled=true;
    const session=chatSession;
    try{
      const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,history:conversationHistory.slice(-6),lang})});
      let data;try{data=await response.json();}catch{data=null;}
      if(session!==chatSession)return;
      if(!response.ok||data?.error){chatEntries.push({role:'assistant',content:data?.answer||t('errorFallback'),error:true});}
      else{
        const answer=typeof data?.answer==='string'?data.answer:t('errorFallback');
        chatEntries.push({role:'assistant',content:answer,sources:Array.isArray(data?.sources)?data.sources:[],actions:Array.isArray(data?.actions)?data.actions:[],lowConfidence:Boolean(data?.lowConfidence)});
        conversationHistory.push({role:'user',content:message},{role:'assistant',content:answer});conversationHistory=conversationHistory.slice(-6);
      }
    }catch{if(session===chatSession)chatEntries.push({role:'assistant',content:t('errorFallback'),error:true});}
    finally{if(session!==chatSession)return;waiting=false;renderChatEntries();const next=$('chat-input');if(next){next.disabled=false;next.focus();}const button=$('chat-send');if(button)button.disabled=false;}
  }

  function groupForEvent(event) {
    if(/Güz/i.test(event.event))return t('fall');
    if(/Bahar/i.test(event.event))return t('spring');
    if(/Yaz/i.test(event.event))return t('summer');
    return t('holidays');
  }
  function isHoliday(event) { return /Bayram|Yılbaşı|Milli Birlik|Egemenlik|Dayanışma Günü|Zafer Bayramı|Cumhuriyet Bayramı|Telafi Günü/i.test(event.event); }
  function renderCalendar() {
    const groups=[t('fall'),t('spring'),t('summer'),t('holidays')];
    const sorted=[...calendarData.events].sort((a,b)=>a.start.localeCompare(b.start));
    const focus=upcoming(sorted);
    const entries=groups.map(group=>{
      const rows=sorted.filter(event=>isHoliday(event)?group===t('holidays'):group===groupForEvent(event));
      if(!rows.length)return '';
      return `<section><h2 class="calendar-group-title">${esc(group)}</h2><div class="calendar-list">${rows.map(event=>{
        const past=event.end<calendarData.today,ongoing=event.start<=calendarData.today&&event.end>=calendarData.today,active=event===focus;
        return `<article class="event-row ${past?'past':''} ${active?'current':''}"><span class="event-name">${esc(lang==='tr'?event.event:event.event_en)}</span><span class="event-date">${esc(rangeLong(event))}</span><span class="event-state">${esc(past?t('past'):ongoing?t('ongoing'):active?t('next'):'')}</span></article>`;
      }).join('')}</div></section>`;
    }).join('');
    const source=sourcesData.sources.find(s=>s.id==='academic-calendar');
    return `<div class="main-content"><div class="page-head"><div><p class="eyebrow">${esc(t('calendarNav'))}</p><h1 class="page-title">${esc(t('calendarTitle'))}</h1><p class="page-description">${esc(t('calendarDescription'))}</p></div></div><section class="surface-card">${datesNotice()}<div class="calendar-groups">${entries||`<p class="empty-note">${esc(t('noUpcoming'))}</p>`}</div>${source?`<a class="calendar-link" href="${safeUrl(source.url)}" target="_blank" rel="noopener noreferrer">${icon('file')}${esc(t('calendarPdf'))}</a>`:''}</section></div>`;
  }
  function renderGuide(path) {
    const data=TEXT[lang].guides[path];if(!data)return renderAssistant();
    const quicks=data.questions.map(q=>`<button class="guide-question" type="button" data-ask="${esc(q)}"><span>${esc(q)}</span><span>›</span></button>`).join('');
    return `<div class="main-content"><div class="page-head"><div><p class="eyebrow">${esc(t('guidesTitle'))}</p><h1 class="page-title">${esc(data.title)}</h1></div></div><div class="guide-layout"><section class="surface-card"><p>${esc(data.intro)}</p><div class="question-list">${quicks}</div></section><aside class="guide-callout">${esc(lang==='tr'?'Yanıtlar resmi kaynaklarla sınırlıdır. Kayıt kararlarınızı akademik danışmanınızla doğrulayın.':'Answers are limited to official sources. Confirm registration decisions with your academic advisor.')}</aside></div></div>`;
  }
  function authorityLabel(level) { return level===1?t('regulationAuthority'):level===2?t('officialAuthority'):t('handbookAuthority'); }
  function renderSourceCards(list) {
    if(!list.length)return `<section class="surface-card"><p class="empty-note">${esc(t('noSource'))}</p></section>`;
    return `<div class="source-grid">${list.map(source=>{const title=lang==='en'?(FULL_SOURCE_TITLES[source.id]||source.title):source.title;return `<article class="source-card"><h2 class="source-title">${esc(title)}</h2><p class="source-subtitle">${esc(sourceLabel(source.short_title||'',source))}</p><div class="source-facts"><span class="source-fact">${esc(authorityLabel(source.authority))}</span><span class="source-fact">${source.language==='tr'?esc(t('turkish')):esc(t('english'))}</span><span class="source-fact">${source.chunks} ${esc(t('chunks'))}</span></div><a class="source-open" href="${safeUrl(source.url)}" target="_blank" rel="noopener noreferrer">${esc(t('openOfficial'))}</a></article>`;}).join('')}</div>`;
  }
  function renderSourcesPage(kind) {
    let list=sourcesData.sources;
    let title=t('sourcesTitle'),description=t('sourcesDescription'),note='';
    if(kind==='regulation'){list=list.filter(s=>s.authority===1);title=t('regulationTitle');}
    else if(kind==='handbook'){list=list.filter(s=>s.id==='student-handbook');title=t('handbookTitle');}
    else note=`<p class="source-note">${esc(t('conflictNote'))}</p>`;
    return `<div class="main-content"><div class="page-head"><div><p class="eyebrow">${esc(t('sourcesNav'))}</p><h1 class="page-title">${esc(title)}</h1><p class="page-description">${esc(description)}</p></div></div>${note}${renderSourceCards(list)}</div>`;
  }
  function renderContacts() {
    const htmlCard=(title,ico,lines)=>`<section class="surface-card contact-card"><div class="contact-card-head"><span class="card-icon">${icon(ico)}</span><h2>${esc(title)}</h2></div><ul class="contact-lines">${lines.map(([label,value,href])=>`<li><strong>${esc(label)}:</strong> ${href?`<a href="${safeUrl(href)}" target="_blank" rel="noopener noreferrer">${esc(value)}</a>`:esc(value)}</li>`).join('')}</ul></section>`;
    const a=htmlCard(t('studentAffairs'),'phone',[[t('phone'),'+90 232 570 7070'],[t('supportPortal'),'oimdestek.yasar.edu.tr','https://oimdestek.yasar.edu.tr'],[t('website'),'oim.yasar.edu.tr','https://oim.yasar.edu.tr']]);
    const b=htmlCard(t('computerEngineering'),'book',[[t('phone'),'+90 232 570 8200 / 8215'],[t('email'),'feng@yasar.edu.tr','mailto:feng@yasar.edu.tr'],[t('website'),'ce.yasar.edu.tr','https://ce.yasar.edu.tr']]);
    return `<div class="main-content"><div class="page-head"><div><p class="eyebrow">${esc(t('contactTitle'))}</p><h1 class="page-title">${esc(t('contactTitle'))}</h1><p class="page-description">${esc(t('contactDescription'))}</p></div></div><div class="contact-grid">${a}${b}</div></div>`;
  }
  function setActiveNavigation(path) {
    const activePath=path==='/'||path==='/asistan'?'/asistan':path;
    document.querySelectorAll('[data-route]').forEach(link=>link.classList.toggle('active',link.dataset.route===activePath));
    const isGuide=path.startsWith('/rehber/');
    if(isGuide)guideExpanded=true;
    $('guide-toggle').setAttribute('aria-expanded',String(guideExpanded));
    $('guide-submenu').hidden=!guideExpanded;
    document.querySelectorAll('.nav-link,.nav-group-toggle,.nav-submenu a').forEach(link=>link.removeAttribute('aria-current'));
    const current=document.querySelector(`[data-route="${CSS.escape(activePath)}"]`);if(current)current.setAttribute('aria-current','page');
    if(isGuide)$('guide-toggle').classList.add('active');else $('guide-toggle').classList.remove('active');
  }
  function closeSidebar() { $('sidebar').classList.remove('open');$('sidebar-scrim').classList.remove('open');$('sidebar-toggle').setAttribute('aria-expanded','false'); }
  function currentRoute() { const raw=location.hash.replace(/^#/, '')||'/';return raw.startsWith('/')?raw:`/${raw}`; }
  function renderRoute() {
    route=currentRoute();
    const assistantRoute=route==='/'||route==='/asistan';
    document.body.classList.toggle('route-assistant',assistantRoute);
    setActiveNavigation(route);
    const main=$('main-area');
    let html;
    if(assistantRoute)html=renderAssistant();
    else if(route==='/takvim')html=renderCalendar();
    else if(route==='/uygunluk')html=renderEligibility();
    else if(route==='/kontrol-listesi')html=renderChecklist();
    else if(TEXT[lang].guides[route])html=renderGuide(route);
    else if(route==='/yonetmelik')html=renderSourcesPage('regulation');
    else if(route==='/el-kitabi')html=renderSourcesPage('handbook');
    else if(route==='/kaynaklar')html=renderSourcesPage('all');
    else if(route==='/iletisim')html=renderContacts();
    else html=renderAssistant();
    main.innerHTML=html;
    main.scrollTop=0;
    closeSidebar();
    if(assistantRoute){
      renderChatEntries();
      const form=$('chat-form'),input=$('chat-input');
      if(input){input.addEventListener('input',()=>{growInput(input);const counter=$('char-counter');counter.textContent=input.value.length>=400?t('charCount')(input.value.length):'';counter.classList.toggle('over',input.value.length>=500);});input.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();form.requestSubmit();}});growInput(input);}
      if(form)form.addEventListener('submit',event=>{event.preventDefault();sendMessage(input.value);});
      $('new-chat')?.addEventListener('click',()=>{chatSession++;chatEntries=[];conversationHistory=[];waiting=false;renderRoute();$('chat-input')?.focus();});
      if(!chatEntries.length&&window.matchMedia('(pointer:fine)').matches)setTimeout(()=>{if($('chat-input')&&!document.activeElement?.matches('textarea'))$('chat-input').focus();},0);
      if(pendingQuestion){const question=pendingQuestion;pendingQuestion='';setTimeout(()=>sendMessage(question),0);}
    }
    const chips=$('suggestion-chips');
    main.querySelectorAll('[data-ask]').forEach(node=>{if(!chips?.contains(node))node.addEventListener('click',event=>{event.preventDefault();askFromAnywhere(node.dataset.ask);});});
    if(chips)bindSuggestionChips(chips);
  }
  function askFromAnywhere(question) {
    if(currentRoute()==='/'||currentRoute()==='/asistan'){sendMessage(question);return;}
    pendingQuestion=question;location.hash='#/asistan';
  }
  function applyMenuSearch() {
    const q=norm($('menu-search').value.trim());
    const group=$('guide-group');let guideMatch=false;
    document.querySelectorAll('.nav-submenu a').forEach(link=>{const match=!q||norm(link.dataset.search+' '+link.textContent).includes(q);link.hidden=!match;if(match)guideMatch=true;});
    document.querySelectorAll('.main-nav > .nav-link').forEach(link=>{link.hidden=Boolean(q)&&!norm(link.dataset.search+' '+link.textContent).includes(q);});
    group.hidden=Boolean(q)&&!guideMatch&&!norm($('guide-toggle').dataset.search+' '+$('guide-toggle').textContent).includes(q);
    if(q&&guideMatch){guideExpanded=true;$('guide-submenu').hidden=false;$('guide-toggle').setAttribute('aria-expanded','true');}
  }
  async function loadData() {
    const [calendarResult,sourcesResult,healthResult]=await Promise.allSettled([
      fetch('/api/calendar').then(r=>{if(!r.ok)throw new Error();return r.json();}),
      fetch('/api/sources').then(r=>{if(!r.ok)throw new Error();return r.json();}),
      fetch('/api/health').then(r=>{if(!r.ok)throw new Error();return r.json();})
    ]);
    if(calendarResult.status==='fulfilled'){const d=calendarResult.value;if(P.date(d.today)&&Array.isArray(d.events))calendarData={...d,events:d.events.filter(P.validEvent)};}
    if(sourcesResult.status==='fulfilled')sourcesData=sourcesResult.value;
    if(healthResult.status==='fulfilled')healthData=healthResult.value;
    updateHeader();
    if(['/','/asistan'].includes(currentRoute())){
      const deadline=$('assistant-deadline');if(deadline)deadline.innerHTML=renderDeadlineLine();
      if(chatEntries.length)renderChatEntries();
    }
    else if(['/takvim','/yonetmelik','/el-kitabi','/kaynaklar','/kontrol-listesi'].includes(currentRoute()))renderRoute();
  }

  document.querySelectorAll('.language-switch button').forEach(button=>button.addEventListener('click',()=>{
    lang=button.dataset.language;try{localStorage.setItem('regibot-language',lang);}catch{}
    updateLocalizedChrome();renderRoute();
  }));
  $('sidebar-toggle').addEventListener('click',()=>{const open=!$('sidebar').classList.contains('open');$('sidebar').classList.toggle('open',open);$('sidebar-scrim').classList.toggle('open',open);$('sidebar-toggle').setAttribute('aria-expanded',String(open));});
  $('sidebar-scrim').addEventListener('click',closeSidebar);
  $('theme-button').addEventListener('click',()=>{
    const dark=!isDark();
    if(dark)document.documentElement.dataset.theme='dark';else delete document.documentElement.dataset.theme;
    try{localStorage.setItem('regibot-theme',dark?'dark':'light');}catch{}
    updateThemeButton();
  });
  $('footer-close').addEventListener('click',()=>{document.documentElement.classList.add('footer-hidden');try{localStorage.setItem('regibot-footer','hidden');}catch{}});
  $('home-button').addEventListener('click',()=>{location.hash='#/';});
  $('announcements-button').addEventListener('click',()=>{location.hash='#/takvim';});
  $('guide-toggle').addEventListener('click',()=>{guideExpanded=!guideExpanded;$('guide-submenu').hidden=!guideExpanded;$('guide-toggle').setAttribute('aria-expanded',String(guideExpanded));});
  $('menu-search').addEventListener('input',applyMenuSearch);
  window.addEventListener('hashchange',renderRoute);
  window.addEventListener('keydown',event=>{if(event.key==='Escape')closeSidebar();});
  document.querySelectorAll('[data-icon]').forEach(node=>{node.innerHTML=icon(node.dataset.icon);});
  updateLocalizedChrome();renderRoute();loadData();loadPlanning();
})();
