import { promises as fs } from "node:fs";
import path from "node:path";
import { getAllNodes, toIndexEntry } from "../lib/vault";

/**
 * Build-time generator for public/search-index.json.
 *
 * Runs via the `prebuild` / `predev` npm hooks (and `npm run index`). Reads the
 * local KnowledgeVault and writes a compact, metadata-only index that the
 * client loads for fuzzy search. A missing/empty vault yields `[]` — the build
 * still succeeds (graceful empty state).
 */
async function main(): Promise<void> {
  const nodes = await getAllNodes();
  const index = nodes
    .map(toIndexEntry)
    .sort((a, b) => a.id.localeCompare(b.id));

  const outPath = path.resolve(process.cwd(), "public", "search-index.json");
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");

  console.log(
    `[search-index] wrote ${index.length} entr${index.length === 1 ? "y" : "ies"} -> ${path.relative(
      process.cwd(),
      outPath,
    )}`,
  );
}

main().catch((error) => {
  console.error("[search-index] failed to build:", error);
  process.exit(1);
});
