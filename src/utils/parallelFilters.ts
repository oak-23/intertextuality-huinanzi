import type { InlineParallel } from "../types";

/**
 * Sentinel bounds meaning "no limit on this side". A parallel's character length
 * is always ≥1 and far below 9999, so these defaults filter nothing. They are the
 * single source of truth for both the initial state and every consumer's
 * normal-mode fallback (the length filter is a research-mode-only control).
 */
export const LENGTH_MIN_OPEN = 1;
export const LENGTH_MAX_OPEN = 9999;

/** Highlighted character length of a parallel in the Chinese main text. */
export function parallelLength(
  p: Pick<InlineParallel, "startZh" | "endZh">,
): number {
  return p.endZh - p.startZh;
}

/**
 * Whether a parallel's length falls within [min, max] (inclusive). Defined once so
 * the main-text highlights, the left-bar count, and the right-panel list never
 * disagree about which parallels are shown.
 */
export function withinLengthRange(
  p: Pick<InlineParallel, "startZh" | "endZh">,
  min: number,
  max: number,
): boolean {
  const len = parallelLength(p);
  return len >= min && len <= max;
}
