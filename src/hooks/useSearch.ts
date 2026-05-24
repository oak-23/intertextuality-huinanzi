import { useCallback, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useRepositories } from '../context/RepositoryContext';
import { scrollToSegment } from '../utils/scrollToSegment';
import type { SearchScope, SearchResult } from '../types';

export interface UseSearchReturn {
  query: string;
  scope: SearchScope;
  matches: string[];
  results: SearchResult[];
  currentIndex: number;
  setQuery: (query: string) => void;
  setScope: (scope: SearchScope) => void;
  next: () => void;
  prev: () => void;
  clear: () => void;
}

export function useSearch(): UseSearchReturn {
  const { state, dispatch } = useApp();
  const { texts } = useRepositories();
  const { query, scope, currentIndex } = state.searchState;
  const language = state.language;

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    return texts.searchSegments(query, scope, language);
  }, [query, scope, language, texts]);

  useEffect(() => {
    dispatch({ type: 'SET_SEARCH_MATCHES', matches: results.map((r) => r.segmentId) });
  }, [results, dispatch]);

  const setQuery = useCallback(
    (q: string) => dispatch({ type: 'SET_SEARCH_QUERY', query: q }),
    [dispatch]
  );

  const setScope = useCallback(
    (s: SearchScope) => dispatch({ type: 'SET_SEARCH_SCOPE', scope: s }),
    [dispatch]
  );

  const goTo = useCallback(
    (index: number) => {
      if (results.length === 0) return;
      const wrapped = ((index % results.length) + results.length) % results.length;
      dispatch({ type: 'SET_SEARCH_INDEX', index: wrapped });
      const match = results[wrapped];
      if (match && match.textId === 'huainanzi') {
        // Scrolling in the main column happens via the segmentId on the DOM.
        // Cross-text scrolling (parallel scope) is handled by the panel itself.
        scrollToSegment(match.segmentId);
      }
    },
    [results, dispatch]
  );

  const next = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
  const prev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);
  const clear = useCallback(() => {
    dispatch({ type: 'SET_SEARCH_QUERY', query: '' });
    dispatch({ type: 'SET_SEARCH_MATCHES', matches: [] });
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
