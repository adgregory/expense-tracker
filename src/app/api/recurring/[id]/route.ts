import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  if (!["snoozed", "cancelled", "pending", "arrived"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await prisma.recurringExpenseMonth.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // This id is a RecurringExpenseMonth id
  // Get the parent recurring expense
  const monthEntry = await prisma.recurringExpenseMonth.findUnique({
    where: { id },
    include: { recurringExpense: true },
  });

  if (!monthEntry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Delete all month entries for this recurring expense
  await prisma.recurringExpenseMonth.deleteMany({
    where: { recurringExpenseId: monthEntry.recurringExpenseId },
  });

  // Delete the recurring expense itself
  await prisma.recurringExpense.delete({
    where: { id: monthEntry.recurringExpenseId },
  });

  // Unmark the merchant mapping as recurring
  await prisma.merchantMapping.update({
    where: { id: monthEntry.recurringExpense.merchantMappingId },
    data: { isRecurring: false },
  });

  return NextResponse.json({ deleted: true });
}
