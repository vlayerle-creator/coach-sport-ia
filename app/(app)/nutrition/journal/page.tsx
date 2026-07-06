import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MealSection } from "@/components/nutrition/meal-section";

const ALL_MEAL_TYPES = [
  "breakfast", "morning_snack", "lunch", "afternoon_snack",
  "pre_workout", "post_workout", "dinner", "evening_snack",
] as const;

export default async function JournalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const today = new Date().toISOString().split("T")[0];

  const [{ data: meals }, { data: foods }] = await Promise.all([
    supabase
      .from("meals")
      .select("id, meal_type, meal_items(id, quantity_g, food_items(name, calories_kcal_per_100g, protein_g_per_100g, carbs_g_per_100g, fat_g_per_100g))")
      .eq("user_id", user!.id)
      .eq("meal_date", today),
    supabase
      .from("food_items")
      .select("id, name, brand, serving_size_g, calories_kcal_per_100g, protein_g_per_100g, carbs_g_per_100g, fat_g_per_100g")
      .or(`user_id.is.null,user_id.eq.${user!.id}`)
      .order("name"),
  ]);

  const mealMap: Record<string, any[]> = {};
  for (const meal of meals ?? []) {
    mealMap[meal.meal_type] = meal.meal_items ?? [];
  }

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center gap-3">
        <Link href="/nutrition" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">Journal du jour</h1>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4 space-y-5">
          {ALL_MEAL_TYPES.map((type) => (
            <MealSection
              key={type}
              meal_date={today}
              meal_type={type}
              items={mealMap[type] ?? []}
              foods={foods ?? []}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
