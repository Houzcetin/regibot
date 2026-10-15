(() => {
  const TEXT = {
    tr: {
      sidebar: 'Ana menü', hamburger: 'Menüyü aç', assistantLabel: 'Öğrenci Asistanı', menuSearch: 'Menüde Ara...', general: 'Genel', assistantNav: 'Asistan', calendarNav: 'Akademik Takvim', guideNav: 'Ders Kayıt Rehberi', registrationNav: 'Ders Kayıt', addDropNav: 'Ekle/Bırak', withdrawalNav: 'Dersten Çekilme', loadNav: 'Ders Yükü / ECTS', regulationNav: 'Yönetmelik', handbookNav: 'Öğrenci El Kitabı', sourcesNav: 'Kaynaklar', contactNav: 'İletişim', demoMode: 'Demo Modu', footer: "Bu Yaşar Üniversitesi'nin resmi sistemi değildir; resmi kaynaklara dayanan bir öğrenci projesidir.",
      home: 'Ana sayfa', announcement: 'Akademik takvim', localDemo: 'Yerel demo', loading: 'Yükleniyor…', homeEyebrow: 'Ders kayıt asistanı', homeTitle: 'Merhaba, nasıl yardımcı olabiliriz?', homeDescription: 'Ders kaydı, akademik takvim ve üniversitenin resmi kaynakları hakkında bilgilere buradan ulaşabilirsiniz.',
      information: 'Bilgilendirme', close: 'Bildirimi kapat', upcoming: 'Yaklaşan tarih', datesTitle: 'Akademik takvimden önemli tarihler', knowledge: 'Bilgi tabanı', courseRegistration: 'Ders Kayıt', addDrop: 'Ekle-Bırak', withdrawal: 'Dersten Çekilme', lastClass: 'Son Ders Günü', finals: 'Final Sınavları', sourcesCount: 'belge', chunksCount: 'parça', apiReady: 'hazır', apiMissing: 'eksik', noUpcoming: 'Yaklaşan tarih bulunamadı.',
      quickAccess: 'Hızlı Erişim', quickDescription: 'Sık sorulan konulardan birini seçerek sohbete başlayın.', askWithdrawal: 'Dersten nasıl çekilirim?', askLoad: 'Bir dönemde kaç ECTS alabilirim?', askAddDrop: 'Ekle-bırak ne zaman?', askAdvisor: 'Danışman onayı nasıl alınır?', askRepeat: 'Ders tekrarı kuralları nelerdir?', askContact: 'Öğrenci İşleri iletişim bilgileri nedir?',
      calendarTitle: 'Akademik Takvim', calendarDescription: '2026–2027 ön lisans ve lisans akademik takvimindeki tarihler.', fall: 'Güz', spring: 'Bahar', summer: 'Yaz', holidays: 'Resmi tatiller', past: 'Tamamlandı', ongoing: 'Devam ediyor', next: 'Sıradaki', calendarPdf: 'Resmi akademik takvim PDF dosyasını aç', date: 'Tarih', event: 'Etkinlik', status: 'Durum',
      chatTitle: 'Ders kayıt asistanı', chatDescription: 'Sorularınızı resmi üniversite kaynaklarına dayanarak yanıtlarım.', welcome: 'Merhaba! Ders kayıt kuralları, AKTS yükü, danışman onayı ve akademik takvim hakkında resmi kaynaklardan yanıt arayabilirim. Kişisel durumunuza bağlı konuları danışmanınızla doğrulayın.', questionLabel: 'Mesajınız', placeholder: 'Ders kaydıyla ilgili sorunuzu yazın…', send: 'Gönder', typing: 'Yanıt hazırlanıyor…', quickQuestions: 'Örnek sorular', charCount: n => `${n} / 500`, lowConfidence: 'Bu yanıt için kaynak eşleşmesi sınırlı olabilir. Resmi kaynakları ve danışmanınızı kontrol edin.', errorFallback: 'Bir sorun oluştu. Lütfen tekrar deneyin.',
      guidesTitle: 'Ders Kayıt Rehberi', guides: {
        '/rehber/ders-kayit': { title: 'Ders Kayıt', intro: 'Ders seçimi, kayıt yenileme ve kayıt sırasında karşılaşabileceğiniz konular için üniversitenin yayımladığı kaynaklara göz atın.', questions: ['Ders kaydımı nasıl tamamlarım?', 'Ders kaydımı geç yapabilir miyim?', 'Seçmek istediğim dersi bulamıyorum, ne yapmalıyım?', 'Ders kaydında danışmanımın rolü nedir?'] },
        '/rehber/ekle-birak': { title: 'Ekle/Bırak', intro: 'Ekleme-bırakma dönemi ve ders değişiklikleriyle ilgili sorularınızı resmi kaynaklar üzerinden inceleyin.', questions: ['Ekle-bırak ne zaman?', 'Ekle-bırak döneminde dersimi değiştirebilir miyim?', 'Ekle-bırak işlemi için danışman onayı gerekir mi?', 'Ders kaydımı ekle-bırak döneminde tamamlayabilir miyim?'] },
        '/rehber/cekilme': { title: 'Dersten Çekilme', intro: 'Dersten çekilme tarihleri ve işlemleri akademik takvimde ve Öğrenci İşleri kaynaklarında açıklanır.', questions: ['Dersten nasıl çekilirim?', 'Dersten çekilme için son tarih nedir?', 'Dersten çekilme not dökümümü nasıl etkiler?'] },
        '/rehber/ders-yuku': { title: 'Ders Yükü / ECTS', intro: 'Dönemlik ders yükü; öğrencinin başarı durumu, sınıfı ve bazı durumlarda danışman değerlendirmesine göre değişebilir. Ayrıntıları yönetmelik ve Öğrenci İşleri kaynaklarından kontrol edin.', questions: ['Bir dönemde kaç ECTS alabilirim?', 'Sınamalı öğrenci kaç AKTS alabilir?', 'Üst sınıftan ders alabilir miyim?', 'Staj dersi AKTS limitine dahil mi?'] }
      },
      regulationTitle: 'Yönetmelik', handbookTitle: 'Öğrenci El Kitabı', sourcesTitle: 'Kaynaklar', sourcesDescription: 'Yanıtlar, aşağıdaki resmi ve kurumsal kaynaklardan seçilen metin parçalarına dayanır.', conflictNote: 'Kaynaklar arasında farklılık varsa yönetmelik en yüksek önceliğe sahiptir; ardından resmi üniversite sayfaları ve öğrenci el kitabı gelir.', openOfficial: 'Resmi kaynağı aç', chunks: 'parça', language: 'Dil', authority: 'Öncelik', regulationAuthority: 'Yönetmelik (en yüksek öncelik)', officialAuthority: 'Resmi sayfa', handbookAuthority: 'El kitabı (en düşük öncelik)', turkish: 'Türkçe', english: 'İngilizce',
      contactTitle: 'İletişim', contactDescription: 'Sorunuzun resmi kaynaklarda yanıtı yoksa ilgili birimle iletişime geçebilirsiniz.', studentAffairs: 'Öğrenci İşleri Müdürlüğü', computerEngineering: 'Bilgisayar Mühendisliği Bölümü', phone: 'Telefon', email: 'E-posta', website: 'Web sitesi', supportPortal: 'Destek portalı',
      startsIn: n => `${n} gün sonra başlıyor`, tomorrow: 'Yarın başlıyor', startsToday: 'Bugün başlıyor', ongoingDays: n => `Devam ediyor – ${n} gün kaldı`, endsToday: 'Bugün bitiyor', dateRange: 'Tarih aralığı', semester: 'Dönem', noSource: 'Kaynak bilgisi yüklenemedi.'
    },
    en: {
      sidebar: 'Main menu', hamburger: 'Open menu', assistantLabel: 'Student Assistant', menuSearch: 'Search menu…', general: 'General', assistantNav: 'Assistant', calendarNav: 'Academic Calendar', guideNav: 'Course Registration Guide', registrationNav: 'Course Registration', addDropNav: 'Add/Drop', withdrawalNav: 'Course Withdrawal', loadNav: 'Course Load / ECTS', regulationNav: 'Regulation', handbookNav: 'Student Handbook', sourcesNav: 'Sources', contactNav: 'Contact', demoMode: 'Demo Mode', footer: 'This is not an official Yaşar University system; it is a student project based on official sources.',
      home: 'Home', announcement: 'Academic calendar', localDemo: 'Local demo', loading: 'Loading…', homeEyebrow: 'Course registration assistant', homeTitle: 'Hello, how can we help?', homeDescription: 'Find information about registration, the academic calendar, and official university sources.',
      information: 'Notice', close: 'Dismiss notice', upcoming: 'Upcoming date', datesTitle: 'Key dates from the academic calendar', knowledge: 'Knowledge base', courseRegistration: 'Course Registration', addDrop: 'Add/Drop', withdrawal: 'Course Withdrawal', lastClass: 'Last Day of Classes', finals: 'Final Exams', sourcesCount: 'sources', chunksCount: 'chunks', apiReady: 'ready', apiMissing: 'not set', noUpcoming: 'No upcoming date found.',
      quickAccess: 'Quick Access', quickDescription: 'Choose a common topic to start a chat.', askWithdrawal: 'How do I withdraw from a course?', askLoad: 'How many ECTS can I take in a semester?', askAddDrop: 'When is add/drop?', askAdvisor: 'How do I get advisor approval?', askRepeat: 'What are the course repeat rules?', askContact: 'How can I contact Student Affairs?',
      calendarTitle: 'Academic Calendar', calendarDescription: 'Dates from the 2026–2027 associate and undergraduate academic calendar.', fall: 'Fall', spring: 'Spring', summer: 'Summer', holidays: 'Public holidays', past: 'Past', ongoing: 'Ongoing', next: 'Next', calendarPdf: 'Open the official academic calendar PDF', date: 'Date', event: 'Event', status: 'Status',
      chatTitle: 'Course registration assistant', chatDescription: 'Answers are based on official university sources.', welcome: 'Hello! I can look up official sources for course registration rules, ECTS load, advisor approval, and the academic calendar. Please confirm questions that depend on your circumstances with your advisor.', questionLabel: 'Your message', placeholder: 'Ask a course registration question…', send: 'Send', typing: 'Preparing an answer…', quickQuestions: 'Example questions', charCount: n => `${n} / 500`, lowConfidence: 'The source match for this answer may be limited. Check official sources and your advisor.', errorFallback: 'Something went wrong. Please try again.',
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
  let calendarData = { today: new Date().toISOString().slice(0,10), isDemoDate: false, events: [] };
  let sourcesData = { sources: [], totalChunks: 0 };
  let healthData = { ok:false, model:'—', hasKey:false, chunks:0 };
  let chatEntries = [];
  let conversationHistory = [];
  let pendingQuestion = '';
  let waiting = false;
  let alertDismissed = false;
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
  function eventSemester(event) {
    if (/Güz|Fall/i.test(event.event+' '+event.event_en)) return t('fall');
    if (/Bahar|Spring/i.test(event.event+' '+event.event_en)) return t('spring');
    if (/Yaz|Summer/i.test(event.event+' '+event.event_en)) return t('summer');
    return '2026–2027';
  }
  function upcoming(events) {
    const active = events.filter(e => e.start <= calendarData.today && e.end >= calendarData.today).sort((a,b)=>a.end.localeCompare(b.end));
    if (active.length) return active[0];
    return events.filter(e=>e.start>calendarData.today).sort((a,b)=>a.start.localeCompare(b.start))[0] || null;
  }
  function matchingEvent(regex) { return upcoming(calendarData.events.filter(e=>regex.test(e.event))); }
  function getDeadlineCards() {
    return [
      {key:'courseRegistration',icon:'register',gradient:'gradient-pink',event:matchingEvent(/Ders Kayıtları/i)},
      {key:'addDrop',icon:'drop',gradient:'gradient-green',event:matchingEvent(/Ders Ekleme-Çıkarma/i)},
      {key:'withdrawal',icon:'arrow',gradient:'gradient-blue',event:matchingEvent(/Dersten Çekilme Son Tarih/i)},
      {key:'lastClass',icon:'calendar',gradient:'gradient-yellow',event:matchingEvent(/Derslerin Sona Ermesi/i)},
      {key:'finals',icon:'finals',gradient:'gradient-purple',event:matchingEvent(/Dönem Sonu Sınavları/i)}
    ];
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
    $('announcement-count').textContent = String(announcementCount());
    $('announcement-count').setAttribute('aria-label',String(announcementCount()));
    $('session-pill').textContent = `${calendarData.isDemoDate ? (lang==='tr'?'Demo tarihi: ':'Demo date: ') : (lang==='tr'?'Tarih: ':'Date: ')}${new Intl.DateTimeFormat(lang==='tr'?'tr-TR':'en-GB',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}).format(dateObj(calendarData.today))}`;
  }
  function updateLocalizedChrome() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(node=>{ const key=node.dataset.i18n; if(TEXT[lang][key]) node.textContent=TEXT[lang][key]; });
    $('menu-search').placeholder=t('menuSearch');
    $('sidebar').setAttribute('aria-label',t('sidebar'));
    $('sidebar-toggle').setAttribute('aria-label',t('hamburger'));
    $('home-button').setAttribute('aria-label',t('home'));
    $('home-button').title=t('home');
    $('announcements-button').setAttribute('aria-label',t('announcement'));
    $('announcements-button').title=t('announcement');
    $('page-footer').textContent=t('footer');
    $('demo-mode-label').textContent=t('demoMode');
    $('assistant-label').textContent=t('assistantLabel');
    $('menu-caption').textContent=t('general');
    $('sidebar-status').textContent=t('localDemo');
    document.querySelectorAll('.language-switch button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===lang)));
    updateHeader();
  }
  function renderAlert() {
    if(alertDismissed) return '';
    const event=nearestAlertEvent();
    if(!event) return `<section class="alert-banner"><span class="alert-icon">${icon('warning')}</span><div class="alert-copy"><strong>${esc(t('information'))}</strong> ${esc(t('noUpcoming'))}</div><button class="alert-close" type="button" aria-label="${esc(t('close'))}" data-dismiss-alert>×</button></section>`;
    const endText=dateShort(event.end);
    const title=lang==='tr' ? event.event : event.event_en;
    const copy=lang==='tr' ? `${title} ${countdown(event).toLocaleLowerCase('tr-TR')} (${endText}).` : `${title} ${countdown(event).toLowerCase()} (${endText}).`;
    return `<section class="alert-banner"><span class="alert-icon">${icon('warning')}</span><div class="alert-copy"><strong>${esc(t('information'))}</strong> ${esc(copy)}</div><button class="alert-close" type="button" aria-label="${esc(t('close'))}" data-dismiss-alert>×</button></section>`;
  }
  const QUICK = [
    {key:'askWithdrawal',icon:'arrow',tone:'icon-pink'}, {key:'askLoad',icon:'stack',tone:'icon-green'}, {key:'askAddDrop',icon:'drop',tone:'icon-blue'},
    {key:'askAdvisor',icon:'advisor',tone:'icon-yellow'}, {key:'askRepeat',icon:'repeat',tone:'icon-purple'}, {key:'askContact',icon:'phone',tone:'icon-green'}
  ];
  function quickLink(item) {
    const title=t(item.key);
    return `<a class="quick-link" href="#/asistan" data-ask="${esc(title)}"><span class="quick-icon ${item.tone}">${icon(item.icon)}</span><span class="quick-text"><strong>${esc(title)}</strong><small>${esc(lang==='tr'?'Resmi kaynaklara dayalı yanıt':'Answer from official sources')}</small></span><span class="quick-chevron">›</span></a>`;
  }
  function deadlineCard(item) {
    const ev=item.event;
    return `<article class="info-card ${item.gradient}"><div class="info-card-top"><span class="card-icon">${icon(item.icon)}</span><div><p class="card-label">${esc(t('upcoming'))}</p><h3>${esc(t(item.key))}</h3></div></div>${ev?`<p class="info-detail">${esc(rangeLong(ev))}</p><p class="info-meta">${esc(countdown(ev))} · ${esc(eventSemester(ev))}</p>`:`<p class="info-detail">${esc(t('noUpcoming'))}</p>`}</article>`;
  }
  function knowledgeCard() {
    const count=sourcesData.sources.length, chunks=sourcesData.totalChunks || healthData.chunks || 0;
    return `<article class="info-card gradient-blue"><div class="info-card-top"><span class="card-icon">${icon('source')}</span><div><p class="card-label">${esc(t('knowledge'))}</p><h3>${esc(t('sourcesNav'))}</h3></div></div><div class="knowledge-lines"><p class="info-detail">${count} ${esc(t('sourcesCount'))} · ${chunks} ${esc(t('chunksCount'))}</p><p class="info-meta">${esc(healthData.model||'—')} · ${esc(lang==='tr'?'API anahtarı':'API key')}: ${esc(healthData.hasKey?t('apiReady'):t('apiMissing'))}</p></div></article>`;
  }
  function renderHome() {
    const deadlines=getDeadlineCards();
    return `<div class="main-content"><div class="page-head"><div><p class="eyebrow">${esc(t('homeEyebrow'))}</p><h1 class="page-title">${esc(t('homeTitle'))}</h1><p class="page-description">${esc(t('homeDescription'))}</p></div></div>${renderAlert()}<h2 class="section-title">${esc(t('datesTitle'))}</h2><div class="info-grid">${deadlines.map(deadlineCard).join('')}${knowledgeCard()}</div><h2 class="section-title">${esc(t('quickAccess'))}</h2><p class="section-subtitle">${esc(t('quickDescription'))}</p><div class="quick-grid">${QUICK.map(quickLink).join('')}</div></div>`;
  }

  const CHAT_QUICK=[
    ['askLoad','stack','icon-green'],['askAddDrop','drop','icon-blue'],['askWithdrawal','arrow','icon-pink'],['askAdvisor','advisor','icon-yellow']
  ];
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
    return `<div class="source-cards">${cards.map((source,i)=>`<article class="chat-source-card"><strong>${esc(source.title||'')}</strong>${source.article?`<span>${esc(source.article)}</span>`:''}${source.url?`<a href="${safeUrl(source.url)}" target="_blank" rel="noopener noreferrer">${esc(t('openOfficial'))}</a>`:''}</article>`).join('')}</div>`;
  }
  function renderChatEntries() {
    const log=$('chat-log');if(!log)return;
    const entries=chatEntries.length?chatEntries:[{role:'assistant',content:t('welcome'),welcome:true}];
    log.innerHTML=entries.map(entry=>{
      const role=entry.role==='user'?'user':'assistant';
      const text=entry.welcome?t('welcome'):entry.content;
      const body=role==='user'?`<div class="bubble"></div>`:`<div class="bubble">${safeMarkdown(text)}</div>${sourceCards(entry.sources)}`;
      const warning=entry.lowConfidence?`<p class="chat-warning">${esc(t('lowConfidence'))}</p>`:'';
      return `<div class="message-row ${role}"><div class="chat-avatar" aria-hidden="true">${role==='user'?(lang==='tr'?'S':'Y'):'A'}</div><div class="message-body">${body}${warning}</div></div>`;
    }).join('');
    for(const [i,entry] of entries.entries())if(entry.role==='user')log.children[i].querySelector('.bubble').textContent=entry.content;
    if(waiting){const row=document.createElement('div');row.className='message-row assistant';row.id='typing-row';row.innerHTML=`<div class="chat-avatar" aria-hidden="true">A</div><div class="bubble typing-bubble" aria-label="${esc(t('typing'))}"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>`;log.appendChild(row);}
    log.scrollTop=log.scrollHeight;
  }
  function renderChat() {
    return `<div class="main-content"><div class="page-head"><div><p class="eyebrow">${esc(t('assistantNav'))}</p><h1 class="page-title">${esc(t('chatTitle'))}</h1><p class="page-description">${esc(t('chatDescription'))}</p></div></div><section class="surface-card chat-card"><div class="chat-card-head"><div><h2>${esc(t('chatTitle'))}</h2><p>${esc(t('chatDescription'))}</p></div><span class="card-icon">${icon('chat')}</span></div><div class="chat-log" id="chat-log" aria-live="polite" aria-relevant="additions text"></div><div class="chat-composer"><div class="quick-grid chat-quick-grid">${CHAT_QUICK.map(([key,ico,tone])=>`<a class="quick-link" href="#/asistan" data-ask="${esc(t(key))}"><span class="quick-icon ${tone}">${icon(ico)}</span><span class="quick-text"><strong>${esc(t(key))}</strong></span></a>`).join('')}</div><form id="chat-form"><label class="sr-only" for="chat-input">${esc(t('questionLabel'))}</label><textarea id="chat-input" maxlength="500" rows="2" placeholder="${esc(t('placeholder'))}" ${waiting?'disabled':''}></textarea><div class="composer-bottom"><span id="char-counter" class="char-counter">${esc(t('charCount')(0))}</span><button class="send-button" id="chat-send" type="submit" ${waiting?'disabled':''}><span>${esc(t('send'))}</span>${icon('arrow')}</button></div></form></div></section></div>`;
  }
  async function sendMessage(value) {
    const message=String(value||'').trim();if(!message||waiting)return;
    chatEntries.push({role:'user',content:message});waiting=true;renderChatEntries();
    const input=$('chat-input');if(input){input.value='';input.disabled=true;}const counter=$('char-counter');if(counter){counter.textContent=t('charCount')(0);counter.classList.remove('over');}
    const send=$('chat-send');if(send)send.disabled=true;
    try{
      const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,history:conversationHistory.slice(-6),lang})});
      let data;try{data=await response.json();}catch{data=null;}
      if(!response.ok||data?.error){chatEntries.push({role:'assistant',content:data?.answer||t('errorFallback'),error:true});}
      else{
        const answer=typeof data?.answer==='string'?data.answer:t('errorFallback');
        chatEntries.push({role:'assistant',content:answer,sources:Array.isArray(data?.sources)?data.sources:[],lowConfidence:Boolean(data?.lowConfidence)});
        conversationHistory.push({role:'user',content:message},{role:'assistant',content:answer});conversationHistory=conversationHistory.slice(-6);
      }
    }catch{chatEntries.push({role:'assistant',content:t('errorFallback'),error:true});}
    finally{waiting=false;renderChatEntries();const next=$('chat-input');if(next){next.disabled=false;next.focus();}const button=$('chat-send');if(button)button.disabled=false;}
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
    return `<div class="main-content"><div class="page-head"><div><p class="eyebrow">${esc(t('calendarNav'))}</p><h1 class="page-title">${esc(t('calendarTitle'))}</h1><p class="page-description">${esc(t('calendarDescription'))}</p></div></div><section class="surface-card"><div class="calendar-groups">${entries||`<p class="empty-note">${esc(t('noUpcoming'))}</p>`}</div>${source?`<a class="calendar-link" href="${safeUrl(source.url)}" target="_blank" rel="noopener noreferrer">${icon('file')}${esc(t('calendarPdf'))}</a>`:''}</section></div>`;
  }
  function renderGuide(path) {
    const data=TEXT[lang].guides[path];if(!data)return renderHome();
    const quicks=data.questions.map(q=>`<button class="guide-question" type="button" data-ask="${esc(q)}"><span>${esc(q)}</span><span>›</span></button>`).join('');
    return `<div class="main-content"><div class="page-head"><div><p class="eyebrow">${esc(t('guidesTitle'))}</p><h1 class="page-title">${esc(data.title)}</h1></div></div><div class="guide-layout"><section class="surface-card"><p>${esc(data.intro)}</p><div class="question-list">${quicks}</div></section><aside class="guide-callout">${esc(lang==='tr'?'Yanıtlar resmi kaynaklarla sınırlıdır. Kayıt kararlarınızı akademik danışmanınızla doğrulayın.':'Answers are limited to official sources. Confirm registration decisions with your academic advisor.')}</aside></div></div>`;
  }
  function authorityLabel(level) { return level===1?t('regulationAuthority'):level===2?t('officialAuthority'):t('handbookAuthority'); }
  function renderSourceCards(list) {
    if(!list.length)return `<section class="surface-card"><p class="empty-note">${esc(t('noSource'))}</p></section>`;
    return `<div class="source-grid">${list.map(source=>`<article class="source-card"><h2 class="source-title">${esc(source.title)}</h2><p class="source-subtitle">${esc(source.short_title||'')}</p><div class="source-facts"><span class="source-fact">${esc(authorityLabel(source.authority))}</span><span class="source-fact">${source.language==='tr'?esc(t('turkish')):esc(t('english'))}</span><span class="source-fact">${source.chunks} ${esc(t('chunks'))}</span></div><a class="source-open" href="${safeUrl(source.url)}" target="_blank" rel="noopener noreferrer">${esc(t('openOfficial'))}</a></article>`).join('')}</div>`;
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
    document.querySelectorAll('[data-route]').forEach(link=>link.classList.toggle('active',link.dataset.route===path));
    const isGuide=path.startsWith('/rehber/');
    if(isGuide)guideExpanded=true;
    $('guide-toggle').setAttribute('aria-expanded',String(guideExpanded));
    $('guide-submenu').hidden=!guideExpanded;
    document.querySelectorAll('.nav-link,.nav-group-toggle,.nav-submenu a').forEach(link=>link.removeAttribute('aria-current'));
    const current=document.querySelector(`[data-route="${CSS.escape(path)}"]`);if(current)current.setAttribute('aria-current','page');
    if(isGuide)$('guide-toggle').classList.add('active');else $('guide-toggle').classList.remove('active');
  }
  function closeSidebar() { $('sidebar').classList.remove('open');$('sidebar-scrim').classList.remove('open');$('sidebar-toggle').setAttribute('aria-expanded','false'); }
  function currentRoute() { const raw=location.hash.replace(/^#/, '')||'/';return raw.startsWith('/')?raw:`/${raw}`; }
  function renderRoute() {
    route=currentRoute();
    setActiveNavigation(route);
    const main=$('main-area');
    let html;
    if(route==='/')html=renderHome();
    else if(route==='/asistan')html=renderChat();
    else if(route==='/takvim')html=renderCalendar();
    else if(TEXT[lang].guides[route])html=renderGuide(route);
    else if(route==='/yonetmelik')html=renderSourcesPage('regulation');
    else if(route==='/el-kitabi')html=renderSourcesPage('handbook');
    else if(route==='/kaynaklar')html=renderSourcesPage('all');
    else if(route==='/iletisim')html=renderContacts();
    else html=renderHome();
    main.innerHTML=html;
    main.scrollTop=0;
    closeSidebar();
    if(route==='/'){
      main.querySelector('[data-dismiss-alert]')?.addEventListener('click',()=>{alertDismissed=true;main.querySelector('.alert-banner')?.remove();});
    }
    if(route==='/asistan'){
      renderChatEntries();
      const form=$('chat-form'),input=$('chat-input');
      if(input){input.addEventListener('input',()=>{$('char-counter').textContent=t('charCount')(input.value.length);$('char-counter').classList.toggle('over',input.value.length>=500);});input.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();form.requestSubmit();}});}
      if(form)form.addEventListener('submit',event=>{event.preventDefault();sendMessage(input.value);});
      if(pendingQuestion){const question=pendingQuestion;pendingQuestion='';setTimeout(()=>sendMessage(question),0);}
    }
    main.querySelectorAll('[data-ask]').forEach(node=>node.addEventListener(node.tagName==='A'?'click':'click',event=>{event.preventDefault();askFromAnywhere(node.dataset.ask);}));
  }
  function askFromAnywhere(question) {
    pendingQuestion=question;
    if(currentRoute()==='/asistan')renderRoute();else location.hash='#/asistan';
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
    if(calendarResult.status==='fulfilled')calendarData=calendarResult.value;
    if(sourcesResult.status==='fulfilled')sourcesData=sourcesResult.value;
    if(healthResult.status==='fulfilled')healthData=healthResult.value;
    updateHeader();
    if(['/','/takvim','/yonetmelik','/el-kitabi','/kaynaklar'].includes(currentRoute()))renderRoute();
  }

  document.querySelectorAll('.language-switch button').forEach(button=>button.addEventListener('click',()=>{
    lang=button.dataset.language;try{localStorage.setItem('regibot-language',lang);}catch{}
    updateLocalizedChrome();renderRoute();
  }));
  $('sidebar-toggle').addEventListener('click',()=>{const open=!$('sidebar').classList.contains('open');$('sidebar').classList.toggle('open',open);$('sidebar-scrim').classList.toggle('open',open);$('sidebar-toggle').setAttribute('aria-expanded',String(open));});
  $('sidebar-scrim').addEventListener('click',closeSidebar);
  $('home-button').addEventListener('click',()=>{location.hash='#/';});
  $('announcements-button').addEventListener('click',()=>{location.hash='#/takvim';});
  $('guide-toggle').addEventListener('click',()=>{guideExpanded=!guideExpanded;$('guide-submenu').hidden=!guideExpanded;$('guide-toggle').setAttribute('aria-expanded',String(guideExpanded));});
  $('menu-search').addEventListener('input',applyMenuSearch);
  window.addEventListener('hashchange',renderRoute);
  window.addEventListener('keydown',event=>{if(event.key==='Escape')closeSidebar();});
  document.querySelectorAll('[data-icon]').forEach(node=>{node.innerHTML=icon(node.dataset.icon);});
  updateLocalizedChrome();renderRoute();loadData();
})();
