"use client";

import { useEffect, useState, useTransition } from "react";
import Modal from "./Modal";
import { saveFileAction } from "@/app/actions/authoring";

export interface SaveResult {
  sha: string;
  branch: string;
  pushed: boolean;
  pushError?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  topicId: string;
  filename: string;
  content: string;
  onSaved: (result: SaveResult) => void;
}

/**
 * Save → publish dialog. A non-empty commit message is required (the button is
 * disabled until then). Shows the pending vault changes so the author sees
 * exactly what gets committed, then runs saveFileAction (write + commit + push
 * to the development branch) and reports the result up.
 */
export default function CommitDialog({ open, onClose, topicId, filename, content, onSaved }: Props) {
  const [message, setMessage] = useState("");
  const [pendingFiles, setPendingFiles] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    setMessage(`Update ${filename}`);
    setError(null);
    setPendingFiles(null);
    const controller = new AbortController();
    fetch("/api/vault/status", { signal: controller.signal })
      .then((r) => r.json())
      .then((d: { files?: string[] }) => setPendingFiles(d.files ?? []))
      .catch(() => setPendingFiles([]));
    return () => controller.abort();
  }, [open, filename]);

  const canSave = message.trim().length > 0 && !saving;

  const submit = () => {
    if (!canSave) return;
    setError(null);
    startTransition(async () => {
      const result = await saveFileAction(topicId, filename, content, message);
      if (result.ok) {
        onSaved({
          sha: result.sha,
          branch: result.branch,
          pushed: result.pushed,
          pushError: result.pushError,
        });
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Save & publish" size="lg">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <label
          htmlFor="commit-message"
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Commit message
        </label>
        <input
          id="commit-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Describe your change"
          autoComplete="off"
          autoFocus
          className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
        />
        <p className="mt-1.5 text-xs text-neutral-400 dark:text-neutral-500">
          Commits all pending vault changes and pushes them to the{" "}
          <code className="font-mono">development</code> branch.
        </p>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Pending changes
          </p>
          <div className="mt-1.5 max-h-32 overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-800 dark:bg-neutral-950/50">
            {pendingFiles === null ? (
              <p className="px-1 py-0.5 text-xs text-neutral-400">Checking…</p>
            ) : pendingFiles.length === 0 ? (
              <p className="px-1 py-0.5 text-xs text-neutral-400">
                No other pending changes — only this file.
              </p>
            ) : (
              <ul className="space-y-0.5">
                {pendingFiles.map((file) => (
                  <li key={file} className="truncate px-1 py-0.5 font-mono text-xs text-neutral-600 dark:text-neutral-300">
                    {file}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSave}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save & publish"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
