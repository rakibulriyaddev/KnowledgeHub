import Link from "next/link";
import MobileDrawer from "./MobileDrawer";

export interface TreeRef {
  id: string;
  title: string;
}

export interface TopicTree {
  parent: TreeRef | null;
  current: TreeRef;
  children: TreeRef[];
}

const sectionLabel =
  "mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500";
const linkClass =
  "block rounded-lg px-3 py-1.5 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white";

function TreeNav({ tree }: { tree: TopicTree }) {
  return (
    <nav className="text-sm">
      {tree.parent && (
        <div className="mb-4">
          <p className={sectionLabel}>Parent</p>
          <Link href={`/topic/${tree.parent.id}`} className={linkClass}>
            ↑ {tree.parent.title}
          </Link>
        </div>
      )}

      <div className="mb-4">
        <p className={sectionLabel}>Current</p>
        <span className="block rounded-lg bg-blue-50 px-3 py-1.5 font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
          {tree.current.title}
        </span>
      </div>

      {tree.children.length > 0 && (
        <div>
          <p className={sectionLabel}>Children</p>
          <ul className="space-y-0.5">
            {tree.children.map((child) => (
              <li key={child.id}>
                <Link href={`/topic/${child.id}`} className={linkClass}>
                  ↳ {child.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default function TopicSidebar({ tree }: { tree: TopicTree }) {
  return (
    <>
      <div className="mb-6 lg:hidden">
        <MobileDrawer triggerLabel="Browse topics" title="Navigation">
          <TreeNav tree={tree} />
        </MobileDrawer>
      </div>
      <aside className="hidden lg:block">
        <div className="sticky top-20">
          <TreeNav tree={tree} />
        </div>
      </aside>
    </>
  );
}
