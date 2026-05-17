"use client";

import React, { createContext, useState, useCallback, useEffect } from "react";
import {
  Expense,
  Category,
  BudgetMonth,
  Investment,
  RecurringExpense,
  Income,
  Obligation,
} from "@/lib/types";
import { getCurrentMonth } from "@/lib/utils";

export interface AppState {
  expenses: Expense[];
  categories: Category[];
  budget: BudgetMonth | null;
  investments: Investment[];
  recurring: RecurringExpense[];
  currentMonth: string;
  loading: boolean;
  setCurrentMonth: (month: string) => void;
  categorizeExpense: (expenseId: string, categoryId: string, remember: boolean, isRecurring?: boolean) => Promise<void>;
  addCategory: (name: string, icon: string, color: string) => Promise<void>;
  updateSpendingLimit: (amount: number) => Promise<void>;
  addIncome: (income: Omit<Income, "id">) => Promise<void>;
  addObligation: (obligation: Omit<Obligation, "id" | "paid">) => Promise<void>;
  toggleObligationPaid: (id: string) => Promise<void>;
  addInvestmentTransaction: (
    investmentId: string,
    transaction: { type: "buy" | "sell"; quantity: number; pricePerUnit: number; date: string; notes?: string }
  ) => Promise<void>;
  updateExpense: (id: string, updates: { categoryId?: string; amount?: number; merchantName?: string; isRecurring?: boolean; remember?: boolean }) => Promise<void>;
  editCategory: (id: string, updates: { name?: string; icon?: string; color?: string }) => Promise<void>;
  deleteRecurring: (monthEntryId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

export const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budget, setBudget] = useState<BudgetMonth | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [recurring, setRecurring] = useState<RecurringExpense[]>([]);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (month: string) => {
    setLoading(true);
    try {
      const [expRes, catRes, budRes, invRes, recRes] = await Promise.all([
        fetch(`/api/expenses?month=${month}`),
        fetch(`/api/categories`),
        fetch(`/api/budget/${month}`),
        fetch(`/api/investments`),
        fetch(`/api/recurring?month=${month}`),
      ]);
      setExpenses(await expRes.json());
      setCategories(await catRes.json());
      setBudget(await budRes.json());
      setInvestments(await invRes.json());
      setRecurring(await recRes.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(currentMonth); }, [currentMonth, fetchData]);

  const refreshData = useCallback(() => fetchData(currentMonth), [currentMonth, fetchData]);

  const categorizeExpense = useCallback(async (
    expenseId: string, categoryId: string, remember: boolean, isRecurring?: boolean
  ) => {
    const res = await fetch(`/api/expenses/${expenseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, remember, isRecurring }),
    });
    const updated = await res.json();
    setExpenses((prev) => prev.map((e) => (e.id === expenseId ? updated : e)));
  }, []);

  const addCategory = useCallback(async (name: string, icon: string, color: string) => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, icon, color }),
    });
    const created = await res.json();
    setCategories((prev) => [...prev, created]);
  }, []);

  const updateSpendingLimit = useCallback(async (amount: number) => {
    const res = await fetch(`/api/budget/${currentMonth}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ spendingLimit: amount }),
    });
    setBudget(await res.json());
  }, [currentMonth]);

  const addIncome = useCallback(async (income: Omit<Income, "id">) => {
    await fetch(`/api/budget/${currentMonth}/income`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(income),
    });
    const res = await fetch(`/api/budget/${currentMonth}`);
    setBudget(await res.json());
  }, [currentMonth]);

  const addObligation = useCallback(async (obligation: Omit<Obligation, "id" | "paid">) => {
    await fetch(`/api/budget/${currentMonth}/obligation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obligation),
    });
    const res = await fetch(`/api/budget/${currentMonth}`);
    setBudget(await res.json());
  }, [currentMonth]);

  const toggleObligationPaid = useCallback(async (id: string) => {
    const ob = budget?.obligations.find((o) => o.id === id);
    if (!ob) return;
    await fetch(`/api/budget/${currentMonth}/obligation/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paid: !ob.paid }),
    });
    const res = await fetch(`/api/budget/${currentMonth}`);
    setBudget(await res.json());
  }, [budget, currentMonth]);

  const addInvestmentTransaction = useCallback(async (
    investmentId: string,
    transaction: { type: "buy" | "sell"; quantity: number; pricePerUnit: number; date: string; notes?: string }
  ) => {
    await fetch(`/api/investments/${investmentId}/transaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    });
    const res = await fetch("/api/investments");
    setInvestments(await res.json());
  }, []);

  const updateExpense = useCallback(async (
    id: string,
    updates: { categoryId?: string; amount?: number; merchantName?: string; isRecurring?: boolean; remember?: boolean }
  ) => {
    const res = await fetch(`/api/expenses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const updated = await res.json();
    setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));
  }, []);

  const editCategory = useCallback(async (id: string, updates: { name?: string; icon?: string; color?: string }) => {
    const res = await fetch(`/api/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const updated = await res.json();
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }, []);

  const deleteRecurring = useCallback(async (monthEntryId: string) => {
    await fetch(`/api/recurring/${monthEntryId}`, { method: "DELETE" });
    setRecurring((prev) => prev.filter((r) => !r.months.some((m) => m.id === monthEntryId)));
  }, []);

  return (
    <AppContext.Provider value={{
      expenses, categories, budget, investments, recurring,
      currentMonth, loading, setCurrentMonth,
      categorizeExpense, addCategory, updateSpendingLimit,
      addIncome, addObligation, toggleObligationPaid,
      addInvestmentTransaction, updateExpense, editCategory, deleteRecurring, refreshData,
    }}>
      {children}
    </AppContext.Provider>
  );
}
