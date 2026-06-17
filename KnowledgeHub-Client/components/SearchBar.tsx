"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { createFuse, MAX_RESULTS, type SearchIndexEntry } from "@/lib/search";
import SearchDropdown from "./SearchDropdown";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [entries, setEntries] = useState<SearchIndexEntry[] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy-load the static index on first focus, then build Fuse once.
  const loadIndex = useCallback(async () => {
    if (entries !== null) return;
    try {
      const res = await fetch("/search-index.json");
      const data: unknown = await res.json();
      setEntries(Array.isArray(data) ? (data as SearchIndexEntry[]) : []);
    } catch {
      setEntries([]);
    }
  }, [entries]);

  const fuse = useMemo(() => (entries ? createFuse(entries) : null), [entries]);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed || !fuse) return [];
    return fuse.search(trimmed, { limit: MAX_RESULTS }).map((result) => result.item);
  }, [query, fuse]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Close on outside click.
  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      setOpen(false);
      setQuery("");
      router.push(`/topic/${id}`);
    },
    [router],
  );

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (results.length === 0) {
      if (event.key === "ArrowDown") setOpen(true);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      const entry = results[activeIndex];
      if (entry) {
        event.preventDefault();
        handleSelect(entry.id);
      }
    }
  };

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <span
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <input
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          void loadIndex();
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        placeholder="Search topics or tags..."
        aria-label="Search topics or tags"
        role="combobox"
        aria-expanded={showDropdown}
        aria-autocomplete="list"
        autoComplete="off"
        className="w-full rounded-xl border border-neutral-300 bg-white py-3 pl-11 pr-4 text-base text-neutral-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500"
      />
      {showDropdown && (
        <SearchDropdown
          results={results}
          activeIndex={activeIndex}
          query={query.trim()}
          onSelect={handleSelect}
          onHover={setActiveIndex}
        />
      )}
    </div>
  );
}
