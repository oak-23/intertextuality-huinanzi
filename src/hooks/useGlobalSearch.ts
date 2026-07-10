import { useMemo } from "react";
import { useRepositories } from "../context/RepositoryContext";
import { useApp } from "../context/AppContext";
import type { ColorKey, Language, SearchScope } from "../types";

export type SearchResultKind = "text" | "chapter" | "segment";

export interface GlobalSearchResult {
  kind: SearchResultKind;
  label: string;
  sublabel: string;
  textId: string;
  chapterId: string;
  segmentId?: string;
  colorKey?: ColorKey;
  isMain: boolean;
  excerpt?: string;
  matchOffset?: number;
  matchLength?: number;
  matchIndex?: number;
  matchQuery?: string;
  matchLanguage?: Language;
}

interface SearchField {
  text: string;
  language?: Language;
  weight: number;
}

interface SearchEntry {
  result: GlobalSearchResult;
  fields: SearchField[];
}

interface ParallelContextEntry {
  textId: string;
  chapterId: string;
  segmentId: string;
  zhContext: string;
}

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

function normalizeLoose(text: string): string {
  return normalize(text).replace(/[\s\p{P}\p{S}]+/gu, "");
}

function scoreField(
  field: SearchField,
  query: string,
  lowerQuery: string,
): number {
  const value = field.text.trim();
  if (!value) return 0;

  const lowerValue = value.toLowerCase();
  if (
    !lowerValue.includes(lowerQuery) &&
    !normalizeLoose(value).includes(normalizeLoose(query))
  ) {
    return 0;
  }

  let score = field.weight;
  if (lowerValue.startsWith(lowerQuery)) score += 4;
  if (value.startsWith(query)) score += 2;
  return score;
}

function findExcerpt(
  text: string,
  query: string,
  window = 24,
): { excerpt: string; matchOffset: number } {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const matchOffset = lowerText.indexOf(lowerQuery);
  if (matchOffset === -1) return { excerpt: text, matchOffset: -1 };

  const start = Math.max(0, matchOffset - window);
  const end = Math.min(text.length, matchOffset + query.length + window);
  return { excerpt: text.substring(start, end), matchOffset };
}

function kindPriority(kind: SearchResultKind): number {
  switch (kind) {
    case "segment":
      return 3;
    case "chapter":
      return 2;
    case "text":
      return 1;
  }
}

function resultTargetKey(
  result: GlobalSearchResult,
  texts: ReturnType<typeof useRepositories>["texts"],
): string {
  if (result.isMain) {
    return result.segmentId
      ? `main:${result.textId}:${result.chapterId}:${result.segmentId}`
      : `main:${result.textId}:${result.chapterId}`;
  }

  const parallelText = texts.getParallelText(result.textId);
  if (!parallelText) {
    return result.segmentId
      ? `parallel:${result.textId}:${result.chapterId}:${result.segmentId}`
      : `parallel:${result.textId}:${result.chapterId}`;
  }

  if (result.segmentId) {
    return `parallel:${result.textId}:${result.chapterId}:${result.segmentId}`;
  }

  const chapter =
    parallelText.chapters.find((item) => item.id === result.chapterId) ??
    parallelText.chapters[0];
  const firstSegmentId = chapter?.segments[0]?.id ?? "";
  return `parallel:${result.textId}:${chapter?.id ?? result.chapterId}:${firstSegmentId}`;
}

