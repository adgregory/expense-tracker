import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-key";
import { ingestSms } from "@/lib/services/expense-ingestion";

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { sms, bank, receivedAt } = body;

  if (!sms || !bank) {
    return NextResponse.json({ error: "Missing sms or bank" }, { status: 400 });
  }

  try {
    const result = await ingestSms(sms, bank, receivedAt);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
