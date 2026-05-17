"use client";

import { Expense, Category } from "@/lib/types";
import { formatCOP } from "@/lib/utils";

interface ExpenseItemProps {
  expense: Expense;
  categories: Category[];
  onCategorize?: (expense: Expense) => void;
}

const colorMap: Record<string, string> = {
  purple: "bg-[var(--color-purple-dim)]",
  blue: "bg-[var(--color-blue-dim)]",
  green: "bg-[var(--color-green-dim)]",
  yellow: "bg-[var(--color-yellow-dim)]",
  red: "bg-[var(--color-red-dim)]",
  orange: "bg-[var(--color-orange-dim)] border border-dashed border-[var(--color-orange)]",
  cyan: "bg-[var(--color-cyan-dim)]",
};

export function ExpenseItem({ expense, categories, onCategorize }: ExpenseItemProps) {
  const cat = categories.find((c) => c.id === expense.category);
  const icon = cat ? cat.icon : "❓";
  const color = cat ? cat.color : "orange";
  const isUncategorized = !expense.category;

  return (
    <div
      className={`flex items-center gap-3 py-3.5 border-b border-border/50 last:border-0 ${isUncategorized ? "cursor-pointer" : ""}`}
      onClick={() => isUncategorized && onCategorize?.(expense)}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-[10px] text-lg flex-shrink-0 ${colorMap[color]}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{expense.merchantName}</p>
        {isUncategorized ? (
          <span className="inline-block text-[9px] font-semibold uppercase bg-[var(--color-orange-dim)] text-[var(--color-orange)] px-1.5 py-0.5 rounded mt-0.5">Needs category</span>
        ) : (
          <p className="text-[11px] text-muted-foreground mt-0.5">{cat?.name}</p>
        )}
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold">-{formatCOP(expense.amount)}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{expense.time}</p>
      </div>
    </div>
  );
}
