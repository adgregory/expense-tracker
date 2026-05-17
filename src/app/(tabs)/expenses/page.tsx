"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/lib/context/use-app";
import { Expense } from "@/lib/types";
import { SearchBar } from "@/components/expenses/search-bar";
import { FilterPills } from "@/components/expenses/filter-pills";
import { ExpenseList } from "@/components/expenses/expense-list";
import { CategorizeSheet } from "@/components/expenses/categorize-sheet";

export default function ExpensesPage() {
  const { expenses, categories } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [categorizeTarget, setCategorizeTarget] = useState<Expense | null>(null);

  const filtered = useMemo(() => {
    let result = expenses;
    if (filter === "uncategorized") {
      result = result.filter((e) => e.category === null);
    } else if (filter !== "all") {
      result = result.filter((e) => e.category === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((e) => e.merchantName.toLowerCase().includes(q) || (e.category && e.category.toLowerCase().includes(q)));
    }
    return result;
  }, [expenses, filter, search]);

  return (
    <div className="px-5 py-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[22px] font-bold tracking-tight">Expenses</h1>
        <span className="text-[13px] text-muted-foreground">Mayo 2026</span>
      </div>
      <div className="mb-3"><SearchBar value={search} onChange={setSearch} /></div>
      <FilterPills selected={filter} onSelect={setFilter} />
      <ExpenseList expenses={filtered} categories={categories} onCategorize={setCategorizeTarget} />
      <CategorizeSheet expense={categorizeTarget} open={categorizeTarget !== null} onClose={() => setCategorizeTarget(null)} />
    </div>
  );
}
