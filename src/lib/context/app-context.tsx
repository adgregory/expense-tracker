"use client";

import React, { createContext, useState, useCallback } from "react";
import {
  Expense,
  Category,
  MerchantMapping,
  BudgetMonth,
  Investment,
  Income,
  Obligation,
} from "@/lib/types";
import {
  expenses as initialExpenses,
  categories as initialCategories,
  merchantMappings as initialMappings,
  currentBudget as initialBudget,
  investments as initialInvestments,
} from "@/lib/mock-data";

export interface AppState {
  expenses: Expense[];
  categories: Category[];
  merchantMappings: MerchantMapping[];
  budget: BudgetMonth;
  investments: Investment[];
  categorizeExpense: (expenseId: string, categoryId: string, remember: boolean) => void;
  addCategory: (name: string, icon: string, color: string) => void;
  updateSpendingLimit: (amount: number) => void;
  addIncome: (income: Omit<Income, "id">) => void;
  addObligation: (obligation: Omit<Obligation, "id">) => void;
  toggleObligationPaid: (id: string) => void;
  addInvestmentTransaction: (
    investmentId: string,
    transaction: { type: "buy" | "sell"; quantity: number; pricePerUnit: number; date: string; notes?: string }
  ) => void;
}

export const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [merchantMappings, setMerchantMappings] = useState<MerchantMapping[]>(initialMappings);
  const [budget, setBudget] = useState<BudgetMonth>(initialBudget);
  const [investments, setInvestments] = useState<Investment[]>(initialInvestments);

  const categorizeExpense = useCallback(
    (expenseId: string, categoryId: string, remember: boolean) => {
      setExpenses((prev) =>
        prev.map((e) => (e.id === expenseId ? { ...e, category: categoryId } : e))
      );
      if (remember) {
        const expense = expenses.find((e) => e.id === expenseId);
        if (expense) {
          setMerchantMappings((prev) => [
            ...prev,
            { pattern: expense.merchantName.toUpperCase(), category: categoryId },
          ]);
        }
      }
    },
    [expenses]
  );

  const addCategory = useCallback((name: string, icon: string, color: string) => {
    const id = name.toLowerCase().replace(/\s+/g, "-");
    setCategories((prev) => [...prev, { id, name, icon, color }]);
  }, []);

  const updateSpendingLimit = useCallback((amount: number) => {
    setBudget((prev) => ({ ...prev, spendingLimit: amount }));
  }, []);

  const addIncome = useCallback((income: Omit<Income, "id">) => {
    const id = `i${Date.now()}`;
    setBudget((prev) => ({
      ...prev,
      incomes: [...prev.incomes, { ...income, id }],
    }));
  }, []);

  const addObligation = useCallback((obligation: Omit<Obligation, "id">) => {
    const id = `o${Date.now()}`;
    setBudget((prev) => ({
      ...prev,
      obligations: [...prev.obligations, { ...obligation, id }],
    }));
  }, []);

  const toggleObligationPaid = useCallback((id: string) => {
    setBudget((prev) => ({
      ...prev,
      obligations: prev.obligations.map((o) =>
        o.id === id ? { ...o, paid: !o.paid } : o
      ),
    }));
  }, []);

  const addInvestmentTransaction = useCallback(
    (
      investmentId: string,
      transaction: { type: "buy" | "sell"; quantity: number; pricePerUnit: number; date: string; notes?: string }
    ) => {
      const txId = `t${Date.now()}`;
      setInvestments((prev) =>
        prev.map((inv) => {
          if (inv.id !== investmentId) return inv;
          const newQty =
            transaction.type === "buy"
              ? inv.quantity + transaction.quantity
              : inv.quantity - transaction.quantity;
          return {
            ...inv,
            quantity: newQty,
            transactions: [...inv.transactions, { ...transaction, id: txId }],
          };
        })
      );
    },
    []
  );

  return (
    <AppContext.Provider
      value={{
        expenses,
        categories,
        merchantMappings,
        budget,
        investments,
        categorizeExpense,
        addCategory,
        updateSpendingLimit,
        addIncome,
        addObligation,
        toggleObligationPaid,
        addInvestmentTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
