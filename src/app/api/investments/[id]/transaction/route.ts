import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { type, quantity, pricePerUnit, date, notes } = body;

  if (!type || !quantity || !pricePerUnit || !date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const investment = await prisma.investment.findUnique({ where: { id } });
  if (!investment) {
    return NextResponse.json({ error: "Investment not found" }, { status: 404 });
  }

  const tx = await prisma.investmentTransaction.create({
    data: { investmentId: id, type, quantity, pricePerUnit, date, notes },
  });

  return NextResponse.json(tx, { status: 201 });
}
