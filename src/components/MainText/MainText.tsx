import { useMemo, useState, useCallback } from "react";
import { useApp } from "../../context/AppContext";
import { useRepositories } from "../../context/RepositoryContext";
import { useToast } from "../shared/Toast";
import { MultiParallelPopover } from "./MultiParallelPopover";
import type { InlineParallel } from "../../types";

export interface MainTextProps {
  className?: string;
}

/**
 * A span of text that may or may not have parallel references.
 * The continuous text is split into these spans for rendering.
 */
interface TextSpan {
  /** The text content for this span */
  text: string;
  /** Parallel references that cover this span (empty = plain text) */
  parallels: InlineParallel[];
}

/**
 * Split a continuous text string into alternating plain / highlighted spans
 * based on the InlineParallel ranges for the given language.
 */
function splitIntoSpans(
  fullText: string,
  inlineParallels: InlineParallel[],
  lang: "zh" | "en",
): TextSpan[] {
  if (inlineParallels.length === 0) {
    return [{ text: fullText, parallels: [] }];
  }

  // Collect all boundary points and the parallels active at each range
  type Boundary = {
    pos: number;
    type: "start" | "end";
    parallel: InlineParallel;
  };
  const boundaries: Boundary[] = [];

  for (const p of inlineParallels) {
    const start = lang === "zh" ? p.startZh : p.startEn;
    const end = lang === "zh" ? p.endZh : p.endEn;
    boundaries.push({ pos: start, type: "start", parallel: p });
    boundaries.push({ pos: end, type: "end", parallel: p });
  }

  // Sort boundaries by position, starts before ends at the same position
  boundaries.sort((a, b) => {
    if (a.pos !== b.pos) return a.pos - b.pos;
    if (a.type !== b.type) return a.type === "start" ? -1 : 1;
    return 0;
  });

  const spans: TextSpan[] = [];
  const activeParallels = new Set<InlineParallel>();
  let cursor = 0;

  for (const b of boundaries) {
    if (b.pos > cursor) {
      // Emit a span from cursor to this boundary
      spans.push({
        text: fullText.slice(cursor, b.pos),
        parallels: [...activeParallels],
      });
      cursor = b.pos;
    }

    if (b.type === "start") {
      activeParallels.add(b.parallel);
    } else {
      activeParallels.delete(b.parallel);
    }
  }

  // Remaining text after the last boundary
  if (cursor < fullText.length) {
    spans.push({ text: fullText.slice(cursor), parallels: [] });
  }

  return spans;
}

