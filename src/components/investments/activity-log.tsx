"use client";

import { useApp } from "@/lib/context/use-app";

export function ActivityLog() {
  const { investments } = useApp();

  const allTransactions = investments
    .flatMap((inv) => inv.transactions.map((t) => ({ ...t, assetName: inv.assetName })))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2.5">Recent Activity</p>
      <div className="rounded-xl border border-border bg-card p-3">
        {allTransactions.map((tx) => (
          <div key={tx.id} className="flex justify-between items-center py-2 border-b border-border last:border-0 text-xs">
            <span>{tx.type === "buy" ? "Bought" : "Sold"} {tx.quantity} {tx.assetName}</span>
            <span className="text-muted-foreground">{tx.date.split("-").slice(1).reverse().join("/")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
