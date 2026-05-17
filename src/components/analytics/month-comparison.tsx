"use client";

import { useApp } from "@/lib/context/use-app";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { formatCompactCOP } from "@/lib/utils";

const previousMonthByCategory: Record<string, number> = {
  delivery: 270000,
  transportation: 210000,
  groceries: 450000,
  flights: 0,
  subscriptions: 160000,
};

export function MonthComparison() {
  const { expenses, categories } = useApp();

  const data = categories
    .map((cat) => {
      const current = expenses.filter((e) => e.category === cat.id).reduce((sum, e) => sum + e.amount, 0);
      const previous = previousMonthByCategory[cat.id] || 0;
      if (current === 0 && previous === 0) return null;
      return { name: cat.icon, current, previous };
    })
    .filter(Boolean) as { name: string; current: number; previous: number }[];

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h4 className="text-[13px] font-semibold mb-0.5">vs Last Month</h4>
      <p className="text-[11px] text-muted-foreground mb-3">Green = this month · Gray = April</p>
      <div className="h-[100px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 14 }} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: "8px", fontSize: "11px" }} formatter={(value: number) => formatCompactCOP(value)} />
            <Bar dataKey="previous" fill="#2a2a3e" radius={[3, 3, 0, 0]} />
            <Bar dataKey="current" fill="#00e68a" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
