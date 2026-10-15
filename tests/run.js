'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { setTimeout: delay } = require('node:timers/promises');
const { fold, chunks } = require('../lib/retrieval');

const ROOT = path.join(__dirname, '..');
const BASE_URL = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const DELAY_MS = Number.isFinite(Number(process.env.DELAY_MS)) && Number(process.env.DELAY_MS) >= 0
  ? Number(process.env.DELAY_MS) : 1500;
const QUESTIONS_FILE = process.env.QUESTIONS_FILE || path.join(__dirname, 'questions.json');
const RESULTS_DIR = path.join(__dirname, 'results');

function setupError(message) {
  console.error(message);
  process.exitCode = 2;
}

function validateQuestions(value) {
  if (!Array.isArray(value)) return 'questions.json must contain a JSON array.';
  if (!value.length) return 'questions.json must contain at least one question.';
  const ids = new Set();
  for (let i = 0; i < value.length; i++) {
    const q = value[i];
    const where = `Question at index ${i}`;
    if (!q || typeof q !== 'object' || Array.isArray(q)) return `${where} must be an object.`;
    if (typeof q.id !== 'string' || !q.id.trim()) return `${where}: id must be a non-empty string.`;
    if (ids.has(q.id)) return `${where}: duplicate id "${q.id}".`;
    ids.add(q.id);
    if (q.lang !== 'tr' && q.lang !== 'en') return `${where} (${q.id}): lang must be "tr" or "en".`;
    if (typeof q.question !== 'string' || !q.question.trim()) return `${where} (${q.id}): question must be a non-empty string.`;
    if (q.type !== 'answer' && q.type !== 'refusal') return `${where} (${q.id}): type must be "answer" or "refusal".`;
    if (q.expect_facts !== undefined && (!Array.isArray(q.expect_facts) || q.expect_facts.some(group => !Array.isArray(group) || group.length === 0 || group.some(x => typeof x !== 'string' || !x)))) {
      return `${where} (${q.id}): expect_facts must be a list of non-empty lists of strings.`;
    }
    if (q.expect_sources !== undefined && (!Array.isArray(q.expect_sources) || q.expect_sources.some(x => typeof x !== 'string' || !x.trim()))) {
      return `${where} (${q.id}): expect_sources must be a list of non-empty strings.`;
    }
    if (q.notes !== undefined && typeof q.notes !== 'string') return `${where} (${q.id}): notes must be a string.`;
  }
  return null;
}

