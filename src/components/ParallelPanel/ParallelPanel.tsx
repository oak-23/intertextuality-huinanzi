import { useEffect, useRef } from "react";
import { X, ChevronLeft } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useRepositories } from "../../context/RepositoryContext";
import type { InlineParallel } from "../../types";
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

/** Best-effort scroll + pulse of a main-text highlight by its segment id. */
function scrollToMainText(segmentId?: string) {
  if (!segmentId) return;
  const target = document.querySelector(`[data-parallel-ids~="${segmentId}"]`);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("is-pulsing");
    setTimeout(() => target.classList.remove("is-pulsing"), 1200);
  }
}

export function ParallelPanel({ className }: ParallelPanelProps) {
  const { state, closeParallel, closeParallelList, openParallelInList } =
    useApp();
  const { texts } = useRepositories();
  const containerRef = useRef<HTMLDivElement>(null);

  const lang = state.language;
  const panel = state.parallelPanel;
  const listTextId = state.parallelListTextId;

  // --- Text mode data ---
  const text = panel ? texts.getParallelText(panel.textId) : null;
  const segment = panel
    ? texts.getSegment(panel.textId, panel.chapterId, panel.segmentId)
    : null;
  const chapter =
    panel && text ? text.chapters.find((c) => c.id === panel.chapterId) : null;

  // --- List mode data ---
  const listText = listTextId ? texts.getParallelText(listTextId) : null;
  const continuousChapter = texts.getContinuousChapter(state.activeChapterId);
  const listItems: InlineParallel[] =
    listTextId && continuousChapter
      ? continuousChapter.inlineParallels
          .filter((p) => p.textId === listTextId && p.startZh >= 0)
          .slice()
          .sort(
            (a, b) =>
              (lang === "zh" ? a.startZh : a.startEn) -
              (lang === "zh" ? b.startZh : b.startEn),
          )
      : [];

  const isOpen = !!panel || !!listText;

  const handleListItemClick = (p: InlineParallel) => {
    const seg = texts.getSegment(p.textId, p.chapterId, p.segmentId);
    const highlightText =
      lang === "zh"
        ? (seg?.content.zh ?? p.zhMatch)
        : (seg?.content.en ?? p.enMatch);
    openParallelInList({
      textId: p.textId,
      chapterId: p.chapterId,
      segmentId: p.segmentId,
      contextText: p.zhContext ?? p.enContext ?? highlightText,
      highlightText,
    });
    scrollToMainText(p.segmentId);
  };

  useEffect(() => {
    if (isOpen && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [panel, listTextId, isOpen]);

  return (
    <aside
      ref={containerRef}
      aria-label="Parallel text"
      aria-hidden={!isOpen}
      className={className}
      style={{
        width: isOpen ? "50%" : 0,
        minWidth: 0,
        height: "100%",
        overflow: "hidden",
        backgroundColor: "var(--color-background)",
        borderLeft: isOpen ? "1px solid var(--color-border)" : "none",
        transition: "width 300ms ease, border-color 300ms ease",
        flexShrink: 0,
      }}
    >
      {/* ----- TEXT MODE: a single parallel passage ----- */}
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
            {listTextId && (
              <button
                type="button"
                aria-label="Back to list"
                onClick={closeParallel}
                className="absolute top-0 left-0 inline-flex items-center justify-center hover:bg-surface-low rounded-full transition-colors"
                style={{
                  width: 32,
                  height: 32,
                  color: "var(--color-secondary)",
                }}
              >
                <ChevronLeft size={18} />
              </button>
            )}
            <button
              type="button"
              aria-label="Close parallel"
              onClick={closeParallelList}
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
                lang === "zh"
                  ? "var(--font-zh-body)"
                  : "var(--font-en-body)",
              fontSize:
                lang === "zh" ? "var(--zh-body-size)" : "var(--en-body-size)",
              lineHeight:
                lang === "zh"
                  ? "var(--zh-body-line-height)"
                  : "var(--en-body-line-height)",
              color: "var(--color-text-primary)",
            }}
          >
            <p
              style={{ padding: "6px 8px", borderRadius: "var(--radius-sm)" }}
              className={lang === "zh" ? "font-serif" : "font-serif italic"}
            >
              {renderHighlightedText(
                panel.contextText ??
                  (lang === "zh" ? segment.content.zh : segment.content.en),
                panel.highlightText,
                text.colorKey,
                () => scrollToMainText(segment.id),
              )}
            </p>
          </div>
        </div>
      )}

      {/* ----- LIST MODE: numbered parallels for one source text ----- */}
      {!panel && listText && (
        <div
          className="mx-auto"
          style={{
            maxWidth: 640,
            padding: "64px 32px 96px",
            height: "100%",
            overflowY: "auto",
          }}
        >
          <header className="mb-8 text-center relative">
            <button
              type="button"
              aria-label="Close list"
              onClick={closeParallelList}
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
              {listText.title.en}
            </p>
            <h2
              className="font-serif"
              style={{
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                marginBottom: 8,
                color: "var(--color-text-primary)",
              }}
            >
              {listText.title.zh}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 13,
                color: "var(--color-secondary)",
              }}
            >
              {listItems.length}{" "}
              {listItems.length === 1 ? "parallel" : "parallels"}
            </p>
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
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {listItems.map((p, i) => {
              const snippet =
                (lang === "zh" ? p.zhMatch : p.enMatch) ||
                p.zhMatch ||
                p.enMatch ||
                "";
              return (
                <li key={`${p.segmentId}:${p.startZh}`}>
                  <button
                    type="button"
                    onClick={() => handleListItemClick(p)}
                    className="w-full text-left flex items-start gap-3 transition-colors"
                    style={{
                      padding: "12px 8px",
                      borderRadius: "var(--radius-sm)",
                      cursor: "pointer",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--color-surface-low)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        flexShrink: 0,
                        minWidth: 24,
                        fontFamily: "var(--font-ui)",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--color-secondary)",
                        textAlign: "right",
                        lineHeight: "1.9",
                      }}
                    >
                      {i + 1}.
                    </span>
                    <span
                      className="font-serif"
                      style={{
                        fontFamily: "var(--font-zh-body)",
                        fontSize: 16,
                        lineHeight: 1.9,
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {snippet}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </aside>
  );
}
