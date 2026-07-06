import { useMemo } from 'react';
import { useRepositories } from '../context/RepositoryContext';
import { useApp } from '../context/AppContext';
import type { Language, ColorKey } from '../types';

export type SearchResultKind = 'text' | 'chapter' | 'segment';

export interface GlobalSearchResult {
  kind: SearchResultKind;
  /** Display label — primary line */
  label: string;
  /** Display sublabel — secondary line */
  sublabel: string;
  /** For navigation */
  textId: string;
  chapterId: string;
  segmentId?: string;
  /** For visual dot color */
  colorKey?: ColorKey;
  /** Is it the main Huainanzi text (vs a parallel)? */
  isMain: boolean;
  /** Matched excerpt (for segments) */
  excerpt?: string;
}

/**
 * Build a flat searchable index of all texts, chapters, and segments.
 * Returns a `search(query)` function that filters and ranks results.
 */
export function useGlobalSearch() {
  const { texts } = useRepositories();
  const { state } = useApp();
  const language: Language = state.language;

  const index = useMemo(() => {
    const entries: GlobalSearchResult[] = [];
    const mainText = texts.getMainText();

    // Main text
    entries.push({
      kind: 'text',
      label: mainText.title.zh,
      sublabel: mainText.title.en,
      textId: mainText.id,
      chapterId: mainText.chapters[0]?.id ?? '',
      isMain: true,
    });

    // Main chapters
    for (const chapter of mainText.chapters) {
      entries.push({
        kind: 'chapter',
        label: chapter.title.zh,
        sublabel: `${mainText.title.en} · ${chapter.title.en}`,
        textId: mainText.id,
        chapterId: chapter.id,
        isMain: true,
      });

      // Main segments
      for (const seg of chapter.segments) {
        entries.push({
          kind: 'segment',
          label: seg.content.zh.slice(0, 60) + (seg.content.zh.length > 60 ? '…' : ''),
          sublabel: seg.content.en.slice(0, 80) + (seg.content.en.length > 80 ? '…' : ''),
          textId: mainText.id,
          chapterId: chapter.id,
          segmentId: seg.id,
          isMain: true,
          excerpt: language === 'zh' ? seg.content.zh : seg.content.en,
        });
      }
    }

    // Parallel texts
    const parallels = texts.getAllParallelTexts();
    for (const pText of parallels) {
      entries.push({
        kind: 'text',
        label: pText.title.zh,
        sublabel: pText.title.zh,
        textId: pText.id,
        chapterId: pText.chapters[0]?.id ?? '',
        colorKey: pText.colorKey,
        isMain: false,
      });

      for (const chapter of pText.chapters) {
        entries.push({
          kind: 'chapter',
          label: chapter.title.zh,
          sublabel: `${pText.title.zh} · ${chapter.title.zh}`,
          textId: pText.id,
          chapterId: chapter.id,
          colorKey: pText.colorKey,
          isMain: false,
        });

        for (const seg of chapter.segments) {
          entries.push({
            kind: 'segment',
            label: seg.content.zh.slice(0, 60) + (seg.content.zh.length > 60 ? '…' : ''),
            sublabel: seg.content.en.slice(0, 80) + (seg.content.en.length > 80 ? '…' : ''),
            textId: pText.id,
            chapterId: chapter.id,
            segmentId: seg.id,
            colorKey: pText.colorKey,
            isMain: false,
            excerpt: language === 'zh' ? seg.content.zh : seg.content.en,
          });
        }
      }
    }

    return entries;
  }, [texts, language]);

  function search(query: string): GlobalSearchResult[] {
    const q = query.trim();
    if (!q) return [];
    const lower = q.toLowerCase();

    const scored: Array<{ result: GlobalSearchResult; score: number }> = [];

    for (const entry of index) {
      let score = 0;

      // Match against label (zh) and sublabel (en)
      const labelLower = entry.label.toLowerCase();
      const sublabelLower = entry.sublabel.toLowerCase();

      if (entry.label.includes(q) || labelLower.includes(lower)) {
        score += 10;
        // Boost exact prefix match
        if (labelLower.startsWith(lower) || entry.label.startsWith(q)) {
          score += 5;
        }
      }
      if (entry.sublabel.includes(q) || sublabelLower.includes(lower)) {
        score += 8;
        if (sublabelLower.startsWith(lower)) {
          score += 4;
        }
      }

      // For segments, also match the full content
      if (entry.kind === 'segment' && entry.excerpt) {
        const excerptLower = entry.excerpt.toLowerCase();
        if (entry.excerpt.includes(q) || excerptLower.includes(lower)) {
          score += 6;
        }
      }

      // Kind weighting: texts > chapters > segments
      if (score > 0) {
        if (entry.kind === 'text') score += 20;
        else if (entry.kind === 'chapter') score += 10;
        // Main text gets a slight boost
        if (entry.isMain) score += 3;
        scored.push({ result: entry, score });
      }
    }

    // Sort by score descending, cap at 30 results
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 30).map((s) => s.result);
  }

  return { search };
}
