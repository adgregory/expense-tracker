"use client";

import { useApp } from "@/lib/context/use-app";
import { formatCompactCOP } from "@/lib/utils";

export function TopMerchants() {
  const { expenses } = useApp();

  const merchantTotals = expenses.reduce<Record<string, number>>((acc, e) => {
    const key = e.merchantNormalized || e.merchantName;
    acc[key] = (acc[key] || 0) + e.amount;
    return acc;
  }, {});

  const sorted = Object.entries(merchantTotals).sort(([, a], [, b]) => b - a).slice(0, 5);
  const maxAmount = sorted[0]?.[1] || 1;

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h4 className="text-[13px] font-semibold mb-0.5">Top Merchants</h4>
      <p className="text-[11px] text-muted-foreground mb-3">Where your money goes most</p>
      <div className="space-y-2.5">
        {sorted.map(([name, amount], i) => (
          <div key={name} className="flex items-center gap-3">
            <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
            <div className="flex-1 h-6 bg-background rounded relative overflow-hidden">
              <div className="h-full rounded bg-[var(--color-green-dim)] flex items-center px-2" style={{ width: `${(amount / maxAmount) * 100}%` }}>
                <span className="text-[10px] font-medium truncate">{name}</span>
              </div>
            </div>
            <span className="text-xs font-semibold w-14 text-right">{formatCompactCOP(amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
