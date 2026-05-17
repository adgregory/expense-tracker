"use client";

import { useState, useEffect } from "react";
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
  const { categories, categorizeExpense, updateExpense, addCategory } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [remember, setRemember] = useState(true);
  const [isRecurring, setIsRecurring] = useState(false);
  const [editAmount, setEditAmount] = useState("");
  const [editName, setEditName] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("📦");

  // Pre-populate when expense changes
  useEffect(() => {
    if (expense) {
      setSelectedCategory(expense.categoryId);
      setIsRecurring(expense.isRecurring);
      setEditAmount(String(expense.amount));
      setEditName(expense.merchantName);
      setRemember(!expense.category); // default remember on for uncategorized
    }
  }, [expense]);

  const isEditing = !!expense?.category; // already categorized = editing mode

  const handleConfirm = async () => {
    if (!expense) return;

    const newAmount = parseInt(editAmount.replace(/\D/g, ""), 10);
    const amountChanged = newAmount && newAmount !== expense.amount;
    const nameChanged = editName.trim() && editName.trim() !== expense.merchantName;

    if (isEditing) {
      // Editing an existing expense
      const updates: Record<string, unknown> = {};
      if (selectedCategory && selectedCategory !== expense.categoryId) {
        updates.categoryId = selectedCategory;
        updates.remember = remember;
      }
      if (amountChanged) updates.amount = newAmount;
      if (nameChanged) updates.merchantName = editName.trim();
      if (isRecurring !== expense.isRecurring) updates.isRecurring = isRecurring;

      if (Object.keys(updates).length > 0) {
        await updateExpense(expense.id, updates as Parameters<typeof updateExpense>[1]);
      }
    } else {
      // Categorizing for the first time
      if (!selectedCategory) return;
      await categorizeExpense(expense.id, selectedCategory, remember, isRecurring);

      // Also update amount/name if changed
      const updates: Record<string, unknown> = {};
      if (amountChanged) updates.amount = newAmount;
      if (nameChanged) updates.merchantName = editName.trim();
      if (Object.keys(updates).length > 0) {
        await updateExpense(expense.id, updates as Parameters<typeof updateExpense>[1]);
      }
    }

    resetAndClose();
  };

  const resetAndClose = () => {
    setSelectedCategory(null);
    setIsRecurring(false);
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
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && resetAndClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl bg-secondary border-border px-5 pb-8 max-h-[85vh] overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="w-9 h-1 rounded-full bg-border mx-auto mb-4" />
          <SheetTitle className="text-base font-semibold text-left">
            {isEditing ? "Edit Expense" : "Categorize Expense"}
          </SheetTitle>
        </SheetHeader>

        {expense && (
          <>
            {/* Editable name and amount */}
            <div className="space-y-2 mb-4">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Merchant</p>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-10 bg-card border-border text-sm"
                />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Amount (COP)</p>
                <Input
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="h-10 bg-card border-border text-sm"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">{expense.date} {expense.time} · {expense.bank}</p>
            </div>

            {/* Category picker */}
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2.5">Category</p>

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
                <Input placeholder="Icon" value={newCategoryIcon} onChange={(e) => setNewCategoryIcon(e.target.value)} className="w-16 h-10 bg-card border-border text-center text-lg" />
                <Input placeholder="Category name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="flex-1 h-10 bg-card border-border text-sm" />
                <Button onClick={handleCreateCategory} size="sm" className="h-10 bg-[var(--color-green)] text-black hover:bg-[var(--color-green)]/90">Add</Button>
              </div>
            )}

            {/* Toggles */}
            {!isEditing && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-card mb-3">
                <div>
                  <p className="text-[13px] font-medium">Remember this</p>
                  <p className="text-[10px] text-muted-foreground">Auto-categorize next time</p>
                </div>
                <button
                  onClick={() => setRemember(!remember)}
                  className={cn("w-11 h-6 rounded-full relative transition-colors", remember ? "bg-[var(--color-green)] shadow-[0_0_8px_var(--color-green-dim)]" : "bg-border")}
                >
                  <div className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform", remember ? "right-0.5" : "left-0.5")} />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between p-3 rounded-xl bg-card mb-4">
              <div>
                <p className="text-[13px] font-medium">Recurring expense</p>
                <p className="text-[10px] text-muted-foreground">Track monthly arrival</p>
              </div>
              <button
                onClick={() => setIsRecurring(!isRecurring)}
                className={cn("w-11 h-6 rounded-full relative transition-colors", isRecurring ? "bg-[var(--color-blue)] shadow-[0_0_8px_var(--color-blue-dim)]" : "bg-border")}
              >
                <div className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform", isRecurring ? "right-0.5" : "left-0.5")} />
              </button>
            </div>

            <Button
              onClick={handleConfirm}
              disabled={!isEditing && !selectedCategory}
              className="w-full h-12 bg-[var(--color-green)] text-black font-semibold hover:bg-[var(--color-green)]/90 shadow-[0_0_20px_var(--color-green-dim)] disabled:opacity-50 disabled:shadow-none"
            >
              {isEditing
                ? "Save Changes"
                : selectedCat
                  ? `Confirm → ${selectedCat.name}`
                  : "Select a category"
              }
            </Button>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
