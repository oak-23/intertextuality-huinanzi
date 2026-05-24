import { Languages } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IconButton } from './IconButton';

export interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { state, setLanguage } = useApp();
  const next = state.language === 'zh' ? 'en' : 'zh';
  return (
    <IconButton
      aria-label={`Switch to ${next === 'zh' ? '中文' : 'English'}`}
      onClick={() => setLanguage(next)}
      className={className}
    >
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <Languages size={18} />
        <span
          aria-hidden
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--color-secondary)',
            position: 'absolute',
            bottom: -8,
            right: -6,
            backgroundColor: 'var(--color-background)',
            padding: '0 3px',
            borderRadius: 3,
          }}
        >
          {state.language === 'zh' ? '中' : 'EN'}
        </span>
      </span>
    </IconButton>
  );
}
