"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateMenu, type MenuDay } from "@/lib/ai/menu-generator";

// ─── Generate + save ──────────────────────────────────────────────────────────

export interface GenerateParams {
  days: number;
  extra_exclusions?: string;  // ex: "brocoli, saumon"
  extra_inclusions?: string;  // ex: "inclure du riz basmati, du poulet"
  style_notes?: string;       // ex: "repas simples et rapides"
}

export async function generateAndSaveMenu(params: GenerateParams) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const today = new Date().toISOString().split("T")[0];

  const [
    { data: profile },
    { data: goal },
    { data: settings },
    { data: target },
    { data: supplements },
    { data: session_today },
    { data: latest_measurement },
  ] = await Promise.all([
    supabase.from("profiles").select("first_name, birth_date, sex, height_cm").eq("id", user.id).single(),
    supabase.from("goals").select("primary_goal, weekly_sessions_target, max_session_minutes").eq("user_id", user.id).eq("is_active", true).single(),
    supabase.from("user_settings").select("diet_type, allergies, intolerances, refused_foods, preferred_meals_count, cooking_time_minutes, cooking_budget_level, declared_treatments, voluntary_health_notes, past_injuries, joint_limitations, average_sleep_quality, average_stress, average_energy").eq("user_id", user.id).single(),
    supabase.from("nutrition_targets").select("calories_kcal, protein_g, carbs_g, fat_g, fiber_g, water_ml").eq("user_id", user.id).lte("effective_from", today).order("effective_from", { ascending: false }).limit(1).single(),
    supabase.from("supplements").select("name, type, dosage, unit, timing").eq("user_id", user.id).eq("is_active", true),
    supabase.from("workout_sessions").select("id, started_at").eq("user_id", user.id).in("status", ["in_progress", "completed", "planned"]).gte("started_at", `${today}T00:00:00`).limit(1).single(),
    supabase.from("body_measurements").select("weight_kg, body_fat_pct").eq("user_id", user.id).order("measured_at", { ascending: false }).limit(1).single(),
  ]);

  if (!target) return { error: "Définis d'abord tes objectifs nutritionnels." };

  let trainingTime: string | null = null;
  if (session_today?.started_at) {
    const d = new Date(session_today.started_at);
    trainingTime = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  // Build refused list including extra_exclusions
  const allRefused = [
    ...(settings?.refused_foods ?? []),
    ...(params.extra_exclusions ? params.extra_exclusions.split(",").map(s => s.trim()).filter(Boolean) : []),
  ];

  let menuDays: MenuDay[];
  try {
    console.log("[menu] Génération IA démarrée, jours:", params.days);
    menuDays = await generateMenu({
      first_name: profile?.first_name ?? "toi",
      birth_date: profile?.birth_date ?? null,
      sex: profile?.sex ?? null,
      height_cm: profile?.height_cm ?? null,
      weight_kg: latest_measurement?.weight_kg ?? null,
      body_fat_pct: latest_measurement?.body_fat_pct ?? null,
      primary_goal: goal?.primary_goal ?? "maintain",
      weekly_sessions: goal?.weekly_sessions_target ?? null,
      max_session_minutes: goal?.max_session_minutes ?? null,
      training_days_today: !!session_today,
      training_time_today: trainingTime,
      average_sleep_quality: settings?.average_sleep_quality ?? null,
      average_stress: settings?.average_stress ?? null,
      average_energy: settings?.average_energy ?? null,
      declared_treatments: settings?.declared_treatments ?? null,
      voluntary_health_notes: settings?.voluntary_health_notes ?? null,
      past_injuries: settings?.past_injuries ?? null,
      joint_limitations: settings?.joint_limitations ?? null,
      diet_type: settings?.diet_type ?? null,
      allergies: settings?.allergies ?? [],
      intolerances: settings?.intolerances ?? [],
      refused_foods: allRefused,
      preferred_meals_count: settings?.preferred_meals_count ?? 4,
      cooking_time_minutes: settings?.cooking_time_minutes ?? null,
      cooking_budget_level: settings?.cooking_budget_level ?? null,
      calories_kcal: target.calories_kcal,
      protein_g: target.protein_g,
      carbs_g: target.carbs_g,
      fat_g: target.fat_g,
      fiber_g: target.fiber_g ?? null,
      water_ml: target.water_ml ?? null,
      supplements: supplements ?? [],
      days: params.days,
      extra_inclusions: params.extra_inclusions ?? null,
      style_notes: params.style_notes ?? null,
    });
  } catch (err: any) {
    console.error("[menu] Erreur génération:", err);
    return { error: err.message ?? "Erreur lors de la génération du menu" };
  }

  // Deactivate old plans
  await supabase.from("menu_plans").update({ is_active: false }).eq("user_id", user.id);

  // Save new plan
  const { data: plan, error: saveErr } = await supabase.from("menu_plans").insert({
    user_id: user.id,
    parameters: params as unknown as any,
    days: menuDays as unknown as any,
    is_active: true,
  }).select("id").single();

  if (saveErr) return { error: "Erreur sauvegarde du menu" };

  console.log("[menu] Sauvegardé, plan id:", plan.id, "jours:", menuDays.length);
  revalidatePath("/nutrition/menu");
  return { success: true, plan_id: plan.id };
}

// ─── Update a single food item in a stored plan ───────────────────────────────

