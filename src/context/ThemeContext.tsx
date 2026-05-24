import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { getTheme, themeToCssVars } from '../design/themes';
import type { Tokens } from '../design/tokens';
import { useApp } from './AppContext';

const ThemeContext = createContext<Tokens | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { state } = useApp();
  const theme = useMemo(() => getTheme(state.viewMode), [state.viewMode]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const vars = themeToCssVars(theme);
    const root = document.documentElement;
    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value);
    }
  }, [theme]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Tokens {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside a ThemeProvider');
  return ctx;
}
