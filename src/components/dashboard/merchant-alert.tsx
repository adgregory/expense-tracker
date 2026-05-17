"use client";

import Link from "next/link";
import { useApp } from "@/lib/context/use-app";
import { formatCOP } from "@/lib/utils";

export function MerchantAlert() {
  const { expenses } = useApp();

  const uncategorized = expenses.filter((e) => e.category === null);
  if (uncategorized.length === 0) return null;

  const first = uncategorized[0];

  return (
    <Link href="/expenses" className="flex items-center gap-3 rounded-xl border border-[var(--color-yellow)]/30 bg-[var(--color-yellow-dim)] p-3.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-yellow)] text-black font-bold text-sm flex-shrink-0">?</div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold truncate">{first.merchantName}</p>
        <p className="text-[11px] text-muted-foreground">
          {formatCOP(first.amount)} — Needs category
          {uncategorized.length > 1 && ` (+${uncategorized.length - 1} more)`}
        </p>
      </div>
      <span className="text-[11px] text-[var(--color-yellow)] font-semibold whitespace-nowrap">Categorize →</span>
    </Link>
  );
}
