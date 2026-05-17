import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ month: string }> }
) {
  const { month } = await params;

  let budget = await prisma.budgetMonth.findUnique({
    where: { month },
    include: { incomes: true, obligations: true },
  });

  if (!budget) {
    const [year, mo] = month.split("-").map(Number);
    const prevDate = new Date(year, mo - 2, 1);
    const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;

    const prevBudget = await prisma.budgetMonth.findUnique({
      where: { month: prevMonth },
      include: { obligations: { where: { recurring: true } } },
    });

    budget = await prisma.budgetMonth.create({
      data: {
        month,
        spendingLimit: 0,
        obligations: prevBudget
          ? {
              create: prevBudget.obligations.map((o) => ({
                name: o.name,
                amount: o.amount,
                dueDate: o.dueDate.replace(prevMonth.substring(0, 7), month),
                paid: false,
                recurring: true,
              })),
            }
          : undefined,
      },
      include: { incomes: true, obligations: true },
    });
  }

  return NextResponse.json(budget);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ month: string }> }
) {
  const { month } = await params;
  const body = await request.json();
  const { spendingLimit } = body;

  const budget = await prisma.budgetMonth.upsert({
    where: { month },
    update: { spendingLimit },
    create: { month, spendingLimit },
    include: { incomes: true, obligations: true },
  });

  return NextResponse.json(budget);
}
