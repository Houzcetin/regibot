const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const chunks = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/chunks.json'), 'utf8'));
const calendar = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/calendar.json'), 'utf8'));
const sources = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources.json'), 'utf8'));

const STOPWORDS = new Set(('ve veya ile bir bu şu için mi mu mı mü ne nasıl ben benim sen senin o da de ki ama çok daha en gibi kadar hangi nerede neden niçin olarak olan olanı var yok mıydı the a an of to in is can i my do how what when where why who which and or with from on for are was were be have has had it this that these those your you me about does take get course courses can').split(/\s+/).map(fold));
const EXPANSIONS = {
  ects: 'akts kredi', akts: 'ects kredi', credit: 'kredi ects akts', kredi: 'credit ects akts',
  'add/drop': 'ekleme birakma cikarma ekle birak', add: 'ekle ekleme', drop: 'birak birakma cikarma',
  withdraw: 'cekilme', withdrawal: 'cekilme', advisor: 'danisman', approval: 'onay', gpa: 'not ortalamasi genel not',
  repeat: 'tekrar', retake: 'tekrar', failed: 'basarisiz', prerequisite: 'on kosul', tuition: 'ucret ogretim bedeli', fee: 'ucret ogretim bedeli',
  registration: 'kayit kaydi', register: 'kayit kaydi', enroll: 'kayit kaydi', semester: 'donem', probation: 'sinamali',
  successful: 'basarili', transcript: 'not dokum', internship: 'staj', 'double major': 'cift anadal', minor: 'yan dal',
  exam: 'sinav donem sonu', final: 'sinav donem sonu', attendance: 'devam', holiday: 'tatil bayram', calendar: 'takvim tarih son tarih',
  date: 'takvim tarih son tarih', deadline: 'son tarih', 'leave of absence': 'donem izni kayit dondurma', freeze: 'donem izni kayit dondurma',
  'higher semester': 'ust sinif', 'upper class': 'ust sinif', lower: 'alt sinif', contact: 'iletisim telefon', phone: 'iletisim telefon', email: 'iletisim',
  'student affairs': 'ogrenci isleri', curriculum: 'mufredat', conflict: 'cakisma', overlap: 'cakisma', quota: 'kota kontenjan', capacity: 'kota kontenjan',
  danisman: 'advisor', onay: 'approval', tekrar: 'repeat retake', basarisiz: 'failed', 'on kosul': 'prerequisite', ucret: 'tuition fee', kayit: 'registration register enroll', donem: 'semester',
  sinamali: 'probation', basarili: 'successful', 'not dokum': 'transcript', staj: 'internship', anadal: 'major', 'yan dal': 'minor', sinav: 'exam final', devam: 'attendance',
  tatil: 'holiday', takvim: 'calendar date deadline', tarih: 'calendar date deadline', 'son tarih': 'deadline', 'kayit dondurma': 'freeze leave', 'ust sinif': 'higher semester upper class',
  'alt sinif': 'lower', iletisim: 'contact phone email', 'ogrenci isleri': 'student affairs', mufredat: 'curriculum', cakisma: 'conflict overlap', kontenjan: 'quota capacity',
  ekleme: 'add drop', birakma: 'add drop', cikarma: 'add drop', cekilme: 'withdraw withdrawal',
  ortalama: 'gpa grade point average', 'genel not': 'gpa grade point average', 'not ortalamasi': 'gpa grade point average',
  'ogretim bedeli': 'tuition fee', bedeli: 'tuition fee', kaydi: 'registration register enroll',
  'cift anadal': 'double major', 'yan dal': 'minor', bayram: 'holiday', 'donem izni': 'leave of absence',
  telefon: 'contact phone email', email: 'contact phone', kota: 'quota capacity'
};

