"use client";

import { TimeRange } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TimeRangeTabsProps {
  selected: TimeRange;
  onSelect: (range: TimeRange) => void;
}

const tabs: { value: TimeRange; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "3months", label: "3 Mo" },
  { value: "year", label: "Year" },
];

export function TimeRangeTabs({ selected, onSelect }: TimeRangeTabsProps) {
  return (
    <div className="flex rounded-xl bg-card p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onSelect(tab.value)}
          className={cn(
            "flex-1 py-2 text-xs rounded-lg transition-colors font-medium",
            selected === tab.value
              ? "bg-[var(--color-green-dim)] text-[var(--color-green)]"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
