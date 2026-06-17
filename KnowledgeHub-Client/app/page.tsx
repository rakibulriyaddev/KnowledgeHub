import {
  getSearchIndex,
  getRecentlyAdded,
  getRecentlyUpdated,
} from "@/lib/search-index";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";

export default async function HomePage() {
  const index = await getSearchIndex();
  const recentlyAdded = getRecentlyAdded(index);
  const recentlyUpdated = getRecentlyUpdated(index);
  const isEmpty = index.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-12 text-center sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Your knowledge, organized.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-neutral-500 dark:text-neutral-400">
          Search and navigate the KnowledgeVault — interconnected notes, Q&amp;A,
          and resources.
        </p>
        <div className="mx-auto mt-8 max-w-xl">
          <SearchBar />
        </div>
      </section>

      <div className="grid gap-8 pb-20 md:grid-cols-[18rem_1fr]">
        <Sidebar recentlyAdded={recentlyAdded} recentlyUpdated={recentlyUpdated} />

        <section className="rounded-xl border border-dashed border-neutral-300 p-8 dark:border-neutral-700">
          <h2 className="text-lg font-semibold">Welcome to KnowledgeHub</h2>
          {isEmpty ? (
            <p className="mt-2 max-w-prose text-sm text-neutral-500 dark:text-neutral-400">
              Your vault is empty. Add topic folders (each with an{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5 dark:bg-neutral-800">
                _index.md
              </code>
              ) to{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5 dark:bg-neutral-800">
                ../KnowledgeVault
              </code>{" "}
              and rebuild to see them here.
            </p>
          ) : (
            <p className="mt-2 max-w-prose text-sm text-neutral-500 dark:text-neutral-400">
              Use the search bar above to jump to any topic by title or tag, or
              pick up where you left off from the recent lists. This space is
              reserved for curated highlights and featured topics in a future
              update.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
