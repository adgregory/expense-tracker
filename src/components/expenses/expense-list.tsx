"use client";

import { Expense, Category } from "@/lib/types";
import { ExpenseItem } from "./expense-item";
import { formatDate } from "@/lib/utils";

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onCategorize: (expense: Expense) => void;
}

export function ExpenseList({ expenses, categories, onCategorize }: ExpenseListProps) {
  const grouped = expenses.reduce<Record<string, Expense[]>>((acc, expense) => {
    if (!acc[expense.date]) acc[expense.date] = [];
    acc[expense.date].push(expense);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  if (expenses.length === 0) {
    return <div className="text-center py-12 text-muted-foreground text-sm">No expenses found</div>;
  }

  return (
    <div>
      {sortedDates.map((date) => (
        <div key={date} className="mb-2">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider py-3 border-b border-border">
            {formatDate(date)} — {date.split("-").reverse().slice(0, 2).join("/")}
          </p>
          {grouped[date].map((expense) => (
            <ExpenseItem key={expense.id} expense={expense} categories={categories} onCategorize={onCategorize} />
          ))}
        </div>
      ))}
    </div>
  );
}
