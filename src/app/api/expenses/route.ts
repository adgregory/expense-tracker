import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
