"use server";

import { revalidatePath } from "next/cache";
import {
  AuthoringError,
  createFile,
  createTopic,
  isAuthoringEnabled,
  writeFileRaw,
} from "@/lib/authoring";
import { commitAndPush, GitError } from "@/lib/git";
import { writeSearchIndex } from "@/lib/search-index";

/**
 * Server Actions for the authoring flow. All run in the Node runtime and are
 * gated by `isAuthoringEnabled()` (defence in depth — the UI is also hidden in
 * production). They return discriminated results so dialogs can show inline
 * errors instead of throwing.
 */

export type CreateTopicResult =
  | { ok: true; slug: string }
  | { ok: false; error: string };

export type CreateFileResult =
  | { ok: true; filename: string }
  | { ok: false; error: string };

export type SaveFileResult =
  | { ok: true; sha: string; branch: string; pushed: boolean; pushError?: string }
  | { ok: false; error: string };

const DISABLED = "Authoring is disabled in this environment.";

function toMessage(error: unknown): string {
  if (error instanceof AuthoringError || error instanceof GitError) {
    return error.message;
  }
  console.error("[authoring] action failed:", error);
  return "Something went wrong. Check the dev server logs.";
}

/** Best-effort search-index refresh so home recents/search see new content. */
async function refreshIndex(): Promise<void> {
  try {
    await writeSearchIndex();
  } catch (error) {
    console.error("[authoring] search index refresh failed:", error);
  }
}

/** Phase 1: create a topic folder + templated `_index.md` (no commit). */
export async function createTopicAction(name: string): Promise<CreateTopicResult> {
  if (!isAuthoringEnabled()) return { ok: false, error: DISABLED };
  try {
    const { slug } = await createTopic(name);
    await refreshIndex();
    revalidatePath("/");
    return { ok: true, slug };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

/** Phase 2: add a sibling markdown file to a topic (no commit). */
export async function createFileAction(
  topicId: string,
  name: string,
): Promise<CreateFileResult> {
  if (!isAuthoringEnabled()) return { ok: false, error: DISABLED };
  try {
    const { filename } = await createFile(topicId, name);
    await refreshIndex();
    revalidatePath(`/topic/${topicId}`);
    return { ok: true, filename };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

/**
 * Phase 2: save an edited file and publish. Requires a non-empty commit
 * message, writes the file, then stages + commits + pushes all pending vault
 * changes to the development branch. Returns the commit SHA + branch.
 */
export async function saveFileAction(
  topicId: string,
  filename: string,
  content: string,
  commitMessage: string,
): Promise<SaveFileResult> {
  if (!isAuthoringEnabled()) return { ok: false, error: DISABLED };
  const message = (commitMessage ?? "").trim();
  if (!message) return { ok: false, error: "A commit message is required to save." };
  try {
    await writeFileRaw(topicId, filename, content);
    await refreshIndex();
    const { sha, branch, pushed, pushError } = await commitAndPush(message);
    revalidatePath(`/topic/${topicId}`);
    revalidatePath("/");
    return { ok: true, sha, branch, pushed, pushError };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}
