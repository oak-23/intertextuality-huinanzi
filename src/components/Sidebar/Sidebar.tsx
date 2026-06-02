import { useApp } from '../../context/AppContext';
import { ParallelList } from './ParallelList';

export interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { state, toggleSidebar } = useApp();
  return (
    <nav
      aria-label="Parallel texts"
      className={className}
      style={{
        position: 'fixed',
        top: 'var(--top-bar-height)',
        left: 0,
        width: 'var(--sidebar-width)',
        height: 'calc(100vh - var(--top-bar-height))',
        backgroundColor: 'var(--color-surface-low)',
        borderRight: '1px solid var(--color-border)',
        transform: state.sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 300ms ease',
        overflowY: 'auto',
        paddingTop: 16,
        paddingBottom: 64,
        zIndex: 40,
      }}
    >
      <div className="px-4 mb-5 flex items-start justify-between">
        <div>
          <h2
            className="font-serif"
            style={{
              color: 'var(--color-text-primary)',
              fontSize: 22,
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            Parallel Texts
          </h2>
          <p
            style={{
              marginTop: 4,
              color: 'var(--color-secondary)',
              fontSize: 12,
              fontFamily: 'var(--font-ui)',
            }}
          >
            Compare textual variants
          </p>
        </div>

      </div>
      <ParallelList />
    </nav>
  );
}
