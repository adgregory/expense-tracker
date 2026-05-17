import {
  Category,
  MerchantMapping,
  Expense,
  BudgetMonth,
  Investment,
} from "./types";

export const categories: Category[] = [
  { id: "delivery", name: "Delivery", icon: "🛵", color: "purple" },
  { id: "transportation", name: "Transportation", icon: "🚗", color: "blue" },
  { id: "groceries", name: "Groceries", icon: "🛒", color: "green" },
  { id: "flights", name: "Flights", icon: "✈️", color: "yellow" },
  { id: "subscriptions", name: "Subscriptions", icon: "💳", color: "red" },
  { id: "entertainment", name: "Entertainment", icon: "🎉", color: "purple" },
  { id: "restaurants", name: "Restaurants", icon: "🍽️", color: "orange" },
];

export const merchantMappings: MerchantMapping[] = [
  { pattern: "RAPPI", category: "delivery" },
  { pattern: "UBER", category: "transportation" },
  { pattern: "DIDI", category: "transportation" },
  { pattern: "LATAM", category: "flights" },
  { pattern: "AVIANCA", category: "flights" },
  { pattern: "DELTA", category: "flights" },
  { pattern: "CARULLA", category: "groceries" },
  { pattern: "EXITO", category: "groceries" },
  { pattern: "OLIMPICA", category: "groceries" },
  { pattern: "JUMBO", category: "groceries" },
  { pattern: "ANTHROPIC", category: "subscriptions" },
  { pattern: "OPENAI", category: "subscriptions" },
  { pattern: "CLAUDE", category: "subscriptions" },
];

export const expenses: Expense[] = [
  { id: "1", merchantName: "RESTAURANTE EL CIELO", amount: 245000, category: null, date: "2026-05-17", time: "13:30" },
  { id: "2", merchantName: "Rappi", amount: 67400, category: "delivery", date: "2026-05-17", time: "11:00" },
  { id: "3", merchantName: "Uber", amount: 23800, category: "transportation", date: "2026-05-17", time: "09:15" },
  { id: "4", merchantName: "Carulla", amount: 187200, category: "groceries", date: "2026-05-16", time: "18:30" },
  { id: "5", merchantName: "Didi", amount: 18500, category: "transportation", date: "2026-05-16", time: "14:15" },
  { id: "6", merchantName: "TIENDA TECH CO", amount: 340000, category: null, date: "2026-05-16", time: "11:00" },
  { id: "7", merchantName: "Anthropic", amount: 85000, category: "subscriptions", date: "2026-05-14", time: "00:00" },
  { id: "8", merchantName: "LATAM Airlines", amount: 890000, category: "flights", date: "2026-05-14", time: "09:20" },
  { id: "9", merchantName: "Rappi", amount: 45000, category: "delivery", date: "2026-05-13", time: "20:00" },
  { id: "10", merchantName: "Exito", amount: 234000, category: "groceries", date: "2026-05-12", time: "16:45" },
  { id: "11", merchantName: "Uber", amount: 31200, category: "transportation", date: "2026-05-12", time: "08:30" },
  { id: "12", merchantName: "Rappi", amount: 52300, category: "delivery", date: "2026-05-11", time: "19:30" },
  { id: "13", merchantName: "Olimpica", amount: 156000, category: "groceries", date: "2026-05-10", time: "10:00" },
  { id: "14", merchantName: "Didi", amount: 22000, category: "transportation", date: "2026-05-09", time: "07:45" },
  { id: "15", merchantName: "OpenAI", amount: 92000, category: "subscriptions", date: "2026-05-08", time: "00:00" },
];

export const currentBudget: BudgetMonth = {
  month: "2026-05",
  spendingLimit: 3600000,
  incomes: [
    { id: "i1", source: "Salary (COP)", amount: 4200000, date: "2026-04-30" },
    { id: "i2", source: "Salary (USD → COP)", amount: 3800000, date: "2026-04-30" },
    { id: "i3", source: "Consultancy — Client A", amount: 1500000, date: "2026-05-10" },
  ],
  obligations: [
    { id: "o1", name: "Credit Card — Bancolombia", amount: 2100000, dueDate: "2026-05-25", paid: false },
    { id: "o2", name: "Rent", amount: 2400000, dueDate: "2026-05-01", paid: true },
    { id: "o3", name: "Internet + Phone", amount: 180000, dueDate: "2026-05-20", paid: false },
  ],
};

export const investments: Investment[] = [
  {
    id: "inv1", assetName: "Gold", assetType: "precious-metal", quantity: 3.2, currentValuePerUnit: 4000000,
    transactions: [
      { id: "t1", type: "buy", quantity: 2.2, pricePerUnit: 3600000, date: "2025-11-15" },
      { id: "t2", type: "buy", quantity: 1.0, pricePerUnit: 3900000, date: "2026-04-28" },
    ],
  },
  {
    id: "inv2", assetName: "Precious Stones", assetType: "precious-stones", quantity: 1, currentValuePerUnit: 3200000,
    transactions: [
      { id: "t3", type: "buy", quantity: 1, pricePerUnit: 2800000, date: "2025-09-01" },
    ],
  },
  {
    id: "inv3", assetName: "Bitcoin", assetType: "crypto", quantity: 0.015, currentValuePerUnit: 110000000,
    transactions: [
      { id: "t4", type: "buy", quantity: 0.01, pricePerUnit: 115000000, date: "2026-04-15" },
      { id: "t5", type: "buy", quantity: 0.005, pricePerUnit: 108000000, date: "2026-05-10" },
    ],
  },
  {
    id: "inv4", assetName: "XRP", assetType: "crypto", quantity: 500, currentValuePerUnit: 1600,
    transactions: [
      { id: "t6", type: "buy", quantity: 300, pricePerUnit: 1400, date: "2026-03-20" },
      { id: "t7", type: "buy", quantity: 200, pricePerUnit: 1500, date: "2026-05-03" },
    ],
  },
];

export const dailySpending: { date: string; amount: number }[] = [
  { date: "2026-05-01", amount: 120000 },
  { date: "2026-05-02", amount: 85000 },
  { date: "2026-05-03", amount: 210000 },
  { date: "2026-05-04", amount: 45000 },
  { date: "2026-05-05", amount: 167000 },
  { date: "2026-05-06", amount: 92000 },
  { date: "2026-05-07", amount: 0 },
  { date: "2026-05-08", amount: 92000 },
  { date: "2026-05-09", amount: 22000 },
  { date: "2026-05-10", amount: 156000 },
  { date: "2026-05-11", amount: 52300 },
  { date: "2026-05-12", amount: 265200 },
  { date: "2026-05-13", amount: 45000 },
  { date: "2026-05-14", amount: 975000 },
  { date: "2026-05-15", amount: 0 },
  { date: "2026-05-16", amount: 545700 },
  { date: "2026-05-17", amount: 336200 },
];
