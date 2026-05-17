"use client";

import { useState } from "react";
import { useApp } from "@/lib/context/use-app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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

        <div className="flex rounded-xl bg-card p-1 mb-4">
          <button onClick={() => setType("buy")} className={cn("flex-1 py-2 text-xs rounded-lg font-medium transition-colors", type === "buy" ? "bg-[var(--color-green-dim)] text-[var(--color-green)]" : "text-muted-foreground")}>Buy</button>
          <button onClick={() => setType("sell")} className={cn("flex-1 py-2 text-xs rounded-lg font-medium transition-colors", type === "sell" ? "bg-[var(--color-red-dim)] text-[var(--color-red)]" : "text-muted-foreground")}>Sell</button>
        </div>

        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2">Asset</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {investments.map((inv) => (
            <button key={inv.id} onClick={() => setSelectedAsset(inv.id)} className={cn("p-2.5 rounded-xl border text-xs font-medium transition-all text-center", selectedAsset === inv.id ? "border-[var(--color-green)] bg-[var(--color-green-dim)]" : "border-border bg-card hover:border-[var(--color-green)]/50")}>{inv.assetName}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1.5">Quantity</p>
            <Input type="text" placeholder="0.00" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="h-10 bg-card border-border text-sm" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1.5">Price/unit (COP)</p>
            <Input type="text" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} className="h-10 bg-card border-border text-sm" />
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1.5">Date</p>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-10 bg-card border-border text-sm mb-5" />

        <Button onClick={handleSubmit} disabled={!selectedAsset || !quantity || !price} className="w-full h-12 bg-[var(--color-green)] text-black font-semibold hover:bg-[var(--color-green)]/90 shadow-[0_0_20px_var(--color-green-dim)] disabled:opacity-50 disabled:shadow-none">
          Log {type === "buy" ? "Purchase" : "Sale"}
        </Button>
      </SheetContent>
    </Sheet>
  );
}
