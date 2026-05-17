"use client";

import { useState } from "react";
import { Pencil, Check } from "lucide-react";
import { useApp } from "@/lib/context/use-app";
import { formatCOP, getDaysRemainingInMonth } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export function SpendingLimitCard() {
  const { budget, updateSpendingLimit, expenses } = useApp();
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget.spendingLimit - totalSpent;
  const daysLeft = getDaysRemainingInMonth();
  const perDay = daysLeft > 0 ? Math.round(remaining / daysLeft) : 0;

  const handleSave = () => {
    const num = parseInt(editValue.replace(/\D/g, ""), 10);
    if (num > 0) updateSpendingLimit(num);
    setEditing(false);
  };

  return (
    <div className="relative rounded-2xl border border-[var(--color-green)] bg-card p-5 text-center overflow-hidden">
      <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,var(--color-green-dim)_0%,transparent_50%)] pointer-events-none" />
      <button onClick={() => { setEditValue(String(budget.spendingLimit)); setEditing(!editing); }} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground z-10">
        {editing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
      </button>
      <p className="relative text-[11px] text-muted-foreground uppercase tracking-wider mb-2">Monthly Spending Limit</p>
      {editing ? (
        <div className="relative flex justify-center mb-2">
          <Input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSave()} onBlur={handleSave} className="w-48 text-center text-2xl font-bold bg-transparent border-border h-12" autoFocus />
        </div>
      ) : (
        <p className="relative text-[32px] font-bold text-[var(--color-green)] drop-shadow-[0_0_20px_var(--color-green-dim)]">{formatCOP(budget.spendingLimit)}</p>
      )}
      <p className="relative text-[11px] text-muted-foreground mt-1">{formatCOP(Math.max(0, perDay))} / day · {daysLeft} days remaining</p>
    </div>
  );
}
