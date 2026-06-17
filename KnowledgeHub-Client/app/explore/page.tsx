import type { Metadata } from "next";

export const metadata: Metadata = { title: "Explore" };

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Explore</h1>
      <p className="mt-3 text-neutral-500 dark:text-neutral-400">
        Browse-by-tag and topic discovery are coming soon. For now, use search or
        the recent lists on the home page.
      </p>
    </div>
  );
}
