import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, icon, color } = body;

  if (!name || !icon || !color) {
    return NextResponse.json({ error: "Missing name, icon, or color" }, { status: 400 });
  }

  const category = await prisma.category.create({ data: { name, icon, color } });
  return NextResponse.json(category, { status: 201 });
}
