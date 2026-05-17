"use client";

import { useApp } from "@/lib/context/use-app";
import { formatCOP, cn } from "@/lib/utils";
import { X, PauseCircle, PlayCircle, CheckCircle } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  arrived: { label: "Arrived", color: "text-[var(--color-green)]", bg: "bg-[var(--color-green-dim)]" },
  pending: { label: "Pending", color: "text-[var(--color-yellow)]", bg: "bg-[var(--color-yellow-dim)]" },
  snoozed: { label: "Snoozed", color: "text-muted-foreground", bg: "bg-muted" },
  cancelled: { label: "Cancelled", color: "text-[var(--color-red)]", bg: "bg-[var(--color-red-dim)]" },
};

export function RecurringSection() {
  const { recurring, deleteRecurring, refreshData } = useApp();

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
                {status === "pending" && monthData && (
                  <>
                    <button
                      onClick={async () => {
                        await fetch(`/api/recurring/${monthData.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: "arrived" }),
                        });
                        await refreshData();
                      }}
                      className="text-muted-foreground hover:text-[var(--color-green)] p-1"
                      title="Mark arrived"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={async () => {
                        await fetch(`/api/recurring/${monthData.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: "snoozed" }),
                        });
                        await refreshData();
                      }}
                      className="text-muted-foreground hover:text-foreground p-1"
                      title="Snooze"
                    >
                      <PauseCircle className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
                {status === "snoozed" && monthData && (
                  <button
                    onClick={async () => {
                      await fetch(`/api/recurring/${monthData.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "pending" }),
                      });
                      await refreshData();
                    }}
                    className="text-muted-foreground hover:text-[var(--color-yellow)] p-1"
                    title="Reactivate"
                  >
                    <PlayCircle className="h-3.5 w-3.5" />
                  </button>
                )}
                {monthData && (
                  <button
                    onClick={() => deleteRecurring(monthData.id)}
                    className="text-muted-foreground hover:text-[var(--color-red)] p-1"
                    title="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
