"use client";

import { useState } from "react";
import { PortfolioTotal } from "@/components/investments/portfolio-total";
import { HoldingsList } from "@/components/investments/holdings-list";
import { InvestmentForm } from "@/components/investments/investment-form";
import { ActivityLog } from "@/components/investments/activity-log";

export default function InvestmentsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="px-5 py-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[22px] font-bold tracking-tight">Investments</h1>
      </div>
      <div className="mb-4"><PortfolioTotal /></div>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2.5">Holdings</p>
      <div className="mb-4"><HoldingsList /></div>
      <button onClick={() => setShowForm(true)} className="w-full mb-5 p-2.5 rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:text-foreground transition-colors">+ Log new investment</button>
      <ActivityLog />
      <InvestmentForm open={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
}
