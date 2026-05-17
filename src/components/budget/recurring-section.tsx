"use client";

import { useApp } from "@/lib/context/use-app";
import { formatCOP, cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  arrived: { label: "Arrived", color: "text-[var(--color-green)]", bg: "bg-[var(--color-green-dim)]" },
  pending: { label: "Pending", color: "text-[var(--color-yellow)]", bg: "bg-[var(--color-yellow-dim)]" },
  snoozed: { label: "Snoozed", color: "text-muted-foreground", bg: "bg-muted" },
  cancelled: { label: "Cancelled", color: "text-[var(--color-red)]", bg: "bg-[var(--color-red-dim)]" },
};

export function RecurringSection() {
  const { recurring } = useApp();

  if (recurring.length === 0) return null;

  return (
    <div>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2.5">
        Recurring Expenses
      </p>
      <div className="space-y-2">
        {recurring.map((rec) => {
          const monthData = rec.months[0];
          const status = monthData?.status || "pending";
          const config = statusConfig[status];
          const category = rec.merchantMapping.category;

          return (
            <div
              key={rec.id}
              className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{category.icon}</span>
                <div>
                  <p className="text-[13px] font-medium">{rec.label || rec.merchantMapping.pattern}</p>
                  <p className="text-[10px] text-muted-foreground">{category.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {monthData?.expense && (
                  <span className="text-xs font-semibold">
                    {formatCOP(monthData.expense.amount)}
                  </span>
                )}
                <span className={cn("text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full", config.color, config.bg)}>
                  {config.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
