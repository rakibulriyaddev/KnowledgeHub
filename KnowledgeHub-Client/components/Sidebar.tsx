import TopicCard from "./TopicCard";
import type { SearchIndexEntry } from "@/lib/vault";

function RecentList({
  title,
  entries,
  dateKey,
}: {
  title: string;
  entries: SearchIndexEntry[];
  dateKey: "created" | "modified";
}) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        {title}
      </h2>
      {entries.length === 0 ? (
        <p className="text-sm text-neutral-400 dark:text-neutral-500">
          Nothing here yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id}>
              <TopicCard entry={entry} date={entry[dateKey]} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function Sidebar({
  recentlyAdded,
  recentlyUpdated,
}: {
  recentlyAdded: SearchIndexEntry[];
  recentlyUpdated: SearchIndexEntry[];
}) {
  return (
    <aside className="space-y-8">
      <RecentList title="Recently Added" entries={recentlyAdded} dateKey="created" />
      <RecentList
        title="Recently Updated"
        entries={recentlyUpdated}
        dateKey="modified"
      />
    </aside>
  );
}
