import type { ColorKey, Language } from '../../types';

export interface ParallelListItemProps {
  textId: string;
  colorKey: ColorKey;
  titleZh: string;
  titleEn: string;
  language: Language;
  hasParallels: boolean;
  isCurrentlyViewed: boolean;
  onClick: (textId: string, hasParallels: boolean) => void;
}

export function ParallelListItem({
  textId,
  colorKey,
  titleZh,
  titleEn,
  language,
  hasParallels,
  isCurrentlyViewed,
  onClick,
}: ParallelListItemProps) {
  const titleZhDisplay = titleZh;
  const subtitle = language === 'zh' ? titleEn : titleZh;
  const primary = language === 'zh' ? titleZhDisplay : titleEn;

  return (
    <button
      type="button"
      onClick={() => onClick(textId, hasParallels)}
      title={!hasParallels ? 'No parallels in this chapter' : undefined}
      aria-current={isCurrentlyViewed ? 'true' : undefined}
      className="w-full text-left flex items-center gap-3 transition-colors"
      style={{
        padding: '12px 16px',
        paddingLeft: isCurrentlyViewed ? 12 : 16,
        borderLeft: isCurrentlyViewed
          ? '4px solid var(--color-accent-bright)'
          : '4px solid transparent',
        backgroundColor: isCurrentlyViewed ? 'var(--color-surface-container)' : 'transparent',
        opacity: hasParallels ? 1 : 0.55,
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        if (!isCurrentlyViewed) e.currentTarget.style.backgroundColor = 'var(--color-surface-high)';
      }}
      onMouseLeave={(e) => {
        if (!isCurrentlyViewed) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <span
        aria-hidden
        style={{
          width: 8,
          height: 8,
          borderRadius: 9999,
          backgroundColor: `var(--color-dot-${colorKey})`,
          opacity: hasParallels ? 1 : 0.4,
          flexShrink: 0,
        }}
      />
      <span className="flex flex-col min-w-0 flex-1">
        <span
          className="truncate"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 14,
            fontWeight: isCurrentlyViewed ? 600 : 500,
            color: hasParallels ? 'var(--color-text-primary)' : 'var(--color-muted)',
            fontStyle: hasParallels ? 'normal' : 'italic',
          }}
        >
          {primary}
        </span>
        <span
          className="truncate"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 12,
            color: 'var(--color-muted)',
          }}
        >
          {subtitle}
        </span>
      </span>
    </button>
  );
}
