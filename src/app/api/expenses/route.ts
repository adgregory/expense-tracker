import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { merchantName, amount, categoryId, date, time, bank } = body;

  if (!merchantName || !amount) {
    return NextResponse.json({ error: "Missing merchantName or amount" }, { status: 400 });
  }

  const now = new Date();
  const expense = await prisma.expense.create({
    data: {
      merchantName,
      merchantNormalized: merchantName.toUpperCase().trim(),
      amount,
      categoryId: categoryId || null,
      bank: bank || "manual",
      cardLast4: "----",
      date: date || now.toISOString().split("T")[0],
      time: time || now.toTimeString().split(" ")[0],
      rawSms: `Manual: ${merchantName} $${amount}`,
      isRecurring: false,
    },
    include: { category: true },
  });

  return NextResponse.json(expense, { status: 201 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  const category = searchParams.get("category");

  const where: Record<string, unknown> = {};
  if (month) where.date = { startsWith: month };
  if (category) where.categoryId = category;

  const expenses = await prisma.expense.findMany({
    where,
    include: { category: true },
    orderBy: [{ date: "desc" }, { time: "desc" }],
  });

  return NextResponse.json(expenses);
}
