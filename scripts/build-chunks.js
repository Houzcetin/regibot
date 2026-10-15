// Rebuilds data/chunks.json from the raw texts listed in data/sources.json.
//
// - "regulation" sources are split per article (MADDE / ARTICLE). An article is never cut
//   in the middle of a paragraph; articles longer than MAX_WORDS are split at paragraph
//   boundaries and every piece keeps the same article label.
// - "sections" sources use "=== Heading" lines as section boundaries; inside a section,
//   sub-headings and FAQ questions start new units, which are merged up to MAX_WORDS.
// - "handbook" sources take their section headings from the table of contents; each section
//   becomes one chunk (long ones split at paragraph breaks). The welcome letters signed by
//   named individuals are skipped, and lines with personal titles or e-mails are dropped.
// - "plain" sources are split by paragraphs only.
const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'data');
const MAX_WORDS = 300;
const MIN_WORDS = 150;

const words = (s) => s.split(/\s+/).filter(Boolean).length;

// Join PDF-wrapped lines back into paragraphs. A new paragraph starts at "(1)", "a)", "- " etc.
function toParagraphs(lines) {
  const paras = [];
  for (const raw of lines) {
    const line = raw.replace(/\s+/g, ' ').trim();
    if (!line) continue;
    const startsNew = /^(\(\d+\)|[a-zçğıöşü]\)|- |\d+\. |[IVX]+-|(GEÇİCİ )?MADDE|(PROVISIONAL )?ARTICLE)/.test(line);
    if (!paras.length || startsNew) paras.push(line);
    else paras[paras.length - 1] += ' ' + line;
  }
  return paras;
}

// Split a list of paragraphs into groups of at most MAX_WORDS (a single oversized paragraph stays whole).
function packParagraphs(paras, max = MAX_WORDS) {
  const groups = [];
  let cur = [];
  let n = 0;
  for (const p of paras) {
    const w = words(p);
    if (cur.length && n + w > max) {
      groups.push(cur);
      cur = [];
      n = 0;
    }
    cur.push(p);
    n += w;
  }
  if (cur.length) groups.push(cur);
  // Fold a small trailing group into the previous one when that keeps it reasonably sized.
  if (groups.length > 1) {
    const last = groups[groups.length - 1];
    const prev = groups[groups.length - 2];
    if (words(last.join(' ')) < MIN_WORDS / 2 && words(prev.join(' ')) + words(last.join(' ')) <= MAX_WORDS * 1.2) {
      prev.push(...groups.pop());
    }
  }
  return groups;
}

const isHeadingLike = (line) => {
  const t = line.trim();
  return t && words(t) <= 10 && (!/[.,;:]$/.test(t) || (/:$/.test(t) && words(t) <= 3)) && !/^\(\d+\)/.test(t) && !/^[a-zçğıöşü]\)/.test(t);
};
const isPartHeader = (line) => /^(BİRİNCİ|İKİNCİ|ÜÇÜNCÜ|DÖRDÜNCÜ|BEŞİNCİ|ALTINCI|YEDİNCİ|SEKİZİNCİ|DOKUZUNCU|ONUNCU) BÖLÜM$|^SECTION [A-Z]+$/.test(line.trim());

