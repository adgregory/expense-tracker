"use client";

import { useApp } from "@/lib/context/use-app";
import { formatCompactCOP } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS: Record<string, string> = {
  purple: "#a855f7",
  blue: "#4d9fff",
  green: "#00e68a",
  yellow: "#fbbf24",
  red: "#ff4d6a",
  orange: "#f97316",
  cyan: "#22d3ee",
};

export function CategoryDonut() {
  const { expenses, categories } = useApp();
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const data = categories
    .map((cat) => {
      const amount = expenses.filter((e) => e.categoryId === cat.id).reduce((sum, e) => sum + e.amount, 0);
      return { name: cat.name, value: amount, icon: cat.icon, color: COLORS[cat.color] || "#666" };
    })
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const uncategorizedTotal = expenses.filter((e) => !e.category).reduce((sum, e) => sum + e.amount, 0);
  if (uncategorizedTotal > 0) {
    data.push({ name: "Uncategorized", value: uncategorizedTotal, icon: "❓", color: "#f97316" });
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h4 className="text-[13px] font-semibold mb-0.5">Category Breakdown</h4>
      <p className="text-[11px] text-muted-foreground mb-3">{formatCompactCOP(totalSpent)} total</p>
      <div className="flex items-center gap-4">
        <div className="w-[120px] h-[120px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" strokeWidth={0}>
                {data.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-1.5">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-[11px]">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
              <span className="text-muted-foreground">{d.icon} {d.name}</span>
              <span className="ml-auto font-semibold">{formatCompactCOP(d.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
