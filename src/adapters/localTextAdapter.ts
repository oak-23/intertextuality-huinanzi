import { sampleContinuousMainText, sampleParallelTexts } from '../data/newData';
import type { ITextRepository } from '../repositories/types';
import type { Chapter, ContinuousChapter, ContinuousText, Language, SearchResult, SearchScope, Segment, Text } from '../types';

/**
 * Derive a minimal segmented Text from the continuous main text.
 * Chapters have empty segment arrays since the main text is rendered
 * as continuous prose, not discrete segments.
 */
function deriveMainText(continuous: ContinuousText): Text {
  return {
    id: continuous.id,
    title: continuous.title,
    chapters: continuous.chapters.map((ch) => ({
      id: ch.id,
      title: ch.title,
      segments: [],
    })),
  };
}

export class LocalTextAdapter implements ITextRepository {
  private readonly continuous: ContinuousText = sampleContinuousMainText;
  private readonly main: Text = deriveMainText(sampleContinuousMainText);
  private readonly parallels: Text[] = sampleParallelTexts;
  private readonly parallelsById: Map<string, Text> = new Map(
    sampleParallelTexts.map((t) => [t.id, t])
  );

  getMainText(): Text {
    return this.main;
  }

  getMainContinuousText(): ContinuousText | null {
    return this.continuous;
  }

  getChapter(chapterId: string): Chapter | null {
    return this.main.chapters.find((c) => c.id === chapterId) ?? null;
  }

  getContinuousChapter(chapterId: string): ContinuousChapter | null {
    return this.continuous.chapters.find((c) => c.id === chapterId) ?? null;
  }

  getParallelText(textId: string): Text | null {
    return this.parallelsById.get(textId) ?? null;
  }

  getParallelChapter(textId: string, chapterId: string): Chapter | null {
    const text = this.getParallelText(textId);
    if (!text) return null;
    return text.chapters.find((c) => c.id === chapterId) ?? null;
  }

  getSegment(textId: string, chapterId: string, segmentId: string): Segment | null {
    const text = textId === this.main.id ? this.main : this.getParallelText(textId);
    if (!text) return null;
    const chapter = text.chapters.find((c) => c.id === chapterId);
    if (!chapter) return null;
    return chapter.segments.find((s) => s.id === segmentId) ?? null;
  }

  searchSegments(query: string, scope: SearchScope, lang: Language): SearchResult[] {
    const needle = query.trim();
    if (!needle) return [];
    const results: SearchResult[] = [];

    if (scope === 'main' || scope === 'all') {
      // Search continuous text — find ALL occurrences across all chapters
      for (const chapter of this.continuous.chapters) {
        const body = chapter.text[lang] ?? '';
        let from = 0;
        let occurrenceIndex = 0;
        while (from < body.length) {
          const idx = body.indexOf(needle, from);
          if (idx === -1) break;
          const contextStart = Math.max(0, idx - 40);
          const contextEnd = Math.min(body.length, idx + needle.length + 40);
          results.push({
            textId: this.continuous.id,
            chapterId: chapter.id,
            segmentId: `match-${chapter.id}-${idx}`,
            matchedText: body.substring(contextStart, contextEnd),
            matchOffset: idx,
            matchLength: needle.length,
            matchIndex: occurrenceIndex,
            matchQuery: needle,
          });
          from = idx + needle.length;
          occurrenceIndex++;
        }
      }
    }
    
    if (scope === 'parallel' || scope === 'all') {
      // Search parallel texts by segments
      for (const parallel of this.parallels) {
        for (const chapter of parallel.chapters) {
          for (const segment of chapter.segments) {
            const body = segment.content[lang] ?? '';
            if (body.includes(needle)) {
              results.push({
                textId: parallel.id,
                chapterId: chapter.id,
                segmentId: segment.id,
                matchedText: body,
              });
            }
          }
        }
      }
    }
    return results;
  }

  getAllParallelTexts(): Text[] {
    return this.parallels;
  }
}
