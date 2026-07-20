import { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Check, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useChapterNavigation } from '../../hooks/useChapterNavigation';
import { Popover } from '../shared/Popover';
import { IconButton } from './IconButton';
import { formatTitleEn } from '../../utils/titles';

export interface ChapterSelectorProps {
  className?: string;
}

export function ChapterSelector({ className }: ChapterSelectorProps) {
  const { state } = useApp();
  const { chapters, switchChapter } = useChapterNavigation();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');

  // Reset + focus on open.
  useEffect(() => {
    if (open) {
      setFilter('');
      const handle = window.setTimeout(() => searchRef.current?.focus(), 50);
      return () => window.clearTimeout(handle);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return chapters;
    return chapters.filter(
      (c) =>
        c.title.zh.includes(filter.trim()) ||
        c.title.en.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
    );
  }, [chapters, filter]);

  return (
    <>
      <IconButton
        ref={triggerRef}
        active={open}
        aria-label="Select chapter"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={className}
      >
        <BookOpen size={18} />
      </IconButton>
      <Popover
        open={open}
        anchor={triggerRef.current}
        placement="bottom-end"
        onClose={() => setOpen(false)}
        width={280}
        ariaLabel="Chapter selector"
      >
        <div className="py-2 flex flex-col" style={{ maxHeight: 420 }}>
          <div
            className="px-4 py-1 uppercase"
            style={{
              color: 'var(--color-muted)',
              letterSpacing: '0.05em',
              fontSize: 12,
              fontWeight: 500,
              fontFamily: 'var(--font-ui)',
            }}
          >
            Chapters
          </div>
          <div style={{ padding: '6px 12px 8px' }}>
            <div className="relative">
              <span
                className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--color-secondary)' }}
              >
                <Search size={14} />
              </span>
              <input
                ref={searchRef}
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search chapters…"
                aria-label="Filter chapters"
                style={{
                  width: '100%',
                  height: 32,
                  paddingLeft: 30,
                  paddingRight: 10,
                  backgroundColor: 'var(--color-surface-low)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-button)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 13,
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-accent-bright)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              />
            </div>
          </div>
          <div role="listbox" style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div
                className="px-4 py-6 text-center"
                style={{
                  color: 'var(--color-muted)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 13,
                }}
              >
                No chapters match “{filter}”.
              </div>
            ) : (
              filtered.map((chapter) => {
                const active = chapter.id === state.activeChapterId;
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      switchChapter(chapter.id);
                      setOpen(false);
                    }}
                    className="w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-surface-low transition-colors"
                    style={{
                      backgroundColor: active ? 'var(--color-surface-low)' : 'transparent',
                      borderLeft: active
                        ? '2px solid var(--color-accent-bright)'
                        : '2px solid transparent',
                      paddingLeft: active ? 14 : 16,
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-serif"
                        style={{
                          color: 'var(--color-text-primary)',
                          fontSize: 16,
                          fontWeight: active ? 600 : 500,
                        }}
                      >
                        {formatTitleEn(chapter.title.en)}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-zh-body)',
                          fontSize: 16,
                          color: 'var(--color-secondary)',
                        }}
                      >
                        {chapter.title.zh}
                      </div>
                    </div>
                    {active && (
                      <Check
                        size={14}
                        style={{ color: 'var(--color-accent-bright)', marginTop: 4, flexShrink: 0 }}
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </Popover>
    </>
  );
}
