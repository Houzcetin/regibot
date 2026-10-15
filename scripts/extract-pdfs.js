// Extracts text from the PDFs in data/raw whose text is used directly as a source.
// (The academic calendar PDF is a multi-column table that extracts out of order, so its
// text in data/raw/academic-calendar-2026-2027.txt was transcribed by hand from the PDF.)
const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const RAW = path.join(__dirname, '..', 'data', 'raw');
const PDFS = ['regulation-tr.pdf', 'regulation-en.pdf', 'obs-registration-guide.pdf'];

(async () => {
  for (const file of PDFS) {
    const parser = new PDFParse({ data: fs.readFileSync(path.join(RAW, file)) });
    const { text } = await parser.getText();
    await parser.destroy();
    const clean = text
      .replace(/\r/g, '')
      .replace(/[ \t]+\n/g, '\n')
      .split('\n')
      .filter((line) => !/^-- \d+ of \d+ --$/.test(line) && !/^\d+\/\d+$/.test(line))
      .join('\n');
    const out = path.join(RAW, file.replace(/\.pdf$/, '.txt'));
    fs.writeFileSync(out, clean);
    console.log(`${file} -> ${path.basename(out)} (${clean.split(/\s+/).length} words)`);
  }
})();
