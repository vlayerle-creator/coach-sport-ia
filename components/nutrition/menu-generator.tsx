"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Sparkles, ChevronDown, ChevronUp, RefreshCw,
  Droplets, Pill, Info, Clock, ArrowLeftRight,
} from "lucide-react";
import { generateAndSaveMenu } from "@/lib/actions/menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MenuDay, MenuMeal, SupplementRec } from "@/lib/ai/menu-generator";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

const PRIORITY_STYLE: Record<string, string> = {
  prioritaire: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  utile: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  facultatif: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

function MacroRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <span className={`text-xs font-medium ${color}`}>
      {label} {Math.round(value)}g
    </span>
  );
}

// ─── Supplement card ──────────────────────────────────────────────────────────

function SupplementCard({ s }: { s: SupplementRec }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Pill className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="text-sm font-medium truncate">{s.name}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${PRIORITY_STYLE[s.priority] ?? PRIORITY_STYLE.facultatif}`}>
            {s.priority}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          <span className="text-xs text-muted-foreground">{s.dose}</span>
          {open ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
        </div>
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-1.5 border-t bg-muted/20">
          <p className="text-xs pt-2"><span className="font-medium">Moment :</span> {s.timing}</p>
          <p className="text-xs"><span className="font-medium">Pourquoi :</span> {s.reason}</p>
          <p className="text-xs"><span className="font-medium">Effet attendu :</span> {s.effect}</p>
          {s.precautions && (
            <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded p-1.5">
              ⚠️ {s.precautions}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Meal card ────────────────────────────────────────────────────────────────

function MealCard({ meal }: { meal: MenuMeal }) {
  const [open, setOpen] = useState(true);
  const [showExtra, setShowExtra] = useState(false);

  return (
    <div className="border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex flex-col items-start text-left gap-0.5 min-w-0">
          <span className="text-sm font-semibold">
            {MEAL_TYPE_LABELS[meal.meal_type] ?? meal.meal_type}
            {meal.suggested_time && (
              <span className="text-xs text-muted-foreground font-normal ml-1">({meal.suggested_time})</span>
            )}
          </span>
          <span className="text-xs text-muted-foreground truncate max-w-[220px]">{meal.name}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          <Badge variant="secondary" className="text-xs">{Math.round(meal.total_kcal)} kcal</Badge>
          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          {/* Macros row */}
          <div className="flex flex-wrap gap-2">
            <MacroRow label="P" value={meal.total_protein_g} color="text-blue-600" />
            <MacroRow label="G" value={meal.total_carbs_g} color="text-amber-600" />
            <MacroRow label="L" value={meal.total_fat_g} color="text-rose-500" />
            {meal.total_fiber_g > 0 && (
              <MacroRow label="F" value={meal.total_fiber_g} color="text-green-600" />
            )}
            {meal.prep_minutes > 0 && (
              <span className="text-xs text-muted-foreground flex items-center gap-0.5 ml-auto">
                <Clock className="h-3 w-3" />{meal.prep_minutes} min
              </span>
            )}
          </div>

          {/* Foods */}
          <div className="space-y-1">
            {meal.foods.map((food, i) => (
              <div key={i} className="flex justify-between text-sm gap-2">
                <span className="truncate">{food.name}</span>
                <span className="text-muted-foreground shrink-0 text-xs">
                  {food.quantity_g}g {food.weight_note !== "poids cru" ? `(${food.weight_note})` : ""} · {Math.round(food.kcal)} kcal
                </span>
              </div>
            ))}
          </div>

          {/* Prep notes */}
          {meal.prep_notes && (
            <p className="text-xs text-muted-foreground italic border-t pt-2">{meal.prep_notes}</p>
          )}

          {/* Toggle for steps + details */}
          <button
            className="text-xs text-primary hover:underline flex items-center gap-1"
            onClick={() => setShowExtra(v => !v)}
          >
            <Info className="h-3 w-3" />
            {showExtra ? "Masquer les détails" : "Voir étapes + raison + substitutions"}
          </button>

          {showExtra && (
            <div className="space-y-2 border-t pt-2">
              {meal.prep_steps?.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-1">Préparation :</p>
                  <ol className="text-xs text-muted-foreground space-y-0.5 list-decimal list-inside">
                    {meal.prep_steps.map((s, i) => <li key={i}>{s}</li>)}
                  </ol>
                </div>
              )}
              {meal.meal_reason && (
                <div>
                  <p className="text-xs font-medium mb-1">Pourquoi ce repas :</p>
                  <p className="text-xs text-muted-foreground">{meal.meal_reason}</p>
                </div>
              )}
              {meal.substitutions?.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-1 flex items-center gap-1">
                    <ArrowLeftRight className="h-3 w-3" /> Substitutions possibles :
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
                    {meal.substitutions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Day view ─────────────────────────────────────────────────────────────────

function DayMenu({ day }: { day: MenuDay }) {
  const [showLogic, setShowLogic] = useState(false);

  const totals = day.meals.reduce(
    (acc, m) => ({
      kcal: acc.kcal + m.total_kcal,
      prot: acc.prot + m.total_protein_g,
      carbs: acc.carbs + m.total_carbs_g,
      fat: acc.fat + m.total_fat_g,
      fiber: acc.fiber + (m.total_fiber_g ?? 0),
    }),
    { kcal: 0, prot: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const dateLabel = new Date(day.date + "T12:00:00").toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <div className="space-y-4">
      {/* Day header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-semibold capitalize">{dateLabel}</h3>
          <span className="text-xs text-muted-foreground">
            {day.is_training_day ? "🏋️ Jour d'entraînement" : "😴 Jour de repos"}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs">
          <Badge variant="outline">{Math.round(totals.kcal)} kcal</Badge>
          <span className="text-blue-600 font-medium">{Math.round(totals.prot)}g P</span>
          <span className="text-amber-600 font-medium">{Math.round(totals.carbs)}g G</span>
          <span className="text-rose-500 font-medium">{Math.round(totals.fat)}g L</span>
          {totals.fiber > 0 && <span className="text-green-600 font-medium">{Math.round(totals.fiber)}g F</span>}
        </div>
      </div>

      {/* Cibles */}
      <div className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
        Cibles : {day.targets.kcal} kcal · {day.targets.protein_g}g P · {day.targets.carbs_g}g G · {day.targets.fat_g}g L
        {day.targets.fiber_g ? ` · ${day.targets.fiber_g}g fibres` : ""}
      </div>

      {/* Meals */}
      <div className="space-y-2">
        {day.meals.map((meal, i) => <MealCard key={i} meal={meal} />)}
      </div>

      {/* Hydratation */}
      {day.hydration_notes && (
        <div className="flex items-start gap-2 text-xs text-muted-foreground border rounded-lg px-3 py-2">
          <Droplets className="h-3.5 w-3.5 shrink-0 text-blue-400 mt-0.5" />
          <span>{day.hydration_notes}</span>
        </div>
      )}

      {/* Suppléments */}
      {day.supplements?.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Compléments recommandés</p>
          {day.supplements.map((s, i) => <SupplementCard key={i} s={s} />)}
        </div>
      )}

      {/* Logique du jour */}
      {day.daily_logic && (
        <div>
          <button
            className="text-xs text-primary hover:underline flex items-center gap-1"
            onClick={() => setShowLogic(v => !v)}
          >
            <Info className="h-3 w-3" />
            {showLogic ? "Masquer" : "Pourquoi ce menu correspond à votre objectif"}
          </button>
          {showLogic && (
            <p className="text-xs text-muted-foreground mt-2 border-l-2 border-primary/30 pl-3">
              {day.daily_logic}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MenuGenerator({ hasTarget }: { hasTarget: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [menu, setMenu] = useState<MenuDay[] | null>(null);
  const [activeDays, setActiveDays] = useState(1);

  function generate(d: number) {
    setActiveDays(d);
    startTransition(async () => {
      try {
        const result = await generateAndSaveMenu({ days: d });
        if (!result) { toast.error("Aucune réponse du serveur"); return; }
        if (result.error) { toast.error(result.error); return; }
        // Menu is now saved in DB — redirect handled by router.refresh()
        setMenu(null);
        router.refresh();
      } catch (err: any) {
        toast.error(err?.message ?? "Erreur lors de la génération");
      }
    });
  }

  if (!hasTarget) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-sm text-muted-foreground py-10">
          Définis d'abord tes objectifs nutritionnels pour générer un menu.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Generator card */}
      <Card>
        <CardContent className="pt-4 pb-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-lg shrink-0">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Génération de menu par IA</p>
              <p className="text-xs text-muted-foreground">
                Menu personnalisé selon ton profil complet : objectif, anthropométrie, entraînement, préférences alimentaires et compléments.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {([1, 3, 7, 14] as const).map((d) => (
              <Button
                key={d}
                size="sm"
                variant={activeDays === d && menu ? "default" : "outline"}
                disabled={pending}
                onClick={() => generate(d)}
              >
                {pending && activeDays === d ? (
                  <><RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />Génération…</>
                ) : (
                  d === 1 ? "Menu du jour" : d === 3 ? "3 jours" : d === 7 ? "1 semaine" : "2 semaines"
                )}
              </Button>
            ))}
          </div>

          {pending && (
            <p className="text-xs text-muted-foreground text-center">
              Claude analyse ton profil et génère ton menu… (~15-30s selon le nombre de jours)
            </p>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {menu && (
        <div className="space-y-8">
          {menu.map((day, i) => (
            <Card key={i}>
              <CardContent className="pt-4 pb-4">
                <DayMenu day={day} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
