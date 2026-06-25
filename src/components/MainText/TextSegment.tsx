import { useRef, type CSSProperties } from "react";
import type { Segment, Language, DisplayMode, ViewMode } from "../../types";
import { AnnotationMarker } from "../Annotations/AnnotationMarker";

export interface TextSegmentProps {
  segment: Segment;
  language: Language;
  displayMode: DisplayMode;
  viewMode: ViewMode;
  isSelected: boolean;
  isPulsing: boolean;
  lineNumber: number;
  annotationCount: number;
  onClick: (segmentId: string, anchor: HTMLElement) => void;
  onAnnotationClick: (segmentId: string) => void;
}

function pickContent(
  segment: Segment,
  lang: Language,
  mode: DisplayMode,
): string {
  const c = segment.content;
  if (mode === "rhymed") {
    if (lang === "zh") return c.zhRhymed ?? c.zh;
    return c.enRhymed ?? c.en;
  }
  return lang === "zh" ? c.zh : c.en;
}

function highlightBackground(segment: Segment): string {
  const ps = segment.parallels;
  if (!ps || ps.length === 0) return "transparent";
  if (ps.length === 1) return `var(--color-highlight-${ps[0].colorKey})`;
  // Multi: equal-width linear-gradient with sharp stops
  const step = 100 / ps.length;
  const stops = ps
    .map((p, i) => {
      const start = i * step;
      const end = (i + 1) * step;
      return `var(--color-highlight-${p.colorKey}) ${start}% ${end}%`;
    })
    .join(", ");
  return `linear-gradient(to right, ${stops})`;
}

export function TextSegment({
  segment,
  language,
  displayMode,
  viewMode,
  isSelected,
  isPulsing,
  lineNumber,
  annotationCount,
  onClick,
  onAnnotationClick,
}: TextSegmentProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const content = pickContent(segment, language, displayMode);
  const hasParallels = (segment.parallels?.length ?? 0) > 0;
  const background = highlightBackground(segment);
  const firstColor = segment.parallels?.[0]?.colorKey;

  const wrapperStyle: CSSProperties = {
    position: "relative",
    marginBottom: 18,
    padding: "4px 0",
  };

  const highlightStyle: CSSProperties = {
    background,
    padding: hasParallels ? "4px 6px" : 0,
    borderRadius: "var(--radius-sm)",
    cursor: hasParallels ? "pointer" : "default",
    transition: "filter 150ms ease, box-shadow 150ms ease",
    outline: isSelected ? "2px solid var(--color-accent-bright)" : "none",
    outlineOffset: 1,
    display: "inline",
    color: "var(--color-text-primary)",
  };

  return (
    <p
      ref={ref}
      data-segment-id={segment.id}
      className={`scroll-anchor ${isPulsing ? "is-pulsing" : ""}`}
      style={wrapperStyle}
    >
      {viewMode === "research" && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: -64,
            top: 6,
            width: 56,
            color: "var(--color-muted)",
            fontFamily: "var(--font-ui)",
            fontSize: 11,
            textAlign: "right",
          }}
        >
          {lineNumber}
        </span>
      )}
      {hasParallels && firstColor && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: -16,
            top: 8,
            bottom: 8,
            width: 2,
            borderRadius: 9999,
            backgroundColor: `var(--color-highlight-${firstColor})`,
          }}
        />
      )}
      <span
        onClick={(e) => onClick(segment.id, e.currentTarget as HTMLElement)}
        onMouseEnter={(e) => {
          if (hasParallels)
            (e.currentTarget as HTMLElement).style.filter = "brightness(0.97)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.filter = "";
        }}
        style={highlightStyle}
        className={language === "zh" ? "font-serif" : "font-serif italic"}
      >
        {content}
      </span>
      <AnnotationMarker
        count={annotationCount}
        onClick={() => onAnnotationClick(segment.id)}
      />
    </p>
  );
}
