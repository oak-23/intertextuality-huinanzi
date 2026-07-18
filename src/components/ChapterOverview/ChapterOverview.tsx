import { Fragment, useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import { useRepositories } from "../../context/RepositoryContext";
import { splitIntoSpans } from "../MainText/spans";
import { chapterOrdinal, formatTitleEn } from "../../utils/titles";

const ZOOM_MS = 500;

/**
 * Entry screen: every chapter shown from a distance as a miniature page.
 * Clicking a card zooms the whole overview into that card (scale + fade),
 * revealing the chapter view already mounted beneath it.
 */
export function ChapterOverview() {
  const { texts } = useRepositories();
  const { setActiveChapter, closeOverview } = useApp();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [zooming, setZooming] = useState(false);

  const main = texts.getMainContinuousText();
  if (!main) return null;

  const enter = (chapterId: string, card: HTMLElement) => {
    if (zooming) return;
    const overlay = overlayRef.current;
    if (overlay) {
      // Zoom toward the clicked card's center so the dive lands on it.
      const r = card.getBoundingClientRect();
      overlay.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
    }
    setActiveChapter(chapterId);
    setZooming(true);
    window.setTimeout(closeOverview, ZOOM_MS);
  };

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
        padding: 40,
        overflow: "auto",
        backgroundColor: "var(--color-background)",
        transform: zooming ? "scale(3)" : "scale(1)",
        opacity: zooming ? 0 : 1,
        transition: `transform ${ZOOM_MS}ms ease-in, opacity ${ZOOM_MS}ms ease-in`,
        pointerEvents: zooming ? "none" : "auto",
      }}
    >
      <header style={{ textAlign: "center" }}>
        <h1
          className="font-serif"
          style={{
            margin: 0,
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--color-text-primary)",
          }}
        >
          {main.title.en}
        </h1>
        <p
          style={{
            margin: "8px 0 0",
            fontFamily: "var(--font-zh-body)",
            fontSize: 18,
            color: "var(--color-muted)",
          }}
        >
          {main.title.zh}
        </p>
      </header>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 32,
        }}
      >
        {main.chapters.map((chapter, i) => (
          <button
            key={chapter.id}
            type="button"
            onClick={(e) => enter(chapter.id, e.currentTarget)}
            className="transition-transform hover:scale-[1.03]"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              width: 340,
              padding: 24,
              textAlign: "left",
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-panel)",
              cursor: "pointer",
            }}
          >
            <span
              className="font-serif"
              style={{
                fontSize: 17,
                color: "var(--color-text-primary)",
              }}
            >
              Chapter {chapterOrdinal(i)}
            </span>
            <span
              className="font-serif"
              style={{
                fontSize: 17,
                fontStyle: "italic",
                color: "var(--color-text-primary)",
              }}
            >
              {main.title.en}
            </span>
            <span
              style={{
                fontFamily: "var(--font-zh-body)",
                fontSize: 17,
                color: "var(--color-text-primary)",
              }}
            >
              {main.title.zh}
            </span>
            <span
              className="font-serif"
              style={{
                fontSize: 17,
                color: "var(--color-text-primary)",
              }}
            >
              {formatTitleEn(chapter.title.en)}
            </span>
            <span
              style={{
                fontFamily: "var(--font-zh-body)",
                fontSize: 17,
                color: "var(--color-text-primary)",
              }}
            >
              {chapter.title.zh}
            </span>
            <span
              aria-hidden
              className="font-serif"
              style={{
                marginTop: 4,
                fontSize: 3,
                lineHeight: 1.6,
                color: "var(--color-text-muted)",
                wordBreak: "break-all",
              }}
            >
              {/* The whole chapter at maximum distance: text is glyph-dust,
                  but the colored parallel highlights map its structure. */}
              {splitIntoSpans(
                chapter.text.zh,
                chapter.inlineParallels.filter((p) => p.startZh >= 0),
                "zh",
              ).map((s, i) =>
                s.parallels.length > 0 ? (
                  <span
                    key={i}
                    style={{
                      backgroundColor: `var(--color-highlight-${s.parallels[0].colorKey})`,
                    }}
                  >
                    {s.text}
                  </span>
                ) : (
                  <Fragment key={i}>{s.text}</Fragment>
                ),
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
