import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getNode,
  getTopicView,
  listTopicFolders,
} from "@/lib/vault";
import { getSearchIndex } from "@/lib/search-index";
import { isAuthoringEnabled } from "@/lib/authoring";
import MarkdownViewer from "@/components/MarkdownViewer";
import MetadataHeader from "@/components/MetadataHeader";
import TopicView, { type TopicPanel } from "@/components/TopicView";
import TopicSidebar, { type TopicTree, type TreeRef } from "@/components/TopicSidebar";

type TopicParams = { params: Promise<{ id: string }> };

// Pure SSG: only vault folders known at build time exist; anything else 404s.
// Must be a static literal (Turbopack parses it at compile time). A topic
// created during `next dev` is still reachable immediately because dev re-runs
// generateStaticParams on navigation, so the new folder is in the known set.
export const dynamicParams = false;

export async function generateStaticParams() {
  const folders = await listTopicFolders();
  return folders.map((id) => ({ id }));
}

export async function generateMetadata({ params }: TopicParams): Promise<Metadata> {
  const { id } = await params;
  const node = await getNode(id);
  if (!node) return { title: "Topic not found" };
  return {
    title: node.frontmatter.title,
    description: `${node.frontmatter.title} — KnowledgeVault`,
  };
}

export default async function TopicPage({ params }: TopicParams) {
  const { id } = await params;
  const view = await getTopicView(id);
  if (!view) notFound();

  const { node, panels } = view;

  // Resolve parent/children titles from the index, dropping any dangling refs.
  const index = await getSearchIndex();
  const titleById = new Map(index.map((entry) => [entry.id, entry.title]));

  const parent: TreeRef | null =
    node.frontmatter.parent && titleById.has(node.frontmatter.parent)
      ? { id: node.frontmatter.parent, title: titleById.get(node.frontmatter.parent)! }
      : null;

  const children: TreeRef[] = node.frontmatter.children
    .filter((childId) => titleById.has(childId))
    .map((childId) => ({ id: childId, title: titleById.get(childId)! }));

  const tree: TopicTree = {
    parent,
    current: { id: node.id, title: node.frontmatter.title },
    children,
  };

  // Render every panel server-side (Shiki runs at build); the client island
  // just toggles which is visible. `source` carries the raw file for editing.
  const renderedPanels: TopicPanel[] = panels.map((panel) => ({
    name: panel.name,
    label: panel.label,
    content: <MarkdownViewer>{panel.body}</MarkdownViewer>,
    source: panel.raw,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
      <TopicSidebar tree={tree} />
      <div className="min-w-0">
        <MetadataHeader frontmatter={node.frontmatter} />
        <TopicView
          panels={renderedPanels}
          topicId={node.id}
          editable={isAuthoringEnabled()}
        />
      </div>
    </div>
  );
}
