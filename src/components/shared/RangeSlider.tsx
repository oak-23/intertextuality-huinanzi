import {
  useRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

export interface RangeSliderProps {
  /** Track bounds (inclusive). */
  min: number;
  max: number;
  /** Current handle values, expected within [min, max] and low <= high. */
  low: number;
  high: number;
  onChange: (low: number, high: number) => void;
  lowLabel?: string;
  highLabel?: string;
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

const TRACK_H = 4;
const THUMB = 16;

/**
 * Minimal accessible dual-thumb range slider. Integer values only (character
 * counts). Pointer-capture keeps a drag attached to its handle even when the
 * cursor leaves the track; arrow / Home / End keys move the focused handle.
 * Styling is inline + CSS custom properties to match the rest of the UI kit.
 */
export function RangeSlider({
  min,
  max,
  low,
  high,
  onChange,
  lowLabel = "Minimum",
  highLabel = "Maximum",
}: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const span = Math.max(1, max - min);
  const pct = (v: number) => ((clamp(v, min, max) - min) / span) * 100;

  const valueFromClientX = (clientX: number): number => {
    const el = trackRef.current;
    if (!el) return min;
    const rect = el.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    return Math.round(min + ratio * span);
  };

  // Which handle a drag/key targets is read from its own data-thumb attribute, so
  // no render-time ref is needed; pointer capture keeps moves attached to the handle.
  const setValue = (which: "low" | "high", v: number) => {
    // Skip no-op updates so a continuous drag only re-renders when the integer
    // value actually changes (pointermove fires far more often than that).
    if (which === "low") {
      const nl = clamp(v, min, high);
      if (nl !== low) onChange(nl, high);
    } else {
      const nh = clamp(v, low, max);
      if (nh !== high) onChange(low, nh);
    }
  };
  const thumbOf = (el: HTMLElement) => el.dataset.thumb as "low" | "high";

  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.currentTarget.focus();
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.hasPointerCapture?.(e.pointerId)) return;
    setValue(thumbOf(e.currentTarget), valueFromClientX(e.clientX));
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    const which = thumbOf(e.currentTarget);
    const cur = which === "low" ? low : high;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        setValue(which, cur - 1);
        break;
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        setValue(which, cur + 1);
        break;
      case "Home":
        e.preventDefault();
        setValue(which, min);
        break;
      case "End":
        e.preventDefault();
        setValue(which, max);
        break;
      default:
        break;
    }
  };

  const thumbStyle = (v: number): CSSProperties => ({
    position: "absolute",
    top: "50%",
    left: `${pct(v)}%`,
    transform: "translate(-50%, -50%)",
    width: THUMB,
    height: THUMB,
    borderRadius: 9999,
    backgroundColor: "var(--color-accent-bright)",
    border: "2px solid var(--color-background)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
    cursor: "pointer",
    padding: 0,
    touchAction: "none",
  });

  return (
    <div
      style={{
        position: "relative",
        height: THUMB + 4,
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* base track */}
      <div
        ref={trackRef}
        style={{
          position: "relative",
          width: "100%",
          height: TRACK_H,
          borderRadius: 9999,
          backgroundColor: "var(--color-surface-high)",
        }}
      >
        {/* selected segment */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            height: "100%",
            left: `${pct(low)}%`,
            width: `${Math.max(0, pct(high) - pct(low))}%`,
            backgroundColor: "var(--color-accent-bright)",
            borderRadius: 9999,
          }}
        />
        <button
          type="button"
          role="slider"
          data-thumb="low"
          aria-label={lowLabel}
          aria-valuemin={min}
          aria-valuemax={high}
          aria-valuenow={low}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onKeyDown={onKeyDown}
          style={thumbStyle(low)}
        />
        <button
          type="button"
          role="slider"
          data-thumb="high"
          aria-label={highLabel}
          aria-valuemin={low}
          aria-valuemax={max}
          aria-valuenow={high}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onKeyDown={onKeyDown}
          style={thumbStyle(high)}
        />
      </div>
    </div>
  );
}
