import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseHighlightPulseReturn {
  pulsingId: string | null;
  pulse: (segmentId: string) => void;
}

/** Briefly flags a segment id so the renderer can add a pulse class for ~600ms. */
export function useHighlightPulse(duration = 600): UseHighlightPulseReturn {
  const [pulsingId, setPulsingId] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const pulse = useCallback(
    (segmentId: string) => {
      setPulsingId(segmentId);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setPulsingId(null), duration);
    },
    [duration]
  );

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  return { pulsingId, pulse };
}
