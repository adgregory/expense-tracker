"use client";

import { useState } from "react";
import { useApp } from "@/lib/context/use-app";
import { formatCOP } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ObligationsSection() {
  const { budget, addObligation, toggleObligationPaid } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleAdd = () => {
    const num = parseInt(amount.replace(/\D/g, ""), 10);
    if (!name.trim() || !num) return;
    addObligation({ name: name.trim(), amount: num, dueDate: new Date().toISOString().split("T")[0], paid: false });
    setName("");
    setAmount("");
    setShowAdd(false);
  };

  return (
    <div>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2.5">Obligations / Fixed Costs</p>
      <div className="space-y-2">
        {budget.obligations.map((ob) => (
          <div key={ob.id} className="flex justify-between items-center p-3.5 rounded-xl border border-border bg-card cursor-pointer" onClick={() => toggleObligationPaid(ob.id)}>
            <div>
              <p className="text-[13px] font-medium">{ob.name}</p>
              <p className="text-[10px] text-muted-foreground">{ob.paid ? "✓ Paid" : `Due ${ob.dueDate.split("-").slice(1).reverse().join("/")}`}</p>
            </div>
            <span className={`text-sm font-semibold ${ob.paid ? "text-muted-foreground line-through" : "text-[var(--color-red)]"}`}>-{formatCOP(ob.amount)}</span>
          </div>
        ))}
      </div>
      {showAdd ? (
        <div className="flex gap-2 mt-2">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="flex-1 h-10 bg-card border-border text-sm" />
          <Input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-28 h-10 bg-card border-border text-sm" />
          <Button onClick={handleAdd} size="sm" className="h-10 bg-[var(--color-green)] text-black hover:bg-[var(--color-green)]/90">Add</Button>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} className="w-full mt-2 p-2.5 rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:text-foreground transition-colors">+ Add obligation</button>
      )}
    </div>
  );
}
