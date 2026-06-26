import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useRepositories } from "../../context/RepositoryContext";
// ParallelPanel reads token-defined CSS vars only — no hardcoded hex.

export interface ParallelPanelProps {
  className?: string;
}

function renderHighlightedText(
  text: string,
  highlightText?: string,
  colorKey?: string,
  onHighlightClick?: () => void,
) {
  if (!highlightText) return text;
  const index = text.indexOf(highlightText);
  if (index === -1) return text;

  const before = text.slice(0, index);
  const after = text.slice(index + highlightText.length);
  return (
    <>
      {before}
      <span
        onClick={onHighlightClick}
        style={{
          backgroundColor: `var(--color-highlight-${colorKey ?? "laozi"})`,
          borderRadius: "var(--radius-sm)",
          padding: "2px 4px",
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
          cursor: onHighlightClick ? "pointer" : "default",
        }}
      >
        {highlightText}
      </span>
      {after}
    </>
  );
}

export function ParallelPanel({ className }: ParallelPanelProps) {
  const { state, closeParallel } = useApp();
  const { texts } = useRepositories();
  const containerRef = useRef<HTMLDivElement>(null);

  const panel = state.parallelPanel;
  const text = panel ? texts.getParallelText(panel.textId) : null;
  const segment = panel
    ? texts.getSegment(panel.textId, panel.chapterId, panel.segmentId)
    : null;
  const chapter =
    panel && text ? text.chapters.find((c) => c.id === panel.chapterId) : null;

  const handleScrollToMainText = () => {
    if (!segment) return;
    const target = document.querySelector(
      `[data-parallel-ids~="${segment.id}"]`,
    );
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add("is-pulsing");
      setTimeout(() => {
        target.classList.remove("is-pulsing");
      }, 1200);
    }
  };

  useEffect(() => {
    if (panel && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [panel]);

  return (
    <aside
      ref={containerRef}
      aria-label="Parallel text"
      aria-hidden={!panel}
      className={className}
      style={{
        width: panel ? "50%" : 0,
        minWidth: 0,
        height: "100%",
        overflow: "hidden",
        backgroundColor: "var(--color-background)",
        borderLeft: panel ? "1px solid var(--color-border)" : "none",
        transition: "width 300ms ease, border-color 300ms ease",
        flexShrink: 0,
      }}
    >
      {panel && text && segment && (
        <div
          className="mx-auto"
          style={{
            maxWidth: 640,
            padding: "64px 32px 96px",
            height: "100%",
            overflowY: "auto",
          }}
        >
          <header className="mb-10 text-center relative">
            <button
              type="button"
              aria-label="Close parallel"
              onClick={closeParallel}
              className="absolute top-0 right-0 inline-flex items-center justify-center hover:bg-surface-low rounded-full transition-colors"
              style={{ width: 32, height: 32, color: "var(--color-secondary)" }}
            >
              <X size={16} />
            </button>
            <p
              style={{
                fontFamily: "var(--font-ui)",
                fontWeight: 500,
                fontSize: 13,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--color-secondary)",
                fontStyle: "italic",
                marginBottom: 12,
              }}
            >
              {text.title.en}
            </p>
            <h2
              className="font-serif"
              style={{
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                marginBottom: chapter ? 16 : 12,
                color: "var(--color-text-primary)",
              }}
            >
              {text.title.zh}
            </h2>
            {chapter && (
              <>
                {chapter.title.en ? (
                  <p
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontWeight: 500,
                      fontSize: 11,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "var(--color-secondary)",
                      marginBottom: 8,
                    }}
                  >
                    {`"${chapter.title.en}"`}
                  </p>
                ) : null}
                <h3
                  className="font-serif"
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {chapter.title.zh}
                </h3>
              </>
            )}
            <div
              aria-hidden
              style={{
                width: 36,
                height: 1,
                backgroundColor: "var(--color-border)",
                margin: "24px auto 0",
              }}
            />
          </header>
          <div
            style={{
              fontFamily:
                state.language === "zh"
                  ? "var(--font-zh-body)"
                  : "var(--font-en-body)",
              fontSize:
                state.language === "zh"
                  ? "var(--zh-body-size)"
                  : "var(--en-body-size)",
              lineHeight:
                state.language === "zh"
                  ? "var(--zh-body-line-height)"
                  : "var(--en-body-line-height)",
              color: "var(--color-text-primary)",
            }}
          >
            <p
              style={{
                padding: "6px 8px",
                borderRadius: "var(--radius-sm)",
              }}
              className={
                state.language === "zh" ? "font-serif" : "font-serif italic"
              }
            >
              {renderHighlightedText(
                panel.contextText ??
                  (state.language === "zh"
                    ? segment.content.zh
                    : segment.content.en),
                panel.highlightText,
                text.colorKey,
                handleScrollToMainText,
              )}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
