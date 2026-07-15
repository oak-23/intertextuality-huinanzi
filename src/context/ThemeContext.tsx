import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { tokens, type Tokens } from '../design/tokens';
import { useApp } from './AppContext';

const ThemeContext = createContext<Tokens | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Stamps the current theme ("light" | "dark") onto <html> as data-theme.
 * All color tokens live in index.css; the dark palette is the
 * `:root[data-theme='dark']` override block there.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const { state } = useApp();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);

  return <ThemeContext.Provider value={tokens}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Tokens {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside a ThemeProvider');
  return ctx;
}
