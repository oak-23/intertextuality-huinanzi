import { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { TopBar } from './components/TopBar/TopBar';
import { Sidebar } from './components/Sidebar/Sidebar';
import { MainText } from './components/MainText/MainText';
import { ParallelPanel } from './components/ParallelPanel/ParallelPanel';

export function App() {
  const { state, closeParallel } = useApp();

  // Global Escape handler: close the parallel panel if nothing else has taken it.
  // Modals/popovers handle Escape themselves and stop propagation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.parallelPanel) {
        closeParallel();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [state.parallelPanel, closeParallel]);

  const sidebarOpen = state.sidebarOpen;

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <TopBar />
      <Sidebar />
      <div
        style={{
          paddingTop: 'var(--top-bar-height)',
          marginLeft: sidebarOpen ? 'var(--sidebar-width)' : 0,
          transition: 'margin-left 300ms ease',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          overflow: 'hidden',
          flexDirection: state.panelsSwapped ? 'row-reverse' : 'row',
        }}
      >
        <div
          style={{
            flex: '1 1 0',
            minWidth: 0,
            height: '100%',
          }}
        >
          <MainText />
        </div>
        <ParallelPanel />
      </div>
    </div>
  );
}
