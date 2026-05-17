"use client";

import { useApp } from "@/lib/context/use-app";
import { formatCOP } from "@/lib/utils";

const assetIcons: Record<string, { icon: string; color: string }> = {
  "precious-metal": { icon: "🥇", color: "yellow" },
  "precious-stones": { icon: "💎", color: "purple" },
  crypto: { icon: "₿", color: "blue" },
  etf: { icon: "📊", color: "green" },
};

const colorMap: Record<string, string> = {
  yellow: "bg-[var(--color-yellow-dim)]",
  purple: "bg-[var(--color-purple-dim)]",
  blue: "bg-[var(--color-blue-dim)]",
  green: "bg-[var(--color-green-dim)]",
  cyan: "bg-[var(--color-cyan-dim)]",
};

export function HoldingsList() {
  const { investments } = useApp();

  return (
    <div className="space-y-2">
      {investments.map((inv) => {
        const currentValue = inv.quantity * inv.currentValuePerUnit;
        const totalCost = inv.transactions.filter((t) => t.type === "buy").reduce((sum, t) => sum + t.quantity * t.pricePerUnit, 0);
        const gain = currentValue - totalCost;
        const percentGain = totalCost > 0 ? ((gain / totalCost) * 100).toFixed(1) : "0";
        const isPositive = gain >= 0;
        const { icon, color } = assetIcons[inv.assetType] || { icon: "📦", color: "cyan" };

        return (
          <div key={inv.id} className="rounded-xl border border-border bg-card p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${colorMap[color]}`}>{icon}</div>
                <div>
                  <p className="text-sm font-medium">{inv.assetName}</p>
                  <p className="text-[11px] text-muted-foreground">{inv.quantity} {inv.assetType === "crypto" ? inv.assetName.substring(0, 3).toUpperCase() : "units"}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatCOP(currentValue)}</p>
                <p className={`text-[11px] ${isPositive ? "text-[var(--color-green)]" : "text-[var(--color-red)]"}`}>{isPositive ? "+" : ""}{percentGain}%</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
