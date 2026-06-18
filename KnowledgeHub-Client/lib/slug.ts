/**
 * Pure, dependency-free slug helpers — no node imports, so these are safe to
 * use from both Client Components (live preview of the derived id) and the
 * server-only authoring layer (which validates against `isSafeSegment`).
 */

/** Kebab-case a name into a URL/folder-safe id (a-z, 0-9, hyphens). */
export function slugify(name: string): string {
  return name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // drop everything but alphanumerics, spaces, hyphens
    .trim()
    .replace(/[\s_]+/g, "-") // spaces/underscores -> hyphen
    .replace(/-+/g, "-") // collapse repeats
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

/** Turn arbitrary user input into a safe `<slug>.md` filename (`""` if empty). */
export function toMarkdownFilename(input: string): string {
  const base = input.trim().replace(/\.md$/i, "");
  const slug = slugify(base);
  return slug ? `${slug}.md` : "";
}
