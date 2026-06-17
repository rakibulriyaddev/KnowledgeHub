"use client";

import type { SearchIndexEntry } from "@/lib/search";

interface SearchDropdownProps {
  results: SearchIndexEntry[];
  activeIndex: number;
  query: string;
  onSelect: (id: string) => void;
  onHover: (index: number) => void;
}

export default function SearchDropdown({
  results,
  activeIndex,
  query,
  onSelect,
  onHover,
}: SearchDropdownProps) {
  return (
    <div
      className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
      role="listbox"
    >
      {results.length === 0 ? (
        <p className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">
          No topics match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <ul className="max-h-80 overflow-y-auto py-1">
          {results.map((entry, index) => (
            <li key={entry.id}>
              <button
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                onMouseEnter={() => onHover(index)}
                // onMouseDown (not onClick) so selection fires before the input blur closes us.
                onMouseDown={(event) => {
                  event.preventDefault();
                  onSelect(entry.id);
                }}
                className={`flex w-full flex-col items-start gap-1 px-4 py-2.5 text-left transition-colors ${
                  index === activeIndex
                    ? "bg-blue-50 dark:bg-blue-950/40"
                    : "hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                }`}
              >
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {entry.title}
                </span>
                {entry.tags.length > 0 && (
                  <span className="flex flex-wrap gap-1">
                    {entry.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
