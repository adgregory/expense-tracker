"use client";

import { useApp } from "@/lib/context/use-app";
import { BudgetRing } from "@/components/dashboard/budget-ring";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { MerchantAlert } from "@/components/dashboard/merchant-alert";
import { WeeklyChart } from "@/components/dashboard/weekly-chart";
import { RecentExpenses } from "@/components/dashboard/recent-expenses";

export default function DashboardPage() {
  const { loading } = useApp();

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Loading...</p></div>;

  return (
    <div className="px-5 py-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight">Hola, Alvin</h1>
          <p className="text-sm text-muted-foreground">Mayo 2026</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-sm font-medium">AG</div>
      </div>
      <div className="mb-4"><BudgetRing /></div>
      <div className="mb-4"><QuickStats /></div>
      <div className="mb-4"><MerchantAlert /></div>
      <div className="mb-4"><WeeklyChart /></div>
      <RecentExpenses />
    </div>
  );
}
