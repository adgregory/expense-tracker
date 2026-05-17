# Expense Tracker Backend Design Spec

## Overview

Add a real backend to the expense tracker: Prisma ORM + Neon PostgreSQL + Next.js API routes. SMS ingestion from iOS automation, auto-categorization with learning, recurring expense tracking, and a bulk import endpoint for historical data.

Single user, no login. API key auth on the SMS ingestion endpoint only.

## Tech Stack

- **ORM:** Prisma
- **Database:** Neon PostgreSQL
- **API:** Next.js Route Handlers (`app/api/`)
- **Deployment:** Vercel
- **SMS Parsing:** Bank-specific regex parser registry

## Database Schema

### Prisma Models

```prisma
model Expense {
  id                 String    @id @default(cuid())
  merchantName       String    // raw from SMS
  merchantNormalized String    // uppercase, cleaned for matching
  amount             Int       // COP, no decimals
  categoryId         String?
  category           Category? @relation(fields: [categoryId], references: [id])
  bank               String    // "banco_de_bogota" | "bancolombia" | "bofa"
  cardLast4          String    // "4910"
  date               String    // "2026-05-10"
  time               String    // "21:25:35"
  rawSms             String
  isRecurring        Boolean   @default(false)
  createdAt          DateTime  @default(now())

  recurringMonth RecurringExpenseMonth?
}

model Category {
  id       String @id @default(cuid())
  name     String @unique
  icon     String // emoji
  color    String // "purple", "blue", "green", etc.

  expenses         Expense[]
  merchantMappings MerchantMapping[]
}

model MerchantMapping {
  id          String   @id @default(cuid())
  pattern     String   @unique // uppercase normalized merchant name
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  isRecurring Boolean  @default(false)

  recurringExpense RecurringExpense?
}

model RecurringExpense {
  id                String          @id @default(cuid())
  merchantMappingId String          @unique
  merchantMapping   MerchantMapping @relation(fields: [merchantMappingId], references: [id])
  expectedAmount    Int?            // nullable — some vary month to month
  label             String?         // friendly name override, e.g., "Google Workspace"

  months RecurringExpenseMonth[]
}

model RecurringExpenseMonth {
  id                 String           @id @default(cuid())
  recurringExpenseId String
  recurringExpense   RecurringExpense @relation(fields: [recurringExpenseId], references: [id])
  month              String           // "2026-05"
  status             String           @default("pending") // "pending" | "arrived" | "snoozed" | "cancelled"
  expenseId          String?          @unique
  expense            Expense?         @relation(fields: [expenseId], references: [id])
}

model BudgetMonth {
  id            String       @id @default(cuid())
  month         String       @unique // "2026-05"
  spendingLimit Int

  incomes     Income[]
  obligations Obligation[]
}

model Income {
  id            String      @id @default(cuid())
  budgetMonthId String
  budgetMonth   BudgetMonth @relation(fields: [budgetMonthId], references: [id])
  source        String
  amount        Int
  date          String
}

model Obligation {
  id            String      @id @default(cuid())
  budgetMonthId String
  budgetMonth   BudgetMonth @relation(fields: [budgetMonthId], references: [id])
  name          String
  amount        Int
  dueDate       String
  paid          Boolean     @default(false)
  recurring     Boolean     @default(false)
}

model Investment {
  id               String                  @id @default(cuid())
  assetName        String
  assetType        String                  // "precious-metal", "precious-stones", "crypto", "etf"
  currentValuePerUnit Float
  transactions     InvestmentTransaction[]
}

model InvestmentTransaction {
  id           String     @id @default(cuid())
  investmentId String
  investment   Investment @relation(fields: [investmentId], references: [id])
  type         String     // "buy" | "sell"
  quantity     Float
  pricePerUnit Float
  date         String
  notes        String?
}
```

### Seeding

Seed the database with the default categories and merchant mappings:

**Categories:** Delivery, Transportation, Groceries, Flights, Subscriptions, Entertainment, Restaurants

**Merchant Mappings:**

| Pattern | Category | Recurring |
|---------|----------|-----------|
| RAPPI | Delivery | no |
| UBER | Transportation | no |
| DIDI | Transportation | no |
| LATAM AIRLINES | Flights | no |
| AVIANCA | Flights | no |
| DELTA | Flights | no |
| CARULLA | Groceries | no |
| EXITO | Groceries | no |
| OLIMPICA | Groceries | no |
| JUMBO | Groceries | no |
| ANTHROPIC | Subscriptions | yes |
| OPENAI | Subscriptions | yes |
| CLAUDE | Subscriptions | yes |
| GOOGLE | Subscriptions | yes |
| AMAZON PRIME | Subscriptions | yes |
| AIRBNB | Flights | no |

