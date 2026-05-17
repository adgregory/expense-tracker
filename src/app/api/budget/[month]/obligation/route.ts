import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ month: string }> }
) {
  const { month } = await params;
  const body = await request.json();
  const { name, amount, dueDate, recurring } = body;

  if (!name || !amount) {
    return NextResponse.json({ error: "Missing name or amount" }, { status: 400 });
  }

  let budget = await prisma.budgetMonth.findUnique({ where: { month } });
  if (!budget) {
    budget = await prisma.budgetMonth.create({ data: { month, spendingLimit: 0 } });
  }

  const obligation = await prisma.obligation.create({
    data: {
      budgetMonthId: budget.id,
      name,
      amount,
      dueDate: dueDate || month + "-01",
      recurring: recurring ?? false,
    },
  });

  return NextResponse.json(obligation, { status: 201 });
}
