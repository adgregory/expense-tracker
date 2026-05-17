"use client";

import { useApp } from "@/lib/context/use-app";
import { SpendingLimitCard } from "@/components/budget/spending-limit-card";
import { IncomeSection } from "@/components/budget/income-section";
import { ObligationsSection } from "@/components/budget/obligations-section";
import { BudgetSummary } from "@/components/budget/budget-summary";

export default function BudgetPage() {
  const { loading } = useApp();

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Loading...</p></div>;

  return (
    <div className="px-5 py-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[22px] font-bold tracking-tight">Budget</h1>
        <span className="text-xs text-[var(--color-green)] font-semibold">✓ Active</span>
      </div>
      <div className="flex items-center justify-center gap-4 pb-5">
        <button className="flex h-7 w-7 items-center justify-center rounded-full bg-card border border-border text-xs text-muted-foreground">←</button>
        <span className="text-base font-semibold">Mayo 2026</span>
        <button className="flex h-7 w-7 items-center justify-center rounded-full bg-card border border-border text-xs text-muted-foreground">→</button>
      </div>
      <div className="mb-5"><SpendingLimitCard /></div>
      <div className="mb-5"><IncomeSection /></div>
      <div className="mb-5"><ObligationsSection /></div>
      <BudgetSummary />
    </div>
  );
}
