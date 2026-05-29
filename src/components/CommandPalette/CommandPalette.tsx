import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search, BookOpen, FileText, AlignLeft, ArrowRight, Command } from 'lucide-react';
import { useGlobalSearch, type GlobalSearchResult } from '../../hooks/useGlobalSearch';
import { useApp } from '../../context/AppContext';
import { useChapterNavigation } from '../../hooks/useChapterNavigation';
import { useParallelNavigation } from '../../hooks/useParallelNavigation';
import { useRepositories } from '../../context/RepositoryContext';
import { scrollToSegment } from '../../utils/scrollToSegment';
import { useHighlightPulse } from '../../hooks/useHighlightPulse';

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const KIND_ICON = {
  text: BookOpen,
  chapter: FileText,
  segment: AlignLeft,
} as const;

const KIND_LABEL = {
  text: 'Text',
  chapter: 'Chapter',
  segment: 'Passage',
} as const;

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { search } = useGlobalSearch();
  const { state, openParallel, selectSegment } = useApp();
  const { switchChapter } = useChapterNavigation();
  const { texts } = useRepositories();
  const { pulse } = useHighlightPulse();
  const { open: openParallelNav } = useParallelNavigation();

  const results = useMemo(() => search(query), [search, query]);

  // Group results by kind
  const grouped = useMemo(() => {
    const groups: Array<{ kind: string; label: string; items: GlobalSearchResult[] }> = [];
    const map = new Map<string, GlobalSearchResult[]>();
    for (const r of results) {
      const arr = map.get(r.kind) ?? [];
      arr.push(r);
      map.set(r.kind, arr);
    }
    const order: Array<'text' | 'chapter' | 'segment'> = ['text', 'chapter', 'segment'];
    for (const kind of order) {
      const items = map.get(kind);
      if (items && items.length > 0) {
        groups.push({ kind, label: kind === 'text' ? 'Texts' : kind === 'chapter' ? 'Chapters' : 'Passages', items });
      }
    }
    return groups;
  }, [results]);

  // Flat list for keyboard nav
  const flatResults = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      // Focus after animation
      const t = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  // Clamp active index
  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const handleSelect = useCallback(
    (result: GlobalSearchResult) => {
      if (result.isMain) {
        // Navigate to main text chapter/segment
        if (result.chapterId && result.chapterId !== state.activeChapterId) {
          switchChapter(result.chapterId);
        }
        if (result.segmentId) {
          selectSegment(result.segmentId);
          window.setTimeout(() => {
            scrollToSegment(result.segmentId!);
            pulse(result.segmentId!);
          }, 120);
        }
      } else {
        // For parallel texts/chapters/segments: open the parallel panel
        if (result.kind === 'segment' && result.segmentId) {
          openParallel({
            textId: result.textId,
            chapterId: result.chapterId,
            segmentId: result.segmentId,
          });
        } else if (result.kind === 'chapter') {
          // Open first segment of the chapter in parallel panel
          const chapter = texts.getParallelChapter(result.textId, result.chapterId);
          const firstSeg = chapter?.segments[0];
          if (firstSeg) {
            openParallel({
              textId: result.textId,
              chapterId: result.chapterId,
              segmentId: firstSeg.id,
            });
          }
        } else if (result.kind === 'text') {
          // Open first segment of first chapter in parallel panel
          const pText = texts.getParallelText(result.textId);
          const firstChapter = pText?.chapters[0];
          const firstSeg = firstChapter?.segments[0];
          if (firstChapter && firstSeg) {
            openParallel({
              textId: result.textId,
              chapterId: firstChapter.id,
              segmentId: firstSeg.id,
            });
          }
        }
      }
      onClose();
    },
    [state.activeChapterId, switchChapter, selectSegment, openParallel, onClose, texts, pulse, openParallelNav]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, flatResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const result = flatResults[activeIdx];
        if (result) handleSelect(result);
      } else if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    },
    [flatResults, activeIdx, handleSelect, onClose]
  );

  if (!open) return null;

  let flatIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Search texts, chapters, and passages"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in"
        style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      {/* Palette */}
      <div
        className="relative animate-scale-in"
        style={{
          width: '100%',
          maxWidth: 560,
          marginTop: '12vh',
          backgroundColor: 'var(--color-background)',
          borderRadius: 'var(--radius-modal)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18), 0 0 0 1px var(--color-border)',
          overflow: 'hidden',
        }}
        onKeyDown={onKeyDown}
      >
        {/* Input */}
        <div
          className="flex items-center"
          style={{
            borderBottom: '1px solid var(--color-border)',
            padding: '4px 16px',
          }}
        >
          <Search
            size={18}
            style={{ color: 'var(--color-muted)', flexShrink: 0, marginRight: 12 }}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search texts, chapters, passages…"
            aria-label="Global search"
            style={{
              width: '100%',
              height: 48,
              backgroundColor: 'transparent',
              border: 'none',
              fontFamily: 'var(--font-ui)',
              fontSize: 15,
              color: 'var(--color-text-primary)',
              outline: 'none',
            }}
          />
          <kbd
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-surface-high)',
              border: '1px solid var(--color-border)',
              fontFamily: 'var(--font-ui)',
              fontSize: 11,
              color: 'var(--color-muted)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            ESC
          </kbd>
        </div>
        {/* Results */}
        <div
          ref={listRef}
          role="listbox"
          style={{
            maxHeight: 360,
            overflowY: 'auto',
            padding: '4px 0',
          }}
        >
          {query.trim() === '' ? (
            <EmptyState />
          ) : flatResults.length === 0 ? (
            <NoResults query={query} />
          ) : (
            grouped.map((group) => (
              <div key={group.kind}>
                <div
                  style={{
                    padding: '8px 16px 4px',
                    fontFamily: 'var(--font-ui)',
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--color-muted)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {group.label}
                </div>
                {group.items.map((result) => {
                  flatIndex++;
                  const isActive = flatIndex === activeIdx;
                  const Icon = KIND_ICON[result.kind];
                  const idx = flatIndex;
                  return (
                    <button
                      key={`${result.kind}-${result.textId}-${result.chapterId}-${result.segmentId ?? ''}`}
                      data-idx={idx}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onClick={() => handleSelect(result)}
                      onMouseEnter={() => setActiveIdx(idx)}
                      className="w-full text-left flex items-center gap-3 transition-colors"
                      style={{
                        padding: '8px 16px',
                        backgroundColor: isActive ? 'var(--color-surface-low)' : 'transparent',
                        cursor: 'pointer',
                        borderLeft: isActive ? '2px solid var(--color-accent-bright)' : '2px solid transparent',
                      }}
                    >
                      <div
                        className="flex items-center justify-center flex-shrink-0"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: result.colorKey
                            ? `var(--color-highlight-${result.colorKey})`
                            : 'var(--color-surface-high)',
                        }}
                      >
                        <Icon
                          size={14}
                          style={{
                            color: result.colorKey
                              ? `var(--color-dot-${result.colorKey})`
                              : 'var(--color-secondary)',
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="truncate"
                          style={{
                            fontFamily: result.kind === 'segment' ? 'var(--font-zh-body)' : 'var(--font-ui)',
                            fontSize: result.kind === 'segment' ? 13 : 14,
                            fontWeight: result.kind === 'text' ? 600 : 500,
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          <HighlightMatch text={result.label} query={query} />
                        </div>
                        <div
                          className="truncate"
                          style={{
                            fontFamily: 'var(--font-ui)',
                            fontSize: 12,
                            color: 'var(--color-muted)',
                            marginTop: 1,
                          }}
                        >
                          <HighlightMatch text={result.sublabel} query={query} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          style={{
                            fontFamily: 'var(--font-ui)',
                            fontSize: 10,
                            fontWeight: 500,
                            color: 'var(--color-muted)',
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-toggle)',
                            backgroundColor: 'var(--color-surface-high)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {KIND_LABEL[result.kind]}
                        </span>
                        {isActive && (
                          <ArrowRight size={12} style={{ color: 'var(--color-accent-bright)' }} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
        {/* Footer */}
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            padding: '6px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontFamily: 'var(--font-ui)',
            fontSize: 11,
            color: 'var(--color-muted)',
          }}
        >
          <span className="flex items-center gap-1">
            <kbd style={kbdStyle}>↑</kbd>
            <kbd style={kbdStyle}>↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd style={kbdStyle}>↵</kbd>
            Open
          </span>
          <span className="flex items-center gap-1">
            <kbd style={kbdStyle}>Esc</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
}

const kbdStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 18,
  height: 18,
  padding: '0 4px',
  borderRadius: 3,
  backgroundColor: 'var(--color-surface-high)',
  border: '1px solid var(--color-border)',
  fontSize: 10,
  lineHeight: 1,
};

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        padding: '40px 24px',
        fontFamily: 'var(--font-ui)',
        color: 'var(--color-muted)',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          backgroundColor: 'var(--color-surface-high)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
        }}
      >
        <Search size={20} style={{ color: 'var(--color-muted)' }} />
      </div>
      <p style={{ fontSize: 14, fontWeight: 500 }}>Search across everything</p>
      <p style={{ fontSize: 12, marginTop: 4, textAlign: 'center' }}>
        Find texts, chapters, and passages in Chinese or English
      </p>
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        padding: '40px 24px',
        fontFamily: 'var(--font-ui)',
        color: 'var(--color-muted)',
      }}
    >
      <p style={{ fontSize: 14, fontWeight: 500 }}>
        No results for "{query}"
      </p>
      <p style={{ fontSize: 12, marginTop: 4 }}>
        Try a different term in Chinese or English
      </p>
    </div>
  );
}

/** Highlights matching substrings (case-insensitive + CJK-aware). */
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  const q = query.trim();
  const lower = text.toLowerCase();
  const qLower = q.toLowerCase();
  const idx = lower.indexOf(qLower);

  // Also try exact (for CJK)
  const cjkIdx = text.indexOf(q);
  const matchIdx = cjkIdx >= 0 ? cjkIdx : idx;
  const matchLen = cjkIdx >= 0 ? q.length : qLower.length;

  if (matchIdx < 0) return <>{text}</>;

  return (
    <>
      {text.slice(0, matchIdx)}
      <mark
        style={{
          backgroundColor: 'rgba(45, 131, 246, 0.15)',
          color: 'var(--color-accent)',
          borderRadius: 2,
          padding: '0 1px',
          fontWeight: 600,
        }}
      >
        {text.slice(matchIdx, matchIdx + matchLen)}
      </mark>
      {text.slice(matchIdx + matchLen)}
    </>
  );
}
