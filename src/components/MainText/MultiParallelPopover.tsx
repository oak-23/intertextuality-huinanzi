import { Popover } from "../shared/Popover";
import type { Language, ParallelOption } from "../../types";
import { useRepositories } from "../../context/RepositoryContext";

export interface MultiParallelPopoverProps {
  open: boolean;
  anchor: HTMLElement | null;
  parallels: ParallelOption[];
  language: Language;
  onSelect: (parallel: ParallelOption) => void;
  onClose: () => void;
}

export function MultiParallelPopover({
  open,
  anchor,
  parallels,
  onSelect,
  onClose,
}: MultiParallelPopoverProps) {
  const { texts } = useRepositories();
  return (
    <Popover
      open={open}
      anchor={anchor}
      placement="bottom-start"
      onClose={onClose}
      width={280}
      ariaLabel="Choose a parallel text"
    >
      <div className="py-2">
        <div
          className="px-3 pt-1 pb-2 uppercase"
          style={{
            color: "var(--color-muted)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.06em",
          }}
        >
          Found in {parallels.length} other{" "}
          {parallels.length === 1 ? "text" : "texts"}
        </div>
        {parallels.map((p, i) => {
          const text = texts.getParallelText(p.textId);
          if (!text) return null;
          const chapter = text.chapters.find((c) => c.id === p.chapterId);
          const chapterTitleZh = chapter?.title.zh || p.chapterId;
          const textTitleZh = text.title.zh || p.textId;
          return (
            <button
              key={`${p.textId}-${i}`}
              type="button"
              onClick={() => {
                onSelect(p);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-surface-low transition-colors"
            >
              <span
                aria-hidden
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  backgroundColor: `var(--color-highlight-${p.colorKey})`,
                  flexShrink: 0,
                }}
              />
              <span className="flex-1 min-w-0 flex flex-col">
                <span
                  className="block"
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {textTitleZh}
                </span>
              </span>
              <span
                className="shrink-0 text-right"
                style={{
                  width: 96,
                  fontFamily: "var(--font-ui)",
                  fontSize: 11,
                  color: "var(--color-muted)",
                }}
              >
                {chapterTitleZh}
              </span>
            </button>
          );
        })}
      </div>
    </Popover>
  );
}
