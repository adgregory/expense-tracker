"use client";

import { useApp } from "@/lib/context/use-app";
import { formatCompactCOP, getDaysRemainingInMonth } from "@/lib/utils";

interface Insight {
  icon: string;
  text: string;
  type: "info" | "positive" | "warning";
}

export function InsightCards() {
  const { expenses, budget } = useApp();
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget.spendingLimit - totalSpent;
  const daysLeft = getDaysRemainingInMonth();

  const insights: Insight[] = [];

  const deliveryTotal = expenses.filter((e) => e.category === "delivery").reduce((sum, e) => sum + e.amount, 0);
  const deliveryCount = expenses.filter((e) => e.category === "delivery").length;
  if (deliveryTotal > 200000) {
    insights.push({ icon: "📈", text: `You've spent ${formatCompactCOP(deliveryTotal)} on delivery across ${deliveryCount} orders this month.`, type: "info" });
  }

  const largestExpense = expenses.reduce((max, e) => (e.amount > max.amount ? e : max), expenses[0]);
  if (largestExpense && largestExpense.amount > 500000) {
    insights.push({ icon: "✈️", text: `${largestExpense.merchantName} added ${formatCompactCOP(largestExpense.amount)} — your largest expense this month.`, type: "warning" });
  }

  if (remaining > 0 && daysLeft > 0) {
    const totalIncome = budget.incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalOb = budget.obligations.reduce((sum, o) => sum + o.amount, 0);
    const projectedSavings = totalIncome - totalOb - totalSpent;
    if (projectedSavings > 0) {
      insights.push({ icon: "💚", text: `You're on track to save ${formatCompactCOP(projectedSavings)} this month if you keep current pace.`, type: "positive" });
    }
  }

  const typeStyles = {
    info: "bg-[var(--color-blue-dim)] border-[var(--color-blue)]/30",
    positive: "bg-[var(--color-green-dim)] border-[var(--color-green)]/30",
    warning: "bg-[var(--color-yellow-dim)] border-[var(--color-yellow)]/30",
  };

  return (
    <div>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2.5">Insights</p>
      <div className="space-y-2">
        {insights.map((insight, i) => (
          <div key={i} className={`flex items-start gap-2.5 rounded-xl border p-3 ${typeStyles[insight.type]}`}>
            <span className="text-base flex-shrink-0 mt-0.5">{insight.icon}</span>
            <p className="text-xs leading-relaxed">{insight.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
