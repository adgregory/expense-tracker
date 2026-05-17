import { Home, Receipt, Wallet, TrendingUp, Coins } from "lucide-react";

export const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Expenses", href: "/expenses", icon: Receipt },
  { label: "Budget", href: "/budget", icon: Wallet },
  { label: "Analytics", href: "/analytics", icon: TrendingUp },
  { label: "Invest", href: "/investments", icon: Coins },
] as const;
