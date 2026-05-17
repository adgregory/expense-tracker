"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/context/use-app";
import { Expense } from "@/lib/types";
import { formatCOP, cn } from "@/lib/utils";

interface CategorizeSheetProps {
  expense: Expense | null;
  open: boolean;
  onClose: () => void;
}

export function CategorizeSheet({ expense, open, onClose }: CategorizeSheetProps) {
  const { categories, categorizeExpense, addCategory } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [remember, setRemember] = useState(true);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("📦");

  const handleConfirm = async () => {
    if (!expense || !selectedCategory) return;
    await categorizeExpense(expense.id, selectedCategory, remember);
    setSelectedCategory(null);
    setShowNewCategory(false);
    setNewCategoryName("");
    onClose();
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    await addCategory(newCategoryName.trim(), newCategoryIcon, "cyan");
    setShowNewCategory(false);
    setNewCategoryName("");
  };

  const selectedCat = categories.find((c) => c.id === selectedCategory);

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl bg-secondary border-border px-5 pb-8">
        <SheetHeader className="pb-4">
          <div className="w-9 h-1 rounded-full bg-border mx-auto mb-4" />
          {expense && (
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-orange-dim)] border border-dashed border-[var(--color-orange)] text-xl">🏪</div>
              <div>
                <SheetTitle className="text-base font-semibold text-left">{expense.merchantName}</SheetTitle>
                <p className="text-xs text-muted-foreground text-left">{formatCOP(expense.amount)} · {expense.date} {expense.time}</p>
              </div>
            </div>
          )}
        </SheetHeader>

        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2.5">Pick a category</p>

        <div className="grid grid-cols-2 gap-2 mb-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-xl border transition-all",
                selectedCategory === cat.id
                  ? "border-[var(--color-green)] bg-[var(--color-green-dim)] shadow-[0_0_12px_var(--color-green-dim)]"
                  : "border-border bg-card hover:border-[var(--color-green)]/50"
              )}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-xs font-medium">{cat.name}</span>
            </button>
          ))}
        </div>

        {!showNewCategory ? (
          <button onClick={() => setShowNewCategory(true)} className="w-full p-3 rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:text-foreground transition-colors mb-4">+ Create new category</button>
        ) : (
          <div className="flex gap-2 mb-4">
            <Input placeholder="Category name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="flex-1 h-10 bg-card border-border text-sm" />
            <Button onClick={handleCreateCategory} size="sm" className="h-10 bg-[var(--color-green)] text-black hover:bg-[var(--color-green)]/90">Add</Button>
          </div>
        )}

        <div className="flex items-center justify-between p-3 rounded-xl bg-card mb-4">
          <div>
            <p className="text-[13px] font-medium">Remember this</p>
            <p className="text-[10px] text-muted-foreground">Auto-categorize {expense?.merchantName} next time</p>
          </div>
          <button
            onClick={() => setRemember(!remember)}
            className={cn("w-11 h-6 rounded-full relative transition-colors", remember ? "bg-[var(--color-green)] shadow-[0_0_8px_var(--color-green-dim)]" : "bg-border")}
          >
            <div className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform", remember ? "right-0.5" : "left-0.5")} />
          </button>
        </div>

        <Button onClick={handleConfirm} disabled={!selectedCategory} className="w-full h-12 bg-[var(--color-green)] text-black font-semibold hover:bg-[var(--color-green)]/90 shadow-[0_0_20px_var(--color-green-dim)] disabled:opacity-50 disabled:shadow-none">
          {selectedCat ? `Confirm → ${selectedCat.name}` : "Select a category"}
        </Button>
      </SheetContent>
    </Sheet>
  );
}
