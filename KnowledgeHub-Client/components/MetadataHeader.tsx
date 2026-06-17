import TagChip from "./TagChip";
import { formatDate } from "@/lib/format";
import type { Frontmatter } from "@/lib/vault";

export default function MetadataHeader({ frontmatter }: { frontmatter: Frontmatter }) {
  const created = formatDate(frontmatter.created);
  const modified = formatDate(frontmatter.modified);

  return (
    <header className="mb-6 border-b border-neutral-200 pb-6 dark:border-neutral-800">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
        {frontmatter.title}
      </h1>

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
