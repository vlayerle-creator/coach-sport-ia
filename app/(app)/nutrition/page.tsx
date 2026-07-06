import Link from "next/link";
import { Settings2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MacroBar } from "@/components/nutrition/macro-bar";
import { SupplementSchedule } from "@/components/nutrition/supplement-schedule";
import { GenerateMenuDialog } from "@/components/nutrition/generate-menu-dialog";
import { MenuPlanView } from "@/components/nutrition/menu-plan-view";
import type { MenuDay } from "@/lib/ai/menu-generator";

export default async function NutritionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const today = new Date().toISOString().split("T")[0];

  const [
    { data: target },
    { data: meals },
    { data: supplements },
    { data: plan },
  ] = await Promise.all([
    supabase
      .from("nutrition_targets")
      .select("calories_kcal, protein_g, carbs_g, fat_g")
      .eq("user_id", user!.id)
      .lte("effective_from", today)
      .order("effective_from", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("meals")
      .select("meal_type, meal_items(quantity_g, food_items(calories_kcal_per_100g, protein_g_per_100g, carbs_g_per_100g, fat_g_per_100g))")
      .eq("user_id", user!.id)
      .eq("meal_date", today),
    supabase
      .from("supplements")
      .select("id, name, type, dosage, unit, timing")
      .eq("user_id", user!.id)
      .eq("is_active", true)
      .order("name"),
    supabase
      .from("menu_plans")
      .select("id, generated_at, days")
      .eq("user_id", user!.id)
      .eq("is_active", true)
      .order("generated_at", { ascending: false })
      .limit(1)
      .single(),
  ]);

  // Compute today's logged totals
  const allItems = (meals ?? []).flatMap((m: any) => m.meal_items ?? []);
  const totals = allItems.reduce(
    (acc: any, item: any) => {
      const f = item.food_items;
      if (!f) return acc;
      const r = item.quantity_g / 100;
      return {
        cal: acc.cal + f.calories_kcal_per_100g * r,
        prot: acc.prot + f.protein_g_per_100g * r,
        carbs: acc.carbs + f.carbs_g_per_100g * r,
        fat: acc.fat + f.fat_g_per_100g * r,
      };
    },
    { cal: 0, prot: 0, carbs: 0, fat: 0 }
  );

  const hasTarget = !!target;

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nutrition</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/nutrition/journal"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
            title="Journal"
          >
            <BookOpen className="h-4 w-4" />
          </Link>
          <Link
            href="/nutrition/targets"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
            title="Objectifs"
          >
            <Settings2 className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Macro summary */}
      {hasTarget && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Mangé aujourd'hui</span>
              <span className="text-lg font-bold">
                {Math.round(totals.cal)}/{target!.calories_kcal} kcal
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <MacroBar label="Protéines" current={totals.prot} target={target!.protein_g} color="bg-blue-500" />
            <MacroBar label="Glucides" current={totals.carbs} target={target!.carbs_g} color="bg-amber-400" />
            <MacroBar label="Lipides" current={totals.fat} target={target!.fat_g} color="bg-rose-400" />
          </CardContent>
        </Card>
      )}

      {!hasTarget && (
        <Card>
          <CardContent className="pt-4 text-center py-6 space-y-2">
            <p className="text-sm text-muted-foreground">Aucun objectif nutritionnel défini.</p>
            <Link href="/nutrition/targets" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              Définir mes objectifs
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Suppléments */}
      {supplements && supplements.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">💊 Compléments du jour</CardTitle>
          </CardHeader>
          <CardContent>
            <SupplementSchedule supplements={supplements} />
          </CardContent>
        </Card>
      )}

      {/* Menu IA — zone principale */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Mon menu</h2>
          {plan && (
            <p className="text-xs text-muted-foreground">
              Généré le {new Date(plan.generated_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
        <GenerateMenuDialog hasTarget={hasTarget} />
      </div>

      {plan ? (
        <MenuPlanView
          plan_id={plan.id}
          days={plan.days as unknown as MenuDay[]}
        />
      ) : (
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <p className="text-4xl">🍽️</p>
            <p className="font-semibold">Aucun menu généré</p>
            <p className="text-sm text-muted-foreground">
              Clique sur "Générer un menu" pour créer ton plan alimentaire personnalisé par IA.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
