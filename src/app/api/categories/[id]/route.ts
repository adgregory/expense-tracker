import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.icon !== undefined) data.icon = body.icon;
  if (body.color !== undefined) data.color = body.color;

  const category = await prisma.category.update({
    where: { id },
    data,
  });

  return NextResponse.json(category);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Unlink expenses from this category first
  await prisma.expense.updateMany({
    where: { categoryId: id },
    data: { categoryId: null },
  });

  // Delete merchant mappings
  await prisma.merchantMapping.deleteMany({
    where: { categoryId: id },
  });

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
