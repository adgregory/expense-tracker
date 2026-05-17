"use client";

import { useApp } from "@/lib/context/use-app";
import { formatCOP, formatCompactCOP } from "@/lib/utils";

export function PortfolioTotal() {
  const { investments } = useApp();

  const totalValue = investments.reduce((sum, inv) => sum + inv.quantity * inv.currentValuePerUnit, 0);
  const totalCost = investments.reduce((sum, inv) => sum + inv.transactions.filter((t) => t.type === "buy").reduce((s, t) => s + t.quantity * t.pricePerUnit, 0), 0);
  const totalGain = totalValue - totalCost;
  const percentGain = totalCost > 0 ? ((totalGain / totalCost) * 100).toFixed(1) : "0";
  const isPositive = totalGain >= 0;

  return (
    <div className="relative rounded-2xl border border-border bg-card p-5 overflow-hidden">
      <div className="absolute -top-[30%] -right-[20%] w-[160px] h-[160px] bg-[radial-gradient(circle,var(--color-green-dim)_0%,transparent_70%)] pointer-events-none" />
      <p className="relative text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Total Portfolio</p>
      <p className="relative text-[28px] font-bold mb-1">{formatCOP(totalValue)}</p>
      <p className={`relative text-xs ${isPositive ? "text-[var(--color-green)]" : "text-[var(--color-red)]"}`}>
        {isPositive ? "↑" : "↓"} {formatCompactCOP(Math.abs(totalGain))} ({isPositive ? "+" : ""}{percentGain}%) all time
      </p>
    </div>
  );
}