export function useGlobalSearch() {
  const { texts } = useRepositories();
  const { state } = useApp();
  const language: Language = state.language;

  const parallelContextMap = useMemo(() => {
    const map = new Map<string, ParallelContextEntry[]>();
    const continuous = texts.getMainContinuousText();
    if (!continuous) return map;

    for (const chapter of continuous.chapters) {
      for (const parallel of chapter.inlineParallels) {
        if (!parallel.zhContext) continue;
        const key = `${parallel.textId}:${parallel.chapterId}:${parallel.segmentId}`;
        const list = map.get(key) ?? [];
        list.push({
          textId: parallel.textId,
          chapterId: parallel.chapterId,
          segmentId: parallel.segmentId,
          zhContext: parallel.zhContext,
        });
        map.set(key, list);
      }
      for (const parallel of chapter.rhymed?.inlineParallels ?? []) {
        if (!parallel.zhContext) continue;
        const key = `${parallel.textId}:${parallel.chapterId}:${parallel.segmentId}`;
        const list = map.get(key) ?? [];
        list.push({
          textId: parallel.textId,
          chapterId: parallel.chapterId,
          segmentId: parallel.segmentId,
          zhContext: parallel.zhContext,
        });
        map.set(key, list);
      }
    }

    return map;
  }, [texts]);

  const staticEntries = useMemo<SearchEntry[]>(() => {
    const entries: SearchEntry[] = [];
    const continuous = texts.getMainContinuousText();

    if (continuous) {
      entries.push({
        result: {
          kind: "text",
          label: continuous.title.zh,
          sublabel: continuous.title.en,
          textId: continuous.id,
          chapterId: continuous.chapters[0]?.id ?? "",
          isMain: true,
        },
        fields: [
          { text: continuous.title.zh, language: "zh", weight: 14 },
          { text: continuous.title.en, language: "en", weight: 12 },
        ],
      });

      for (const chapter of continuous.chapters) {
        entries.push({
          result: {
            kind: "chapter",
            label: chapter.title.zh,
            sublabel: `${continuous.title.en} · ${chapter.title.en}`,
            textId: continuous.id,
            chapterId: chapter.id,
            isMain: true,
          },
          fields: [
            { text: chapter.title.zh, language: "zh", weight: 12 },
            { text: chapter.title.en, language: "en", weight: 10 },
          ],
        });
      }
    }

    for (const pText of texts.getAllParallelTexts()) {
      entries.push({
        result: {
          kind: "text",
          label: pText.title.zh,
          sublabel: pText.title.en,
          textId: pText.id,
          chapterId: pText.chapters[0]?.id ?? "",
          colorKey: pText.colorKey,
          isMain: false,
        },
        fields: [
          { text: pText.title.zh, language: "zh", weight: 14 },
          { text: pText.title.en, language: "en", weight: 12 },
        ],
      });

      for (const chapter of pText.chapters) {
        entries.push({
          result: {
            kind: "chapter",
            label: chapter.title.zh,
            sublabel: `${pText.title.zh} · ${chapter.title.zh}`,
            textId: pText.id,
            chapterId: chapter.id,
            colorKey: pText.colorKey,
            isMain: false,
          },
          fields: [
            { text: chapter.title.zh, language: "zh", weight: 12 },
            { text: chapter.title.en, language: "en", weight: 10 },
          ],
        });
      }
    }

    return entries;
  }, [texts]);

  function search(
    query: string,
    scope: SearchScope = "all",
  ): GlobalSearchResult[] {
    const rawQuery = query.trim();
    const lowerQuery = normalize(query);
    if (!lowerQuery) return [];

    const scored: Array<{ result: GlobalSearchResult; score: number }> = [];
    const allowMain = scope !== "parallel";
    const allowParallel = scope !== "main";
    const looseQuery = normalizeLoose(rawQuery);

    for (const entry of staticEntries) {
      if (
        (entry.result.isMain && !allowMain) ||
        (!entry.result.isMain && !allowParallel)
      ) {
        continue;
      }

      let score = 0;
      let matchLanguage: Language | undefined;

      for (const field of entry.fields) {
        const fieldScore = scoreField(field, rawQuery, lowerQuery);
        if (fieldScore > 0) {
          score += fieldScore;
          if (!matchLanguage && field.language) {
            matchLanguage = field.language;
          }
        }
      }

      if (score > 0) {
        if (entry.result.kind === "text") score += 20;
        else if (entry.result.kind === "chapter") score += 10;
        if (entry.result.isMain) score += 3;

        scored.push({
          result: {
            ...entry.result,
            matchLanguage,
          },
          score,
        });
      }
    }

    const continuous = texts.getMainContinuousText();
    if (continuous && allowMain) {
      const preferredOrder: Language[] =
        language === "zh" ? ["zh", "en"] : ["en", "zh"];

      for (const chapter of continuous.chapters) {
        let matchedPreferredLanguage = false;

        for (const matchLanguage of preferredOrder) {
          const body = chapter.text[matchLanguage] ?? "";
          if (!body) continue;
          const looseBody = normalizeLoose(body);

          let from = 0;
          let occurrenceIndex = 0;
          let matchedThisLanguage = false;

          while (from < body.length) {
            const idx = body.toLowerCase().indexOf(lowerQuery, from);
            if (idx === -1) break;

            if (!looseBody.includes(looseQuery)) {
              break;
            }

            matchedThisLanguage = true;
            const excerpt = findExcerpt(body, rawQuery);
            scored.push({
              result: {
                kind: "segment",
                label:
                  excerpt.excerpt.slice(0, 60) +
                  (excerpt.excerpt.length > 60 ? "…" : ""),
                sublabel: `${continuous.title.en} · ${chapter.title.en}`,
                textId: continuous.id,
                chapterId: chapter.id,
                isMain: true,
                excerpt: excerpt.excerpt,
                matchOffset: idx,
                matchLength: rawQuery.length,
                matchIndex: occurrenceIndex,
                matchQuery: rawQuery,
                matchLanguage,
              },
              score: 9 + (matchLanguage === language ? 2 : 0),
            });
            from = idx + lowerQuery.length;
            occurrenceIndex += 1;
          }

          if (matchedThisLanguage) {
            matchedPreferredLanguage = true;
            break;
          }
        }

        if (matchedPreferredLanguage) continue;
      }
    }

    if (allowParallel) {
      const parallelTexts = texts.getAllParallelTexts();
      const preferredOrder: Language[] =
        language === "zh" ? ["zh", "en"] : ["en", "zh"];

      for (const pText of parallelTexts) {
        for (const chapter of pText.chapters) {
          for (const segment of chapter.segments) {
            const contextEntries =
              parallelContextMap.get(
                `${pText.id}:${chapter.id}:${segment.id}`,
              ) ?? [];
            for (const matchLanguage of preferredOrder) {
              const body = segment.content[matchLanguage] ?? "";
              if (!body) continue;
              const exactMatch = body.toLowerCase().includes(lowerQuery);
              const looseMatch = normalizeLoose(body).includes(looseQuery);
              const contextMatch = contextEntries.some((entry) => {
                const contextBody = entry.zhContext;
                return (
                  contextBody.toLowerCase().includes(lowerQuery) ||
                  normalizeLoose(contextBody).includes(looseQuery)
                );
              });
              if (!exactMatch && !looseMatch && !contextMatch) continue;

              const contextBody = contextEntries[0]?.zhContext;
              const displayBody =
                exactMatch || looseMatch ? body : (contextBody ?? body);

              scored.push({
                result: {
                  kind: "segment",
                  label:
                    displayBody.slice(0, 60) +
                    (displayBody.length > 60 ? "…" : ""),
                  sublabel: `${pText.title.zh} · ${chapter.title.zh}`,
                  textId: pText.id,
                  chapterId: chapter.id,
                  segmentId: segment.id,
                  colorKey: pText.colorKey,
                  isMain: false,
                  excerpt: displayBody,
                  matchLanguage,
                },
                score:
                  8 +
                  (matchLanguage === language ? 2 : 0) +
                  (exactMatch ? 1 : 0) +
                  (contextMatch ? 1 : 0),
              });
              break;
            }
          }
        }
      }
    }

    const deduped = new Map<
      string,
      { result: GlobalSearchResult; score: number }
    >();
    for (const item of scored) {
      const key = resultTargetKey(item.result, texts);
      const existing = deduped.get(key);
      if (!existing) {
        deduped.set(key, item);
        continue;
      }

      const itemPriority = kindPriority(item.result.kind);
      const existingPriority = kindPriority(existing.result.kind);
      if (
        item.score > existing.score ||
        (item.score === existing.score && itemPriority > existingPriority)
      ) {
        deduped.set(key, item);
      }
    }

    return [...deduped.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
      .map((s) => s.result);
  }

  return { search };
}
