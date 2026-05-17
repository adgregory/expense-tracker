"use client";

import { useApp } from "@/lib/context/use-app";
import { formatCompactCOP } from "@/lib/utils";

export function QuickStats() {
  const { expenses, budget } = useApp();

  if (!budget) return null;

  const totalIncome = budget.incomes.reduce((sum, i) => sum + i.amount, 0);
  const txCount = expenses.length;
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const daysWithExpenses = new Set(expenses.map((e) => e.date)).size;
  const avgPerDay = daysWithExpenses > 0 ? Math.round(totalSpent / daysWithExpenses) : 0;

  const stats = [
    { value: String(txCount), label: "Transactions" },
    { value: formatCompactCOP(totalIncome), label: "Income", green: true },
    { value: formatCompactCOP(avgPerDay), label: "Avg/day" },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-border bg-card p-3.5 text-center">
          <p className={`text-base font-bold ${stat.green ? "text-[var(--color-green)]" : ""}`}>{stat.value}</p>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
