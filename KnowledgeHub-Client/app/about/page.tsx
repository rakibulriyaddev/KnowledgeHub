import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold tracking-tight">About</h1>
      <p className="mt-3 text-neutral-500 dark:text-neutral-400">
        KnowledgeHub is a web client that renders and navigates the KnowledgeVault
        — a folder of Markdown notes linked by frontmatter.
      </p>
    </div>
  );
}
