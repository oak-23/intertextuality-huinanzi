import { ArrowLeftRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IconButton } from './IconButton';

export interface SwapPanelsToggleProps {
  className?: string;
}

export function SwapPanelsToggle({ className }: SwapPanelsToggleProps) {
  const { state, toggleSwapPanels } = useApp();
  const visible = state.parallelPanel !== null;
  if (!visible) return null;
  return (
    <IconButton
      aria-label="Swap main and parallel panels"
      aria-pressed={state.panelsSwapped}
      onClick={toggleSwapPanels}
      active={state.panelsSwapped}
      className={className}
    >
      <ArrowLeftRight size={18} />
    </IconButton>
  );
}
