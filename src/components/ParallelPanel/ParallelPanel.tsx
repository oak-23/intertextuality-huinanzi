import { useEffect, useRef, useState, type ReactNode } from "react";
import { X, ChevronLeft } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useRepositories } from "../../context/RepositoryContext";
import { useRhymedView } from "../../hooks/useRhymedView";
import { MultiParallelPopover } from "../MainText/MultiParallelPopover";
import { withinLengthRange } from "../../utils/parallelFilters";
import type { InlineParallel, ParallelOption } from "../../types";
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

/** Render contextText with multiple highlighted ranges (UTF-16 [start, end) pairs).
 *  Ranges must be sorted and non-overlapping; defensive clamping applied. */
function renderRangedHighlightedText(
  text: string,
  ranges: [number, number][],
  colorKey?: string,
  onHighlightClick?: () => void,
) {
  const textLen = text.length;
  const parts: ReactNode[] = [];
  let cursor = 0;

  const sorted = ranges
    .map(([s, e]): [number, number] => [
      Math.max(0, Math.min(s, textLen)),
      Math.max(0, Math.min(e, textLen)),
    ])
    .filter(([s, e]) => e > s)
    .sort((a, b) => a[0] - b[0]);

  for (let i = 0; i < sorted.length; i++) {
    const start = Math.max(sorted[i][0], cursor);
    const end = Math.max(start, sorted[i][1]);
    if (start > cursor) {
      parts.push(text.slice(cursor, start));
    }
    const highlighted = text.slice(start, end);
    if (highlighted) {
      parts.push(
        <span
          key={`${i}-${start}`}
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
          {highlighted}
        </span>,
      );
    }
    cursor = end;
  }

  if (cursor < textLen) {
    parts.push(text.slice(cursor));
  }

  return <>{parts}</>;
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
  const { chapter: continuousChapter, activeParallels } = useRhymedView();
  const lenLo = state.lengthMin;
  const lenHi = state.lengthMax;
  const listItems: InlineParallel[] =
    listTextId && continuousChapter
      ? activeParallels
          .filter(
            (p) =>
              p.textId === listTextId &&
              p.startZh >= 0 &&
              withinLengthRange(p, lenLo, lenHi),
          )
          .slice()
          .sort(
            (a, b) =>
              (lang === "zh" ? a.startZh : a.startEn) -
              (lang === "zh" ? b.startZh : b.startEn),
          )
      : [];

  const isOpen = !!panel || !!listText;

  // Merge parallels that point to the SAME main-text highlight (identical
  // character range) into one entry — exactly the multi-parallel spans the
  // main text renders as a single highlight with a chooser popover.
  const listGroups: InlineParallel[][] = (() => {
    const map = new Map<string, InlineParallel[]>();
    for (const p of listItems) {
      const k = `${p.startZh}:${p.endZh}`;
      const g = map.get(k);
      if (g) g.push(p);
      else map.set(k, [p]);
    }
    return [...map.values()];
  })();

  const [multiAnchor, setMultiAnchor] = useState<HTMLElement | null>(null);
  const [multiParallels, setMultiParallels] = useState<ParallelOption[]>([]);

  // Open a single parallel passage (text mode) + flash its main-text highlight.
  const openOne = (p: ParallelOption) => {
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
      highlightRanges: p.zhContextRanges,
      noteEn: p.noteEn,
    });
    scrollToMainText(p.segmentId);
  };

  useEffect(() => {
    setMultiAnchor(null); // never carry a stale popover across mode/source switches
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
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--color-secondary)",
                marginBottom: 12,
              }}
            >
              {text.title.en}
            </p>
            <h2
              className="font-serif"
              style={{
                fontSize: 32,
                fontFamily: "var(--font-zh-body)",
                fontWeight: 400,
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
                <h3
                  className="font-serif"
                  style={{
                    fontSize: 24,
                    fontFamily: "var(--font-zh-body)",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {chapter.title.zh}
                </h3>
                <p
                  className="font-serif italic"
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "var(--color-secondary)",
                    lineHeight: 1.4,
                    marginTop: 8,
                  }}
                >
                  {chapter.title.en}
                </p>
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
          {panel.noteEn && (
            <div
              style={{
                paddingLeft: "16px",
                marginBottom: "28px",
                borderLeft: "3px solid var(--color-border)",
              }}
            >
              <h4
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--color-secondary)",
                  marginBottom: 6,
                }}
              >
                {"Editor's Comment"}
              </h4>
              <p
                style={{
                  fontFamily: "var(--font-en-body)",
                  fontSize: `calc(14px * ${state.zoomLevel})`,
                  lineHeight: 1.6,
                  color: "var(--color-secondary)",
                  fontStyle: "italic",
                }}
              >
                {panel.noteEn}
              </p>
            </div>
          )}
          <div
            style={{
              fontFamily:
                lang === "zh"
                  ? "var(--font-zh-body)"
                  : "var(--font-en-body)",
              fontSize:
                lang === "zh"
                  ? `calc(var(--zh-body-size) * ${state.zoomLevel})`
                  : `calc(var(--en-body-size) * ${state.zoomLevel})`,
              lineHeight:
                lang === "zh"
                  ? "var(--zh-body-line-height)"
                  : "var(--en-body-line-height)",
              color: "var(--color-text-primary)",
              textAlign: "justify",
            }}
          >
            <p
              style={{
                padding: "6px 8px",
                borderRadius: "var(--radius-sm)",
                whiteSpace: "pre-line",
                fontFamily:
                  lang === "zh"
                    ? "var(--font-zh-body)"
                    : "var(--font-en-body)",
              }}
              className={lang === "zh" ? "font-serif" : "font-serif italic"}
            >
              {panel.highlightRanges && panel.highlightRanges.length > 0
                ? renderRangedHighlightedText(
                    panel.contextText ??
                      (lang === "zh" ? segment.content.zh : segment.content.en),
                    panel.highlightRanges,
                    text.colorKey,
                    () => scrollToMainText(segment.id),
                  )
                : renderHighlightedText(
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
            <h2
              className="font-serif"
              style={{
                fontSize: 32,
                fontFamily: "var(--font-zh-body)",
                fontWeight: 400,
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
              {listGroups.length}{" "}
              {listGroups.length === 1 ? "parallel" : "parallels"}
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
            {listGroups.map((group, i) => {
              const p = group[0];
              const count = group.length;
              const snippet =
                (lang === "zh" ? p.zhMatch : p.enMatch) ||
                p.zhMatch ||
                p.enMatch ||
                "";
              return (
                <li key={`${p.startZh}:${p.endZh}`}>
                  <button
                    type="button"
                    onClick={(e) => {
                      if (count > 1) {
                        setMultiParallels(group);
                        setMultiAnchor(e.currentTarget);
                      } else {
                        openOne(p);
                      }
                    }}
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
                      className="font-serif flex-1 min-w-0"
                      style={{
                        fontFamily: "var(--font-zh-body)",
                        fontSize: `calc(16px * ${state.zoomLevel})`,
                        lineHeight: 1.9,
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {snippet}
                    </span>
                    {count > 1 && (
                      <span
                        aria-label={`${count} parallels at this location`}
                        style={{
                          flexShrink: 0,
                          alignSelf: "center",
                          fontFamily: "var(--font-ui)",
                          fontSize: 11,
                          fontWeight: 600,
                          color: "var(--color-secondary)",
                          backgroundColor: "var(--color-surface-container)",
                          borderRadius: 9999,
                          padding: "1px 8px",
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
          <MultiParallelPopover
            open={multiAnchor !== null}
            anchor={multiAnchor}
            parallels={multiParallels}
            language={lang}
            onSelect={(p) => openOne(p)}
            onClose={() => setMultiAnchor(null)}
          />
        </div>
      )}
    </aside>
  );
}