function fold(value) {
  return String(value || '').toLocaleLowerCase('tr').replace(/[ı]/g, 'i').replace(/[ş]/g, 's').replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c').replace(/[â]/g, 'a').replace(/[î]/g, 'i').replace(/[û]/g, 'u');
}
function tokens(value) {
  return fold(value).split(/[^a-z0-9]+/).filter(Boolean).filter(t => !STOPWORDS.has(t)).map(t => t.length >= 6 ? t.slice(0, 5) : t);
}
function expandedTokens(value) {
  const base = tokens(value), result = [...base];
  const folded = fold(value);
  for (const [term, expansion] of Object.entries(EXPANSIONS)) {
    const termTokens = tokens(term);
    if (folded.includes(fold(term)) || (termTokens.length === 1 && base.includes(termTokens[0]))) result.push(...tokens(expansion));
  }
  return result;
}
const index = chunks.map(chunk => {
  const heading = chunk.heading || '';
  const terms = [...expandedTokens(heading), ...expandedTokens(heading), ...expandedTokens(chunk.text || ''), ...expandedTokens(chunk.article || '')];
  const tf = new Map();
  for (const term of terms) tf.set(term, (tf.get(term) || 0) + 1);
  return { chunk, tf, length: terms.length };
});
const avgdl = index.reduce((n, doc) => n + doc.length, 0) / Math.max(1, index.length);
const df = new Map();
for (const doc of index) for (const term of doc.tf.keys()) df.set(term, (df.get(term) || 0) + 1);
const LOW_SCORE = 3.5;

function search(query, { k = 5, lang } = {}) {
  const q = [...new Set(expandedTokens(query))];
  if (!q.length) return [];
  const scored = index.map(doc => {
    let score = 0;
    let matchedTerms = 0;
    for (const term of q) {
      const tf = doc.tf.get(term) || 0;
      if (!tf) continue;
      matchedTerms++;
      const n = index.length, dft = df.get(term) || 0;
      const idf = Math.log(1 + (n - dft + 0.5) / (dft + 0.5));
      score += idf * (tf * 2.5) / (tf + 1.5 * (1 - 0.75 + 0.75 * doc.length / avgdl));
    }
    score *= matchedTerms / q.length;
    if (lang && doc.chunk.language === lang) score *= 1.15;
    return { chunk: doc.chunk, score };
  }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);
  const result = [], counts = new Map();
  for (const hit of scored) {
    const source = hit.chunk.source_id, count = counts.get(source) || 0;
    if (count >= 3) continue;
    result.push(hit); counts.set(source, count + 1);
    if (result.length >= k) break;
  }
  return result;
}
function isDateQuestion(query) {
  return /(tarih|ne zaman|when|date|deadline|son gun|takvim|calendar|baslangic|basliyor|bitiyor|ends|starts|kac gun|how many days|tatil|holiday|hafta|week|final|sinav takvim|add[\s/-]*drop|ekle[\s/-]*birak|ekleme[\s/-]*cikarma|kayit yenileme|cekilme son)/i.test(fold(query));
}
function dayDiff(date, today) {
  return Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000);
}
function matchCalendar(query, today, { limit = 8 } = {}) {
  const q = new Set(expandedTokens(query));
  const scored = calendar.map(event => {
    const terms = new Set(tokens(`${event.event} ${event.event_en}`));
    const overlap = [...q].filter(t => terms.has(t)).length;
    return { event, overlap, daysUntilStart: dayDiff(event.start, today), daysUntilEnd: dayDiff(event.end, today) };
  });
  const matches = scored.filter(x => x.overlap > 0).sort((a, b) => b.overlap - a.overlap || a.event.start.localeCompare(b.event.start));
  if (matches.length) return matches.slice(0, limit);
  return scored.filter(x => x.event.end >= today).sort((a, b) => a.event.start.localeCompare(b.event.start)).slice(0, Math.min(6, limit));
}

module.exports = { search, isDateQuestion, matchCalendar, LOW_SCORE, fold, tokens, chunks, calendar, sources };

if (require.main === module) {
  const query = process.argv.slice(2).join(' ');
  if (!query) { console.error('Usage: node lib/retrieval.js "query"'); process.exitCode = 1; }
  else {
    for (const { chunk, score } of search(query, { k: 8 })) console.log(`${chunk.id}\t${score.toFixed(3)}\t${chunk.heading || '(no heading)'}`);
    if (isDateQuestion(query)) console.log('CALENDAR', matchCalendar(query, new Date().toISOString().slice(0, 10)).map(x => `${x.event.event_en} (${x.event.start}–${x.event.end})`).join(' | '));
  }
}
