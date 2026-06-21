import { sampleContinuousMainText, sampleParallelTexts } from '../data/newData';
import { sampleMainText } from '../data/sampleData';
import type { ITextRepository } from '../repositories/types';
import type { Chapter, ContinuousChapter, ContinuousText, Language, SearchResult, SearchScope, Segment, Text } from '../types';

export class LocalTextAdapter implements ITextRepository {
  private readonly main: Text = sampleMainText;
  private readonly continuous: ContinuousText = sampleContinuousMainText;
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

    if (scope === 'main') {
      // Search continuous text
      for (const chapter of this.continuous.chapters) {
        const body = chapter.text[lang] ?? '';
        if (body.includes(needle)) {
          results.push({
            textId: this.continuous.id,
            chapterId: chapter.id,
            segmentId: '',
            matchedText: body.substring(
              Math.max(0, body.indexOf(needle) - 40),
              Math.min(body.length, body.indexOf(needle) + needle.length + 40)
            ),
          });
        }
      }
    } else {
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
