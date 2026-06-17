import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
        404
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">Topic not found</h1>
      <p className="mt-3 text-neutral-500 dark:text-neutral-400">
        We couldn&rsquo;t find that page in the vault. It may have been moved or
        never existed.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Back to home
      </Link>
    </div>
  );
}
