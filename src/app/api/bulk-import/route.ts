import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-key";
import { prisma } from "@/lib/prisma";
import { ingestSms } from "@/lib/services/expense-ingestion";

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { messages } = body;

  if (!Array.isArray(messages)) {
    return NextResponse.json({ error: "messages must be an array" }, { status: 400 });
  }

  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const msg of messages) {
    const { sms, bank } = msg;
    if (!sms || !bank) {
      errors.push("Missing sms or bank in message");
      continue;
    }

    const existing = await prisma.expense.findFirst({ where: { rawSms: sms } });
    if (existing) {
      skipped++;
      continue;
    }

    try {
      await ingestSms(sms, bank, msg.receivedAt);
      imported++;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      errors.push(`Failed to parse: ${sms.substring(0, 60)}... — ${message}`);
    }
  }

  return NextResponse.json({ imported, skipped, errors }, { status: 200 });
}
