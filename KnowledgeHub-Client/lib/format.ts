/**
 * Format a YYYY-MM-DD (or ISO) date string for display, e.g. "Jun 17, 2026".
 * Uses UTC so server and client render identically (no hydration mismatch).
 */
export function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
