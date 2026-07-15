import { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { useRepositories } from "../../context/RepositoryContext";
import { useAnnotations } from "../../hooks/useAnnotations";
import { useRhymedView } from "../../hooks/useRhymedView";
import { ParallelListItem } from "./ParallelListItem";
import { withinLengthRange } from "../../utils/parallelFilters";
import type { ColorKey } from "../../types";

export interface ParallelListProps {
  className?: string;
}

interface TitleGroup {
  textId: string;
  colorKey: ColorKey;
  titleZh: string;
  titleEn: string;
  count: number;
  firstStart: number;
}

export function ParallelList({ className }: ParallelListProps) {
  const { texts } = useRepositories();
  const { state, openParallelList, toggleTextHighlight } = useApp();
  const { annotations } = useAnnotations(state.activeChapterId);

  const { chapter: continuousChapter, activeParallels } = useRhymedView();

  // Group the chapter's inline parallels by source text ("the parallel title").
  // One row per source, ordered by where its first parallel appears in the text.
  // `count` counts DISTINCT main-text locations (start:end range) so it matches
  // the merged list length shown in the right panel.
  const groups = useMemo<TitleGroup[]>(() => {
    if (!continuousChapter) return [];
    const lo = state.lengthMin;
    const hi = state.lengthMax;
    const map = new Map<string, TitleGroup>();
    const seenRange = new Set<string>(); // "textId:start:end"
    for (const p of activeParallels) {
      if (p.startZh < 0) continue; // builder miss => no real highlight
      if (!withinLengthRange(p, lo, hi)) continue; // outside length filter
      const rangeKey = `${p.textId}:${p.startZh}:${p.endZh}`;
      const isNewLocation = !seenRange.has(rangeKey);
      seenRange.add(rangeKey);
      const existing = map.get(p.textId);
      if (existing) {
        if (isNewLocation) existing.count += 1;
        existing.firstStart = Math.min(existing.firstStart, p.startZh);
      } else {
        const text = texts.getParallelText(p.textId);
        map.set(p.textId, {
          textId: p.textId,
          colorKey: (text?.colorKey ?? p.colorKey) as ColorKey,
          titleZh: text?.title.zh ?? p.textId,
          titleEn: text?.title.en ?? p.textId,
          count: 1,
          firstStart: p.startZh,
        });
      }
    }
    return [...map.values()].sort((a, b) => a.firstStart - b.firstStart);
  }, [
    continuousChapter,
    activeParallels,
    texts,
    state.lengthMin,
    state.lengthMax,
  ]);

  return (
    <div className={`flex flex-col ${className ?? ""}`}>
      <ul className="flex flex-col">
        {groups.map((g) => {
          // Active when this source's list is open, or one of its parallels is.
          const isActive =
            state.parallelListTextId === g.textId ||
            state.parallelPanel?.textId === g.textId;
          return (
            <li key={g.textId}>
              <ParallelListItem
                colorKey={g.colorKey}
                titleZh={g.titleZh}
                titleEn={g.titleEn}
                count={g.count}
                isActive={isActive}
                isOn={!state.hiddenTexts.includes(g.textId)}
                onOpen={() => openParallelList(g.textId)}
                onToggle={() => toggleTextHighlight(g.textId)}
              />
            </li>
          );
        })}
        {annotations.length > 0 && (
          <li key="annotations">
            <ParallelListItem
              colorKey="annotation"
              titleZh="註釋"
              titleEn="Annotations"
              count={annotations.length}
              isActive={false}
              isOn={!state.hiddenTexts.includes("annotation")}
              onOpen={() => {}}
              onToggle={() => toggleTextHighlight("annotation")}
            />
          </li>
        )}
      </ul>
    </div>
  );
}
