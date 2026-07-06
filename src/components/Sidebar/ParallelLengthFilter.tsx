import { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { useRhymedView } from "../../hooks/useRhymedView";
import { RangeSlider } from "../shared/RangeSlider";
import {
  LENGTH_MIN_OPEN,
  LENGTH_MAX_OPEN,
  parallelLength,
  withinLengthRange,
} from "../../utils/parallelFilters";

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/**
 * Research-mode control that filters main-text highlights by the Chinese-character
 * length of each parallel. The track bounds are derived from the current chapter's
 * actual parallel lengths; dragging a handle to an extreme stores the open sentinel
 * so "no limit" persists across chapters.
 */
export function ParallelLengthFilter() {
  const { state, setLengthRange } = useApp();
  const { activeParallels } = useRhymedView();

  // Distinct main-text locations (start:end) — one length per highlighted range.
  const { dataMin, dataMax, lengths } = useMemo(() => {
    const seen = new Set<string>();
    const lens: number[] = [];
    for (const p of activeParallels) {
      if (p.startZh < 0) continue;
      const k = `${p.startZh}:${p.endZh}`;
      if (seen.has(k)) continue;
      seen.add(k);
      lens.push(parallelLength(p));
    }
    return {
      dataMin: lens.length ? Math.min(...lens) : 1,
      dataMax: lens.length ? Math.max(...lens) : 1,
      lengths: lens,
    };
  }, [activeParallels]);

  if (state.viewMode !== "research") return null;
  if (dataMax <= dataMin) return null; // nothing meaningful to filter

  const low = clamp(state.lengthMin, dataMin, dataMax);
  const high = clamp(state.lengthMax, dataMin, dataMax);

  const handleChange = (lo: number, hi: number) => {
    // Snapping to an extreme means "no limit on that side" — persist the sentinel
    // so the filter doesn't silently clip other chapters with a larger range.
    setLengthRange(
      lo <= dataMin ? LENGTH_MIN_OPEN : lo,
      hi >= dataMax ? LENGTH_MAX_OPEN : hi,
    );
  };

  const shown = lengths.filter((len) =>
    withinLengthRange({ startZh: 0, endZh: len }, low, high),
  ).length;
  const filtered = low > dataMin || high < dataMax;

  return (
    <div className="px-4 mb-4">
      <div className="flex items-baseline justify-between" style={{ marginBottom: 8 }}>
        <span
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "var(--color-secondary)",
          }}
        >
          Length
        </span>
        <span
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 12,
            fontWeight: 500,
            color: "var(--color-text-primary)",
          }}
        >
          {low}{low === high ? "" : `–${high}`} characters
        </span>
      </div>
      <RangeSlider
        min={dataMin}
        max={dataMax}
        low={low}
        high={high}
        onChange={handleChange}
        lowLabel="Minimum parallel length"
        highLabel="Maximum parallel length"
      />
      <p
        style={{
          marginTop: 6,
          fontFamily: "var(--font-ui)",
          fontSize: 11,
          color: "var(--color-secondary)",
        }}
      >
        {filtered
          ? `Showing ${shown} of ${lengths.length} parallels`
          : `${lengths.length} parallels · ${dataMin}–${dataMax} characters`}
      </p>
    </div>
  );
}
