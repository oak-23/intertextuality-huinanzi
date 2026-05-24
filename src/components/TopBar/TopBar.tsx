import { SidebarToggle } from './SidebarToggle';
import { SearchBar } from './SearchBar';
import { SwapPanelsToggle } from './SwapPanelsToggle';
import { LanguageToggle } from './LanguageToggle';
import { RhymedProseToggle } from './RhymedProseToggle';
import { ChapterSelector } from './ChapterSelector';
import { ModeSwitch } from './ModeSwitch';
import { ReportButton } from './ReportButton';
import { LoginButton } from './LoginButton';
import { AnnotateButton } from './AnnotateButton';

export interface TopBarProps {
  className?: string;
}

export function TopBar({ className }: TopBarProps) {
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
        <SearchBar />
      </div>
      <div className="flex items-center gap-2 flex-1 justify-end">
        <SwapPanelsToggle />
        <LanguageToggle />
        <RhymedProseToggle />
        <ChapterSelector />
        <ModeSwitch />
        <ReportButton />
        <LoginButton />
        <AnnotateButton />
      </div>
    </header>
  );
}
