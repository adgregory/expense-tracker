"use client";

import { cn } from "@/lib/utils";
import { useApp } from "@/lib/context/use-app";

interface FilterPillsProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function FilterPills({ selected, onSelect }: FilterPillsProps) {
  const { categories } = useApp();

  const filters = [
    { id: "all", label: "All", icon: "" },
    ...categories.map((c) => ({ id: c.id, label: c.name, icon: c.icon })),
    { id: "uncategorized", label: "Uncategorized", icon: "⚠️" },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onSelect(filter.id)}
          className={cn(
            "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs border transition-colors",
            selected === filter.id
              ? "bg-[var(--color-green-dim)] border-[var(--color-green)] text-[var(--color-green)]"
              : "bg-card border-border text-muted-foreground hover:text-foreground"
          )}
        >
          {filter.icon && <span>{filter.icon}</span>}
          {filter.label}
        </button>
      ))}
    </div>
  );
}
