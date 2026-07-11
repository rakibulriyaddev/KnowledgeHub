"use client";

import { useState, type ReactNode } from "react";
import RightSidebar from "./RightSidebar";

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
}

/**
 * Client island that toggles between pre-rendered panels. All panels are
 * server-rendered and passed in, so switching is instant.
 */
export default function TopicView({ panels }: TopicViewProps) {
  const [active, setActive] = useState(() => panels[0]?.name || "_index.md");

  const activePanel = panels.find((panel) => panel.name === active) ?? panels[0];
  const hasExtras = panels.length > 1;

  return (
    <div className={hasExtras ? "lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-10" : undefined}>
      <div className="min-w-0">
        <article className="prose prose-neutral max-w-none dark:prose-invert prose-pre:bg-transparent prose-pre:p-0 prose-headings:scroll-mt-24">
          {activePanel?.content}
        </article>
      </div>

      {hasExtras && (
        <RightSidebar
          panels={panels.map(({ name, label }) => ({ name, label }))}
          active={active}
          onSelect={setActive}
        />
      )}
    </div>
  );
}
