"use client";

import { useState } from "react";
import AddTopicDialog from "./AddTopicDialog";

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

/**
 * "Add Knowledge" trigger (Phase 1). Rendered only when authoring is enabled
 * (the server Navbar gates it). `primary` is the desktop pill; `icon` is the
 * compact mobile-bar button — kept out of the mobile dropdown so its dialog
 * isn't unmounted when the dropdown closes.
 */
export default function AddTopicButton({ variant = "primary" }: { variant?: "primary" | "icon" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {variant === "primary" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-500"
        >
          <PlusIcon />
          Add Knowledge
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Add knowledge"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          <PlusIcon />
        </button>
      )}

      <AddTopicDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