For mappings marked recurring, also create corresponding `RecurringExpense` rows.

## SMS Parser Registry

### Architecture

```
src/lib/sms/
├── registry.ts          // SmsParserRegistry class
├── types.ts             // ParsedSms, SmsParser interface
├── normalizer.ts        // MerchantNormalizer
└── banks/
    └── banco-de-bogota.ts  // BancoDeBogotaParser
```

### Interfaces

```typescript
interface ParsedSms {
  amount: number;       // COP integer
  merchant: string;     // raw merchant from SMS
  cardLast4: string;    // "4910"
  date: string;         // "2026-05-10" (ISO)
  time: string;         // "21:25:35"
}

interface SmsParser {
  bankId: string;
  patterns: RegExp[];
  parse(sms: string): ParsedSms | null;
}
```

### SmsParserRegistry

```typescript
class SmsParserRegistry {
  private parsers: Map<string, SmsParser>;

  register(parser: SmsParser): void;
  parse(sms: string, bankId: string): ParsedSms;  // throws if no match
  tryParse(sms: string, bankId: string): ParsedSms | null;  // returns null if no match
}
```

### Banco de Bogota Parser

Two formats to handle:

**Format A** — full details with date/time:
```
Banco de Bogota: Tu compra por 26,706 fue aprobada con Tarjeta Crédito 4910 el 10/05/26 21:25:35 en UBER RIDES ¿Dudas?...
```
Regex: `Tu compra por ([\d.,]+) fue aprobada con Tarjeta Cr[eé]dito (\d{4}) el (\d{2}\/\d{2}\/\d{2}) (\d{2}:\d{2}:\d{2}) en (.+?)(?:\s*¿Dudas\?|$)`

**Format B** — no date/time:
```
Tu transaccion fue aprobada con T. Credito #4910 por $750,960 en LATAM AIRLINES COLOMBI . Si no has sido tu...
```
Regex: `Tu transaccion fue aprobada con T\. Credito #(\d{4}) por \$([\d.,]+) en (.+?)(?:\s*\.\s*Si no has sido tu|$)`

For Format B, date/time are not in the SMS — use the timestamp from the iOS automation payload (or current time as fallback).

### Merchant Normalizer

Rules applied in order:
1. Uppercase
2. Strip known prefixes: `DLO*`, `DL*`, `GOOGLE *`
3. Strip known suffixes: `*DL`, `*HMRW5ES99W` (any `*` + alphanumeric suffix), `COLOMBI`, `COLOMBIA`, `GROUP S`, `_luma` (any `_` + suffix)
4. Strip trailing ` .` and whitespace
5. Trim

The normalizer is extensible — new rules can be added for future banks.

After normalization, lookup `MerchantMapping` by checking if the normalized merchant **starts with** any known pattern. This handles cases like `UBER RIDES` matching pattern `UBER`, or `LATAM AIRLINES GROUP S` matching `LATAM AIRLINES`.

## API Routes

### SMS Ingestion

**`POST /api/sms`** — called by iOS automation

Headers: `x-api-key: <secret>`

Request body:
```json
{
  "sms": "Banco de Bogota: Tu compra por 26,706 fue aprobada...",
  "bank": "banco_de_bogota",
  "receivedAt": "2026-05-10T21:25:35"  // optional, iOS timestamp
}
```

Flow:
1. Validate API key
2. Parse SMS via `SmsParserRegistry.parse(sms, bank)`
3. Normalize merchant name
4. Lookup `MerchantMapping` where normalized merchant starts with mapping pattern
5. If found:
   - Set category from mapping
   - If `mapping.isRecurring`: find or create `RecurringExpenseMonth` for current month, set status "arrived", link expense
   - Set `expense.isRecurring = mapping.isRecurring`
6. Save expense to DB
7. Return `{ id, merchant, amount, categorized: boolean, recurring: boolean }`

Response: `201 Created`

### Bulk Import

**`POST /api/bulk-import`** — one-off endpoint for importing historical SMS data

Headers: `x-api-key: <secret>`

Request body:
```json
{
  "messages": [
    { "sms": "Banco de Bogota: Tu compra por...", "bank": "banco_de_bogota" },
    { "sms": "Tu transaccion fue aprobada...", "bank": "banco_de_bogota" }
  ]
}
```

