export interface Expense {
  id: string;
  merchantName: string;
  merchantNormalized: string;
  amount: number;
  categoryId: string | null;
  category: Category | null;
  bank: string;
  cardLast4: string;
  date: string;
  time: string;
  rawSms: string;
  isRecurring: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface MerchantMapping {
  id: string;
  pattern: string;
  categoryId: string;
  category: Category;
  isRecurring: boolean;
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
  recurring: boolean;
}

export interface BudgetMonth {
  id: string;
  month: string;
  spendingLimit: number;
  incomes: Income[];
  obligations: Obligation[];
}

export interface Investment {
  id: string;
  assetName: string;
  assetType: string;
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

export interface RecurringExpense {
  id: string;
  label: string | null;
  expectedAmount: number | null;
  merchantMapping: MerchantMapping;
  months: RecurringExpenseMonth[];
}

export interface RecurringExpenseMonth {
  id: string;
  month: string;
  status: "pending" | "arrived" | "snoozed" | "cancelled";
  expense: Expense | null;
}

export type TimeRange = "week" | "month" | "3months" | "year";
