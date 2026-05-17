"use client";

import { useApp } from "@/lib/context/use-app";
import { formatCOP } from "@/lib/utils";

export function BudgetSummary() {
  const { budget } = useApp();

  if (!budget) return null;

  const totalIncome = budget.incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalObligations = budget.obligations.reduce((sum, o) => sum + o.amount, 0);
  const savingsTarget = totalIncome - totalObligations - budget.spendingLimit;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex justify-between py-1.5 text-[13px]">
        <span className="text-muted-foreground">Total Income</span>
        <span className="font-semibold text-[var(--color-green)]">{formatCOP(totalIncome)}</span>
      </div>
      <div className="flex justify-between py-1.5 text-[13px]">
        <span className="text-muted-foreground">Obligations</span>
        <span className="font-semibold text-[var(--color-red)]">-{formatCOP(totalObligations)}</span>
      </div>
      <div className="flex justify-between py-1.5 text-[13px]">
        <span className="text-muted-foreground">Spending Limit</span>
        <span className="font-semibold">{formatCOP(budget.spendingLimit)}</span>
      </div>
      <div className="flex justify-between pt-3 mt-2 border-t border-border">
        <span className="text-muted-foreground text-[13px]">Savings Target</span>
        <span className={`text-[15px] font-bold ${savingsTarget >= 0 ? "text-[var(--color-green)]" : "text-[var(--color-red)]"}`}>{formatCOP(savingsTarget)}</span>
      </div>
    </div>
  );
}
