"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { addMealItem } from "@/lib/actions/nutrition";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface FoodItem {
  id: string;
  name: string;
  brand: string | null;
  calories_kcal_per_100g: number;
  protein_g_per_100g: number;
  carbs_g_per_100g: number;
  fat_g_per_100g: number;
  serving_size_g: number | null;
}

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "Petit-déjeuner",
  morning_snack: "Collation matin",
  lunch: "Déjeuner",
  afternoon_snack: "Collation après-midi",
  pre_workout: "Pré-entraînement",
  post_workout: "Post-entraînement",
  dinner: "Dîner",
  evening_snack: "Collation soir",
};

interface AddFoodDialogProps {
  meal_date: string;
  meal_type: string;
  foods: FoodItem[];
}

export function AddFoodDialog({ meal_date, meal_type, foods }: AddFoodDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = foods.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase()) ||
    (f.brand ?? "").toLowerCase().includes(query.toLowerCase())
  ).slice(0, 30);

  function handleSelect(food: FoodItem) {
    setSelected(food);
    setQuantity(String(food.serving_size_g ?? 100));
  }

  function handleAdd() {
    if (!selected || !quantity) return;
    startTransition(async () => {
      const result = await addMealItem({
        meal_date,
        meal_type,
        food_item_id: selected.id,
        quantity_g: parseFloat(quantity),
      });
      if (result?.error) { toast.error(result.error); return; }
      toast.success("Aliment ajouté");
      setOpen(false);
      setSelected(null);
      setQuery("");
      setQuantity("");
      router.refresh();
    });
  }

  const qty = parseFloat(quantity) || 0;
  const preview = selected ? {
    cal: Math.round((selected.calories_kcal_per_100g * qty) / 100),
    prot: Math.round((selected.protein_g_per_100g * qty) / 100 * 10) / 10,
    carbs: Math.round((selected.carbs_g_per_100g * qty) / 100 * 10) / 10,
    fat: Math.round((selected.fat_g_per_100g * qty) / 100 * 10) / 10,
  } : null;

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setSelected(null); setQuery(""); } }}>
      <DialogTrigger className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}>
        <Plus className="h-3.5 w-3.5 mr-1" /> Ajouter
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter — {MEAL_TYPE_LABELS[meal_type] ?? meal_type}</DialogTitle>
        </DialogHeader>

        {!selected ? (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Rechercher un aliment…" value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />
            </div>
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {query.length < 1 && <p className="text-sm text-muted-foreground text-center py-6">Tapez pour rechercher</p>}
              {query.length >= 1 && filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Aucun résultat</p>}
              {filtered.map((f) => (
                <button
                  key={f.id}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => handleSelect(f)}
                >
                  <p className="text-sm font-medium">{f.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {f.brand ? `${f.brand} · ` : ""}{Math.round(f.calories_kcal_per_100g)} kcal · {f.protein_g_per_100g}g P · {f.carbs_g_per_100g}g G · {f.fat_g_per_100g}g L <span className="text-muted-foreground/60">(pour 100g)</span>
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="font-medium">{selected.name}</p>
              {selected.brand && <p className="text-xs text-muted-foreground">{selected.brand}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité (g)</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                autoFocus
              />
              {selected.serving_size_g && (
                <button
                  className="text-xs text-primary hover:underline"
                  onClick={() => setQuantity(String(selected.serving_size_g))}
                >
                  1 portion = {selected.serving_size_g}g
                </button>
              )}
            </div>

            {preview && qty > 0 && (
              <div className="grid grid-cols-4 gap-2 text-center bg-muted/50 rounded-lg p-3">
                <div>
                  <p className="text-sm font-bold">{preview.cal}</p>
                  <p className="text-xs text-muted-foreground">kcal</p>
                </div>
                <div>
                  <p className="text-sm font-bold">{preview.prot}g</p>
                  <p className="text-xs text-muted-foreground">Prot.</p>
                </div>
                <div>
                  <p className="text-sm font-bold">{preview.carbs}g</p>
                  <p className="text-xs text-muted-foreground">Gluc.</p>
                </div>
                <div>
                  <p className="text-sm font-bold">{preview.fat}g</p>
                  <p className="text-xs text-muted-foreground">Lip.</p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setSelected(null)}>Retour</Button>
              <Button className="flex-1" disabled={pending || qty <= 0} onClick={handleAdd}>
                {pending ? "Ajout…" : "Ajouter"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
