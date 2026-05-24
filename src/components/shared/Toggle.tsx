import type { CSSProperties } from 'react';

export interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaLabel: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export function Toggle({ checked, onChange, ariaLabel, size = 'md', disabled }: ToggleProps) {
  const dims = size === 'sm' ? { w: 32, h: 18, k: 14 } : { w: 40, h: 22, k: 18 };
  const trackStyle: CSSProperties = {
    width: dims.w,
    height: dims.h,
    backgroundColor: checked ? 'var(--color-accent-bright)' : 'var(--color-surface-high)',
    borderRadius: 9999,
    transition: 'background-color 150ms ease',
    opacity: disabled ? 0.5 : 1,
  };
  const knobStyle: CSSProperties = {
    width: dims.k,
    height: dims.k,
    backgroundColor: 'var(--color-text-inverse)',
    borderRadius: 9999,
    boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
    transform: `translateX(${checked ? dims.w - dims.k - 2 : 2}px)`,
    transition: 'transform 180ms ease',
  };
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        padding: 0,
        border: 'none',
        background: 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <span style={trackStyle} />
      <span style={{ position: 'absolute', top: (dims.h - dims.k) / 2, left: 0, ...knobStyle }} />
    </button>
  );
}
