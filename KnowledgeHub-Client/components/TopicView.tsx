"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import RightSidebar from "./RightSidebar";
import MarkdownEditor from "./MarkdownEditor";
import AddFileButton from "./authoring/AddFileButton";
import PublishStatus from "./authoring/PublishStatus";
import type { SaveResult } from "./authoring/CommitDialog";

export interface TopicPanel {
  name: string;
  label: string;
  /** Server-rendered markdown for this file (Shiki). */
  content: ReactNode;
  /** Raw file contents incl. frontmatter — what the editor edits. */
  source: string;
}

interface TopicViewProps {
  panels: TopicPanel[];
  topicId: string;
  editable?: boolean;
}

/**
 * Client island that toggles between pre-rendered panels and, when authoring is
 * enabled, hosts the editor + Add-file action and the post-save deploy tracker.
 * All panels are server-rendered and passed in, so switching is instant.
 */
export default function TopicView({ panels, topicId, editable = false }: TopicViewProps) {
  const router = useRouter();
  const [active, setActive] = useState(() => panels[0]?.name || "_index.md");
  const [editing, setEditing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [publish, setPublish] = useState<SaveResult | null>(null);

  const activePanel = panels.find((panel) => panel.name === active) ?? panels[0];
  const hasExtras = panels.length > 1;

  const selectPanel = (name: string) => {
    if (editing && dirty && !window.confirm("Discard unsaved changes?")) return;
    setEditing(false);
    setDirty(false);
    setActive(name);
  };

  const handleSaved = (result: SaveResult) => {
    setEditing(false);
    setDirty(false);
    setPublish(result);
    router.refresh(); // re-render the panel from the saved file (Shiki)
  };

  // A freshly-created file becomes active; refresh brings its panel into props.
  const handleFileCreated = (filename: string) => {
    setEditing(false);
    setDirty(false);
    setActive(filename);
  };

  const showSidebar = hasExtras && !editing;

  return (
    <>
      <div className={showSidebar ? "lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-10" : undefined}>
        <div className="min-w-0">
          {editable && !editing && (
            <div className="mb-4 flex items-center justify-end gap-2">
              <AddFileButton topicId={topicId} onCreated={handleFileCreated} />
              {activePanel && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                  Edit
                </button>
              )}
            </div>
          )}

          {editing && activePanel ? (
            <MarkdownEditor
              key={activePanel.name}
              topicId={topicId}
              filename={activePanel.name}
              initialContent={activePanel.source}
              onCancel={() => {
                setEditing(false);
                setDirty(false);
              }}
              onSaved={handleSaved}
              onDirtyChange={setDirty}
            />
          ) : (
            <article className="prose prose-neutral max-w-none dark:prose-invert prose-pre:bg-transparent prose-pre:p-0 prose-headings:scroll-mt-24">
              {activePanel?.content}
            </article>
          )}
        </div>

        {showSidebar && (
          <RightSidebar
            panels={panels.map(({ name, label }) => ({ name, label }))}
            active={active}
            onSelect={selectPanel}
          />
        )}
      </div>

      {publish && <PublishStatus result={publish} onDismiss={() => setPublish(null)} />}
    </>
  );
}
