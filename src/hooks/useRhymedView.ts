import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { useRepositories } from "../context/RepositoryContext";
import type {
  ContinuousChapter,
  InlineParallel,
  RhymedContent,
} from "../types";

export interface UseRhymedViewReturn {
  /** The active continuous chapter. */
  chapter: ContinuousChapter | null;
  /** Rhymed data for the active chapter, if it exists. */
  rhymed: RhymedContent | null;
  /** A rhymed version exists for this chapter (Chinese only). */
  available: boolean;
  /** The rhymed view is currently displayed (rhymed + zh). */
  active: boolean;
  /** Inline parallels of whichever view (prose / rhymed) is displayed. */
  activeParallels: InlineParallel[];
}

/**
 * Single source of truth for whether the rhymed version is being shown.
 * The rhymed version renders only when the display mode is "rhymed" and
 * the chapter carries rhymed data (Chinese text only).
 */
export function useRhymedView(): UseRhymedViewReturn {
  const { state } = useApp();
  const { texts } = useRepositories();

  const chapter = useMemo(
    () => texts.getContinuousChapter(state.activeChapterId),
    [texts, state.activeChapterId],
  );

  const rhymed = chapter?.rhymed ?? null;
  const available = state.language === "zh" && rhymed !== null;
  const active = available && state.displayMode === "rhymed";

  const activeParallels = useMemo(
    () =>
      active && rhymed
        ? rhymed.inlineParallels
        : (chapter?.inlineParallels ?? []),
    [active, rhymed, chapter],
  );

  return { chapter, rhymed, available, active, activeParallels };
}
