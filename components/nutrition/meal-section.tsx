"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { deleteMealItem } from "@/lib/actions/nutrition";
import { Button } from "@/components/ui/button";
import { AddFoodDialog } from "./add-food-dialog";

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

interface MealItemRow {
  id: string;
  quantity_g: number;
  food_items: {
    name: string;
    calories_kcal_per_100g: number;
    protein_g_per_100g: number;
    carbs_g_per_100g: number;
    fat_g_per_100g: number;
  } | null;
}

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "🌅 Petit-déjeuner",
  morning_snack: "🍎 Collation matin",
  lunch: "☀️ Déjeuner",
  afternoon_snack: "🥜 Collation après-midi",
  pre_workout: "⚡ Pré-entraînement",
  post_workout: "💪 Post-entraînement",
  dinner: "🌙 Dîner",
  evening_snack: "🍵 Collation soir",
};

interface MealSectionProps {
  meal_date: string;
  meal_type: string;
  items: MealItemRow[];
  foods: FoodItem[];
}

function DeleteButton({ meal_item_id }: { meal_item_id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteMealItem(meal_item_id);
      if (result?.error) { toast.error(result.error); return; }
      router.refresh();
    });
  }

  return (
    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" disabled={pending} onClick={handleDelete}>
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
}

export function MealSection({ meal_date, meal_type, items, foods }: MealSectionProps) {
  const totalCal = items.reduce((sum, item) => {
    const f = item.food_items;
    return sum + (f ? (f.calories_kcal_per_100g * item.quantity_g) / 100 : 0);
  }, 0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{MEAL_TYPE_LABELS[meal_type] ?? meal_type}</span>
          {items.length > 0 && (
            <span className="text-xs text-muted-foreground">{Math.round(totalCal)} kcal</span>
          )}
        </div>
        <AddFoodDialog meal_date={meal_date} meal_type={meal_type} foods={foods} />
      </div>

      {items.length > 0 && (
        <div className="space-y-1 pl-2 border-l-2 border-muted">
          {items.map((item) => {
            const f = item.food_items;
            if (!f) return null;
            const cal = Math.round((f.calories_kcal_per_100g * item.quantity_g) / 100);
            const prot = Math.round((f.protein_g_per_100g * item.quantity_g) / 100 * 10) / 10;
            const carbs = Math.round((f.carbs_g_per_100g * item.quantity_g) / 100 * 10) / 10;
            const fat = Math.round((f.fat_g_per_100g * item.quantity_g) / 100 * 10) / 10;
            return (
              <div key={item.id} className="flex items-center gap-2 text-sm py-0.5">
                <div className="flex-1 min-w-0">
                  <span className="font-medium truncate block">{f.name}</span>
                  <span className="text-xs text-muted-foreground">{item.quantity_g}g · {cal} kcal · P:{prot}g G:{carbs}g L:{fat}g</span>
                </div>
                <DeleteButton meal_item_id={item.id} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
