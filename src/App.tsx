import { useEffect, useState, useCallback } from 'react';
import { useApp } from './context/AppContext';
import { TopBar } from './components/TopBar/TopBar';
import { Sidebar } from './components/Sidebar/Sidebar';
import { MainText } from './components/MainText/MainText';
import { ParallelPanel } from './components/ParallelPanel/ParallelPanel';
import { CommandPalette } from './components/CommandPalette/CommandPalette';
import { ZoomControl } from './components/ZoomControl/ZoomControl';

export function App() {
  const { state, closeParallel } = useApp();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  // Global ⌘K / Ctrl+K handler to open the command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
        return;
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

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
      <TopBar onSearchClick={openPalette} />
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
      <ZoomControl />
      <CommandPalette open={paletteOpen} onClose={closePalette} />
    </div>
  );
}
