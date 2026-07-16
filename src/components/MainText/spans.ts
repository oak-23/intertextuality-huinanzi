import type { InlineParallel } from "../../types";

export interface TextSpan {
  /** The text content for this span */
  text: string;
  /** Parallel references that cover this span (empty = plain text) */
  parallels: InlineParallel[];
  /** Absolute start character index in the original text */
  start: number;
  /** Absolute end character index in the original text */
  end: number;
}

/**
 * Split a continuous text string into alternating plain / highlighted spans
 * based on the InlineParallel ranges for the given language.
 */
export function splitIntoSpans(
  fullText: string,
  inlineParallels: InlineParallel[],
  lang: "zh" | "en",
): TextSpan[] {
  if (inlineParallels.length === 0) {
    return [{ text: fullText, parallels: [], start: 0, end: fullText.length }];
  }

  // Collect all boundary points and the parallels active at each range
  type Boundary = {
    pos: number;
    type: "start" | "end";
    parallel: InlineParallel;
  };
  const boundaries: Boundary[] = [];

  for (const p of inlineParallels) {
    const start = lang === "zh" ? p.startZh : p.startEn;
    const end = lang === "zh" ? p.endZh : p.endEn;
    boundaries.push({ pos: start, type: "start", parallel: p });
    boundaries.push({ pos: end, type: "end", parallel: p });
  }

  // Sort boundaries by position, starts before ends at the same position
  boundaries.sort((a, b) => {
    if (a.pos !== b.pos) return a.pos - b.pos;
    if (a.type !== b.type) return a.type === "start" ? -1 : 1;
    return 0;
  });

  const spans: TextSpan[] = [];
  const activeParallels = new Set<InlineParallel>();
  let cursor = 0;

  for (const b of boundaries) {
    if (b.pos > cursor) {
      // Emit a span from cursor to this boundary
      spans.push({
        text: fullText.slice(cursor, b.pos),
        parallels: [...activeParallels],
        start: cursor,
        end: b.pos,
      });
      cursor = b.pos;
    }

    if (b.type === "start") {
      activeParallels.add(b.parallel);
    } else {
      activeParallels.delete(b.parallel);
    }
  }

  // Remaining text after the last boundary
  if (cursor < fullText.length) {
    spans.push({ text: fullText.slice(cursor), parallels: [], start: cursor, end: fullText.length });
  }

  return spans;
}
