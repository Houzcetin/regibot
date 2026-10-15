// Extracts text from the PDFs in data/raw whose text is used directly as a source.
// (The academic calendar PDF is a multi-column table that extracts out of order, so its
// text in data/raw/academic-calendar-2026-2027.txt was transcribed by hand from the PDF.)
const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const RAW = path.join(__dirname, '..', 'data', 'raw');
const PDFS = ['regulation-tr.pdf', 'regulation-en.pdf', 'obs-registration-guide.pdf', 'student-handbook.pdf'];

(async () => {
  for (const file of PDFS) {
    if (!fs.existsSync(path.join(RAW, file))) {
      console.log(`${file} missing, skipped (download it from the url in data/sources.json)`);
      continue;
    }
    const parser = new PDFParse({ data: fs.readFileSync(path.join(RAW, file)) });
    const { text } = await parser.getText();
    await parser.destroy();
    let clean = text
      .replace(/\r/g, '')
      .replace(/[ \t]+\n/g, '\n')
      .split('\n')
      .filter((line) => !/^-- \d+ of \d+ --$/.test(line) && !/^\d+\/\d+$/.test(line))
      // The handbook prints bare page numbers on their own line.
      .filter((line) => !(file === 'student-handbook.pdf' && /^\s*\d+\s*$/.test(line)))
      .join('\n');
    if (file === 'student-handbook.pdf') {
      // The introduction consists of welcome letters signed by named individuals: not stored.
      clean = clean.replace(/\nGİRİŞ\n[\s\S]*?(?=\n1\.\s+ÜNİVERSİTENİN TANITIMI\n)/, '\nGİRİŞ\n[Karşılama mektupları çıkarıldı / welcome letters omitted]');
    }
    const out = path.join(RAW, file.replace(/\.pdf$/, '.txt'));
    fs.writeFileSync(out, clean);
    console.log(`${file} -> ${path.basename(out)} (${clean.split(/\s+/).length} words)`);
  }
})();
