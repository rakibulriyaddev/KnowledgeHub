"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { toMarkdownFilename } from "@/lib/slug";
import { createFileAction } from "@/app/actions/authoring";

/**
 * Phase 2: add a new markdown file to the current topic. On success it refreshes
 * the server data and asks the parent to make the new file active (kept
 * client-side so the topic page stays statically rendered). The file is a
 * temporary local write — committed only on Save.
 */
export default function AddFileButton({
  topicId,
  onCreated,
}: {
  topicId: string;
  onCreated?: (filename: string) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (open) {
      setName("");
      setError(null);
    }
  }, [open]);

  const filename = toMarkdownFilename(name);

  const submit = () => {
    if (!filename || pending) return;
    setError(null);
    startTransition(async () => {
      const result = await createFileAction(topicId, name);
      if (result.ok) {
        setOpen(false);
        onCreated?.(result.filename);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
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
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add file
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Add a file to this topic">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <label
            htmlFor="file-name"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            File name
          </label>
          <input
            id="file-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Examples, Q&A, Resources"
            autoComplete="off"
            autoFocus
            className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          />
          <div className="mt-2 min-h-[1.25rem] text-xs">
            {filename ? (
              <span className="text-neutral-500 dark:text-neutral-400">
                Creates <code className="font-mono">{filename}</code>
              </span>
            ) : (
              <span className="text-neutral-400 dark:text-neutral-500">
                A <code className="font-mono">.md</code> file name is generated from this.
              </span>
            )}
          </div>

          {error && (
            <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          )}

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!filename || pending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "Creating…" : "Create file"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
