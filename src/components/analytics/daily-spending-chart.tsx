"use client";

import { useApp } from "@/lib/context/use-app";
import { formatCompactCOP, getDaysRemainingInMonth } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip } from "recharts";

export function DailySpendingChart() {
  const { budget, expenses } = useApp();

  if (!budget) return null;

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget.spendingLimit - totalSpent;
  const daysLeft = getDaysRemainingInMonth();
  const dailyLimit = daysLeft > 0 ? Math.round(remaining / daysLeft) : 0;

  const dailyMap = new Map<string, number>();
  expenses.forEach(e => dailyMap.set(e.date, (dailyMap.get(e.date) || 0) + e.amount));
  const dailySpending = Array.from(dailyMap.entries())
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const avgSpending = dailySpending.length > 0 ? Math.round(dailySpending.reduce((sum, d) => sum + d.amount, 0) / dailySpending.length) : 0;

  const data = dailySpending.map((d) => ({ ...d, label: d.date.split("-")[2] }));

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h4 className="text-[13px] font-semibold mb-0.5">Daily Spending</h4>
      <p className="text-[11px] text-muted-foreground mb-3">Avg {formatCompactCOP(avgSpending)}/day · Limit {formatCompactCOP(dailyLimit)}/day</p>
      <div className="h-[100px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00e68a" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#00e68a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#55556a" }} interval={3} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: "8px", fontSize: "11px" }} formatter={(value) => [formatCompactCOP(Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0)), "Spent"]} labelFormatter={(label) => `Day ${label}`} />
            <ReferenceLine y={dailyLimit} stroke="#ff4d6a" strokeDasharray="4 4" strokeOpacity={0.6} />
            <Area type="monotone" dataKey="amount" stroke="#00e68a" strokeWidth={2} fill="url(#areaGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
