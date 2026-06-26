import type { ColorKey, Language } from "../../types";
import { Toggle } from "../shared/Toggle";

export interface ParallelListItemProps {
  colorKey: ColorKey;
  titleZh: string;
  titleEn: string;
  count: number;
  language: Language;
  isActive: boolean;
  isOn: boolean;
  onOpen: () => void;
  onToggle: () => void;
}

export function ParallelListItem({
  colorKey,
  titleZh,
  titleEn,
  count,
  language,
  isActive,
  isOn,
  onOpen,
  onToggle,
}: ParallelListItemProps) {
  const primary = language === "zh" ? titleZh : titleEn;
  const subtitle = language === "zh" ? titleEn : titleZh;
  const dim = isOn ? 1 : 0.45;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-current={isActive ? "true" : undefined}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return; // ignore keys from the Toggle
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="w-full text-left flex items-center gap-3 transition-colors"
      style={{
        padding: "12px 16px",
        paddingLeft: isActive ? 12 : 16,
        borderLeft: isActive
          ? "4px solid var(--color-accent-bright)"
          : "4px solid transparent",
        backgroundColor: isActive
          ? "var(--color-surface-container)"
          : "transparent",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        if (!isActive)
          e.currentTarget.style.backgroundColor = "var(--color-surface-high)";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <span
        aria-hidden
        style={{
          width: 8,
          height: 8,
          borderRadius: 9999,
          backgroundColor: `var(--color-dot-${colorKey})`,
          opacity: dim,
          flexShrink: 0,
        }}
      />
      <span className="flex flex-col min-w-0 flex-1" style={{ opacity: dim }}>
        <span
          className="truncate"
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 14,
            fontWeight: isActive ? 600 : 500,
            color: "var(--color-text-primary)",
          }}
        >
          {primary}
        </span>
        <span
          className="truncate"
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 12,
            color: "var(--color-muted)",
          }}
        >
          {subtitle} · {count}
        </span>
      </span>
      <span
        onClick={(e) => e.stopPropagation()}
        style={{ flexShrink: 0, display: "inline-flex" }}
      >
        <Toggle
          checked={isOn}
          onChange={onToggle}
          size="sm"
          ariaLabel={
            isOn ? `Hide ${titleEn} highlights` : `Show ${titleEn} highlights`
          }
        />
      </span>
    </div>
  );
}
