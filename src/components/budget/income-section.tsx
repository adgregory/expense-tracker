"use client";

import { useState } from "react";
import { useApp } from "@/lib/context/use-app";
import { formatCOP } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function IncomeSection() {
  const { budget, addIncome } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");

  if (!budget) return null;

  const totalIncome = budget.incomes.reduce((sum, i) => sum + i.amount, 0);

  const handleAdd = () => {
    const num = parseInt(amount.replace(/\D/g, ""), 10);
    if (!source.trim() || !num) return;
    addIncome({ source: source.trim(), amount: num, date: new Date().toISOString().split("T")[0] });
    setSource("");
    setAmount("");
    setShowAdd(false);
  };

  return (
    <div>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2.5">Income This Month</p>
      <div className="rounded-xl border border-border bg-card p-4">
        {budget.incomes.map((income) => (
          <div key={income.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
            <span className="text-[13px] text-muted-foreground">{income.source}</span>
            <span className="text-sm font-semibold text-[var(--color-green)]">{formatCOP(income.amount)}</span>
          </div>
        ))}
        <div className="flex justify-between items-center pt-3 mt-2 border-t border-[var(--color-green-dim)]">
          <span className="text-xs text-muted-foreground">Total Income</span>
          <span className="text-base font-bold text-[var(--color-green)]">{formatCOP(totalIncome)}</span>
        </div>
      </div>
      {showAdd ? (
        <div className="flex gap-2 mt-2">
          <Input placeholder="Source" value={source} onChange={(e) => setSource(e.target.value)} className="flex-1 h-10 bg-card border-border text-sm" />
          <Input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-28 h-10 bg-card border-border text-sm" />
          <Button onClick={handleAdd} size="sm" className="h-10 bg-[var(--color-green)] text-black hover:bg-[var(--color-green)]/90">Add</Button>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} className="w-full mt-2 p-2.5 rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:text-foreground transition-colors">+ Add income</button>
      )}
    </div>
  );
}
