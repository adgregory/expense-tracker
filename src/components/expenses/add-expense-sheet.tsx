"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/context/use-app";
import { cn } from "@/lib/utils";

interface AddExpenseSheetProps {
  open: boolean;
  onClose: () => void;
}

export function AddExpenseSheet({ open, onClose }: AddExpenseSheetProps) {
  const { categories, addExpense } = useApp();
  const [merchantName, setMerchantName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = async () => {
    const num = parseInt(amount.replace(/\D/g, ""), 10);
    if (!merchantName.trim() || !num) return;

    await addExpense({
      merchantName: merchantName.trim(),
      amount: num,
      categoryId: selectedCategory || undefined,
      date,
    });

    setMerchantName("");
    setAmount("");
    setSelectedCategory(null);
    setDate(new Date().toISOString().split("T")[0]);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl bg-secondary border-border px-5 pb-8 max-h-[85vh] overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="w-9 h-1 rounded-full bg-border mx-auto mb-4" />
          <SheetTitle className="text-base font-semibold text-left">Add Expense</SheetTitle>
        </SheetHeader>

        <div className="space-y-3 mb-4">
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">What did you pay for?</p>
            <Input
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              placeholder="Vet, parking, coffee..."
              className="h-10 bg-card border-border text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Amount (COP)</p>
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50000"
                className="h-10 bg-card border-border text-sm"
              />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Date</p>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-10 bg-card border-border text-sm"
              />
            </div>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2">Category (optional)</p>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all",
                selectedCategory === cat.id
                  ? "border-[var(--color-green)] bg-[var(--color-green-dim)]"
                  : "border-border bg-card"
              )}
            >
              <span className="text-lg">{cat.icon}</span>
              <span className="text-[10px] font-medium">{cat.name}</span>
            </button>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!merchantName.trim() || !amount}
          className="w-full h-12 bg-[var(--color-green)] text-black font-semibold hover:bg-[var(--color-green)]/90 shadow-[0_0_20px_var(--color-green-dim)] disabled:opacity-50 disabled:shadow-none"
        >
          Add Expense
        </Button>
      </SheetContent>
    </Sheet>
  );
}
