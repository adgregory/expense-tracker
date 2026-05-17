import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month") || new Date().toISOString().substring(0, 7);

  const allRecurring = await prisma.recurringExpense.findMany({
    include: { merchantMapping: { include: { category: true } } },
  });

  for (const rec of allRecurring) {
    await prisma.recurringExpenseMonth.upsert({
      where: { recurringExpenseId_month: { recurringExpenseId: rec.id, month } },
      update: {},
      create: { recurringExpenseId: rec.id, month, status: "pending" },
    });
  }

  const result = await prisma.recurringExpense.findMany({
    include: {
      merchantMapping: { include: { category: true } },
      months: { where: { month }, include: { expense: true } },
    },
  });

  return NextResponse.json(result);
}
