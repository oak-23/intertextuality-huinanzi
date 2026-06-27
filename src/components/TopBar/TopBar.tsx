import { Search } from 'lucide-react';
import { SidebarToggle } from './SidebarToggle';
import { SearchBar } from './SearchBar';
import { SwapPanelsToggle } from './SwapPanelsToggle';
import { LanguageToggle } from './LanguageToggle';
import { RhymedProseToggle } from './RhymedProseToggle';
import { ParallelTitlesToggle } from './ParallelTitlesToggle';
import { ChapterSelector } from './ChapterSelector';
import { ModeSwitch } from './ModeSwitch';
import { ReportButton } from './ReportButton';
import { LoginButton } from './LoginButton';
import { AnnotateButton } from './AnnotateButton';

export interface TopBarProps {
  className?: string;
  onSearchClick?: () => void;
}

export function TopBar({ className, onSearchClick }: TopBarProps) {
  const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.userAgent);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center ${className ?? ''}`}
      style={{
        height: 'var(--top-bar-height)',
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 var(--margin-desktop)',
      }}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <SidebarToggle />
        <span
          className="font-serif truncate"
          style={{
            color: 'var(--color-text-primary)',
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}
        >
          Intertextuality
        </span>
      </div>
      <div className="hidden md:flex flex-1 justify-center mx-4">
        {onSearchClick ? (
          <button
            type="button"
            onClick={onSearchClick}
            className="w-full max-w-md flex items-center gap-2 transition-colors"
            style={{
              height: 36,
              paddingLeft: 12,
              paddingRight: 12,
              backgroundColor: 'var(--color-surface-low)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-button)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-strong)';
              e.currentTarget.style.backgroundColor = 'var(--color-surface-container)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.backgroundColor = 'var(--color-surface-low)';
            }}
          >
            <Search size={14} style={{ color: 'var(--color-muted)', flexShrink: 0 }} />
            <span
              style={{
                flex: 1,
                textAlign: 'left',
                fontFamily: 'var(--font-ui)',
                fontSize: 13,
                color: 'var(--color-muted)',
              }}
            >
              Search texts, chapters, passages…
            </span>
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
              }}
            >
              {isMac ? '⌘' : 'Ctrl+'}K
            </kbd>
          </button>
        ) : (
          <SearchBar />
        )}
      </div>
      <div className="flex items-center gap-2 flex-1 justify-end">
        <SwapPanelsToggle />
        <LanguageToggle />
        <RhymedProseToggle />
        <ParallelTitlesToggle />
        <ChapterSelector />
        <ModeSwitch />
        <ReportButton />
        <LoginButton />
        <AnnotateButton />
      </div>
    </header>
  );
}

