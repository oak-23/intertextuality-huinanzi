import { sampleContinuousMainText } from './src/data/newData';

function splitIntoSpans(fullText, inlineParallels, lang) {
  if (inlineParallels.length === 0) return [{ text: fullText, parallels: [] }];

  const boundaries = [];
  for (const p of inlineParallels) {
    const start = lang === 'zh' ? p.startZh : p.startEn;
    const end = lang === 'zh' ? p.endZh : p.endEn;
    boundaries.push({ pos: start, type: 'start', parallel: p });
    boundaries.push({ pos: end, type: 'end', parallel: p });
  }

  boundaries.sort((a, b) => {
    if (a.pos !== b.pos) return a.pos - b.pos;
    if (a.type !== b.type) return a.type === 'start' ? -1 : 1;
    return 0;
  });

  const spans = [];
  const activeParallels = new Set();
  let cursor = 0;

  for (const b of boundaries) {
    if (b.pos > cursor) {
      spans.push({
        text: fullText.slice(cursor, b.pos),
        parallels: [...activeParallels],
      });
      cursor = b.pos;
    }
    if (b.type === 'start') activeParallels.add(b.parallel);
    else activeParallels.delete(b.parallel);
  }
  if (cursor < fullText.length) {
    spans.push({ text: fullText.slice(cursor), parallels: [] });
  }
  return spans;
}

const chapter = sampleContinuousMainText.chapters[0];
const spans = splitIntoSpans(chapter.text.en, chapter.inlineParallels, 'en');

for (const span of spans) {
  if (span.parallels.length > 0) {
    console.log(`TEXT: ${span.text.substring(0, 15)}...`);
    console.log(`COLORS: ${span.parallels.map(p => p.colorKey).join(', ')}`);
  }
}
