import Link from "next/link";
import TagChip from "./TagChip";
import { formatDate } from "@/lib/format";
import type { SearchIndexEntry } from "@/lib/vault";

export default function TopicCard({
  entry,
  date,
}: {
  entry: SearchIndexEntry;
  date?: string | null;
}) {
  const formatted = formatDate(date);

  return (
    <Link
      href={`/topic/${entry.id}`}
      className="group block rounded-lg border border-neutral-200 p-3 transition-colors hover:border-blue-400 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:border-blue-600 dark:hover:bg-neutral-900"
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-medium text-neutral-900 group-hover:text-blue-700 dark:text-neutral-100 dark:group-hover:text-blue-400">
          {entry.title}
        </span>
        {formatted && (
          <span className="shrink-0 text-xs text-neutral-400 dark:text-neutral-500">
            {formatted}
          </span>
        )}
      </div>
      {entry.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {entry.tags.slice(0, 3).map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </div>
      )}
    </Link>
  );
}
