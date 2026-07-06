"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ChevronDown, ChevronUp, Pencil, Trash2, Check, X,
  UtensilsCrossed, Droplets, Pill, Info, Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateMenuFood, deleteMenuFood, logMealFromMenu } from "@/lib/actions/menu";
import type { MenuDay, MenuMeal, MenuFood, SupplementRec } from "@/lib/ai/menu-generator";

const MEAL_LABELS: Record<string, string> = {
  breakfast: "🌅 Petit-déjeuner",
  morning_snack: "🍎 Collation matin",
  lunch: "☀️ Déjeuner",
  afternoon_snack: "🥜 Collation après-midi",
  pre_workout: "⚡ Pré-entraînement",
  post_workout: "💪 Post-entraînement",
  dinner: "🌙 Dîner",
  evening_snack: "🍵 Collation soir",
};

const PRIORITY_CLASS: Record<string, string> = {
  prioritaire: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  utile: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  facultatif: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

// ─── Editable food row ────────────────────────────────────────────────────────

function FoodRow({
  food, plan_id, day_index, meal_index, food_index,
}: {
  food: MenuFood;
  plan_id: string;
  day_index: number;
  meal_index: number;
  food_index: number;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(food.name);
  const [qty, setQty] = useState(String(food.quantity_g));
  const [pending, startTransition] = useTransition();

  function save() {
    const q = parseFloat(qty);
    if (isNaN(q) || q <= 0) { toast.error("Quantité invalide"); return; }
    startTransition(async () => {
      const result = await updateMenuFood(plan_id, day_index, meal_index, food_index, {
        name: name.trim() || undefined,
        quantity_g: q !== food.quantity_g ? q : undefined,
      });
      if (result?.error) { toast.error(result.error); return; }
      setEditing(false);
      router.refresh();
    });
  }

  function cancel() {
    setName(food.name);
    setQty(String(food.quantity_g));
    setEditing(false);
  }

  function remove() {
    startTransition(async () => {
      const result = await deleteMenuFood(plan_id, day_index, meal_index, food_index);
      if (result?.error) { toast.error(result.error); return; }
      router.refresh();
    });
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1.5 py-1">
        <Input
          value={name}
          onChange={e => setName(e.target.value)}
          className="h-7 text-xs flex-1 min-w-0"
        />
        <Input
          value={qty}
          onChange={e => setQty(e.target.value)}
          className="h-7 text-xs w-16 shrink-0"
          type="number"
          min="1"
        />
        <span className="text-xs text-muted-foreground shrink-0">g</span>
        <button onClick={save} disabled={pending} className="text-green-600 hover:text-green-700 shrink-0">
          <Check className="h-3.5 w-3.5" />
        </button>
        <button onClick={cancel} className="text-muted-foreground hover:text-foreground shrink-0">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 group py-0.5">
      <span className="text-sm truncate">{food.name}</span>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-xs text-muted-foreground">
          {food.quantity_g}g{food.weight_note && food.weight_note !== "poids cru" ? ` (${food.weight_note})` : ""} · {Math.round(food.kcal)} kcal
        </span>
        <button
          onClick={() => setEditing(true)}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
        >
          <Pencil className="h-3 w-3" />
        </button>
        <button
          onClick={remove}
          disabled={pending}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-500 transition-opacity"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

// ─── Meal card ────────────────────────────────────────────────────────────────

function MealCard({
  meal, plan_id, day_index, meal_index, meal_date,
}: {
  meal: MenuMeal;
  plan_id: string;
  day_index: number;
  meal_index: number;
  meal_date: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [showExtra, setShowExtra] = useState(false);
  const [logging, startLog] = useTransition();
  const [logged, setLogged] = useState(false);

  function log() {
    startLog(async () => {
      const result = await logMealFromMenu(plan_id, day_index, meal_index, meal_date);
      if (result?.error) { toast.error(result.error); return; }
      setLogged(true);
      toast.success("Repas enregistré dans le journal !");
      router.refresh();
    });
  }

  return (
    <div className={`border rounded-xl overflow-hidden ${logged ? "opacity-60" : ""}`}>
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex flex-col items-start text-left gap-0.5 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold">{MEAL_LABELS[meal.meal_type] ?? meal.meal_type}</span>
            {meal.suggested_time && (
              <span className="text-[11px] text-muted-foreground">({meal.suggested_time})</span>
            )}
            {logged && <Badge variant="secondary" className="text-[10px] py-0">✓ Mangé</Badge>}
          </div>
          <span className="text-xs text-muted-foreground truncate max-w-[200px]">{meal.name}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          <Badge variant="secondary" className="text-xs">{Math.round(meal.total_kcal)} kcal</Badge>
          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          {/* Macros */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-blue-600 font-medium">P {Math.round(meal.total_protein_g)}g</span>
            <span className="text-amber-600 font-medium">G {Math.round(meal.total_carbs_g)}g</span>
            <span className="text-rose-500 font-medium">L {Math.round(meal.total_fat_g)}g</span>
            {meal.total_fiber_g > 0 && <span className="text-green-600 font-medium">F {Math.round(meal.total_fiber_g)}g</span>}
            {meal.prep_minutes > 0 && (
              <span className="text-muted-foreground flex items-center gap-0.5 ml-auto">
                <Clock className="h-3 w-3" />{meal.prep_minutes} min
              </span>
            )}
          </div>

          {/* Food list — editable */}
          <div className="space-y-0.5 border-t pt-2">
            {meal.foods.map((food, fi) => (
              <FoodRow
                key={fi}
                food={food}
                plan_id={plan_id}
                day_index={day_index}
                meal_index={meal_index}
                food_index={fi}
              />
            ))}
          </div>

          {/* Prep notes */}
          {meal.prep_notes && (
            <p className="text-xs text-muted-foreground italic border-t pt-2">{meal.prep_notes}</p>
          )}

          {/* Extra details toggle */}
          {(meal.prep_steps?.length > 0 || meal.meal_reason || meal.substitutions?.length > 0) && (
            <button
              className="text-xs text-primary hover:underline flex items-center gap-1"
              onClick={() => setShowExtra(v => !v)}
            >
              <Info className="h-3 w-3" />
              {showExtra ? "Masquer les détails" : "Étapes · Raison · Substitutions"}
            </button>
          )}

          {showExtra && (
            <div className="space-y-2 border-t pt-2 text-xs text-muted-foreground">
              {meal.prep_steps?.length > 0 && (
                <div>
                  <p className="font-medium text-foreground mb-1">Préparation :</p>
                  <ol className="list-decimal list-inside space-y-0.5">
                    {meal.prep_steps.map((s, i) => <li key={i}>{s}</li>)}
                  </ol>
                </div>
              )}
              {meal.meal_reason && (
                <div>
                  <p className="font-medium text-foreground mb-1">Pourquoi ce repas :</p>
                  <p>{meal.meal_reason}</p>
                </div>
              )}
              {meal.substitutions?.length > 0 && (
                <div>
                  <p className="font-medium text-foreground mb-1">Substitutions :</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {meal.substitutions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Log button */}
          <div className="border-t pt-3">
            <Button
              size="sm"
              variant={logged ? "secondary" : "default"}
              className="w-full"
              disabled={logging || logged}
              onClick={log}
            >
              <UtensilsCrossed className="h-3.5 w-3.5 mr-1.5" />
              {logged ? "Enregistré dans le journal" : "J'ai mangé ce repas"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Supplement card ──────────────────────────────────────────────────────────

function SupplementCard({ s }: { s: SupplementRec }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/40 transition-colors text-left"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Pill className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="text-sm font-medium truncate">{s.name}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${PRIORITY_CLASS[s.priority] ?? PRIORITY_CLASS.facultatif}`}>
            {s.priority}
          </span>
        </div>
        <span className="text-xs text-muted-foreground ml-2 shrink-0">{s.dose}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 pt-1 border-t bg-muted/20 space-y-1">
          <p className="text-xs"><span className="font-medium">Moment :</span> {s.timing}</p>
          <p className="text-xs"><span className="font-medium">Pourquoi :</span> {s.reason}</p>
          {s.precautions && (
            <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded p-1.5 mt-1">
              ⚠️ {s.precautions}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Day view ─────────────────────────────────────────────────────────────────

function DayView({
  day, day_index, plan_id, defaultOpen,
}: {
  day: MenuDay;
  day_index: number;
  plan_id: string;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [showLogic, setShowLogic] = useState(false);

  const totals = day.meals.reduce(
    (acc, m) => ({
      kcal: acc.kcal + m.total_kcal,
      prot: acc.prot + m.total_protein_g,
      carbs: acc.carbs + m.total_carbs_g,
      fat: acc.fat + m.total_fat_g,
    }),
    { kcal: 0, prot: 0, carbs: 0, fat: 0 }
  );

  const dateLabel = new Date(day.date + "T12:00:00").toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long",
  });

  const today = new Date().toISOString().split("T")[0];
  const isToday = day.date === today;

  return (
    <div className="border rounded-2xl overflow-hidden">
      {/* Day header */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex items-center gap-2 text-left">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold capitalize text-sm">{dateLabel}</span>
              {isToday && <Badge className="text-[10px] py-0 px-1.5">Aujourd'hui</Badge>}
              <span className="text-[11px] text-muted-foreground">{day.is_training_day ? "🏋️ entraînement" : "😴 repos"}</span>
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
              <span>{Math.round(totals.kcal)} kcal</span>
              <span className="text-blue-600">{Math.round(totals.prot)}g P</span>
              <span className="text-amber-600">{Math.round(totals.carbs)}g G</span>
              <span className="text-rose-500">{Math.round(totals.fat)}g L</span>
            </div>
          </div>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>

      {open && (
        <div className="p-4 space-y-3">
          {/* Meals */}
          {day.meals.map((meal, mi) => (
            <MealCard
              key={mi}
              meal={meal}
              plan_id={plan_id}
              day_index={day_index}
              meal_index={mi}
              meal_date={day.date}
            />
          ))}

          {/* Hydration */}
          {day.hydration_notes && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground border rounded-lg px-3 py-2">
              <Droplets className="h-3.5 w-3.5 shrink-0 text-blue-400 mt-0.5" />
              <span>{day.hydration_notes}</span>
            </div>
          )}

          {/* Supplements */}
          {day.supplements?.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide px-1">
                💊 Compléments recommandés
              </p>
              {day.supplements.map((s, i) => <SupplementCard key={i} s={s} />)}
            </div>
          )}

          {/* Daily logic */}
          {day.daily_logic && (
            <div>
              <button
                className="text-xs text-primary hover:underline flex items-center gap-1 px-1"
                onClick={() => setShowLogic(v => !v)}
              >
                <Info className="h-3 w-3" />
                Pourquoi ce menu correspond à votre objectif
              </button>
              {showLogic && (
                <p className="text-xs text-muted-foreground mt-2 border-l-2 border-primary/30 pl-3">
                  {day.daily_logic}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MenuPlanView({ plan_id, days }: { plan_id: string; days: MenuDay[] }) {
  const today = new Date().toISOString().split("T")[0];
  const todayIndex = days.findIndex(d => d.date === today);

  return (
    <div className="space-y-3">
      {days.map((day, i) => (
        <DayView
          key={day.date}
          day={day}
          day_index={i}
          plan_id={plan_id}
          defaultOpen={i === (todayIndex >= 0 ? todayIndex : 0)}
        />
      ))}
    </div>
  );
}
