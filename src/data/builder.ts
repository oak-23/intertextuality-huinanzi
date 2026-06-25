import type { ColorKey } from "../types";

export interface ParallelMatch {
  zhMatch: string;
  enMatch: string;
  zhContext?: string;
  enContext?: string;
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
    const startZh = findOccurrence(
      data.zhText,
      p.zhMatch,
      p.zhContext,
      usedZhStarts,
    );
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
    };
  });

  return {
    text: { zh: data.zhText, en: data.enText },
    inlineParallels,
  };
}
