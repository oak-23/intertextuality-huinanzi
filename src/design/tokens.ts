import type { ColorKey } from '../types';

export interface DotPalette {
  readonly [key: string]: string;
}

export interface HighlightPalette {
  readonly [key: string]: string;
}

export const tokens = {
  color: {
    primary: '#1A1C1D',
    primaryStrong: '#030304',
    secondary: '#46464A',
    muted: '#86868B',
    accent: '#0071E3',
    accentBright: '#2D83F6',
    accentPressed: '#005EC0',
    background: '#FFFFFF',
    surface: '#F9F9FB',
    surfaceContainerLow: '#F3F3F5',
    surfaceContainer: '#EEEEF0',
    surfaceContainerHigh: '#E8E8EA',
    border: '#C7C6CA',
    borderStrong: '#77767B',
    success: '#34C759',
    error: '#BA1A1A',
    text: {
      primary: '#1A1C1D',
      secondary: '#46464A',
      muted: '#86868B',
      inverse: '#FFFFFF',
    },
    dot: {
      laozi: '#FF7F50',
      zhuangzi: '#4CAF50',
      xunzi: '#795548',
      liji: '#b7dd2dff',
    } as Record<ColorKey, string>,
    highlight: {
      laozi: '#FFCCB9',
      zhuangzi: '#B7DFB9',
      xunzi: '#BCAAA4',
      liji: '#d3ff39ff',
    } as Record<ColorKey, string>,
  },
  typography: {
    displayLg: {
      fontFamily: '"Noto Serif SC", serif',
      size: '40px',
      weight: 700,
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
    },
    headingMd: {
      fontFamily: '"Noto Serif SC", serif',
      size: '24px',
      weight: 600,
      lineHeight: '1.4',
    },
    zhBody: {
      fontFamily: '"Noto Serif SC", serif',
      size: '18px',
      weight: 400,
      lineHeight: '2.0',
    },
    enBody: {
      fontFamily: '"Noto Serif SC", serif',
      size: '16px',
      weight: 400,
      lineHeight: '1.8',
    },
    uiLabel: {
      fontFamily: '"Inter", -apple-system, sans-serif',
      size: '14px',
      weight: 500,
      lineHeight: '20px',
    },
    uiSmall: {
      fontFamily: '"Inter", -apple-system, sans-serif',
      size: '13px',
      weight: 400,
      lineHeight: '18px',
    },
    caption: {
      fontFamily: '"Inter", -apple-system, sans-serif',
      size: '12px',
      weight: 400,
      lineHeight: '16px',
      letterSpacing: '0.01em',
    },
    eyebrow: {
      fontFamily: '"Inter", -apple-system, sans-serif',
      size: '14px',
      weight: 500,
      lineHeight: '20px',
      letterSpacing: '0.2em',
      textTransform: 'uppercase' as const,
    },
  },
  spacing: {
    topBarHeight: '56px',
    sidebarWidth: '280px',
    mainTextMaxWidth: '840px',
    panelGap: '0px',
    gutter: '24px',
    marginDesktop: '40px',
    marginMobile: '16px',
  },
  radius: {
    sm: '4px',
    button: '8px',
    popover: '8px',
    modal: '12px',
    lg: '16px',
    toggle: '9999px',
  },
  shadow: {
    popover: '0 2px 8px rgba(0,0,0,0.08)',
    modal: '0 4px 24px rgba(0,0,0,0.12)',
    panel: '0 2px 8px rgba(0,0,0,0.06)',
  },
  transition: {
    panel: '300ms ease',
    popover: '150ms ease',
    modal: '200ms ease',
    pulse: '600ms ease',
  },
};

export type Tokens = typeof tokens;