export async function updateMenuFood(
  plan_id: string,
  day_index: number,
  meal_index: number,
  food_index: number,
  updates: { name?: string; quantity_g?: number }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { data: plan } = await supabase.from("menu_plans").select("days").eq("id", plan_id).eq("user_id", user.id).single();
  if (!plan) return { error: "Menu introuvable" };

  const days = plan.days as unknown as MenuDay[];
  const food = days[day_index]?.meals[meal_index]?.foods[food_index];
  if (!food) return { error: "Aliment introuvable" };

  // Update name and/or quantity, recalculate macros proportionally if quantity changed
  if (updates.name) food.name = updates.name;
  if (updates.quantity_g && food.quantity_g > 0) {
    const ratio = updates.quantity_g / food.quantity_g;
    food.kcal = Math.round(food.kcal * ratio);
    food.protein_g = Math.round(food.protein_g * ratio * 10) / 10;
    food.carbs_g = Math.round(food.carbs_g * ratio * 10) / 10;
    food.fat_g = Math.round(food.fat_g * ratio * 10) / 10;
    food.fiber_g = Math.round(food.fiber_g * ratio * 10) / 10;
    food.quantity_g = updates.quantity_g;
  }

  // Recalculate meal totals
  const meal = days[day_index].meals[meal_index];
  meal.total_kcal = Math.round(meal.foods.reduce((s, f) => s + f.kcal, 0));
  meal.total_protein_g = Math.round(meal.foods.reduce((s, f) => s + f.protein_g, 0) * 10) / 10;
  meal.total_carbs_g = Math.round(meal.foods.reduce((s, f) => s + f.carbs_g, 0) * 10) / 10;
  meal.total_fat_g = Math.round(meal.foods.reduce((s, f) => s + f.fat_g, 0) * 10) / 10;
  meal.total_fiber_g = Math.round(meal.foods.reduce((s, f) => s + f.fiber_g, 0) * 10) / 10;

  await supabase.from("menu_plans").update({ days: days as unknown as any, updated_at: new Date().toISOString() }).eq("id", plan_id);
  revalidatePath("/nutrition/menu");
  return { success: true };
}

// ─── Log a full meal from the menu into the journal ───────────────────────────

export async function logMealFromMenu(
  plan_id: string,
  day_index: number,
  meal_index: number,
  meal_date: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { data: plan } = await supabase.from("menu_plans").select("days").eq("id", plan_id).eq("user_id", user.id).single();
  if (!plan) return { error: "Menu introuvable" };

  const days = plan.days as unknown as MenuDay[];
  const meal = days[day_index]?.meals[meal_index];
  if (!meal) return { error: "Repas introuvable" };

  // Find or create meal entry in journal
  const { data: existing } = await supabase.from("meals").select("id").eq("user_id", user.id).eq("meal_date", meal_date).eq("meal_type", meal.meal_type as any).single();

  let meal_id: string;
  if (existing) {
    meal_id = existing.id;
  } else {
    const { data: newMeal, error: mealErr } = await supabase.from("meals").insert({
      user_id: user.id,
      meal_date,
      meal_type: meal.meal_type as any,
      source: "menu_plan",
    }).select("id").single();
    if (mealErr || !newMeal) return { error: "Impossible de créer le repas" };
    meal_id = newMeal.id;
  }

  // For each food, find or create food_item, then insert meal_item
  for (const food of meal.foods) {
    // Try to find an existing food item by name (case-insensitive)
    const { data: existing_food } = await supabase
      .from("food_items")
      .select("id, calories_kcal_per_100g")
      .ilike("name", food.name)
      .limit(1)
      .single();

    let food_item_id: string;

    if (existing_food) {
      food_item_id = existing_food.id;
    } else {
      // Create a custom food item
      const per100 = food.quantity_g > 0 ? (100 / food.quantity_g) : 1;
      const { data: new_food, error: foodErr } = await supabase.from("food_items").insert({
        user_id: user.id,
        name: food.name,
        calories_kcal_per_100g: Math.round(food.kcal * per100 * 100) / 100,
        protein_g_per_100g: Math.round(food.protein_g * per100 * 100) / 100,
        carbs_g_per_100g: Math.round(food.carbs_g * per100 * 100) / 100,
        fat_g_per_100g: Math.round(food.fat_g * per100 * 100) / 100,
        fiber_g_per_100g: food.fiber_g > 0 ? Math.round(food.fiber_g * per100 * 100) / 100 : null,
      }).select("id").single();
      if (foodErr || !new_food) continue;
      food_item_id = new_food.id;
    }

    await supabase.from("meal_items").insert({
      meal_id,
      food_item_id,
      quantity_g: food.quantity_g,
    });
  }

  revalidatePath("/nutrition");
  revalidatePath("/nutrition/menu");
  return { success: true };
}

// ─── Delete a food from a meal ────────────────────────────────────────────────

export async function deleteMenuFood(
  plan_id: string,
  day_index: number,
  meal_index: number,
  food_index: number
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { data: plan } = await supabase.from("menu_plans").select("days").eq("id", plan_id).eq("user_id", user.id).single();
  if (!plan) return { error: "Menu introuvable" };

  const days = plan.days as unknown as MenuDay[];
  const meal = days[day_index]?.meals[meal_index];
  if (!meal) return { error: "Repas introuvable" };

  meal.foods.splice(food_index, 1);
  meal.total_kcal = Math.round(meal.foods.reduce((s, f) => s + f.kcal, 0));
  meal.total_protein_g = Math.round(meal.foods.reduce((s, f) => s + f.protein_g, 0) * 10) / 10;
  meal.total_carbs_g = Math.round(meal.foods.reduce((s, f) => s + f.carbs_g, 0) * 10) / 10;
  meal.total_fat_g = Math.round(meal.foods.reduce((s, f) => s + f.fat_g, 0) * 10) / 10;
  meal.total_fiber_g = Math.round(meal.foods.reduce((s, f) => s + f.fiber_g, 0) * 10) / 10;

  await supabase.from("menu_plans").update({ days: days as unknown as any, updated_at: new Date().toISOString() }).eq("id", plan_id);
  revalidatePath("/nutrition/menu");
  return { success: true };
}
