"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/context/use-app";
import { Pencil, Check } from "lucide-react";

interface ManageCategoriesSheetProps {
  open: boolean;
  onClose: () => void;
}

const colorOptions = [
  { value: "purple", label: "Purple", css: "bg-[var(--color-purple)]" },
  { value: "blue", label: "Blue", css: "bg-[var(--color-blue)]" },
  { value: "green", label: "Green", css: "bg-[var(--color-green)]" },
  { value: "yellow", label: "Yellow", css: "bg-[var(--color-yellow)]" },
  { value: "red", label: "Red", css: "bg-[var(--color-red)]" },
  { value: "orange", label: "Orange", css: "bg-[var(--color-orange)]" },
  { value: "cyan", label: "Cyan", css: "bg-[var(--color-cyan)]" },
];

export function ManageCategoriesSheet({ open, onClose }: ManageCategoriesSheetProps) {
  const { categories, editCategory } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editColor, setEditColor] = useState("");

  const startEdit = (cat: { id: string; name: string; icon: string; color: string }) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditIcon(cat.icon);
    setEditColor(cat.color);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await editCategory(editingId, { name: editName, icon: editIcon, color: editColor });
    setEditingId(null);
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl bg-secondary border-border px-5 pb-8 max-h-[80vh] overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="w-9 h-1 rounded-full bg-border mx-auto mb-4" />
          <SheetTitle className="text-base font-semibold text-left">Manage Categories</SheetTitle>
        </SheetHeader>

        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
              {editingId === cat.id ? (
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={editIcon}
                      onChange={(e) => setEditIcon(e.target.value)}
                      className="w-16 h-9 bg-secondary border-border text-center text-lg"
                      placeholder="🎉"
                    />
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 h-9 bg-secondary border-border text-sm"
                    />
                  </div>
                  <div className="flex gap-1.5">
                    {colorOptions.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setEditColor(c.value)}
                        className={`w-6 h-6 rounded-full ${c.css} ${editColor === c.value ? "ring-2 ring-white ring-offset-2 ring-offset-secondary" : ""}`}
                      />
                    ))}
                  </div>
                  <Button onClick={saveEdit} size="sm" className="h-8 bg-[var(--color-green)] text-black hover:bg-[var(--color-green)]/90 text-xs">
                    <Check className="h-3 w-3 mr-1" /> Save
                  </Button>
                </div>
              ) : (
                <>
                  <span className="text-xl">{cat.icon}</span>
                  <span className="flex-1 text-sm font-medium">{cat.name}</span>
                  <button onClick={() => startEdit(cat)} className="text-muted-foreground hover:text-foreground">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
