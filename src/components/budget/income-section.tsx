"use client";

import { useState } from "react";
import { useApp } from "@/lib/context/use-app";
import { formatCOP, cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, X, Check } from "lucide-react";

export function IncomeSection() {
  const { budget, addIncome, editIncome, deleteIncome } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSource, setEditSource] = useState("");
  const [editAmount, setEditAmount] = useState("");

  if (!budget) return null;

  const totalIncome = budget.incomes.reduce((sum, i) => sum + i.amount, 0);

  const handleAdd = async () => {
    const num = parseInt(amount.replace(/\D/g, ""), 10);
    if (!source.trim() || !num) return;
    await addIncome({ source: source.trim(), amount: num, date: new Date().toISOString().split("T")[0] });
    setSource("");
    setAmount("");
    setShowAdd(false);
  };

  const startEdit = (id: string, src: string, amt: number) => {
    setEditingId(id);
    setEditSource(src);
    setEditAmount(String(amt));
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const num = parseInt(editAmount.replace(/\D/g, ""), 10);
    await editIncome(editingId, { source: editSource.trim() || undefined, amount: num || undefined });
    setEditingId(null);
  };

  return (
    <div>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2.5">Income This Month</p>
      <div className="rounded-xl border border-border bg-card p-4">
        {budget.incomes.map((income) => (
          <div key={income.id} className="flex items-center gap-2 py-2 border-b border-border last:border-0">
            {editingId === income.id ? (
              <div className="flex-1 flex gap-2 items-center">
                <Input value={editSource} onChange={(e) => setEditSource(e.target.value)} className="flex-1 h-8 bg-secondary border-border text-xs" />
                <Input value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="w-24 h-8 bg-secondary border-border text-xs" />
                <button onClick={saveEdit} className="text-[var(--color-green)] p-1"><Check className="h-3.5 w-3.5" /></button>
                <button onClick={() => setEditingId(null)} className="text-muted-foreground p-1"><X className="h-3.5 w-3.5" /></button>
              </div>
            ) : (
              <>
                <span className="flex-1 text-[13px] text-muted-foreground">{income.source}</span>
                <span className="text-sm font-semibold text-[var(--color-green)]">{formatCOP(income.amount)}</span>
                <button onClick={() => startEdit(income.id, income.source, income.amount)} className="text-muted-foreground hover:text-foreground p-1">
                  <Pencil className="h-3 w-3" />
                </button>
                <button onClick={() => deleteIncome(income.id)} className="text-muted-foreground hover:text-[var(--color-red)] p-1">
                  <X className="h-3 w-3" />
                </button>
              </>
            )}
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
