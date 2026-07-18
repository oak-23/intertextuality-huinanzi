import { useMemo, useState, useCallback, Fragment } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useApp } from "../../context/AppContext";
import { useRepositories } from "../../context/RepositoryContext";
import { useRhymedView } from "../../hooks/useRhymedView";
import { useAnnotations } from "../../hooks/useAnnotations";
import { useToast } from "../shared/Toast";
import { AnnotationPopover } from "../Annotations/AnnotationPopover";
import { MultiParallelPopover } from "./MultiParallelPopover";
import { splitIntoSpans, type TextSpan } from "./spans";
import { chapterOrdinal, formatTitleEn } from "../../utils/titles";
import { withinLengthRange } from "../../utils/parallelFilters";
import { normalizeCitationKey, citationZhByKey } from "../../data/citationTitles";
import type { InlineParallel, ParallelOption, RhymedLine } from "../../types";

export interface MainTextProps {
  className?: string;
}

/**
 * A span of text that may or may not have parallel references.
 * The continuous text is split into these spans for rendering.
 */
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

export function MainText({ className }: MainTextProps) {
  const { state, openParallel } = useApp();
  const { texts } = useRepositories();
  const { show } = useToast();
  const { rhymed, active: rhymedActive } = useRhymedView();

  const [multiAnchor, setMultiAnchor] = useState<HTMLElement | null>(null);
  const [multiParallels, setMultiParallels] = useState<ParallelOption[]>([]);

  const [annotationOpen, setAnnotationOpen] = useState(false);
  const [annotationSegmentId, setAnnotationSegmentId] = useState<string | null>(null);
  const [annotationId, setAnnotationId] = useState<string | null>(null);
  const [newSelection, setNewSelection] = useState<{
    startIndex: number;
    endIndex: number;
    language: "zh" | "en";
    selectedText: string;
  } | null>(null);
  const [hoveredAnnotation, setHoveredAnnotation] = useState<{
    anchor: HTMLElement;
    comment: string;
  } | null>(null);

  const { countForSegment, annotations } = useAnnotations(state.activeChapterId);

  const continuousText = texts.getMainContinuousText();
  const chapter =
    continuousText?.chapters.find((c) => c.id === state.activeChapterId) ??
    null;
  // ponytail: derived from the "chap-N" id instead of searching the chapters
  // array — the React Compiler treats array methods on it as possible mutation.
  const chapterIndex = Number(state.activeChapterId.split("-").pop()) - 1;

  const spans = useMemo(() => {
    if (!chapter || rhymedActive) return [];
    const fullText =
      state.language === "zh" ? chapter.text.zh : chapter.text.en;
    const hidden = new Set(state.hiddenTexts);
    const lo = state.lengthMin;
    const hi = state.lengthMax;
    const visible = chapter.inlineParallels.filter(
      (p) => !hidden.has(p.textId) && withinLengthRange(p, lo, hi),
    );
    const annotationParallels: InlineParallel[] = (hidden.has('annotation') ? [] : annotations)
      .filter(a => a.language === state.language && a.startIndex !== undefined && a.endIndex !== undefined)
      .map(a => ({
        startZh: a.language === 'zh' ? a.startIndex! : -1,
        endZh: a.language === 'zh' ? a.endIndex! : -1,
        startEn: a.language === 'en' ? a.startIndex! : -1,
        endEn: a.language === 'en' ? a.endIndex! : -1,
        textId: 'annotation',
        chapterId: a.chapterId,
        segmentId: a.id,
        colorKey: 'annotation',
      }));
    return splitIntoSpans(fullText, [...visible, ...annotationParallels], state.language);
  }, [
    chapter,
    rhymedActive,
    state.language,
    state.hiddenTexts,
    state.lengthMin,
    state.lengthMax,
    annotations,
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

  const hideBrackets = state.hideParallelTitles;

  const handleHighlightClick = useCallback(
    (parallels: InlineParallel[], anchor: HTMLElement) => {
      if (parallels.length === 0) return;

      if (parallels.length === 1 && parallels[0].colorKey === 'annotation') {
        setAnnotationId(parallels[0].segmentId);
        setAnnotationOpen(true);
        return;
      }

      if (state.annotationMode) {
        setAnnotationSegmentId(parallels[0].segmentId);
        setAnnotationOpen(true);
        return;
      }

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
    [openParallel, show, texts, state.annotationMode],
  );

  const handleMouseUp = useCallback(() => {
    if (!state.annotationMode) return;
    // Rhymed spans carry line-relative offsets; selection anchoring is
    // prose-only until offsets are mapped through the line grid.
    if (rhymedActive) return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const text = selection.toString().trim();
    if (!text) return;

    const range = selection.getRangeAt(0);
    const startNode = range.startContainer;
    const startOffset = range.startOffset;
    const endNode = range.endContainer;
    const endOffset = range.endOffset;

    const getOriginalOffset = (node: Node, offsetInNode: number) => {
      let current: Node | null = node;
      while (current && current.nodeType !== Node.ELEMENT_NODE) {
        current = current.parentNode;
      }
      const el = (current as HTMLElement)?.closest('[data-offset-start]');
      if (el) {
        const start = parseInt(el.getAttribute('data-offset-start') || '0', 10);
        return start + offsetInNode;
      }
      return -1;
    };

    const startIdx = getOriginalOffset(startNode, startOffset);
    const endIdx = getOriginalOffset(endNode, endOffset);

    if (startIdx !== -1 && endIdx !== -1) {
      setNewSelection({
        startIndex: startIdx,
        endIndex: endIdx,
        language: state.language,
        selectedText: text,
      });
      setAnnotationOpen(true);
      selection.removeAllRanges();
    }
  }, [state.annotationMode, state.language, rhymedActive]);

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
      return <span key={i} data-offset-start={span.start}>{plainDisplayText(span.text, isProseZh)}</span>;
    }

    if (span.parallels.length === 1) {
      const isAnnotation = span.parallels[0].colorKey === 'annotation';
      const annotationComment = isAnnotation ? annotations.find(a => a.id === span.parallels[0].segmentId)?.comment : undefined;
      return (
        <span
          key={i}
          data-offset-start={span.start}
          data-parallel-ids={span.parallels[0].segmentId}
          className="scroll-anchor"
          onClick={(e) => handleHighlightClick(span.parallels, e.currentTarget)}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.filter =
              "brightness(0.97)";
            if (annotationComment) {
              setHoveredAnnotation({ anchor: e.currentTarget, comment: annotationComment });
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.filter = "";
            if (annotationComment) {
              setHoveredAnnotation(null);
            }
          }}
          style={{
            background: isAnnotation ? 'transparent' : `var(--color-highlight-${span.parallels[0].colorKey})`,
            padding: "2px 4px",
            borderBottom: isAnnotation ? '2px dashed var(--color-accent)' : 'none',
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
        data-offset-start={span.start}
        data-parallel-ids={span.parallels.map((p) => p.segmentId).join(" ")}
        className="scroll-anchor"
        style={{
          display: "inline",
        }}
      >
          {chunks.map((chunk, j) => {
            const isAnnotationChunk = chunk.parallel.colorKey === 'annotation';
            const chunkComment = isAnnotationChunk ? annotations.find(a => a.id === chunk.parallel.segmentId)?.comment : undefined;
            return (
            <span
              key={j}
              onClick={(e) =>
                handleHighlightClick(span.parallels, e.currentTarget)
              }
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.filter =
                  "brightness(0.97)";
                if (chunkComment) {
                  setHoveredAnnotation({ anchor: e.currentTarget, comment: chunkComment });
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.filter = "";
                if (chunkComment) {
                  setHoveredAnnotation(null);
                }
              }}
              style={{
                background: chunk.parallel.colorKey === 'annotation' ? 'transparent' : `var(--color-highlight-${chunk.parallel.colorKey})`,
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
          )})}
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
   *  punctuation run — or, when no citation follows (e.g. brackets hidden),
   *  just the punctuation run. The footnote sup is placed after this. */
  const CITATION_PREFIX_RE =
    /^[\s，。；：、！？」』]*(?:《[^《》]*》|（[^（）]*）)+[，。；：、！？」』]*|^\s*[，。；：、！？」』]+/;

  /** Small inline badge on highlights that carry saved annotations. */
  const annotationBadge = (segmentId: string, key: string) => {
    if (state.hiddenTexts.includes("annotation")) return null;
    const count = countForSegment(segmentId);
    if (count === 0) return null;
    return (
      <button
        key={key}
        type="button"
        aria-label={`${count} annotation${count > 1 ? "s" : ""} on this passage`}
        onClick={() => {
          setAnnotationSegmentId(segmentId);
          setAnnotationOpen(true);
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 14,
          height: 14,
          padding: "0 3px",
          marginLeft: 2,
          verticalAlign: "super",
          borderRadius: 9999,
          backgroundColor: "var(--color-accent-bright)",
          color: "var(--color-text-inverse)",
          border: "none",
          fontFamily: "var(--font-ui)",
          fontSize: 9,
          fontWeight: 600,
          lineHeight: 1,
          cursor: "pointer",
        }}
      >
        {count > 1 ? count : ""}
      </button>
    );
  };

  /** Render a span list, placing each footnote sup after the citation
   *  brackets (and any punctuation just after them) instead of right after
   *  the highlight. Falls back to right-after-highlight when no citation
   *  follows (e.g. hidden brackets, footnote-only parallels). */
  const renderSpans = (spanList: TextSpan[], isProseZh = false) => {
    const out: ReactNode[] = [];
    for (let i = 0; i < spanList.length; i++) {
      const span = spanList[i];
      out.push(renderSpan(span, i, isProseZh));
      // Selection annotations ('annotation' textId) show comments on hover
      // and carry no footnote/badge; badges belong to real parallels only.
      const real = span.parallels.filter((p) => p.textId !== "annotation");
      const badges: ReactNode[] = [];
      if (real.length > 0) {
        const b = annotationBadge(real[0].segmentId, `ann-${i}`);
        if (b) badges.push(b);
      }
      const label = footnoteLabelOf(span);
      if (label === null) {
        out.push(...badges);
        continue;
      }
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
          out.push(...badges);
          const rest = display.slice(m[0].length);
          if (rest) out.push(<span key={`rest-${i}`}>{rest}</span>);
          i++; // next span consumed
          continue;
        }
      }
      out.push(sup);
      out.push(...badges);
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
            className="font-serif"
            style={{
              fontSize: 30,
              fontWeight: 400,
              lineHeight: 1.2,
              marginBottom: 20,
              color: "var(--color-text-primary)",
            }}
          >
            Chapter {chapterOrdinal(chapterIndex)}
          </p>
          <h1
            className="font-serif italic"
            style={{
              fontSize: 26,
              fontWeight: 400,
              lineHeight: 1.2,
              marginBottom: 20,
              color: "var(--color-text-primary)",
            }}
          >
            {continuousText.title.en}
          </h1>
          <p
            style={{
              fontSize: 26,
              fontFamily: "var(--font-zh-body)",
              fontWeight: 400,
              lineHeight: 1.2,
              marginBottom: 20,
              color: "var(--color-text-primary)",
            }}
          >
            {continuousText.title.zh}
          </p>
          <h2
            className="font-serif"
            style={{
              fontSize: 26,
              fontWeight: 400,
              lineHeight: 1.3,
              marginBottom: 20,
              color: "var(--color-text-primary)",
            }}
          >
            {formatTitleEn(chapterTitle.en)}
          </h2>
          <p
            style={{
              fontSize: 26,
              fontFamily: "var(--font-zh-body)",
              fontWeight: 400,
              lineHeight: 1.2,
              color: "var(--color-text-primary)",
            }}
          >
            {chapterTitle.zh}
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
        <div
          id="main-text-container"
          onMouseUp={handleMouseUp}
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
      {state.annotationMode && (
        <div
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: 16,
            left: "calc(var(--sidebar-width) + 24px)",
            padding: "6px 12px",
            backgroundColor: "var(--color-accent-bright)",
            color: "var(--color-text-inverse)",
            borderRadius: "var(--radius-toggle)",
            fontFamily: "var(--font-ui)",
            fontSize: 12,
            fontWeight: 500,
            zIndex: 30,
            boxShadow: "var(--shadow-popover)",
          }}
        >
          Annotation mode — select text or click a highlighted parallel to add a note.
        </div>
      )}
      <AnnotationPopover
        open={annotationOpen}
        onClose={() => {
          setAnnotationOpen(false);
          setAnnotationId(null);
          setAnnotationSegmentId(null);
          setNewSelection(null);
        }}
        chapterId={state.activeChapterId}
        segmentId={annotationSegmentId}
        annotationId={annotationId}
        newSelection={newSelection}
      />
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
      {hoveredAnnotation && (() => {
        const rect = hoveredAnnotation.anchor.getBoundingClientRect();
        return (
          <div
            style={{
              position: 'fixed',
              top: rect.top + rect.height / 2,
              left: 'calc(var(--sidebar-width) + 12px)',
              transform: 'translateY(-50%)',
              maxWidth: 220,
              padding: '8px 12px',
              backgroundColor: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-popover)',
              boxShadow: 'var(--shadow-popover)',
              fontSize: 13,
              fontFamily: 'var(--font-ui)',
              color: 'var(--color-text-primary)',
              wordWrap: 'break-word',
              pointerEvents: 'none',
              zIndex: 80,
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: hoveredAnnotation.comment || '' }} />
          </div>
        );
      })()}
    </div>
  );
}
