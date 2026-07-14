import { useCallback, useEffect, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { useChapterNavigation } from "./useChapterNavigation";
import { useGlobalSearch, type GlobalSearchResult } from "./useGlobalSearch";
import { useRepositories } from "../context/RepositoryContext";
import { highlightRangeAnimation } from "../utils/scrollToSegment";
import type { SearchScope } from "../types";

export interface UseSearchReturn {
  query: string;
  scope: SearchScope;
  matches: string[];
  results: GlobalSearchResult[];
  currentIndex: number;
  setQuery: (query: string) => void;
  setScope: (scope: SearchScope) => void;
  next: () => void;
  prev: () => void;
  clear: () => void;
}

function scrollToMainTextMatch(matchQuery: string, matchIndex: number): void {
  if (typeof document === "undefined") return;

  const article = document.querySelector("article");
  if (!article) return;

  const textContainer = document.getElementById("main-text-container");
  if (!textContainer) return;

  const walker = document.createTreeWalker(textContainer, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let fullText = "";
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    textNodes.push(node);
    fullText += node.textContent ?? "";
  }

  const needle = matchQuery.toLowerCase();
  const lowerFullText = fullText.toLowerCase();
  let occurrences = 0;
  let foundIdx = -1;
  let searchPos = 0;
  while (searchPos < lowerFullText.length) {
    const i = lowerFullText.indexOf(needle, searchPos);
    if (i === -1) break;
    if (occurrences === matchIndex) {
      foundIdx = i;
      break;
    }
    occurrences += 1;
    searchPos = i + 1;
  }

  if (foundIdx === -1) {
    textContainer.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  let charCount = 0;
  let targetNode: Text | null = null;
  let targetOffset = 0;
  for (const node of textNodes) {
    const len = node.textContent?.length ?? 0;
    if (charCount + len > foundIdx) {
      targetNode = node;
      targetOffset = foundIdx - charCount;
      break;
    }
    charCount += len;
  }

  if (!targetNode) {
    textContainer.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const parentEl = targetNode.parentElement;
  if (parentEl) {
    parentEl.scrollIntoView({ behavior: "smooth", block: "center" });

    try {
      const range = document.createRange();
      range.setStart(targetNode, targetOffset);
      range.setEnd(
        targetNode,
        Math.min(targetOffset + matchQuery.length, targetNode.length),
      );
      highlightRangeAnimation(range);
    } catch {
      // Ignore range errors.
    }
  }
}

function searchResultId(result: GlobalSearchResult): string {
  return result.segmentId ?? `${result.textId}:${result.chapterId}`;
}

export function useSearch(): UseSearchReturn {
  const { state, dispatch, setLanguage, openParallel } = useApp();
  const { search } = useGlobalSearch();
  const { switchChapter } = useChapterNavigation();
  const { texts } = useRepositories();

  const { query, scope, currentIndex } = state.searchState;

  const results = useMemo(() => search(query, scope), [query, scope, search]);

  useEffect(() => {
    dispatch({
      type: "SET_SEARCH_MATCHES",
      matches: results.map((result) => searchResultId(result)),
    });
  }, [results, dispatch]);

  const setQuery = useCallback(
    (nextQuery: string) =>
      dispatch({ type: "SET_SEARCH_QUERY", query: nextQuery }),
    [dispatch],
  );

  const setScope = useCallback(
    (nextScope: SearchScope) =>
      dispatch({ type: "SET_SEARCH_SCOPE", scope: nextScope }),
    [dispatch],
  );

  const openParallelResult = useCallback(
    (result: GlobalSearchResult) => {
      const parallelText = texts.getParallelText(result.textId);
      if (!parallelText) return;

      if (result.segmentId) {
        openParallel({
          textId: result.textId,
          chapterId: result.chapterId,
          segmentId: result.segmentId,
        });
        return;
      }

      const chapter =
        parallelText.chapters.find((item) => item.id === result.chapterId) ??
        parallelText.chapters[0];
      const firstSegment = chapter?.segments[0];
      if (chapter && firstSegment) {
        openParallel({
          textId: parallelText.id,
          chapterId: chapter.id,
          segmentId: firstSegment.id,
        });
      }
    },
    [openParallel, texts],
  );

  const goTo = useCallback(
    (index: number) => {
      if (results.length === 0) return;
      const wrapped =
        ((index % results.length) + results.length) % results.length;
      dispatch({ type: "SET_SEARCH_INDEX", index: wrapped });
      const match = results[wrapped];
      if (!match) return;

      if (match.isMain) {
        if (match.matchLanguage && match.matchLanguage !== state.language) {
          setLanguage(match.matchLanguage);
        }

        if (match.chapterId && match.chapterId !== state.activeChapterId) {
          switchChapter(match.chapterId);
        }

        if (match.kind === "segment" && match.matchOffset !== undefined) {
          const delay = match.chapterId !== state.activeChapterId ? 300 : 120;
          window.setTimeout(() => {
            scrollToMainTextMatch(
              match.matchQuery?.toLowerCase() ?? query.toLowerCase(),
              match.matchIndex ?? 0,
            );
          }, delay);
        }
        return;
      }

      openParallelResult(match);
    },
    [
      results,
      dispatch,
      state.language,
      state.activeChapterId,
      setLanguage,
      switchChapter,
      openParallelResult,
      query,
    ],
  );

  const next = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
  const prev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);

  const clear = useCallback(() => {
    dispatch({ type: "SET_SEARCH_QUERY", query: "" });
    dispatch({ type: "SET_SEARCH_MATCHES", matches: [] });
  }, [dispatch]);

  return {
    query,
    scope,
    matches: state.searchState.matches,
    results,
    currentIndex,
    setQuery,
    setScope,
    next,
    prev,
    clear,
  };
}
