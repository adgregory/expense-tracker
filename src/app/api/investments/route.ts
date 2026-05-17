import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const investments = await prisma.investment.findMany({
    include: { transactions: { orderBy: { date: "desc" } } },
  });
  return NextResponse.json(investments);
}
