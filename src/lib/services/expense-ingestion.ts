import { prisma } from "@/lib/prisma";
import { smsRegistry, normalizeMerchant } from "@/lib/sms";

interface IngestResult {
  id: string;
  merchant: string;
  amount: number;
  categorized: boolean;
  recurring: boolean;
}

export async function ingestSms(
  sms: string,
  bank: string,
  receivedAt?: string
): Promise<IngestResult> {
  const parsed = smsRegistry.parse(sms, bank);
  const normalized = normalizeMerchant(parsed.merchant);

  // Use receivedAt for Format B fallback date/time
  if (receivedAt && parsed.date === new Date().toISOString().split("T")[0]) {
    const dt = new Date(receivedAt);
    if (!isNaN(dt.getTime())) {
      parsed.date = dt.toISOString().split("T")[0];
      parsed.time = dt.toTimeString().split(" ")[0];
    }
  }

  // Find matching merchant mapping (startsWith match, longest first)
  const mappings = await prisma.merchantMapping.findMany({
    include: { recurringExpense: true },
  });

  const mapping = mappings
    .sort((a, b) => b.pattern.length - a.pattern.length)
    .find((m) => normalized.startsWith(m.pattern));

  const expense = await prisma.expense.create({
    data: {
      merchantName: parsed.merchant,
      merchantNormalized: normalized,
      amount: parsed.amount,
      categoryId: mapping?.categoryId ?? null,
      bank,
      cardLast4: parsed.cardLast4,
      date: parsed.date,
      time: parsed.time,
      rawSms: sms,
      isRecurring: mapping?.isRecurring ?? false,
    },
  });

  // Handle recurring tracking
  if (mapping?.isRecurring && mapping.recurringExpense) {
    const month = parsed.date.substring(0, 7);
    await prisma.recurringExpenseMonth.upsert({
      where: {
        recurringExpenseId_month: {
          recurringExpenseId: mapping.recurringExpense.id,
          month,
        },
      },
      update: { status: "arrived", expenseId: expense.id },
      create: {
        recurringExpenseId: mapping.recurringExpense.id,
        month,
        status: "arrived",
        expenseId: expense.id,
      },
    });
  }

  return {
    id: expense.id,
    merchant: parsed.merchant,
    amount: parsed.amount,
    categorized: !!mapping,
    recurring: mapping?.isRecurring ?? false,
  };
}
