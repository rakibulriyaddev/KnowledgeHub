"use client";

import { useState, type ReactNode } from "react";
import RightSidebar from "./RightSidebar";

export interface TopicPanel {
  name: string;
  label: string;
  /** Server-rendered markdown for this file (resolved at build time). */
  content: ReactNode;
}

/**
 * Client island that toggles between pre-rendered panels (the `_index.md` body
 * and each sibling file). All panels are rendered server-side and passed in, so
 * switching is instant — no reload, no network.
 */
export default function TopicView({ panels }: { panels: TopicPanel[] }) {
  const [active, setActive] = useState(panels[0]?.name ?? "_index.md");
  const activePanel = panels.find((panel) => panel.name === active) ?? panels[0];
  const hasExtras = panels.length > 1;

  return (
    <div
      className={
        hasExtras ? "lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-10" : undefined
      }
    >
      <article className="prose prose-neutral max-w-none dark:prose-invert prose-pre:bg-transparent prose-pre:p-0 prose-headings:scroll-mt-24">
        {activePanel?.content}
      </article>

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
