"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  nutritionTargetsSchema,
  addMealItemSchema,
  createFoodItemSchema,
} from "@/lib/validations/nutrition";

export async function saveNutritionTargets(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = nutritionTargetsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase
    .from("nutrition_targets")
    .insert({ ...parsed.data, user_id: user.id, effective_from: new Date().toISOString().split("T")[0] });

  if (error) return { error: error.message };

  revalidatePath("/nutrition");
  return { success: true };
}

export async function addMealItem(data: {
  meal_date: string;
  meal_type: string;
  food_item_id: string;
  quantity_g: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const parsed = addMealItemSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // Find or create meal for this date/type
  let meal_id: string;
  const { data: existingMeal } = await supabase
    .from("meals")
    .select("id")
    .eq("user_id", user.id)
    .eq("meal_date", parsed.data.meal_date)
    .eq("meal_type", parsed.data.meal_type)
    .single();

  if (existingMeal) {
    meal_id = existingMeal.id;
  } else {
    const { data: newMeal, error: mealError } = await supabase
      .from("meals")
      .insert({
        user_id: user.id,
        meal_date: parsed.data.meal_date,
        meal_type: parsed.data.meal_type,
        logged_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (mealError || !newMeal) return { error: mealError?.message ?? "Erreur création repas" };
    meal_id = newMeal.id;
  }

  const { error } = await supabase
    .from("meal_items")
    .insert({ meal_id, food_item_id: parsed.data.food_item_id, quantity_g: parsed.data.quantity_g });

  if (error) return { error: error.message };

  revalidatePath("/nutrition");
  return { success: true };
}

export async function deleteMealItem(meal_item_id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  // Verify ownership via join
  const { data: item } = await supabase
    .from("meal_items")
    .select("id, meals(user_id)")
    .eq("id", meal_item_id)
    .single();

  if (!item || (item.meals as any)?.user_id !== user.id) return { error: "Non autorisé" };

  await supabase.from("meal_items").delete().eq("id", meal_item_id);

  revalidatePath("/nutrition");
  return { success: true };
}

export async function createCustomFood(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = createFoodItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase
    .from("food_items")
    .insert({ ...parsed.data, user_id: user.id });

  if (error) return { error: error.message };

  revalidatePath("/nutrition");
  return { success: true };
}
