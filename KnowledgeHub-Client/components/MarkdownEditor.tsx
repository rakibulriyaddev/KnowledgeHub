"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CommitDialog, { type SaveResult } from "./authoring/CommitDialog";

interface Props {
  topicId: string;
  filename: string;
  initialContent: string;
  onCancel: () => void;
  onSaved: (result: SaveResult) => void;
  onDirtyChange?: (dirty: boolean) => void;
}

/** Strip a leading YAML frontmatter block for the preview (it isn't rendered). */
function stripFrontmatter(source: string): string {
  return source.replace(/^﻿?---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}

/**
 * Phase 2 editor: a raw-markdown textarea beside a live preview. The preview
 * uses client-side react-markdown + remark-gfm (instant; code blocks are
 * plain). The published page keeps the full server-side Shiki render. "Save…"
 * opens the commit dialog.
 */
export default function MarkdownEditor({
  topicId,
  filename,
  initialContent,
  onCancel,
  onSaved,
  onDirtyChange,
}: Props) {
  const [content, setContent] = useState(initialContent);
  const [commitOpen, setCommitOpen] = useState(false);
  const dirty = content !== initialContent;

  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-3 dark:border-neutral-800">
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          Editing <code className="font-mono text-neutral-700 dark:text-neutral-200">{filename}</code>
          {dirty && <span className="ml-1 text-amber-500" title="Unsaved changes">●</span>}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setCommitOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-500"
          >
            Save…
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Markdown
          </p>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            spellCheck={false}
            className="h-[60vh] w-full resize-y rounded-lg border border-neutral-300 bg-white p-3 font-mono text-sm leading-relaxed text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          />
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Preview
          </p>
          <div className="h-[60vh] overflow-y-auto rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <article className="prose prose-neutral max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{stripFrontmatter(content)}</ReactMarkdown>
            </article>
          </div>
        </div>
      </div>

      <CommitDialog
        open={commitOpen}
        onClose={() => setCommitOpen(false)}
        topicId={topicId}
        filename={filename}
        content={content}
        onSaved={onSaved}
      />
    </div>
  );
}
