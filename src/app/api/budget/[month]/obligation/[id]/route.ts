import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ month: string; id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  if (body.paid !== undefined) data.paid = body.paid;
  if (body.amount !== undefined) data.amount = body.amount;
  if (body.name !== undefined) data.name = body.name;

  const obligation = await prisma.obligation.update({
    where: { id },
    data,
  });

  return NextResponse.json(obligation);
}
