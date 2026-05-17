import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ month: string; id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  if (body.source !== undefined) data.source = body.source;
  if (body.amount !== undefined) data.amount = body.amount;

  const income = await prisma.income.update({
    where: { id },
    data,
  });

  return NextResponse.json(income);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ month: string; id: string }> }
) {
  const { id } = await params;
  await prisma.income.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
