import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useRepositories } from '../../context/RepositoryContext';
import { useParallelNavigation } from '../../hooks/useParallelNavigation';
import { useToast } from '../shared/Toast';
import { ParallelListItem } from './ParallelListItem';
import { SidebarSearch } from './SidebarSearch';
import { useHighlightPulse } from '../../hooks/useHighlightPulse';
import type { Text } from '../../types';

export interface ParallelListProps {
  className?: string;
}

export function ParallelList({ className }: ParallelListProps) {
  const { texts } = useRepositories();
  const { state } = useApp();
  const { textHasParallelsInActiveChapter, openParallelForFirstMatch } = useParallelNavigation();
  const { pulse } = useHighlightPulse();
  const { show } = useToast();
  const [filter, setFilter] = useState('');

  const allTexts = useMemo<Text[]>(() => texts.getAllParallelTexts(), [texts]);
  const language = state.language;

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return allTexts;
    return allTexts.filter((t) => {
      const enMatch = t.title.en.toLowerCase().includes(q);
      const zhMatch = t.title.zh.includes(filter.trim());
      return enMatch || zhMatch;
    });
  }, [allTexts, filter]);

  const handleClick = (textId: string, hasParallels: boolean) => {
    if (!hasParallels) {
      show('No parallels in this chapter.');
      return;
    }
    const ok = openParallelForFirstMatch(textId);
    if (ok) {
      // Pulse will be picked up by the segment that opened.
      // Get first matching segment id for pulse:
      const chapter = texts.getChapter(state.activeChapterId);
      const segment = chapter?.segments.find((s) => s.parallels.some((p) => p.textId === textId));
      if (segment) pulse(segment.id);
    }
  };

  return (
    <div className={`flex flex-col ${className ?? ''}`} style={{ gap: 16 }}>
      <div style={{ padding: '0 16px' }}>
        <SidebarSearch value={filter} onChange={setFilter} />
      </div>
      <ul className="flex flex-col">
        {filtered.map((t) => {
          const colorKey = t.colorKey ?? 'laozi';
          const hasParallels = textHasParallelsInActiveChapter(t.id);
          const isCurrentlyViewed = state.parallelPanel?.textId === t.id;
          return (
            <li key={t.id}>
              <ParallelListItem
                textId={t.id}
                colorKey={colorKey}
                titleZh={t.title.zh}
                titleEn={t.title.en}
                language={language}
                hasParallels={hasParallels}
                isCurrentlyViewed={isCurrentlyViewed}
                onClick={handleClick}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
