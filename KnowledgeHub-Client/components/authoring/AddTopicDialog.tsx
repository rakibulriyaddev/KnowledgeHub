"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { slugify } from "@/lib/slug";
import { createTopicAction } from "@/app/actions/authoring";

type AvailState = "idle" | "checking" | "available" | "taken" | "invalid";

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Phase 1 dialog: type a topic name, see a live availability check (debounced,
 * GitHub-repo style), and create. On success it navigates to the new topic.
 * Creation is a temporary local write — nothing is committed until Save.
 */
export default function AddTopicDialog({ open, onClose }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [state, setState] = useState<AvailState>("idle");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset + focus whenever the dialog opens.
  useEffect(() => {
    if (!open) return;
    setName("");
    setState("idle");
    setSlug("");
    setError(null);
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [open]);

  // Debounced availability check against the route handler.
  useEffect(() => {
    const trimmed = name.trim();
    const derived = slugify(name);
    setSlug(derived);
    if (!trimmed) {
      setState("idle");
      return;
    }
    if (!derived) {
      setState("invalid");
      return;
    }
    setState("checking");
    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/topics/check?name=${encodeURIComponent(name)}`, {
          signal: controller.signal,
        });
        const data: { slug?: string; available?: boolean; reason?: string } = await res.json();
        setSlug(data.slug ?? derived);
        setState(data.available ? "available" : data.reason === "taken" ? "taken" : "invalid");
      } catch {
        if (!controller.signal.aborted) setState("idle");
      }
    }, 300);
    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, [name]);

  const canCreate = state === "available" && !pending;

  const submit = () => {
    if (!canCreate) return;
    setError(null);
    startTransition(async () => {
      const result = await createTopicAction(name);
      if (result.ok) {
        onClose();
        router.push(`/topic/${result.slug}`);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Add knowledge">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <label
          htmlFor="topic-name"
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Topic name
        </label>
        <input
          id="topic-name"
          ref={inputRef}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. TypeScript Generics"
          autoComplete="off"
          className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
        />

        <div className="mt-2 min-h-[1.25rem] text-xs">
          <Hint state={state} slug={slug} />
        </div>

        {error && (
          <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
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
            disabled={!canCreate}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Creating…" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Hint({ state, slug }: { state: AvailState; slug: string }) {
  switch (state) {
    case "idle":
      return (
        <span className="text-neutral-400 dark:text-neutral-500">
          A lowercase, hyphenated id is generated from the name.
        </span>
      );
    case "checking":
      return <span className="text-neutral-500 dark:text-neutral-400">Checking “{slug}”…</span>;
    case "available":
      return <span className="font-medium text-green-600 dark:text-green-400">✓ Available</span>;
    case "taken":
      return (
        <span className="font-medium text-red-600 dark:text-red-400">
          ✗ “{slug}” already exists
        </span>
      );
    case "invalid":
      return (
        <span className="font-medium text-red-600 dark:text-red-400">
          Enter a name with letters or numbers
        </span>
      );
  }
}
