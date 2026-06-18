import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { getVaultDir } from "./vault";

/**
 * Server-only git layer for the Save → publish flow. Wraps the local `git` CLI
 * (no dependency) and scopes every operation to the vault directory so app code
 * is never swept into a content commit. Works only where git + credentials
 * exist — your machine; on Vercel there is no git, and authoring is gated off.
 */

const execFileAsync = promisify(execFile);

export class GitError extends Error {}

function git(args: string[], cwd: string) {
  return execFileAsync("git", args, { cwd, windowsHide: true, maxBuffer: 1024 * 1024 });
}

function errText(error: unknown): string {
  if (error && typeof error === "object") {
    const e = error as { stderr?: string; message?: string };
    const text = (e.stderr || e.message || "").toString().trim();
    if (text) return text.split("\n").slice(0, 3).join(" ").slice(0, 300);
  }
  return "git command failed";
}

let cachedRoot: string | null = null;

/** Absolute path to the repository root (cached). */
export async function getRepoRoot(): Promise<string> {
  if (cachedRoot) return cachedRoot;
  try {
    const { stdout } = await git(["rev-parse", "--show-toplevel"], process.cwd());
    cachedRoot = stdout.trim();
    return cachedRoot;
  } catch (error) {
    throw new GitError(`Not a git repository: ${errText(error)}`);
  }
}

/** The vault path relative to the repo root, as a forward-slash git pathspec. */
async function vaultPathspec(repoRoot: string): Promise<string> {
  const rel = path.relative(repoRoot, getVaultDir());
  if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new GitError("The vault is outside the git repository; cannot commit from here.");
  }
  return rel.split(path.sep).join("/");
}

/** Pending (uncommitted) file paths under the vault, for the commit dialog. */
export async function getVaultStatus(): Promise<string[]> {
  const repoRoot = await getRepoRoot();
  const spec = await vaultPathspec(repoRoot);
  const { stdout } = await git(["status", "--porcelain", "--", spec], repoRoot);
  return stdout
    .split("\n")
    .filter(Boolean)
    .map((line) => line.replace(/\r$/, "").slice(3).replace(/^"|"$/g, ""));
}

/** The branch authoring publishes to. Configurable; defaults to `development`. */
function publishBranch(): string {
  return process.env.KNOWLEDGEHUB_PUBLISH_BRANCH?.trim() || "development";
}

/** Current checked-out branch name (e.g. "development"), or "HEAD" if detached. */
async function getCurrentBranch(repoRoot: string): Promise<string> {
  const { stdout } = await git(["rev-parse", "--abbrev-ref", "HEAD"], repoRoot);
  return stdout.trim();
}

/**
 * Stage everything under the vault, commit it under `message`, and push to the
 * publish branch (default `development`, override `KNOWLEDGEHUB_PUBLISH_BRANCH`).
 * Requires being on that branch so content never lands on the wrong one. Returns
 * the commit SHA + branch. Push failures are reported but keep the commit (the
 * author can retry the push manually). Throws if there is nothing to commit.
 */
export async function commitAndPush(
  message: string,
): Promise<{ sha: string; branch: string; pushed: boolean; pushError?: string }> {
  const repoRoot = await getRepoRoot();
  const spec = await vaultPathspec(repoRoot);
  const branch = publishBranch();

  // Publish only from the publish branch, so a content commit never lands on the
  // wrong branch (e.g. main). The author switches once and stays there.
  const current = await getCurrentBranch(repoRoot);
  if (current !== branch) {
    throw new GitError(
      `Publishing targets the "${branch}" branch, but you're on "${current}". ` +
        `Switch first:  git switch ${branch}   (or:  git switch -c ${branch})`,
    );
  }

  // Stage new/modified/deleted files within the vault only.
  await git(["add", "--all", "--", spec], repoRoot);

  // Anything actually staged?
  const staged = await git(["diff", "--cached", "--name-only", "--", spec], repoRoot);
  if (!staged.stdout.trim()) {
    throw new GitError("There are no vault changes to commit.");
  }

  // Commit, scoped to the vault pathspec (ignores anything else already staged).
  await git(["commit", "-m", message, "--", spec], repoRoot);
  const { stdout: head } = await git(["rev-parse", "HEAD"], repoRoot);
  const sha = head.trim();

  // Push to origin/<branch>, creating the remote branch + tracking on first push.
  try {
    await git(["push", "-u", "origin", branch], repoRoot);
    return { sha, branch, pushed: true };
  } catch (error) {
    return { sha, branch, pushed: false, pushError: errText(error) };
  }
}
