# Expense Tracker UI Design Spec

## Overview

A personal expense tracker built as a Next.js PWA. Ingests expenses from SMS via iOS automation, auto-categorizes known merchants, prompts for unknown merchants (learning for future), tracks a dynamic monthly budget, provides analytics, and logs investments manually.

Single user, no auth. COP currency only. Mobile-first with rich desktop experience.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI:** shadcn/ui + Tailwind CSS
- **Charts:** Recharts
- **PWA:** next-pwa (manifest + service worker)
- **Data:** Mock data layer (interfaces match future Prisma schema)
- **State:** React context + hooks (no external state lib needed for single-user)

## Design System

### Aesthetic

Dark fintech — deep navy/black backgrounds, glowing green accents, data-dense, satisfying micro-interactions.

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0a0a0f` | Page background |
| `--bg-secondary` | `#12121a` | Nav, secondary surfaces |
| `--bg-card` | `#1a1a2e` | Card backgrounds |
| `--border` | `#2a2a3e` | Borders, dividers |
| `--text-primary` | `#f0f0f5` | Primary text |
| `--text-secondary` | `#8888a0` | Secondary text |
| `--text-muted` | `#55556a` | Muted/label text |
| `--accent-green` | `#00e68a` | Primary accent, income, positive |
| `--accent-red` | `#ff4d6a` | Expenses, negative, alerts |
| `--accent-blue` | `#4d9fff` | Transport, insights |
| `--accent-purple` | `#a855f7` | Delivery category |
| `--accent-yellow` | `#fbbf24` | Flights, warnings, unknown |
| `--accent-orange` | `#f97316` | Uncategorized items |
| `--accent-cyan` | `#22d3ee` | Crypto/misc |

### Typography

System font stack (`-apple-system, BlinkMacSystemFont, 'SF Pro Display'`) for native feel on iOS PWA. Tight letter-spacing on headings (-0.5px to -1px).

### Radius

- Cards: `16px`
- Small cards/buttons: `10px`
- Pills: `20px`

## Navigation

### Mobile (PWA Standalone Mode)

Bottom tab bar with 5 tabs:
1. **Home** (Dashboard)
2. **Expenses** (list + categorization)
3. **Budget** (monthly setup)
4. **Analytics** (charts + insights)
5. **Invest** (portfolio ledger)

Safe-area padding via `env(safe-area-inset-bottom)` for browser fallback.

### Desktop

Left sidebar navigation (220px) with the same 5 sections + Settings at bottom. Three-column layout on dashboard: sidebar | main content | activity panel.

## Pages

### 1. Dashboard (Home)

**Purpose:** At-a-glance financial health. The "quick check after SMS" screen.

**Components:**
- **Header:** Greeting + current month
- **Budget Ring Card:** Circular progress ring showing % budget remaining. Shows available amount, spent amount, and daily allowance (remaining / days left)
- **Quick Stats Row:** 3 mini cards — transaction count, total income, avg per day
- **Unknown Merchant Alert:** Yellow card with merchant name, amount, and "Categorize" CTA. Only shows when uncategorized expenses exist.
- **Weekly Spending Mini Chart:** 7-bar chart (Mon-Sun) with current day highlighted
- **Recent Expenses:** Last 5 transactions with merchant icon, name, category, amount, and time

**Desktop additions:**
- Right panel: Needs Attention alerts, recent activity feed, investment summary widget

### 2. Expenses

**Purpose:** Full expense history with search, filter, and categorization.

**Components:**
- **Search Bar:** Searches merchant names and categories
- **Filter Pills:** Horizontally scrollable category pills (All, Delivery, Transport, Groceries, Flights, Subs, Uncategorized). Active state is green-glow.
- **Date-Grouped List:** Expenses grouped by date with date header. Each item shows: category icon, merchant name, category label, amount, time. Unknown merchants show orange dashed-border icon + "Needs category" badge.
- **Categorization Bottom Sheet:** Triggered by tapping uncategorized item.
  - Slide-up sheet with drag handle
  - Merchant name + amount at top
  - Category grid (2 columns) — existing categories with icons
  - "+ Create new category" button (dashed border)
  - "Remember this" toggle (on by default) — saves merchant→category mapping
  - Confirm button shows selected category name

**After categorization:**
- Success toast at top: "MERCHANT → Category" + "Will auto-categorize next time"
- Item updates in-place with proper icon and category

### 3. Budget

**Purpose:** Monthly financial setup — income, obligations, spending limit.

**Components:**
- **Month Selector:** Arrow navigation between months
- **Spending Limit Card:** Large centered card with green glow border. Shows the limit amount, daily allowance, days remaining. Edit button (pencil icon) to adjust mid-month.
- **Income Section:**
  - List of income entries (source name + amount)
  - Total income row
  - "+ Add income" button — can add throughout the month as consultancy payments arrive
