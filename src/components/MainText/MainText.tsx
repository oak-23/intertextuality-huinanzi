import { useMemo, useState, useCallback, Fragment } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useApp } from "../../context/AppContext";
import { useRepositories } from "../../context/RepositoryContext";
import { useRhymedView } from "../../hooks/useRhymedView";
import { useToast } from "../shared/Toast";
import { MultiParallelPopover } from "./MultiParallelPopover";
import {
  LENGTH_MIN_OPEN,
  LENGTH_MAX_OPEN,
  withinLengthRange,
} from "../../utils/parallelFilters";
import { normalizeCitationKey, citationZhByKey } from "../../data/citationTitles";
import type { InlineParallel, ParallelOption, RhymedLine } from "../../types";

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

/** Matches an inline parallel-title citation: full-width-open bracket whose
 * content has ≥1 Latin letter and no nested parens, closed by ） or ). */
const PARALLEL_TITLE_RE = /（[^（）()]*[A-Za-z][^（）()]*[）)] ?/g;

/** Matches a rhymed-version citation, e.g. 《老子・第六十六章》. */
const RHYMED_TITLE_RE = /《[^《》]*》/g;

/**
 * Remove inline parallel-title citations from a PLAIN span's text. Authored body
 * spacing is left exactly as written, so toggling never alters the spacing of
 * unrelated CJK text; only citations and their trailing-space artifact are removed.
 *
 * Only called on plain spans (parallels.length === 0) when hiding is active.
 */
function stripParallelTitles(text: string): string {
  return text.replace(PARALLEL_TITLE_RE, "").replace(RHYMED_TITLE_RE, "");
}

/**
 * Replace （romanized-citation） markers in a PLAIN prose zh span with their
 * Chinese 《…》 equivalents from citationZhByKey. Unmapped citations are left
 * verbatim (including their trailing-space artifact). Called only in the prose
 * zh path when hideBrackets is false; rhymed lines and the 'en' path are
 * never touched.
 */
