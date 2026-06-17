"use client";

export interface PanelMeta {
  name: string;
  label: string;
}

interface RightSidebarProps {
  panels: PanelMeta[];
  active: string;
  onSelect: (name: string) => void;
}

export default function RightSidebar({ panels, active, onSelect }: RightSidebarProps) {
  return (
    <aside className="mt-10 lg:mt-0">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        Also in this topic
      </h2>
      <ul className="space-y-1">
        {panels.map((panel) => {
          const isActive = panel.name === active;
          return (
            <li key={panel.name}>
              <button
                type="button"
                aria-current={isActive ? "true" : undefined}
                onClick={() => onSelect(panel.name)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  isActive
                    ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                    : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                }`}
              >
                {panel.label}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
