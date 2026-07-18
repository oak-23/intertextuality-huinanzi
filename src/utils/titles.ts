const ORDINALS = [
  "One", "Two", "Three", "Four", "Five", "Six", "Seven",
  "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
  "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty", "Twenty-One",
];

/** 0-based chapter index → "One", "Two", … (Huainanzi has 21 chapters). */
export function chapterOrdinal(index: number): string {
  return ORDINALS[index] ?? String(index + 1);
}

/**
 * Format a bilingual chapter title for display:
 * "Yuandao xun — Originating in the Way" → “Yuandao xun” - “Originating in the Way”.
 * Titles without a translation dash (e.g. "Chapter 66", "Zeyang") pass through unchanged.
 */
export function formatTitleEn(en: string): string {
  const i = en.indexOf("—");
  if (i === -1) return en;
  return `“${en.slice(0, i).trim()}” – “${en.slice(i + 1).trim()}”`;
}
