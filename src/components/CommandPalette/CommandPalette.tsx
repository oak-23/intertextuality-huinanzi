import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  BookOpen,
  FileText,
  AlignLeft,
  ArrowRight,
} from "lucide-react";
import {
  useGlobalSearch,
  type GlobalSearchResult,
} from "../../hooks/useGlobalSearch";
import { useApp } from "../../context/AppContext";
import { useChapterNavigation } from "../../hooks/useChapterNavigation";
import { useParallelNavigation } from "../../hooks/useParallelNavigation";
import { useRepositories } from "../../context/RepositoryContext";
import {
  scrollToSegment,
  highlightRangeAnimation,
} from "../../utils/scrollToSegment";
import { useHighlightPulse } from "../../hooks/useHighlightPulse";
import type { SearchScope } from "../../types";

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const KIND_ICON = {
  text: BookOpen,
  chapter: FileText,
  segment: AlignLeft,
} as const;

const KIND_LABEL = {
  text: "Text",
  chapter: "Chapter",
  segment: "Passage",
} as const;

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { search } = useGlobalSearch();
  const { state, openParallel, selectSegment, setLanguage } = useApp();
  const { switchChapter } = useChapterNavigation();
  const { texts } = useRepositories();
  const { pulse } = useHighlightPulse();
  const { open: openParallelNav } = useParallelNavigation();
  const [scope] = useState<SearchScope>("all");

  const results = useMemo(() => {
    const raw = search(query, scope);
    const filtered = raw.filter((r) => {
      if (scope === "all") return true;
      if (scope === "main") return r.isMain;
      if (scope === "parallel") return !r.isMain;
      return true;
    });
    const deduped = new Map<string, GlobalSearchResult>();
    for (const result of filtered) {
      const key = getOpenTargetKey(result, texts);
      if (!deduped.has(key)) {
        deduped.set(key, result);
      }
    }
    return [...deduped.values()];
  }, [search, query, scope, texts]);

  // Group results by kind
  const grouped = useMemo(() => {
    const groups: Array<{
      kind: string;
      label: string;
      items: GlobalSearchResult[];
    }> = [];
    const map = new Map<string, GlobalSearchResult[]>();
    for (const r of results) {
      const arr = map.get(r.kind) ?? [];
      arr.push(r);
      map.set(r.kind, arr);
    }
    const order: Array<"text" | "chapter" | "segment"> = [
      "text",
      "chapter",
      "segment",
    ];
    for (const kind of order) {
      const items = map.get(kind);
      if (items && items.length > 0) {
        groups.push({
          kind,
          label:
            kind === "text"
              ? "Texts"
              : kind === "chapter"
                ? "Chapters"
                : "Passages",
          items,
        });
      }
    }
    return groups;
  }, [results]);

  // Flat list for keyboard nav
  const flatResults = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      // Focus after animation
      const t = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  // Clamp active index
  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  /** Open a parallel with its inline context/highlights/note when the segment
   *  is referenced by a parallel in the main text (prose or rhymed). */
  const openParallelWithContext = useCallback(
    (textId: string, chapterId: string, segmentId: string) => {
      let inline;
      for (const ch of texts.getMainContinuousText()?.chapters ?? []) {
        inline =
          ch.inlineParallels.find(
            (p) =>
              p.textId === textId &&
              p.chapterId === chapterId &&
              p.segmentId === segmentId,
          ) ??
          ch.rhymed?.inlineParallels.find(
            (p) =>
              p.textId === textId &&
              p.chapterId === chapterId &&
              p.segmentId === segmentId,
          );
        if (inline) break;
      }
      const seg = texts.getSegment(textId, chapterId, segmentId);
      openParallel({
        textId,
        chapterId,
        segmentId,
        contextText: inline?.zhContext,
        highlightText: seg?.content.zh,
        highlightRanges: inline?.zhContextRanges,
        noteEn: inline?.noteEn,
      });
    },
    [texts, openParallel],
  );

  const handleSelect = useCallback(
    (result: GlobalSearchResult) => {
      if (result.isMain) {
        if (result.matchLanguage && result.matchLanguage !== state.language) {
          setLanguage(result.matchLanguage);
        }

        // Navigate to main text chapter
        if (result.chapterId && result.chapterId !== state.activeChapterId) {
          switchChapter(result.chapterId);
        }
        if (
          result.kind === "segment" &&
          result.matchOffset !== undefined &&
          result.matchQuery !== undefined
        ) {
          // Continuous text passage match
          const matchQuery = result.matchQuery;
          const matchIndex = result.matchIndex ?? 0;

          window.setTimeout(
            () => {
              const article = document.querySelector("article");
              if (!article) return;
              const textContainer = document.getElementById(
                "main-text-container",
              );
              if (!textContainer) return;

              // Build the concatenated string of all text nodes
              const walker = document.createTreeWalker(
                textContainer,
                NodeFilter.SHOW_TEXT,
              );
              const textNodes: Text[] = [];
              let fullText = "";
              while (walker.nextNode()) {
                const node = walker.currentNode as Text;
                textNodes.push(node);
                fullText += node.textContent ?? "";
              }

              // Find the N-th occurrence in the rendered text
              const needle = matchQuery.toLowerCase();
              const lowerFullText = fullText.toLowerCase();
              let occurrences = 0;
              let foundIdx = -1;
              let searchPos = 0;
              while (searchPos < lowerFullText.length) {
                const i = lowerFullText.indexOf(needle, searchPos);
                if (i === -1) break;
                if (occurrences === matchIndex) {
                  foundIdx = i;
                  break;
                }
                occurrences++;
                searchPos = i + 1;
              }

              if (foundIdx === -1) {
                // Fallback to container scroll if not found
                textContainer.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
                return;
              }

              // Map foundIdx back to the exact text node
              let charCount = 0;
              let targetNode: Text | null = null;
              let targetOffset = 0;
              for (const node of textNodes) {
                const len = node.textContent?.length ?? 0;
                if (charCount + len > foundIdx) {
                  targetNode = node;
                  targetOffset = foundIdx - charCount;
                  break;
                }
                charCount += len;
              }

              if (targetNode?.parentElement) {
                targetNode.parentElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
                try {
                  const range = document.createRange();
                  range.setStart(targetNode, targetOffset);
                  range.setEnd(
                    targetNode,
                    Math.min(
                      targetOffset + matchQuery.length,
                      targetNode.length,
                    ),
                  );
                  highlightRangeAnimation(range);
                } catch {
                  /* ignore */
                }
              } else {
                textContainer.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            },
            result.chapterId !== state.activeChapterId ? 300 : 120,
          );
        } else if (result.segmentId) {
          selectSegment(result.segmentId);
          window.setTimeout(() => {
            scrollToSegment(result.segmentId!);
            pulse(result.segmentId!);
          }, 120);
        }
      } else {
        // For parallel texts/chapters/segments: open the parallel panel
        if (result.kind === "segment" && result.segmentId) {
          openParallelWithContext(
            result.textId,
            result.chapterId,
            result.segmentId,
          );
        } else if (result.kind === "chapter") {
          // Open first segment of the chapter in parallel panel
          const chapter = texts.getParallelChapter(
            result.textId,
            result.chapterId,
          );
          const firstSeg = chapter?.segments[0];
          if (firstSeg) {
            openParallelWithContext(
              result.textId,
              result.chapterId,
              firstSeg.id,
            );
          }
        } else if (result.kind === "text") {
          // Open first segment of first chapter in parallel panel
          const pText = texts.getParallelText(result.textId);
          const firstChapter = pText?.chapters[0];
          const firstSeg = firstChapter?.segments[0];
          if (firstChapter && firstSeg) {
            openParallelWithContext(
              result.textId,
              firstChapter.id,
              firstSeg.id,
            );
          }
        }
      }
      onClose();
    },
    [
      state.activeChapterId,
      state.language,
      switchChapter,
      selectSegment,
      openParallelWithContext,
      onClose,
      texts,
      pulse,
      openParallelNav,
      setLanguage,
    ],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, flatResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const result = flatResults[activeIdx];
        if (result) handleSelect(result);
      } else if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    },
    [flatResults, activeIdx, handleSelect, onClose],
  );

  if (!open) return null;

  let flatIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Search texts, chapters, and passages"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in"
        style={{
          backgroundColor: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      />
      {/* Palette */}
      <div
        className="relative animate-scale-in"
        style={{
          width: "100%",
          maxWidth: 560,
          marginTop: "12vh",
          backgroundColor: "var(--color-background)",
          borderRadius: "var(--radius-modal)",
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.18), 0 0 0 1px var(--color-border)",
          overflow: "hidden",
        }}
        onKeyDown={onKeyDown}
      >
        {/* Input */}
        <div
          className="flex items-center"
          style={{
            borderBottom: "1px solid var(--color-border)",
            padding: "4px 16px",
          }}
        >
          <Search
            size={18}
            style={{
              color: "var(--color-muted)",
              flexShrink: 0,
              marginRight: 12,
            }}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search texts, chapters, passages…"
            aria-label="Global search"
            style={{
              width: "100%",
              height: 48,
              backgroundColor: "transparent",
              border: "none",
              fontFamily: "var(--font-ui)",
              fontSize: 15,
              color: "var(--color-text-primary)",
              outline: "none",
            }}
          />
          <kbd
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              padding: "2px 6px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--color-surface-high)",
              border: "1px solid var(--color-border)",
              fontFamily: "var(--font-ui)",
              fontSize: 11,
              color: "var(--color-muted)",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            ESC
          </kbd>
        </div>
        {/* Results */}
        <div
          ref={listRef}
          role="listbox"
          style={{
            maxHeight: 360,
            overflowY: "auto",
            padding: "4px 0",
          }}
        >
          {query.trim() === "" ? (
            <EmptyState />
          ) : flatResults.length === 0 ? (
            <NoResults query={query} />
          ) : (
            grouped.map((group) => (
              <div key={group.kind}>
                <div
                  style={{
                    padding: "8px 16px 4px",
                    fontFamily: "var(--font-ui)",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--color-muted)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {group.label}
                </div>
                {group.items.map((result) => {
                  flatIndex++;
                  const isActive = flatIndex === activeIdx;
                  const Icon = KIND_ICON[result.kind];
                  const idx = flatIndex;
                  return (
                    <button
                      key={`${result.kind}-${result.textId}-${result.chapterId}-${result.segmentId ?? ""}`}
                      data-idx={idx}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onClick={() => handleSelect(result)}
                      onMouseEnter={() => setActiveIdx(idx)}
                      className="w-full text-left flex items-center gap-3 transition-colors"
                      style={{
                        padding: "8px 16px",
                        backgroundColor: isActive
                          ? "var(--color-surface-low)"
                          : "transparent",
                        cursor: "pointer",
                        borderLeft: isActive
                          ? "2px solid var(--color-accent-bright)"
                          : "2px solid transparent",
                      }}
                    >
                      <div
                        className="flex items-center justify-center flex-shrink-0"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "var(--radius-sm)",
                          backgroundColor: result.colorKey
                            ? `var(--color-highlight-${result.colorKey})`
                            : "var(--color-surface-high)",
                        }}
                      >
                        <Icon
                          size={14}
                          style={{
                            color: result.colorKey
                              ? `var(--color-highlight-${result.colorKey})`
                              : "var(--color-secondary)",
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="truncate"
                          style={{
                            fontFamily:
                              result.kind === "segment"
                                ? "var(--font-zh-body)"
                                : "var(--font-ui)",
                            fontSize: result.kind === "segment" ? 13 : 14,
                            fontWeight: result.kind === "text" ? 600 : 500,
                            color: "var(--color-text-primary)",
                          }}
                        >
                          <HighlightMatch text={result.label} query={query} />
                        </div>
                        <div
                          className="truncate"
                          style={{
                            fontFamily: "var(--font-ui)",
                            fontSize: 12,
                            color: "var(--color-muted)",
                            marginTop: 1,
                          }}
                        >
                          <HighlightMatch
                            text={result.sublabel}
                            query={query}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          style={{
                            fontFamily: "var(--font-ui)",
                            fontSize: 10,
                            fontWeight: 500,
                            color: "var(--color-muted)",
                            padding: "1px 6px",
                            borderRadius: "var(--radius-toggle)",
                            backgroundColor: "var(--color-surface-high)",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {KIND_LABEL[result.kind]}
                        </span>
                        {isActive && (
                          <ArrowRight
                            size={12}
                            style={{ color: "var(--color-accent-bright)" }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            padding: "6px 16px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: "var(--font-ui)",
            fontSize: 11,
            color: "var(--color-muted)",
          }}
        >
          <span className="flex items-center gap-1">
            <kbd style={kbdStyle}>↑</kbd>
            <kbd style={kbdStyle}>↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd style={kbdStyle}>↵</kbd>
            Open
          </span>
          <span className="flex items-center gap-1">
            <kbd style={kbdStyle}>Esc</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
}

const kbdStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 18,
  height: 18,
  padding: "0 4px",
  borderRadius: 3,
  backgroundColor: "var(--color-surface-high)",
  border: "1px solid var(--color-border)",
  fontSize: 10,
  lineHeight: 1,
};

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        padding: "40px 24px",
        fontFamily: "var(--font-ui)",
        color: "var(--color-muted)",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          backgroundColor: "var(--color-surface-high)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <Search size={20} style={{ color: "var(--color-muted)" }} />
      </div>
      <p style={{ fontSize: 14, fontWeight: 500 }}>Search across everything</p>
      <p style={{ fontSize: 12, marginTop: 4, textAlign: "center" }}>
        Find texts, chapters, and passages in Chinese or English
      </p>
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        padding: "40px 24px",
        fontFamily: "var(--font-ui)",
        color: "var(--color-muted)",
      }}
    >
      <p style={{ fontSize: 14, fontWeight: 500 }}>No results for "{query}"</p>
      <p style={{ fontSize: 12, marginTop: 4 }}>
        Try a different term in Chinese or English
      </p>
    </div>
  );
}

/** Highlights matching substrings (case-insensitive + CJK-aware). */
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  const q = query.trim();
  const lower = text.toLowerCase();
  const qLower = q.toLowerCase();
  const idx = lower.indexOf(qLower);

  // Also try exact (for CJK)
  const cjkIdx = text.indexOf(q);
  const matchIdx = cjkIdx >= 0 ? cjkIdx : idx;
  const matchLen = cjkIdx >= 0 ? q.length : qLower.length;

  if (matchIdx < 0) return <>{text}</>;

  return (
    <>
      {text.slice(0, matchIdx)}
      <mark
        style={{
          backgroundColor: "rgba(45, 131, 246, 0.15)",
          color: "var(--color-accent)",
          borderRadius: 2,
          padding: "0 1px",
          fontWeight: 600,
        }}
      >
        {text.slice(matchIdx, matchIdx + matchLen)}
      </mark>
      {text.slice(matchIdx + matchLen)}
    </>
  );
}

function getOpenTargetKey(
  result: GlobalSearchResult,
  texts: ReturnType<typeof useRepositories>["texts"],
): string {
  if (result.isMain) {
    return `main:${result.chapterId}`;
  }

  const parallelText = texts.getParallelText(result.textId);
  if (!parallelText) {
    return result.segmentId
      ? `parallel:${result.textId}:${result.chapterId}:${result.segmentId}`
      : `parallel:${result.textId}:${result.chapterId}`;
  }

  if (result.segmentId) {
    return `parallel:${result.textId}:${result.chapterId}:${result.segmentId}`;
  }

  const chapter =
    parallelText.chapters.find((item) => item.id === result.chapterId) ??
    parallelText.chapters[0];
  const firstSegmentId = chapter?.segments[0]?.id ?? "";
  return `parallel:${result.textId}:${chapter?.id ?? result.chapterId}:${firstSegmentId}`;
}
