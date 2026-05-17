"use client";

import { dailySpending } from "@/lib/mock-data";

export function WeeklyChart() {
  const last7 = dailySpending.slice(-7);
  const maxAmount = Math.max(...last7.map((d) => d.amount), 1);
  const dayLabels = ["L", "M", "M", "J", "V", "S", "D"];

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[15px] font-semibold">This Week</h3>
        <span className="text-xs text-[var(--color-blue)]">Details</span>
      </div>
      <div className="flex items-end gap-1.5 h-[60px]">
        {last7.map((day, i) => {
          const height = day.amount > 0 ? Math.max(8, (day.amount / maxAmount) * 100) : 4;
          const isToday = i === last7.length - 1;
          return (
            <div
              key={day.date}
              className={`flex-1 rounded-t transition-all ${
                isToday
                  ? "bg-gradient-to-t from-[var(--color-green)] to-[var(--color-green)]/50 shadow-[0_0_8px_var(--color-green-dim)]"
                  : "bg-border"
              }`}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
      <div className="flex gap-1.5 mt-1.5">
        {dayLabels.map((label, i) => (
          <span key={i} className="flex-1 text-center text-[9px] text-muted-foreground">{label}</span>
        ))}
      </div>
    </div>
  );
}