- **Obligations Section:**
  - List of fixed costs (name, due date, amount)
  - Status indicator (paid/due)
  - "+ Add obligation" button
- **Summary Card:**
  - Total Income
  - minus Obligations
  - Spending Limit (user-set)
  - = Savings Target (auto-calculated)

**Key behavior:** The spending limit is manually set by the user — it's their "I don't want to spend more than this" number. It doesn't have to equal income minus obligations. If they overspend (e.g., travel), they can adjust it up and see the savings target decrease.

### 4. Analytics

**Purpose:** Understand spending patterns, trends, and anomalies.

**Components:**
- **Time Range Tabs:** Week / Month / 3 Months / Year
- **Category Breakdown:** Donut chart with legend showing each category's total
- **Daily Spending Chart:** Area chart with daily spending line. Red dashed line shows daily limit. X-axis: dates.
- **Month vs Month Comparison:** Grouped bar chart comparing current month to previous month by category
- **Top Merchants:** Horizontal bar ranking showing which merchants get the most money
- **Insight Cards:** Auto-generated observations:
  - Spending increases vs last month by category
  - Large one-off purchases that impacted budget
  - Savings projection at current pace
  - Styled as colored cards (blue for info, green for positive, yellow for warnings)

### 5. Investments

**Purpose:** Manual portfolio ledger — track what you own and log buy/sell events.

**Components:**
- **Portfolio Total Card:** Total value with all-time P&L (amount + percentage), green glow background
- **Holdings List:** Each holding shows:
  - Asset icon (themed per type)
  - Asset name
  - Quantity held
  - Current value (manually updated or static)
  - Gain/loss percentage
- **"+ Log new investment" button:** Opens form to record buy/sell:
  - Asset (select existing or create new)
  - Type: Buy / Sell
  - Quantity
  - Price per unit
  - Date
  - Notes (optional)
- **Recent Activity:** Chronological log of buy/sell events

**Supported asset types (initial):** Gold, Precious Stones, Bitcoin, XRP, S&P 500. User can add custom asset types.

## Data Model (Mock Layer)

```typescript
interface Expense {
  id: string;
  merchantName: string;
  amount: number; // COP, always positive
  category: string | null; // null = uncategorized
  date: string; // ISO date
  time: string; // HH:mm
  rawSms?: string;
}

interface MerchantMapping {
  pattern: string; // e.g., "RAPPI", "UBER"
  category: string;
}

interface Category {
  id: string;
  name: string;
  icon: string; // emoji
  color: string; // CSS variable name
}

interface BudgetMonth {
  month: string; // "2026-05"
  spendingLimit: number;
  incomes: { id: string; source: string; amount: number; date: string }[];
  obligations: { id: string; name: string; amount: number; dueDate: string; paid: boolean }[];
}

interface Investment {
  id: string;
  assetName: string;
  assetType: string;
  quantity: number;
  currentValuePerUnit: number; // manually set
  transactions: InvestmentTransaction[];
}

interface InvestmentTransaction {
  id: string;
  type: 'buy' | 'sell';
  quantity: number;
  pricePerUnit: number;
  date: string;
  notes?: string;
}
```

## PWA Configuration

- `display: "standalone"` — removes Safari chrome
- Theme color: `#0a0a0f`
- App icon: Simple green dollar sign on dark background
- Service worker for offline caching of static assets
- Add-to-homescreen prompt on first visit

## Responsive Breakpoints

- **Mobile:** < 768px — bottom nav, single column, sheets
- **Tablet:** 768px–1024px — sidebar collapses, 2-column grid
- **Desktop:** > 1024px — full sidebar + main + activity panel (3 columns on dashboard)

## Default Categories

| Pattern | Category | Icon | Color |
|---------|----------|------|-------|
| RAPPI | Delivery | delivery icon | purple |
| UBER | Transportation | car icon | blue |
| DIDI | Transportation | car icon | blue |
| LATAM | Flights | plane icon | yellow |
| AVIANCA | Flights | plane icon | yellow |
| DELTA | Flights | plane icon | yellow |
| CARULLA | Groceries | cart icon | green |
| EXITO | Groceries | cart icon | green |
| OLIMPICA | Groceries | cart icon | green |
| JUMBO | Groceries | cart icon | green |
| ANTHROPIC | Subscriptions | card icon | red |
| OPENAI | Subscriptions | card icon | red |
| CLAUDE | Subscriptions | card icon | red |

## Key UX Principles

1. **One-tap categorization** — tap uncategorized item, pick category, done. Auto-remember is on by default.
2. **Dynamic budget** — income and limit are adjustable throughout the month. The app adapts daily allowance in real-time.
3. **No friction** — no login, no onboarding wizard. First visit shows empty dashboard with "Set up your first month" CTA.
4. **Glanceable** — budget ring + daily allowance answers "can I spend today?" in 1 second.
5. **Progressive disclosure** — dashboard for daily use, deep pages for analysis sessions.
