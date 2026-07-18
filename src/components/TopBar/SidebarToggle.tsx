import { Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IconButton } from './IconButton';

export interface SidebarToggleProps {
  className?: string;
}

export function SidebarToggle({ className }: SidebarToggleProps) {
  const { state, toggleSidebar } = useApp();
  return (
    <IconButton
      aria-label={state.sidebarOpen ? 'Close parallel-texts sidebar' : 'Open parallel-texts sidebar'}
      aria-pressed={state.sidebarOpen}
      active={state.sidebarOpen}
      onClick={toggleSidebar}
      className={className}
    >
      <Menu size={20} />
    </IconButton>
  );
}
