import { Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IconButton } from './IconButton';

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { state, toggleTheme } = useApp();
  const dark = state.theme === 'dark';
  return (
    <IconButton
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
      className={className}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </IconButton>
  );
}