function chunkRegulation(src, text) {
  const lines = text.split('\n');
  const tr = src.language === 'tr';
  const startRe = tr ? /^(GEÇİCİ MADDE|MADDE)\s*(\d+)\s*[-–]/ : /^(PROVISIONAL ARTICLE|ARTICLE)\s*(\d+)\s*[-–]/;
  const starts = [];
  lines.forEach((l, i) => {
    const m = l.trim().match(startRe);
    if (m) starts.push({ i, provisional: /GEÇİCİ|PROVISIONAL/.test(m[1]), num: m[2] });
  });

  const chunks = [];
  starts.forEach((s, k) => {
    const end = k + 1 < starts.length ? starts[k + 1].i : lines.length;
    let body = lines.slice(s.i, end);
    // Drop trailing heading lines that belong to the next article / part (e.g. "Ders yükü", "İKİNCİ BÖLÜM").
    while (body.length > 1 && (isHeadingLike(body[body.length - 1]) || isPartHeader(body[body.length - 1]) || !body[body.length - 1].trim())) {
      body.pop();
    }
    // The article's own heading is the heading-like line right above it.
    let heading = null;
    for (let j = s.i - 1; j >= 0 && j >= s.i - 3; j--) {
      const l = lines[j].trim();
      if (!l) continue;
      if (isHeadingLike(l) && !isPartHeader(l)) heading = l.replace(/:$/, '');
      break;
    }
    const label = tr
      ? `${s.provisional ? 'Geçici Madde' : 'Madde'} ${s.num}`
      : `${s.provisional ? 'Provisional Article' : 'Article'} ${s.num}`;
    const groups = packParagraphs(toParagraphs(body));
    groups.forEach((g, gi) => {
      chunks.push({
        id: `${src.id}-${s.provisional ? 'g' : ''}m${s.num}${groups.length > 1 ? `-${gi + 1}` : ''}`,
        source_id: src.id,
        article: label,
        title: src.title,
        heading: heading ? `${heading}${groups.length > 1 ? ` (${gi + 1}/${groups.length})` : ''}` : null,
        text: g.join('\n'),
        url: src.url,
        language: src.language,
      });
    });
  });
  return chunks;
}

function chunkSections(src, text) {
  const sections = [];
  let cur = null;
  for (const line of text.split('\n')) {
    const m = line.match(/^=== (.+)$/);
    if (m) {
      cur = { title: m[1].trim(), lines: [] };
      sections.push(cur);
    } else if (cur) {
      cur.lines.push(line);
    } else {
      sections.push((cur = { title: null, lines: [line] }));
    }
  }

  const chunks = [];
  for (const sec of sections) {
    const lines = sec.lines.map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean);
    if (!lines.length || words(lines.join(' ')) < 5) continue;
    // Units: a sub-heading or a question line starts a new unit.
    const units = [];
    for (const l of lines) {
      const startsUnit = /\?$/.test(l) || (isHeadingLike(l) && !/^- /.test(l) && words(l) <= 8);
      if (!units.length || (startsUnit && units[units.length - 1].length > 1)) units.push([l]);
      else units[units.length - 1].push(l);
    }
    // Merge units up to MAX_WORDS; split an oversized unit by lines.
    const blocks = units.map((u) => u.join('\n'));
    const groups = packParagraphs(blocks.flatMap((b) => (words(b) > MAX_WORDS ? packParagraphs(b.split('\n')).map((g) => g.join('\n')) : [b])));
    const anchor = src.section_anchors && sec.title ? src.section_anchors[sec.title] : null;
    groups.forEach((g, gi) => {
      chunks.push({
        id: `${src.id}-${chunks.length + 1}`,
        source_id: src.id,
        article: null,
        title: src.title,
        heading: sec.title ? `${sec.title}${groups.length > 1 ? ` (${gi + 1}/${groups.length})` : ''}` : null,
        text: g.join('\n'),
        url: anchor ? `${src.url}#${anchor}` : src.url,
        language: src.language,
      });
    });
  }
  return chunks;
}

// Turkish-aware key for comparing a TOC entry with a body heading ("Kayıt" vs "KAYIT").
const headingKey = (s) =>
  s.toLocaleUpperCase('tr').replace(/^\d+\.\s*/, '').replace(/[^A-ZÇĞİÖŞÜ0-9]+/g, '');

// Lines that could identify an individual (titles, personal e-mail addresses) are never indexed.
const PERSONAL_LINE = /\b(Prof|Doç|Dr|Öğr\.\s*Gör|Arş\.\s*Gör)\.|\b[a-zçğıöşü]+\.[a-zçğıöşü]+@/i;

