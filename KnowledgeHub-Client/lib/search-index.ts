import { promises as fs } from "node:fs";
import path from "node:path";
import { getAllNodes, toIndexEntry, type SearchIndexEntry } from "./vault";

export type { SearchIndexEntry };

/** Absolute path to the generated index (lives in public/ so the client can fetch it). */
const INDEX_PATH = path.resolve(process.cwd(), "public", "search-index.json");

/**
 * Read every vault node and write the compact, metadata-only search index to
 * public/search-index.json. Shared by the build script (prebuild/predev) and
 * the authoring actions, which regenerate it after a mutation so home recents
 * and search stay fresh. Returns the number of entries written.
 */
export async function writeSearchIndex(): Promise<number> {
  const nodes = await getAllNodes();
  const index = nodes.map(toIndexEntry).sort((a, b) => a.id.localeCompare(b.id));
  await fs.mkdir(path.dirname(INDEX_PATH), { recursive: true });
  await fs.writeFile(INDEX_PATH, `${JSON.stringify(index, null, 2)}\n`, "utf8");
  return index.length;
}

/**
 * Server-side reader for the generated search index. Reads the JSON straight
 * from the filesystem (it lives in public/), so home-page recents and the
 * client search share a single source of truth. Returns `[]` if absent.
 */
export async function getSearchIndex(): Promise<SearchIndexEntry[]> {
  try {
    const file = await fs.readFile(INDEX_PATH, "utf8");
    const parsed: unknown = JSON.parse(file);
    return Array.isArray(parsed) ? (parsed as SearchIndexEntry[]) : [];
  } catch {
    return [];
  }
}

/** Top-level topics — entries with no parent — sorted alphabetically by title. */
export function getChapters(entries: SearchIndexEntry[]): SearchIndexEntry[] {
  return entries
    .filter((entry) => !entry.parent)
    .sort((a, b) => a.title.localeCompare(b.title));
}
