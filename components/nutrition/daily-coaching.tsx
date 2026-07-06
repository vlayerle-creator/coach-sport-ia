import { Target, Utensils, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddFoodDialog } from "./add-food-dialog";

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

const MEAL_TIPS: Record<string, string> = {
  breakfast: "Privilégie les protéines + glucides complexes pour démarrer la journée.",
  morning_snack: "Fruits + source de protéines pour tenir jusqu'au déjeuner.",
  lunch: "Ton repas le plus complet : protéines, glucides, légumes.",
  afternoon_snack: "Idéal avant l'entraînement si tu t'entraînes en soirée.",
  pre_workout: "Glucides rapides + protéines 60–90 min avant la séance.",
  post_workout: "Priorité aux protéines dans les 30 min + glucides pour recharger les stocks.",
  dinner: "Protéines + légumes + lipides. Réduis les glucides si tu vises la sèche.",
  evening_snack: "Caséine ou fromage blanc pour la synthèse protéique nocturne.",
};

interface FoodItem {
  id: string;
  name: string;
  brand: string | null;
  serving_size_g: number | null;
  calories_kcal_per_100g: number;
  protein_g_per_100g: number;
  carbs_g_per_100g: number;
  fat_g_per_100g: number;
}

interface MealPlan {
  meal_type: string;
  target_kcal: number;
  target_prot_g: number;
  logged_kcal: number;
  logged_prot_g: number;
  done: boolean;
}

interface DailyCoachingProps {
  meal_date: string;
  plans: MealPlan[];
  foods: FoodItem[];
  primary_goal: string | null;
  preferred_meals_count: number | null;
}

const GOAL_LABELS: Record<string, string> = {
  bulk: "Prise de masse",
  cut: "Sèche",
  recomp: "Recomposition",
  maintain: "Maintien",
};

export function DailyCoaching({ meal_date, plans, foods, primary_goal, preferred_meals_count }: DailyCoachingProps) {
  const totalTargetKcal = plans.reduce((s, p) => s + p.target_kcal, 0);
  const totalLoggedKcal = plans.reduce((s, p) => s + p.logged_kcal, 0);
  const remaining = totalTargetKcal - totalLoggedKcal;

  return (
    <div className="space-y-4">
      {/* Résumé du plan */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-lg mt-0.5">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm">Plan du jour</p>
                {primary_goal && (
                  <Badge variant="secondary" className="text-xs">{GOAL_LABELS[primary_goal] ?? primary_goal}</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {preferred_meals_count ?? plans.length} repas · {totalTargetKcal} kcal cibles
                {remaining > 0 ? ` · ${Math.round(remaining)} kcal restantes` : " · Objectif atteint ✓"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Repas un par un */}
      <div className="space-y-3">
        {plans.map((plan) => {
          const pct = plan.target_kcal > 0 ? Math.min((plan.logged_kcal / plan.target_kcal) * 100, 100) : 0;
          const remainingKcal = Math.max(plan.target_kcal - plan.logged_kcal, 0);
          const remainingProt = Math.max(plan.target_prot_g - plan.logged_prot_g, 0);

          return (
            <Card key={plan.meal_type} className={plan.done ? "opacity-70" : ""}>
              <CardHeader className="pb-2 pt-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-3.5 w-3.5 text-muted-foreground" />
                    <CardTitle className="text-sm">{MEAL_TYPE_LABELS[plan.meal_type]}</CardTitle>
                    {plan.done && <Badge variant="outline" className="text-xs text-green-600 border-green-500/30">✓</Badge>}
                  </div>
                  <AddFoodDialog meal_date={meal_date} meal_type={plan.meal_type} foods={foods} />
                </div>
              </CardHeader>
              <CardContent className="pb-3 space-y-2">
                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.round(plan.logged_kcal)} / {plan.target_kcal} kcal</span>
                    <span>{Math.round(pct)}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Conseil */}
                {!plan.done && (
                  <p className="text-xs text-muted-foreground italic">{MEAL_TIPS[plan.meal_type]}</p>
                )}

                {/* Ce qu'il reste */}
                {!plan.done && remainingKcal > 0 && (
                  <div className="flex gap-3 text-xs">
                    <span className="text-muted-foreground">Reste :</span>
                    <span className="font-medium">{Math.round(remainingKcal)} kcal</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="font-medium">{Math.round(remainingProt)}g prot.</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Conseil global du jour */}
      <Card className="border-dashed">
        <CardContent className="pt-4 pb-3">
          <div className="flex gap-3">
            <TrendingUp className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-medium">Conseil du jour</p>
              <GoalTip goal={primary_goal} remaining={remaining} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GoalTip({ goal, remaining }: { goal: string | null; remaining: number }) {
  if (remaining < 0) {
    return <p className="text-xs text-muted-foreground">Tu as dépassé ton objectif calorique. Favorise les protéines maigres pour le reste de la journée.</p>;
  }
  if (goal === "bulk") {
    return <p className="text-xs text-muted-foreground">En prise de masse, ne saute pas de repas. Si tu n'as pas faim, ajoute une source de glucides liquide (jus de fruits, boisson maltodextrine).</p>;
  }
  if (goal === "cut") {
    return <p className="text-xs text-muted-foreground">En sèche, priorise les protéines à chaque repas pour préserver le muscle. Bois 2–3L d'eau pour réduire la faim.</p>;
  }
  if (goal === "recomp") {
    return <p className="text-xs text-muted-foreground">En recomposition, synchronise tes glucides avec tes séances : plus avant/après l'entraînement, moins les jours off.</p>;
  }
  return <p className="text-xs text-muted-foreground">Répartis tes protéines sur tous tes repas pour maximiser la synthèse musculaire (0.3–0.4g/kg par repas).</p>;
}
