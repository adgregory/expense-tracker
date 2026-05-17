"use client";

import { useApp } from "@/lib/context/use-app";
import { formatCOP, getDaysRemainingInMonth } from "@/lib/utils";

export function BudgetRing() {
  const { expenses, budget } = useApp();

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget.spendingLimit - totalSpent;
  const percentage = Math.max(0, Math.min(100, (remaining / budget.spendingLimit) * 100));
  const daysLeft = getDaysRemainingInMonth();
  const perDay = daysLeft > 0 ? Math.round(remaining / daysLeft) : 0;

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  return (
    <div className="relative rounded-2xl border border-border bg-card p-6 overflow-hidden">
      <div className="absolute -top-1/2 -right-1/4 w-[200px] h-[200px] bg-[radial-gradient(circle,var(--color-green-dim)_0%,transparent_70%)] pointer-events-none" />
      <div className="flex items-center gap-6 relative">
        <div className="relative w-[120px] h-[120px] flex-shrink-0">
          <svg className="w-[120px] h-[120px] -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-green)" strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="drop-shadow-[0_0_6px_rgba(0,230,138,0.4)] transition-all duration-700" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold">{Math.round(percentage)}%</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">remaining</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Available</p>
          <p className="text-2xl font-bold tracking-tight mb-3">{formatCOP(Math.max(0, remaining))}</p>
          <div className="flex gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--color-red)]">{formatCOP(totalSpent)}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Spent</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-green)]">{formatCOP(Math.max(0, perDay))}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Per day</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
