export function scrollToSegment(segmentId: string, options?: ScrollIntoViewOptions): void {
  if (typeof document === 'undefined') return;
  const el = document.querySelector(`[data-segment-id="${CSS.escape(segmentId)}"]`);
  if (el instanceof HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center', ...options });
  }
}

/**
 * Creates a fading highlight overlay over the exact coordinates of a DOM Range.
 * This looks much better than window.getSelection() and doesn't interfere with the DOM.
 */
export function highlightRangeAnimation(range: Range): void {
  if (typeof document === 'undefined') return;
  
  // Clear any existing native selection so it doesn't clash visually
  const selection = window.getSelection();
  selection?.removeAllRanges();

  const container = document.getElementById('main-text-container') ?? document.body;
  if (container !== document.body) {
    container.style.position = 'relative';
  }
  const containerRect = container.getBoundingClientRect();

  const rects = range.getClientRects();
  const overlays: HTMLElement[] = [];

  for (let i = 0; i < rects.length; i++) {
    const rect = rects[i];
    const overlay = document.createElement('div');
    overlay.className = 'search-match-overlay';
    overlay.style.position = 'absolute';
    // Calculate position relative to the container
    overlay.style.left = `${rect.left - containerRect.left + (container === document.body ? window.scrollX : 0)}px`;
    overlay.style.top = `${rect.top - containerRect.top + (container === document.body ? window.scrollY : 0)}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    overlay.style.backgroundColor = 'var(--color-accent-bright, #2d83f6)';
    overlay.style.borderRadius = '3px';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '100';
    overlay.style.animation = 'highlight-fade 2s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    
    container.appendChild(overlay);
    overlays.push(overlay);
  }

  // Clean up overlays after animation finishes
  window.setTimeout(() => {
    for (const overlay of overlays) {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }
  }, 2500);
}
