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
