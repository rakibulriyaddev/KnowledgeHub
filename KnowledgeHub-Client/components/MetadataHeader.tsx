import TagChip from "./TagChip";
import { formatDate } from "@/lib/format";
import type { Frontmatter } from "@/lib/vault";

const STATUS_VIEW = {
  draft: { dot: "bg-amber-500", label: "Draft" },
  complete: { dot: "bg-green-500", label: "Complete" },
} as const;

function StatusBadge({ status }: { status: Frontmatter["status"] }) {
  const view = STATUS_VIEW[status];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700 ring-1 ring-inset ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700">
      <span className={`h-1.5 w-1.5 rounded-full ${view.dot}`} aria-hidden="true" />
      {view.label}
    </span>
  );
}

export default function MetadataHeader({ frontmatter }: { frontmatter: Frontmatter }) {
  const created = formatDate(frontmatter.created);
  const modified = formatDate(frontmatter.modified);

  return (
    <header className="mb-6 border-b border-neutral-200 pb-6 dark:border-neutral-800">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {frontmatter.title}
        </h1>
        <StatusBadge status={frontmatter.status} />
      </div>

      {frontmatter.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {frontmatter.tags.map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </div>
      )}

      {(created || modified) && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
          {created && <span>Created {created}</span>}
          {modified && <span>Updated {modified}</span>}
        </div>
      )}
    </header>
  );
}
