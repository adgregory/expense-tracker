"use client";

import Link from "next/link";
import { useApp } from "@/lib/context/use-app";
import { formatCOP } from "@/lib/utils";

const colorMap: Record<string, string> = {
  purple: "bg-[var(--color-purple-dim)]",
  blue: "bg-[var(--color-blue-dim)]",
  green: "bg-[var(--color-green-dim)]",
  yellow: "bg-[var(--color-yellow-dim)]",
  red: "bg-[var(--color-red-dim)]",
  orange: "bg-[var(--color-orange-dim)] border border-dashed border-[var(--color-orange)]",
  cyan: "bg-[var(--color-cyan-dim)]",
};

export function RecentExpenses() {
  const { expenses } = useApp();
  const recent = expenses.slice(0, 5);

  const getCategoryInfo = (expense: { category: { icon: string; color: string } | null }) => {
    if (!expense.category) return { icon: "❓", color: "orange" };
    return { icon: expense.category.icon, color: expense.category.color };
  };

  const getTimeAgo = (date: string, time: string): string => {
    const expDate = new Date(`${date}T${time}`);
    const now = new Date();
    const diffMs = now.getTime() - expDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[15px] font-semibold">Recent</h3>
        <Link href="/expenses" className="text-xs text-[var(--color-blue)]">View all</Link>
      </div>
      <div className="space-y-0">
        {recent.map((expense) => {
          const { icon, color } = getCategoryInfo(expense);
          return (
            <div key={expense.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
              <div className={`flex h-[38px] w-[38px] items-center justify-center rounded-[10px] text-base flex-shrink-0 ${colorMap[color]}`}>{icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{expense.merchantName}</p>
                <p className="text-[11px] text-muted-foreground">{expense.category ? expense.category.name : "Uncategorized"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">-{formatCOP(expense.amount)}</p>
                <p className="text-[10px] text-muted-foreground">{getTimeAgo(expense.date, expense.time)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
