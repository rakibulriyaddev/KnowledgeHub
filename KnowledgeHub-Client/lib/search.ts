import Fuse, { type IFuseOptions } from "fuse.js";
import type { SearchIndexEntry } from "./vault";

export type { SearchIndexEntry };

/** Max results shown in the live search dropdown. */
export const MAX_RESULTS = 10;

/**
 * Fuse config — subsequence/fuzzy matching on `title` and `tags` only, per the
 * spec. `ignoreLocation` lets matches appear anywhere in the string.
 */
const FUSE_OPTIONS: IFuseOptions<SearchIndexEntry> = {
  keys: [
    { name: "title", weight: 0.7 },
    { name: "tags", weight: 0.3 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 1,
};

export function createFuse(entries: SearchIndexEntry[]): Fuse<SearchIndexEntry> {
  return new Fuse(entries, FUSE_OPTIONS);
}
