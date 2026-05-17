import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { categoryId, remember, isRecurring } = body;

  const expense = await prisma.expense.update({
    where: { id },
    data: {
      categoryId,
      isRecurring: isRecurring ?? false,
    },
    include: { category: true },
  });

  if (remember && categoryId) {
    const mapping = await prisma.merchantMapping.upsert({
      where: { pattern: expense.merchantNormalized },
      update: { categoryId, isRecurring: isRecurring ?? false },
      create: {
        pattern: expense.merchantNormalized,
        categoryId,
        isRecurring: isRecurring ?? false,
      },
    });

    if (isRecurring) {
      const recurring = await prisma.recurringExpense.upsert({
        where: { merchantMappingId: mapping.id },
        update: {},
        create: { merchantMappingId: mapping.id, label: expense.merchantNormalized },
      });

      const month = expense.date.substring(0, 7);
      await prisma.recurringExpenseMonth.upsert({
        where: { recurringExpenseId_month: { recurringExpenseId: recurring.id, month } },
        update: { status: "arrived", expenseId: expense.id },
        create: { recurringExpenseId: recurring.id, month, status: "arrived", expenseId: expense.id },
      });
    }
  }

  return NextResponse.json(expense);
}
