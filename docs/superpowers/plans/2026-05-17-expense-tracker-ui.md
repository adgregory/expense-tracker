# Expense Tracker UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully functional expense tracker PWA UI with mock data — 5 pages (Dashboard, Expenses, Budget, Analytics, Investments), dark fintech aesthetic, merchant categorization flow, responsive layout.

**Architecture:** Next.js 14 App Router with TypeScript. Pages live in `app/(tabs)/` with a shared layout providing responsive navigation (bottom tabs on mobile, sidebar on desktop). Mock data lives in `lib/mock-data.ts` with types in `lib/types.ts`. State managed via React context (`lib/context/`). shadcn/ui components customized with dark fintech theme.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Recharts, next-pwa

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata, providers)
│   ├── globals.css             # Tailwind + CSS variables (design tokens)
│   ├── manifest.ts             # PWA manifest
│   ├── page.tsx                # Redirect to /dashboard
│   └── (tabs)/
│       ├── layout.tsx          # Shared layout with nav (bottom tabs / sidebar)
│       ├── dashboard/
│       │   └── page.tsx        # Dashboard page
│       ├── expenses/
│       │   └── page.tsx        # Expenses page
│       ├── budget/
│       │   └── page.tsx        # Budget page
│       ├── analytics/
│       │   └── page.tsx        # Analytics page
│       └── investments/
│           └── page.tsx        # Investments page
├── components/
│   ├── ui/                     # shadcn components (auto-generated)
│   ├── layout/
│   │   ├── bottom-nav.tsx      # Mobile bottom tab bar
│   │   ├── sidebar.tsx         # Desktop sidebar navigation
│   │   └── nav-items.ts       # Shared nav config (labels, icons, paths)
│   ├── dashboard/
│   │   ├── budget-ring.tsx     # Circular progress ring card
│   │   ├── quick-stats.tsx     # 3 mini stat cards
│   │   ├── merchant-alert.tsx  # Unknown merchant alert card
│   │   ├── weekly-chart.tsx    # 7-day bar chart
│   │   └── recent-expenses.tsx # Last 5 transactions list
│   ├── expenses/
│   │   ├── expense-list.tsx    # Date-grouped expense list
│   │   ├── expense-item.tsx    # Single expense row
│   │   ├── filter-pills.tsx    # Horizontal category filter
│   │   ├── search-bar.tsx      # Search input
│   │   └── categorize-sheet.tsx # Bottom sheet for categorization
│   ├── budget/
│   │   ├── spending-limit-card.tsx  # Big glowing limit display
│   │   ├── income-section.tsx       # Income list + add
│   │   ├── obligations-section.tsx  # Obligations list + add
│   │   └── budget-summary.tsx       # Summary calculations
│   ├── analytics/
│   │   ├── time-range-tabs.tsx      # Week/Month/3Mo/Year
│   │   ├── category-donut.tsx       # Donut chart + legend
│   │   ├── daily-spending-chart.tsx # Area chart with limit line
│   │   ├── month-comparison.tsx     # Grouped bar chart
│   │   ├── top-merchants.tsx        # Horizontal bar ranking
│   │   └── insight-cards.tsx        # Auto-generated insight cards
│   └── investments/
│       ├── portfolio-total.tsx      # Total value card
│       ├── holdings-list.tsx        # Asset holdings
│       ├── investment-form.tsx      # Buy/sell log form
│       └── activity-log.tsx         # Recent transactions
├── lib/
│   ├── types.ts                # All TypeScript interfaces
│   ├── mock-data.ts            # Mock data matching interfaces
│   ├── utils.ts                # Currency formatting, date helpers
│   └── context/
│       ├── app-context.tsx     # Global state provider
│       └── use-app.ts         # Hook to access context
└── public/
    ├── icons/                  # PWA icons (192, 512)
    └── sw.js                   # Service worker (generated)
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.js`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`

- [ ] **Step 1: Initialize Next.js project**

Run:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Expected: Project scaffolded with `src/app/` structure, `package.json` with next/react/tailwind deps.

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm install recharts lucide-react class-variance-authority clsx tailwind-merge next-pwa
npm install -D @types/node
```

- [ ] **Step 3: Initialize shadcn/ui**

Run:
```bash
npx shadcn@latest init
```

When prompted, select:
- Style: Default
- Base color: Slate
- CSS variables: Yes
- `src/app/globals.css` for global CSS
- CSS variables for colors: Yes
- `tailwind.config.ts`
- Components directory: `src/components/ui`
- Utils location: `src/lib/utils.ts`

- [ ] **Step 4: Install shadcn components we need**

Run:
```bash
npx shadcn@latest add button card dialog input sheet progress tabs toast scroll-area separator badge
```

- [ ] **Step 5: Set up global CSS with design tokens**

Replace `src/app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 240 10% 4%;
    --foreground: 240 10% 96%;
    --card: 240 15% 9%;
    --card-foreground: 240 10% 96%;
    --popover: 240 15% 9%;
    --popover-foreground: 240 10% 96%;
    --primary: 160 100% 45%;
    --primary-foreground: 240 10% 4%;
    --secondary: 240 15% 12%;
    --secondary-foreground: 240 10% 96%;
    --muted: 240 15% 20%;
    --muted-foreground: 240 10% 45%;
    --accent: 240 15% 15%;
    --accent-foreground: 240 10% 96%;
    --destructive: 348 100% 65%;
    --destructive-foreground: 240 10% 96%;
    --border: 240 15% 18%;
    --input: 240 15% 18%;
    --ring: 160 100% 45%;
    --radius: 1rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
    -webkit-font-smoothing: antialiased;
  }
}

/* Custom color tokens for categories */
:root {
  --color-green: #00e68a;
  --color-green-dim: #00e68a33;
  --color-red: #ff4d6a;
  --color-red-dim: #ff4d6a33;
  --color-blue: #4d9fff;
  --color-blue-dim: #4d9fff33;
  --color-purple: #a855f7;
  --color-purple-dim: #a855f733;
  --color-yellow: #fbbf24;
  --color-yellow-dim: #fbbf2433;
  --color-orange: #f97316;
  --color-orange-dim: #f9731633;
  --color-cyan: #22d3ee;
  --color-cyan-dim: #22d3ee33;
}

