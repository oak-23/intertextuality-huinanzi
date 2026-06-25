import { useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useRepositories } from '../context/RepositoryContext';
import type { ContinuousChapter } from '../types';

export interface UseChapterNavigationReturn {
  chapters: ContinuousChapter[];
  activeChapter: ContinuousChapter | null;
  switchChapter: (chapterId: string) => void;
}

export function useChapterNavigation(): UseChapterNavigationReturn {
  const { state, setActiveChapter } = useApp();
  const { texts } = useRepositories();
  const chapters = useMemo(
    () => texts.getMainContinuousText()?.chapters ?? [],
    [texts]
  );
  const activeChapter = useMemo(
    () => chapters.find((c) => c.id === state.activeChapterId) ?? chapters[0] ?? null,
    [chapters, state.activeChapterId]
  );

  const switchChapter = useCallback(
    (chapterId: string) => {
      if (chapterId !== state.activeChapterId) setActiveChapter(chapterId);
    },
    [state.activeChapterId, setActiveChapter]
  );

  return { chapters, activeChapter, switchChapter };
}
