import { promises as fs, type Dirent } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Local-filesystem data layer for the KnowledgeVault.
 *
 * The vault is a sibling folder in this monorepo (default ../KnowledgeVault).
 * Everything here runs server-side only — at build time for the search-index
 * script and `generateStaticParams`, and during SSG for the topic pages.
 * It must never be imported from a Client Component.
 */

export interface Frontmatter {
  id: string;
  title: string;
  created: string | null;
  modified: string | null;
  tags: string[];
  parent: string | null;
  children: string[];
}

export interface VaultNode {
  /** Canonical id — always the folder name (stable even if frontmatter `id` drifts). */
  id: string;
  frontmatter: Frontmatter;
  /** Markdown body of `_index.md` (frontmatter stripped). */
  body: string;
  /** Sibling markdown filenames in the folder, excluding `_index.md`. */
  siblings: string[];
}

export interface SearchIndexEntry {
  id: string;
  title: string;
  tags: string[];
  parent: string | null;
  children: string[];
  created: string | null;
  modified: string | null;
}

export interface Panel {
  /** Source filename, e.g. "_index.md" or "qa.md". */
  name: string;
  /** Human-friendly label for the file switcher. */
  label: string;
  /** Markdown body to render (frontmatter stripped). */
  body: string;
  /** Full raw file contents incl. frontmatter — what the editor edits. */
  raw: string;
}

export interface TopicView {
  node: VaultNode;
  /** "_index.md" first (labelled "Overview"), then each sibling file. */
  panels: Panel[];
}

const DEFAULT_VAULT_DIR = "../KnowledgeVault";

/** Absolute path to the vault folder, resolved from VAULT_DIR (or the default). */
export function getVaultDir(): string {
  const configured = process.env.VAULT_DIR?.trim() || DEFAULT_VAULT_DIR;
  return path.resolve(process.cwd(), configured);
}

/** Reject anything that isn't a single, safe path segment (no traversal). */
export function isSafeSegment(segment: string): boolean {
  return (
    segment.length > 0 &&
    !segment.includes("/") &&
    !segment.includes("\\") &&
    !segment.includes("..")
  );
}

async function readFileSafe(absPath: string): Promise<string | null> {
  try {
    return await fs.readFile(absPath, "utf8");
  } catch {
    return null;
  }
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * Normalize a date to a YYYY-MM-DD string.
 * `gray-matter` (js-yaml) parses unquoted ISO dates into `Date` objects, so we
 * must handle Date, string, and number forms.
 */
function toDateString(value: unknown): string | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString().slice(0, 10);
  }
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  if (typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
  }
  return null;
}

function toParent(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed && trimmed.toLowerCase() !== "null") return trimmed;
  }
  return null;
}

export function normalizeFrontmatter(
  data: Record<string, unknown>,
  fallbackId: string,
): Frontmatter {
  const id =
    typeof data.id === "string" && data.id.trim() ? data.id.trim() : fallbackId;
  const title =
    typeof data.title === "string" && data.title.trim()
      ? data.title.trim()
      : fallbackId;
  return {
    id,
    title,
    created: toDateString(data.created),
    modified: toDateString(data.modified),
    tags: toStringArray(data.tags),
    parent: toParent(data.parent),
    children: toStringArray(data.children),
  };
}

/** Parse frontmatter without ever throwing on malformed YAML. */
function safeMatter(raw: string): { data: Record<string, unknown>; content: string } {
  try {
    const parsed = matter(raw);
    return {
      data: (parsed.data ?? {}) as Record<string, unknown>,
      content: parsed.content ?? "",
    };
  } catch {
    return { data: {}, content: raw };
  }
}

function humanizeFilename(name: string): string {
  const base = name.replace(/\.md$/i, "");
  if (base.toLowerCase() === "qa") return "Q&A";
  return base.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Top-level vault folders that contain an `_index.md` (i.e. real topic nodes). */
export async function listTopicFolders(): Promise<string[]> {
  const dir = getVaultDir();
  let entries: Dirent[];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const folders: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || !isSafeSegment(entry.name)) continue;
    const indexRaw = await readFileSafe(path.join(dir, entry.name, "_index.md"));
    if (indexRaw !== null) folders.push(entry.name);
  }
  return folders.sort();
}

/** Sibling markdown files in a topic folder (excludes `_index.md`). */
export async function listSiblingFiles(id: string): Promise<string[]> {
  if (!isSafeSegment(id)) return [];
  const dir = path.join(getVaultDir(), id);
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter(
        (e) =>
          e.isFile() &&
          e.name.toLowerCase().endsWith(".md") &&
          e.name !== "_index.md",
      )
      .map((e) => e.name)
      .sort();
  } catch {
    return [];
  }
}

/** Read and parse a single topic node by id (folder name). */
export async function getNode(id: string): Promise<VaultNode | null> {
  if (!isSafeSegment(id)) return null;
  const indexRaw = await readFileSafe(path.join(getVaultDir(), id, "_index.md"));
  if (indexRaw === null) return null;
  const { data, content } = safeMatter(indexRaw);
  return {
    id,
    frontmatter: normalizeFrontmatter(data, id),
    body: content,
    siblings: await listSiblingFiles(id),
  };
}

/** True if a folder with this id already exists in the vault (i.e. name taken). */
export async function topicExists(id: string): Promise<boolean> {
  if (!isSafeSegment(id)) return false;
  try {
    const stat = await fs.stat(path.join(getVaultDir(), id));
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Read a file's full raw contents (frontmatter + body) from a topic folder.
 * Used by the editor, which edits the whole file. Returns null if absent or the
 * path is unsafe.
 */
export async function readRawFile(id: string, name: string): Promise<string | null> {
  if (!isSafeSegment(id) || !isSafeSegment(name) || !name.toLowerCase().endsWith(".md")) {
    return null;
  }
  return readFileSafe(path.join(getVaultDir(), id, name));
}

/** Read and parse every topic node in the vault (used by the build script). */
export async function getAllNodes(): Promise<VaultNode[]> {
  const folders = await listTopicFolders();
  const nodes = await Promise.all(folders.map((folder) => getNode(folder)));
  return nodes.filter((node): node is VaultNode => node !== null);
}

/** Project a node down to the fields stored in the static search index. */
export function toIndexEntry(node: VaultNode): SearchIndexEntry {
  const { frontmatter: fm, id } = node;
  return {
    id,
    title: fm.title,
    tags: fm.tags,
    parent: fm.parent,
    children: fm.children,
    created: fm.created,
    modified: fm.modified,
  };
}

/**
 * Build the full topic view for a page: the node plus every renderable panel
 * (`_index.md` first, then each sibling file with its body and label).
 */
export async function getTopicView(id: string): Promise<TopicView | null> {
  const node = await getNode(id);
  if (!node) return null;

  const dir = path.join(getVaultDir(), id);
  // Reconstruct the full _index.md so the editor has frontmatter + body.
  const indexRaw = (await readFileSafe(path.join(dir, "_index.md"))) ?? node.body;
  const panels: Panel[] = [
    { name: "_index.md", label: "Overview", body: node.body, raw: indexRaw },
  ];
  for (const sibling of node.siblings) {
    const raw = await readFileSafe(path.join(dir, sibling));
    if (raw === null) continue;
    const { data, content } = safeMatter(raw);
    const label =
      typeof data.title === "string" && data.title.trim()
        ? data.title.trim()
        : humanizeFilename(sibling);
    panels.push({ name: sibling, label, body: content, raw });
  }

  return { node, panels };
}