// PDF lines -> paragraphs: a paragraph ends at sentence punctuation followed by a capitalised line or a bullet.
function proseParagraphs(lines) {
  const paras = [];
  let prevEnds = true;
  for (const raw of lines) {
    const line = raw.replace(/\s+/g, ' ').trim();
    if (!line) continue;
    const bullet = /^([•▪]|- |\d+\. )/.test(line);
    if (!paras.length || bullet || (prevEnds && /^[A-ZÇĞİÖŞÜ"“]/.test(line))) paras.push(line);
    else paras[paras.length - 1] += ' ' + line;
    prevEnds = /[.:!?…]$/.test(line);
  }
  return paras;
}

function chunkHandbook(src, text) {
  const lines = text.split('\n');
  const tocIdx = lines.map((l, i) => (/\.{5,}\s*\d+\s*$/.test(l) ? i : -1)).filter((i) => i >= 0);
  const toc = tocIdx.map((i) => lines[i].replace(/\.{5,}.*$/, '').replace(/\s+/g, ' ').trim().replace(/\s*-$/, ''));
  // Start at chapter 1: everything before it (cover, credits, welcome letters) is skipped.
  const entries = toc.slice(toc.findIndex((t) => /^1\.\s/.test(t)));

  // Locate each TOC entry as a standalone line in the body, in order.
  const body = lines.slice(tocIdx[tocIdx.length - 1] + 1);
  const found = [];
  let from = 0;
  for (const entry of entries) {
    const key = headingKey(entry);
    const at = body.findIndex((l, i) => i >= from && headingKey(l) === key);
    if (at < 0) {
      console.warn(`  [handbook] heading not found in body: "${entry}"`);
      continue;
    }
    found.push({ entry, at, chapter: /^\d+\.\s/.test(entry) });
    from = at + 1;
  }

  const chunks = [];
  let chapter = null;
  found.forEach((h, k) => {
    if (h.chapter) chapter = h.entry.replace(/^\d+\.\s*/, '');
    const end = k + 1 < found.length ? found[k + 1].at : body.length;
    const sectionLines = body.slice(h.at + 1, end).filter((l) => !PERSONAL_LINE.test(l));
    const paras = proseParagraphs(sectionLines);
    if (words(paras.join(' ')) < 5) return; // chapter title directly followed by its first section
    const name = h.chapter ? chapter : `${chapter} › ${h.entry}`;
    const groups = packParagraphs(paras);
    groups.forEach((g, gi) => {
      chunks.push({
        id: `${src.id}-${chunks.length + 1}`,
        source_id: src.id,
        article: null,
        title: src.title,
        heading: `${name}${groups.length > 1 ? ` (${gi + 1}/${groups.length})` : ''}`,
        text: g.join('\n'),
        url: src.url,
        language: src.language,
      });
    });
  });
  return chunks;
}

function chunkPlain(src, text) {
  const paras = text.split(/\n\s*\n/).map((p) => p.replace(/\s+/g, ' ').trim()).filter(Boolean);
  return packParagraphs(paras).map((g, gi) => ({
    id: `${src.id}-${gi + 1}`,
    source_id: src.id,
    article: null,
    title: src.title,
    heading: null,
    text: g.join('\n'),
    url: src.url,
    language: src.language,
  }));
}

const sources = JSON.parse(fs.readFileSync(path.join(DATA, 'sources.json'), 'utf8'));
const all = [];
for (const src of sources) {
  const text = fs.readFileSync(path.join(DATA, 'raw', src.file), 'utf8').replace(/\r/g, '');
  const fn = { regulation: chunkRegulation, sections: chunkSections, handbook: chunkHandbook, plain: chunkPlain }[src.kind];
  if (!fn) throw new Error(`Unknown kind "${src.kind}" for ${src.id}`);
  const chunks = fn(src, text);
  const sizes = chunks.map((c) => words(c.text));
  console.log(`${src.id.padEnd(18)} ${String(chunks.length).padStart(3)} chunks  (words: min ${Math.min(...sizes)}, max ${Math.max(...sizes)})`);
  all.push(...chunks);
}
const ids = new Set();
for (const c of all) {
  if (ids.has(c.id)) throw new Error(`Duplicate chunk id ${c.id}`);
  ids.add(c.id);
}
fs.writeFileSync(path.join(DATA, 'chunks.json'), JSON.stringify(all, null, 2) + '\n');
console.log(`Total: ${all.length} chunks -> data/chunks.json`);
