export function scrollToSegment(segmentId: string, options?: ScrollIntoViewOptions): void {
  if (typeof document === 'undefined') return;
  const el = document.querySelector(`[data-segment-id="${CSS.escape(segmentId)}"]`);
  if (el instanceof HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center', ...options });
  }
}
