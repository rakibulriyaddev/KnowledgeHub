import { promises as fs } from "node:fs";
import path from "node:path";
import { getVaultDir, isSafeSegment, topicExists } from "./vault";
import { slugify, toMarkdownFilename } from "./slug";

/**
 * Server-only authoring layer: gating + the filesystem writes behind Phase 1
 * (create topic) and Phase 2 (add/save files). Never import from a Client
 * Component — it uses `node:fs`. Writes only happen where there is a writable
 * disk (your machine via `next dev`); see `isAuthoringEnabled`.
 */

/** Thrown for user-facing validation failures; its message is safe to surface. */
export class AuthoringError extends Error {}

/**
 * Authoring is enabled locally (dev) or when explicitly opted in. On Vercel
 * (production, flag unset) this is false, so the app is automatically read-only
 * and the editing UI / actions stay off.
 */
export function isAuthoringEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.KNOWLEDGEHUB_AUTHORING === "true"
  );
}

/** Today's date as YYYY-MM-DD, matching the frontmatter date format. */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Quote a value as a YAML-safe scalar (JSON strings are valid YAML scalars). */
function yamlString(value: string): string {
  return JSON.stringify(value);
}

async function pathExists(absPath: string): Promise<boolean> {
  try {
    await fs.stat(absPath);
    return true;
  } catch {
    return false;
  }
}

/** Default `_index.md` for a brand-new topic. */
export function defaultIndexMarkdown(slug: string, title: string, date: string): string {
  return `---
id: ${slug}
title: ${yamlString(title)}
created: ${date}
modified: ${date}
tags: []
parent: null
children: []
status: draft
---

# ${title}

Start writing here.
`;
}

/** Default body for a new sibling file (its frontmatter title labels the switcher). */
export function defaultFileMarkdown(title: string, date: string): string {
  return `---
title: ${yamlString(title)}
created: ${date}
modified: ${date}
---

# ${title}

`;
}

/**
 * Create a new topic folder with a templated `_index.md`. The folder name (the
 * canonical id) is the slug of `name`; the typed name is kept verbatim as the
 * title. Refuses to overwrite an existing topic. Does NOT commit (Phase 1 is a
 * temporary local write — git only updates on Save).
 */
export async function createTopic(name: string): Promise<{ slug: string }> {
  const slug = slugify(name);
  if (!slug || !isSafeSegment(slug)) {
    throw new AuthoringError("Please enter a valid topic name (letters or numbers).");
  }
  if (await topicExists(slug)) {
    throw new AuthoringError(`A topic "${slug}" already exists.`);
  }
  const title = name.trim() || slug;
  const dir = path.join(getVaultDir(), slug);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(
    path.join(dir, "_index.md"),
    defaultIndexMarkdown(slug, title, today()),
    { flag: "wx", encoding: "utf8" }, // wx: fail if it somehow already exists
  );
  return { slug };
}

/**
 * Create a new sibling markdown file in an existing topic. The filename is the
 * slug of `name` with a `.md` extension; the typed name labels the file.
 * Refuses to overwrite. Does NOT commit (temporary local write).
 */
export async function createFile(
  topicId: string,
  name: string,
): Promise<{ filename: string }> {
  if (!isSafeSegment(topicId) || !(await topicExists(topicId))) {
    throw new AuthoringError("Topic not found.");
  }
  const filename = toMarkdownFilename(name);
  if (!filename || !isSafeSegment(filename)) {
    throw new AuthoringError("Please enter a valid file name.");
  }
  if (filename === "_index.md") {
    throw new AuthoringError("“_index.md” is reserved for the topic overview.");
  }
  const filePath = path.join(getVaultDir(), topicId, filename);
  if (await pathExists(filePath)) {
    throw new AuthoringError(`“${filename}” already exists in this topic.`);
  }
  const label = name.trim().replace(/\.md$/i, "") || filename;
  await fs.writeFile(filePath, defaultFileMarkdown(label, today()), {
    flag: "wx",
    encoding: "utf8",
  });
  return { filename };
}

/**
 * Overwrite a file's full raw contents (frontmatter + body) — used by Save.
 * Validates the path stays within the topic folder. The file must already
 * exist (create flows above handle new files).
 */
export async function writeFileRaw(
  topicId: string,
  filename: string,
  content: string,
): Promise<void> {
  if (
    !isSafeSegment(topicId) ||
    !isSafeSegment(filename) ||
    !filename.toLowerCase().endsWith(".md")
  ) {
    throw new AuthoringError("Invalid file path.");
  }
  const filePath = path.join(getVaultDir(), topicId, filename);
  if (!(await pathExists(filePath))) {
    throw new AuthoringError("That file no longer exists.");
  }
  await fs.writeFile(filePath, content, "utf8");
}
