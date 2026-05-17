import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = await Promise.all([
    prisma.category.upsert({ where: { name: "Delivery" }, update: {}, create: { name: "Delivery", icon: "🛵", color: "purple" } }),
    prisma.category.upsert({ where: { name: "Transportation" }, update: {}, create: { name: "Transportation", icon: "🚗", color: "blue" } }),
    prisma.category.upsert({ where: { name: "Groceries" }, update: {}, create: { name: "Groceries", icon: "🛒", color: "green" } }),
    prisma.category.upsert({ where: { name: "Flights" }, update: {}, create: { name: "Flights", icon: "✈️", color: "yellow" } }),
    prisma.category.upsert({ where: { name: "Subscriptions" }, update: {}, create: { name: "Subscriptions", icon: "💳", color: "red" } }),
    prisma.category.upsert({ where: { name: "Entertainment" }, update: {}, create: { name: "Entertainment", icon: "🎉", color: "purple" } }),
    prisma.category.upsert({ where: { name: "Restaurants" }, update: {}, create: { name: "Restaurants", icon: "🍽️", color: "orange" } }),
  ]);

  const catMap: Record<string, string> = {};
  categories.forEach((c) => { catMap[c.name] = c.id; });

  const mappings = [
    { pattern: "RAPPI", category: "Delivery", isRecurring: false },
    { pattern: "UBER", category: "Transportation", isRecurring: false },
    { pattern: "DIDI", category: "Transportation", isRecurring: false },
    { pattern: "LATAM AIRLINES", category: "Flights", isRecurring: false },
    { pattern: "AVIANCA", category: "Flights", isRecurring: false },
    { pattern: "DELTA", category: "Flights", isRecurring: false },
    { pattern: "CARULLA", category: "Groceries", isRecurring: false },
    { pattern: "EXITO", category: "Groceries", isRecurring: false },
    { pattern: "OLIMPICA", category: "Groceries", isRecurring: false },
    { pattern: "JUMBO", category: "Groceries", isRecurring: false },
    { pattern: "ANTHROPIC", category: "Subscriptions", isRecurring: true },
    { pattern: "OPENAI", category: "Subscriptions", isRecurring: true },
    { pattern: "CLAUDE", category: "Subscriptions", isRecurring: true },
    { pattern: "GOOGLE", category: "Subscriptions", isRecurring: true },
    { pattern: "AMAZON PRIME", category: "Subscriptions", isRecurring: true },
    { pattern: "AIRBNB", category: "Flights", isRecurring: false },
  ];

  for (const m of mappings) {
    const mapping = await prisma.merchantMapping.upsert({
      where: { pattern: m.pattern },
      update: {},
      create: {
        pattern: m.pattern,
        categoryId: catMap[m.category],
        isRecurring: m.isRecurring,
      },
    });

    if (m.isRecurring) {
      await prisma.recurringExpense.upsert({
        where: { merchantMappingId: mapping.id },
        update: {},
        create: {
          merchantMappingId: mapping.id,
          label: m.pattern,
        },
      });
    }
  }

  console.log("Seed complete");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
