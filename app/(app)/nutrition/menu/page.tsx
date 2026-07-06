import { createClient } from "@/lib/supabase/server";
import { MenuPlanView } from "@/components/nutrition/menu-plan-view";
import { GenerateMenuDialog } from "@/components/nutrition/generate-menu-dialog";
import type { MenuDay } from "@/lib/ai/menu-generator";

export default async function MenuPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: plan } = await supabase
    .from("menu_plans")
    .select("id, generated_at, parameters, days")
    .eq("user_id", user!.id)
    .eq("is_active", true)
    .order("generated_at", { ascending: false })
    .limit(1)
    .single();

  const { data: target } = await supabase
    .from("nutrition_targets")
    .select("calories_kcal")
    .eq("user_id", user!.id)
    .order("effective_from", { ascending: false })
    .limit(1)
    .single();

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mon menu</h1>
          {plan && (
            <p className="text-xs text-muted-foreground">
              Généré le {new Date(plan.generated_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
        <GenerateMenuDialog hasTarget={!!target} />
      </div>

      {plan ? (
        <MenuPlanView
          plan_id={plan.id}
          days={plan.days as unknown as MenuDay[]}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <p className="text-4xl">🍽️</p>
          <p className="text-lg font-semibold">Aucun menu généré</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Clique sur "Générer un menu" pour créer ton plan alimentaire personnalisé par IA.
          </p>
          {!target && (
            <p className="text-xs text-amber-600">⚠️ Définis d'abord tes objectifs nutritionnels.</p>
          )}
        </div>
      )}
    </div>
  );
}
