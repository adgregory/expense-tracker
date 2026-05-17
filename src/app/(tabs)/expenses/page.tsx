"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/lib/context/use-app";
import { Expense } from "@/lib/types";
import { SearchBar } from "@/components/expenses/search-bar";
import { FilterPills } from "@/components/expenses/filter-pills";
import { ExpenseList } from "@/components/expenses/expense-list";
import { CategorizeSheet } from "@/components/expenses/categorize-sheet";
import { ManageCategoriesSheet } from "@/components/expenses/manage-categories-sheet";
import { AddExpenseSheet } from "@/components/expenses/add-expense-sheet";
import { Settings, Plus } from "lucide-react";

export default function ExpensesPage() {
  const { expenses, loading } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [categorizeTarget, setCategorizeTarget] = useState<Expense | null>(null);
  const [showManage, setShowManage] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    let result = expenses;
    if (filter === "uncategorized") {
      result = result.filter((e) => e.category === null);
    } else if (filter !== "all") {
      result = result.filter((e) => e.categoryId === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((e) => e.merchantName.toLowerCase().includes(q) || (e.category && e.category.name.toLowerCase().includes(q)));
    }
    return result;
  }, [expenses, filter, search]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Loading...</p></div>;

  return (
    <div className="px-5 py-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-[22px] font-bold tracking-tight">Expenses</h1>
          <button onClick={() => setShowManage(true)} className="text-muted-foreground hover:text-foreground">
            <Settings className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-green)] text-black"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="mb-3"><SearchBar value={search} onChange={setSearch} /></div>
      <FilterPills selected={filter} onSelect={setFilter} />
      <ExpenseList expenses={filtered} onCategorize={setCategorizeTarget} />
      <CategorizeSheet expense={categorizeTarget} open={categorizeTarget !== null} onClose={() => setCategorizeTarget(null)} />
      <AddExpenseSheet open={showAdd} onClose={() => setShowAdd(false)} />
      <ManageCategoriesSheet open={showManage} onClose={() => setShowManage(false)} />
    </div>
  );
}
