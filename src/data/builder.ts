import type { ColorKey, RhymedContent, RhymedLine } from "../types";

export interface ParallelMatch {
  zhMatch: string;
  enMatch: string;
  /** Exact character offset of zhMatch in zhText (skips occurrence search) */
  atZh?: number;
  zhContext?: string;
  enContext?: string;
  zhContextRanges?: [number, number][];
  noteEn?: string;
  /** Docx footnote display number (1-based) for this parallel's unit */
  footnote?: number;
  textId: string;
  chapterId: string;
  segmentId: string;
  colorKey: ColorKey;
}

export interface ChapterData {
  zhText: string;
  enText: string;
  parallels: ParallelMatch[];
}

export interface RhymedChapterData {
  lines: RhymedLine[];
  parallels: ParallelMatch[];
}

function findOccurrences(text: string, needle: string): number[] {
  if (needle.length === 0) return [0];

  const positions: number[] = [];
  let from = 0;

  while (from <= text.length) {
    const pos = text.indexOf(needle, from);
    if (pos === -1) break;
    positions.push(pos);
    from = pos + needle.length;
  }

  return positions;
}

function findOccurrence(
  text: string,
  needle: string,
  context: string | undefined,
  usedStarts: Set<number>,
): number {
  const occurrences = findOccurrences(text, needle);
  if (occurrences.length === 0) return -1;

  if (context) {
    const contextOccurrences = findOccurrences(text, context);
    for (const contextStart of contextOccurrences) {
      const contextEnd = contextStart + context.length;
      const match = occurrences.find(
        (start) =>
          start >= contextStart &&
          start + needle.length <= contextEnd &&
          !usedStarts.has(start),
      );
      if (match !== undefined) return match;
    }
  }

  const unused = occurrences.find((start) => !usedStarts.has(start));
  return unused ?? occurrences[0];
}

export function buildChapter(data: ChapterData) {
  const usedZhStarts = new Set<number>();
  const usedEnStarts = new Set<number>();

  const inlineParallels = data.parallels.map((p) => {
    const startZh =
      p.atZh !== undefined && data.zhText.startsWith(p.zhMatch, p.atZh)
        ? p.atZh
        : findOccurrence(data.zhText, p.zhMatch, p.zhContext, usedZhStarts);
    const endZh = startZh !== -1 ? startZh + p.zhMatch.length : 0;

    const startEn = findOccurrence(
      data.enText,
      p.enMatch,
      p.enContext,
      usedEnStarts,
    );
    const endEn = startEn !== -1 ? startEn + p.enMatch.length : 0;

    if (startZh === -1)
      console.warn(`Could not find Chinese match: ${p.zhMatch}`);
    if (startEn === -1)
      console.warn(`Could not find English match: ${p.enMatch}`);

    if (startZh !== -1) usedZhStarts.add(startZh);
    if (startEn !== -1) usedEnStarts.add(startEn);

    return {
      startZh,
      endZh,
      startEn,
      endEn,
      textId: p.textId,
      chapterId: p.chapterId,
      segmentId: p.segmentId,
      colorKey: p.colorKey,
      zhMatch: p.zhMatch,
      enMatch: p.enMatch,
      zhContext: p.zhContext,
      enContext: p.enContext,
      zhContextRanges: p.zhContextRanges,
      noteEn: p.noteEn,
      footnote: p.footnote,
    };
  });

  return {
    text: { zh: data.zhText, en: data.enText },
    inlineParallels,
  };
}

/** Build the rhymed version of a chapter: joins lines with \n and resolves
 *  parallel spans against the joined text (exact atZh offsets preferred). */
export function buildRhymedChapter(data: RhymedChapterData): RhymedContent {
  const text = data.lines.map((l) => l.zh).join("\n");
  const usedStarts = new Set<number>();

  const inlineParallels = data.parallels.map((p) => {
    const startZh =
      p.atZh !== undefined && text.startsWith(p.zhMatch, p.atZh)
        ? p.atZh
        : findOccurrence(text, p.zhMatch, p.zhContext, usedStarts);
    const endZh = startZh !== -1 ? startZh + p.zhMatch.length : 0;

    if (startZh === -1)
      console.warn(`Could not find rhymed Chinese match: ${p.zhMatch}`);
    else usedStarts.add(startZh);

    return {
      startZh,
      endZh,
      startEn: -1,
      endEn: 0,
      textId: p.textId,
      chapterId: p.chapterId,
      segmentId: p.segmentId,
      colorKey: p.colorKey,
      zhMatch: p.zhMatch,
      enMatch: p.enMatch,
      zhContext: p.zhContext,
      enContext: p.enContext,
      zhContextRanges: p.zhContextRanges,
      noteEn: p.noteEn,
      footnote: p.footnote,
    };
  });

  return { text, lines: data.lines, inlineParallels };
}
