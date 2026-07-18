import { Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IconButton } from './IconButton';

export interface ParallelTitlesToggleProps {
  className?: string;
}

export function ParallelTitlesToggle({ className }: ParallelTitlesToggleProps) {
  const { state, toggleParallelTitles } = useApp();

  const hidden = state.hideParallelTitles;
  return (
    <IconButton
      active={hidden}
      aria-label={`Parallel titles: ${hidden ? 'hidden' : 'shown'} — click to toggle`}
      title={hidden ? 'Show parallel titles' : 'Hide parallel titles'}
      aria-pressed={hidden}
      onClick={toggleParallelTitles}
      className={className}
    >
      {hidden ? <EyeOff size={18} /> : <Eye size={18} />}
    </IconButton>
  );
}