/* Safe area for PWA */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```

- [ ] **Step 6: Set up root layout**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Personal expense tracker with SMS automation",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Expenses",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Create redirect from root to dashboard**

Replace `src/app/page.tsx`:

```tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
```

- [ ] **Step 8: Create PWA manifest**

Create `public/manifest.json`:

```json
{
  "name": "Expense Tracker",
  "short_name": "Expenses",
  "description": "Personal expense tracker",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#0a0a0f",
  "theme_color": "#0a0a0f",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

- [ ] **Step 9: Create placeholder PWA icons**

Create `public/icons/` directory and add a simple SVG placeholder that Next.js can serve:

Create `public/icons/icon-192.png` and `public/icons/icon-512.png` — for now, generate these with a script:

```bash
mkdir -p public/icons
# Create simple placeholder SVG converted to reference
# We'll use a green circle as placeholder — real icons can be added later
cat > public/icons/icon.svg << 'ICON'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#0a0a0f"/>
  <text x="256" y="320" text-anchor="middle" font-size="240" font-family="system-ui" fill="#00e68a">$</text>
</svg>
ICON
```

Note: For proper PWA icons, convert this SVG to PNG later. The app will still work without them.

- [ ] **Step 10: Verify project runs**

Run:
```bash
npm run dev
```

Expected: Server starts on localhost:3000, redirects to /dashboard (which will 404 for now — that's fine).

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with shadcn/ui and dark theme"
```

---

## Task 2: Types and Mock Data

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/mock-data.ts`
- Create: `src/lib/utils.ts`

- [ ] **Step 1: Create type definitions**

Create `src/lib/types.ts`:

```typescript
export interface Expense {
  id: string;
  merchantName: string;
  amount: number;
  category: string | null;
  date: string;
  time: string;
  rawSms?: string;
}

export interface MerchantMapping {
  pattern: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
}

export interface Obligation {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  paid: boolean;
}

export interface BudgetMonth {
  month: string;
  spendingLimit: number;
  incomes: Income[];
  obligations: Obligation[];
}

export interface Investment {
  id: string;
  assetName: string;
  assetType: string;
  quantity: number;
  currentValuePerUnit: number;
  transactions: InvestmentTransaction[];
}

export interface InvestmentTransaction {
  id: string;
  type: "buy" | "sell";
  quantity: number;
  pricePerUnit: number;
  date: string;
  notes?: string;
}

export type TimeRange = "week" | "month" | "3months" | "year";
```

- [ ] **Step 2: Create utility functions**

Update `src/lib/utils.ts` (shadcn already created this file with `cn`):

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactCOP(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${Math.round(amount / 1_000)}K`;
  }
  return formatCOP(amount);
}

export function getDaysRemainingInMonth(): number {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return lastDay - now.getDate();
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateStr === today.toISOString().split("T")[0]) return "Today";
  if (dateStr === yesterday.toISOString().split("T")[0]) return "Yesterday";

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
```

- [ ] **Step 3: Create mock data**

Create `src/lib/mock-data.ts`:

```typescript
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
  {
    id: "1",
    merchantName: "RESTAURANTE EL CIELO",
    amount: 245000,
    category: null,
    date: "2026-05-17",
    time: "13:30",
  },
  {
    id: "2",
    merchantName: "Rappi",
    amount: 67400,
    category: "delivery",
    date: "2026-05-17",
    time: "11:00",
  },
  {
    id: "3",
    merchantName: "Uber",
    amount: 23800,
    category: "transportation",
    date: "2026-05-17",
    time: "09:15",
  },
  {
    id: "4",
    merchantName: "Carulla",
    amount: 187200,
    category: "groceries",
    date: "2026-05-16",
    time: "18:30",
  },
  {
    id: "5",
    merchantName: "Didi",
    amount: 18500,
    category: "transportation",
    date: "2026-05-16",
    time: "14:15",
  },
  {
    id: "6",
    merchantName: "TIENDA TECH CO",
    amount: 340000,
    category: null,
    date: "2026-05-16",
    time: "11:00",
  },
  {
    id: "7",
    merchantName: "Anthropic",
    amount: 85000,
    category: "subscriptions",
    date: "2026-05-14",
    time: "00:00",
  },
  {
    id: "8",
    merchantName: "LATAM Airlines",
    amount: 890000,
    category: "flights",
    date: "2026-05-14",
    time: "09:20",
  },
  {
    id: "9",
    merchantName: "Rappi",
    amount: 45000,
    category: "delivery",
    date: "2026-05-13",
    time: "20:00",
  },
  {
    id: "10",
    merchantName: "Exito",
    amount: 234000,
    category: "groceries",
    date: "2026-05-12",
    time: "16:45",
  },
  {
    id: "11",
    merchantName: "Uber",
    amount: 31200,
    category: "transportation",
    date: "2026-05-12",
    time: "08:30",
  },
  {
    id: "12",
    merchantName: "Rappi",
    amount: 52300,
    category: "delivery",
    date: "2026-05-11",
    time: "19:30",
  },
  {
    id: "13",
    merchantName: "Olimpica",
    amount: 156000,
    category: "groceries",
    date: "2026-05-10",
    time: "10:00",
  },
  {
    id: "14",
    merchantName: "Didi",
    amount: 22000,
    category: "transportation",
    date: "2026-05-09",
    time: "07:45",
  },
  {
    id: "15",
    merchantName: "OpenAI",
    amount: 92000,
    category: "subscriptions",
    date: "2026-05-08",
    time: "00:00",
  },
];

export const currentBudget: BudgetMonth = {
  month: "2026-05",
  spendingLimit: 3600000,
  incomes: [
    { id: "i1", source: "Salary (COP)", amount: 4200000, date: "2026-04-30" },
    {
      id: "i2",
      source: "Salary (USD → COP)",
      amount: 3800000,
      date: "2026-04-30",
    },
    {
      id: "i3",
      source: "Consultancy — Client A",
      amount: 1500000,
      date: "2026-05-10",
    },
  ],
  obligations: [
    {
      id: "o1",
      name: "Credit Card — Bancolombia",
      amount: 2100000,
      dueDate: "2026-05-25",
      paid: false,
    },
    {
      id: "o2",
      name: "Rent",
      amount: 2400000,
      dueDate: "2026-05-01",
      paid: true,
    },
    {
      id: "o3",
      name: "Internet + Phone",
      amount: 180000,
      dueDate: "2026-05-20",
      paid: false,
    },
  ],
};

export const investments: Investment[] = [
  {
    id: "inv1",
    assetName: "Gold",
    assetType: "precious-metal",
    quantity: 3.2,
    currentValuePerUnit: 4000000,
    transactions: [
      {
        id: "t1",
        type: "buy",
        quantity: 2.2,
        pricePerUnit: 3600000,
        date: "2025-11-15",
      },
      {
        id: "t2",
        type: "buy",
        quantity: 1.0,
        pricePerUnit: 3900000,
        date: "2026-04-28",
      },
    ],
  },
  {
    id: "inv2",
    assetName: "Precious Stones",
    assetType: "precious-stones",
    quantity: 1,
    currentValuePerUnit: 3200000,
    transactions: [
      {
        id: "t3",
        type: "buy",
        quantity: 1,
        pricePerUnit: 2800000,
        date: "2025-09-01",
      },
    ],
  },
  {
    id: "inv3",
    assetName: "Bitcoin",
    assetType: "crypto",
    quantity: 0.015,
    currentValuePerUnit: 110000000,
    transactions: [
      {
        id: "t4",
        type: "buy",
        quantity: 0.01,
        pricePerUnit: 115000000,
        date: "2026-04-15",
      },
      {
        id: "t5",
        type: "buy",
        quantity: 0.005,
        pricePerUnit: 108000000,
        date: "2026-05-10",
      },
    ],
  },
  {
    id: "inv4",
    assetName: "XRP",
    assetType: "crypto",
    quantity: 500,
    currentValuePerUnit: 1600,
    transactions: [
      {
        id: "t6",
        type: "buy",
        quantity: 300,
        pricePerUnit: 1400,
        date: "2026-03-20",
      },
      {
        id: "t7",
        type: "buy",
        quantity: 200,
        pricePerUnit: 1500,
        date: "2026-05-03",
      },
    ],
  },
];

// Helper: daily spending for the current month (for charts)
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
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/types.ts src/lib/mock-data.ts src/lib/utils.ts
git commit -m "feat: add type definitions, mock data, and utility functions"
```

---

## Task 3: App Context (State Management)

**Files:**
- Create: `src/lib/context/app-context.tsx`
- Create: `src/lib/context/use-app.ts`

- [ ] **Step 1: Create the app context provider**

Create `src/lib/context/app-context.tsx`:

```tsx
"use client";

import React, { createContext, useState, useCallback } from "react";
import {
  Expense,
  Category,
  MerchantMapping,
  BudgetMonth,
  Investment,
  Income,
  Obligation,
} from "@/lib/types";
import {
  expenses as initialExpenses,
  categories as initialCategories,
  merchantMappings as initialMappings,
  currentBudget as initialBudget,
  investments as initialInvestments,
} from "@/lib/mock-data";

export interface AppState {
  expenses: Expense[];
  categories: Category[];
  merchantMappings: MerchantMapping[];
  budget: BudgetMonth;
  investments: Investment[];
  categorizeExpense: (expenseId: string, categoryId: string, remember: boolean) => void;
  addCategory: (name: string, icon: string, color: string) => void;
  updateSpendingLimit: (amount: number) => void;
  addIncome: (income: Omit<Income, "id">) => void;
  addObligation: (obligation: Omit<Obligation, "id">) => void;
  toggleObligationPaid: (id: string) => void;
  addInvestmentTransaction: (
    investmentId: string,
    transaction: { type: "buy" | "sell"; quantity: number; pricePerUnit: number; date: string; notes?: string }
  ) => void;
}

export const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [merchantMappings, setMerchantMappings] = useState<MerchantMapping[]>(initialMappings);
  const [budget, setBudget] = useState<BudgetMonth>(initialBudget);
  const [investments, setInvestments] = useState<Investment[]>(initialInvestments);

  const categorizeExpense = useCallback(
    (expenseId: string, categoryId: string, remember: boolean) => {
      setExpenses((prev) =>
        prev.map((e) => (e.id === expenseId ? { ...e, category: categoryId } : e))
      );
      if (remember) {
        const expense = expenses.find((e) => e.id === expenseId);
        if (expense) {
          setMerchantMappings((prev) => [
            ...prev,
            { pattern: expense.merchantName.toUpperCase(), category: categoryId },
          ]);
        }
      }
    },
    [expenses]
  );

  const addCategory = useCallback((name: string, icon: string, color: string) => {
    const id = name.toLowerCase().replace(/\s+/g, "-");
    setCategories((prev) => [...prev, { id, name, icon, color }]);
  }, []);

  const updateSpendingLimit = useCallback((amount: number) => {
    setBudget((prev) => ({ ...prev, spendingLimit: amount }));
  }, []);

  const addIncome = useCallback((income: Omit<Income, "id">) => {
    const id = `i${Date.now()}`;
    setBudget((prev) => ({
      ...prev,
      incomes: [...prev.incomes, { ...income, id }],
    }));
  }, []);

  const addObligation = useCallback((obligation: Omit<Obligation, "id">) => {
    const id = `o${Date.now()}`;
    setBudget((prev) => ({
      ...prev,
      obligations: [...prev.obligations, { ...obligation, id }],
    }));
  }, []);

  const toggleObligationPaid = useCallback((id: string) => {
    setBudget((prev) => ({
      ...prev,
      obligations: prev.obligations.map((o) =>
        o.id === id ? { ...o, paid: !o.paid } : o
      ),
    }));
  }, []);

  const addInvestmentTransaction = useCallback(
    (
      investmentId: string,
      transaction: { type: "buy" | "sell"; quantity: number; pricePerUnit: number; date: string; notes?: string }
    ) => {
      const txId = `t${Date.now()}`;
      setInvestments((prev) =>
        prev.map((inv) => {
          if (inv.id !== investmentId) return inv;
          const newQty =
            transaction.type === "buy"
              ? inv.quantity + transaction.quantity
              : inv.quantity - transaction.quantity;
          return {
            ...inv,
            quantity: newQty,
            transactions: [...inv.transactions, { ...transaction, id: txId }],
          };
        })
      );
    },
    []
  );

  return (
    <AppContext.Provider
      value={{
        expenses,
        categories,
        merchantMappings,
        budget,
        investments,
        categorizeExpense,
        addCategory,
        updateSpendingLimit,
        addIncome,
        addObligation,
        toggleObligationPaid,
        addInvestmentTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
```

- [ ] **Step 2: Create the hook**

Create `src/lib/context/use-app.ts`:

```typescript
"use client";

import { useContext } from "react";
import { AppContext, AppState } from "./app-context";

export function useApp(): AppState {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
```

- [ ] **Step 3: Wire provider into root layout**

Update `src/app/layout.tsx` — wrap `{children}` with the provider:

```tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppProvider } from "@/lib/context/app-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Personal expense tracker with SMS automation",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Expenses",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/context/
git commit -m "feat: add app context with state management for expenses, budget, investments"
```

---

## Task 4: Navigation Layout (Bottom Tabs + Sidebar)

**Files:**
- Create: `src/components/layout/nav-items.ts`
- Create: `src/components/layout/bottom-nav.tsx`
- Create: `src/components/layout/sidebar.tsx`
- Create: `src/app/(tabs)/layout.tsx`

- [ ] **Step 1: Create nav configuration**

Create `src/components/layout/nav-items.ts`:

```typescript
import { Home, Receipt, Wallet, TrendingUp, Coins } from "lucide-react";

export const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Expenses", href: "/expenses", icon: Receipt },
  { label: "Budget", href: "/budget", icon: Wallet },
  { label: "Analytics", href: "/analytics", icon: TrendingUp },
  { label: "Invest", href: "/investments", icon: Coins },
] as const;
```

- [ ] **Step 2: Create bottom nav component**

Create `src/components/layout/bottom-nav.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-secondary/80 backdrop-blur-xl safe-bottom md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "text-[--color-green]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Create sidebar component**

Create `src/components/layout/sidebar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-[220px] md:flex-col md:fixed md:inset-y-0 border-r border-border bg-secondary">
      <div className="p-6">
        <h1 className="text-lg font-bold text-[--color-green]">💸 Tracker</h1>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-[--color-green-dim] text-[--color-green]"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
```

- [ ] **Step 4: Create tabs layout**

Create `src/app/(tabs)/layout.tsx`:

```tsx
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:ml-[220px] pb-24 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
```

- [ ] **Step 5: Create placeholder pages for all tabs**

Create `src/app/(tabs)/dashboard/page.tsx`:
```tsx
export default function DashboardPage() {
  return <div className="p-6"><h1 className="text-2xl font-bold">Dashboard</h1></div>;
}
```

Create `src/app/(tabs)/expenses/page.tsx`:
```tsx
export default function ExpensesPage() {
  return <div className="p-6"><h1 className="text-2xl font-bold">Expenses</h1></div>;
}
```

Create `src/app/(tabs)/budget/page.tsx`:
```tsx
export default function BudgetPage() {
  return <div className="p-6"><h1 className="text-2xl font-bold">Budget</h1></div>;
}
```

Create `src/app/(tabs)/analytics/page.tsx`:
```tsx
export default function AnalyticsPage() {
  return <div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1></div>;
}
```

Create `src/app/(tabs)/investments/page.tsx`:
```tsx
export default function InvestmentsPage() {
  return <div className="p-6"><h1 className="text-2xl font-bold">Investments</h1></div>;
}
```

- [ ] **Step 6: Verify navigation works**

Run `npm run dev`. Navigate to localhost:3000. Should redirect to /dashboard. Bottom nav visible on mobile viewport. Sidebar visible on desktop. All tabs navigate correctly.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/ src/app/\(tabs\)/
git commit -m "feat: add responsive navigation layout with bottom tabs and sidebar"
```

---

## Task 5: Dashboard Page

**Files:**
- Create: `src/components/dashboard/budget-ring.tsx`
- Create: `src/components/dashboard/quick-stats.tsx`
- Create: `src/components/dashboard/merchant-alert.tsx`
- Create: `src/components/dashboard/weekly-chart.tsx`
- Create: `src/components/dashboard/recent-expenses.tsx`
- Modify: `src/app/(tabs)/dashboard/page.tsx`

- [ ] **Step 1: Create budget ring component**

Create `src/components/dashboard/budget-ring.tsx`:

```tsx
"use client";

import { useApp } from "@/lib/context/use-app";
import { formatCOP } from "@/lib/utils";
import { getDaysRemainingInMonth } from "@/lib/utils";

export function BudgetRing() {
  const { expenses, budget } = useApp();

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget.spendingLimit - totalSpent;
  const percentage = Math.max(0, Math.min(100, (remaining / budget.spendingLimit) * 100));
  const daysLeft = getDaysRemainingInMonth();
  const perDay = daysLeft > 0 ? Math.round(remaining / daysLeft) : 0;

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  return (
    <div className="relative rounded-2xl border border-border bg-card p-6 overflow-hidden">
      <div className="absolute -top-1/2 -right-1/4 w-[200px] h-[200px] bg-[radial-gradient(circle,var(--color-green-dim)_0%,transparent_70%)] pointer-events-none" />
      <div className="flex items-center gap-6 relative">
        {/* Ring */}
        <div className="relative w-[120px] h-[120px] flex-shrink-0">
          <svg className="w-[120px] h-[120px] -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="8"
            />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="var(--color-green)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="drop-shadow-[0_0_6px_rgba(0,230,138,0.4)] transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold">{Math.round(percentage)}%</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">remaining</span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Available</p>
          <p className="text-2xl font-bold tracking-tight mb-3">{formatCOP(Math.max(0, remaining))}</p>
          <div className="flex gap-4">
            <div>
              <p className="text-sm font-semibold text-[--color-red]">{formatCOP(totalSpent)}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Spent</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[--color-green]">{formatCOP(Math.max(0, perDay))}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Per day</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create quick stats component**

Create `src/components/dashboard/quick-stats.tsx`:

```tsx
"use client";

import { useApp } from "@/lib/context/use-app";
import { formatCompactCOP } from "@/lib/utils";

export function QuickStats() {
  const { expenses, budget } = useApp();

  const totalIncome = budget.incomes.reduce((sum, i) => sum + i.amount, 0);
  const txCount = expenses.length;
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const daysWithExpenses = new Set(expenses.map((e) => e.date)).size;
  const avgPerDay = daysWithExpenses > 0 ? Math.round(totalSpent / daysWithExpenses) : 0;

  const stats = [
    { value: String(txCount), label: "Transactions" },
    { value: formatCompactCOP(totalIncome), label: "Income", green: true },
    { value: formatCompactCOP(avgPerDay), label: "Avg/day" },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-border bg-card p-3.5 text-center"
        >
          <p className={`text-base font-bold ${stat.green ? "text-[--color-green]" : ""}`}>
            {stat.value}
          </p>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create merchant alert component**

Create `src/components/dashboard/merchant-alert.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useApp } from "@/lib/context/use-app";
import { formatCOP } from "@/lib/utils";

export function MerchantAlert() {
  const { expenses } = useApp();

  const uncategorized = expenses.filter((e) => e.category === null);
  if (uncategorized.length === 0) return null;

  const first = uncategorized[0];

  return (
    <Link
      href="/expenses"
      className="flex items-center gap-3 rounded-xl border border-[--color-yellow]/30 bg-[--color-yellow-dim] p-3.5"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[--color-yellow] text-black font-bold text-sm flex-shrink-0">
        ?
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold truncate">{first.merchantName}</p>
        <p className="text-[11px] text-muted-foreground">
          {formatCOP(first.amount)} — Needs category
          {uncategorized.length > 1 && ` (+${uncategorized.length - 1} more)`}
        </p>
      </div>
      <span className="text-[11px] text-[--color-yellow] font-semibold whitespace-nowrap">
        Categorize →
      </span>
    </Link>
  );
}
```

- [ ] **Step 4: Create weekly chart component**

Create `src/components/dashboard/weekly-chart.tsx`:

```tsx
"use client";

import { dailySpending } from "@/lib/mock-data";

export function WeeklyChart() {
  // Get last 7 days of spending
  const last7 = dailySpending.slice(-7);
  const maxAmount = Math.max(...last7.map((d) => d.amount), 1);
  const dayLabels = ["L", "M", "M", "J", "V", "S", "D"];

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[15px] font-semibold">This Week</h3>
        <span className="text-xs text-[--color-blue]">Details</span>
      </div>
      <div className="flex items-end gap-1.5 h-[60px]">
        {last7.map((day, i) => {
          const height = day.amount > 0 ? Math.max(8, (day.amount / maxAmount) * 100) : 4;
          const isToday = i === last7.length - 1;
          return (
            <div
              key={day.date}
              className={`flex-1 rounded-t transition-all ${
                isToday
                  ? "bg-gradient-to-t from-[--color-green] to-[--color-green]/50 shadow-[0_0_8px_var(--color-green-dim)]"
                  : "bg-border"
              }`}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
      <div className="flex gap-1.5 mt-1.5">
        {dayLabels.map((label, i) => (
          <span key={i} className="flex-1 text-center text-[9px] text-muted-foreground">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create recent expenses component**

Create `src/components/dashboard/recent-expenses.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useApp } from "@/lib/context/use-app";
import { formatCOP } from "@/lib/utils";

export function RecentExpenses() {
  const { expenses, categories } = useApp();

  const recent = expenses.slice(0, 5);

  const getCategoryInfo = (categoryId: string | null) => {
    if (!categoryId) return { icon: "❓", color: "orange" };
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? { icon: cat.icon, color: cat.color } : { icon: "❓", color: "orange" };
  };

  const colorMap: Record<string, string> = {
    purple: "bg-[--color-purple-dim]",
    blue: "bg-[--color-blue-dim]",
    green: "bg-[--color-green-dim]",
    yellow: "bg-[--color-yellow-dim]",
    red: "bg-[--color-red-dim]",
    orange: "bg-[--color-orange-dim] border border-dashed border-[--color-orange]",
    cyan: "bg-[--color-cyan-dim]",
  };

  const getTimeAgo = (date: string, time: string): string => {
    const expDate = new Date(`${date}T${time}`);
    const now = new Date();
    const diffMs = now.getTime() - expDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[15px] font-semibold">Recent</h3>
        <Link href="/expenses" className="text-xs text-[--color-blue]">
          View all
        </Link>
      </div>
      <div className="space-y-0">
        {recent.map((expense) => {
          const { icon, color } = getCategoryInfo(expense.category);
          const cat = categories.find((c) => c.id === expense.category);
          return (
            <div
              key={expense.id}
              className="flex items-center gap-3 py-3 border-b border-border last:border-0"
            >
              <div
                className={`flex h-[38px] w-[38px] items-center justify-center rounded-[10px] text-base flex-shrink-0 ${colorMap[color]}`}
              >
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{expense.merchantName}</p>
                <p className="text-[11px] text-muted-foreground">
                  {cat ? cat.name : "Uncategorized"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">-{formatCOP(expense.amount)}</p>
                <p className="text-[10px] text-muted-foreground">
                  {getTimeAgo(expense.date, expense.time)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Assemble dashboard page**

Replace `src/app/(tabs)/dashboard/page.tsx`:

```tsx
"use client";

import { BudgetRing } from "@/components/dashboard/budget-ring";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { MerchantAlert } from "@/components/dashboard/merchant-alert";
import { WeeklyChart } from "@/components/dashboard/weekly-chart";
import { RecentExpenses } from "@/components/dashboard/recent-expenses";

export default function DashboardPage() {
  return (
    <div className="px-5 py-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight">Hola, Alvin</h1>
          <p className="text-sm text-muted-foreground">Mayo 2026</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-sm font-medium">
          AG
        </div>
      </div>

      {/* Budget Ring */}
      <div className="mb-4">
        <BudgetRing />
      </div>

      {/* Quick Stats */}
      <div className="mb-4">
        <QuickStats />
      </div>

      {/* Merchant Alert */}
      <div className="mb-4">
        <MerchantAlert />
      </div>

      {/* Weekly Chart */}
      <div className="mb-4">
        <WeeklyChart />
      </div>

      {/* Recent Expenses */}
      <RecentExpenses />
    </div>
  );
}
```

- [ ] **Step 7: Verify dashboard renders**

Run `npm run dev`. Navigate to localhost:3000/dashboard. Should show: budget ring with percentage, stats row, alert card for uncategorized merchant, weekly bar chart, and recent expenses list. Check mobile and desktop viewports.

- [ ] **Step 8: Commit**

```bash
git add src/components/dashboard/ src/app/\(tabs\)/dashboard/
git commit -m "feat: build dashboard page with budget ring, stats, alerts, and recent expenses"
```

---

## Task 6: Expenses Page + Categorization Flow

**Files:**
- Create: `src/components/expenses/search-bar.tsx`
- Create: `src/components/expenses/filter-pills.tsx`
- Create: `src/components/expenses/expense-item.tsx`
- Create: `src/components/expenses/expense-list.tsx`
- Create: `src/components/expenses/categorize-sheet.tsx`
- Modify: `src/app/(tabs)/expenses/page.tsx`

- [ ] **Step 1: Create search bar component**

Create `src/components/expenses/search-bar.tsx`:

```tsx
"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3">
      <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <input
        type="text"
        placeholder="Search merchants, categories..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
```

- [ ] **Step 2: Create filter pills component**

Create `src/components/expenses/filter-pills.tsx`:

```tsx
"use client";

import { cn } from "@/lib/utils";
import { useApp } from "@/lib/context/use-app";

interface FilterPillsProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function FilterPills({ selected, onSelect }: FilterPillsProps) {
  const { categories } = useApp();

  const filters = [
    { id: "all", label: "All", icon: "" },
    ...categories.map((c) => ({ id: c.id, label: c.name, icon: c.icon })),
    { id: "uncategorized", label: "Uncategorized", icon: "⚠️" },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onSelect(filter.id)}
          className={cn(
            "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs border transition-colors",
            selected === filter.id
              ? "bg-[--color-green-dim] border-[--color-green] text-[--color-green]"
              : "bg-card border-border text-muted-foreground hover:text-foreground"
          )}
        >
          {filter.icon && <span>{filter.icon}</span>}
          {filter.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create expense item component**

Create `src/components/expenses/expense-item.tsx`:

```tsx
"use client";

import { Expense, Category } from "@/lib/types";
import { formatCOP } from "@/lib/utils";

interface ExpenseItemProps {
  expense: Expense;
  categories: Category[];
  onCategorize?: (expense: Expense) => void;
}

const colorMap: Record<string, string> = {
  purple: "bg-[--color-purple-dim]",
  blue: "bg-[--color-blue-dim]",
  green: "bg-[--color-green-dim]",
  yellow: "bg-[--color-yellow-dim]",
  red: "bg-[--color-red-dim]",
  orange: "bg-[--color-orange-dim] border border-dashed border-[--color-orange]",
  cyan: "bg-[--color-cyan-dim]",
};

export function ExpenseItem({ expense, categories, onCategorize }: ExpenseItemProps) {
  const cat = categories.find((c) => c.id === expense.category);
  const icon = cat ? cat.icon : "❓";
  const color = cat ? cat.color : "orange";
  const isUncategorized = !expense.category;

  return (
    <div
      className={`flex items-center gap-3 py-3.5 border-b border-border/50 last:border-0 ${
        isUncategorized ? "cursor-pointer" : ""
      }`}
      onClick={() => isUncategorized && onCategorize?.(expense)}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-[10px] text-lg flex-shrink-0 ${colorMap[color]}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{expense.merchantName}</p>
        {isUncategorized ? (
          <span className="inline-block text-[9px] font-semibold uppercase bg-[--color-orange-dim] text-[--color-orange] px-1.5 py-0.5 rounded mt-0.5">
            Needs category
          </span>
        ) : (
          <p className="text-[11px] text-muted-foreground mt-0.5">{cat?.name}</p>
        )}
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold">-{formatCOP(expense.amount)}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{expense.time}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create expense list component**

Create `src/components/expenses/expense-list.tsx`:

```tsx
"use client";

import { Expense, Category } from "@/lib/types";
import { ExpenseItem } from "./expense-item";
import { formatDate } from "@/lib/utils";

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onCategorize: (expense: Expense) => void;
}

export function ExpenseList({ expenses, categories, onCategorize }: ExpenseListProps) {
  // Group by date
  const grouped = expenses.reduce<Record<string, Expense[]>>((acc, expense) => {
    if (!acc[expense.date]) acc[expense.date] = [];
    acc[expense.date].push(expense);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        No expenses found
      </div>
    );
  }

  return (
    <div>
      {sortedDates.map((date) => (
        <div key={date} className="mb-2">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider py-3 border-b border-border">
            {formatDate(date)} — {date.split("-").reverse().slice(0, 2).join("/")}
          </p>
          {grouped[date].map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              categories={categories}
              onCategorize={onCategorize}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Create categorize sheet component**

Create `src/components/expenses/categorize-sheet.tsx`:

```tsx
"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/context/use-app";
import { Expense } from "@/lib/types";
import { formatCOP } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CategorizeSheetProps {
  expense: Expense | null;
  open: boolean;
  onClose: () => void;
}

export function CategorizeSheet({ expense, open, onClose }: CategorizeSheetProps) {
  const { categories, categorizeExpense, addCategory } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [remember, setRemember] = useState(true);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("📦");

  const handleConfirm = () => {
    if (!expense || !selectedCategory) return;
    categorizeExpense(expense.id, selectedCategory, remember);
    setSelectedCategory(null);
    setShowNewCategory(false);
    setNewCategoryName("");
    onClose();
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName.trim(), newCategoryIcon, "cyan");
    const newId = newCategoryName.trim().toLowerCase().replace(/\s+/g, "-");
    setSelectedCategory(newId);
    setShowNewCategory(false);
    setNewCategoryName("");
  };

  const selectedCat = categories.find((c) => c.id === selectedCategory);

  const colorMap: Record<string, string> = {
    purple: "bg-[--color-purple-dim]",
    blue: "bg-[--color-blue-dim]",
    green: "bg-[--color-green-dim]",
    yellow: "bg-[--color-yellow-dim]",
    red: "bg-[--color-red-dim]",
    orange: "bg-[--color-orange-dim]",
    cyan: "bg-[--color-cyan-dim]",
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl bg-secondary border-border px-5 pb-8">
        <SheetHeader className="pb-4">
          <div className="w-9 h-1 rounded-full bg-border mx-auto mb-4" />
          {expense && (
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[--color-orange-dim] border border-dashed border-[--color-orange] text-xl">
                🏪
              </div>
              <div>
                <SheetTitle className="text-base font-semibold text-left">
                  {expense.merchantName}
                </SheetTitle>
                <p className="text-xs text-muted-foreground text-left">
                  {formatCOP(expense.amount)} · {expense.date} {expense.time}
                </p>
              </div>
            </div>
          )}
        </SheetHeader>

        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2.5">
          Pick a category
        </p>

        <div className="grid grid-cols-2 gap-2 mb-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-xl border transition-all",
                selectedCategory === cat.id
                  ? "border-[--color-green] bg-[--color-green-dim] shadow-[0_0_12px_var(--color-green-dim)]"
                  : "border-border bg-card hover:border-[--color-green]/50"
              )}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-xs font-medium">{cat.name}</span>
            </button>
          ))}
        </div>

        {!showNewCategory ? (
          <button
            onClick={() => setShowNewCategory(true)}
            className="w-full p-3 rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            + Create new category
          </button>
        ) : (
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1 h-10 bg-card border-border text-sm"
            />
            <Button onClick={handleCreateCategory} size="sm" className="h-10 bg-[--color-green] text-black hover:bg-[--color-green]/90">
              Add
            </Button>
          </div>
        )}

        {/* Remember Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-card mb-4">
          <div>
            <p className="text-[13px] font-medium">Remember this</p>
            <p className="text-[10px] text-muted-foreground">
              Auto-categorize {expense?.merchantName} next time
            </p>
          </div>
          <button
            onClick={() => setRemember(!remember)}
            className={cn(
              "w-11 h-6 rounded-full relative transition-colors",
              remember ? "bg-[--color-green] shadow-[0_0_8px_var(--color-green-dim)]" : "bg-border"
            )}
          >
            <div
              className={cn(
                "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                remember ? "right-0.5" : "left-0.5"
              )}
            />
          </button>
        </div>

        {/* Confirm Button */}
        <Button
          onClick={handleConfirm}
          disabled={!selectedCategory}
          className="w-full h-12 bg-[--color-green] text-black font-semibold hover:bg-[--color-green]/90 shadow-[0_0_20px_var(--color-green-dim)] disabled:opacity-50 disabled:shadow-none"
        >
          {selectedCat ? `Confirm → ${selectedCat.name}` : "Select a category"}
        </Button>
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 6: Assemble expenses page**

Replace `src/app/(tabs)/expenses/page.tsx`:

```tsx
"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/lib/context/use-app";
import { Expense } from "@/lib/types";
import { SearchBar } from "@/components/expenses/search-bar";
import { FilterPills } from "@/components/expenses/filter-pills";
import { ExpenseList } from "@/components/expenses/expense-list";
import { CategorizeSheet } from "@/components/expenses/categorize-sheet";

export default function ExpensesPage() {
  const { expenses, categories } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [categorizeTarget, setCategorizeTarget] = useState<Expense | null>(null);

  const filtered = useMemo(() => {
    let result = expenses;

    if (filter === "uncategorized") {
      result = result.filter((e) => e.category === null);
    } else if (filter !== "all") {
      result = result.filter((e) => e.category === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.merchantName.toLowerCase().includes(q) ||
          (e.category && e.category.toLowerCase().includes(q))
      );
    }

    return result;
  }, [expenses, filter, search]);

  return (
    <div className="px-5 py-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[22px] font-bold tracking-tight">Expenses</h1>
        <span className="text-[13px] text-muted-foreground">Mayo 2026</span>
      </div>

      <div className="mb-3">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <FilterPills selected={filter} onSelect={setFilter} />

      <ExpenseList
        expenses={filtered}
        categories={categories}
        onCategorize={setCategorizeTarget}
      />

      <CategorizeSheet
        expense={categorizeTarget}
        open={categorizeTarget !== null}
        onClose={() => setCategorizeTarget(null)}
      />
    </div>
  );
}
```

- [ ] **Step 7: Verify expenses page and categorization flow**

Run `npm run dev`. Navigate to /expenses. Should show search bar, filter pills, date-grouped expenses. Tap an uncategorized expense (EL CIELO or TIENDA TECH). Sheet should slide up with category grid. Select a category, confirm. Item should update with the new category.

- [ ] **Step 8: Commit**

```bash
git add src/components/expenses/ src/app/\(tabs\)/expenses/
git commit -m "feat: build expenses page with search, filters, and categorization bottom sheet"
```

---

## Task 7: Budget Page

**Files:**
- Create: `src/components/budget/spending-limit-card.tsx`
- Create: `src/components/budget/income-section.tsx`
- Create: `src/components/budget/obligations-section.tsx`
- Create: `src/components/budget/budget-summary.tsx`
- Modify: `src/app/(tabs)/budget/page.tsx`

- [ ] **Step 1: Create spending limit card**

Create `src/components/budget/spending-limit-card.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Pencil, Check } from "lucide-react";
import { useApp } from "@/lib/context/use-app";
import { formatCOP, getDaysRemainingInMonth } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export function SpendingLimitCard() {
  const { budget, updateSpendingLimit, expenses } = useApp();
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget.spendingLimit - totalSpent;
  const daysLeft = getDaysRemainingInMonth();
  const perDay = daysLeft > 0 ? Math.round(remaining / daysLeft) : 0;

  const handleSave = () => {
    const num = parseInt(editValue.replace(/\D/g, ""), 10);
    if (num > 0) updateSpendingLimit(num);
    setEditing(false);
  };

  return (
    <div className="relative rounded-2xl border border-[--color-green] bg-card p-5 text-center overflow-hidden">
      <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,var(--color-green-dim)_0%,transparent_50%)] pointer-events-none" />

      <button
        onClick={() => {
          setEditValue(String(budget.spendingLimit));
          setEditing(!editing);
        }}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground z-10"
      >
        {editing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
      </button>

      <p className="relative text-[11px] text-muted-foreground uppercase tracking-wider mb-2">
        Monthly Spending Limit
      </p>

      {editing ? (
        <div className="relative flex justify-center mb-2">
          <Input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            onBlur={handleSave}
            className="w-48 text-center text-2xl font-bold bg-transparent border-border h-12"
            autoFocus
          />
        </div>
      ) : (
        <p className="relative text-[32px] font-bold text-[--color-green] drop-shadow-[0_0_20px_var(--color-green-dim)]">
          {formatCOP(budget.spendingLimit)}
        </p>
      )}

      <p className="relative text-[11px] text-muted-foreground mt-1">
        {formatCOP(Math.max(0, perDay))} / day · {daysLeft} days remaining
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Create income section**

Create `src/components/budget/income-section.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useApp } from "@/lib/context/use-app";
import { formatCOP } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function IncomeSection() {
  const { budget, addIncome } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");

  const totalIncome = budget.incomes.reduce((sum, i) => sum + i.amount, 0);

  const handleAdd = () => {
    const num = parseInt(amount.replace(/\D/g, ""), 10);
    if (!source.trim() || !num) return;
    addIncome({ source: source.trim(), amount: num, date: new Date().toISOString().split("T")[0] });
    setSource("");
    setAmount("");
    setShowAdd(false);
  };

  return (
    <div>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2.5">
        Income This Month
      </p>
      <div className="rounded-xl border border-border bg-card p-4">
        {budget.incomes.map((income) => (
          <div key={income.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
            <span className="text-[13px] text-muted-foreground">{income.source}</span>
            <span className="text-sm font-semibold text-[--color-green]">{formatCOP(income.amount)}</span>
          </div>
        ))}
        <div className="flex justify-between items-center pt-3 mt-2 border-t border-[--color-green-dim]">
          <span className="text-xs text-muted-foreground">Total Income</span>
          <span className="text-base font-bold text-[--color-green]">{formatCOP(totalIncome)}</span>
        </div>
      </div>

      {showAdd ? (
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="flex-1 h-10 bg-card border-border text-sm"
          />
          <Input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-28 h-10 bg-card border-border text-sm"
          />
          <Button onClick={handleAdd} size="sm" className="h-10 bg-[--color-green] text-black hover:bg-[--color-green]/90">
            Add
          </Button>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full mt-2 p-2.5 rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          + Add income
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create obligations section**

Create `src/components/budget/obligations-section.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useApp } from "@/lib/context/use-app";
import { formatCOP } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ObligationsSection() {
  const { budget, addObligation, toggleObligationPaid } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleAdd = () => {
    const num = parseInt(amount.replace(/\D/g, ""), 10);
    if (!name.trim() || !num) return;
    addObligation({
      name: name.trim(),
      amount: num,
      dueDate: new Date().toISOString().split("T")[0],
      paid: false,
    });
    setName("");
    setAmount("");
    setShowAdd(false);
  };

  return (
    <div>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2.5">
        Obligations / Fixed Costs
      </p>
      <div className="space-y-2">
        {budget.obligations.map((ob) => (
          <div
            key={ob.id}
            className="flex justify-between items-center p-3.5 rounded-xl border border-border bg-card cursor-pointer"
            onClick={() => toggleObligationPaid(ob.id)}
          >
            <div>
              <p className="text-[13px] font-medium">{ob.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {ob.paid ? "✓ Paid" : `Due ${ob.dueDate.split("-").slice(1).reverse().join("/")}`}
              </p>
            </div>
            <span className={`text-sm font-semibold ${ob.paid ? "text-muted-foreground line-through" : "text-[--color-red]"}`}>
              -{formatCOP(ob.amount)}
            </span>
          </div>
        ))}
      </div>

      {showAdd ? (
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 h-10 bg-card border-border text-sm"
          />
          <Input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-28 h-10 bg-card border-border text-sm"
          />
          <Button onClick={handleAdd} size="sm" className="h-10 bg-[--color-green] text-black hover:bg-[--color-green]/90">
            Add
          </Button>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full mt-2 p-2.5 rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          + Add obligation
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create budget summary**

Create `src/components/budget/budget-summary.tsx`:

```tsx
"use client";

import { useApp } from "@/lib/context/use-app";
import { formatCOP } from "@/lib/utils";

export function BudgetSummary() {
  const { budget } = useApp();

  const totalIncome = budget.incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalObligations = budget.obligations.reduce((sum, o) => sum + o.amount, 0);
  const savingsTarget = totalIncome - totalObligations - budget.spendingLimit;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex justify-between py-1.5 text-[13px]">
        <span className="text-muted-foreground">Total Income</span>
        <span className="font-semibold text-[--color-green]">{formatCOP(totalIncome)}</span>
      </div>
      <div className="flex justify-between py-1.5 text-[13px]">
        <span className="text-muted-foreground">Obligations</span>
        <span className="font-semibold text-[--color-red]">-{formatCOP(totalObligations)}</span>
      </div>
      <div className="flex justify-between py-1.5 text-[13px]">
        <span className="text-muted-foreground">Spending Limit</span>
        <span className="font-semibold">{formatCOP(budget.spendingLimit)}</span>
      </div>
      <div className="flex justify-between pt-3 mt-2 border-t border-border">
        <span className="text-muted-foreground text-[13px]">Savings Target</span>
        <span className={`text-[15px] font-bold ${savingsTarget >= 0 ? "text-[--color-green]" : "text-[--color-red]"}`}>
          {formatCOP(savingsTarget)}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Assemble budget page**

Replace `src/app/(tabs)/budget/page.tsx`:

```tsx
"use client";

import { SpendingLimitCard } from "@/components/budget/spending-limit-card";
import { IncomeSection } from "@/components/budget/income-section";
import { ObligationsSection } from "@/components/budget/obligations-section";
import { BudgetSummary } from "@/components/budget/budget-summary";

export default function BudgetPage() {
  return (
    <div className="px-5 py-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[22px] font-bold tracking-tight">Budget</h1>
        <span className="text-xs text-[--color-green] font-semibold">✓ Active</span>
      </div>

      {/* Month Selector */}
      <div className="flex items-center justify-center gap-4 pb-5">
        <button className="flex h-7 w-7 items-center justify-center rounded-full bg-card border border-border text-xs text-muted-foreground">
          ←
        </button>
        <span className="text-base font-semibold">Mayo 2026</span>
        <button className="flex h-7 w-7 items-center justify-center rounded-full bg-card border border-border text-xs text-muted-foreground">
          →
        </button>
      </div>

      {/* Spending Limit */}
      <div className="mb-5">
        <SpendingLimitCard />
      </div>

      {/* Income */}
      <div className="mb-5">
        <IncomeSection />
      </div>

      {/* Obligations */}
      <div className="mb-5">
        <ObligationsSection />
      </div>

      {/* Summary */}
      <BudgetSummary />
    </div>
  );
}
```

- [ ] **Step 6: Verify budget page**

Run `npm run dev`. Navigate to /budget. Should show spending limit card (editable), income list with total, obligations (tappable to toggle paid), and summary with savings target.

- [ ] **Step 7: Commit**

```bash
git add src/components/budget/ src/app/\(tabs\)/budget/
git commit -m "feat: build budget page with spending limit, income, obligations, and summary"
```

---

## Task 8: Analytics Page

**Files:**
- Create: `src/components/analytics/time-range-tabs.tsx`
- Create: `src/components/analytics/category-donut.tsx`
- Create: `src/components/analytics/daily-spending-chart.tsx`
- Create: `src/components/analytics/month-comparison.tsx`
- Create: `src/components/analytics/top-merchants.tsx`
- Create: `src/components/analytics/insight-cards.tsx`
- Modify: `src/app/(tabs)/analytics/page.tsx`

- [ ] **Step 1: Create time range tabs**

Create `src/components/analytics/time-range-tabs.tsx`:

```tsx
"use client";

import { TimeRange } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TimeRangeTabsProps {
  selected: TimeRange;
  onSelect: (range: TimeRange) => void;
}

const tabs: { value: TimeRange; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "3months", label: "3 Mo" },
  { value: "year", label: "Year" },
];

export function TimeRangeTabs({ selected, onSelect }: TimeRangeTabsProps) {
  return (
    <div className="flex rounded-xl bg-card p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onSelect(tab.value)}
          className={cn(
            "flex-1 py-2 text-xs rounded-lg transition-colors font-medium",
            selected === tab.value
              ? "bg-[--color-green-dim] text-[--color-green]"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create category donut chart**

Create `src/components/analytics/category-donut.tsx`:

```tsx
"use client";

import { useApp } from "@/lib/context/use-app";
import { formatCompactCOP } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS: Record<string, string> = {
  purple: "#a855f7",
  blue: "#4d9fff",
  green: "#00e68a",
  yellow: "#fbbf24",
  red: "#ff4d6a",
  orange: "#f97316",
  cyan: "#22d3ee",
};

export function CategoryDonut() {
  const { expenses, categories } = useApp();

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category
  const data = categories
    .map((cat) => {
      const amount = expenses
        .filter((e) => e.category === cat.id)
        .reduce((sum, e) => sum + e.amount, 0);
      return { name: cat.name, value: amount, icon: cat.icon, color: COLORS[cat.color] || "#666" };
    })
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  // Add uncategorized
  const uncategorizedTotal = expenses
    .filter((e) => !e.category)
    .reduce((sum, e) => sum + e.amount, 0);
  if (uncategorizedTotal > 0) {
    data.push({ name: "Uncategorized", value: uncategorizedTotal, icon: "❓", color: "#f97316" });
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h4 className="text-[13px] font-semibold mb-0.5">Category Breakdown</h4>
      <p className="text-[11px] text-muted-foreground mb-3">
        May 2026 · {formatCompactCOP(totalSpent)} total
      </p>
      <div className="flex items-center gap-4">
        <div className="w-[120px] h-[120px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={55}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-1.5">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-[11px]">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
              <span className="text-muted-foreground">{d.icon} {d.name}</span>
              <span className="ml-auto font-semibold">{formatCompactCOP(d.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create daily spending chart**

Create `src/components/analytics/daily-spending-chart.tsx`:

```tsx
"use client";

import { dailySpending } from "@/lib/mock-data";
import { useApp } from "@/lib/context/use-app";
import { formatCompactCOP, getDaysRemainingInMonth } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
} from "recharts";

export function DailySpendingChart() {
  const { budget, expenses } = useApp();

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget.spendingLimit - totalSpent;
  const daysLeft = getDaysRemainingInMonth();
  const dailyLimit = daysLeft > 0 ? Math.round(remaining / daysLeft) : 0;

  const avgSpending = dailySpending.length > 0
    ? Math.round(dailySpending.reduce((sum, d) => sum + d.amount, 0) / dailySpending.length)
    : 0;

  const data = dailySpending.map((d) => ({
    ...d,
    label: d.date.split("-")[2],
  }));

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h4 className="text-[13px] font-semibold mb-0.5">Daily Spending</h4>
      <p className="text-[11px] text-muted-foreground mb-3">
        Avg {formatCompactCOP(avgSpending)}/day · Limit {formatCompactCOP(dailyLimit)}/day
      </p>
      <div className="h-[100px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00e68a" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#00e68a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: "#55556a" }}
              interval={3}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: "#1a1a2e",
                border: "1px solid #2a2a3e",
                borderRadius: "8px",
                fontSize: "11px",
              }}
              formatter={(value: number) => [formatCompactCOP(value), "Spent"]}
              labelFormatter={(label) => `May ${label}`}
            />
            <ReferenceLine y={dailyLimit} stroke="#ff4d6a" strokeDasharray="4 4" strokeOpacity={0.6} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#00e68a"
              strokeWidth={2}
              fill="url(#areaGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create month comparison chart**

Create `src/components/analytics/month-comparison.tsx`:

```tsx
"use client";

import { useApp } from "@/lib/context/use-app";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatCompactCOP } from "@/lib/utils";

// Mock previous month data for comparison
const previousMonthByCategory: Record<string, number> = {
  delivery: 270000,
  transportation: 210000,
  groceries: 450000,
  flights: 0,
  subscriptions: 160000,
};

export function MonthComparison() {
  const { expenses, categories } = useApp();

  const data = categories
    .map((cat) => {
      const current = expenses
        .filter((e) => e.category === cat.id)
        .reduce((sum, e) => sum + e.amount, 0);
      const previous = previousMonthByCategory[cat.id] || 0;
      if (current === 0 && previous === 0) return null;
      return { name: cat.icon, current, previous };
    })
    .filter(Boolean) as { name: string; current: number; previous: number }[];

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h4 className="text-[13px] font-semibold mb-0.5">vs Last Month</h4>
      <p className="text-[11px] text-muted-foreground mb-3">
        Green = this month · Gray = April
      </p>
      <div className="h-[100px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14 }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: "#1a1a2e",
                border: "1px solid #2a2a3e",
                borderRadius: "8px",
                fontSize: "11px",
              }}
              formatter={(value: number) => formatCompactCOP(value)}
            />
            <Bar dataKey="previous" fill="#2a2a3e" radius={[3, 3, 0, 0]} />
            <Bar dataKey="current" fill="#00e68a" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create top merchants component**

Create `src/components/analytics/top-merchants.tsx`:

```tsx
"use client";

import { useApp } from "@/lib/context/use-app";
import { formatCompactCOP } from "@/lib/utils";

export function TopMerchants() {
  const { expenses } = useApp();

  // Group by merchant
  const merchantTotals = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.merchantName] = (acc[e.merchantName] || 0) + e.amount;
    return acc;
  }, {});

  const sorted = Object.entries(merchantTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const maxAmount = sorted[0]?.[1] || 1;

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h4 className="text-[13px] font-semibold mb-0.5">Top Merchants</h4>
      <p className="text-[11px] text-muted-foreground mb-3">Where your money goes most</p>
      <div className="space-y-2.5">
        {sorted.map(([name, amount], i) => (
          <div key={name} className="flex items-center gap-3">
            <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
            <div className="flex-1 h-6 bg-background rounded relative overflow-hidden">
              <div
                className="h-full rounded bg-[--color-green-dim] flex items-center px-2"
                style={{ width: `${(amount / maxAmount) * 100}%` }}
              >
                <span className="text-[10px] font-medium truncate">{name}</span>
              </div>
            </div>
            <span className="text-xs font-semibold w-14 text-right">{formatCompactCOP(amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create insight cards**

Create `src/components/analytics/insight-cards.tsx`:

```tsx
"use client";

import { useApp } from "@/lib/context/use-app";
import { formatCompactCOP, getDaysRemainingInMonth } from "@/lib/utils";

interface Insight {
  icon: string;
  text: string;
  highlight: string;
  type: "info" | "positive" | "warning";
}

export function InsightCards() {
  const { expenses, budget } = useApp();

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget.spendingLimit - totalSpent;
  const daysLeft = getDaysRemainingInMonth();

  // Generate insights from data
  const insights: Insight[] = [];

  // Delivery spending insight
  const deliveryTotal = expenses
    .filter((e) => e.category === "delivery")
    .reduce((sum, e) => sum + e.amount, 0);
  const deliveryCount = expenses.filter((e) => e.category === "delivery").length;
  if (deliveryTotal > 200000) {
    insights.push({
      icon: "📈",
      text: `You've spent ${formatCompactCOP(deliveryTotal)} on delivery across ${deliveryCount} orders this month.`,
      highlight: `${formatCompactCOP(deliveryTotal)} on delivery`,
      type: "info",
    });
  }

  // Large purchase insight
  const largestExpense = expenses.reduce((max, e) => (e.amount > max.amount ? e : max), expenses[0]);
  if (largestExpense && largestExpense.amount > 500000) {
    insights.push({
      icon: "✈️",
      text: `${largestExpense.merchantName} added ${formatCompactCOP(largestExpense.amount)} — your largest expense this month.`,
      highlight: formatCompactCOP(largestExpense.amount),
      type: "warning",
    });
  }

  // Savings projection
  if (remaining > 0 && daysLeft > 0) {
    const totalIncome = budget.incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalOb = budget.obligations.reduce((sum, o) => sum + o.amount, 0);
    const projectedSavings = totalIncome - totalOb - totalSpent;
    if (projectedSavings > 0) {
      insights.push({
        icon: "💚",
        text: `You're on track to save ${formatCompactCOP(projectedSavings)} this month if you keep current pace.`,
        highlight: formatCompactCOP(projectedSavings),
        type: "positive",
      });
    }
  }

  const typeStyles = {
    info: "bg-[--color-blue-dim] border-[--color-blue]/30",
    positive: "bg-[--color-green-dim] border-[--color-green]/30",
    warning: "bg-[--color-yellow-dim] border-[--color-yellow]/30",
  };

  return (
    <div>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2.5">
        Insights
      </p>
      <div className="space-y-2">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 rounded-xl border p-3 ${typeStyles[insight.type]}`}
          >
            <span className="text-base flex-shrink-0 mt-0.5">{insight.icon}</span>
            <p className="text-xs leading-relaxed">{insight.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Assemble analytics page**

Replace `src/app/(tabs)/analytics/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { TimeRange } from "@/lib/types";
import { TimeRangeTabs } from "@/components/analytics/time-range-tabs";
import { CategoryDonut } from "@/components/analytics/category-donut";
import { DailySpendingChart } from "@/components/analytics/daily-spending-chart";
import { MonthComparison } from "@/components/analytics/month-comparison";
import { TopMerchants } from "@/components/analytics/top-merchants";
import { InsightCards } from "@/components/analytics/insight-cards";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");

  return (
    <div className="px-5 py-4 max-w-2xl mx-auto">
      <h1 className="text-[22px] font-bold tracking-tight mb-4">Analytics</h1>

      <div className="mb-5">
        <TimeRangeTabs selected={timeRange} onSelect={setTimeRange} />
      </div>

      <div className="space-y-4">
        <CategoryDonut />
        <DailySpendingChart />
        <MonthComparison />
        <TopMerchants />
        <InsightCards />
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Verify analytics page**

Run `npm run dev`. Navigate to /analytics. Should show: time range tabs, donut chart with legend, area chart with red limit line, bar comparison chart, top merchants ranking, and insight cards.

- [ ] **Step 9: Commit**

```bash
git add src/components/analytics/ src/app/\(tabs\)/analytics/
git commit -m "feat: build analytics page with charts, comparisons, and insight cards"
```

---

## Task 9: Investments Page

**Files:**
- Create: `src/components/investments/portfolio-total.tsx`
- Create: `src/components/investments/holdings-list.tsx`
- Create: `src/components/investments/investment-form.tsx`
- Create: `src/components/investments/activity-log.tsx`
- Modify: `src/app/(tabs)/investments/page.tsx`

- [ ] **Step 1: Create portfolio total component**

Create `src/components/investments/portfolio-total.tsx`:

```tsx
"use client";

import { useApp } from "@/lib/context/use-app";
import { formatCOP, formatCompactCOP } from "@/lib/utils";

export function PortfolioTotal() {
  const { investments } = useApp();

  const totalValue = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.currentValuePerUnit,
    0
  );

  const totalCost = investments.reduce(
    (sum, inv) =>
      sum +
      inv.transactions
        .filter((t) => t.type === "buy")
        .reduce((s, t) => s + t.quantity * t.pricePerUnit, 0),
    0
  );

  const totalGain = totalValue - totalCost;
  const percentGain = totalCost > 0 ? ((totalGain / totalCost) * 100).toFixed(1) : "0";
  const isPositive = totalGain >= 0;

  return (
    <div className="relative rounded-2xl border border-border bg-card p-5 overflow-hidden">
      <div className="absolute -top-[30%] -right-[20%] w-[160px] h-[160px] bg-[radial-gradient(circle,var(--color-green-dim)_0%,transparent_70%)] pointer-events-none" />
      <p className="relative text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
        Total Portfolio
      </p>
      <p className="relative text-[28px] font-bold mb-1">{formatCOP(totalValue)}</p>
      <p className={`relative text-xs ${isPositive ? "text-[--color-green]" : "text-[--color-red]"}`}>
        {isPositive ? "↑" : "↓"} {formatCompactCOP(Math.abs(totalGain))} ({isPositive ? "+" : ""}{percentGain}%) all time
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Create holdings list component**

Create `src/components/investments/holdings-list.tsx`:

```tsx
"use client";

import { useApp } from "@/lib/context/use-app";
import { formatCOP } from "@/lib/utils";

const assetIcons: Record<string, { icon: string; color: string }> = {
  "precious-metal": { icon: "🥇", color: "yellow" },
  "precious-stones": { icon: "💎", color: "purple" },
  crypto: { icon: "₿", color: "blue" },
  etf: { icon: "📊", color: "green" },
};

const colorMap: Record<string, string> = {
  yellow: "bg-[--color-yellow-dim]",
  purple: "bg-[--color-purple-dim]",
  blue: "bg-[--color-blue-dim]",
  green: "bg-[--color-green-dim]",
  cyan: "bg-[--color-cyan-dim]",
};

export function HoldingsList() {
  const { investments } = useApp();

  return (
    <div className="space-y-2">
      {investments.map((inv) => {
        const currentValue = inv.quantity * inv.currentValuePerUnit;
        const totalCost = inv.transactions
          .filter((t) => t.type === "buy")
          .reduce((sum, t) => sum + t.quantity * t.pricePerUnit, 0);
        const gain = currentValue - totalCost;
        const percentGain = totalCost > 0 ? ((gain / totalCost) * 100).toFixed(1) : "0";
        const isPositive = gain >= 0;

        const { icon, color } = assetIcons[inv.assetType] || { icon: "📦", color: "cyan" };

        return (
          <div key={inv.id} className="rounded-xl border border-border bg-card p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${colorMap[color]}`}>
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{inv.assetName}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {inv.quantity} {inv.assetType === "crypto" ? inv.assetName.substring(0, 3).toUpperCase() : "units"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatCOP(currentValue)}</p>
                <p className={`text-[11px] ${isPositive ? "text-[--color-green]" : "text-[--color-red]"}`}>
                  {isPositive ? "+" : ""}{percentGain}%
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Create investment form component**

Create `src/components/investments/investment-form.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useApp } from "@/lib/context/use-app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface InvestmentFormProps {
  open: boolean;
  onClose: () => void;
}

export function InvestmentForm({ open, onClose }: InvestmentFormProps) {
  const { investments, addInvestmentTransaction } = useApp();
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [type, setType] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = () => {
    if (!selectedAsset || !quantity || !price) return;
    addInvestmentTransaction(selectedAsset, {
      type,
      quantity: parseFloat(quantity),
      pricePerUnit: parseInt(price.replace(/\D/g, ""), 10),
      date,
    });
    setSelectedAsset("");
    setQuantity("");
    setPrice("");
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl bg-secondary border-border px-5 pb-8">
        <SheetHeader className="pb-4">
          <div className="w-9 h-1 rounded-full bg-border mx-auto mb-4" />
          <SheetTitle className="text-base font-semibold text-left">Log Investment</SheetTitle>
        </SheetHeader>

        {/* Buy/Sell Toggle */}
        <div className="flex rounded-xl bg-card p-1 mb-4">
          <button
            onClick={() => setType("buy")}
            className={cn(
              "flex-1 py-2 text-xs rounded-lg font-medium transition-colors",
              type === "buy" ? "bg-[--color-green-dim] text-[--color-green]" : "text-muted-foreground"
            )}
          >
            Buy
          </button>
          <button
            onClick={() => setType("sell")}
            className={cn(
              "flex-1 py-2 text-xs rounded-lg font-medium transition-colors",
              type === "sell" ? "bg-[--color-red-dim] text-[--color-red]" : "text-muted-foreground"
            )}
          >
            Sell
          </button>
        </div>

        {/* Asset Selection */}
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2">Asset</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {investments.map((inv) => (
            <button
              key={inv.id}
              onClick={() => setSelectedAsset(inv.id)}
              className={cn(
                "p-2.5 rounded-xl border text-xs font-medium transition-all text-center",
                selectedAsset === inv.id
                  ? "border-[--color-green] bg-[--color-green-dim]"
                  : "border-border bg-card hover:border-[--color-green]/50"
              )}
            >
              {inv.assetName}
            </button>
          ))}
        </div>

        {/* Quantity and Price */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1.5">Quantity</p>
            <Input
              type="text"
              placeholder="0.00"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="h-10 bg-card border-border text-sm"
            />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1.5">Price/unit (COP)</p>
            <Input
              type="text"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-10 bg-card border-border text-sm"
            />
          </div>
        </div>

        {/* Date */}
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1.5">Date</p>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-10 bg-card border-border text-sm mb-5"
        />

        <Button
          onClick={handleSubmit}
          disabled={!selectedAsset || !quantity || !price}
          className="w-full h-12 bg-[--color-green] text-black font-semibold hover:bg-[--color-green]/90 shadow-[0_0_20px_var(--color-green-dim)] disabled:opacity-50 disabled:shadow-none"
        >
          Log {type === "buy" ? "Purchase" : "Sale"}
        </Button>
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 4: Create activity log component**

Create `src/components/investments/activity-log.tsx`:

```tsx
"use client";

import { useApp } from "@/lib/context/use-app";
import { formatCompactCOP } from "@/lib/utils";

export function ActivityLog() {
  const { investments } = useApp();

  // Flatten all transactions with asset name
  const allTransactions = investments
    .flatMap((inv) =>
      inv.transactions.map((t) => ({
        ...t,
        assetName: inv.assetName,
      }))
    )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2.5">
        Recent Activity
      </p>
      <div className="rounded-xl border border-border bg-card p-3">
        {allTransactions.map((tx) => (
          <div key={tx.id} className="flex justify-between items-center py-2 border-b border-border last:border-0 text-xs">
            <span>
              {tx.type === "buy" ? "Bought" : "Sold"} {tx.quantity} {tx.assetName}
              {tx.notes && <span className="text-muted-foreground ml-1">· {tx.notes}</span>}
            </span>
            <span className="text-muted-foreground">
              {tx.date.split("-").slice(1).reverse().join("/")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Assemble investments page**

Replace `src/app/(tabs)/investments/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { PortfolioTotal } from "@/components/investments/portfolio-total";
import { HoldingsList } from "@/components/investments/holdings-list";
import { InvestmentForm } from "@/components/investments/investment-form";
import { ActivityLog } from "@/components/investments/activity-log";

export default function InvestmentsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="px-5 py-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[22px] font-bold tracking-tight">Investments</h1>
      </div>

      <div className="mb-4">
        <PortfolioTotal />
      </div>

      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2.5">
        Holdings
      </p>

      <div className="mb-4">
        <HoldingsList />
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="w-full mb-5 p-2.5 rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        + Log new investment
      </button>

      <ActivityLog />

      <InvestmentForm open={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
}
```

- [ ] **Step 6: Verify investments page**

Run `npm run dev`. Navigate to /investments. Should show portfolio total with P&L, holdings with gain/loss %, activity log, and "Log new investment" button that opens a form sheet.

- [ ] **Step 7: Commit**

```bash
git add src/components/investments/ src/app/\(tabs\)/investments/
git commit -m "feat: build investments page with portfolio total, holdings, and buy/sell form"
```

---

## Task 10: Polish and Final Touches

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/layout/bottom-nav.tsx`
- Modify: `tailwind.config.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Add scrollbar-hide utility to Tailwind config**

Update `tailwind.config.ts` — add the `scrollbar-hide` utility in the plugins array:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: Function }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    },
  ],
};
export default config;
```

- [ ] **Step 2: Add .superpowers to .gitignore**

Add to `.gitignore`:

```
# superpowers brainstorm files
.superpowers/
```

- [ ] **Step 3: Add transition animations to globals.css**

Append to `src/app/globals.css`:

```css
/* Smooth transitions for interactive elements */
@layer utilities {
  .transition-glow {
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }
}

/* Sheet animation override for smoother slides */
[data-state="open"] > [data-radix-dialog-content] {
  animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
```

- [ ] **Step 4: Verify full app end-to-end**

Run `npm run dev`. Walk through all 5 pages:
1. Dashboard — budget ring, stats, alert, chart, recent list
2. Expenses — search, filter, categorize an unknown merchant
3. Budget — edit spending limit, add income, toggle obligation paid
4. Analytics — charts render, insights show
5. Investments — holdings display, log a new transaction

Check mobile (375px) and desktop (1280px) viewports.

- [ ] **Step 5: Run build to verify no TS errors**

Run:
```bash
npm run build
```

Expected: Build succeeds with no errors. Fix any type errors that appear.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add polish, scrollbar-hide utility, animations, and gitignore updates"
```

---

## Summary

After completing all 10 tasks you will have:
- A fully functional Next.js PWA expense tracker
- 5 interactive pages with dark fintech aesthetic
- Merchant categorization with auto-learning
- Dynamic monthly budget with income/obligations
- Analytics with 5 chart types + insight cards
- Investment portfolio ledger with buy/sell logging
- Responsive layout (mobile bottom nav, desktop sidebar)
- All using mock data, ready for Prisma backend in the next phase
