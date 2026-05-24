import { sampleMainText, sampleParallelTexts } from '../data/sampleData';
import type { ITextRepository } from '../repositories/types';
import type { Chapter, Language, SearchResult, SearchScope, Segment, Text } from '../types';

export class LocalTextAdapter implements ITextRepository {
  private readonly main: Text = sampleMainText;
  private readonly parallels: Text[] = sampleParallelTexts;
  private readonly parallelsById: Map<string, Text> = new Map(
    sampleParallelTexts.map((t) => [t.id, t])
  );

  getMainText(): Text {
    return this.main;
  }

  getChapter(chapterId: string): Chapter | null {
    return this.main.chapters.find((c) => c.id === chapterId) ?? null;
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
    const searchIn = (text: Text) => {
      for (const chapter of text.chapters) {
        for (const segment of chapter.segments) {
          const body = segment.content[lang] ?? '';
          if (body.includes(needle)) {
            results.push({
              textId: text.id,
              chapterId: chapter.id,
              segmentId: segment.id,
              matchedText: body,
            });
          }
        }
      }
    };
    if (scope === 'main') {
      searchIn(this.main);
    } else {
      for (const parallel of this.parallels) searchIn(parallel);
    }
    return results;
  }

  getAllParallelTexts(): Text[] {
    return this.parallels;
  }
}
