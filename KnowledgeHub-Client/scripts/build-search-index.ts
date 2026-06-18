import { writeSearchIndex } from "../lib/search-index";

/**
 * Build-time generator for public/search-index.json.
 *
 * Runs via the `prebuild` / `predev` npm hooks (and `npm run index`). Reads the
 * local KnowledgeVault and writes a compact, metadata-only index that the
 * client loads for fuzzy search. A missing/empty vault yields `[]` — the build
 * still succeeds (graceful empty state). The actual work lives in
 * `writeSearchIndex()` so the authoring actions can reuse it after a mutation.
 */
async function main(): Promise<void> {
  const count = await writeSearchIndex();
  console.log(
    `[search-index] wrote ${count} entr${count === 1 ? "y" : "ies"} -> public/search-index.json`,
  );
}

main().catch((error) => {
  console.error("[search-index] failed to build:", error);
  process.exit(1);
});