export function MainText({ className }: MainTextProps) {
  const { state, openParallel } = useApp();
  const { texts } = useRepositories();
  const { show } = useToast();

  const [multiAnchor, setMultiAnchor] = useState<HTMLElement | null>(null);
  const [multiParallels, setMultiParallels] = useState<InlineParallel[]>([]);

  const continuousText = texts.getMainContinuousText();
  const chapter =
    continuousText?.chapters.find((c) => c.id === state.activeChapterId) ??
    null;

  const spans = useMemo(() => {
    if (!chapter) return [];
    const fullText =
      state.language === "zh" ? chapter.text.zh : chapter.text.en;
    return splitIntoSpans(fullText, chapter.inlineParallels, state.language);
  }, [chapter, state.language]);

  const handleHighlightClick = useCallback(
    (parallels: InlineParallel[], anchor: HTMLElement) => {
      if (parallels.length === 0) return;

      if (parallels.length === 1) {
        const p = parallels[0];
        const segment = texts.getSegment(p.textId, p.chapterId, p.segmentId);
        const highlightText =
          state.language === "zh"
            ? (segment?.content.zh ?? p.zhMatch)
            : (segment?.content.en ?? p.enMatch);
        openParallel({
          textId: p.textId,
          chapterId: p.chapterId,
          segmentId: p.segmentId,
          contextText: p.zhContext ?? p.enContext ?? highlightText,
          highlightText,
        });
        show(
          `Opened parallel in ${texts.getParallelText(p.textId)?.title.en ?? p.textId}`,
          1800,
        );
      } else {
        // Deduplicate parallels by textId+segmentId to avoid showing duplicate entries
        const seen = new Set<string>();
        const unique = parallels.filter((p) => {
          const key = `${p.textId}:${p.segmentId}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setMultiParallels(
          unique.map((p) => ({
            textId: p.textId,
            chapterId: p.chapterId,
            segmentId: p.segmentId,
            colorKey: p.colorKey,
            zhMatch: p.zhMatch,
            enMatch: p.enMatch,
            zhContext: p.zhContext,
            enContext: p.enContext,
          })),
        );
        setMultiAnchor(anchor);
      }
    },
    [openParallel, show, texts],
  );

  if (!chapter || !continuousText) {
    return <div className="p-8 text-text-secondary">Chapter not found.</div>;
  }

  const chapterTitle = chapter.title;

  return (
    <div
      className={`overflow-y-auto h-full ${className ?? ""}`}
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <article
        className="mx-auto"
        style={{
          maxWidth: "var(--main-text-max-width)",
          padding:
            state.viewMode === "research"
              ? "64px 96px 96px 120px"
              : "96px 48px 128px 48px",
        }}
      >
        <header className="mb-12 text-center">
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-secondary)",
              marginBottom: 16,
            }}
          >
            {continuousText.title.en}
          </p>
          <h1
            className="font-serif"
            style={{
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              marginBottom: 16,
              color: "var(--color-text-primary)",
            }}
          >
            {chapterTitle.zh}
          </h1>
          <p
            className="font-serif italic"
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: "var(--color-secondary)",
              lineHeight: 1.4,
            }}
          >
            {chapterTitle.en}
          </p>
          <div
            aria-hidden
            style={{
              width: 48,
              height: 1,
              backgroundColor: "var(--color-border)",
              margin: "32px auto 0",
            }}
          />
        </header>
        <div
          style={{
            fontFamily:
              state.language === "zh"
                ? "var(--font-zh-body)"
                : "var(--font-en-body)",
            fontSize: `calc(${state.language === "zh" ? "var(--zh-body-size)" : "var(--en-body-size)"} * ${state.zoomLevel})`,
            lineHeight:
              state.language === "zh"
                ? "var(--zh-body-line-height)"
                : "var(--en-body-line-height)",
            color: "var(--color-text-primary)",
          }}
          className={
            state.language === "zh" ? "font-serif" : "font-serif italic"
          }
        >
          {spans.map((span, i) => {
            if (span.parallels.length === 0) {
              return <span key={i}>{span.text}</span>;
            }

            if (span.parallels.length === 1) {
              return (
                <span
                  key={i}
                  data-parallel-ids={span.parallels[0].segmentId}
                  className="scroll-anchor"
                  onClick={(e) =>
                    handleHighlightClick(span.parallels, e.currentTarget)
                  }
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.filter =
                      "brightness(0.97)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.filter = "";
                  }}
                  style={{
                    background: `var(--color-highlight-${span.parallels[0].colorKey})`,
                    padding: "2px 4px",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    transition: "filter 150ms ease, box-shadow 150ms ease",
                    display: "inline",
                  }}
                >
                  {span.text}
                </span>
              );
            }

            const chars = Array.from(span.text);
            const chunkSize = Math.max(
              1,
              Math.ceil(chars.length / span.parallels.length),
            );
            const chunks = [];
            for (let j = 0; j < span.parallels.length; j++) {
              const text = chars
                .slice(j * chunkSize, (j + 1) * chunkSize)
                .join("");
              if (text) {
                chunks.push({ text, parallel: span.parallels[j] });
              }
            }

            return (
              <span
                key={i}
                data-parallel-ids={span.parallels
                  .map((p) => p.segmentId)
                  .join(" ")}
                className="scroll-anchor"
                style={{
                  display: "inline",
                }}
              >
                {chunks.map((chunk, j) => (
                  <span
                    key={j}
                    onClick={(e) =>
                      handleHighlightClick(span.parallels, e.currentTarget)
                    }
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.filter =
                        "brightness(0.97)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.filter = "";
                    }}
                    style={{
                      background: `var(--color-highlight-${chunk.parallel.colorKey})`,
                      paddingTop: 2,
                      paddingBottom: 2,
                      paddingLeft: j === 0 ? 4 : 0,
                      paddingRight: j === chunks.length - 1 ? 4 : 0,
                      borderRadius:
                        j === 0 && j === chunks.length - 1
                          ? "var(--radius-sm)"
                          : j === 0
                            ? "var(--radius-sm) 0 0 var(--radius-sm)"
                            : j === chunks.length - 1
                              ? "0 var(--radius-sm) var(--radius-sm) 0"
                              : 0,
                      cursor: "pointer",
                      transition: "filter 150ms ease, box-shadow 150ms ease",
                    }}
                  >
                    {chunk.text}
                  </span>
                ))}
              </span>
            );
          })}
        </div>
        <div style={{ height: 96 }} />
      </article>
      <MultiParallelPopover
        open={multiAnchor !== null}
        anchor={multiAnchor}
        parallels={multiParallels}
        language={state.language}
        onSelect={(p) => {
          const segment = texts.getSegment(p.textId, p.chapterId, p.segmentId);
          const highlightText =
            (state.language === "zh"
              ? (segment?.content.zh ?? p.zhMatch)
              : (segment?.content.en ?? p.enMatch)) ??
            multiAnchor?.textContent ??
            undefined;
          openParallel({
            textId: p.textId,
            chapterId: p.chapterId,
            segmentId: p.segmentId,
            contextText:
              (state.language === "zh" ? p.zhContext : p.enContext) ??
              highlightText,
            highlightText,
          });
          show(
            `Opened parallel in ${texts.getParallelText(p.textId)?.title.en ?? p.textId}`,
            1800,
          );
        }}
        onClose={() => setMultiAnchor(null)}
      />
    </div>
  );
}