function normalize(value) {
  // Markdown emphasis (**F** veya **U**) must not hide a phrase from the matcher.
  return fold(String(value ?? '').replace(/[*_`]+/g, '')).replace(/\s+/g, ' ').trim();
}

const REFUSAL_MARKERS = {
  tr: ['bilmiyorum', 'bilgi bulunmuyor', 'bilgi yok', 'yer almiyor', 'bulunmamaktadir', 'bulamadim', 'iceremiyor', 'yanit veremiyorum', 'kaynaklarda yok', 'bilgiye sahip degilim', 'belgelerde yok', 'soyleyemiyorum', 'belirtilmiyor', 'bilgi elimde yok', 'yer almamaktadir',
    // Stems, so inflected forms also count (yanıtlayamıyorum, cevaplayamam, veremiyorum, ... bilgisi yok).
    'bilgisi yok', 'yanitlayami', 'yanitlayamam', 'cevaplayami', 'cevaplayamam', 'veremiyorum', 'veremem'],
  en: ["don't know", 'do not know', 'not in the', 'no information', "couldn't find", 'could not find', 'not covered', 'not mentioned', "don't have information", 'do not have information', 'not available in', "can't tell", 'cannot tell', "don't cover", 'do not cover', "doesn't cover", 'not cover', "isn't covered", 'not include']
};
const CONTACT_MARKERS = ['ogrenci isleri', 'student affairs', 'danisman', 'advisor', 'oimdestek'];

function includesAny(text, alternatives) {
  const haystack = normalize(text);
  return alternatives.some(item => haystack.includes(normalize(item)));
}

function cardChunkIds(cards, sourceData) {
  const calendarSource = sourceData.find(source => source.id === 'academic-calendar');
  const ids = new Set();
  for (const card of cards) {
    if (!card || typeof card !== 'object') continue;
    const isCalendar = calendarSource && card.url === calendarSource.url && (card.article == null || card.article === '');
    if (isCalendar) ids.add('calendar');
    for (const chunk of chunks) {
      if (card.url !== chunk.url) continue;
      if (card.article == null || card.article === '' || card.article === chunk.article || card.article === chunk.heading) ids.add(chunk.id);
    }
  }
  return [...ids];
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  let body;
  try { body = await response.json(); } catch { body = {}; }
  return { response, body };
}

async function runQuestion(question) {
  let response, body = {}, elapsedMs = 0;
  const started = Date.now();
  let attempt = 0;
  while (true) {
    try {
      const result = await fetchJson(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: question.question, history: [], lang: question.lang })
      });
      response = result.response;
      body = result.body && typeof result.body === 'object' ? result.body : {};
    } catch (error) {
      elapsedMs = Date.now() - started;
      return { id: question.id, lang: question.lang, type: question.type, question: question.question, notes: question.notes || '', httpStatus: null, httpOk: false, answer: '', sources: [], lowConfidence: null, elapsedMs, error: error.message, mappedChunkIds: [], pass: false, reason: 'HTTP request failed' };
    }
    if (response.status !== 429 || attempt >= 3) break;
    attempt++;
    await delay(15000);
  }
  elapsedMs = Date.now() - started;
  const answer = typeof body.answer === 'string' ? body.answer : '';
  const sources = Array.isArray(body.sources) ? body.sources : [];
  const httpOk = response.status === 200 && body.error !== true;
  const mappedChunkIds = cardChunkIds(sources, sourceData);
  const record = {
    id: question.id, lang: question.lang, type: question.type, question: question.question,
    notes: question.notes || '', httpStatus: response.status, httpOk, answer, sources,
    lowConfidence: body.lowConfidence ?? null, elapsedMs, mappedChunkIds,
    expect_facts: question.expect_facts || [], expect_sources: question.expect_sources || [], pass: false
  };

  if (question.type === 'answer') {
    const missingFactGroups = (question.expect_facts || []).filter(group => !includesAny(answer, group));
    const expectedSourceOk = !question.expect_sources?.length || mappedChunkIds.some(id => question.expect_sources.some(prefix => id.startsWith(prefix)));
    record.factsOk = missingFactGroups.length === 0;
    record.sourceOk = expectedSourceOk;
    record.missingFactGroups = missingFactGroups;
    record.pass = httpOk && record.factsOk && record.sourceOk;
    const reasons = [];
    if (!httpOk) reasons.push(`HTTP ${response.status}`);
    if (missingFactGroups.length) reasons.push(`missing facts: ${missingFactGroups.map(g => `[${g.join('|')}]`).join(', ')}`);
    if (!expectedSourceOk) reasons.push(`no expected source (got: ${mappedChunkIds.join(', ') || 'none'})`);
    record.reason = reasons.join('; ') || 'all checks passed';
  } else {
    record.refused = includesAny(answer, REFUSAL_MARKERS[question.lang]);
    record.pointed = includesAny(answer, CONTACT_MARKERS);
    record.pass = httpOk && record.refused && record.pointed;
    const reasons = [];
    if (!httpOk) reasons.push(`HTTP ${response.status}`);
    if (!record.refused) reasons.push('did not refuse');
    if (!record.pointed) reasons.push('did not point to support');
    record.reason = reasons.join('; ') || 'refusal and support direction found';
  }
  return record;
}

function escapeCell(value) { return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' '); }
function quoteBlock(value) { return String(value || '(empty answer)').split(/\r?\n/).map(line => `> ${line}`).join('\n'); }

function countsFor(records, type, lang) {
  const selected = records.filter(r => (!type || r.type === type) && (!lang || r.lang === lang));
  return { passed: selected.filter(r => r.pass).length, total: selected.length };
}

function readHistory() {
  if (!fs.existsSync(RESULTS_DIR)) return [];
  return fs.readdirSync(RESULTS_DIR).filter(name => name.endsWith('.json')).map(name => {
    try { return JSON.parse(fs.readFileSync(path.join(RESULTS_DIR, name), 'utf8')); } catch { return null; }
  }).filter(Boolean).sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
}

function renderReport(run, history, preservedNotes) {
  const records = run.questions;
  const answers = countsFor(records, 'answer');
  const refusals = countsFor(records, 'refusal');
  const tr = countsFor(records, null, 'tr');
  const en = countsFor(records, null, 'en');
  const lines = [
    '# RegiBot — Accuracy report', '',
    `Date: ${run.date}`, `Model: ${run.model}`, `Number of questions: ${records.length}`, '',
    `Answers: ${answers.passed}/${answers.total} correct · Refusals: ${refusals.passed}/${refusals.total} correct · Total: ${records.filter(r => r.pass).length}/30`,
    `Answered by TR questions: ${tr.passed}/${tr.total}, EN questions: ${en.passed}/${en.total}`,
    `TR answers: ${countsFor(records, 'answer', 'tr').passed}/${countsFor(records, 'answer', 'tr').total}; TR refusals: ${countsFor(records, 'refusal', 'tr').passed}/${countsFor(records, 'refusal', 'tr').total}; EN answers: ${countsFor(records, 'answer', 'en').passed}/${countsFor(records, 'answer', 'en').total}; EN refusals: ${countsFor(records, 'refusal', 'en').passed}/${countsFor(records, 'refusal', 'en').total}`,
    '', '| # | Lang | Type | Question | Result | Cited sources | Notes (reason) |',
    '|---|---|---|---|---|---|---|'
  ];
  for (const r of records) lines.push(`| ${escapeCell(r.id)} | ${r.lang.toUpperCase()} | ${r.type} | ${escapeCell(r.question)} | ${r.pass ? 'PASS' : 'FAIL'} | ${escapeCell(r.sources.map(s => `${s.title || s.url || ''}${s.article ? `, ${s.article}` : ''}`).join('; ') || '—')} | ${escapeCell(r.reason)} |`);
  lines.push('', '## Failures', '');
  const failures = records.filter(r => !r.pass);
  if (!failures.length) lines.push('None.');
  for (const r of failures) {
    lines.push(`### ${r.id} — ${r.question}`, '', `Expected facts: ${r.expect_facts.length ? r.expect_facts.map(g => `[${g.join(' | ')}]`).join('; ') : 'none'}`, `Expected sources: ${r.expect_sources.join(', ') || 'none'}`, '', quoteBlock(r.answer), '', `Cited sources: ${r.sources.map(s => `${s.title || '(untitled)'} (${s.article || 'no article'}, ${s.url || 'no URL'})`).join('; ') || 'none'}`, '');
  }
  lines.push('## Run history', '', '| Date | Model | Answers | Refusals | Total |', '|---|---|---:|---:|---:|');
  for (const old of history) {
    const oldRecords = Array.isArray(old.questions) ? old.questions : [];
    const oldA = countsFor(oldRecords, 'answer');
    const oldR = countsFor(oldRecords, 'refusal');
    lines.push(`| ${escapeCell(old.date || 'unknown')} | ${escapeCell(old.model || 'unknown')} | ${oldA.passed}/${oldA.total} | ${oldR.passed}/${oldR.total} | ${oldRecords.filter(r => r.pass).length}/30 |`);
  }
  lines.push('', '<!-- notes:start -->', preservedNotes || '', '<!-- notes:end -->', '');
  return lines.join('\n');
}

function existingNotes(reportPath) {
  if (!fs.existsSync(reportPath)) return '';
  const text = fs.readFileSync(reportPath, 'utf8');
  const match = text.match(/<!-- notes:start -->([\s\S]*?)<!-- notes:end -->/);
  return match ? match[1].trim() : '';
}

async function main() {
  let questions;
  try { questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf8')); }
  catch (error) { setupError(`Could not load questions from ${QUESTIONS_FILE}: ${error.message}`); return; }
  const validationError = validateQuestions(questions);
  if (validationError) { setupError(`Invalid questions file: ${validationError}`); return; }

  const only = process.env.ONLY ? new Set(process.env.ONLY.split(',').map(id => id.trim()).filter(Boolean)) : null;
  if (only) {
    const unknown = [...only].filter(id => !questions.some(q => q.id === id));
    if (unknown.length) { setupError(`Unknown question id(s) in ONLY: ${unknown.join(', ')}`); return; }
    questions = questions.filter(q => only.has(q.id));
  }

  let health;
  try { health = (await fetchJson(`${BASE_URL}/api/health`)).body; }
  catch { setupError('Start the server first: npm start'); return; }
  if (!health || health.ok !== true) { setupError('Start the server first: npm start'); return; }
  if (!health.hasKey) { console.warn('Warning: the server reports no API key (hasKey is false).'); setupError('Set ANTHROPIC_API_KEY in .env and restart the server.'); return; }

  const records = [];
  for (let i = 0; i < questions.length; i++) {
    if (i > 0 && DELAY_MS > 0) await delay(DELAY_MS);
    const record = await runQuestion(questions[i]);
    records.push(record);
    console.log(`${record.id} | ${record.lang} | ${record.type} | ${record.pass ? 'PASS' : 'FAIL'} | ${record.reason} | ${record.elapsedMs} ms`);
  }
  const run = { model: health.model || 'unknown', baseUrl: BASE_URL, date: new Date().toISOString(), questions: records };
  const timestamp = run.date.replace(/:/g, '-');
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  const resultPath = path.join(RESULTS_DIR, `${timestamp}.json`);
  fs.writeFileSync(resultPath, `${JSON.stringify(run, null, 2)}\n`);
  const answers = countsFor(records, 'answer');
  const refusals = countsFor(records, 'refusal');
  const tr = countsFor(records, null, 'tr');
  const en = countsFor(records, null, 'en');
  console.log(`Answers: ${answers.passed}/${answers.total} correct · Refusals: ${refusals.passed}/${refusals.total} correct · Total: ${records.filter(r => r.pass).length}/30`);
  console.log(`Answered by TR questions: ${tr.passed}/${tr.total}, EN questions: ${en.passed}/${en.total}`);

  const reportPath = path.join(__dirname, 'report.md');
  const notes = existingNotes(reportPath);
  const history = readHistory();
  fs.writeFileSync(reportPath, renderReport(run, history, notes));
}

let sourceData;
try { sourceData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources.json'), 'utf8')); }
catch (error) { setupError(`Could not load data/sources.json: ${error.message}`); }

module.exports = { main, validateQuestions, normalize, cardChunkIds };
if (require.main === module && process.exitCode !== 2) main().catch(error => { console.error(error); process.exitCode = 2; });
