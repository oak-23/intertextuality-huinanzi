import { Search, ChevronUp, ChevronDown, X as XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { useApp } from '../../context/AppContext';
import type { SearchScope } from '../../types';

export interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const search = useSearch();
  const { state } = useApp();
  const [local, setLocal] = useState(search.query);

  // Debounce input → search query
  useEffect(() => {
    const handle = window.setTimeout(() => search.setQuery(local), 200);
    return () => window.clearTimeout(handle);
  }, [local, search]);

  // Sync external clears
  useEffect(() => {
    if (search.query === '' && local !== '') setLocal('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.query]);

  const placeholder = state.language === 'zh' ? '搜尋淮南子…' : 'Search Huainanzi…';
  const matchCount = search.results.length;
  const showMatchUi = local.trim().length > 0;

  return (
    <div className={`relative w-full max-w-md ${className ?? ''}`}>
      <span
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'var(--color-secondary)' }}
      >
        <Search size={16} />
      </span>
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="w-full text-ui-small"
        style={{
          height: 36,
          paddingLeft: 36,
          paddingRight: showMatchUi ? 144 : 96,
          backgroundColor: 'var(--color-surface-low)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-button)',
          color: 'var(--color-text-primary)',
          outline: 'none',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-accent-bright)';
          e.currentTarget.style.boxShadow = '0 0 0 1px var(--color-accent-bright)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      <div
        className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1"
        style={{ color: 'var(--color-secondary)' }}
      >
        {showMatchUi && (
          <>
            <span className="text-caption" style={{ color: 'var(--color-muted)' }}>
              {matchCount > 0 ? `${search.currentIndex + 1}/${matchCount}` : '0'}
            </span>
            <button
              type="button"
              aria-label="Previous match"
              onClick={search.prev}
              disabled={matchCount === 0}
              className="w-6 h-6 inline-flex items-center justify-center rounded-md hover:bg-surface-high disabled:opacity-30"
            >
              <ChevronUp size={14} />
            </button>
            <button
              type="button"
              aria-label="Next match"
              onClick={search.next}
              disabled={matchCount === 0}
              className="w-6 h-6 inline-flex items-center justify-center rounded-md hover:bg-surface-high disabled:opacity-30"
            >
              <ChevronDown size={14} />
            </button>
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setLocal('');
                search.clear();
              }}
              className="w-6 h-6 inline-flex items-center justify-center rounded-md hover:bg-surface-high"
            >
              <XIcon size={14} />
            </button>
          </>
        )}
        <ScopeToggle value={search.scope} onChange={search.setScope} />
      </div>
    </div>
  );
}

function ScopeToggle({
  value,
  onChange,
}: {
  value: SearchScope;
  onChange: (scope: SearchScope) => void;
}) {
  return (
    <div
      className="inline-flex items-center text-caption ml-1"
      style={{
        backgroundColor: 'var(--color-surface-high)',
        borderRadius: 9999,
        padding: 2,
        height: 24,
      }}
    >
      {(['all', 'main', 'parallel'] as const).map((s) => {
        const active = value === s;
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            aria-pressed={active}
            className="px-2 transition-colors"
            style={{
              height: 20,
              borderRadius: 9999,
              backgroundColor: active ? 'var(--color-background)' : 'transparent',
              color: active ? 'var(--color-text-primary)' : 'var(--color-secondary)',
              fontWeight: active ? 500 : 400,
              fontSize: 11,
            }}
          >
            {s === 'all' ? 'All' : s === 'main' ? 'Main' : 'Parallel'}
          </button>
        );
      })}
    </div>
  );
}