Flow:
1. Validate API key
2. For each message, run same logic as `/api/sms` (parse, normalize, match, save)
3. Skip duplicates (same rawSms already in DB)
4. Return `{ imported: number, skipped: number, errors: string[] }`

### Expenses

**`GET /api/expenses?month=2026-05&category=delivery`**
- Returns expenses for the given month, optionally filtered by category
- Includes category relation
- Sorted by date desc, time desc

**`PATCH /api/expenses/[id]`**
- Body: `{ categoryId: string, remember: boolean, isRecurring?: boolean }`
- Updates the expense's category
- If `remember: true`: creates a `MerchantMapping` (pattern = merchantNormalized, categoryId, isRecurring)
- If `isRecurring: true`: also creates `RecurringExpense` + `RecurringExpenseMonth` for current month with status "arrived"

### Categories

**`GET /api/categories`** — list all

**`POST /api/categories`** — `{ name, icon, color }`

### Merchant Mappings

**`GET /api/merchants`** — list all with category relation

**`POST /api/merchants`** — `{ pattern, categoryId, isRecurring }`

### Budget

**`GET /api/budget/[month]`**
- Returns budget with incomes and obligations
- If month doesn't exist, creates it with spendingLimit 0 and clones recurring obligations from previous month (unpaid)

**`PUT /api/budget/[month]`** — `{ spendingLimit }`

**`POST /api/budget/[month]/income`** — `{ source, amount, date }`

**`POST /api/budget/[month]/obligation`** — `{ name, amount, dueDate, recurring }`

**`PATCH /api/budget/[month]/obligation/[id]`** — `{ paid?, amount?, name? }`

### Recurring Expenses

**`GET /api/recurring?month=2026-05`**
- Returns all recurring expenses with their status for the given month
- Creates pending `RecurringExpenseMonth` rows if they don't exist for the month yet

**`PATCH /api/recurring/[id]`** — `{ status: "snoozed" | "cancelled" }` for a specific month entry

### Investments

**`GET /api/investments`** — list all with transactions

**`POST /api/investments/[id]/transaction`** — `{ type, quantity, pricePerUnit, date, notes? }`
- Updates the investment's quantity accordingly

### Analytics

**`GET /api/analytics/[month]`**
- Returns pre-computed analytics:
  - `categoryBreakdown`: array of `{ categoryId, name, icon, color, total }`
  - `dailySpending`: array of `{ date, amount }`
  - `topMerchants`: array of `{ merchant, total, count }`
  - `totalSpent`, `totalIncome`, `totalObligations`
  - `previousMonth`: same structure for comparison

## Wiring UI to Real Data

### AppProvider Changes

Replace mock data initialization with API fetches:

```typescript
// On mount: fetch current month's data
useEffect(() => {
  Promise.all([
    fetch(`/api/expenses?month=${currentMonth}`).then(r => r.json()),
    fetch(`/api/categories`).then(r => r.json()),
    fetch(`/api/budget/${currentMonth}`).then(r => r.json()),
    fetch(`/api/investments`).then(r => r.json()),
    fetch(`/api/recurring?month=${currentMonth}`).then(r => r.json()),
  ]).then(([expenses, categories, budget, investments, recurring]) => {
    // set state
  });
}, [currentMonth]);
```

Mutations become: call API → on success update local state (optimistic where appropriate).

### New UI Elements

1. **Bank badge** on expense items — small colored dot or text label showing "BdB" (Banco de Bogota), etc.
2. **Recurring section** on Budget page — list of expected recurring expenses this month with status chips: "Arrived" (green), "Pending" (yellow), "Snoozed" (gray), "Cancelled" (red with strikethrough)
3. **Recurring toggle** on categorization sheet — when categorizing an unknown merchant, option to mark as recurring (in addition to the existing "Remember this" toggle)

## Environment Variables

```
DATABASE_URL=postgresql://neondb_owner:...@neon.tech/neondb?sslmode=require
API_KEY=<generated-secret-for-ios-automation>
```

Both set in Vercel environment variables and local `.env`.

## iOS Automation Payload

The iOS Shortcut should:
1. Trigger on new SMS from Banco de Bogota's sender number
2. Send POST to `https://<your-vercel-url>/api/sms`
3. Headers: `Content-Type: application/json`, `x-api-key: <secret>`
4. Body: `{ "sms": "<full SMS text>", "bank": "banco_de_bogota" }`
