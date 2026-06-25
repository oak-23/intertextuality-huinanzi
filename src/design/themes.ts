import { tokens, type Tokens } from './tokens';
import type { ViewMode } from '../types';

export const normalMode: Tokens = tokens;

export const researchMode: Tokens = {
  ...tokens,
  typography: {
    ...tokens.typography,
    zhBody: { ...tokens.typography.zhBody, size: '16px', lineHeight: '1.6' },
    enBody: { ...tokens.typography.enBody, size: '14px', lineHeight: '1.5' },
  },
  spacing: {
    ...tokens.spacing,
    mainTextMaxWidth: '840px',
  },
};

export function getTheme(mode: ViewMode): Tokens {
  return mode === 'research' ? researchMode : normalMode;
}

const COLOR_KEYS: Array<keyof Tokens['color']['dot']> = [
  'laozi',
  'zhuangzi',
  'xunzi',
  'liji'
];

/**
 * Flatten a theme into a CSS-custom-property map so Tailwind classes
 * (`bg-surface`, `text-primary`, `bg-highlight-laozi`, …) can reference them
 * via var(--token).
 */
export function themeToCssVars(theme: Tokens): Record<string, string> {
  const c = theme.color;
  const t = theme.typography;
  const s = theme.spacing;
  const r = theme.radius;
  const sh = theme.shadow;

  const vars: Record<string, string> = {
    '--color-primary': c.primary,
    '--color-primary-strong': c.primaryStrong,
    '--color-secondary': c.secondary,
    '--color-muted': c.muted,
    '--color-accent': c.accent,
    '--color-accent-bright': c.accentBright,
    '--color-accent-pressed': c.accentPressed,
    '--color-background': c.background,
    '--color-surface': c.surface,
    '--color-surface-low': c.surfaceContainerLow,
    '--color-surface-container': c.surfaceContainer,
    '--color-surface-high': c.surfaceContainerHigh,
    '--color-border': c.border,
    '--color-border-strong': c.borderStrong,
    '--color-success': c.success,
    '--color-error': c.error,
    '--color-text-primary': c.text.primary,
    '--color-text-secondary': c.text.secondary,
    '--color-text-muted': c.text.muted,
    '--color-text-inverse': c.text.inverse,
    '--top-bar-height': s.topBarHeight,
    '--sidebar-width': s.sidebarWidth,
    '--main-text-max-width': s.mainTextMaxWidth,
    '--gutter': s.gutter,
    '--margin-desktop': s.marginDesktop,
    '--margin-mobile': s.marginMobile,
    '--radius-sm': r.sm,
    '--radius-button': r.button,
    '--radius-popover': r.popover,
    '--radius-modal': r.modal,
    '--radius-lg': r.lg,
    '--radius-toggle': r.toggle,
    '--shadow-popover': sh.popover,
    '--shadow-modal': sh.modal,
    '--shadow-panel': sh.panel,
    '--font-zh-body': t.zhBody.fontFamily,
    '--font-en-body': t.enBody.fontFamily,
    '--font-ui': t.uiLabel.fontFamily,
    '--zh-body-size': t.zhBody.size,
    '--zh-body-line-height': t.zhBody.lineHeight,
    '--en-body-size': t.enBody.size,
    '--en-body-line-height': t.enBody.lineHeight,
  };

  for (const key of COLOR_KEYS) {
    vars[`--color-dot-${key}`] = c.dot[key];
    vars[`--color-highlight-${key}`] = c.highlight[key];
  }

  return vars;
}
