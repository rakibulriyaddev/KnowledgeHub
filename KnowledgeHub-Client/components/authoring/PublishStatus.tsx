"use client";

import type { SaveResult } from "./CommitDialog";

/**
 * Post-Save confirmation toast. Save commits the pending vault changes and
 * pushes them to the publish branch; this just confirms the outcome (no deploy
 * polling). Fixed, dismissable, non-blocking — the author keeps working.
 */
export default function PublishStatus({
  result,
  onDismiss,
}: {
  result: SaveResult;
  onDismiss: () => void;
}) {
  const { sha, branch, pushed, pushError } = result;
  const shortSha = sha.slice(0, 7);

  const view = pushed
    ? {
        dot: "bg-green-500",
        title: "Published",
        detail: `Pushed to ${branch}`,
      }
    : {
        dot: "bg-amber-500",
        title: "Committed locally — push failed",
        detail: pushError || `Push to ${branch} manually`,
      };

  return (
    <div className="fixed bottom-4 right-4 z-40 w-[20rem] max-w-[calc(100vw-2rem)] rounded-xl border border-neutral-200 bg-white p-3 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start gap-3">
        <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${view.dot}`} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-neutral-900 dark:text-white">{view.title}</p>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            {view.detail} · <code className="font-mono">{shortSha}</code>
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="-mr-1 -mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
