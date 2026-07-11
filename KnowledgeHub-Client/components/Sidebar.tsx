import TopicCard from "./TopicCard";
import type { SearchIndexEntry } from "@/lib/vault";

export default function Sidebar({ chapters }: { chapters: SearchIndexEntry[] }) {
  return (
    <aside className="space-y-8">
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Chapters
        </h2>
        {chapters.length === 0 ? (
          <p className="text-sm text-neutral-400 dark:text-neutral-500">
            Nothing here yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {chapters.map((entry) => (
              <li key={entry.id}>
                <TopicCard entry={entry} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}
