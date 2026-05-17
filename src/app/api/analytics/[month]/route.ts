import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ month: string }> }
) {
  const { month } = await params;

  const expenses = await prisma.expense.findMany({
    where: { date: { startsWith: month } },
    include: { category: true },
  });

  // Category breakdown
  const categoryMap = new Map<string, { name: string; icon: string; color: string; total: number }>();
  for (const e of expenses) {
    if (e.category) {
      const key = e.category.id;
      const existing = categoryMap.get(key);
      if (existing) {
        existing.total += e.amount;
      } else {
        categoryMap.set(key, { name: e.category.name, icon: e.category.icon, color: e.category.color, total: e.amount });
      }
    }
  }
  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([categoryId, data]) => ({ categoryId, ...data }))
    .sort((a, b) => b.total - a.total);

  // Daily spending
  const dailyMap = new Map<string, number>();
  for (const e of expenses) {
    dailyMap.set(e.date, (dailyMap.get(e.date) || 0) + e.amount);
  }
  const dailySpending = Array.from(dailyMap.entries())
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Top merchants
  const merchantMap = new Map<string, { total: number; count: number }>();
  for (const e of expenses) {
    const key = e.merchantNormalized;
    const existing = merchantMap.get(key);
    if (existing) { existing.total += e.amount; existing.count++; }
    else { merchantMap.set(key, { total: e.amount, count: 1 }); }
  }
  const topMerchants = Array.from(merchantMap.entries())
    .map(([merchant, data]) => ({ merchant, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Budget data
  const budget = await prisma.budgetMonth.findUnique({
    where: { month },
    include: { incomes: true, obligations: true },
  });
  const totalIncome = budget?.incomes.reduce((sum, i) => sum + i.amount, 0) ?? 0;
  const totalObligations = budget?.obligations.reduce((sum, o) => sum + o.amount, 0) ?? 0;

  // Previous month comparison
  const [year, mo] = month.split("-").map(Number);
  const prevDate = new Date(year, mo - 2, 1);
  const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;

  const prevExpenses = await prisma.expense.findMany({
    where: { date: { startsWith: prevMonth } },
    include: { category: true },
  });

  const prevCategoryMap = new Map<string, number>();
  for (const e of prevExpenses) {
    if (e.category) {
      prevCategoryMap.set(e.category.id, (prevCategoryMap.get(e.category.id) || 0) + e.amount);
    }
  }
  const previousMonth = {
    totalSpent: prevExpenses.reduce((sum, e) => sum + e.amount, 0),
    categoryBreakdown: Array.from(prevCategoryMap.entries()).map(([categoryId, total]) => ({ categoryId, total })),
  };

  return NextResponse.json({
    categoryBreakdown, dailySpending, topMerchants,
    totalSpent, totalIncome, totalObligations, previousMonth,
  });
}
