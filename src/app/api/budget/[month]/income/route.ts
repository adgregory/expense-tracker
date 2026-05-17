import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ month: string }> }
) {
  const { month } = await params;
  const body = await request.json();
  const { source, amount, date } = body;

  if (!source || !amount) {
    return NextResponse.json({ error: "Missing source or amount" }, { status: 400 });
  }

  let budget = await prisma.budgetMonth.findUnique({ where: { month } });
  if (!budget) {
    budget = await prisma.budgetMonth.create({ data: { month, spendingLimit: 0 } });
  }

  const income = await prisma.income.create({
    data: {
      budgetMonthId: budget.id,
      source,
      amount,
      date: date || new Date().toISOString().split("T")[0],
    },
  });

  return NextResponse.json(income, { status: 201 });
}
