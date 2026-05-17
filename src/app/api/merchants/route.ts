import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const mappings = await prisma.merchantMapping.findMany({
    include: { category: true },
    orderBy: { pattern: "asc" },
  });
  return NextResponse.json(mappings);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { pattern, categoryId, isRecurring } = body;

  if (!pattern || !categoryId) {
    return NextResponse.json({ error: "Missing pattern or categoryId" }, { status: 400 });
  }

  const mapping = await prisma.merchantMapping.upsert({
    where: { pattern: pattern.toUpperCase() },
    update: { categoryId, isRecurring: isRecurring ?? false },
    create: { pattern: pattern.toUpperCase(), categoryId, isRecurring: isRecurring ?? false },
  });

  return NextResponse.json(mapping, { status: 201 });
}