function localizeParallelTitles(text: string): string {
  return text.replace(PARALLEL_TITLE_RE, (match) => {
    // Strip the leading （ and the closing ）/) plus optional trailing space
    const inner = match.slice(1).replace(/[）)] ?$/, "");
    const zh = citationZhByKey[normalizeCitationKey(inner)];
    return zh ?? match;
  });
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
  const { rhymed, active: rhymedActive } = useRhymedView();

  const [multiAnchor, setMultiAnchor] = useState<HTMLElement | null>(null);
  const [multiParallels, setMultiParallels] = useState<ParallelOption[]>([]);

  const continuousText = texts.getMainContinuousText();
  const chapter =
    continuousText?.chapters.find((c) => c.id === state.activeChapterId) ??
    null;

  const spans = useMemo(() => {
    if (!chapter || rhymedActive) return [];
    const fullText =
      state.language === "zh" ? chapter.text.zh : chapter.text.en;
    const hidden = new Set(state.hiddenTexts);
    const research = state.viewMode === "research";
    const lo = research ? state.lengthMin : LENGTH_MIN_OPEN;
    const hi = research ? state.lengthMax : LENGTH_MAX_OPEN;
    const visible = chapter.inlineParallels.filter(
      (p) => !hidden.has(p.textId) && withinLengthRange(p, lo, hi),
    );
    return splitIntoSpans(fullText, visible, state.language);
  }, [
    chapter,
    rhymedActive,
    state.language,
    state.hiddenTexts,
    state.viewMode,
    state.lengthMin,
    state.lengthMax,
  ]);

  /** Rhymed view: per-line spans plus the line's rhyme annotations. */
  const rhymedRows = useMemo(() => {
    if (!rhymedActive || !rhymed) return null;
    const hidden = new Set(state.hiddenTexts);
    const lo = state.lengthMin;
    const hi = state.lengthMax;
    const visible = rhymed.inlineParallels.filter(
      (p) =>
        p.startZh >= 0 &&
        !hidden.has(p.textId) &&
        withinLengthRange(p, lo, hi),
    );
    const rows: { line: RhymedLine; spans: TextSpan[] }[] = [];
    let offset = 0;
    for (const line of rhymed.lines) {
      const start = offset;
      const end = offset + line.zh.length;
      const clipped = visible
        .filter((p) => p.startZh < end && p.endZh > start)
        .map((p) => ({
          ...p,
          startZh: Math.max(p.startZh, start) - start,
          endZh: Math.min(p.endZh, end) - start,
          // Show footnote only on the line where the parallel ends
          footnote: p.endZh <= end ? p.footnote : undefined,
        }));
      rows.push({ line, spans: splitIntoSpans(line.zh, clipped, "zh") });
      offset = end + 1; // the \n separator
    }
    return rows;
  }, [
    rhymedActive,
    rhymed,
    state.hiddenTexts,
    state.lengthMin,
    state.lengthMax,
  ]);

  const hideBrackets =
    state.viewMode === "research" && state.hideParallelTitles;

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
          highlightRanges: p.zhContextRanges,
          noteEn: p.noteEn,
        });
        show(
          `Opened parallel in ${texts.getParallelText(p.textId)?.title.zh ?? p.textId}`,
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
            zhContextRanges: p.zhContextRanges,
            noteEn: p.noteEn,
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

  const footnoteSupStyle: CSSProperties = {
    fontFamily: "var(--font-ui)",
    fontSize: `calc(12px * ${state.zoomLevel})`,
    color: "var(--color-secondary)",
    userSelect: "none",
    marginLeft: 2,
    marginRight: 8,
    lineHeight: 1,
    verticalAlign: "super",
  };

  /** Display text of a PLAIN span (citation hiding / localization applied). */
  const plainDisplayText = (text: string, isProseZh: boolean) =>
    hideBrackets
      ? stripParallelTitles(text)
      : isProseZh
        ? localizeParallelTitles(text)
        : text;

  /** Render one text span (plain, single-parallel, or multi-parallel).
   *  Pass isProseZh=true only from the prose (non-rhymed) zh render path to
   *  enable citation localization; rhymed lines and the 'en' path must not pass it. */
  const renderSpan = (span: TextSpan, i: number, isProseZh = false) => {
    if (span.parallels.length === 0) {
      return <span key={i}>{plainDisplayText(span.text, isProseZh)}</span>;
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
          {isProseZh ? localizeParallelTitles(span.text) : span.text}
        </span>
      );
    }

    const chars = Array.from(span.text);
    const n = span.parallels.length;
    const chunks = [];
    for (let j = 0; j < n; j++) {
      // Even partition so every parallel gets a slice (and its color) when
      // the span has at least as many characters as parallels.
      const start = Math.round((j * chars.length) / n);
      const end = Math.round(((j + 1) * chars.length) / n);
      const text = chars.slice(start, end).join("");
      if (text) {
        chunks.push({ text, parallel: span.parallels[j] });
      }
    }

    return (
      <span
        key={i}
        data-parallel-ids={span.parallels.map((p) => p.segmentId).join(" ")}
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
  };

  /** Footnote label for a highlighted span ("3" or "3,4"), null when none. */
  const footnoteLabelOf = (span: TextSpan): string | null => {
    const nums = [
      ...new Set(
        span.parallels
          .map((p) => p.footnote)
          .filter((n): n is number => n !== undefined),
      ),
    ];
    return nums.length > 0 ? nums.join(",") : null;
  };

  /** Leading citation cluster of a plain span's DISPLAY text: optional
   *  whitespace/punctuation, one or more 《…》/（…） citations, then a trailing
   *  punctuation run. The footnote sup is placed after this cluster. */
  const CITATION_PREFIX_RE =
    /^[\s，。；：、！？」』]*(?:《[^《》]*》|（[^（）]*）)+[，。；：、！？」』]*/;

  /** Render a span list, placing each footnote sup after the citation
   *  brackets (and any punctuation just after them) instead of right after
   *  the highlight. Falls back to right-after-highlight when no citation
   *  follows (e.g. hidden brackets, footnote-only parallels). */
  const renderSpans = (spanList: TextSpan[], isProseZh = false) => {
    const out: ReactNode[] = [];
    for (let i = 0; i < spanList.length; i++) {
      const span = spanList[i];
      out.push(renderSpan(span, i, isProseZh));
      const label = footnoteLabelOf(span);
      if (label === null) continue;
      const sup = (
        <sup key={`fn-${i}`} aria-hidden style={footnoteSupStyle}>
          {label}
        </sup>
      );
      const next = spanList[i + 1];
      if (next && next.parallels.length === 0) {
        const display = plainDisplayText(next.text, isProseZh);
        const m = display.match(CITATION_PREFIX_RE);
        if (m) {
          // Breathing room between a 。？！-final highlight and its citation
          // bracket (those highlights end flush against the bracket).
          const gap = /[。？！]$/.test(span.text) && /^[《（]/.test(m[0]);
          out.push(
            <span key={`cit-${i}`} style={gap ? { marginLeft: 8 } : undefined}>
              {m[0]}
            </span>,
            sup,
          );
          const rest = display.slice(m[0].length);
          if (rest) out.push(<span key={`rest-${i}`}>{rest}</span>);
          i++; // next span consumed
          continue;
        }
      }
      out.push(sup);
    }
    return out;
  };

  /** One rhyme-annotation cell, placed in a fixed grid column so that the
   *  rhyme / unit / marker labels align vertically across every line. Always
   *  rendered (empty when absent) to keep each row's cells in their columns. */
  const renderAnnotationCell = (
    key: string,
    value: string | undefined,
    column: number,
    extra: CSSProperties,
  ) => (
    <span
      key={key}
      aria-hidden
      style={{
        gridColumn: column,
        justifySelf: "start",
        fontFamily: "var(--font-ui)",
        fontSize: `calc(12px * ${state.zoomLevel})`,
        lineHeight: 1,
        whiteSpace: "nowrap",
        userSelect: "none",
        ...extra,
      }}
    >
      {value ? `[${value}]` : ""}
    </span>
  );

  return (
    <div
      className={`overflow-y-auto h-full ${className ?? ""}`}
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <article
        className="mx-auto"
        style={{
          maxWidth: "var(--main-text-max-width)",
          // Research mode uses the same width/padding as normal mode.
          padding: "96px 48px 128px 48px",
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
              fontFamily: "var(--font-zh-body)",
              fontSize: 40,
              fontWeight: 400,
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
            // Rhymed view: a single grid whose columns are shared by every
            // line, so the text and each [rhyme]/[unit]/[marker] label align
            // vertically. The 1fr text column has one width for all rows.
            // Prose is justified for a clean block edge; verse stays left.
            ...(rhymedRows
              ? {
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) auto auto auto",
                  alignItems: "baseline",
                  columnGap: 16,
                }
              : { textAlign: "justify" }),
          }}
          className={
            state.language === "zh" ? "font-serif" : "font-serif italic"
          }
        >
          {rhymedRows
            ? rhymedRows.map(({ line, spans: lineSpans }, i) => (
                <Fragment key={i}>
                  <div style={{ gridColumn: 1, minWidth: 0 }}>
                    {renderSpans(lineSpans)}
                  </div>
                  {renderAnnotationCell(`${i}-r`, line.rhyme, 2, {
                    color: "var(--color-accent-bright)",
                    fontWeight: 500,
                  })}
                  {renderAnnotationCell(`${i}-u`, line.unit, 3, {
                    color: "var(--color-secondary)",
                  })}
                  {renderAnnotationCell(`${i}-m`, line.marker, 4, {
                    color: "var(--color-muted)",
                  })}
                </Fragment>
              ))
            : renderSpans(spans, state.language === "zh")}
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
            contextText: p.zhContext ?? p.enContext ?? highlightText,
            highlightText,
            highlightRanges: p.zhContextRanges,
            noteEn: p.noteEn,
          });
          show(
            `Opened parallel in ${texts.getParallelText(p.textId)?.title.zh ?? p.textId}`,
            1800,
          );
        }}
        onClose={() => setMultiAnchor(null)}
      />
    </div>
  );
}
