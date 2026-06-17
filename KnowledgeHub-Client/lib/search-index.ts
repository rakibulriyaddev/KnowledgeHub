import { promises as fs } from "node:fs";
import path from "node:path";
import type { SearchIndexEntry } from "./vault";

export type { SearchIndexEntry };

/**
 * Server-side reader for the generated search index. Reads the JSON straight
 * from the filesystem (it lives in public/), so home-page recents and the
 * client search share a single source of truth. Returns `[]` if absent.
 */
export async function getSearchIndex(): Promise<SearchIndexEntry[]> {
  try {
    const file = await fs.readFile(
      path.resolve(process.cwd(), "public", "search-index.json"),
      "utf8",
    );
    const parsed: unknown = JSON.parse(file);
    return Array.isArray(parsed) ? (parsed as SearchIndexEntry[]) : [];
  } catch {
    return [];
  }
}

function sortByDateDesc(
  entries: SearchIndexEntry[],
  key: "created" | "modified",
): SearchIndexEntry[] {
  return [...entries].sort((a, b) => {
    const ta = a[key] ? Date.parse(a[key] as string) : Number.NaN;
    const tb = b[key] ? Date.parse(b[key] as string) : Number.NaN;
    const va = Number.isNaN(ta) ? -Infinity : ta;
    const vb = Number.isNaN(tb) ? -Infinity : tb;
    return vb - va;
  });
}

/** Top `limit` nodes by `created` date, newest first. */
export function getRecentlyAdded(
  entries: SearchIndexEntry[],
  limit = 10,
): SearchIndexEntry[] {
  return sortByDateDesc(entries, "created").slice(0, limit);
}

/** Top `limit` nodes by `modified` date, most recent first. */
export function getRecentlyUpdated(
  entries: SearchIndexEntry[],
  limit = 10,
): SearchIndexEntry[] {
  return sortByDateDesc(entries, "modified").slice(0, limit);
}
